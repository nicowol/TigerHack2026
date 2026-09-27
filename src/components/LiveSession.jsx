import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'
import { useEffect, useRef, useState } from 'react'
import { assessStretchForm, getFormRule } from '../data/formAssessment.js'
import { stretches } from '../data/stretches.js'
import { Page } from './PageLayout.jsx'
import PlaylistPlanner from './PlaylistPlanner.jsx'

const stretchById = new Map(stretches.map((stretch) => [stretch.id, stretch]))
const fallbackStretch = stretches[0]

function formatClock(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

const MEDIAPIPE_VERSION = '1.0.1'
const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`
const POSE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
const POSE_CONNECTIONS = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
]

function isVisible(landmark, threshold = 0.4) {
  if (!Number.isFinite(landmark?.x) || !Number.isFinite(landmark?.y)) return false
  return (landmark.visibility ?? landmark.presence ?? 1) >= threshold
}

function drawPose(canvas, video, landmarks) {
  const width = video.videoWidth || 640
  const height = video.videoHeight || 480
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  const context = canvas.getContext('2d')
  if (!context) return 0
  context.clearRect(0, 0, width, height)
  if (!landmarks) return 0

  const visibleBodyPoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28].filter((index) =>
    isVisible(landmarks[index]),
  )

  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.lineWidth = Math.max(3, width / 240)
  context.strokeStyle = 'rgba(215, 167, 189, 0.98)'
  context.shadowColor = 'rgba(215, 167, 189, 0.8)'
  context.shadowBlur = 12

  for (const [start, end] of POSE_CONNECTIONS) {
    const first = landmarks[start]
    const second = landmarks[end]
    if (!isVisible(first) || !isVisible(second)) continue
    context.beginPath()
    context.moveTo(first.x * width, first.y * height)
    context.lineTo(second.x * width, second.y * height)
    context.stroke()
  }

  context.shadowBlur = 0
  context.fillStyle = 'rgba(255, 224, 141, 0.98)'
  for (const landmark of landmarks) {
    if (!isVisible(landmark)) continue
    context.beginPath()
    context.arc(landmark.x * width, landmark.y * height, Math.max(4, width / 180), 0, 2 * Math.PI)
    context.fill()
  }

  return visibleBodyPoints.length
}

function cameraErrorMessage(error) {
  if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') {
    return 'Allow camera access in your browser, then try again.'
  }
  if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
    return 'No camera was found on this device.'
  }
  if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
    return 'The camera is busy in another app. Close that app and try again.'
  }
  return error?.message || 'The camera could not start. Please try again.'
}

export default function LiveSession({
  queue,
  onQueueChange,
  presets,
  onSavePreset,
  onCompleteStretch,
  onClearQueue,
  chimesMuted,
  onChimesMutedChange,
  onStop,
  onFindRelief,
}) {
  const [plannerOpen, setPlannerOpen] = useState(true)
  const [sessionItems, setSessionItems] = useState([])
  const [sessionActive, setSessionActive] = useState(false)
  const [sessionFinished, setSessionFinished] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState('stretch')
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [confirmStop, setConfirmStop] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [cameraState, setCameraState] = useState('idle')
  const [cameraError, setCameraError] = useState('')
  const [poseDetected, setPoseDetected] = useState(false)
  const [poseQuality, setPoseQuality] = useState('missing')
  const [formAssessment, setFormAssessment] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const poseLandmarkerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const cameraRequestIdRef = useRef(0)
  const lastVideoTimeRef = useRef(-1)
  const lastInferenceAtRef = useRef(0)
  const poseDetectedRef = useRef(false)
  const poseQualityRef = useRef('missing')
  const formAssessmentRef = useRef(null)
  const assessmentCandidateRef = useRef({ key: '', count: 0, value: null })
  const audioContextRef = useRef(null)
  const transitionRef = useRef(false)
  const timerActionsRef = useRef(null)
  const activeItem = sessionActive
    ? sessionItems[currentIndex]
    : sessionFinished
      ? sessionItems[sessionItems.length - 1]
      : queue.find((entry) => stretchById.has(entry.stretchId))
  const stretch = stretchById.get(activeItem?.stretchId) ?? fallbackStretch
  const stretchDuration = activeItem?.durationSeconds ?? stretch.duration
  const breakDuration = activeItem?.breakAfterSeconds ?? 0
  const phaseDuration = phase === 'break' ? breakDuration : stretchDuration
  const stretchIdRef = useRef(stretch.id)
  stretchIdRef.current = stretch.id

  useEffect(() => {
    if (!sessionActive && !sessionFinished) {
      setSeconds(activeItem?.durationSeconds ?? stretch.duration)
      setPhase('stretch')
      setIsRunning(false)
    }
  }, [
    activeItem?.durationSeconds,
    activeItem?.stretchId,
    sessionActive,
    sessionFinished,
    stretch.duration,
  ])

  useEffect(() => {
    formAssessmentRef.current = null
    assessmentCandidateRef.current = { key: '', count: 0, value: null }
    setFormAssessment(null)
  }, [stretch.id])

  useEffect(() => {
    if (!isRunning || seconds <= 0) return
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [isRunning, seconds])

  useEffect(() => {
    if (sessionActive && seconds === 0) timerActionsRef.current?.advance()
  }, [seconds, sessionActive])

  function updatePoseDetected(nextValue) {
    if (poseDetectedRef.current === nextValue) return
    poseDetectedRef.current = nextValue
    setPoseDetected(nextValue)
  }

  function updatePoseQuality(nextValue) {
    if (poseQualityRef.current === nextValue) return
    poseQualityRef.current = nextValue
    setPoseQuality(nextValue)
  }

  function updateFormAssessment(nextValue) {
    if (!nextValue) {
      assessmentCandidateRef.current = { key: '', count: 0, value: null }
      if (formAssessmentRef.current !== null) {
        formAssessmentRef.current = null
        setFormAssessment(null)
      }
      return
    }

    const key = `${nextValue.status}|${nextValue.message}|${nextValue.cameraTip ?? ''}`
    const candidate = assessmentCandidateRef.current
    if (candidate.key === key) {
      candidate.count += 1
    } else {
      assessmentCandidateRef.current = { key, count: 1, value: nextValue }
      return
    }

    if (candidate.count < 3 || formAssessmentRef.current?.key === key) return
    const stabilized = { ...candidate.value, key }
    formAssessmentRef.current = stabilized
    setFormAssessment(stabilized)
  }

  function releaseCameraResources(updateState = true) {
    cameraRequestIdRef.current += 1
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }
    poseLandmarkerRef.current?.close()
    poseLandmarkerRef.current = null
    lastVideoTimeRef.current = -1
    lastInferenceAtRef.current = 0
    poseDetectedRef.current = false
    poseQualityRef.current = 'missing'
    formAssessmentRef.current = null
    assessmentCandidateRef.current = { key: '', count: 0, value: null }
    if (updateState) {
      setPoseDetected(false)
      setPoseQuality('missing')
      setFormAssessment(null)
    }

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height)
  }

  useEffect(
    () => () => {
      releaseCameraResources(false)
    },
    [],
  )

  async function enableCamera() {
    if (cameraState === 'starting' || cameraState === 'active') return
    setCameraError('')
    setCameraState('starting')
    const requestId = cameraRequestIdRef.current + 1
    cameraRequestIdRef.current = requestId

    let stream
    let newLandmarker
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access requires localhost or a secure HTTPS connection.')
      }

      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (requestId !== cameraRequestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream
      const video = videoRef.current
      if (!video) throw new Error('The camera preview is unavailable.')
      video.srcObject = stream
      await video.play()

      const vision = await FilesetResolver.forVisionTasks(WASM_URL)
      newLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: POSE_MODEL_URL },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      if (requestId !== cameraRequestIdRef.current) {
        newLandmarker.close()
        return
      }

      poseLandmarkerRef.current = newLandmarker
      setCameraState('active')

      const detectFrame = () => {
        const currentVideo = videoRef.current
        const landmarker = poseLandmarkerRef.current
        if (requestId !== cameraRequestIdRef.current || !currentVideo || !landmarker) return

        const now = performance.now()
        const hasNewFrame =
          currentVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
          currentVideo.currentTime !== lastVideoTimeRef.current &&
          now - lastInferenceAtRef.current >= 80

        if (hasNewFrame) {
          try {
            const result = landmarker.detectForVideo(currentVideo, now)
            const landmarks = result.landmarks?.[0]
            const visiblePointCount = drawPose(canvasRef.current, currentVideo, landmarks)
            const foundPose = visiblePointCount >= 3
            const nextPoseQuality =
              visiblePointCount >= 10 ? 'ready' : visiblePointCount >= 3 ? 'partial' : 'missing'
            updatePoseDetected(foundPose)
            updatePoseQuality(nextPoseQuality)
            updateFormAssessment(
              foundPose && landmarks
                ? assessStretchForm(
                    stretchIdRef.current,
                    landmarks,
                    currentVideo.videoWidth / currentVideo.videoHeight || 16 / 9,
                  )
                : null,
            )
            lastVideoTimeRef.current = currentVideo.currentTime
            lastInferenceAtRef.current = now
          } catch (error) {
            if (requestId === cameraRequestIdRef.current) {
              releaseCameraResources()
              setCameraState('error')
              setCameraError(cameraErrorMessage(error))
            }
            return
          }
        }

        animationFrameRef.current = window.requestAnimationFrame(detectFrame)
      }

      animationFrameRef.current = window.requestAnimationFrame(detectFrame)
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop())
      newLandmarker?.close()
      if (requestId === cameraRequestIdRef.current) {
        releaseCameraResources()
        setCameraState('error')
        setCameraError(cameraErrorMessage(error))
      }
    }
  }

  function disableCamera() {
    releaseCameraResources()
    setCameraState('idle')
    setCameraError('')
  }

  function playChime(notes) {
    if (chimesMuted) return
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) return
      const context = audioContextRef.current ?? new AudioContextClass()
      audioContextRef.current = context
      if (context.state === 'suspended') void context.resume()
      const startAt = context.currentTime + 0.035
      notes.forEach(({ frequency, offset, length, volume = 0.07, type = 'sine' }) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = type
        oscillator.frequency.value = frequency
        oscillator.detune.value = offset % 2 ? -3 : 3
        gain.gain.setValueAtTime(0.0001, startAt + offset)
        gain.gain.exponentialRampToValueAtTime(volume, startAt + offset + 0.025)
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + offset + length)
        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.start(startAt + offset)
        oscillator.stop(startAt + offset + length + 0.04)
      })
    } catch {
      // Sound is a small enhancement; timers should continue if audio is unavailable.
    }
  }

  function playStretchChime() {
    // F5, C6, A6: a light arpeggio with a bright upper sparkle.
    playChime([
      { frequency: 698.46, offset: 0, length: 0.42, type: 'triangle' },
      { frequency: 1046.5, offset: 0.11, length: 0.46 },
      { frequency: 1760, offset: 0.23, length: 0.62, volume: 0.045 },
    ])
  }

  function playSetChime() {
    // A soft F major ninth resolution: F, A, C, E, G.
    playChime([
      { frequency: 349.23, offset: 0, length: 0.9, volume: 0.065, type: 'triangle' },
      { frequency: 440, offset: 0.035, length: 0.9, volume: 0.052 },
      { frequency: 523.25, offset: 0.07, length: 0.85, volume: 0.05 },
      { frequency: 659.25, offset: 0.12, length: 0.82, volume: 0.042 },
      { frequency: 783.99, offset: 0.2, length: 0.75, volume: 0.032 },
    ])
  }

  function goToNextStretch(index) {
    if (index >= sessionItems.length) {
      setIsRunning(false)
      setSessionActive(false)
      setSessionFinished(true)
      setShowCompletion(true)
      releaseCameraResources(false)
      setCameraState('idle')
      window.setTimeout(playSetChime, 450)
      return
    }
    transitionRef.current = false
    setCurrentIndex(index)
    setPhase('stretch')
    setSeconds(
      sessionItems[index].durationSeconds ??
        stretchById.get(sessionItems[index].stretchId)?.duration ??
        30,
    )
    setIsRunning(true)
  }

  function finishCurrentStretch(withChime = true) {
    const item = sessionItems[currentIndex]
    if (!item) return
    transitionRef.current = true
    onCompleteStretch(item.stretchId, withChime)
    if (withChime) playStretchChime()
    if (currentIndex >= sessionItems.length - 1) {
      setIsRunning(false)
      setSessionActive(false)
      setSessionFinished(true)
      setShowCompletion(true)
      releaseCameraResources(false)
      setCameraState('idle')
      window.setTimeout(playSetChime, withChime ? 450 : 0)
      return
    }
    if (item.breakAfterSeconds > 0 && withChime) {
      setPhase('break')
      setSeconds(item.breakAfterSeconds)
      setIsRunning(true)
      transitionRef.current = false
      return
    }
    goToNextStretch(currentIndex + 1)
  }

  timerActionsRef.current = {
    advance() {
      if (!sessionActive || transitionRef.current) return
      transitionRef.current = true
      if (phase === 'break') goToNextStretch(currentIndex + 1)
      else finishCurrentStretch(true)
    },
  }

  function startSet() {
    const items = queue.filter((entry) => stretchById.has(entry.stretchId))
    if (!items.length) return
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (AudioContextClass && !audioContextRef.current)
        audioContextRef.current = new AudioContextClass()
    } catch {
      // Continue without chimes if the browser does not provide Web Audio.
    }
    if (audioContextRef.current?.state === 'suspended') void audioContextRef.current.resume()
    setSessionItems(items.map((entry) => ({ ...entry })))
    setCurrentIndex(0)
    setPhase('stretch')
    setSeconds(items[0].durationSeconds ?? stretchById.get(items[0].stretchId).duration)
    setShowCompletion(false)
    setSessionFinished(false)
    transitionRef.current = false
    setSessionActive(true)
    setIsRunning(true)
    setPlannerOpen(false)
  }

  function toggleSession() {
    if (!sessionActive || seconds === 0) return
    setIsRunning((current) => !current)
  }

  function restartTimer() {
    setSeconds(phaseDuration)
    transitionRef.current = false
    setIsRunning(true)
  }

  function skipCurrent() {
    if (!sessionActive) return
    if (phase === 'stretch') finishCurrentStretch(false)
    else goToNextStretch(currentIndex + 1)
  }

  function stop() {
    setConfirmStop(false)
    releaseCameraResources()
    onStop()
  }

  function openPlanner() {
    if (sessionActive) setIsRunning(false)
    setPlannerOpen(true)
  }

  const formRule = getFormRule(stretch.id)
  const activeAssessment = cameraState === 'active' && poseDetected ? formAssessment : null
  const cameraFeedbackState =
    cameraState !== 'active'
      ? 'off'
      : !poseDetected
        ? 'missing'
        : !formRule
          ? poseQuality === 'ready'
            ? 'ready'
            : 'partial'
          : !activeAssessment || activeAssessment.status !== 'pass'
            ? 'partial'
            : 'ready'
  const formTitle =
    cameraState === 'starting'
      ? 'Connecting camera'
      : cameraState === 'error'
        ? 'Camera unavailable'
        : cameraState !== 'active'
          ? 'Session ready'
          : !poseDetected
            ? 'Searching for pose'
            : !formRule
              ? 'Pose tracking only'
              : !activeAssessment
                ? 'Reading visible cues…'
                : activeAssessment.status === 'pass'
                  ? 'Looks on track · demo'
                  : activeAssessment.status === 'adjust'
                    ? 'Try this adjustment'
                    : activeAssessment.status === 'unknown'
                      ? 'Can’t assess this cue'
                      : 'Pose tracking only'
  const formHint =
    cameraState === 'starting'
      ? 'Allow camera access while the pose model loads.'
      : cameraState === 'error'
        ? cameraError
        : cameraState !== 'active'
          ? 'Enable the camera to see your pose on screen.'
          : !poseDetected
            ? `${formRule ? `${formRule.cameraTip} ` : ''}Step back until the needed joints are visible.`
            : !formRule
              ? 'No demo check is configured for this stretch. Follow its written cues.'
              : activeAssessment
                ? `${activeAssessment.cameraTip} ${activeAssessment.message}`
                : `${formRule.cameraTip} Hold steady briefly while the pose is read.`
  const formStatusClass =
    cameraState === 'error' || cameraFeedbackState === 'missing'
      ? ' form-error'
      : cameraFeedbackState === 'partial'
        ? ' form-warning'
        : activeAssessment?.status === 'tracking-only'
          ? ' form-neutral'
          : ''
  const formStatusIcon =
    cameraState === 'error' || cameraFeedbackState === 'missing'
      ? '!'
      : cameraFeedbackState === 'partial'
        ? '⌁'
        : activeAssessment?.status === 'tracking-only'
          ? '•'
          : '✓'
  const cameraGlowClass = cameraFeedbackState === 'off' ? '' : ` pose-glow-${cameraFeedbackState}`
  const poseStatusLabel =
    cameraFeedbackState === 'ready'
      ? formRule
        ? 'Pose and form on track'
        : 'Full pose detected'
      : cameraFeedbackState === 'partial'
        ? activeAssessment?.status === 'adjust'
          ? 'Pose detected · adjust form'
          : 'Pose found · hold steady'
        : 'No pose detected'
  const totalSessionSeconds = sessionItems.reduce(
    (total, item, index) =>
      total +
      (item.durationSeconds ?? stretchById.get(item.stretchId)?.duration ?? 0) +
      (index < sessionItems.length - 1 ? (item.breakAfterSeconds ?? 0) : 0),
    0,
  )
  const elapsedBeforeCurrent = sessionItems
    .slice(0, currentIndex)
    .reduce(
      (total, item) =>
        total +
        (item.durationSeconds ?? stretchById.get(item.stretchId)?.duration ?? 0) +
        (item.breakAfterSeconds ?? 0),
      0,
    )
  const elapsedCurrent =
    phase === 'break'
      ? stretchDuration + Math.max(0, breakDuration - seconds)
      : Math.max(0, stretchDuration - seconds)
  const globalProgress = sessionFinished
    ? 100
    : sessionActive && totalSessionSeconds
      ? Math.min(100, ((elapsedBeforeCurrent + elapsedCurrent) / totalSessionSeconds) * 100)
      : 0
  const upcomingItem =
    phase === 'break' ? sessionItems[currentIndex + 1] : sessionItems[currentIndex + 1]
  const upcomingMessage = sessionActive
    ? phase === 'break'
      ? upcomingItem
        ? `Next: ${stretchById.get(upcomingItem.stretchId)?.name ?? 'Next stretch'}`
        : 'Your set is almost complete'
      : breakDuration > 0 && currentIndex < sessionItems.length - 1
        ? `Breathing break · ${breakDuration} sec`
        : upcomingItem
          ? (stretchById.get(upcomingItem.stretchId)?.name ?? 'Next stretch')
          : 'Final stretch in your set'
    : sessionFinished
      ? 'Set complete · add another flow when you are ready'
      : queue.length
        ? `${queue.length} stretch${queue.length === 1 ? '' : 'es'} ready to plan`
        : 'Add a stretch to get started'

  return (
    <Page
      eyebrow="YOUR LIVE FLOW / 03"
      title="Your stretch flow."
      subtitle="Ease into each movement. Let your breath set the pace."
    >
      <section className="playlist-progress-card" aria-label="Playlist progress">
        <div className="playlist-progress-labels">
          <span>
            {sessionActive
              ? `STRETCH ${currentIndex + 1} OF ${sessionItems.length}`
              : sessionFinished
                ? 'SET COMPLETE'
                : 'FLOW PROGRESS'}
          </span>
          <strong>{Math.round(globalProgress)}%</strong>
        </div>
        <div className="playlist-progress-track">
          <i style={{ width: `${globalProgress}%` }} />
        </div>
      </section>
      <section
        className={`up-next-card${phase === 'break' && sessionActive ? ' is-break' : ''}`}
        aria-live="polite"
      >
        <span className="up-next-icon">{phase === 'break' && sessionActive ? '☼' : '↗'}</span>
        <div>
          <small>{phase === 'break' && sessionActive ? 'TAKE A BREATH' : 'UP NEXT'}</small>
          <strong>{upcomingMessage}</strong>
        </div>
        <button className="secondary" onClick={openPlanner}>
          Edit flow
        </button>
      </section>
      <div className="live-grid">
        <section className="card camera-card">
          <div
            className={`camera${cameraState === 'active' ? ' camera-active' : ''}${cameraGlowClass}`}
          >
            <video ref={videoRef} autoPlay muted playsInline aria-label="Live camera preview" />
            <canvas ref={canvasRef} className="pose-canvas" aria-hidden="true" />
            <div className="camera-grid" />
            {cameraState === 'active' && (
              <div className={`pose-indicator pose-${cameraFeedbackState}`} role="status">
                <i />
                {poseStatusLabel}
              </div>
            )}
            {cameraState !== 'active' ? (
              <div className="camera-prompt">
                <p>
                  {cameraState === 'starting'
                    ? 'Starting the camera and pose model…'
                    : cameraState === 'error'
                      ? 'Camera unavailable. Use the control below to try again.'
                      : 'Camera is off. Use the control below to begin.'}
                </p>
              </div>
            ) : null}
            <div className="camera-caption">
              <span>
                <small>{phase === 'break' && sessionActive ? 'COMING UP' : 'CURRENT FLOW'}</small>
                {phase === 'break' && sessionActive
                  ? (stretchById.get(sessionItems[currentIndex + 1]?.stretchId)?.name ??
                    'Set complete')
                  : stretch.name}
              </span>
              <span>
                <small>MOVEMENT DETECTION</small>
                {cameraState === 'active'
                  ? cameraFeedbackState === 'ready'
                    ? '● POSE READY'
                    : cameraFeedbackState === 'partial'
                      ? '● ALMOST THERE'
                      : '● FINDING POSE'
                  : cameraState === 'starting'
                    ? '● LOADING MODEL'
                    : '○ CAMERA OFF'}
              </span>
            </div>
          </div>
          <div className="camera-toolbar">
            <div className="camera-control-copy">
              <p className="privacy">◇ Camera and pose processing stay on this device.</p>
              {cameraError && <small role="alert">{cameraError}</small>}
            </div>
            <button
              className={`camera-toggle${cameraState === 'active' ? ' camera-toggle-off' : ''}`}
              onClick={cameraState === 'active' ? disableCamera : enableCamera}
              disabled={cameraState === 'starting'}
            >
              {cameraState === 'starting'
                ? '◌ Connecting…'
                : cameraState === 'active'
                  ? 'Camera off'
                  : cameraState === 'error'
                    ? '↻ Try camera again'
                    : '◎ Camera on'}
            </button>
          </div>
          <details className="camera-tips">
            <summary>Camera setup tips</summary>
            <ul>
              <li>Place the camera around chest height and face it when possible.</li>
              <li>Use steady, even lighting so your outline is easy to see.</li>
              <li>Step back until your head, shoulders, hips, knees, and ankles fit in frame.</li>
            </ul>
          </details>
          <div className="camera-reminder">
            <span>A gentle reminder</span>
            Demo checks only look at a few visible body positions. They cannot verify pain,
            pressure, balance, or contact with a wall or prop. Follow the written cues and stop if
            anything hurts.
          </div>
        </section>
        <aside className="stack live-session-panel">
          <section className="card session-card">
            <div className="session-card-heading">
              <p className="eyebrow">
                {phase === 'break' && sessionActive
                  ? 'CUSTOM BREAK'
                  : formRule
                    ? 'DEMO HEURISTIC'
                    : 'POSE TRACKING'}
              </p>
              <button
                className={`sound-toggle${chimesMuted ? ' sound-muted' : ''}`}
                onClick={() => onChimesMutedChange((muted) => !muted)}
                aria-pressed={!chimesMuted}
                title={chimesMuted ? 'Turn completion chimes on' : 'Mute completion chimes'}
              >
                <span aria-hidden="true">{chimesMuted ? '♩̸' : '♫'}</span>
                {chimesMuted ? 'Sound off' : 'Sound on'}
              </button>
            </div>
            <div className={`form-good${formStatusClass}`} aria-live="polite">
              <b>{formStatusIcon}</b>
              <span>
                <strong>
                  {phase === 'break' && sessionActive ? 'Relax and reset' : formTitle}
                </strong>
                <small>
                  {phase === 'break' && sessionActive
                    ? 'Your next stretch begins when the break timer ends.'
                    : formHint}
                </small>
              </span>
            </div>
            <div className="timer">
              <span>
                <small>
                  {phase === 'break' && sessionActive ? 'BREAK TIME LEFT' : 'TIME LEFT'}
                </small>
                <b>{formatClock(seconds)}</b>
              </span>
              <span>
                <small>{phase === 'break' && sessionActive ? 'UP NEXT' : 'STRETCH TIME'}</small>
                {phase === 'break' && sessionActive
                  ? 'Next movement'
                  : `${stretchDuration} seconds`}
              </span>
            </div>
            <div className="progress">
              <i style={{ width: `${phaseDuration ? (seconds / phaseDuration) * 100 : 0}%` }} />
            </div>
            <div className="session-controls">
              <button
                className="primary session-button"
                onClick={() => (sessionActive ? toggleSession() : openPlanner())}
              >
                {sessionActive ? (isRunning ? 'Ⅱ Pause' : '▶ Resume') : '＋ Plan your flow'}
              </button>
              <button
                className="secondary session-tool-button"
                onClick={restartTimer}
                disabled={!sessionActive}
                aria-label="Restart current timer"
                title="Restart current timer"
              >
                ↻ Restart
              </button>
              <button
                className="secondary session-tool-button"
                onClick={skipCurrent}
                disabled={!sessionActive}
                aria-label="Skip to next stretch"
                title="Skip to next stretch"
              >
                Skip →
              </button>
            </div>
            {sessionActive && (
              <p className="session-position">
                {phase === 'break' ? 'Between stretches' : `Now stretching · ${stretch.name}`}
              </p>
            )}
          </section>
        </aside>
      </div>
      {(sessionActive || queue.length > 0) && (
        <button
          className="stop stop-session-button"
          onClick={() => {
            setIsRunning(false)
            setConfirmStop(true)
          }}
        >
          × Stop session
        </button>
      )}
      {plannerOpen && (
        <PlaylistPlanner
          queue={queue}
          onQueueChange={onQueueChange}
          presets={presets}
          onSavePreset={onSavePreset}
          onClearQueue={onClearQueue}
          onLoadPreset={(preset) => onQueueChange(preset.entries)}
          onClose={() => setPlannerOpen(false)}
          onStart={startSet}
          onBrowse={() => {
            setPlannerOpen(false)
            onFindRelief()
          }}
        />
      )}
      {confirmStop && (
        <div
          className="dialog-overlay"
          role="presentation"
          onMouseDown={() => setConfirmStop(false)}
        >
          <section
            className="card confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="stop-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="dialog-mark">Ⅱ</span>
            <h2 id="stop-dialog-title">Stop this session?</h2>
            <p>
              Completed stretches will be removed from this flow. Anything you have not finished
              will stay in your queue.
            </p>
            <div className="dialog-actions">
              <button className="secondary" onClick={() => setConfirmStop(false)}>
                Keep stretching
              </button>
              <button className="danger-button" onClick={stop}>
                Stop session
              </button>
            </div>
          </section>
        </div>
      )}
      {showCompletion && (
        <div className="dialog-overlay completion-overlay" role="presentation">
          <section
            className="card confirm-dialog completion-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="completion-title"
          >
            <span className="completion-sparkle">✦</span>
            <p className="eyebrow">FLOW COMPLETE</p>
            <h2 id="completion-title">Beautiful work.</h2>
            <p>
              You made space for yourself and completed your whole set. Take a moment to notice how
              you feel.
            </p>
            <div className="dialog-actions">
              <button className="secondary" onClick={() => setShowCompletion(false)}>
                Close
              </button>
              <button
                className="primary"
                onClick={() => {
                  setShowCompletion(false)
                  onFindRelief()
                }}
              >
                Back to Find relief
              </button>
            </div>
          </section>
        </div>
      )}
    </Page>
  )
}
