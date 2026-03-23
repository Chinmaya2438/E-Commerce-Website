import express from "express";
import {
  getAllCoupons,
  createCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controllers/couponController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public / User Routes
router.post("/apply", authMiddleware, applyCoupon);

// Admin Routes
router.get("/", authMiddleware, adminMiddleware, getAllCoupons);
router.post("/", authMiddleware, adminMiddleware, createCoupon);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCoupon);

export default router;
