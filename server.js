import "dotenv/config"; // loads .env before anything else
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import quizRoutes from "./routes/quizzes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// ── Global middleware ──
app.use(cors());
app.use(express.json());

// ── Routes ──
app.use("/api/quizzes", quizRoutes);

// ── Health-check ──
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── 404 catch-all ──
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Central error handler (must be registered last) ──
app.use(errorHandler);

// ── Start ──
const PORT = process.env.PORT || 4000;
await connectDB();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
