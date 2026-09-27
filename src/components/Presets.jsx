import { stretches } from '../data/stretches.js'
import { Page } from './PageLayout.jsx'

const stretchById = new Map(stretches.map((stretch) => [stretch.id, stretch]))

function getDuration(preset) {
  return preset.entries.reduce((total, entry, index) => {
    const stretch = stretchById.get(entry.stretchId)
    return (
      total +
      (entry.durationSeconds ?? stretch?.duration ?? 0) +
      (index < preset.entries.length - 1 ? (entry.breakAfterSeconds ?? 0) : 0)
    )
  }, 0)
}

export default function Presets({ presets, onLoad, onDelete }) {
  return (
    <Page
      eyebrow="YOUR SAVED FLOWS / 04"
      title="Presets"
      subtitle="Keep the stretch sets you enjoy and bring them back whenever you need a reset."
    >
      {presets.length ? (
        <div className="preset-grid">
          {presets.map((preset) => {
            const names = preset.entries
              .map((entry) => stretchById.get(entry.stretchId)?.name)
              .filter(Boolean)
            return (
              <article className="card preset-card" key={preset.id}>
                <div className="preset-card-heading">
                  <span>☆</span>
                  <button
                    className="preset-delete"
                    onClick={() => onDelete(preset.id)}
                    aria-label={`Delete ${preset.name}`}
                    title="Delete preset"
                  >
                    ×
                  </button>
                </div>
                <p className="eyebrow">
                  {preset.entries.length} STRETCH{preset.entries.length === 1 ? '' : 'ES'} · ABOUT{' '}
                  {Math.ceil(getDuration(preset) / 60)} MIN
                </p>
                <h2>{preset.name}</h2>
                <p className="preset-preview">
                  {names.slice(0, 3).join(' · ')}
                  {names.length > 3 ? ` · +${names.length - 3} more` : ''}
                </p>
                <button className="primary" onClick={() => onLoad(preset)}>
                  Load preset <span>→</span>
                </button>
              </article>
            )
          })}
        </div>
      ) : (
        <section className="card presets-empty">
          <span>☆</span>
          <h2>Your saved flows will live here.</h2>
          <p>Add stretches, arrange them in Live session, then save the setup as a preset.</p>
          <button className="primary" onClick={() => onLoad({ entries: [] })}>
            Open live session <span>→</span>
          </button>
        </section>
      )}
    </Page>
  )
}
