import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const categories = [
  { key: "all", label: "All" },
  { key: "base", label: "Bases" },
  { key: "sauce", label: "Sauces" },
  { key: "cheese", label: "Cheese" },
  { key: "vegetable", label: "Vegetables" },
];

const categoryLabels = {
  base: "Base",
  sauce: "Sauce",
  cheese: "Cheese",
  vegetable: "Vegetable",
};

export default function AdminInventory() {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [quantityDelta, setQuantityDelta] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem(
    "pizzaro_admin_token",
  );

  useEffect(() => {
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    fetchInventory();
  }, [token, navigate]);

  async function fetchInventory() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/inventory`,
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
          data.message || "Unable to load inventory.",
        );
      }

      setInventory(data.inventory || []);
    } catch (err) {
      setError(
        err.message || "Unable to load inventory.",
      );
    } finally {
      setLoading(false);
    }
  }

  function openEditor(item) {
    setEditingId(item.optionId);
    setQuantityDelta("");
    setReason("");
    setError("");
  }

  function closeEditor() {
    if (saving) return;

    setEditingId(null);
    setQuantityDelta("");
    setReason("");
  }

  async function handleUpdate(item) {
    const delta = Number(quantityDelta);

    if (!Number.isInteger(delta) || delta === 0) {
      setError("Enter a non-zero whole number.");
      return;
    }

    if (!reason.trim()) {
      setError("Please enter a reason for the stock change.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/inventory/${item.optionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantityDelta: delta,
            reason: reason.trim(),
          }),
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
          data.message || "Unable to update inventory.",
        );
      }

      setInventory((current) =>
        current.map((inventoryItem) =>
          inventoryItem.optionId === item.optionId
            ? data.item
            : inventoryItem,
        ),
      );

      closeEditor();
    } catch (err) {
      setError(
        err.message || "Unable to update inventory.",
      );
    } finally {
      setSaving(false);
    }
  }

  const filteredInventory = useMemo(() => {
    if (category === "all") {
      return inventory;
    }

    return inventory.filter(
      (item) => item.type === category,
    );
  }, [inventory, category]);

  const lowStockItems = inventory.filter(
    (item) => item.stock <= item.threshold,
  );

  const totalUnits = inventory.reduce(
    (sum, item) => sum + item.stock,
    0,
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
                Inventory
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Inventory
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
              Monitor ingredient levels, identify low stock,
              and make inventory adjustments.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchInventory}
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
            label="Inventory items"
            value={inventory.length}
            helper="Active catalog items"
            icon="box"
          />

          <SummaryCard
            label="Total units"
            value={totalUnits}
            helper="Across all ingredients"
            icon="layers"
          />

          <SummaryCard
            label="Low stock"
            value={lowStockItems.length}
            helper={
              lowStockItems.length === 0
                ? "Everything is above threshold"
                : "Requires attention"
            }
            danger={lowStockItems.length > 0}
            icon="alert"
          />

          <SummaryCard
            label="Categories"
            value={4}
            helper="Bases, sauces, cheese, vegetables"
            icon="grid"
          />
        </section>

        {/* Low stock banner */}
        {lowStockItems.length > 0 && (
          <section className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-red-700">
                  Low stock alert
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {lowStockItems.length} ingredient
                  {lowStockItems.length === 1 ? "" : "s"}{" "}
                  {lowStockItems.length === 1
                    ? "is"
                    : "are"}{" "}
                  at or below the minimum threshold.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCategory("all")}
                className="mt-2 w-fit rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm ring-1 ring-red-100 sm:mt-0"
              >
                View items
              </button>
            </div>
          </section>
        )}

        {/* Category navigation */}
        <section className="flex flex-col gap-4 border-b border-neutral-200 pb-1 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex gap-1 overflow-x-auto">
            {categories.map((item) => {
              const active = category === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategory(item.key)}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "border-neutral-900 text-neutral-950"
                      : "border-transparent text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <p className="pb-3 text-xs text-neutral-400">
            Showing {filteredInventory.length} of{" "}
            {inventory.length}
          </p>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Inventory table */}
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] border-b border-neutral-100 bg-neutral-50/70 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400 md:grid">
            <span>Ingredient</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Threshold</span>
            <span></span>
          </div>

          {loading ? (
            <div className="divide-y divide-neutral-100">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse bg-white"
                />
              ))}
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-medium text-neutral-800">
                No inventory items found
              </p>

              <p className="mt-1 text-sm text-neutral-400">
                Try another category.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredInventory.map((item) => {
                const isLowStock =
                  item.stock <= item.threshold;

                const isEditing =
                  editingId === item.optionId;

                return (
                  <div
                    key={item.optionId}
                    className="group"
                  >
                    <div className="grid gap-5 px-5 py-5 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center md:px-6">
                      {/* Ingredient */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                              isLowStock
                                ? "bg-red-50 text-red-600"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              className="h-5 w-5"
                            >
                              <path d="M5 7h14v12H5z" />
                              <path d="M8 7V5h8v2" />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-neutral-900">
                              {item.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-neutral-400">
                              {item.optionId}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
                          {categoryLabels[item.type] ||
                            item.type}
                        </span>
                      </div>

                      {/* Stock */}
                      <div>
                        <p
                          className={`text-xl font-semibold tracking-tight ${
                            isLowStock
                              ? "text-red-600"
                              : "text-neutral-900"
                          }`}
                        >
                          {item.stock}
                        </p>

                        <p className="mt-0.5 text-xs text-neutral-400">
                          {item.unit}
                        </p>
                      </div>

                      {/* Threshold */}
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          {item.threshold}
                        </p>

                        <p className="mt-0.5 text-xs text-neutral-400">
                          minimum
                        </p>
                      </div>

                      {/* Action */}
                      <div className="md:text-right">
                        <button
                          type="button"
                          onClick={() =>
                            isEditing
                              ? closeEditor()
                              : openEditor(item)
                          }
                          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                            isEditing
                              ? "border border-neutral-200 bg-white text-neutral-700"
                              : "bg-neutral-900 text-white hover:bg-neutral-800"
                          }`}
                        >
                          {isEditing
                            ? "Cancel"
                            : "Update"}
                        </button>
                      </div>
                    </div>

                    {/* Low stock state */}
                    {isLowStock && !isEditing && (
                      <div className="px-5 pb-5 md:px-6">
                        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          Low stock · {item.stock} remaining,
                          threshold {item.threshold}
                        </div>
                      </div>
                    )}

                    {/* Edit panel */}
                    {isEditing && (
                      <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-5 md:px-6">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
                          <div className="w-full lg:max-w-xs">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
                              Quantity change
                            </label>

                            <input
                              type="number"
                              value={quantityDelta}
                              onChange={(event) =>
                                setQuantityDelta(
                                  event.target.value,
                                )
                              }
                              placeholder="e.g. 20 or -5"
                              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5"
                            />

                            <p className="mt-1.5 text-xs text-neutral-400">
                              Positive adds stock. Negative
                              removes stock.
                            </p>
                          </div>

                          <div className="w-full lg:flex-1">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
                              Reason
                            </label>

                            <input
                              type="text"
                              value={reason}
                              onChange={(event) =>
                                setReason(event.target.value)
                              }
                              placeholder="e.g. New stock received"
                              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5"
                            />
                          </div>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              handleUpdate(item)
                            }
                            className="w-full rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                          >
                            {saving
                              ? "Saving..."
                              : "Save change"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

function SummaryCard({
  label,
  value,
  helper,
  danger = false,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-400">
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-semibold tracking-tight ${
              danger
                ? "text-red-600"
                : "text-neutral-950"
            }`}
          >
            {value}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {helper}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            danger
              ? "bg-red-50 text-red-600"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {icon === "alert" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M12 4 3.5 19h17L12 4Z" />
              <path d="M12 9v4M12 16h.01" />
            </svg>
          )}

          {icon === "box" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
              <path d="m4 7.5 8 4.5 8-4.5" />
              <path d="M4 7.5V17l8 4 8-4V7.5" />
            </svg>
          )}

          {icon === "layers" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="m12 3 8 4-8 4-8-4 8-4Z" />
              <path d="m4 12 8 4 8-4" />
              <path d="m4 17 8 4 8-4" />
            </svg>
          )}

          {icon === "grid" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}