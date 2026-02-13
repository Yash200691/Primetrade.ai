import { Task } from "../models/Task.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { invalidateTasksCache } from "../middleware/cache.js";
import { redisClient, isRedisAvailable } from "../config/redis.js";

/**
 * Generate cache key for user's task list
 */
const cacheKeyFor = (user) => {
  return user.role === "admin" ? "tasks:admin" : `tasks:user:${user.id}`;
};

/**
 * List all tasks for current user
 * GET /api/v1/tasks
 * Admin can see all tasks, regular users see only their own
 */
export const listTasks = asyncHandler(async (req, res) => {
  // Admin sees all tasks, users see only their own
  const filter = req.user.role === "admin" ? {} : { owner: req.user.id };
  const tasks = await Task.find(filter).sort({ createdAt: -1 });

  const payload = { tasks };
  
  // Cache the response if Redis is available
  if (isRedisAvailable()) {
    const key = cacheKeyFor(req.user);
    try {
      await redisClient.setex(key, 60, JSON.stringify(payload));
    } catch (error) {
      // Cache failures should not impact API responses
    }
  }

  res.status(200).json(payload);
});

/**
 * Create a new task
 * POST /api/v1/tasks
 * @body {string} title - Task title (required)
 * @body {string} [description] - Task description
 * @body {string} [status=todo] - Task status (todo, in_progress, done)
 */
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description || "",
    status: req.body.status || "todo",
    owner: req.user.id
  });

  // Invalidate cache after creating new task
  await invalidateTasksCache(req.user);

  res.status(201).json({ task });
});

/**
 * Update an existing task
 * PUT /api/v1/tasks/:id
 * Users can only update their own tasks, admins can update any task
 * @param {string} id - Task ID
 * @body {string} [title] - Updated task title
 * @body {string} [description] - Updated task description
 * @body {string} [status] - Updated task status
 */
export const updateTask = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check ownership: users can only edit their own tasks
  if (req.user.role !== "admin" && task.owner.toString() !== req.user.id) {
    throw new ApiError(403, "Forbidden");
  }

  // Update only provided fields
  if (body.title !== undefined) task.title = body.title;
  if (body.description !== undefined) task.description = body.description;
  if (body.status !== undefined) task.status = body.status;

  await task.save();
  await invalidateTasksCache(req.user);

  res.status(200).json({ task });
});

/**
 * Delete a task
 * DELETE /api/v1/tasks/:id
 * Users can only delete their own tasks, admins can delete any task
 * @param {string} id - Task ID
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Check ownership: users can only delete their own tasks
  if (req.user.role !== "admin" && task.owner.toString() !== req.user.id) {
    throw new ApiError(403, "Forbidden");
  }

  await task.deleteOne();
  await invalidateTasksCache(req.user);

  res.status(200).json({ message: "Task deleted" });
});

/**
 * Get task summary grouped by status (Admin only)
 * GET /api/v1/tasks/admin/summary
 * Returns count of tasks for each status
 */
export const getAdminSummary = asyncHandler(async (req, res) => {
  const byStatus = await Task.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", count: 1 } }
  ]);

  res.status(200).json({ summary: byStatus });
});
