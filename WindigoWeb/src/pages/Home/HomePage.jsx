import { Link } from 'react-router-dom'
import { FiUsers, FiTool, FiLayers } from 'react-icons/fi'

const cards = [
  {
    title: 'Teams Dashboard',
    description: 'Track current teams, schedules, and assignments with quick-access insight.',
    to: '/teams',
    icon: FiUsers,
  },
  {
    title: 'Ice & Maintenance Dashboard',
    description: 'Monitor rink conditions, maintenance work, and open requests at a glance.',
    to: '/ice-maintenance',
    icon: FiTool,
  },
  {
    title: 'Rink & Building Information',
    description: 'Review operational forms, readings, and billing information from one place.',
    to: '/building-info',
    icon: FiLayers,
  },
]

function HomePage() {
  return (
    <div className="page">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Wisconsin Windigo operations</p>
          <h2>Run every rink detail with confidence.</h2>
          <p>Keep teams, ice conditions, maintenance work, and facilities aligned through a polished management hub built for modern arena operations.</p>
        </div>
        <div className="hero-card__stats">
          <div className="hero-card__pill">3 active facilities</div>
          <div className="hero-card__pill">12 open tickets</div>
          <div className="hero-card__pill">98% readiness</div>
        </div>
      </section>

      <section className="card-grid">
        {cards.map(({ title, description, to, icon: Icon }) => (
          <article key={title} className="card nav-card">
            <div className="nav-card__icon">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <Link className="button button--primary" to={to}>Open</Link>
          </article>
        ))}
      </section>
    </div>
  )
}

export default HomePage
