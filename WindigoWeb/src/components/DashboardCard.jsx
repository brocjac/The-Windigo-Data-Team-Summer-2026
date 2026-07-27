function DashboardCard({ icon: Icon, title, value, trend, subtitle }) {
  return (
    <article className="card dashboard-card">
      <div className="dashboard-card__header">
        <div className="dashboard-card__icon">
          <Icon />
        </div>
        <span className="dashboard-card__trend">{trend}</span>
      </div>
      <h3>{title}</h3>
      <p className="dashboard-card__value">{value}</p>
      <p className="dashboard-card__subtitle">{subtitle}</p>
    </article>
  )
}

export default DashboardCard
