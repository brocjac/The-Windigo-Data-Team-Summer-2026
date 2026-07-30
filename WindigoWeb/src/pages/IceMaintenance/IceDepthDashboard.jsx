import { useState } from 'react'
import { FiFilter } from 'react-icons/fi'
import Chart from '../../components/Chart'
import Table from '../../components/Table'
import { iceThicknessData, rinkReadings } from '../../data/dummyData'

function IceDepthDashboard() {
  const [range, setRange] = useState('30D')

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Ice Depth</p>
          <h2>Ice Depth Dashboard</h2>
        </div>
        <div className="search-group">
          <FiFilter />
          <select value={range} onChange={(event) => setRange(event.target.value)}>
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="90D">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <article className="card stat-card">
          <p className="stat-card__title">Average Thickness</p>
          <h3>2.78 in</h3>
          <p className="stat-card__detail">Consistent across zones</p>
        </article>
        <article className="card stat-card">
          <p className="stat-card__title">Latest Reading</p>
          <h3>2.8 in</h3>
          <p className="stat-card__detail">Rink A • 06:30</p>
        </article>
      </div>

      <section className="card-grid charts-grid">
        <Chart data={iceThicknessData} title="Ice Thickness History" color="#1EABF2" />
        <article className="card table-card">
          <h3>Recent Readings</h3>
          <Table columns={['Date', 'Time', 'Employee', 'Location', 'Thickness', 'Notes']} rows={rinkReadings.map((reading) => [reading.date, reading.time, reading.employee, reading.location, reading.thickness, reading.notes])} />
        </article>
      </section>
    </div>
  )
}

export default IceDepthDashboard
