import express from "express";
import { createStripeSession, verifyStripeSession } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create-session", createStripeSession);
router.post("/verify-session", verifyStripeSession);

export default router;
