import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';

export default function Leaderboard() {
  const { id } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getLeaderboard(id)
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><div className="loader">Loading leaderboard…</div></div>;
  if (error)   return <div className="page"><div className="error-box">{error}</div></div>;

  const rankClass = (i) =>
    i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-default';

  return (
    <div className="page">
      <div className="flex-between mb-2">
        <div>
          <h1 className="page-title">Leaderboard</h1>
          <p className="page-subtitle">Top 10 scores for this quiz</p>
        </div>
        <Link to={`/quiz/${id}`} className="btn btn-outline">Take Quiz</Link>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No attempts yet — be the first!</p>
          <Link to={`/quiz/${id}`} className="btn btn-primary">Take Quiz</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Rank</th>
                <th>Player</th>
                <th style={{ width: 80 }}>Score</th>
                <th style={{ width: 140 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e._id}>
                  <td>
                    <span className={`rank-badge ${rankClass(i)}`}>{i + 1}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{e.playerName}</td>
                  <td>
                    <span className="tag">{e.score}</span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
