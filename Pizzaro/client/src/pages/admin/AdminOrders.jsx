import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const statuses = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  preparing: "bg-purple-50 text-purple-700",
  out_for_delivery: "bg-orange-50 text-orange-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem(
    "pizzaro_admin_token",
  );

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    fetchOrders();
  }, [token, navigate]);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("pizzaro_admin_token");
        localStorage.removeItem("pizzaro_admin");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load orders.",
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(
        err.message || "Unable to load orders.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      setUpdatingId(orderId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("pizzaro_admin_token");
        localStorage.removeItem("pizzaro_admin");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update order.",
        );
      }

      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? data.order
            : order,
        ),
      );
    } catch (err) {
      setError(
        err.message || "Unable to update order.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    if (filter === "all") {
      return orders;
    }

    return orders.filter(
      (order) => order.status === filter,
    );
  }, [orders, filter]);

  const activeOrders = orders.filter(
    (order) =>
      !["delivered", "cancelled"].includes(
        order.status,
      ),
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  );

  const paidOrders = orders.filter(
    (order) => order.payment?.status === "paid",
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page heading */}
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
              <span>Admin</span>
              <span>/</span>
              <span className="text-neutral-700">
                Orders
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Orders
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
              View incoming orders and manage their
              delivery progress.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path d="M20 11a8.1 8.1 0 0 0-15.3-3.8L3 9" />
              <path d="M3 4v5h5" />
              <path d="M4 13a8.1 8.1 0 0 0 15.3 3.8L21 15" />
              <path d="M21 20v-5h-5" />
            </svg>
            Refresh
          </button>
        </section>

        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total orders"
            value={orders.length}
            helper="All orders"
            icon="orders"
          />

          <SummaryCard
            label="Active orders"
            value={activeOrders.length}
            helper="Currently being processed"
            icon="active"
          />

          <SummaryCard
            label="Delivered"
            value={deliveredOrders.length}
            helper="Completed orders"
            icon="delivered"
          />

          <SummaryCard
            label="Paid orders"
            value={paidOrders.length}
            helper="Successful payments"
            icon="paid"
          />
        </section>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Filter navigation */}
        <section className="flex flex-col gap-4 border-b border-neutral-200 pb-1 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                filter === "all"
                  ? "border-neutral-900 text-neutral-950"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              All
            </button>

            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                  filter === status
                    ? "border-neutral-900 text-neutral-950"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>

          <p className="pb-3 text-xs text-neutral-400">
            Showing {filteredOrders.length} of{" "}
            {orders.length}
          </p>
        </section>

        {/* Orders */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl border border-neutral-200 bg-white"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <section className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
            <p className="font-medium text-neutral-800">
              No orders found
            </p>

            <p className="mt-1 text-sm text-neutral-400">
              Try another order status.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            {filteredOrders.map((order) => {
              const status =
                statusStyles[order.status] ||
                "bg-neutral-100 text-neutral-600";

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
                >
                  {/* Order header */}
                  <div className="border-b border-neutral-100 px-5 py-5 md:px-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                            Order #{order._id.slice(-8)}
                          </h2>

                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${status}`}
                          >
                            {statusLabels[order.status] ||
                              order.status}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm text-neutral-500">
                          <span>
                            {order.customer?.name}
                          </span>

                          <span>·</span>

                          <span>
                            {order.customer?.phone}
                          </span>

                          <span>·</span>

                          <span>
                            {order.customer?.city}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="sm:text-right">
                          <p className="text-xs text-neutral-400">
                            Order total
                          </p>

                          <p className="mt-0.5 text-xl font-semibold tracking-tight text-neutral-950">
                            ₹{order.subtotal}
                          </p>
                        </div>

                        <select
                          value={order.status}
                          disabled={
                            updatingId === order._id
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              order._id,
                              event.target.value,
                            )
                          }
                          className="min-w-[170px] rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 outline-none transition focus:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {statuses.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Order content */}
                  <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
                    {/* Items */}
                    <div className="rounded-2xl bg-neutral-50 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                          Items
                        </p>

                        <span className="text-xs text-neutral-400">
                          {order.items?.length || 0} item
                          {order.items?.length === 1
                            ? ""
                            : "s"}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {order.items?.map(
                          (item, index) => (
                            <div
                              key={`${item.productId || item.name}-${index}`}
                              className="flex items-start justify-between gap-4"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-neutral-800">
                                  {item.name}
                                </p>

                                <p className="mt-0.5 text-xs text-neutral-400">
                                  Qty {item.quantity}
                                </p>
                              </div>

                              <p className="shrink-0 text-sm font-semibold text-neutral-900">
                                ₹{item.lineTotal}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Delivery */}
                    <div className="rounded-2xl bg-neutral-50 p-5">
                      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                        Delivery
                      </p>

                      <p className="text-sm font-medium text-neutral-800">
                        {order.customer?.address}
                      </p>

                      <p className="mt-1 text-sm text-neutral-600">
                        {order.customer?.city},{" "}
                        {order.customer?.state}{" "}
                        {order.customer?.pincode}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-500 ring-1 ring-neutral-200">
                          Payment:{" "}
                          {order.payment?.status ||
                            "unknown"}
                        </span>

                        {order.payment?.provider && (
                          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-500 ring-1 ring-neutral-200">
                            {order.payment.provider}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col gap-2 border-t border-neutral-100 px-5 py-4 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between md:px-6">
                    <span>
                      Order ID: {order._id}
                    </span>

                    <span>
                      {order.createdAt
                        ? new Date(
                            order.createdAt,
                          ).toLocaleString()
                        : ""}
                    </span>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </AdminLayout>
  );
}

function SummaryCard({
  label,
  value,
  helper,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            {value}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {helper}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
          {icon === "orders" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M5 4h14v16H5z" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          )}

          {icon === "active" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v4l3 2" />
            </svg>
          )}

          {icon === "delivered" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          )}

          {icon === "paid" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M9 12h6M12 9v6" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}