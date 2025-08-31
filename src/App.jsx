import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './assets/Landing'
import MeetTheCrew from './MeetTheCrew'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/meet-the-crew" element={<MeetTheCrew />} />
      </Routes>
    </Router>
  )
}