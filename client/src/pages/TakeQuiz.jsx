import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [answers, setAnswers] = useState([]);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getQuiz(id)
      .then((data) => {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(-1));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const selectOption = (index) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[current] = index;
      return copy;
    });
  };

  const handleSubmit = async () => {
    if (answers.includes(-1)) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const result = await api.submitAttempt(id, { playerName, answers });
      navigate(`/quiz/${id}/result`, { state: { result, quiz } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><div className="loader">Loading quiz…</div></div>;
  if (error && !quiz) return <div className="page"><div className="error-box">{error}</div></div>;

  /* ── Name entry screen ── */
  if (!started) {
    return (
      <div className="page">
        <div className="card result-card">
          <h1 className="page-title">{quiz.title}</h1>
          <p className="result-label">{quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}</p>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label htmlFor="playerName">Your Name</label>
            <input
              id="playerName"
              className="input"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <button
            className="btn btn-primary"
            disabled={!playerName.trim()}
            onClick={() => setStarted(true)}
          >
            Start Quiz →
          </button>
        </div>
      </div>
    );
  }

  /* ── Quiz questions ── */
  const q = quiz.questions[current];

  return (
    <div className="page">
      <div className="flex-between mb-2">
        <h1 className="page-title">{quiz.title}</h1>
        <span className="tag">
          {current + 1} / {quiz.questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 4,
        borderRadius: 2,
        background: 'var(--color-border)',
        marginBottom: '1.5rem',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${((current + 1) / quiz.questions.length) * 100}%`,
          background: 'var(--color-primary)',
          borderRadius: 2,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="question-block">
        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{q.text}</p>
        <ul className="options-list">
          {q.options.map((opt, oi) => (
            <li
              key={oi}
              className={`option-item ${answers[current] === oi ? 'selected' : ''}`}
              onClick={() => selectOption(oi)}
            >
              <span className="option-radio" />
              {opt}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        {current > 0 && (
          <button className="btn btn-outline" onClick={() => setCurrent((c) => c - 1)}>
            ← Previous
          </button>
        )}
        {current < quiz.questions.length - 1 ? (
          <button
            className="btn btn-primary"
            disabled={answers[current] === -1}
            onClick={() => setCurrent((c) => c + 1)}
          >
            Next →
          </button>
        ) : (
          <button
            className="btn btn-primary"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting…' : 'Submit Answers'}
          </button>
        )}
      </div>
    </div>
  );
}
