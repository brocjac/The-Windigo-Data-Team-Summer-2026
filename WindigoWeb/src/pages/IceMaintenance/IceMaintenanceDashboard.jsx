import { FiDroplet, FiThermometer, FiTool, FiClipboard } from 'react-icons/fi'
import DashboardCard from '../../components/DashboardCard'
import Chart from '../../components/Chart'
import { iceThicknessData, temperatureData, maintenanceRecords } from '../../data/dummyData'

function IceMaintenanceDashboard() {
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Ice & Maintenance</p>
          <h2>Ice & Maintenance Dashboard</h2>
        </div>
      </div>

      <div className="stats-grid">
        <DashboardCard icon={FiDroplet} title="Average Ice Thickness" value="2.76 in" trend="↑ 0.2" subtitle="Excellent surface" />
        <DashboardCard icon={FiThermometer} title="Average Ice Temperature" value="19°F" trend="↓ 2°" subtitle="Within target range" />
        <DashboardCard icon={FiTool} title="Maintenance Requests" value="12" trend="+3" subtitle="New this week" />
        <DashboardCard icon={FiClipboard} title="Open Work Orders" value="4" trend="Stable" subtitle="2 urgent" />
      </div>

      <section className="card-grid charts-grid">
        <Chart data={iceThicknessData} title="Ice Thickness Trend" color="#1EABF2" />
        <Chart data={temperatureData} title="Temperature Trend" color="#555555" />
      </section>

      <section className="card">
        <h3>Maintenance Completion Rate</h3>
        <div className="progress-group">
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: '84%' }} />
          </div>
          <p>84% completed this month</p>
        </div>
        <div className="maintenance-list">
          {maintenanceRecords.map((record) => (
            <div key={record.id} className="maintenance-item">
              <div>
                <strong>{record.title}</strong>
                <p>{record.status}</p>
              </div>
              <span className="badge">{record.priority}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default IceMaintenanceDashboard
