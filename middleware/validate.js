/**
 * Lightweight validation helpers.
 *
 * Instead of pulling in a large library (Joi / express-validator) for a
 * small API, we hand-roll the two validations we need and keep them as
 * Express middleware so routes stay clean.
 */

/**
 * Validate the body of POST /api/quizzes.
 */
export function validateQuiz(req, _res, next) {
  const { title, questions } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return next(Object.assign(new Error("title is required and must be a non-empty string"), { status: 400 }));
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return next(Object.assign(new Error("questions must be a non-empty array"), { status: 400 }));
  }

  for (const [i, q] of questions.entries()) {
    if (!q.text || typeof q.text !== "string" || !q.text.trim()) {
      return next(Object.assign(new Error(`questions[${i}].text is required`), { status: 400 }));
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      return next(Object.assign(new Error(`questions[${i}].options must have at least 2 items`), { status: 400 }));
    }
    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      return next(
        Object.assign(
          new Error(`questions[${i}].correctIndex must be a valid index (0–${q.options.length - 1})`),
          { status: 400 }
        )
      );
    }
  }

  next();
}

/**
 * Validate the body of POST /api/quizzes/:id/attempts.
 *
 * Expected body: { playerName: string, answers: number[] }
 */
export function validateAttempt(req, _res, next) {
  const { playerName, answers } = req.body;

  if (!playerName || typeof playerName !== "string" || !playerName.trim()) {
    return next(Object.assign(new Error("playerName is required"), { status: 400 }));
  }

  if (!Array.isArray(answers)) {
    return next(Object.assign(new Error("answers must be an array of numbers"), { status: 400 }));
  }

  for (const [i, a] of answers.entries()) {
    if (typeof a !== "number" || !Number.isInteger(a) || a < 0) {
      return next(Object.assign(new Error(`answers[${i}] must be a non-negative integer`), { status: 400 }));
    }
  }

  next();
}
