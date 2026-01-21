import express from "express";
import { readData } from "../utils/util.js";

const router = express.Router();


router.get("/allorders", (req, res) => {
  const { orders } = readData();
  res.json({ count: orders.length, orders });
});


router.get("/cancelled-orders", (req, res) => {
  const { orders } = readData();
  const cancelled = orders.filter(o => o.status === "cancelled");

  res.json({ count: cancelled.length, orders: cancelled });
});



export default router;
