import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { authRequired } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/customers", authRequired, customerRoutes);
app.use("/api/products", authRequired, productRoutes);
app.use("/api/sales", authRequired, salesRoutes);
app.use("/api/reports", authRequired, reportsRoutes);
app.use("/api/dashboard", authRequired, dashboardRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
