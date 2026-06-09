// Importing styles
import './App.css'

import MainPage from './pages/MainPage';
import Dashboard from './pages/Dashboard';

// Import routing props to allow traversal through pages
import {Routes, Route, Navigate } from "react-router-dom";
import Watchlist from './pages/Watchlist';
import BriefNotes from './pages/BriefNotes';
import LaunchDetail from './pages/LaunchDetail';

function App() {
  return (
    <>
    {/* Routing to the various pages of the application */}
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/launchdetail' element={<LaunchDetail />} />
        <Route path='/watchlist' element={<Watchlist />} />
        <Route path='/briefnotes' element={<BriefNotes />} />
        <Route path='/*' element={<Navigate to='/' />} />
      </Routes>
    </>
  )
}

export default App
