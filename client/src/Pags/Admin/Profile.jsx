import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import Toast from "../../Componet/Teost";

export default function Profile() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "Admin User",
        email: user.email || "admin@tibeb.com",
        username: user.username || "admin",
        role: user.role || "Super Admin",
      });
    }
  }, [user]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parts = form.name.split(" ");
      const firstName = parts[0] || form.name;
      const lastName = parts.slice(1).join(" ") || " ";

      await axios.put(`${API}/admin/me`, {
        first_name: firstName,
        last_name: lastName,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch {
      showToast("Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      showToast("New passwords do not match", "error");
      return;
    }
    if (passwords.newPass.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.put(
        `${API}/admin/me/password`,
        { old_password: passwords.current, new_password: passwords.newPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Password changed successfully!", "success");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch {
      showToast("Failed to change password. Check your current password.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .filter((w) => w.length > 1)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const toggleShow = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Page header */}
      <div>
        <h2 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          My Account
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Manage your profile information and security settings
        </p>
      </div>

      {/* Avatar + name banner */}
      <div
        className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}
        >
          {getInitials(form.name)}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="text-white font-extrabold text-xl">{form.name}</div>
          <div className="text-white/70 text-sm mt-0.5">{form.email}</div>
          <span
            className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ background: "rgba(201,168,76,0.25)", color: "#C9A84C" }}
          >
            {form.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-2xl"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}
      >
        {[
          { key: "info", label: "Profile Info", icon: "👤" },
          { key: "password", label: "Change Password", icon: "🔒" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setIsEditing(false); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: activeTab === tab.key ? "var(--gradient-primary)" : "transparent",
              color: activeTab === tab.key ? "white" : "var(--text-secondary)",
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)" }}
      >
        {/* ── Profile Info Tab ── */}
        {activeTab === "info" && (
          <form onSubmit={handleProfileSubmit}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                Personal Information
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: isEditing ? "var(--border-color)" : "var(--gradient-primary)",
                  color: isEditing ? "var(--text-primary)" : "white",
                }}
              >
                {isEditing ? "Cancel" : "✏️ Edit"}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                { label: "Full Name", name: "name", type: "text", placeholder: "Your full name", editable: true },
                { label: "Email Address", name: "email", type: "email", placeholder: "your@email.com", editable: true },
                { label: "Username", name: "username", type: "text", placeholder: "username", editable: true },
                { label: "Role", name: "role", type: "text", placeholder: "Role", editable: false },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleFormChange}
                    disabled={!isEditing || !field.editable}
                    placeholder={field.placeholder}
                    className="profile-input"
                  />
                  {field.name === "role" && (
                    <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                      Role cannot be changed
                    </p>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {loading ? "Saving..." : "💾 Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        )}

        {/* ── Change Password Tab ── */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit}>
            <h3 className="font-bold text-base mb-6" style={{ color: "var(--text-primary)" }}>
              Change Password
            </h3>

            <div className="space-y-5 max-w-md">
              {[
                { label: "Current Password", name: "current", value: passwords.current },
                { label: "New Password", name: "newPass", value: passwords.newPass },
                { label: "Confirm New Password", name: "confirm", value: passwords.confirm },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      name={field.name}
                      type={showPasswords[field.name] ? "text" : "password"}
                      value={field.value}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                      className="profile-input pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShow(field.name)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {showPasswords[field.name] ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              ))}

              {/* Password rules hint */}
              <div
                className="rounded-xl px-4 py-3 text-xs space-y-1"
                style={{ background: "var(--nav-active-bg)", color: "var(--text-secondary)" }}
              >
                <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Password requirements
                </p>
                <p>• Minimum 6 characters</p>
                <p>• New password must differ from current</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? "Updating..." : "🔒 Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .profile-input {
          width: 100%;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--main-bg);
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .profile-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(26,35,126,0.1);
        }
        .profile-input:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
