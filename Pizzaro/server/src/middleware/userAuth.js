import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    if (decoded.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "User access required.",
      });
    }

    const user = await User.findById(decoded.userId).select(
      "_id name email role emailVerified active",
    );

    if (!user || !user.active) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive or not found.",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email verification is required.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "User authentication error:",
      error.message,
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired user token.",
    });
  }
}