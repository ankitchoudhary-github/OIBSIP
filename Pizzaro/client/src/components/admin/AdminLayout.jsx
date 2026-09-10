import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const navItems = [
  {
    label: "Inventory",
    path: "/admin/inventory",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path d="M6 3h12v18H6z" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
  },
];

function AdminNavItem({ item, onClick }) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-neutral-900 text-white shadow-sm"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        }`
      }
    >
      {item.icon}
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminData = localStorage.getItem("pizzaro_admin");

  let admin = null;

  try {
    admin = adminData ? JSON.parse(adminData) : null;
  } catch {
    admin = null;
  }

  function handleLogout() {
    localStorage.removeItem("pizzaro_admin_token");
    localStorage.removeItem("pizzaro_admin");

    navigate("/admin/login", {
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-[#f7f3ed] text-neutral-900">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-neutral-700 hover:bg-neutral-100"
            aria-label="Open navigation"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="text-lg font-semibold tracking-tight">
            Pizzaro<span className="text-neutral-400">.</span>
          </div>

          <div className="h-9 w-9 rounded-full bg-neutral-900 text-center text-xs font-semibold leading-9 text-white">
            {admin?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-neutral-200/70 bg-white lg:flex lg:flex-col">
          <div className="flex h-20 items-center border-b border-neutral-100 px-6">
            <div>
              <div className="text-xl font-semibold tracking-tight">
                Pizzaro<span className="text-neutral-400">.</span>
              </div>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Management
            </p>

            <div className="space-y-1">
              {navItems.map((item) => (
                <AdminNavItem
                  key={item.path}
                  item={item}
                />
              ))}
            </div>

            <div className="my-6 h-px bg-neutral-100" />

            <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Quick access
            </p>

            <a
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5 10v10h14V10" />
                <path d="M9 20v-6h6v6" />
              </svg>

              <span>View Store</span>
            </a>
          </nav>

          <div className="border-t border-neutral-100 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                {admin?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {admin?.name || "Admin"}
                </p>

                <p className="truncate text-xs text-neutral-400">
                  {admin?.email || "Administrator"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 4v16" />
              </svg>

              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/30"
            />

            <aside className="relative flex h-full w-72 flex-col bg-white shadow-2xl">
              <div className="flex h-16 items-center justify-between border-b border-neutral-100 px-5">
                <div className="text-lg font-semibold">
                  Pizzaro<span className="text-neutral-400">.</span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl p-2 hover:bg-neutral-100"
                  aria-label="Close navigation"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-4 py-6">
                <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Management
                </p>

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <AdminNavItem
                      key={item.path}
                      item={item}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                </div>

                <div className="my-6 h-px bg-neutral-100" />

                <a
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                >
                  <span>View Store</span>
                </a>
              </nav>

              <div className="border-t border-neutral-100 p-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Log out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-375 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}