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


router.get("/shipped", (req, res) => {
  const { orders } = readData();
  const shipped = orders.filter(o => o.status === "shipped");

  res.json({ count: shipped.length, orders: shipped });
});


router.get("/total-revenue/:productId", (req, res) => {
  const productId = Number(req.params.productId);
  const { orders, products } = readData();

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const totalRevenue = orders
    .filter(o => o.productId === productId && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.quantity * product.price, 0);

  res.json({ productId, totalRevenue });
});


router.get("/alltotalrevenue", (req, res) => {
  const { orders, products } = readData();

  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => {
      const product = products.find(p => p.id === o.productId);
      if (!product) return sum; // safety check
      return sum + o.quantity * product.price;
    }, 0);

  res.json({ totalRevenue });
});

export default router;
