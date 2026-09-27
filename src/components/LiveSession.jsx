import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'
import { useEffect, useRef, useState } from 'react'
import { assessStretchForm, getFormRule } from '../data/formAssessment.js'
import { Page } from './PageLayout.jsx'

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

export default function LiveSession({ stretch, onStop }) {
  const [seconds, setSeconds] = useState(stretch.duration)
  const [isRunning, setIsRunning] = useState(false)
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
  const stretchIdRef = useRef(stretch.id)
  stretchIdRef.current = stretch.id

  useEffect(() => {
    setSeconds(stretch.duration)
    setIsRunning(false)
  }, [stretch])

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
    if (seconds === 0) setIsRunning(false)
  }, [seconds])

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

  function toggleSession() {
    if (seconds === 0) return
    setIsRunning((current) => !current)
  }

  function stop() {
    releaseCameraResources()
    onStop()
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

  return (
    <Page
      eyebrow="YOUR LIVE FLOW / 03"
      title="Find your comfortable edge."
      subtitle="Ease into the stretch. Let your breath set the pace."
    >
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
                <small>CURRENT FLOW</small>
                {stretch.name}
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
          <div className="camera-reminder">
            <span>A gentle reminder</span>
            Demo checks only look at a few visible body positions. They cannot verify pain,
            pressure, balance, or contact with a wall or prop. Follow the written cues and stop if
            anything hurts.
          </div>
        </section>
        <aside className="stack live-session-panel">
          <section className="card session-card">
            <p className="eyebrow">{formRule ? 'DEMO HEURISTIC' : 'POSE TRACKING'}</p>
            <div className={`form-good${formStatusClass}`} aria-live="polite">
              <b>{formStatusIcon}</b>
              <span>
                <strong>{formTitle}</strong>
                <small>{formHint}</small>
              </span>
            </div>
            <div className="timer">
              <span>
                <small>TIME LEFT</small>
                <b>00:{String(seconds).padStart(2, '0')}</b>
              </span>
              <span>
                <small>FLOW LENGTH</small>
                {stretch.duration} seconds
              </span>
            </div>
            <div className="progress">
              <i style={{ width: `${(seconds / stretch.duration) * 100}%` }} />
            </div>
            <button className="primary session-button" onClick={toggleSession}>
              {isRunning ? 'Ⅱ Pause stretch' : seconds === 0 ? '✓ Complete' : '▶ Begin stretch'}
            </button>
          </section>
        </aside>
      </div>
      <button className="stop" onClick={stop}>
        × Stop session &amp; return
      </button>
    </Page>
  )
}
