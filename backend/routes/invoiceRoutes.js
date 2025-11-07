import express from "express";
import Invoice from "../models/invoiceModel.js"; // your Invoice schema
import { authMiddleware } from "../middleware/authMiddleware.js"; // optional if you have auth

const router = express.Router();

// Create invoice
router.post("/create", async (req, res) => {
  try {
    const { user, clientName, amount, description, category, status, date, dueDate } = req.body;
    const invoice = new Invoice({
      user,
      clientName,
      amount,
      description,
      category,
      status,
      date,
      dueDate
    });
    await invoice.save();
    res.json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating invoice" });
  }
});

// Get all invoices for a user
router.get("/all/:userId", async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json({ invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching invoices" });
  }
});

export default router;
