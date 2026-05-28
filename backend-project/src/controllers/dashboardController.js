import pool from "../config/db.js";

export const getDashboard = async (_req, res) => {
  const [summaryRows] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM customers) AS totalCustomers,
      (SELECT COUNT(*) FROM products) AS totalProducts,
      (SELECT COUNT(*) FROM sales) AS totalSales,
      (SELECT COALESCE(SUM(totalAmountPaid), 0) FROM sales) AS totalRevenue
  `);

  const [inventoryRows] = await pool.query(`
    SELECT
      p.productCode,
      p.productName,
      p.quantitySold AS initialStock,
      COALESCE(SUM(s.quantitySold), 0) AS soldUnits,
      (p.quantitySold - COALESCE(SUM(s.quantitySold), 0)) AS remainingItems,
      p.unitPrice
    FROM products p
    LEFT JOIN sales s ON s.productCode = p.productCode
    GROUP BY p.productCode, p.productName, p.quantitySold, p.unitPrice
    ORDER BY p.productName ASC
  `);

  const [recentSales] = await pool.query(`
    SELECT
      s.invoiceNumber,
      s.salesDate,
      c.customerNumber,
      CONCAT(c.firstName, ' ', c.lastName) AS customerName,
      p.productCode,
      p.productName,
      s.quantitySold,
      p.unitPrice,
      s.paymentMethod,
      s.totalAmountPaid
    FROM sales s
    JOIN customers c ON c.customerNumber = s.customerNumber
    JOIN products p ON p.productCode = s.productCode
    ORDER BY s.invoiceNumber DESC
    LIMIT 10
  `);

  return res.json({
    summary: {
      totalCustomers: Number(summaryRows[0].totalCustomers || 0),
      totalProducts: Number(summaryRows[0].totalProducts || 0),
      totalSales: Number(summaryRows[0].totalSales || 0),
      totalRevenue: Number(summaryRows[0].totalRevenue || 0)
    },
    inventory: inventoryRows.map((item) => ({
      ...item,
      initialStock: Number(item.initialStock || 0),
      soldUnits: Number(item.soldUnits || 0),
      remainingItems: Number(item.remainingItems || 0),
      unitPrice: Number(item.unitPrice || 0)
    })),
    recentSales
  });
};
