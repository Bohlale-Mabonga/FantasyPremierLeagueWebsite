import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/common/NavBar'
import HomePage from './pages/HomePage'
import Players from './pages/Players'
import PlayerDetails from './pages/PlayerDetails'
import About from './pages/About'
import Fixtures from './pages/Fixtures'
import Teams from './pages/Teams'

import './styles/GlobalStyles.css'
import './styles/NavBar.css'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/players" element={<Players />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/about" element={<About />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/players/:id" element={<PlayerDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App