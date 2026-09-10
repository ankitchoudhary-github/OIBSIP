import { io } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export function createUserSocket() {
  const token = localStorage.getItem(
    "pizzaro_user_token",
  );

  if (!token) {
    return null;
  }

  return io(API_URL, {
    auth: {
      token,
    },
  });
}