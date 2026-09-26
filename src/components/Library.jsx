import { useMemo, useState } from 'react'
import { stretches } from '../data/stretches.js'
import { Page } from './PageLayout.jsx'
export default function Library({ onStart, onDetails }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () =>
      stretches.filter((s) =>
        `${s.name} ${s.area} ${s.muscle}`.toLowerCase().includes(query.toLowerCase()),
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
        {filtered.map((s) => (
          <article className="card stretch-card" key={s.id}>
            <div className="stretch-visual">
              <span>⌁</span>
              <small>{s.area}</small>
            </div>
            <p className="eyebrow">{s.muscle}</p>
            <h2>{s.name}</h2>
            <p>{s.instructions}</p>
            <div className="meta">
              ◷ {s.duration} sec <i /> Gentle
            </div>
            <div className="actions">
              <button className="primary" onClick={() => onStart(s)}>
                Start flow
              </button>
              <button className="secondary" onClick={() => onDetails(s)}>
                Details
              </button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="card empty">
          <h2>No stretches found</h2>
          <p>Try “shoulder”, “forearm”, or “back”.</p>
        </div>
      )}
    </Page>
  )
}
