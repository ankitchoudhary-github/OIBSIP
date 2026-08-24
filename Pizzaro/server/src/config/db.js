import dns from "node:dns";
import mongoose from "mongoose";

/*
  Use public DNS servers for MongoDB Atlas SRV lookups.
*/
dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message,
    );

    process.exit(1);
  }
}