// Centralised error handler — every route wraps its logic in try/catch and
// calls next(err); this is the single place that decides what the client sees.
// Never leak raw DB/stack details to the response in production.
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Something went wrong. Please try again.'
      : err.message;

  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
