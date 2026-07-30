import { FiZap, FiTool, FiShield } from 'react-icons/fi'
import { FiSnowflake } from '../../components/Icons'
import DashboardCard from '../../components/DashboardCard'

function MaintenanceDashboard() {
  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Maintenance</p>
          <h2>Maintenance Dashboard</h2>
        </div>
      </div>

      <div className="stats-grid">
        <DashboardCard icon={FiZap} title="HVAC Status" value="Operational" trend="Online" subtitle="All units stable" />
        <DashboardCard icon={FiSnowflake} title="Ice Equipment" value="3/3 Ready" trend="Ready" subtitle="Resurfacing in sync" />
        <DashboardCard icon={FiTool} title="Zamboni Status" value="2 Active" trend="+1" subtitle="Scheduled delivery" />
        <DashboardCard icon={FiShield} title="Open Maintenance Requests" value="4" trend="Urgent" subtitle="2 high priority" />
      </div>
    </div>
  )
}

export default MaintenanceDashboard
