import { ApiError } from "../utils/ApiError.js";

/**
 * Role-based access control middleware
 * Ensures user has the required role to access endpoint
 * @param {string} role - Required role (e.g., 'admin')
 * @returns {Function} Express middleware
 * @throws {ApiError} 403 if user doesn't have required role
 */
export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    throw new ApiError(403, "Access denied - insufficient permissions");
  }

  next();
};
