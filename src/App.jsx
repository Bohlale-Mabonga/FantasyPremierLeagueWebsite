import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Players from './pages/Players'
import PlayerDetails from './pages/PlayerDetails'
import About from './pages/About'
import Fixtures from './pages/Fixtures'
import NavBar from './components/common/NavBar'

import Teams from './pages/Teams'
import './App.css'

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<Players />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/about" element={<About />} />
        <Route path="/fixtures" element={<Fixtures />} />
      </Routes>
    </Router>
  )
}

export default App