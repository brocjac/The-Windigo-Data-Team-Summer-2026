import { Link } from 'react-router-dom'
import { FiClipboard, FiTool, FiThermometer, FiFileText } from 'react-icons/fi'

const cards = [
  { title: 'Ice Depth Form', description: 'Capture and log rink surface measurements.', to: '/building-info/ice-depth', icon: FiClipboard },
  { title: 'Maintenance Form', description: 'Log work orders and service tasks.', to: '/building-info/maintenance', icon: FiTool },
  { title: 'Rink Temperature Form', description: 'Track environmental conditions and readings.', to: '/building-info/rink-temperature', icon: FiThermometer },
  { title: 'Billing Forms', description: 'Record gas and electricity utility usage.', to: '/building-info/billing', icon: FiFileText },
]

function RinkBuildingInfo() {
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Building info</p>
          <h2>Rink & Building Information</h2>
        </div>
      </div>
      <section className="card-grid">
        {cards.map(({ title, description, to, icon: Icon }) => (
          <article key={title} className="card nav-card">
            <div className="nav-card__icon"><Icon /></div>
            <h3>{title}</h3>
            <p>{description}</p>
            <Link className="button button--secondary" to={to}>Open</Link>
          </article>
        ))}
      </section>
    </div>
  )
}

export default RinkBuildingInfo
