import BodyMap from './BodyMap.jsx'
import { CardTitle, Page } from './PageLayout.jsx'
import { muscleMap, stretches } from '../data/stretches.js'

export default function Diagnose({ selected, onSelect, onStart, onDetails }) {
  const selectedMuscle = muscleMap[selected]
  const matchingStretches = stretches.filter((stretch) => stretch.targetAreas.includes(selected))

  return (
    <Page
      eyebrow="YOUR DAILY RESET / 01"
      title={
        <>
          Choose where you
          <br />
          need more room.
        </>
      }
      subtitle="Select an area to explore stretches designed for the tension you’re feeling."
    >
      <section className="card map-card">
        <CardTitle
          eyebrow="INTERACTIVE BODY MAP"
          title="Where are you feeling it?"
          badge={`${selectedMuscle.label} · selected`}
        />
        <BodyMap selected={selected} onSelect={onSelect} />
      </section>

      <section className="results-section" aria-live="polite">
        <div className="results-heading">
          <div>
            <p className="eyebrow">RECOMMENDED FOR {selectedMuscle.label.toUpperCase()}</p>
            <h2>Choose a stretch that fits how you feel.</h2>
          </div>
          <span>
            {matchingStretches.length} {matchingStretches.length === 1 ? 'option' : 'options'}
          </span>
        </div>

        <div className="recommendations-grid">
          {matchingStretches.map((stretch) => (
            <article className="card recommendation-card" key={stretch.id}>
              <div className="recommendation-card-header">
                <span className="recommend-icon">◇</span>
                <span className="badge">{stretch.muscle}</span>
              </div>

              <h3>{stretch.name}</h3>
              <p className="helps-with">
                <strong>About this stretch</strong>
                {stretch.description}
              </p>

              <div className="meta">
                ◷ {stretch.duration} sec <i /> {stretch.difficulty} <i /> {stretch.equipment}
              </div>

              <div className="actions">
                <button className="primary" onClick={() => onStart(stretch)}>
                  ▶ Start live flow
                </button>
                <button className="secondary" onClick={() => onDetails(stretch)}>
                  Form & details ↗
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="disclaimer results-disclaimer">
        ◇ Sumi offers general mobility guidance, not medical diagnosis or treatment.
      </p>
    </Page>
  )
}
