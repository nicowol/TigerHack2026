const icons = { diagnose: '⌁', library: '▤', live: '◉' }
export function Header() {
  return (
    <header className="header">
      <div className="brand">Sumi</div>
    </header>
  )
}
export function Navigation({ view, onChange, collapsed, onToggle }) {
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
        <div className="sidebar-heading">
          <p className="micro">WORKSPACE</p>
          <button
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>
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
