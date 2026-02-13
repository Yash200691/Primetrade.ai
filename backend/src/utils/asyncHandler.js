/**
 * Async handler wrapper for Express routes
 * Catches async errors and passes them to error middleware
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware that handles promise rejection
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
