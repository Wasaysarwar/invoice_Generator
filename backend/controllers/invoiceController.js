import Invoice from "../models/Invoice.js";

export const createInvoice = async (req, res) => {
  try {
    const { userId, companyName, clientName, items, totalAmount, currency } = req.body;

    const invoice = new Invoice({
      userId,
      companyName,
      clientName,
      items,
      totalAmount,
      currency,
    });

    await invoice.save();

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    console.error("❌ Error saving invoice:", error.message);
    res.status(500).json({ success: false, message: "Failed to save invoice" });
  }
};
