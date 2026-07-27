import { FiBell, FiSettings, FiLogOut, FiMenu, RiSwordFill } from './Icons'

function Navbar({ onToggleSidebar }) {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <button className="icon-button mobile-only" onClick={onToggleSidebar} type="button">
          <FiMenu />
        </button>
        <div className="brand-mark">
          <RiSwordFill />
        </div>
        <div>
          <p className="eyebrow">Wisconsin Windigo</p>
          <h1>Ice Rink Management</h1>
        </div>
      </div>
      <div className="navbar__actions">
        <button className="icon-button" type="button" aria-label="Notifications">
          <FiBell />
        </button>
        <button className="icon-button" type="button" aria-label="Settings">
          <FiSettings />
        </button>
        <div className="navbar__user">
          <span>Coach Rivera</span>
          <button className="icon-button" type="button" aria-label="Logout">
            <FiLogOut />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
