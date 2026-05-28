import { Router } from "express";
import { createSale, deleteSale, listSales, updateSale } from "../controllers/salesController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();
router.post("/", asyncHandler(createSale));
router.get("/", asyncHandler(listSales));
router.put("/:id", asyncHandler(updateSale));
router.delete("/:id", asyncHandler(deleteSale));

export default router;
