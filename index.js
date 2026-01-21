import express from "express";
import productsRouter from "./routes/products.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

const app = express();
const PORT = 3000;


app.use(express.json());


app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/analytics", analyticsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
