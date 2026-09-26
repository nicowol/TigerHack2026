export default function StretchModal({ stretch, onClose, onStart }) {
  if (!stretch) return null
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal card"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <span className="badge">{stretch.area}</span>
        <h2>{stretch.name}</h2>
        <p className="modal-muscle">{stretch.muscle}</p>
        <div className="demo-figure">
          <div className="stick">
            <i />
            <b />
            <span />
            <em />
          </div>
          <small>FORM PREVIEW</small>
        </div>
        <div className="modal-columns">
          <div>
            <p className="eyebrow">HOW TO EXECUTE</p>
            <p>{stretch.instructions}</p>
          </div>
          <div>
            <p className="eyebrow">FORM CHECKLIST</p>
            <ul>
              {stretch.cues.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <button className="primary modal-start" onClick={() => onStart(stretch)}>
          Start this flow →
        </button>
      </section>
    </div>
  )
}
