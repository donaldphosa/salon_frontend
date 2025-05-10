// controllers/appointmentController.js
import { sql } from "../config/db.js";

export const createAppointment = async (req, res) => {
  console.log(req.body);

  const {
    employeeName,
    employeeSurname,
    customerName,
    customerSurname,
    appointmentType,
    price,
    appointmentDate,
  } = req.body;

  if (
    !employeeName ||
    !employeeSurname ||
    !customerName ||
    !customerSurname ||
    !appointmentType ||
    !price ||
    !appointmentDate
  ) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const { rows: newAppointment } = await sql.query(
      `INSERT INTO appointments (
        employeeName, employeeSurname, customerName, customerSurname,
        appointmentType, price, appointmentDate
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, employeeName, employeeSurname, customerName, customerSurname,
                appointmentType, price, appointmentDate, created_at`,
      [
        employeeName,
        employeeSurname,
        customerName,
        customerSurname,
        appointmentType,
        price,
        appointmentDate,
      ]
    );

    res.status(201).json({ success: true, data: newAppointment[0] });
  } catch (error) {
    console.log("Error in createAppointment function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {
    employeeName,
    employeeSurname,
    customerName,
    customerSurname,
    appointmentType,
    price,
    appointmentDate,
  } = req.body;

  if (
    !employeeName &&
    !employeeSurname &&
    !customerName &&
    !customerSurname &&
    !appointmentType &&
    !price &&
    !appointmentDate
  ) {
    return res.status(400).json({ success: false, message: "At least one field is required to update" });
  }

  try {
    const { rows: updatedAppointment } = await sql.query(
      `UPDATE appointments
       SET employeeName = COALESCE($1, employeeName),
           employeeSurname = COALESCE($2, employeeSurname),
           customerName = COALESCE($3, customerName),
           customerSurname = COALESCE($4, customerSurname),
           appointmentType = COALESCE($5, appointmentType),
           price = COALESCE($6, price),
           appointmentDate = COALESCE($7, appointmentDate)
       WHERE id = $8
       RETURNING id, employeeName, employeeSurname, customerName, customerSurname,
                 appointmentType, price, appointmentDate, created_at`,
      [
        employeeName,
        employeeSurname,
        customerName,
        customerSurname,
        appointmentType,
        price,
        appointmentDate,
        id,
      ]
    );

    if (updatedAppointment.length === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: updatedAppointment[0] });
  } catch (error) {
    console.log("Error in updateAppointment function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows: deletedAppointment } = await sql.query(
      `DELETE FROM appointments
       WHERE id = $1
       RETURNING id, employeeName, employeeSurname, customerName, customerSurname,
                 appointmentType, price, appointmentDate, created_at`,
      [id]
    );

    if (deletedAppointment.length === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: deletedAppointment[0] });
  } catch (error) {
    console.log("Error in deleteAppointment function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { rows: appointments } = await sql.query(
      `SELECT id, employeeName, employeeSurname, customerName, customerSurname,
              appointmentType, price, appointmentDate, created_at
       FROM appointments
       ORDER BY appointmentDate DESC`
    );

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.log("Error in getAppointments function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows: appointment } = await sql.query(
      `SELECT id, EmployeeName, EmployeeSurname, customerName, customerSurname,
              appointmentType, price, appointmentDate, created_at
       FROM appointments
       WHERE id = $1`,
      [id]
    );

    if (appointment.length === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: appointment[0] });
  } catch (error) {
    console.log("Error in getAppointmentById function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
