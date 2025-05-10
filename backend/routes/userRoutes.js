// routes/userRoutes.js
import express from "express";
import { createUser, updateUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);  // Create a new user profile
router.put("/:id", updateUser);  // Update an existing user profile

export default router;
