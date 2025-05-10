// routes/appointmentRoutes.js
import express from "express";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointments,
  getAppointmentById
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", getAppointments);  // Get all appointments
router.post("/", createAppointment);  // Create a new appointment
router.put("/:id", updateAppointment);  // Update an existing appointment
router.delete("/:id", deleteAppointment);  // Delete an appointment
router.get("/:id", getAppointmentById);

export default router;
