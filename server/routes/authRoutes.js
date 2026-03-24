import express from "express";
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  forgotPassword, 
  resetPassword, 
  getAllUsers, 
  deleteUser 
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Profile
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);

// Addresses
router.post("/addresses", authMiddleware, addAddress);
router.put("/addresses/:id", authMiddleware, updateAddress);
router.delete("/addresses/:id", authMiddleware, deleteAddress);
router.put("/addresses/:id/default", authMiddleware, setDefaultAddress);

// Admin Routes
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;
