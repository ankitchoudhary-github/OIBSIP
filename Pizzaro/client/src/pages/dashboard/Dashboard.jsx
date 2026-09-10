import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { createUserSocket } from "../../config/socket";
import {
    ArrowRight,
    CheckCircle,
    Clock3,
    LogOut,
    MapPin,
    Package,
    Pizza,
    ShoppingBag,
    User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusLabels = {
    pending: "Order received",
    confirmed: "Confirmed",
    preparing: "Preparing",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const statusColors = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    preparing: "bg-purple-50 text-purple-700",
    out_for_delivery: "bg-orange-50 text-orange-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
};

const trackingSteps = [
    {
        key: "pending",
        label: "Order received",
        description: "We've received your order.",
    },
    {
        key: "confirmed",
        label: "Confirmed",
        description: "Your order has been confirmed.",
    },
    {
        key: "preparing",
        label: "Preparing",
        description: "Your pizza is being prepared.",
    },
    {
        key: "out_for_delivery",
        label: "Out for delivery",
        description: "Your order is on its way.",
    },
    {
        key: "delivered",
        label: "Delivered",
        description: "Enjoy your Pizzaro order.",
    },
];

const statusRank = {
    pending: 0,
    confirmed: 1,
    preparing: 2,
    out_for_delivery: 3,
    delivered: 4,
};


export default function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [liveStatus, setLiveStatus] = useState(null);

    const userToken = localStorage.getItem(
        "pizzaro_user_token",
    );

    useEffect(() => {
        if (!userToken) {
            navigate("/login", { replace: true });
            return;
        }

        loadDashboard();
    }, [navigate, userToken]);

    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const [userResponse, ordersResponse] =
                await Promise.all([
                    fetch(`${API_URL}/api/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }),

                    fetch(`${API_URL}/api/orders/my-orders`, {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
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

                navigate("/login", {
                    replace: true,
                });

                return;
            }

            if (!userResponse.ok || !userData.success) {
                throw new Error(
                    userData.message ||
                    "Unable to load your account.",
                );
            }

            if (!ordersResponse.ok || !ordersData.success) {
                throw new Error(
                    ordersData.message ||
                    "Unable to load your orders.",
                );
            }

            setUser(userData.user);
            setOrders(ordersData.orders || []);
        } catch (err) {
            console.error("Dashboard error:", err);

            setError(
                err.message ||
                "Unable to load your dashboard.",
            );
        } finally {
            setLoading(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem("pizzaro_user_token");
        localStorage.removeItem("pizzaro_user");

        window.dispatchEvent(
            new Event("pizzaro:auth-changed"),
        );

        navigate("/", {
            replace: true,
        });
    }

    const activeOrder = useMemo(() => {
        return orders.find(
            (order) =>
                !["delivered", "cancelled"].includes(
                    order.status,
                ),
        );
    }, [orders]);
    useEffect(() => {
        setLiveStatus(null);
        
        if (!activeOrder?._id) {
            return;
        }

        const socket = createUserSocket();

        if (!socket) {
            return;
        }

        socket.on("connect", () => {
            console.log(
                "Customer Socket.IO connected:",
                socket.id,
            );

            socket.emit(
                "join-order",
                activeOrder._id,
            );
        });

        socket.on("order-status-updated", (data) => {
            if (data.orderId !== activeOrder._id) {
                return;
            }

            setLiveStatus(data.status);

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === data.orderId
                        ? {
                            ...order,
                            status: data.status,
                            updatedAt: data.updatedAt,
                        }
                        : order,
                ),
            );
        });

        socket.on("order-access-denied", () => {
            console.error(
                "Socket order access denied.",
            );
        });

        socket.on("connect_error", (error) => {
            console.error(
                "Socket connection error:",
                error.message,
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [activeOrder?._id]);


    const completedOrders = useMemo(() => {
        return orders.filter(
            (order) =>
                order.status === "delivered",
        );
    }, [orders]);

    if (loading) {
        return (
            <main className="min-h-screen bg-pizzaro-cream px-6 pb-20 pt-32">
                <div className="mx-auto max-w-6xl">
                    <div className="h-5 w-28 animate-pulse rounded bg-black/5" />
                    <div className="mt-4 h-12 w-80 animate-pulse rounded-xl bg-black/5" />
                    <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-black/5" />

                    <div className="mt-10 h-72 animate-pulse rounded-4xl bg-white" />
                </div>
            </main>
        );
    }

    const displayedActiveStatus =
        liveStatus || activeOrder?.status;

    return (
        <main className="min-h-screen bg-pizzaro-cream px-6 pb-24 pt-32">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut",
                }}
                className="mx-auto max-w-6xl"
            >
                {/* Header */}
                <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[4px] text-pizzaro-red">
                            MY ACCOUNT
                        </p>

                        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-pizzaro-dark md:text-5xl">
                            Welcome, {user?.name}
                        </h1>

                        <p className="mt-3 max-w-xl text-lg text-pizzaro-muted">
                            Everything about your Pizzaro orders,
                            all in one place.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-pizzaro-dark shadow-sm transition hover:border-pizzaro-red hover:text-pizzaro-red"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>
                </header>

                {error && (
                    <div className="mt-8 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {/* Active order */}
                {activeOrder ? (
                    <section className="mt-10 overflow-hidden rounded-4xl bg-pizzaro-dark text-white shadow-pizzaro">
                        <div className="px-6 py-7 sm:px-8 sm:py-8">
                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-white/55">
                                        <Clock3 size={16} />
                                        Current order
                                    </div>

                                    <h2 className="mt-3 font-display text-3xl font-bold">
                                        Your pizza is on its way.
                                    </h2>

                                    <p className="mt-2 text-sm text-white/60">
                                        Order #
                                        {activeOrder._id
                                            .slice(-8)
                                            .toUpperCase()}
                                    </p>
                                </div>

                                <span
                                    className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${displayedActiveStatus ===
                                        "out_for_delivery"
                                        ? "bg-white text-pizzaro-dark"
                                        : "bg-white/10 text-white"
                                        }`}
                                >
                                    {statusLabels[displayedActiveStatus
                                    ] || activeOrder.status}
                                </span>
                            </div>

                            <div className="mt-10">
                                <TrackingProgress
                                    currentStatus={displayedActiveStatus}
                                />
                            </div>

                            <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[2px] text-white/40">
                                        Order total
                                    </p>

                                    <p className="mt-1 text-2xl font-bold">
                                        ₹{activeOrder.subtotal}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/order-confirmation/${activeOrder._id}`,
                                        )
                                    }
                                    className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-pizzaro-dark transition hover:bg-pizzaro-cream"
                                >
                                    View order
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="mt-10 overflow-hidden rounded-4xl bg-white shadow-pizzaro">
                        <div className="flex flex-col items-center justify-center px-6 py-14 text-center sm:py-16">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pizzaro-red/10 text-pizzaro-red">
                                <Pizza size={28} />
                            </div>

                            <h2 className="mt-5 font-display text-2xl font-bold text-pizzaro-dark">
                                No active order
                            </h2>

                            <p className="mt-2 max-w-md text-sm leading-6 text-pizzaro-muted">
                                Ready for another pizza? Pick one
                                from the menu and we'll track it here.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="mt-6 flex items-center gap-2 rounded-full bg-pizzaro-red px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                Browse Menu
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </section>
                )}

                {/* Stats */}
                <section className="mt-6 grid gap-4 sm:grid-cols-3">
                    <AccountStat
                        icon={<ShoppingBag size={19} />}
                        label="Total orders"
                        value={orders.length}
                    />

                    <AccountStat
                        icon={<Package size={19} />}
                        label="Delivered"
                        value={completedOrders.length}
                    />

                    <AccountStat
                        icon={<User size={19} />}
                        label="Account"
                        value="Active"
                    />
                </section>

                {/* Account information */}
                <section className="mt-10 rounded-4xl bg-white p-6 shadow-pizzaro sm:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pizzaro-red/10 text-pizzaro-red">
                            <User size={19} />
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-[2px] text-pizzaro-muted">
                                ACCOUNT
                            </p>

                            <h2 className="mt-1 font-display text-2xl font-bold text-pizzaro-dark">
                                Your details
                            </h2>
                        </div>
                    </div>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                        <InfoItem
                            label="Name"
                            value={user?.name}
                        />

                        <InfoItem
                            label="Email"
                            value={user?.email}
                        />
                    </div>
                </section>

                {/* Order history */}
                <section className="mt-10">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[2px] text-pizzaro-muted">
                                ORDER HISTORY
                            </p>

                            <h2 className="mt-2 font-display text-3xl font-bold text-pizzaro-dark">
                                Your orders
                            </h2>
                        </div>

                        {orders.length > 0 && (
                            <span className="text-sm text-pizzaro-muted">
                                {orders.length} order
                                {orders.length === 1
                                    ? ""
                                    : "s"}
                            </span>
                        )}
                    </div>

                    {orders.length === 0 ? (
                        <div className="mt-5 rounded-4xl bg-white px-6 py-12 text-center shadow-pizzaro">
                            <p className="text-sm text-pizzaro-muted">
                                Your completed and active orders
                                will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-5 space-y-4">
                            {orders.map((order) => (
                                <OrderHistoryCard
                                    key={order._id}
                                    order={order}
                                    onView={() =>
                                        navigate(
                                            `/order-confirmation/${order._id}`,
                                        )
                                    }
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Order more */}
                <section className="mt-10 overflow-hidden rounded-4xl bg-pizzaro-dark px-6 py-10 text-center shadow-pizzaro sm:px-10">
                    <div className="mx-auto max-w-xl">
                        <p className="text-xs font-bold uppercase tracking-[3px] text-white/45">
                            PIZZARO
                        </p>

                        <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                            Want to order more?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-white/60">
                            Your next pizza is only a few clicks away.
                            Pick a classic or build one your way.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                navigate("/");
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });
                            }}
                            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-pizzaro-dark transition hover:bg-pizzaro-cream"
                        >
                            Browse Menu
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </section>
            </motion.div>
        </main>
    );
}

function TrackingProgress({ currentStatus }) {
    const currentRank =
        statusRank[currentStatus] ?? 0;

    return (
        <div className="grid grid-cols-5 gap-2">
            {trackingSteps.map((step, index) => {
                const completed =
                    currentRank >= index;

                const isCurrent =
                    step.key === currentStatus;

                return (
                    <div key={step.key} className="min-w-0">
                        <div className="flex items-center">
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${completed
                                    ? "bg-white text-pizzaro-dark"
                                    : "bg-white/10 text-white/40"
                                    }`}
                            >
                                {completed ? (
                                    <CheckCircle size={15} />
                                ) : (
                                    index + 1
                                )}
                            </div>

                            {index <
                                trackingSteps.length - 1 && (
                                    <div
                                        className={`h-px w-full ${currentRank > index
                                            ? "bg-white"
                                            : "bg-white/10"
                                            }`}
                                    />
                                )}
                        </div>

                        <p
                            className={`mt-3 text-[11px] font-semibold leading-4 ${isCurrent
                                ? "text-white"
                                : completed
                                    ? "text-white/70"
                                    : "text-white/35"
                                }`}
                        >
                            {step.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

function AccountStat({ icon, label, value }) {
    return (
        <div className="rounded-3xl bg-white p-5 shadow-pizzaro">
            <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pizzaro-red/10 text-pizzaro-red">
                    {icon}
                </div>

                <span className="text-2xl font-bold text-pizzaro-dark">
                    {value}
                </span>
            </div>

            <p className="mt-4 text-sm text-pizzaro-muted">
                {label}
            </p>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="rounded-2xl bg-pizzaro-cream p-4">
            <p className="text-xs text-pizzaro-muted">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-pizzaro-dark">
                {value}
            </p>
        </div>
    );
}

function OrderHistoryCard({ order, onView }) {
    const statusClass =
        statusColors[order.status] ||
        "bg-black/5 text-pizzaro-dark";

    return (
        <article className="rounded-3xl bg-white p-5 shadow-pizzaro sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs text-pizzaro-muted">
                        Order #
                        {order._id.slice(-8).toUpperCase()}
                    </p>

                    <p className="mt-1 font-display text-xl font-bold text-pizzaro-dark">
                        ₹{order.subtotal}
                    </p>
                </div>

                <span
                    className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${statusClass}`}
                >
                    {statusLabels[order.status] ||
                        order.status}
                </span>
            </div>

            <div className="mt-5 border-t border-black/5 pt-5">
                <div className="space-y-2">
                    {order.items?.map((item, index) => (
                        <div
                            key={`${item.name}-${index}`}
                            className="flex items-center justify-between gap-4 text-sm"
                        >
                            <span className="text-pizzaro-muted">
                                {item.quantity} × {item.name}
                            </span>

                            <span className="font-semibold text-pizzaro-dark">
                                ₹{item.lineTotal}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-pizzaro-muted">
                    <MapPin size={14} />
                    {order.customer?.city},{" "}
                    {order.customer?.state}
                </div>

                <button
                    type="button"
                    onClick={onView}
                    className="flex w-fit items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-pizzaro-dark transition hover:border-pizzaro-red hover:text-pizzaro-red"
                >
                    View order
                    <ArrowRight size={15} />
                </button>
            </div>
        </article>
    );
}