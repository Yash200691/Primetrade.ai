import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { loadEnv } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const env = loadEnv();

/**
 * Generate JWT token for authenticated user
 * @param {Object} user - User document from database
 * @returns {string} Signed JWT token
 */
const signToken = (user) => {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user._id.toString(),
    expiresIn: env.JWT_EXPIRES_IN
  });
};

/**
 * Register a new user
 * POST /api/v1/auth/register
 * @body {string} name - User's full name
 * @body {string} email - User's email address
 * @body {string} password - User's password (min 8 chars)
 * @body {string} [role=user] - User role (user or admin)
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  // Hash password before storing
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed, role: role || "user" });

  const token = signToken(user);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * Login existing user
 * POST /api/v1/auth/login
 * @body {string} email - User's email address
 * @body {string} password - User's password
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password field (excluded by default)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Verify password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken(user);

  res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});
