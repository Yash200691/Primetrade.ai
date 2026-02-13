/**
 * Global error handling middleware
 * Catches all errors and returns consistent JSON response
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  // Log server errors for debugging
  if (status >= 500) {
    console.error("Server error:", err);
  }

  res.status(status).json({
    message
  });
};
