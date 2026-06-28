import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import axios from "axios";
import Toast from "../../Componet/Teost";

export default function ChangePassword() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (form.newPassword.length < 8) {
      showToast("⚠️ Password must be at least 8 characters", "warning");
      return;
    }
    
    if (form.newPassword !== form.confirmPassword) {
      showToast("⚠️ Passwords do not match", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("✅ Password changed successfully!", "success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      showToast(
        error.response?.data?.message || "❌ Failed to change password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password) => {
    if (!password) return { level: 0, label: "Enter a password", color: "var(--border-color)" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    const levels = [
      { label: "Weak", color: "#DC2626" },
      { label: "Fair", color: "#F59E0B" },
      { label: "Good", color: "#3B82F6" },
      { label: "Strong", color: "#0F6E56" },
      { label: "Very Strong", color: "#0F6E56" },
    ];
    const index = Math.min(Math.floor(score / 1.5), 4);
    return { level: index, label: levels[index].label, color: levels[index].color };
  };

  const strength = passwordStrength(form.newPassword);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
        <h2 className="text-2xl font-extrabold text-primary">Change Password</h2>
        <p className="text-muted text-sm">Update your password to keep your account secure</p>
      </div>

      {/* Password Card */}
      <div className="bg-card border border-theme rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">Current Password</label>
            <div className="relative">
              <input
                name="currentPassword"
                type={showPassword.current ? "text" : "password"}
                value={form.currentPassword}
                onChange={handleChange}
                required
                placeholder="Enter your current password"
                className="w-full px-4 pr-12 py-2.5 rounded-xl border text-sm outline-none transition-all input-theme"
              />
              <button
                type="button"
                onClick={() => togglePassword('current')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                {showPassword.current ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">New Password</label>
            <div className="relative">
              <input
                name="newPassword"
                type={showPassword.new ? "text" : "password"}
                value={form.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter your new password"
                className="w-full px-4 pr-12 py-2.5 rounded-xl border text-sm outline-none transition-all input-theme"
              />
              <button
                type="button"
                onClick={() => togglePassword('new')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                {showPassword.new ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {form.newPassword && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-full h-1.5 rounded-full overflow-hidden flex-1" style={{ background: "var(--border-color)" }}>
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(strength.level + 1) * 20}%`, 
                          background: strength.color 
                        }} 
                      />
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                </div>
                <ul className="grid grid-cols-2 gap-1 text-[10px] text-muted">
                  <li className={form.newPassword.length >= 8 ? "text-success" : ""}>
                    {form.newPassword.length >= 8 ? "✅" : "❌"} At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(form.newPassword) ? "text-success" : ""}>
                    {/[A-Z]/.test(form.newPassword) ? "✅" : "❌"} Uppercase letter
                  </li>
                  <li className={/[a-z]/.test(form.newPassword) ? "text-success" : ""}>
                    {/[a-z]/.test(form.newPassword) ? "✅" : "❌"} Lowercase letter
                  </li>
                  <li className={/\d/.test(form.newPassword) ? "text-success" : ""}>
                    {/\d/.test(form.newPassword) ? "✅" : "❌"} Number
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-muted mb-1.5 block">Confirm New Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showPassword.confirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your new password"
                className="w-full px-4 pr-12 py-2.5 rounded-xl border text-sm outline-none transition-all input-theme"
              />
              <button
                type="button"
                onClick={() => togglePassword('confirm')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                {showPassword.confirm ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <p className="text-[10px] text-red-500 mt-1">⚠️ Passwords do not match</p>
            )}
            {form.confirmPassword && form.newPassword === form.confirmPassword && (
              <p className="text-[10px] text-success mt-1">✅ Passwords match</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading || form.newPassword !== form.confirmPassword}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 btn-primary"
            >
              {loading ? "⏳ Changing..." : "🔒 Change Password"}
            </button>
          </div>

          {/* Security Tips */}
          <div className="mt-4 p-4 rounded-xl" style={{ background: "var(--color-primary)08", border: "1px solid var(--color-primary)15" }}>
            <h4 className="text-xs font-bold text-secondary tracking-[2px] mb-2">🔐 SECURITY TIPS</h4>
            <ul className="text-[10px] text-muted space-y-1.5">
              <li>• Use a unique password not used on other sites</li>
              <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
              <li>• Avoid common words or personal information</li>
              <li>• Change your password regularly</li>
            </ul>
          </div>
        </form>
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
        .btn-primary {
          background: var(--gradient-primary);
        }
        .text-success { color: var(--color-success, #0F6E56); }
      `}</style>
    </div>
  );
}