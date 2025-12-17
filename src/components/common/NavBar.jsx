import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">Bash's FPL Guide</Link>
      <div className="navbar-links">
        <Link to="/players">Players</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/fixtures">Fixtures</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  )
}

export default NavBar
