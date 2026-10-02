import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: [true, "quizId is required"],
    index: true,
  },
  playerName: {
    type: String,
    required: [true, "playerName is required"],
    trim: true,
    maxlength: [50, "playerName cannot exceed 50 characters"],
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for leaderboard queries — sort by score desc, then date asc.
attemptSchema.index({ quizId: 1, score: -1, createdAt: 1 });

export default mongoose.model("Attempt", attemptSchema);
