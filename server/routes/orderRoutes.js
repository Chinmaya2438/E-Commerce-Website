import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/", adminMiddleware, getAllOrders);
router.put("/:id/cancel", cancelOrder);
router.put("/:id", adminMiddleware, updateOrderStatus);

export default router;
