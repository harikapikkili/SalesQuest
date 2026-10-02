import { Router } from "express";
import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";
import { validateQuiz, validateAttempt } from "../middleware/validate.js";

const router = Router();

// ──────────────────────────── Quiz CRUD ────────────────────────────

/**
 * POST /api/quizzes — Create a new quiz.
 * Body: { title, questions: [{ text, options, correctIndex }] }
 */
router.post("/", validateQuiz, async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/quizzes — List all quizzes (title + question count only).
 */
router.get("/", async (_req, res, next) => {
  try {
    const quizzes = await Quiz.find()
      .select("title questions createdAt")
      .sort("-createdAt")
      .lean();

    // Return a lightweight list — don't expose full question data here.
    const result = quizzes.map((q) => ({
      _id: q._id,
      title: q.title,
      questionCount: q.questions.length,
      createdAt: q.createdAt,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/quizzes/:id — Get a single quiz with all questions.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
});

// ──────────────────────── Attempts & Leaderboard ───────────────────

/**
 * POST /api/quizzes/:id/attempts — Submit answers and get a score.
 * Body: { playerName, answers: [selectedIndex, …] }
 *
 * The server compares each answer against the quiz's correctIndex and
 * calculates the score — clients are never trusted with scoring.
 */
router.post("/:id/attempts", validateAttempt, async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const { playerName, answers } = req.body;

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        error: `Expected ${quiz.questions.length} answer(s), received ${answers.length}`,
      });
    }

    // ── Server-side scoring ──
    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (answers[i] === quiz.questions[i].correctIndex) score++;
    }

    const attempt = await Attempt.create({
      quizId: quiz._id,
      playerName: playerName.trim(),
      score,
    });

    res.status(201).json({
      _id: attempt._id,
      quizId: attempt.quizId,
      playerName: attempt.playerName,
      score: attempt.score,
      total: quiz.questions.length,
      createdAt: attempt.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/quizzes/:id/leaderboard — Top 10 scores for a quiz.
 */
router.get("/:id/leaderboard", async (req, res, next) => {
  try {
    // Quick existence check so we return 404 rather than an empty array
    // for an invalid quiz id.
    const exists = await Quiz.exists({ _id: req.params.id });
    if (!exists) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const leaderboard = await Attempt.find({ quizId: req.params.id })
      .sort({ score: -1, createdAt: 1 }) // highest score first, ties broken by earliest attempt
      .limit(10)
      .select("playerName score createdAt")
      .lean();

    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
});

export default router;
