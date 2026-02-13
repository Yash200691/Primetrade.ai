import mongoose from "mongoose";

/**
 * User schema definition
 * Stores user account information with role-based access
 */
const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, "Password is required"], 
      select: false // Exclude from queries by default
    },
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    }
  },
  { 
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

export const User = mongoose.model("User", userSchema);
