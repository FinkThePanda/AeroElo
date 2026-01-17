import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Header from './components/layout/Header/Header'
import Footer from './components/layout/Footer/Footer'
import Leaderboard from './pages/Leaderboard/Leaderboard'
import LogMatch from './pages/LogMatch/LogMatch'
import Players from './pages/Players/Players'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Leaderboard />} />
            <Route path="/log-match" element={<LogMatch />} />
            <Route path="/players" element={<Players />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
