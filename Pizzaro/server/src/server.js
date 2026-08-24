import orderRoutes from "./routes/orderRoutes.js";

import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { connectDB } from "./config/db.js";

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.use(helmet());
app.use(express.json());

app.use("/api/orders", orderRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Pizzaro API is running",
  });
});

/* =========================
   START SERVER
========================= */

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Pizzaro API running on http://localhost:${PORT}`,
    );
  });
}

startServer();