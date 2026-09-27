import { useMemo, useState } from 'react'
import { stretches } from '../data/stretches.js'
import { Page } from './PageLayout.jsx'

const difficulties = ['Beginner', 'Intermediate', 'Difficult']
const equipmentOptions = [...new Set(stretches.map((stretch) => stretch.equipment))].sort((a, b) =>
  a === b ? 0 : a === 'None' ? -1 : b === 'None' ? 1 : a.localeCompare(b),
)

export default function Library({
  onStart,
  isQueued,
  favorites = [],
  recents = [],
  onToggleFavorite,
  onDetails,
}) {
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [equipment, setEquipment] = useState('all')
  const [collection, setCollection] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const recentRanks = useMemo(() => new Map(recents.map((id, index) => [id, index])), [recents])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matches = stretches.filter((stretch) => {
      const matchesSearch = [stretch.name, stretch.area, stretch.muscle, ...stretch.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
      return (
        matchesSearch &&
        (difficulty === 'all' || stretch.difficulty === difficulty) &&
        (equipment === 'all' || stretch.equipment === equipment) &&
        (collection === 'all' ||
          (collection === 'favorites' && favorites.includes(stretch.id)) ||
          (collection === 'recent' && recentRanks.has(stretch.id)))
      )
    })

    return matches.sort((a, b) => {
      if (sortBy === 'duration') return a.duration - b.duration || a.name.localeCompare(b.name)
      if (sortBy === 'area') return a.area.localeCompare(b.area) || a.name.localeCompare(b.name)
      if (sortBy === 'recent')
        return (recentRanks.get(a.id) ?? Infinity) - (recentRanks.get(b.id) ?? Infinity)
      return a.name.localeCompare(b.name)
    })
  }, [collection, difficulty, equipment, favorites, query, recentRanks, sortBy])

  function chooseCollection(nextCollection) {
    setCollection(nextCollection)
    if (nextCollection === 'recent') setSortBy('recent')
    else setSortBy((current) => (current === 'recent' ? 'name' : current))
  }

  function resetFilters() {
    setQuery('')
    setDifficulty('all')
    setEquipment('all')
    setCollection('all')
    setSortBy('name')
  }

  return (
    <Page
      eyebrow="MOVE WITH INTENTION / 02"
      title="Stretch library"
      subtitle="Find a stretch by name, difficulty, or the equipment you have nearby."
    >
      <div className="search library-search" role="search">
        <span>⌕</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a muscle, body area, or stretch..."
          aria-label="Search stretches"
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
            ×
          </button>
        )}
        <kbd>⌘ K</kbd>
      </div>

      <div className="library-tools">
        <div className="library-collections" role="group" aria-label="Stretch collection">
          {[
            ['all', 'All stretches', stretches.length],
            ['favorites', 'Favorites', favorites.length],
            ['recent', 'Recent', recents.length],
          ].map(([id, label, count]) => (
            <button
              key={id}
              className={collection === id ? 'selected' : ''}
              onClick={() => chooseCollection(id)}
              aria-pressed={collection === id}
            >
              {label}
              <span>{count}</span>
            </button>
          ))}
        </div>

        <div className="library-filters">
          <label>
            <span>Difficulty</span>
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option value="all">Any difficulty</option>
              {difficulties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Equipment</span>
            <select value={equipment} onChange={(event) => setEquipment(event.target.value)}>
              <option value="all">Any equipment</option>
              {equipmentOptions.map((item) => (
                <option key={item} value={item}>
                  {item === 'None' ? 'No equipment' : item}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Sort by</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="name">Name · A to Z</option>
              <option value="duration">Duration · shortest</option>
              <option value="area">Target area · A to Z</option>
              <option value="recent">Recently used</option>
            </select>
          </label>
          {(difficulty !== 'all' ||
            equipment !== 'all' ||
            collection !== 'all' ||
            sortBy !== 'name' ||
            query) && (
            <button className="library-reset" onClick={resetFilters}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="library-results-heading" aria-live="polite">
        <span>
          {filtered.length} {filtered.length === 1 ? 'stretch' : 'stretches'}
        </span>
        {collection === 'recent' && <small>Most recently completed first</small>}
      </div>

      <div className="library-grid">
        {filtered.map((stretch) => {
          const isFavorite = favorites.includes(stretch.id)
          return (
            <article className="card stretch-card" key={stretch.id}>
              <div className="stretch-visual">
                <span>⌁</span>
                <small>{stretch.area}</small>
                <button
                  className={`favorite-toggle${isFavorite ? ' is-favorite' : ''}`}
                  onClick={() => onToggleFavorite(stretch.id)}
                  aria-label={
                    isFavorite
                      ? `Remove ${stretch.name} from favorites`
                      : `Add ${stretch.name} to favorites`
                  }
                  aria-pressed={isFavorite}
                  title={isFavorite ? 'Remove favorite' : 'Add favorite'}
                >
                  {isFavorite ? '★' : '☆'}
                </button>
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
                <button
                  className={`flow-add-button${isQueued(stretch.id) ? ' flow-added' : ''}`}
                  onClick={() => onStart(stretch)}
                  aria-pressed={isQueued(stretch.id)}
                >
                  {isQueued(stretch.id) ? '✓ Added · remove' : '＋ Add flow'}
                </button>
                <button className="secondary" onClick={() => onDetails(stretch)}>
                  Details
                </button>
              </div>
            </article>
          )
        })}
      </div>
      {!filtered.length && (
        <div className="card empty library-empty">
          <h2>
            {collection === 'recent' && !recents.length
              ? 'No recent stretches yet'
              : collection === 'favorites' && !favorites.length
                ? 'No favorites yet'
                : 'No stretches found'}
          </h2>
          <p>
            {collection === 'recent' && !recents.length
              ? 'Complete a stretch in a live session and it will appear here.'
              : collection === 'favorites' && !favorites.length
                ? 'Tap the star on any stretch to save it here.'
                : 'Try changing your search or filters.'}
          </p>
          {(difficulty !== 'all' || equipment !== 'all' || query) && (
            <button className="secondary" onClick={resetFilters}>
              Reset filters
            </button>
          )}
        </div>
      )}
    </Page>
  )
}
