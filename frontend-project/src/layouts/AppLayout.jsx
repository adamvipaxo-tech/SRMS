import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/customers", label: "Customer" },
  { to: "/products", label: "Product" },
  { to: "/sales", label: "Sales" },
  { to: "/reports", label: "Reports" },
  { to: "/profile", label: "Profile" }
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const username = localStorage.getItem("srms_username") || "Admin";

  const logout = () => {
    localStorage.removeItem("srms_token");
    localStorage.removeItem("srms_username");
    navigate("/login");
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {mobileOpen ? (
          <button
            className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
            onClick={closeMobileMenu}
            aria-label="Close menu overlay"
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-gradient-to-b from-brand-700 to-brand-900 p-5 text-white transition-transform lg:static lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold">SalesPro SRMS</h1>
            <p className="mt-1 text-sm text-brand-200">Sales Record Management</p>
          </div>
          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? "bg-white text-brand-700" : "text-brand-100 hover:bg-white/15"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 rounded-xl bg-white/10 p-3 text-sm">
            <p className="text-brand-100">Signed in as</p>
            <p className="font-semibold">{username}</p>
          </div>
          <button
            onClick={logout}
            className="mt-4 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
          >
            Logout
          </button>
        </aside>

        <div className="flex-1 lg:ml-0">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="truncate text-lg font-semibold text-slate-800 sm:text-xl">
                {links.find((item) => location.pathname.startsWith(item.to))?.label || "Dashboard"}
              </h2>
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                Menu
              </button>
            </div>
          </header>
          <main className="p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
