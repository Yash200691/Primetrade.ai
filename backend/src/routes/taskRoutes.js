import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";
import { cacheTasks } from "../middleware/cache.js";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, updateTaskSchema, deleteTaskSchema } from "../validators/taskSchemas.js";
import { listTasks, createTask, updateTask, deleteTask, getAdminSummary } from "../controllers/taskController.js";

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/v1/tasks/admin/summary:
 *   get:
 *     summary: Admin-only task summary
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task summary
 */
router.get("/admin/summary", requireRole("admin"), getAdminSummary);

/**
 * @openapi
 * /api/v1/tasks:
 *   get:
 *     summary: List tasks for current user
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task list
 */
router.get("/", cacheTasks, listTasks);

/**
 * @openapi
 * /api/v1/tasks:
 *   post:
 *     summary: Create a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/", validate(createTaskSchema), createTask);

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put("/:id", validate(updateTaskSchema), updateTask);

/**
 * @openapi
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/:id", validate(deleteTaskSchema), deleteTask);

export default router;
