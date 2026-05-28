import { useEffect, useState } from "react";
import Card from "../components/Card";
import http from "../api/http";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [adminForm, setAdminForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    const [meRes, adminsRes] = await Promise.all([http.get("/auth/me"), http.get("/auth/admins")]);
    setProfile(meRes.data);
    setAdmins(adminsRes.data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await http.post("/auth/change-password", passwordForm);
      setMessage(data.message);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to change password");
    }
  };

  const submitCreateAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await http.post("/auth/admins", adminForm);
      setMessage(`${data.message}: ${data.username}`);
      setAdminForm({ username: "", password: "" });
      loadProfile();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to create admin");
    }
  };

  const removeAdmin = async (admin) => {
    setError("");
    setMessage("");
    const isConfirmed = window.confirm(`Delete admin account "${admin.username}"?`);
    if (!isConfirmed) return;

    try {
      const { data } = await http.delete(`/auth/admins/${admin.id}`);
      setMessage(data.message);
      loadProfile();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to delete admin");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      <Card title="Profile Overview">
        <div className="space-y-2 text-sm">
          <p className="text-slate-500">Username</p>
          <p className="rounded-lg bg-brand-50 p-3 font-semibold text-slate-900">{profile?.username || "Loading..."}</p>
        </div>
      </Card>

      <Card title="Change Password">
        <form onSubmit={submitPasswordChange} className="space-y-3">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            type="password"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            type="password"
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            type="password"
            placeholder="Confirm new password"
            value={passwordForm.confirmNewPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
            required
          />
          <button className="w-full rounded-lg bg-brand-600 p-2.5 font-semibold text-white hover:bg-brand-700">
            Update Password
          </button>
        </form>
      </Card>

      <Card title="Create Another Admin">
        <form onSubmit={submitCreateAdmin} className="space-y-3">
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            placeholder="New admin username"
            value={adminForm.username}
            onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            type="password"
            placeholder="New admin password"
            value={adminForm.password}
            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
            required
          />
          <button className="w-full rounded-lg bg-brand-600 p-2.5 font-semibold text-white hover:bg-brand-700">
            Create Admin
          </button>
        </form>
      </Card>

      <div className="xl:col-span-3">
        <Card title="Available Admin Accounts">
          <div className="-mx-2 overflow-x-auto px-2">
            <table className="min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-2">Admin ID</th>
                  <th className="px-3 py-2">Username</th>
                  <th className="px-3 py-2">Created At</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 whitespace-nowrap">{admin.id}</td>
                    <td className="px-3 py-2 font-medium text-slate-800">{admin.username}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{new Date(admin.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {profile?.id === admin.id ? (
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-500">Current User</span>
                      ) : (
                        <button
                          onClick={() => removeAdmin(admin)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {message ? <p className="xl:col-span-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="xl:col-span-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
