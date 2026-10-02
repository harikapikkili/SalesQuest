import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const emptyQuestion = () => ({
  text: '',
  options: ['', ''],
  correctIndex: 0,
});

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ── Question helpers ── */

  const updateQuestion = (qi, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qi, oi, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qi) return q;
        const opts = [...q.options];
        opts[oi] = value;
        return { ...q, options: opts };
      })
    );
  };

  const addOption = (qi) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  const removeOption = (qi, oi) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qi || q.options.length <= 2) return q;
        const opts = q.options.filter((_, j) => j !== oi);
        const ci = q.correctIndex >= opts.length ? 0 : q.correctIndex;
        return { ...q, options: opts, correctIndex: ci };
      })
    );
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const removeQuestion = (qi) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== qi));
  };

  /* ── Submit ── */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const quiz = await api.createQuiz({ title, questions });
      navigate(`/quiz/${quiz._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Create Quiz</h1>
      <p className="page-subtitle">Add a title and at least one question</p>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Quiz Title</label>
          <input
            id="title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. JavaScript Fundamentals"
            required
          />
        </div>

        {/* Questions */}
        {questions.map((q, qi) => (
          <div className="question-block" key={qi}>
            <div className="question-header">
              <span className="question-number">Question {qi + 1}</span>
              {questions.length > 1 && (
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(qi)}>
                  Remove
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Question Text</label>
              <input
                className="input"
                value={q.text}
                onChange={(e) => updateQuestion(qi, 'text', e.target.value)}
                placeholder="Enter your question"
                required
              />
            </div>

            <div className="form-group">
              <label>Options (click radio to mark correct answer)</label>
              {q.options.map((opt, oi) => (
                <div className="add-option-row" key={oi}>
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(qi, 'correctIndex', oi)}
                    title="Mark as correct"
                    style={{ accentColor: 'var(--color-success)', width: 18, height: 18, cursor: 'pointer' }}
                  />
                  <input
                    className="input"
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                    placeholder={`Option ${oi + 1}`}
                    required
                  />
                  {q.options.length > 2 && (
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeOption(qi, oi)}>
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-outline btn-sm mt-1" onClick={() => addOption(qi)}>
                + Add Option
              </button>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={addQuestion}>
            + Add Question
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}
