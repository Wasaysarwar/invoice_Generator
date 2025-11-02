import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clientName: String,
  amount: Number,
  description: String,
  category: String,
  status: String,
  date: String,
  dueDate: String
}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);
