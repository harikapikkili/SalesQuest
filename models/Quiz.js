import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },
    options: {
      type: [String],
      validate: {
        validator: (v) => v.length >= 2,
        message: "Each question must have at least 2 options",
      },
    },
    correctIndex: {
      type: Number,
      required: [true, "correctIndex is required"],
      min: [0, "correctIndex cannot be negative"],
    },
  },
  { _id: false } // sub-documents don't need their own _id
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (v) => v.length >= 1,
        message: "A quiz must have at least one question",
      },
    },
  },
  { timestamps: true }
);

/**
 * Pre-validate hook: ensure every question's correctIndex is within its
 * options array bounds.  This catches logical errors Mongoose's built-in
 * min/max on the Number field can't catch on its own.
 */
quizSchema.pre("validate", function (next) {
  for (const [i, q] of this.questions.entries()) {
    if (q.correctIndex >= q.options.length) {
      return next(
        new Error(
          `questions[${i}].correctIndex (${q.correctIndex}) is out of bounds — only ${q.options.length} option(s) provided`
        )
      );
    }
  }
  next();
});

export default mongoose.model("Quiz", quizSchema);
