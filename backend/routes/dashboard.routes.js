import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Dashboard routes working ✅");
});

export default router;
