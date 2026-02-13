import { z } from "zod";

/**
 * Validation schema for creating a new task
 */
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(200),
    description: z.string().max(1000, "Description too long").optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional()
  })
});

/**
 * Validation schema for updating a task
 * All fields are optional since partial updates are allowed
 */
export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Task ID is required")
  }),
  body: z
    .object({
      title: z.string().min(2, "Title must be at least 2 characters").max(200).optional(),
      description: z.string().max(1000, "Description too long").optional(),
      status: z.enum(["todo", "in_progress", "done"]).optional()
    })
    .optional()
});

/**
 * Validation schema for deleting a task
 * Only validates the task ID parameter
 */
export const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Task ID is required")
  })
});
