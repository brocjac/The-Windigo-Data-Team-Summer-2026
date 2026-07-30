import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Navbar onToggleSidebar={() => setIsSidebarOpen((value) => !value)} />
      <div className="app-shell__body">
        <aside className={`sidebar-panel${isSidebarOpen ? ' open' : ''}`}>
          <Sidebar />
        </aside>
        <main className="content-panel">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
