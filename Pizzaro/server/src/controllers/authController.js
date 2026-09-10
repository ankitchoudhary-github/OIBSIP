import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    // -------------------------
    // 1. BASIC VALIDATION
    // -------------------------
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    // -------------------------
    // 2. CHECK EXISTING USER
    // -------------------------
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // -------------------------
    // 3. HASH PASSWORD
    // -------------------------
    const passwordHash = await bcrypt.hash(password, 12);

    // -------------------------
    // 4. CREATE VERIFICATION TOKEN
    // -------------------------
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const verificationTokenExpiresAt = new Date(
      Date.now() + 15 * 60 * 1000,
    );

    // -------------------------
    // 5. CREATE USER
    // -------------------------
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      role: "user",
      emailVerified: false,
      emailVerificationTokenHash: verificationTokenHash,
      emailVerificationTokenExpiresAt:
        verificationTokenExpiresAt,
      active: true,
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please verify your email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },

      // DEVELOPMENT ONLY:
      // We will replace this with an email later.
      verificationToken,
    });
  } catch (error) {
    console.error(
      "User registration error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Unable to register user.",
    });
  }
}