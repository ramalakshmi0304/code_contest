import express from "express";
import { readData, writeData } from "../utils/util.js";

const router = express.Router();

router.post("/add", (req, res) => {
    const { name, price, stock } = req.body;

    const data = readData();

    const newProduct = {
        id: Date.now(),
        name,
        price,
        stock
    };

    data.products.push(newProduct);
    writeData(data);  

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

router.get("/", (req, res) => {
    const data = readData();
    res.json({ products: data.products });
});

export default router;
