import app from "./app.js";
import { connectDb } from "./config/db.js";
import { loadEnv } from "./config/env.js";

const env = loadEnv();

/**
 * Start the Express server
 * Connects to MongoDB before accepting requests
 */
const start = async () => {
  try {
    // Connect to MongoDB
    await connectDb(env.MONGO_URI);
    
    // Start HTTP server
    app.listen(env.PORT, () => {
      console.log(`\n✓ Server running on port ${env.PORT}`);
      console.log(`✓ API docs: http://localhost:${env.PORT}/docs\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
