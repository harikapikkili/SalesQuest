import { Link, useParams, useLocation, Navigate } from 'react-router-dom';

export default function Result() {
  const { id } = useParams();
  const { state } = useLocation();

  // Guard: if someone navigates here directly without state, redirect
  if (!state?.result) return <Navigate to="/" replace />;

  const { result, quiz } = state;
  const pct = Math.round((result.score / result.total) * 100);

  let emoji = '🎉';
  if (pct < 40) emoji = '😅';
  else if (pct < 70) emoji = '👍';

  return (
    <div className="page">
      <div className="card result-card">
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{emoji}</div>
        <div className="result-score">
          {result.score}/{result.total}
        </div>
        <p className="result-label">
          {result.playerName} scored {pct}% on <strong>{quiz.title}</strong>
        </p>
        <div className="result-actions">
          <Link to={`/quiz/${id}`} className="btn btn-outline">Retry Quiz</Link>
          <Link to={`/quiz/${id}/leaderboard`} className="btn btn-primary">Leaderboard</Link>
          <Link to="/" className="btn btn-outline">All Quizzes</Link>
        </div>
      </div>
    </div>
  );
}
