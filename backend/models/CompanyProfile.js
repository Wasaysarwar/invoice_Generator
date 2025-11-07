import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: String,
  address: String,
  email: String,
  phone: String,
  logoUrl: String,
  currency: { type: String, default: "USD" },
});

export default mongoose.model("CompanyProfile", profileSchema);
