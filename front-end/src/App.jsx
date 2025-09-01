// App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './assets/Landing'
import MeetTheCrew from './MeetTheCrew'
import RampCrew from './RampCrew'   

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/meet-the-crew" element={<MeetTheCrew />} />
        <Route path="/ramp-crew" element={<RampCrew />} />  
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}