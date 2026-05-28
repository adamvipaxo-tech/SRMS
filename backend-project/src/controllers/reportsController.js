import pool from "../config/db.js";

const reportQuery = `
  SELECT s.invoiceNumber,
         s.salesDate,
         c.customerNumber,
         CONCAT(c.firstName, ' ', c.lastName) AS customerName,
         c.telephone,
         p.productCode,
         p.productName,
         s.quantitySold,
         p.unitPrice,
         s.paymentMethod,
         s.totalAmountPaid
  FROM sales s
  JOIN customers c ON c.customerNumber = s.customerNumber
  JOIN products p ON p.productCode = s.productCode
  WHERE s.salesDate BETWEEN ? AND ?
  ORDER BY s.salesDate DESC, s.invoiceNumber DESC
`;

export const getReports = async (req, res) => {
  const { range = "daily" } = req.query;
  const now = new Date();
  const end = now.toISOString().slice(0, 10);
  const start = new Date(now);

  if (range === "weekly") start.setDate(now.getDate() - 7);
  else if (range === "monthly") start.setMonth(now.getMonth() - 1);

  const startDate = start.toISOString().slice(0, 10);

  const [sales] = await pool.query(reportQuery, [startDate, end]);
  const [salesByDate] = await pool.query(
    `SELECT DATE(salesDate) AS period, COUNT(*) AS salesCount, SUM(totalAmountPaid) AS totalRevenue
     FROM sales
     WHERE salesDate BETWEEN ? AND ?
     GROUP BY DATE(salesDate)
     ORDER BY period DESC`,
    [startDate, end]
  );
  const [customerCount] = await pool.query("SELECT COUNT(*) AS totalCustomers FROM customers");
  const [productCount] = await pool.query("SELECT COUNT(*) AS totalProducts FROM products");
  const [saleCount] = await pool.query(
    "SELECT COUNT(*) AS totalSales, COALESCE(SUM(totalAmountPaid), 0) AS grandTotal FROM sales WHERE salesDate BETWEEN ? AND ?",
    [startDate, end]
  );

  return res.json({
    range,
    period: { startDate, endDate: end },
    totals: {
      customers: customerCount[0].totalCustomers,
      products: productCount[0].totalProducts,
      sales: saleCount[0].totalSales,
      revenue: Number(saleCount[0].grandTotal || 0)
    },
    salesByDate,
    salesDetails: sales
  });
};
