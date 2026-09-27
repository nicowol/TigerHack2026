const icons = { diagnose: '⌁', library: '▤', live: '◉' }
export function Header() {
  return (
    <header className="header">
      <button className="brand">
        <span className="brand-mark">⌁</span>
        <span>
          Flex<strong>Flow</strong>
        </span>
      </button>
      <div className="system">
        <i /> ALL SYSTEMS READY
      </div>
      <div className="profile">
        <span>
          YOUR MOBILITY SPACE<small>PERSONAL SESSION</small>
        </span>
        <b>JD</b>
      </div>
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
    return items.map(([id, label], index) => (
      <button
        key={`${location}-${id}`}
        className={`nav-link ${view === id ? 'active' : ''}`}
        onClick={() => onChange(id)}
        aria-label={label}
        title={collapsed && location === 'desktop' ? label : undefined}
      >
        <span className="nav-icon">{icons[id]}</span>
        <span className="nav-label">{label}</span>
        <small>0{index + 1}</small>
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
        <div className="weekly">
          <div>
            <span className="micro">WEEKLY RHYTHM</span>
            <b>4 / 5</b>
          </div>
          <div className="bars">
            {[35, 70, 48, 100, 25, 25, 25].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <small>One short reset at a time.</small>
        </div>
      </aside>
      <nav className="mobile-nav">{renderLinks('mobile')}</nav>
    </>
  )
}
