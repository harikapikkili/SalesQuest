import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getQuizzes()
      .then(setQuizzes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="loader">Loading quizzes…</div></div>;
  if (error)   return <div className="page"><div className="error-box">{error}</div></div>;

  return (
    <div className="page">
      <div className="flex-between mb-2">
        <div>
          <h1 className="page-title">Quizzes</h1>
          <p className="page-subtitle">Pick a quiz and test your knowledge</p>
        </div>
        <Link to="/create" className="btn btn-primary">+ New Quiz</Link>
      </div>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <p>No quizzes yet — create your first one!</p>
          <Link to="/create" className="btn btn-outline">Create Quiz</Link>
        </div>
      ) : (
        <div className="card-grid">
          {quizzes.map((q) => (
            <Link to={`/quiz/${q._id}`} key={q._id} style={{ textDecoration: 'none' }}>
              <div className="card">
                <div className="card-title">{q.title}</div>
                <div className="card-meta">
                  <span className="tag">{q.questionCount} question{q.questionCount !== 1 ? 's' : ''}</span>
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
