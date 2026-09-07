import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const adminEmail = "admin@pizzaro.com";
const adminPassword = "Admin@12345";

export async function createAdmin() {
  const existingAdmin = await Admin.findOne({
    email: adminEmail,
  });

  if (existingAdmin) {
    console.log("Admin already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await Admin.create({
    name: "Pizzaro Admin",
    email: adminEmail,
    passwordHash,
    role: "admin",
    active: true,
  });

  console.log("Admin created successfully.");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
}