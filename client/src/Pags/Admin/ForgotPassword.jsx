// Pags/Admin/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/Img/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API}/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-extrabold text-primary">Forgot Password</h1>
          <p className="text-theme-light text-sm">Enter your email to reset your password</p>
        </div>

        <button
          onClick={() => navigate('/admin')}
          className="text-secondary items-center transition-colors"
        >
          - Back to Login
        </button>

        <div className="bg-card border border-theme rounded-3xl px-8 py-8 shadow-card mt-2">
          <div className="h-1 w-full rounded-full mb-6" style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))" }} />

          {message ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">📧</div>
              <p className="text-sm text-theme font-medium">{message}</p>
              <Link to="/admin" className="inline-block text-sm font-semibold text-primary hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-theme-light mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your account email"
                  autoComplete="email"
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
                {loading ? "Sending..." : "Send Reset Link"}
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
