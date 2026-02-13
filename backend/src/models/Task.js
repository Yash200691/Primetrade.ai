import mongoose from "mongoose";

/**
 * Task schema definition
 * Stores todo/task items with ownership and status tracking
 */
const taskSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Task title is required"], 
      trim: true 
    },
    description: { 
      type: String, 
      default: "", 
      trim: true 
    },
    status: { 
      type: String, 
      enum: ["todo", "in_progress", "done"], 
      default: "todo" 
    },
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Task owner is required"] 
    }
  },
  { 
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

export const Task = mongoose.model("Task", taskSchema);
