import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 * @param {string} mongoUri - MongoDB connection string
 */
export const connectDb = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MONGO_URI is required");
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true
    });
    console.log("✓ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};
