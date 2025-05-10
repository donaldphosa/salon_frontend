// routes/employeeRoutes.js
import express from "express";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployeeById
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", getEmployees);  // Get all employees
router.get("/:id", getEmployeeById);  // Get all employees
router.post("/", createEmployee);  // Create a new employee
router.put("/:id", updateEmployee);  // Update an existing employee
router.delete("/:id", deleteEmployee);  // Delete an employee

export default router;
