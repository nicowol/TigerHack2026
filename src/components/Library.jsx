import { useMemo, useState } from 'react'
import { stretches } from '../data/stretches.js'
import { Page } from './PageLayout.jsx'
export default function Library({ onStart, onDetails }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () =>
      stretches.filter((stretch) =>
        [stretch.name, stretch.area, stretch.muscle, ...stretch.tags]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  )
  return (
    <Page
      eyebrow="MOVE WITH INTENTION / 02"
      title="Stretch library"
      subtitle="A few thoughtful ways to find a little more room."
    >
      <label className="search library-search">
        <span>⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a muscle, body area, or stretch..."
        />
        <kbd>⌘ K</kbd>
      </label>
      <div className="library-grid">
        {filtered.map((stretch) => (
          <article className="card stretch-card" key={stretch.id}>
            <div className="stretch-visual">
              <span>⌁</span>
              <small>{stretch.area}</small>
            </div>
            <p className="eyebrow">{stretch.muscle}</p>
            <h2>{stretch.name}</h2>
            <p className="stretch-summary">
              <span className="eyebrow">ABOUT THIS STRETCH</span>
              {stretch.description}
            </p>
            <div className="meta">
              ◷ {stretch.duration} sec <i /> {stretch.difficulty} <i /> {stretch.equipment}
            </div>
            <div className="actions">
              <button className="primary" onClick={() => onStart(stretch)}>
                Start flow
              </button>
              <button className="secondary" onClick={() => onDetails(stretch)}>
                Details
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="card empty">
          <h2>No stretches found</h2>
          <p>Try “shoulder”, “wrist”, “hips”, “running”, or “back”.</p>
        </div>
      )}
    </Page>
  )
}
