import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusLabels = {
  pending: "Order received",
  confirmed: "Confirmed",
  preparing: "In kitchen",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(
      "pizzaro_user_token",
    );

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    loadDashboard(token);
  }, [navigate]);

  async function loadDashboard(token) {
    try {
      setLoading(true);
      setError("");

      const [userResponse, ordersResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_URL}/api/orders/my-orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const userData = await userResponse.json();
      const ordersData = await ordersResponse.json();

      if (
        userResponse.status === 401 ||
        userResponse.status === 403 ||
        ordersResponse.status === 401 ||
        ordersResponse.status === 403
      ) {
        localStorage.removeItem("pizzaro_user_token");
        localStorage.removeItem("pizzaro_user");
        navigate("/login", { replace: true });
        return;
      }

      if (!userResponse.ok || !userData.success) {
        throw new Error(
          userData.message || "Unable to load your account.",
        );
      }

      if (!ordersResponse.ok || !ordersData.success) {
        throw new Error(
          ordersData.message || "Unable to load your orders.",
        );
      }

      setUser(userData.user);
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err.message || "Unable to load your dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("pizzaro_user_token");
    localStorage.removeItem("pizzaro_user");

    navigate("/", { replace: true });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-pizzaro-cream px-6 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-64 animate-pulse rounded-xl bg-white/70" />
          <div className="mt-4 h-5 w-80 animate-pulse rounded-xl bg-white/70" />

          <div className="mt-10 h-64 animate-pulse rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pizzaro-cream px-6 pb-20 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-6xl"
      >
        {/* Header */}
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[3px] text-pizzaro-red">
              MY ACCOUNT
            </p>

            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-pizzaro-dark">
              Welcome, {user?.name}
            </h1>

            <p className="mt-2 text-pizzaro-muted">
              Track your orders and manage your account.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-fit rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red"
          >
            Sign out
          </button>
        </section>

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Account card */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-pizzaro sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-pizzaro-muted">
            Account
          </p>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs text-pizzaro-muted">
                Name
              </p>

              <p className="mt-1 font-semibold text-pizzaro-dark">
                {user?.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-pizzaro-muted">
                Email
              </p>

              <p className="mt-1 font-semibold text-pizzaro-dark">
                {user?.email}
              </p>
            </div>
          </div>
        </section>

        {/* Orders */}
        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[2px] text-pizzaro-muted">
                ORDER HISTORY
              </p>

              <h2 className="mt-2 font-display text-3xl font-bold text-pizzaro-dark">
                Your orders
              </h2>
            </div>

            <span className="text-sm text-pizzaro-muted">
              {orders.length} order
              {orders.length === 1 ? "" : "s"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="mt-5 rounded-3xl bg-white p-10 text-center shadow-pizzaro">
              <h3 className="font-display text-xl font-bold text-pizzaro-dark">
                No orders yet
              </h3>

              <p className="mt-2 text-sm text-pizzaro-muted">
                Your completed orders will appear here.
              </p>

              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="mt-6 rounded-full bg-pizzaro-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-3xl bg-white p-6 shadow-pizzaro"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-pizzaro-muted">
                        Order #
                        {order._id.slice(-8).toUpperCase()}
                      </p>

                      <p className="mt-1 text-lg font-bold text-pizzaro-dark">
                        ₹{order.subtotal}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-pizzaro-cream px-4 py-2 text-xs font-semibold text-pizzaro-dark">
                      {statusLabels[order.status] ||
                        order.status}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-black/5 pt-5">
                    <div className="space-y-2">
                      {order.items?.map(
                        (item, index) => (
                          <div
                            key={`${item.name}-${index}`}
                            className="flex justify-between gap-4 text-sm"
                          >
                            <span className="text-pizzaro-muted">
                              {item.quantity} ×{" "}
                              {item.name}
                            </span>

                            <span className="font-semibold text-pizzaro-dark">
                              ₹{item.lineTotal}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/order-confirmation/${order._id}`,
                      )
                    }
                    className="mt-5 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red"
                  >
                    View order
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </main>
  );
}