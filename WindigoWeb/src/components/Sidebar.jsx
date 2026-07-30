import { NavLink } from 'react-router-dom'
import { FiHome, FiUsers, FiTool, FiLayers, FiClipboard, FiDroplet, FiThermometer, FiFileText, FiZap, FiSnowflake, FiShield, FiCalendar, FiSettings, FiBarChart2 } from './Icons'

const menuItems = [
  { to: '/', label: 'Home', icon: FiHome },
  { to: '/teams', label: 'Teams Dashboard', icon: FiUsers },
  { to: '/ice-maintenance', label: 'Ice & Maintenance Dashboard', icon: FiTool },
  { to: '/ice-maintenance/ice-depth', label: 'Ice Depth Dashboard', icon: FiDroplet },
  { to: '/ice-maintenance/maintenance', label: 'Maintenance Dashboard', icon: FiSettings },
  { to: '/building-info', label: 'Rink & Building Info', icon: FiLayers },
  { to: '/building-info/ice-depth', label: 'Ice Depth Form', icon: FiClipboard },
  { to: '/building-info/maintenance', label: 'Maintenance Form', icon: FiTool },
  { to: '/maintenance/hvac', label: 'HVAC Maintenance', icon: FiZap },
  { to: '/maintenance/ice', label: 'Ice Maintenance', icon: FiSnowflake },
  { to: '/maintenance/rink', label: 'Rink Maintenance', icon: FiShield },
  { to: '/maintenance/zamboni/schedule', label: 'Zamboni Schedule', icon: FiCalendar },
  { to: '/maintenance/zamboni/maintenance', label: 'Zamboni Maintenance', icon: FiBarChart2 },
  { to: '/building-info/rink-temperature', label: 'Rink Temperature', icon: FiThermometer },
  { to: '/billing/gas', label: 'Gas Usage', icon: FiFileText },
  { to: '/billing/electricity', label: 'Electricity Usage', icon: FiFileText },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        {menuItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
