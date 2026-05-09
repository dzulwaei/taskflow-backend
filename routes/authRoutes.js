/**
 * Authentication route definitions.
 * Exposes registration, login, and protected profile endpoints.
 */
import express from "express";
import { getMe, loginUser, registerUser } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public auth endpoints and protected current user endpoint
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;