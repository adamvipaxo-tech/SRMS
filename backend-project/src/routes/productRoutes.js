import { Router } from "express";
import { createProduct, listProducts } from "../controllers/productController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();
router.post("/", asyncHandler(createProduct));
router.get("/", asyncHandler(listProducts));

export default router;
