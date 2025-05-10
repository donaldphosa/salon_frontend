import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const productsFromDB = await sql.query(`
      SELECT * FROM products
      ORDER BY created_at DESC
    `);
    res.status(200).json({ success: true, data: productsFromDB });
  } catch (error) {
    console.log("Error in getProducts function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, image, price } = req.body;

  // Validate the input
  if (!name || !image || !price) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Using parameterized query to prevent SQL injection
    const result = await sql.query(`
      INSERT INTO products (name, image, price) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `, [name, image, price]); // Pass values as an array to the query

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.log("Error in createProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const product = await sql.query(`
      SELECT * FROM products WHERE id=${id}
    `);

    if (product.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log("Error in getProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const result = await sql.query(
      `
        UPDATE products
        SET name = $1, price = $2, image = $3
        WHERE id = $4
        RETURNING *
      `,
      [name, price, image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error in updateProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const deletedProduct = await sql.query(`
      DELETE FROM products WHERE id=${id} RETURNING *
    `);

    if (deletedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    console.log("Error in deleteProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
