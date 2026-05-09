/**
 * Global error handling middleware.
 * Formats errors before sending JSON responses to the client.
 */
const errorHandler = (err, req, res, next) => {
  // Preserve existing status code or default to 500
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Send a structured error response
  res.status(statusCode).json({
    message: err.message || "Server Error"
  });
};

export default errorHandler;