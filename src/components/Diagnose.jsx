import { useState } from 'react'
import BodyMap from './BodyMap.jsx'
import { CardTitle, Page } from './PageLayout.jsx'
import { findStretch, muscleMap } from '../data/stretches.js'

const SEARCH_ALIASES = {
  shoulder: 'shoulders',
  arm: 'arms',
  bicep: 'arms',
  tricep: 'arms',
  wrist: 'forearms',
  spine: 'back',
}

const HOW_IT_WORKS = [
  ['Find your focus', 'Describe a sensation or tap the map.'],
  ['Get a gentle suggestion', 'Choose a stretch that fits your day.'],
  ['Move at your pace', 'Follow simple form cues and breathe.'],
]

function findMuscleFromQuery(query) {
  const normalizedQuery = query.toLowerCase()
  const directMatch = Object.keys(muscleMap).find((muscle) => normalizedQuery.includes(muscle))

  if (directMatch) return directMatch

  const alias = Object.keys(SEARCH_ALIASES).find((term) => normalizedQuery.includes(term))
  return alias ? SEARCH_ALIASES[alias] : null
}

export default function Diagnose({ selected, onSelect, onStart, onDetails }) {
  const [query, setQuery] = useState('')
  const selectedMuscle = muscleMap[selected]
  const recommendedStretch = findStretch(selectedMuscle.stretchId)

  function handleSearch(event) {
    event.preventDefault()
    const matchingMuscle = findMuscleFromQuery(query)
    if (matchingMuscle) onSelect(matchingMuscle)
  }
  return (
    <Page
      eyebrow="YOUR DAILY RESET / 01"
      title={
        <>
          Move a little.
          <br />
          Feel a lot better.
        </>
      }
      subtitle="Tell us what feels tight. We’ll help you find your next move."
    >
      <form className="search" onSubmit={handleSearch}>
        <span>⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., my forearms and shoulders feel stiff from typing..."
        />
        <button className="primary">Find a stretch →</button>
      </form>
      <div className="diagnose-grid">
        <div className="stack">
          <section className="card map-card">
            <CardTitle
              eyebrow="INTERACTIVE BODY MAP"
              title="Where are you feeling it?"
              badge={`${selectedMuscle.label} · selected`}
            />
            <BodyMap selected={selected} onSelect={onSelect} />
          </section>
          <section className="card recommendation">
            <span className="recommend-icon">◇</span>
            <div>
              <p className="eyebrow">TARGET IDENTIFIED · {recommendedStretch.area}</p>
              <h2>{recommendedStretch.name}</h2>
              <p>{recommendedStretch.instructions}</p>
              <div className="meta">
                ◷ {recommendedStretch.duration} sec <i /> Gentle pace <i /> Equipment-free
              </div>
              <div className="actions">
                <button className="primary" onClick={() => onStart(recommendedStretch)}>
                  ▶ Start live flow
                </button>
                <button className="secondary" onClick={() => onDetails(recommendedStretch)}>
                  Form & details ↗
                </button>
              </div>
            </div>
          </section>
        </div>
        <aside className="stack">
          <section className="card insight">
            <p className="eyebrow">A NOTE FROM YOUR BODY</p>
            <h2>Small resets can change your whole day.</h2>
            <p>
              Long stretches of stillness ask a lot of your body. Start gently, keep your breath
              easy, and stop if anything feels sharp.
            </p>
            <div className="minutes">
              <span className="micro">MOBILITY MINUTES</span>
              <b>
                18<small> min</small>
              </b>
              <div className="progress">
                <i style={{ width: '40%' }} />
              </div>
              <small>THIS WEEK · GOAL 45 MIN</small>
            </div>
          </section>
          <section className="card steps">
            <CardTitle eyebrow="HOW IT WORKS" title="Your flow, in three steps" />
            <ol>
              {HOW_IT_WORKS.map(([title, description], index) => (
                <li key={title}>
                  <b>{String(index + 1).padStart(2, '0')}</b>
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <p className="disclaimer">◇ FlexFlow is a movement companion, not a medical diagnosis.</p>
        </aside>
      </div>
    </Page>
  )
}
