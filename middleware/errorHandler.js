/**
 * Centralised error-handling middleware.
 *
 * All routes can call `next(err)` and this handler will respond with a
 * consistent JSON shape:
 *
 *   { "error": "<message>" }
 *
 * Mongoose ValidationErrors are mapped to 400; everything else defaults
 * to the status already set on the error, or 500.
 */
export default function errorHandler(err, _req, res, _next) {
  // Mongoose validation error → 400
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join("; ") });
  }

  // Mongoose bad-ObjectId cast → 400
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message,
  });

  // Log the full error only for unexpected 500s
  if (status === 500) console.error(err);
}
