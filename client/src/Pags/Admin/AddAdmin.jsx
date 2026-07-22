// Pags/Admin/AddAdmin.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

// ✅ ADDED: API variable with environment variable
const API = `${import.meta.env.VITE_API_URL}`;

export default function AddAdmin() {
  const { token, user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "Admin",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAdmins = async () => {
    setLoadingList(true);
    setListError("");
    try {
      // ✅ FIXED: Using correct API endpoint
      const res = await axios.get(`${API}/admins`, authHeaders);
      setAdmins(res.data.admins || []);
    } catch (err) {
      setListError(err.response?.data?.message || "Failed to load admins.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
    setFormSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      // ✅ FIXED: Using correct API endpoint
      await axios.post(`${API}/auth/admins`, form, authHeaders);
      setFormSuccess(`Admin "${form.username}" created successfully.`);
      setForm({ name: "", email: "", username: "", password: "", role: "Admin" });
      fetchAdmins();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create admin. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin) => {
    setStatusUpdatingId(admin.id);
    try {
      // ✅ FIXED: Using correct API endpoint
      await axios.patch(
        `${API}/admins/${admin.id}/status`,
        { is_active: !admin.is_active },
        authHeaders
      );
      fetchAdmins();
    } catch (err) {
      setListError(err.response?.data?.message || "Failed to update admin status.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── Create admin card ── */}
      <div className="bg-card border border-theme rounded-3xl px-6 md:px-8 py-6 md:py-8 shadow-card">
        <div className="h-1 w-full rounded-full mb-6" style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }} />

        <h2 className="text-lg font-extrabold text-primary mb-1">Add New Admin</h2>
        <p className="text-theme-light text-sm mb-6">Create a new admin account for the content manager.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-xs font-semibold text-theme-light mb-1.5 block">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Selam Tesfaye"
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-theme text-theme border-theme hover:border-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-theme-light mb-1.5 block">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="e.g. selam@tibeb.com"
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-theme text-theme border-theme hover:border-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-theme-light mb-1.5 block">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="e.g. selam"
              autoComplete="off"
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-theme text-theme border-theme hover:border-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-theme-light mb-1.5 block">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="w-full px-4 pr-12 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-theme text-theme border-theme hover:border-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-light hover:text-primary transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-theme-light mb-1.5 block">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-theme text-theme border-theme hover:border-primary focus:border-primary"
            >
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 shadow-glow"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
            >
              {submitting ? "Creating..." : "Create Admin"}
            </button>
          </div>

          {formError && (
            <div className="md:col-span-2 flex items-center gap-2 p-3 rounded-xl text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="md:col-span-2 flex items-center gap-2 p-3 rounded-xl text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {formSuccess}
            </div>
          )}
        </form>
      </div>

      {/* ── Admins list card ── */}
      <div className="bg-card border border-theme rounded-3xl px-6 md:px-8 py-6 md:py-8 shadow-card">
        <h2 className="text-lg font-extrabold text-primary mb-1">All Admins</h2>
        <p className="text-theme-light text-sm mb-6">Manage existing admin accounts.</p>

        {listError && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {listError}
          </div>
        )}

        {loadingList ? (
          <p className="text-sm text-theme-light">Loading admins...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-theme-light border-b border-theme">
                  <th className="py-2 pr-4 font-semibold">Name</th>
                  <th className="py-2 pr-4 font-semibold">Username</th>
                  <th className="py-2 pr-4 font-semibold">Email</th>
                  <th className="py-2 pr-4 font-semibold">Role</th>
                  <th className="py-2 pr-4 font-semibold">Status</th>
                  <th className="py-2 pr-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-b border-theme last:border-0">
                    <td className="py-3 pr-4 text-primary font-medium">{a.name}</td>
                    <td className="py-3 pr-4 text-secondary">{a.username}</td>
                    <td className="py-3 pr-4 text-secondary">{a.email}</td>
                    <td className="py-3 pr-4 text-secondary">{a.role}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          a.is_active
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {a.is_active ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <button
                        disabled={a.id === user?.id || statusUpdatingId === a.id}
                        onClick={() => handleToggleStatus(a)}
                        title={a.id === user?.id ? "You can't deactivate your own account" : ""}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: a.is_active ? "rgba(220,38,38,0.1)" : "rgba(22,163,74,0.1)",
                          color: a.is_active ? "#DC2626" : "#16A34A",
                        }}
                      >
                        {statusUpdatingId === a.id
                          ? "Updating..."
                          : a.is_active
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-theme-light">
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}