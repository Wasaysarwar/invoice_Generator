import CompanyProfile from "../models/CompanyProfile.js";
import cloudinary from "../config/cloudinary.js";

export const updateProfile = async (req, res) => {
  try {
    let logoUrl;
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      logoUrl = upload.secure_url;
    }

    const updated = await CompanyProfile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, ...(logoUrl && { logoUrl }) },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
