import { z } from "zod";

/**
 * Validation schema for user registration
 * Ensures all required fields are present and valid
 */
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(100),
    role: z.enum(["user", "admin"]).optional()
  })
});

/**
 * Validation schema for user login
 * Validates email and password format
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(100)
  })
});
