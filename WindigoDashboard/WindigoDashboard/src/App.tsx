import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LeaguePage from './pages/LeaguePage'
import TeamDetails from './pages/TeamDetails'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/league/:leagueKey" element={<LeaguePage />} />
      <Route path="/team/:leagueKey/:teamId" element={<TeamDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

