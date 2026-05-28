import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  const user = rows[0];
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isHashed = user.passwordHash?.startsWith("$2");
  const isValid = isHashed
    ? await bcrypt.compare(password, user.passwordHash)
    : password === user.passwordHash;

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!isHashed) {
    const upgradedHash = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET passwordHash = ? WHERE id = ?", [upgradedHash, user.id]);
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "8h"
  });

  return res.json({ token, username: user.username });
};

export const getProfile = async (req, res) => {
  const [rows] = await pool.query("SELECT id, username, createdAt FROM users WHERE id = ?", [req.user.userId]);
  if (!rows.length) return res.status(404).json({ message: "User not found" });
  return res.json(rows[0]);
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "All password fields are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must have at least 6 characters" });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Password confirmation does not match" });
  }

  const [rows] = await pool.query("SELECT id, passwordHash FROM users WHERE id = ?", [req.user.userId]);
  const user = rows[0];
  if (!user) return res.status(404).json({ message: "User not found" });

  const isHashed = user.passwordHash?.startsWith("$2");
  const isValidCurrentPassword = isHashed
    ? await bcrypt.compare(currentPassword, user.passwordHash)
    : currentPassword === user.passwordHash;

  if (!isValidCurrentPassword) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET passwordHash = ? WHERE id = ?", [passwordHash, req.user.userId]);
  return res.json({ message: "Password changed successfully" });
};

export const createAdmin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must have at least 6 characters" });
  }

  const [exists] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
  if (exists.length) return res.status(409).json({ message: "Username already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.query("INSERT INTO users (username, passwordHash) VALUES (?, ?)", [
    username,
    passwordHash
  ]);

  return res.status(201).json({ message: "Admin created successfully", id: result.insertId, username });
};

export const listAdmins = async (_req, res) => {
  const [rows] = await pool.query(
    "SELECT id, username, createdAt FROM users ORDER BY createdAt DESC, username ASC"
  );
  return res.json(rows);
};

export const deleteAdmin = async (req, res) => {
  const targetAdminId = Number(req.params.id);
  if (!targetAdminId) return res.status(400).json({ message: "Invalid admin id" });

  if (targetAdminId === req.user.userId) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  const [adminRows] = await pool.query("SELECT id FROM users WHERE id = ?", [targetAdminId]);
  if (!adminRows.length) return res.status(404).json({ message: "Admin not found" });

  const [countRows] = await pool.query("SELECT COUNT(*) AS totalAdmins FROM users");
  if (Number(countRows[0].totalAdmins) <= 1) {
    return res.status(400).json({ message: "At least one admin account must remain" });
  }

  await pool.query("DELETE FROM users WHERE id = ?", [targetAdminId]);
  return res.json({ message: "Admin deleted successfully" });
};
