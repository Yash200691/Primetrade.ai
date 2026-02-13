import { redisClient, isRedisAvailable } from "../config/redis.js";

/**
 * Generate cache key based on user role and ID
 * Admin gets a shared cache, users get individual caches
 */
const keyFor = (user) => {
  if (!user) {
    return "tasks:anonymous";
  }
  return user.role === "admin" ? "tasks:admin" : `tasks:user:${user.id}`;
};

/**
 * Cache middleware for task list endpoints
 * Returns cached data if available, otherwise passes to next handler
 */
export const cacheTasks = async (req, res, next) => {
  // Skip cache if Redis is unavailable
  if (!isRedisAvailable()) {
    return next();
  }

  try {
    const key = keyFor(req.user);
    const cached = await redisClient.get(key);

    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
  } catch (error) {
    // Cache miss or Redis error should not block API
  }

  return next();
};

/**
 * Invalidate cached tasks for a user
 * Called after create/update/delete operations
 */
export const invalidateTasksCache = async (user) => {
  if (!isRedisAvailable()) {
    return;
  }

  const key = keyFor(user);
  try {
    await redisClient.del(key);
  } catch (error) {
    // Best-effort cache invalidation
  }
};
