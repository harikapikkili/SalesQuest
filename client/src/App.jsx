import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import QuizList from './pages/QuizList';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';

export default function App() {
  return (
    <BrowserRouter>
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <NavLink to="/" className="logo">
            Sales<span>Quest</span>
          </NavLink>
          <nav>
            <NavLink to="/" end>
              Quizzes
            </NavLink>
            <NavLink to="/create">
              Create
            </NavLink>
          </nav>
        </div>
      </header>

      {/* ── Pages ── */}
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route path="/quiz/:id" element={<TakeQuiz />} />
        <Route path="/quiz/:id/result" element={<Result />} />
        <Route path="/quiz/:id/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}
