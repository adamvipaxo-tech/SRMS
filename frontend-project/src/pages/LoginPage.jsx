import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "admin", password: "admin123" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await http.post("/auth/login", form);
      localStorage.setItem("srms_token", data.token);
      localStorage.setItem("srms_username", data.username);
      navigate("/dashboard");
    } catch {
      setError("Login failed. Check username/password.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl md:min-h-[680px] md:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-100">SalesPro Ltd</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Smart Sales
              <br />
              Record Management
            </h1>
            <p className="mt-5 max-w-sm text-sm text-brand-100">
              Track customers, products, and sales with professional reporting in one centralized workspace.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wider text-brand-100">Secure Access</p>
            <p className="mt-1 text-sm text-white">Authorized admins only</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col justify-center bg-white px-6 py-10 sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Welcome Back</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Sign in to SRMS</h2>
          <p className="mt-2 text-sm text-slate-500">Use your admin credentials to access the dashboard.</p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Username</span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
              <input
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </label>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            <button className="w-full rounded-xl bg-brand-600 p-3 font-semibold text-white transition hover:bg-brand-700">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
