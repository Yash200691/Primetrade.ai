import jwt from "jsonwebtoken";
import { loadEnv } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const env = loadEnv();

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches user info (id, role) to req.user
 * @throws {ApiError} 401 if token is missing or invalid
 */
export const requireAuth = (req, res, next) => {
  if (!env.JWT_SECRET) {
    throw new ApiError(500, "JWT_SECRET is not configured");
  }

  // Extract token from Bearer header
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};
