import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ override: true });

const normalizeEnv = (value) => {
  if (value === undefined || value === null) return undefined;
  const trimmed = String(value).trim();
  return trimmed === "" ? undefined : trimmed;
};

const pool = mysql.createPool({
  host: normalizeEnv(process.env.DB_HOST) || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: normalizeEnv(process.env.DB_USER),
  password: normalizeEnv(process.env.DB_PASSWORD),
  database: normalizeEnv(process.env.DB_NAME),
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
