import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Load and validate environment variables
 * @returns {Object} Configuration object
 */
export const loadEnv = () => {
  const PORT = process.env.PORT || "4000";
  const MONGO_URI = process.env.MONGO_URI || "";
  const JWT_SECRET = process.env.JWT_SECRET || "";
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
  const REDIS_URL = process.env.REDIS_URL || "";
  const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

  return {
    PORT,
    MONGO_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    REDIS_URL,
    CORS_ORIGIN
  };
};
