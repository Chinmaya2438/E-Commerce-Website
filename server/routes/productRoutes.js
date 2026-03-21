import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createProductReview,
} from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
router.post("/:id/reviews", authMiddleware, createProductReview);

export default router;
