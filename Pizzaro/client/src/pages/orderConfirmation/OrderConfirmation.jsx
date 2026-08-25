import { House } from "@phosphor-icons/react";
import TactileButton from "../../components/ui/TactileButton";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReceiptPrinter } from "./ReceiptPrinter";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("processing");

  /* =========================
     FETCH ORDER
  ========================== */

  useEffect(() => {
    let mounted = true;

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

        if (!mounted) {
          return;
        }

        setOrder(data.order);

        // Order has been loaded.
        // Start receipt printing.
        setStage("printing");
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(
          "Order fetch error:",
          error,
        );

        setError(
          error.message ||
          "Unable to load your order.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchOrder();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  /* =========================
     RECEIPT ANIMATION
  ========================== */

  useEffect(() => {
    if (!order) {
      return;
    }

    const printingTimer = setTimeout(() => {
      setStage("printing");
    }, 1000);

    return () => clearTimeout(printingTimer);
  }, [order]);

  useEffect(() => {
    if (stage !== "printing") {
      return;
    }

    const completeTimer = setTimeout(() => {
      setStage("complete");
    }, 3600);

    return () => clearTimeout(completeTimer);
  }, [stage]);

  /* =========================
     LOADING
  ========================== */

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

  /* =========================
     ERROR
  ========================== */

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

  /* =========================
     ORDER CONFIRMATION
  ========================== */

  return (
    <main className="min-h-screen bg-pizzaro-cream px-6 pb-24 pt-32">
      <div className="mx-auto flex max-w-2xl justify-center">
        <ReceiptPrinter.Root
          stage={stage}
          feedMotion="stepped"
          className="w-full"
        >
          {/* =========================
              PRINTER
          ========================== */}

          <ReceiptPrinter.Machine>
            <ReceiptPrinter.Header className="items-center">
              <div className="ml-2 flex h-full items-center font-display text-sm font-bold leading-none tracking-tight text-white">
                Pizzaro<span className="text-white">.</span>
              </div>

              <TactileButton
                depth="shallow"
                href="/"
                size="sm"
                mr-1
              >
                <House
                  aria-hidden="true"
                  size={13}
                  weight="fill"
                />
                Home
              </TactileButton>
            </ReceiptPrinter.Header>

            {/* =========================
                SCREEN
            ========================== */}

            <ReceiptPrinter.Screen>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Pizzaro Order
                    </p>

                    <p className="mt-1 text-xs text-white/50">
                      {stage === "processing" &&
                        "Processing payment"}

                      {stage === "printing" &&
                        "Payment confirmed"}

                      {stage === "complete" &&
                        "Your receipt is ready"}
                    </p>
                  </div>

                  <strong className="text-sm">
                    ₹{order.subtotal}
                  </strong>
                </div>

                <ReceiptPrinter.Status>
                  {stage === "processing" &&
                    "Processing your order"}

                  {stage === "printing" &&
                    "Printing your receipt"}

                  {stage === "complete" &&
                    "Order complete"}
                </ReceiptPrinter.Status>
              </div>
            </ReceiptPrinter.Screen>
          </ReceiptPrinter.Machine>

          {/* =========================
              RECEIPT OUTPUT
          ========================== */}

          <ReceiptPrinter.Output>
            <ReceiptPrinter.Paper>
              {/* Header */}
              <div className="text-center">
                <p className="font-display text-2xl font-bold tracking-tight text-black">
                  Pizzaro<span className="text-black">.</span>
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[2px] text-black/50">
                  Pizza Delivered Your Way
                </p>
              </div>

              <div className="my-4 border-t border-dashed border-black/15" />

              {/* Order information */}
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between gap-4">
                  <span>ORDER</span>

                  <span className="font-bold">
                    {order._id
                      .slice(-8)
                      .toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>PAYMENT</span>

                  <span className="font-bold uppercase">
                    {order.payment?.status ||
                      "pending"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>METHOD</span>

                  <span className="font-bold uppercase">
                    {order.payment?.provider ||
                      "razorpay"}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-black/15" />

              {/* Items List (Scrollable Container) */}
              {/* Items List (Scrollable Container aligned to right edge) */}
              <div className="max-h-44 overflow-y-auto pr-2 scrollbar-gutter:stable [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-black/5 [&::-webkit-scrollbar-thumb]:bg-black/25 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-black/40">
                {order.items.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="mb-3 last:mb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold">{item.name}</p>
                        <p className="mt-1 text-[9px] text-black/50">
                          Qty {item.quantity} × ₹{item.unitPrice}
                        </p>
                      </div>
                      <p className="shrink-0 text-[11px] font-bold">₹{item.lineTotal}</p>
                    </div>

                    {item.type === "custom" && item.customization && (
                      <div className="mt-2 text-[8px] leading-4 text-black/55">
                        <p>Base: {item.customization.baseId}</p>
                        <p>Sauce: {item.customization.sauceId}</p>
                        <p>Cheese: {item.customization.cheeseId}</p>
                        {item.customization.vegetableIds?.length > 0 && (
                          <p>Veg: {item.customization.vegetableIds.join(" · ")}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="my-4 border-t border-dashed border-black/15" />

              {/* Total */}
              <div className="flex items-center justify-between text-xs font-black">
                <span>TOTAL PAID</span>

                <span>
                  ₹{order.subtotal}
                </span>
              </div>

              <div className="mt-4 border-t border-dashed border-black/15 pt-4 text-center">
                <p className="text-[9px] uppercase tracking-[2px] text-black/45">
                  Thank you for ordering
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[2px] text-black/45">
                  with Pizzaro
                </p>
              </div>
            </ReceiptPrinter.Paper>
          </ReceiptPrinter.Output>
        </ReceiptPrinter.Root>
      </div>
    </main>
  );
};

export default OrderConfirmation;