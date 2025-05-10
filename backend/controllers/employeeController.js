import { sql } from "../config/db.js";

export const getEmployees = async (req, res) => {
  try {
    const { rows: employees } = await sql.query(`
      SELECT id, name, surname, email, phone, created_at FROM employees
    `);
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    console.log("Error in getEmployees function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createEmployee = async (req, res) => {
  const { name, surname, email, phone } = req.body;

  // Validation check
  if (!name || !surname || !email) {
    return res.status(400).json({ success: false, message: "Name, Surname, and Email are required" });
  }

  try {
    const result = await sql.query(`
      INSERT INTO employees (name, surname, email, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, surname, email, phone, created_at
    `, [name, surname, email, phone]);
  
    if (!result.rows || result.rows.length === 0) {
      throw new Error("No employee returned after insert");
    }
  
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error in createEmployee function:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, phone } = req.body;

  // Validation check
  if (!name && !surname && !email && !phone) {
    return res.status(400).json({ success: false, message: "At least one field is required to update" });
  }

  try {
    // Updating employee details
    const { rows: updatedEmployee } = await sql.query(`
      UPDATE employees
      SET name = COALESCE($1, name),
          surname = COALESCE($2, surname),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone)
      WHERE id = $5
      RETURNING id, name, surname, email, phone, created_at
    `, [name, surname, email, phone, id]);

    if (updatedEmployee.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, data: updatedEmployee[0] });
  } catch (error) {
    console.log("Error in updateEmployee function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    // Deleting employee from the database
    const { rows: deletedEmployee } = await sql.query(`
      DELETE FROM employees WHERE id = $1
      RETURNING id, name, surname, email, phone, created_at
    `, [id]);

    if (deletedEmployee.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, data: deletedEmployee[0] });
  } catch (error) {
    console.log("Error in deleteEmployee function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await sql.query(
      `SELECT id, name, surname, email, phone, created_at FROM employees WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error in getEmployeeById function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
