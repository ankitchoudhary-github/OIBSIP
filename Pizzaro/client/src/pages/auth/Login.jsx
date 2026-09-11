import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import {
  AUTH_CHANGED_EVENT,
} from "../../components/layout/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      window.dispatchEvent(
        new Event(AUTH_CHANGED_EVENT),
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,#fff1e8_0%,transparent_32%),linear-gradient(135deg,#fffaf6_0%,#ffffff_48%,#fff1e8_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[90vh] max-w-5xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white/90 shadow-[0_25px_80px_rgba(40,25,15,0.10)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">

          {/* LEFT BRAND PANEL */}
          <div className="relative hidden min-h-[650px] overflow-hidden border-r border-stone-100 bg-gradient-to-br from-[#fff9f4] via-[#fffdfb] to-[#fce9df] p-10 lg:flex lg:flex-col">

            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="relative z-20 w-fit text-left font-display text-2xl font-semibold tracking-tight text-stone-900"
            >
              Pizzaro
              <span className="text-[#E71E41]">.</span>
            </button>

            {/* Heading */}
            <div className="relative z-20 mt-20 max-w-md">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#E71E41]">
                Welcome to Pizzaro
              </p>

              <h2 className="font-display text-[3.2rem] font-extrabold leading-[1.02] tracking-tight text-stone-900">
                Your pizza.
                <br />
                <span className="text-[#E71E41]">
                  Your rules.
                </span>
              </h2>
            </div>

            {/* Hero Pizza */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-[-15px] left-1/2 w-[92%] max-w-[520px] -translate-x-1/2"
            >
              <motion.img
                src="/images/menu/hero-image.png"
                alt="Freshly prepared Pizzaro pizza"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full object-contain drop-shadow-[0_30px_35px_rgba(80,40,20,0.14)]"
              />
            </motion.div>

            {/* Minimal decorative accents */}
            <div className="absolute bottom-8 left-10 h-2 w-2 rounded-full bg-[#E71E41]" />

            <div className="absolute right-12 top-24 h-3 w-3 rounded-full bg-[#E9A15B]/70" />

            <div className="absolute right-24 top-12 h-16 w-16 rounded-full border border-[#E71E41]/10" />
          </div>

          {/* RIGHT LOGIN PANEL */}
          <div className="flex min-h-[650px] w-full flex-col justify-center bg-white p-8 sm:p-12 lg:p-14">
            <div className="mx-auto w-full max-w-sm">

              {/* Mobile Logo */}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mb-10 font-display text-2xl font-semibold tracking-tight text-stone-900 lg:hidden"
              >
                Pizzaro
                <span className="text-[#E71E41]">.</span>
              </button>

              {/* Heading */}
              <div className="mb-9">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E71E41]">
                  Sign in to Pizzaro
                </p>

                <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-[2.5rem]">
                  Welcome{" "}
                  <span className="text-[#E71E41]">
                    back.
                  </span>
                </h1>

                <p className="mt-3 text-sm leading-6 text-stone-500">
                  Sign in to view your orders and
                  track your deliveries.
                </p>
              </div>

              {/* Login Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-stone-700"
                  >
                    Email address
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
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-[#E71E41] focus:bg-white focus:ring-4 focus:ring-[#E71E41]/5"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-[10px] font-bold uppercase tracking-wider text-stone-700"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-[10px] font-bold text-[#E71E41] transition hover:text-[#C81A38] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value,
                        )
                      }
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 px-4 py-3.5 pr-16 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition focus:border-[#E71E41] focus:bg-white focus:ring-4 focus:ring-[#E71E41]/5"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 transition hover:text-stone-800"
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                    {error}
                  </div>
                )}

                {/* Sign In */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-full bg-gradient-to-r from-[#FF1A46] to-[#E71E41] py-4 text-[13px] font-bold text-white shadow-[0_10px_25px_rgba(231,30,65,0.22)] transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign In →"}
                </button>
              </form>

              {/* Register */}
              <div className="mt-7 text-center text-xs text-stone-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/register")
                  }
                  className="font-bold text-[#E71E41] hover:underline"
                >
                  Create one
                </button>
              </div>

              {/* Footer */}
              <div className="mt-8 border-t border-stone-100 pt-6 text-center">
                <p className="text-[10px] text-stone-400">
                  Fresh ingredients · Made to order ·
                  Your way
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}