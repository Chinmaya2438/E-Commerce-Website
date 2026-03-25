import express from "express";
import { createCheckoutSession, verifyCheckoutSession } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create-checkout-session", createCheckoutSession);
router.post("/verify-session", verifyCheckoutSession);

export default router;
