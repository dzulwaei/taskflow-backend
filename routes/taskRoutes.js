/**
 * Task route definitions.
 * All task endpoints require authentication and provide CRUD operations.
 */
import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from "../controllers/taskController.js";

const router = express.Router();

// All task routes require authentication
router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;