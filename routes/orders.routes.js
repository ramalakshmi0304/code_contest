import express from "express";
import { readData, writeData } from "../utils/util.js";

const router = express.Router();


router.post("/add", (req, res) => {
  let { productId, quantity } = req.body;

  productId = Number(productId);
  quantity = Number(quantity);

  if (!productId || quantity <= 0) {
    return res.status(400).json({ error: "Invalid productId or quantity" });
  }

  const data = readData();
  const product = data.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (quantity > product.stock) {
    return res.status(400).json({ error: "Insufficient stock" });
  }

  const newOrder = {
    id: Date.now(),
    productId,
    quantity,
    totalAmount: product.price * quantity,
    status: "placed",
    createdAt: new Date().toISOString().split("T")[0]
  };

  product.stock -= quantity;
  data.orders.push(newOrder);

  writeData(data);

  res.status(201).json({ message: "Order placed", order: newOrder });
});


router.get("/", (req, res) => {
  const data = readData();
  res.json({ orders: data.orders });
});


router.delete("/:orderId", (req, res) => {
  const orderId = Number(req.params.orderId);
  const data = readData();

  const order = data.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (order.status === "cancelled") {
    return res.status(400).json({ error: "Order already cancelled" });
  }

  const today = new Date().toISOString().split("T")[0];
  if (order.createdAt !== today) {
    return res.status(400).json({ error: "Cancellation allowed only on same day" });
  }

  order.status = "cancelled";

  const product = data.products.find(p => p.id === order.productId);
  if (product) {
    product.stock += order.quantity;
  }

  writeData(data);
  res.json({ message: "Order cancelled", order });
});


router.patch("/change-status/:orderId", (req, res) => {
  const orderId = Number(req.params.orderId);
  const { status } = req.body;
  const data = readData();

  const order = data.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (["cancelled", "delivered"].includes(order.status)) {
    return res.status(400).json({ error: "Status change not allowed" });
  }

  const validFlow = {
    placed: "shipped",
    shipped: "delivered"
  };

  if (validFlow[order.status] !== status) {
    return res.status(400).json({ error: "Invalid order status flow" });
  }

  order.status = status;
  writeData(data);

  res.json({ message: "Order status updated", order });
});

export default router;
