import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Login failed.",
        );
      }

      localStorage.setItem(
        "pizzaro_user_token",
        data.token,
      );

      localStorage.setItem(
        "pizzaro_user",
        JSON.stringify(data.user),
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to sign in.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-pizzaro-cream px-4 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-6xl items-center justify-center">
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md rounded-3xl border border-pizzaro-dark/5 bg-white p-8 shadow-xl"
        >
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="font-display text-xl font-bold tracking-tight text-pizzaro-dark"
            >
              Pizzaro
              <span className="text-pizzaro-red">.</span>
            </button>

            <h1 className="mt-8 text-3xl font-semibold text-pizzaro-dark">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-pizzaro-muted">
              Sign in to view your orders and track
              your pizza.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-pizzaro-dark"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-pizzaro-dark/10 bg-white px-4 py-3 text-sm text-pizzaro-dark outline-none transition focus:border-pizzaro-red"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-pizzaro-dark"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-pizzaro-dark/10 bg-white px-4 py-3 text-sm text-pizzaro-dark outline-none transition focus:border-pizzaro-red"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pizzaro-red px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-pizzaro-muted">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-semibold text-pizzaro-red hover:underline"
            >
              Create one
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}