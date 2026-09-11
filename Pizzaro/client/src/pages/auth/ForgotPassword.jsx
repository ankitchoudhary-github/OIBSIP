import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setResetToken("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to process request.",
        );
      }

      setMessage(data.message);

      // Development only.
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      setError(
        err.message || "Unable to process request.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,#fff1e8_0%,transparent_32%),linear-gradient(135deg,#fffaf6_0%,#ffffff_48%,#fff1e8_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[90vh] max-w-5xl items-center justify-center">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-4xl border border-stone-200/70 bg-white shadow-[0_25px_80px_rgba(40,25,15,0.10)] lg:grid-cols-[1.05fr_0.95fr]">

          {/* LEFT BRAND PANEL */}
          <div className="relative hidden min-h-162.5 overflow-hidden border-r border-stone-100 bg-linear-to-br from-[#fff9f4] via-[#fffdfb] to-[#fce9df] p-10 lg:flex lg:flex-col">

            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="relative z-20 w-fit font-display text-2xl font-semibold tracking-tight text-stone-900"
            >
              Pizzaro
              <span className="text-[#E71E41]">.</span>
            </button>

            <div className="relative z-20 mt-20 max-w-md">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#E71E41]">
                Account recovery
              </p>

              <h2 className="font-display text-[3.1rem] font-extrabold leading-[1.03] tracking-tight text-stone-900">
                Get back to
                <br />
                <span className="text-[#E71E41]">
                  your Pizzaro.
                </span>
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-6 text-stone-500">
                Enter the email linked to your account
                and we'll help you get back in.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-3.75 left-1/2 w-[92%] max-w-130 -translate-x-1/2"
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

            <div className="absolute bottom-8 left-10 h-2 w-2 rounded-full bg-[#E71E41]" />
            <div className="absolute right-12 top-24 h-3 w-3 rounded-full bg-[#E9A15B]/70" />
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="flex min-h-162.5 w-full flex-col justify-center bg-white p-8 sm:p-12 lg:p-14">
            <div className="mx-auto w-full max-w-sm">

              {/* Mobile logo */}
              <Link
                to="/"
                className="mb-10 inline-block font-display text-2xl font-semibold tracking-tight text-stone-900 lg:hidden"
              >
                Pizzaro
                <span className="text-[#E71E41]">.</span>
              </Link>

              <div className="mb-9">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E71E41]">
                  Password recovery
                </p>

                <h1 className="font-display text-3xl font-extrabold tracking-tight text-stone-900 sm:text-[2.5rem]">
                  Forgot your{" "}
                  <span className="text-[#E71E41]">
                    password?
                  </span>
                </h1>

                <p className="mt-3 text-sm leading-6 text-stone-500">
                  Enter your email address and we'll
                  send instructions to reset your password.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
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

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs leading-5 text-green-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-linear-to-r from-[#FF1A46] to-[#E71E41] py-4 text-[13px] font-bold text-white shadow-[0_10px_25px_rgba(231,30,65,0.22)] transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Processing..."
                    : "Send Reset Link →"}
                </button>
              </form>

              {/* Development token */}
              {resetToken && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    Development mode
                  </p>

                  <p className="mb-3 break-all text-[11px] leading-5 text-amber-700">
                    Reset token:
                    <br />
                    {resetToken}
                  </p>

                  <Link
                    to={`/reset-password/${resetToken}`}
                    className="text-xs font-bold text-[#E71E41] hover:underline"
                  >
                    Continue to reset password →
                  </Link>
                </div>
              )}

              <div className="mt-7 text-center">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-stone-500 transition hover:text-[#E71E41]"
                >
                  ← Back to login
                </Link>
              </div>

              <div className="mt-8 border-t border-stone-100 pt-6 text-center">
                <p className="text-[10px] text-stone-400">
                  Your account. Your orders. Your pizza.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}