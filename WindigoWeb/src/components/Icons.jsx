function Icon({ children, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

export function FiHome(props) { return <Icon {...props}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h5v-6h4v6h5V9.5" /></Icon> }
export function FiUsers(props) { return <Icon {...props}><path d="M16 19a4 4 0 0 0-8 0" /><circle cx="12" cy="8" r="4" /><path d="M20 19a4 4 0 0 0-2-3.4" /><path d="M4 19a4 4 0 0 0 2-3.4" /></Icon> }
export function FiTool(props) { return <Icon {...props}><path d="M14 2l4 4-6 6-4-4 6-6Z" /><path d="M4 12l8 8" /><path d="M14 18l4 4" /></Icon> }
export function FiLayers(props) { return <Icon {...props}><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></Icon> }
export function FiClipboard(props) { return <Icon {...props}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 3h6" /><path d="M9 12h6" /><path d="M9 16h3" /></Icon> }
export function FiDroplet(props) { return <Icon {...props}><path d="M12 3c4 5 7 9 7 12a7 7 0 1 1-14 0c0-3 3-7 7-12Z" /></Icon> }
export function FiThermometer(props) { return <Icon {...props}><path d="M14 4a2 2 0 0 0-4 0v8.3a4 4 0 1 0 4 0Z" /><path d="M12 13v5" /></Icon> }
export function FiFileText(props) { return <Icon {...props}><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" /><path d="M14 2v5h5" /><path d="M8 13h8" /><path d="M8 17h5" /></Icon> }
export function FiZap(props) { return <Icon {...props}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></Icon> }
export function FiSnowflake(props) { return <Icon {...props}><path d="M12 2v20" /><path d="M2 12h20" /><path d="m4.9 4.9 14.2 14.2" /><path d="m19.1 4.9-14.2 14.2" /></Icon> }
export function FiShield(props) { return <Icon {...props}><path d="M12 3 5 6v6c0 5 3.5 8.5 7 9 3.5-.5 7-4 7-9V6l-7-3Z" /></Icon> }
export function FiCalendar(props) { return <Icon {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></Icon> }
export function FiBell(props) { return <Icon {...props}><path d="M15 17H5a2 2 0 0 1-2-2V13a6 6 0 1 1 12 0v2a2 2 0 0 1-2 2Z" /><path d="M10 19a2 2 0 0 0 4 0" /></Icon> }
export function FiSettings(props) { return <Icon {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.2a2 2 0 0 1-2.8 2.8l-.2-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.3A1.7 1.7 0 0 0 8.6 19a1.7 1.7 0 0 0-1.8.3l-.2.1a2 2 0 0 1-2.8-2.8l.1-.2a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.3a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.2a2 2 0 0 1 2.8-2.8l.2.1a1.7 1.7 0 0 0 1.8.3H8a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.3a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.2-.1a2 2 0 0 1 2.8 2.8l-.1.2a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.3a1.7 1.7 0 0 0-1.5 1Z" /></Icon> }
export function FiLogOut(props) { return <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></Icon> }
export function FiMenu(props) { return <Icon {...props}><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></Icon> }
export function FiSearch(props) { return <Icon {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon> }
export function FiFilter(props) { return <Icon {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></Icon> }
export function FiSave(props) { return <Icon {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></Icon> }
export function FiRotateCcw(props) { return <Icon {...props}><path d="M3 12a9 9 0 1 0 9-9" /><path d="M3 3v6h6" /></Icon> }
export function FiX(props) { return <Icon {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon> }
export function FiBarChart2(props) { return <Icon {...props}><path d="M4 19h16" /><path d="M7 15v-4" /><path d="M12 15V7" /><path d="M17 15v-8" /></Icon> }
export function FiTarget(props) { return <Icon {...props}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></Icon> }
export function RiSwordFill(props) { return <Icon {...props}><path d="M10 3h4l2 2-2 2h-4l-2-2 2-2Z" /><path d="M8 7h8" /><path d="M9 9l-2 2 2 2" /><path d="M15 9l2 2-2 2" /><path d="M10 13h4l1 2-1 2h-4l-1-2 1-2Z" /></Icon> }
