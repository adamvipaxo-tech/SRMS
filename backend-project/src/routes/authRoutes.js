import { Router } from "express";
import {
  changePassword,
  createAdmin,
  deleteAdmin,
  getProfile,
  listAdmins,
  login
} from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/login", asyncHandler(login));
router.get("/me", authRequired, asyncHandler(getProfile));
router.get("/admins", authRequired, asyncHandler(listAdmins));
router.post("/change-password", authRequired, asyncHandler(changePassword));
router.post("/admins", authRequired, asyncHandler(createAdmin));
router.delete("/admins/:id", authRequired, asyncHandler(deleteAdmin));

export default router;
