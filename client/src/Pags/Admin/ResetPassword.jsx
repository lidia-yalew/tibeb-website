// Pags/Admin/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/Img/logo.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
const API = `${import.meta.env.VITE_API_URL}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/auth/reset-password`, { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/admin"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-bg)" }}>
        <div className="bg-card border border-theme rounded-3xl px-8 py-8 shadow-card text-center max-w-md">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-bold text-primary mb-2">Invalid Link</h2>
          <p className="text-sm text-theme-light mb-4">
            This password reset link is missing its token. Please request a new one.
          </p>
          <Link to="/admin/forgot-password" className="text-sm font-semibold text-primary hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--color-bg)" }}>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />

      <div className="w-full max-w-md relative z-10">

        <div className="text-center mb-2">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg bg-card border border-theme">
            <img src={logo} alt="Tibeb Logo" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-primary">Reset Password</h1>
          <p className="text-theme-light text-sm">Enter your new password below</p>
        </div>

        <div className="bg-card border border-theme rounded-3xl px-8 py-8 shadow-card mt-4">
          <div className="h-1 w-full rounded-full mb-6" style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }} />

          {success ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">✅</div>
              <p className="text-sm text-theme font-medium">
                Your password has been reset successfully. Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-theme-light mb-1.5 block">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    className="w-full px-4 pr-12 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-theme text-theme border-theme hover:border-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-light hover:text-primary transition-colors text-xs font-semibold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light mb-1.5 block">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-theme text-theme border-theme hover:border-primary focus:border-primary"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 shadow-glow"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))" }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-theme-light mt-6">
          Tibeb Consultancy & Training PLC · Addis Ababa, Ethiopia
        </p>
      </div>
    </div>
  );
}