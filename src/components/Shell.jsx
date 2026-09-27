const icons = { diagnose: '⌁', library: '▤', live: '◉' }
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
    </header>
  )
}
export function Navigation({ view, onChange, collapsed }) {
  const items = [
    ['diagnose', 'Find relief'],
    ['library', 'Stretch library'],
    ['live', 'Live session'],
  ]
  function renderLinks(location) {
    return items.map(([id, label]) => (
      <button
        key={`${location}-${id}`}
        className={`nav-link ${view === id ? 'active' : ''}`}
        onClick={() => onChange(id)}
        aria-label={label}
        title={collapsed && location === 'desktop' ? label : undefined}
      >
        <span className="nav-icon">{icons[id]}</span>
        <span className="nav-label">{label}</span>
      </button>
    ))
  }

  return (
    <>
      <aside className={`sidebar${collapsed ? ' sidebar-collapsed' : ''}`}>
        <nav>{renderLinks('desktop')}</nav>
        <div className="sidebar-account">
          <b>JD</b>
          <span>
            Your account<small>Personal session</small>
          </span>
        </div>
      </aside>
      <nav className="mobile-nav">{renderLinks('mobile')}</nav>
    </>
  )
}
