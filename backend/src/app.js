import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import { loadEnv } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { swaggerDocs } from "./docs/swagger.js";

const env = loadEnv();
const app = express();

// Security middleware
app.use(cors({ origin: env.CORS_ORIGIN, credentials: false }));
app.use(helmet()); // Set security HTTP headers
app.use(express.json({ limit: "10kb" })); // Body parser with size limit
app.use(mongoSanitize()); // Sanitize MongoDB queries
app.use(hpp()); // Prevent HTTP parameter pollution

// Logging middleware (development)
app.use(morgan("dev"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes (versioned)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// API documentation
app.use("/docs", ...swaggerDocs());

// Global error handler (must be last)
app.use(errorHandler);

export default app;
