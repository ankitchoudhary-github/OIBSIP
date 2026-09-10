import { createServer } from "node:http";
import { initializeSocket } from "./config/socket.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

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
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);
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

  httpServer.listen(PORT, () => {
    console.log(`Pizzaro API running on http://localhost:${PORT}`);
  });
}

startServer();
