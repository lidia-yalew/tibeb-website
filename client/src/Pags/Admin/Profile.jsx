import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import Toast from "../../Componet/Teost";

export default function Profile() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const showToast = (message, type = 'success') => {
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
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("✅ Profile updated successfully!", "success");
      setIsEditing(false);
      // Update user context
      if (res.data.user) {
        // You might want to update the user context here
      }
    } catch (error) {
      showToast("❌ Failed to update profile", "error");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split(" ")
      .filter(w => w.length > 1)
      .map(w => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-primary">My Profile</h2>
        <p className="text-muted text-sm">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-theme rounded-2xl p-6 md:p-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-theme">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-lg"
              style={{ background: "var(--gradient-primary)" }}>
              {getInitials(form.name)}
            </div>
            <button 
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow-lg hover:scale-110 transition-transform"
              style={{ background: "var(--color-secondary)" }}
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              📷
            </button>
            <input type="file" id="avatar-upload" className="hidden" accept="image/*" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-extrabold text-primary">{form.name}</h3>
            <p className="text-sm text-secondary font-medium">{form.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: "var(--color-secondary)12", color: "var(--color-secondary)" }}>
                ● Active
              </span>
              <span className="text-xs text-muted">Last login: Today</span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: isEditing ? "var(--border-color)" : "var(--gradient-primary)",
              color: isEditing ? "var(--text-primary)" : "white",
            }}
          >
            {isEditing ? "Cancel" : "✏️ Edit Profile"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all input-theme"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all input-theme"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all input-theme"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted mb-1.5 block">Role</label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={true}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all input-theme opacity-70"
              />
              <p className="text-[10px] text-muted mt-1">Role cannot be changed</p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 btn-primary"
              >
                {loading ? "⏳ Saving..." : "💾 Save Changes"}
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
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card border border-theme rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xl font-extrabold text-primary">Admin</div>
          <div className="text-[10px] text-muted">Your Role</div>
        </div>
        <div className="bg-card border border-theme rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">🔐</div>
          <div className="text-xl font-extrabold text-primary">Active</div>
          <div className="text-[10px] text-muted">Account Status</div>
        </div>
        <div className="bg-card border border-theme rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">📅</div>
          <div className="text-xl font-extrabold text-primary">Today</div>
          <div className="text-[10px] text-muted">Last Login</div>
        </div>
      </div>

      <style>{`
        .input-theme {
          background: var(--card-bg);
          border-color: var(--border-color);
          color: var(--text-primary);
        }
        .input-theme:focus {
          border-color: var(--color-primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(26,35,126,0.1);
        }
        .input-theme:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-primary {
          background: var(--gradient-primary);
        }
      `}</style>
    </div>
  );
}