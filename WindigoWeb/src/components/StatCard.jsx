function StatCard({ title, value, detail }) {
  return (
    <article className="card stat-card">
      <p className="stat-card__title">{title}</p>
      <h3>{value}</h3>
      <p className="stat-card__detail">{detail}</p>
    </article>
  )
}

export default StatCard
