import { Router } from "express";
import { createCustomer, listCustomers } from "../controllers/customerController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();
router.post("/", asyncHandler(createCustomer));
router.get("/", asyncHandler(listCustomers));

export default router;
