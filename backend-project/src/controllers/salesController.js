import pool from "../config/db.js";

const salesSelectQuery = `
  SELECT s.invoiceNumber, s.salesDate, s.paymentMethod, s.totalAmountPaid, s.quantitySold,
         c.customerNumber, CONCAT(c.firstName, ' ', c.lastName) AS customerName,
         p.productCode, p.productName, p.unitPrice
  FROM sales s
  JOIN customers c ON c.customerNumber = s.customerNumber
  JOIN products p ON p.productCode = s.productCode
`;

export const createSale = async (req, res) => {
  const { customerNumber, productCode, quantitySold, salesDate, paymentMethod } = req.body;
  if (!customerNumber || !productCode || !quantitySold || !salesDate || !paymentMethod) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const [products] = await pool.query("SELECT unitPrice FROM products WHERE productCode = ?", [productCode]);
  if (!products.length) return res.status(404).json({ message: "Product not found" });

  const totalAmountPaid = Number(products[0].unitPrice) * Number(quantitySold);

  const [result] = await pool.query(
    `INSERT INTO sales (customerNumber, productCode, quantitySold, salesDate, paymentMethod, totalAmountPaid)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [customerNumber, productCode, quantitySold, salesDate, paymentMethod, totalAmountPaid]
  );

  return res.status(201).json({ message: "Sale created", invoiceNumber: result.insertId, totalAmountPaid });
};

export const listSales = async (_req, res) => {
  const [rows] = await pool.query(`${salesSelectQuery} ORDER BY s.invoiceNumber DESC`);
  return res.json(rows);
};

export const updateSale = async (req, res) => {
  const { id } = req.params;
  const { customerNumber, productCode, quantitySold, salesDate, paymentMethod } = req.body;
  if (!customerNumber || !productCode || !quantitySold || !salesDate || !paymentMethod) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const [products] = await pool.query("SELECT unitPrice FROM products WHERE productCode = ?", [productCode]);
  if (!products.length) return res.status(404).json({ message: "Product not found" });

  const totalAmountPaid = Number(products[0].unitPrice) * Number(quantitySold);

  await pool.query(
    `UPDATE sales
     SET customerNumber = ?, productCode = ?, quantitySold = ?, salesDate = ?, paymentMethod = ?, totalAmountPaid = ?
     WHERE invoiceNumber = ?`,
    [customerNumber, productCode, quantitySold, salesDate, paymentMethod, totalAmountPaid, id]
  );

  return res.json({ message: "Sale updated", totalAmountPaid });
};

export const deleteSale = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM sales WHERE invoiceNumber = ?", [id]);
  return res.json({ message: "Sale deleted" });
};
