// controllers/userController.js
import { sql } from "../config/db.js";

// Create a new user
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Username, email, and password are required",
    });
  }

  try {
    const { rows: newUser } = await sql.query(
      `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `,
      [username, email, password]
    );

    res.status(201).json({ success: true, data: newUser[0] });
  } catch (error) {
    console.error("Error in createUser function:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Update an existing user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, profile_picture } = req.body;

  // Validate if any field is provided to update
  if (!username && !email && !password && !profile_picture) {
    return res.status(400).json({ success: false, message: "At least one field is required to update" });
  }

  try {
    // Updating the user details
    const { rows: updatedUser } = await sql.query(`
      UPDATE users
      SET username = COALESCE($1, username),
          email = COALESCE($2, email),
          password = COALESCE($3, password),
          profile_picture = COALESCE($4, profile_picture)
      WHERE id = $5
      RETURNING id, username, email, profile_picture, created_at
    `, [username, email, password, profile_picture, id]);

    if (updatedUser.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: updatedUser[0] });
  } catch (error) {
    console.log("Error in updateUser function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// controllers/userController.js
export const signInUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { rows } = await sql.query("SELECT * FROM users WHERE email = $1", [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    delete user.password; // Remove password before sending back
    return res.status(200).json({ success: true, data: user });

  } catch (error) {
    console.error("Error in signInUser", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
