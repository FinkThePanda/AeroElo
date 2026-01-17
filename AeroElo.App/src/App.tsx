import { BrowserRouter, Route, Routes } from 'react-router';
import { Navbar, Footer } from './components/layout';
import { Leaderboard, Players, LogMatch } from './pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="max-w-7xl w-full mx-auto flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Leaderboard />} />
              <Route path="/players" element={<Players />} />
              <Route path="/log-match" element={<LogMatch />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
