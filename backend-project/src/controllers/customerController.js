import pool from "../config/db.js";

export const createCustomer = async (req, res) => {
  const { firstName, lastName, telephone, address } = req.body;
  if (!firstName || !lastName || !telephone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const [result] = await pool.query(
    "INSERT INTO customers (firstName, lastName, telephone, address) VALUES (?, ?, ?, ?)",
    [firstName, lastName, telephone, address]
  );

  return res.status(201).json({ message: "Customer created", customerNumber: result.insertId });
};

export const listCustomers = async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM customers ORDER BY customerNumber DESC");
  return res.json(rows);
};
