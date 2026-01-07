import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());

import ordersRouter from "./routes/orders.js";

/* Orders API */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/orders", ordersRouter);

app.listen(process.env.PORT || 4000, () => {
  console.log("Backend running on port 4000");
});