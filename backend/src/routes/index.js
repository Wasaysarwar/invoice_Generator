import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/profileController.js";
import { createInvoice, getInvoices } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

router.put("/profile", protect, updateProfile);
router.post("/invoices", protect, createInvoice);
router.get("/invoices", protect, getInvoices);

export default router;
