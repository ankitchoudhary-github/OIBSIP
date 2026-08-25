import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load order.",
          );
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Order fetch error:", error);

        setError(
          error.message ||
            "Unable to load your order.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-pizzaro-cream px-6 pb-24 pt-32">
        <div className="mx-auto max-w-2xl rounded-4xl bg-white px-6 py-16 text-center shadow-pizzaro">
          <p className="text-pizzaro-muted">
            Loading your order...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-pizzaro-cream px-6 pb-24 pt-32">
        <div className="mx-auto max-w-2xl rounded-4xl bg-white px-6 py-16 text-center shadow-pizzaro">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-3xl">
            !
          </div>

          <h1 className="mt-6 font-display text-3xl font-bold text-pizzaro-dark">
            Order not found
          </h1>

          <p className="mt-3 text-pizzaro-muted">
            {error ||
              "We couldn't find this order."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-8 rounded-full bg-pizzaro-dark px-7 py-4 text-sm font-semibold text-white transition hover:bg-pizzaro-red"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pizzaro-cream px-6 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-4xl bg-white px-6 py-12 shadow-pizzaro sm:px-10 sm:py-16">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✓
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[4px] text-pizzaro-red">
              ORDER CONFIRMED
            </p>

            <h1 className="mt-3 font-display text-4xl font-bold text-pizzaro-dark md:text-5xl">
              Pizza is on the way.
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-pizzaro-muted">
              Your payment has been verified and your
              order is confirmed.
            </p>
          </div>

          {/* Order details */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-pizzaro-cream px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[2px] text-pizzaro-muted">
                Order ID
              </p>

              <p className="mt-2 break-all font-mono text-sm font-semibold text-pizzaro-dark">
                {order._id}
              </p>
            </div>

            <div className="rounded-2xl bg-pizzaro-cream px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[2px] text-pizzaro-muted">
                Payment
              </p>

              <p className="mt-2 text-sm font-bold capitalize text-green-600">
                {order.payment?.status || "pending"}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold text-pizzaro-dark">
              Your order
            </h2>

            <div className="mt-5 space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={`${item.productId || item.name}-${index}`}
                  className="flex items-start justify-between gap-4 rounded-2xl bg-pizzaro-cream p-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-pizzaro-dark">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-pizzaro-muted">
                      Qty: {item.quantity}
                    </p>

                    {item.type === "custom" &&
                      item.customization && (
                        <div className="mt-2 text-xs leading-5 text-pizzaro-muted">
                          <p>
                            Base:{" "}
                            {item.customization.baseId}
                          </p>

                          <p>
                            Sauce:{" "}
                            {item.customization.sauceId}
                          </p>

                          <p>
                            Cheese:{" "}
                            {item.customization.cheeseId}
                          </p>

                          {item.customization
                            .vegetableIds
                            ?.length > 0 && (
                            <p>
                              Vegetables:{" "}
                              {item.customization.vegetableIds.join(
                                " · ",
                              )}
                            </p>
                          )}
                        </div>
                      )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-pizzaro-dark">
                      ₹{item.lineTotal}
                    </p>

                    <p className="mt-1 text-xs text-pizzaro-muted">
                      ₹{item.unitPrice} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="mt-8 border-t border-black/5 pt-6">
            <div className="flex items-end justify-between">
              <span className="text-sm text-pizzaro-muted">
                Total paid
              </span>

              <span className="font-display text-3xl font-bold text-pizzaro-dark">
                ₹{order.subtotal}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full bg-pizzaro-dark px-7 py-4 text-sm font-semibold text-white transition hover:bg-pizzaro-red"
            >
              Back to Home
            </button>

            <button
              type="button"
              onClick={() => navigate("/menu")}
              className="rounded-full border border-gray-200 px-7 py-4 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red"
            >
              View Menu
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrderConfirmation;