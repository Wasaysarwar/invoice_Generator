import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Profile routes working ✅");
});

export default router;
