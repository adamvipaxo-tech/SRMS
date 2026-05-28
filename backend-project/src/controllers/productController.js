import pool from "../config/db.js";

export const createProduct = async (req, res) => {
  const { productName, quantitySold, unitPrice } = req.body;
  if (!productName || quantitySold === undefined || !unitPrice) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const [result] = await pool.query(
    "INSERT INTO products (productName, quantitySold, unitPrice) VALUES (?, ?, ?)",
    [productName, quantitySold, unitPrice]
  );

  return res.status(201).json({ message: "Product created", productCode: result.insertId });
};

export const listProducts = async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM products ORDER BY productCode DESC");
  return res.json(rows);
};
