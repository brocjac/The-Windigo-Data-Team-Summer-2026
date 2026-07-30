import { Link } from 'react-router-dom'
import { FiFileText } from 'react-icons/fi'

function BillingForms() {
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Billing</p>
          <h2>Billing Forms</h2>
        </div>
      </div>
      <section className="card-grid">
        <article className="card nav-card">
          <div className="nav-card__icon"><FiFileText /></div>
          <h3>Gas Usage</h3>
          <p>Track monthly gas consumption and costs.</p>
          <Link className="button button--primary" to="/billing/gas">Open</Link>
        </article>
        <article className="card nav-card">
          <div className="nav-card__icon"><FiFileText /></div>
          <h3>Electricity Usage</h3>
          <p>Capture monthly electricity meter readings and costs.</p>
          <Link className="button button--secondary" to="/billing/electricity">Open</Link>
        </article>
      </section>
    </div>
  )
}

export default BillingForms
