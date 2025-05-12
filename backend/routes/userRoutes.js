import express from "express";
import { createUser, updateUser, signInUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);           // Signup route
router.post("/signin", signInUser);     // Signin route
router.put("/:id", updateUser);         // Update profile route

export default router;
