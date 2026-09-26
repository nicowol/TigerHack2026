export function Page({ eyebrow, title, subtitle, children }) {
  return (
    <div className="page">
      <div className="page-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

export function CardTitle({ eyebrow, title, badge }) {
  return (
    <div className="card-title">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {badge && (
        <span className="badge">
          <i />
          {badge}
        </span>
      )}
    </div>
  )
}
