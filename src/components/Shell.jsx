import { stretches } from '../data/stretches.js'

const icons = { diagnose: '⌁', library: '▤', live: '◉', presets: '☆' }

function formatFlowTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return minutes
    ? `${minutes}:${String(remainder).padStart(2, '0')}`
    : `0:${String(remainder).padStart(2, '0')}`
}

export function Header({ collapsed, onToggle }) {
  return (
    <header className="header">
      <div className="brand">Sumi</div>
      <button
        className="header-sidebar-toggle"
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16" />
          <path d={collapsed ? 'm13 9 3 3-3 3' : 'm16 9-3 3 3 3'} />
        </svg>
      </button>
      <div className="header-account" aria-label="Your account, personal session">
        <b>JD</b>
        <span>
          Your account<small>Personal session</small>
        </span>
      </div>
    </header>
  )
}

export function Navigation({
  view,
  onChange,
  collapsed,
  queue,
  onRemoveFlow,
  onClearQueue,
  onOpenQueue,
}) {
  const items = [
    ['diagnose', 'Find relief'],
    ['library', 'Stretch library'],
    ['live', 'Live session'],
    ['presets', 'Presets'],
  ]
  const stretchById = new Map(stretches.map((stretch) => [stretch.id, stretch]))

  function renderLinks(location) {
    return items.map(([id, label]) => (
      <button
        key={`${location}-${id}`}
        className={`nav-link ${view === id ? 'active' : ''}`}
        onClick={() => onChange(id)}
        aria-label={label}
        aria-current={view === id ? 'page' : undefined}
        title={collapsed && location === 'desktop' ? label : undefined}
      >
        <span className="nav-icon">{icons[id]}</span>
        <span className="nav-label">{label}</span>
      </button>
    ))
  }

  const visibleQueue = queue
    .map((entry) => ({ ...entry, stretch: stretchById.get(entry.stretchId) }))
    .filter((entry) => entry.stretch)
  const queueSeconds = visibleQueue.reduce(
    (total, entry, index) =>
      total +
      (entry.durationSeconds ?? entry.stretch.duration) +
      (index < visibleQueue.length - 1 ? (entry.breakAfterSeconds ?? 0) : 0),
    0,
  )

  return (
    <>
      <aside className={`sidebar${collapsed ? ' sidebar-collapsed' : ''}`}>
        <nav>{renderLinks('desktop')}</nav>
        <section className="sidebar-queue" aria-label="Stretch flow playlist">
          <div className="sidebar-queue-heading">
            <span>YOUR FLOW</span>
            <b>{visibleQueue.length}</b>
            {visibleQueue.length > 0 && (
              <button className="queue-clear" onClick={onClearQueue} title="Clear flow">
                Clear
              </button>
            )}
          </div>
          {visibleQueue.length ? (
            <>
              <small className="queue-total">About {formatFlowTime(queueSeconds)} total</small>
              <ol>
                {visibleQueue.slice(0, 4).map(({ stretch, stretchId }, index) => (
                  <li key={stretchId}>
                    <span className="queue-dot">{String(index + 1).padStart(2, '0')}</span>
                    <span className="queue-name" title={stretch.name}>
                      {stretch.name}
                    </span>
                    <button
                      onClick={() => onRemoveFlow(stretchId)}
                      aria-label={`Remove ${stretch.name}`}
                      title="Remove"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ol>
              {visibleQueue.length > 4 && (
                <small className="queue-more">+ {visibleQueue.length - 4} more</small>
              )}
              <button className="queue-review" onClick={onOpenQueue}>
                Review flow <span>→</span>
              </button>
            </>
          ) : (
            <div className="queue-empty">Add a stretch and it will be waiting here.</div>
          )}
        </section>
      </aside>
      <nav className="mobile-nav">{renderLinks('mobile')}</nav>
    </>
  )
}
