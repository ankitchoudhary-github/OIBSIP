import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const categories = [
  { key: "all", label: "All" },
  { key: "base", label: "Bases" },
  { key: "sauce", label: "Sauces" },
  { key: "cheese", label: "Cheese" },
  { key: "vegetable", label: "Vegetables" },
];

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

  const token = localStorage.getItem("pizzaro_admin_token");

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
      setError(err.message || "Unable to load inventory.");
    } finally {
      setLoading(false);
    }
  }

  function openEditor(item) {
    setEditingId(item.optionId);
    setQuantityDelta("");
    setReason("");
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

  function handleLogout() {
    localStorage.removeItem("pizzaro_admin_token");
    localStorage.removeItem("pizzaro_admin");
    navigate("/admin/login", { replace: true });
  }

  const filteredInventory = useMemo(() => {
    if (category === "all") return inventory;

    return inventory.filter(
      (item) => item.type === category,
    );
  }, [inventory, category]);

  const lowStockCount = inventory.filter(
    (item) => item.stock <= item.threshold,
  ).length;

  return (
    <div className="min-h-screen bg-pizzaro-cream px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-neutral-900 p-6 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Pizzaro Admin
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Inventory
            </h1>

            <p className="mt-2 text-sm text-neutral-400">
              Monitor stock levels and manage ingredients.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
          >
            Log out
          </button>
        </header>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">
              Total items
            </p>

            <p className="mt-1 text-3xl font-semibold text-neutral-900">
              {inventory.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">
              Low stock
            </p>

            <p className="mt-1 text-3xl font-semibold text-neutral-900">
              {lowStockCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">
              Categories
            </p>

            <p className="mt-1 text-3xl font-semibold text-neutral-900">
              4
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setCategory(item.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                category === item.key
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 border-b border-neutral-100 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral-400 md:grid">
            <span>Ingredient</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Threshold</span>
            <span></span>
          </div>

          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl bg-neutral-100"
                />
              ))}
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-10 text-center text-sm text-neutral-500">
              No inventory items found.
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
                    className="px-6 py-5"
                  >
                    <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] md:items-center">
                      <div>
                        <p className="font-semibold text-neutral-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          {item.optionId}
                        </p>
                      </div>

                      <div>
                        <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-600">
                          {item.type}
                        </span>
                      </div>

                      <div>
                        <p
                          className={`text-lg font-semibold ${
                            isLowStock
                              ? "text-red-600"
                              : "text-neutral-900"
                          }`}
                        >
                          {item.stock}
                        </p>

                        <p className="text-xs text-neutral-400">
                          {item.unit}
                        </p>
                      </div>

                      <div className="text-sm text-neutral-600">
                        {item.threshold}
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            isEditing
                              ? closeEditor()
                              : openEditor(item)
                          }
                          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                        >
                          {isEditing ? "Cancel" : "Update"}
                        </button>
                      </div>
                    </div>

                    {isLowStock && (
                      <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        Low stock — current level is at or below the threshold.
                      </div>
                    )}

                    {isEditing && (
                      <div className="mt-5 rounded-2xl bg-neutral-50 p-5">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
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
                              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none focus:border-neutral-900"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
                              Reason
                            </label>

                            <input
                              type="text"
                              value={reason}
                              onChange={(event) =>
                                setReason(event.target.value)
                              }
                              placeholder="e.g. New stock received"
                              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 outline-none focus:border-neutral-900"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              handleUpdate(item)
                            }
                            className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {saving
                              ? "Saving..."
                              : "Save stock change"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}