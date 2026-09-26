import { useEffect, useRef, useState } from 'react'
import { Page } from './PageLayout.jsx'
export default function LiveSession({ stretch, onStop }) {
  const [seconds, setSeconds] = useState(stretch.duration)
  const [isRunning, setIsRunning] = useState(false)
  const videoRef = useRef(null)
  useEffect(() => {
    setSeconds(stretch.duration)
    setIsRunning(false)
  }, [stretch])
  useEffect(() => {
    if (!isRunning || seconds <= 0) return
    const timer = setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000)
    return () => clearInterval(timer)
  }, [isRunning, seconds])
  useEffect(() => {
    if (seconds === 0) setIsRunning(false)
  }, [seconds])
  async function enableCamera() {
    try {
      videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({ video: true })
    } catch {
      /* permission can be retried */
    }
  }
  function stop() {
    videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop())
    onStop()
  }
  return (
    <Page
      eyebrow="YOUR LIVE FLOW / 03"
      title="Find your comfortable edge."
      subtitle="Ease into the stretch. Let your breath set the pace."
    >
      <div className="live-grid">
        <section className="card camera-card">
          <div className="camera">
            <video ref={videoRef} autoPlay muted playsInline />
            <div className="camera-grid" />
            <button onClick={enableCamera}>◎ Enable camera</button>
            <div className="camera-caption">
              <span>
                <small>CURRENT FLOW</small>
                {stretch.name}
              </span>
              <span>
                <small>MOVEMENT DETECTION</small>● READY FOR POSE MODEL
              </span>
            </div>
          </div>
          <p className="privacy">◇ Your camera stays on this device.</p>
        </section>
        <aside className="stack">
          <section className="card session-card">
            <p className="eyebrow">FORM STATUS</p>
            <div className="form-good">
              <b>✓</b>
              <span>
                <strong>Session ready</strong>
                <small>Set up where your full body is visible.</small>
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
            <button className="primary session-button" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? 'Ⅱ Pause stretch' : seconds === 0 ? '✓ Complete' : '▶ Begin stretch'}
            </button>
          </section>
          <section className="card reminder">
            <p className="eyebrow">A GENTLE REMINDER</p>
            <p>
              A stretch should feel like a comfortable invitation, never sharp or forced. Adjust or
              stop whenever needed.
            </p>
          </section>
        </aside>
      </div>
      <button className="stop" onClick={stop}>
        × Stop session & return
      </button>
    </Page>
  )
}
