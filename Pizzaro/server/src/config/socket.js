import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import { Server } from "socket.io";

let io;

export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  // -------------------------
  // AUTHENTICATE SOCKET
  // -------------------------
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(
          new Error("Authentication required."),
        );
      }

      if (!process.env.JWT_SECRET) {
        return next(
          new Error("JWT_SECRET is not configured."),
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      );

      if (decoded.role !== "user") {
        return next(
          new Error("User access required."),
        );
      }

      socket.user = decoded;

      next();
    } catch (error) {
      console.error(
        "Socket authentication error:",
        error.message,
      );

      next(new Error("Invalid or expired token."));
    }
  });

  // -------------------------
  // CONNECTION
  // -------------------------
  io.on("connection", (socket) => {
    console.log(
      `User socket connected: ${socket.id}`,
    );

    socket.on("join-order", async (orderId) => {
      try {
        if (!orderId) {
          return;
        }

        const order = await Order.findOne({
          _id: orderId,
          userId: socket.user.userId,
        }).select("_id");

        if (!order) {
          socket.emit("order-access-denied");
          return;
        }

        socket.join(`order:${orderId}`);

        console.log(
          `Socket ${socket.id} joined order:${orderId}`,
        );
      } catch (error) {
        console.error(
          "Join order error:",
          error.message,
        );

        socket.emit("order-access-denied");
      }
    });

    socket.on("disconnect", () => {
      console.log(
        `User socket disconnected: ${socket.id}`,
      );
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized.",
    );
  }

  return io;
}