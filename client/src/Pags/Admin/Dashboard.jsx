import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ team: 0, portfolio: 0, testimonials: 0, messages: 0, unread: 0 });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(`${API}/team`),
      axios.get(`${API}/portfolio`),
      axios.get(`${API}/testimonials`),
      axios.get(`${API}/contact`, { headers }),
    ]).then(([team, portfolio, testimonials, contact]) => {
      const msgs = contact.data;
      setStats({
        team: team.data.length,
        portfolio: portfolio.data.length,
        testimonials: testimonials.data.length,
        messages: msgs.length,
        unread: msgs.filter((m) => !m.is_read).length,
      });
      setMessages(msgs.slice(0, 5));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Team Members", value: stats.team, icon: "👥", color: "#1A237E", path: "/admin/team", action: "Manage Team" },
    { label: "Portfolio Projects", value: stats.portfolio, icon: "📋", color: "#C9A84C", path: "/admin/portfolio", action: "Manage Portfolio" },
    { label: "Testimonials", value: stats.testimonials, icon: "💬", color: "#1A237E", path: "/admin/testimonials", action: "Manage Testimonials" },
    { label: "Messages", value: stats.messages, icon: "📬", color: "#C9A84C", path: "/admin/messages", action: `${stats.unread} unread`, badge: stats.unread },
  ];

  const quickActions = [
    { label: "Add Team Member", icon: "👤", path: "/admin/team", color: "#1A237E" },
    { label: "Add Project", icon: "📁", path: "/admin/portfolio", color: "#C9A84C" },
    { label: "Add Testimonial", icon: "✍️", path: "/admin/testimonials", color: "#1A237E" },
    { label: "View Messages", icon: "📬", path: "/admin/messages", color: "#C9A84C" },
  ];

  return (
      <div className="space-y-6 max-w-6xl">

        {/* Welcome banner */}
        <div className="rounded-2xl p-6 relative overflow-hidden bg-card"
          >
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-10 pointer-events-none"/>
          <div className=" z-10">
            <div className="text-theme-light text-xs font-semibold tracking-[2px] mb-1">WELCOME BACK</div>
            <h2 className="text-2xl font-extrabold text-secondary mb-1">Admin Dashboard</h2>
            <p className="text-theme text-sm">Manage your website content from here. All changes reflect on the public site instantly.</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <Link key={i} to={s.path}
              className="bg-card border border-theme rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
              {s.badge > 0 && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: "#DC2626" }}>
                  {s.badge}
                </div>
              )}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3"
                style={{ background: s.color + "12" }}>
                {s.icon}
              </div>
              {loading ? (
                <div className="h-8 w-12 rounded-lg animate-pulse mb-1" style={{ background: "var(--color-border)" }} />
              ) : (
                <div className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</div>
              )}
              <div className="text-xs text-theme-light font-medium">{s.label}</div>
              <div className="text-[10px] font-semibold mt-1 group-hover:underline" style={{ color: s.color }}>{s.action} →</div>
            </Link>
          ))}
        </div>

        {/* Quick actions + recent messages */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Quick actions */}
          <div className="bg-card border border-theme rounded-2xl p-5">
            <div className="text-xs font-bold tracking-[2px] text-secondary mb-4">QUICK ACTIONS</div>
            <div className="space-y-2">
              {quickActions.map((a, i) => (
                <Link key={i} to={a.path}
                  className="flex items-center gap-3 p-3 rounded-xl border border-theme hover:border-secondary hover:shadow-sm transition-all duration-200 group">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: a.color + "12" }}>
                    {a.icon}
                  </div>
                  <span className="text-sm font-medium text-theme-light group-hover:text-secondary transition-colors">{a.label}</span>
                  <svg className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="var(--color-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent messages */}
          <div className="lg:col-span-2 bg-card border border-theme rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-bold tracking-[2px] text-secondary">RECENT MESSAGES</div>
              <Link to="/admin/messages" className="text-xs font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "var(--color-border)" }} />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-theme-light text-sm">No messages yet</div>
            ) : (
              <div className="space-y-2">
                {messages.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-theme hover:border-secondary transition-all">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: m.is_read ? "var(--color-border)" : "var(--color-primary)" }}>
                      {m.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary truncate">{m.name}</span>
                        {!m.is_read && (
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#DC2626" }} />
                        )}
                      </div>
                      <p className="text-xs text-theme-light truncate">{m.message}</p>
                    </div>
                    <div className="text-[10px] text-theme-light flex-shrink-0">
                      {new Date(m.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Site pages overview */}
        <div className="bg-card border border-theme rounded-2xl p-5">
          <div className="text-xs font-bold tracking-[2px] text-secondary mb-4">WEBSITE PAGES STATUS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Home", status: "Live", icon: "🏠", path: "/" },
              { name: "About", status: "Live", icon: "🏢", path: "/about" },
              { name: "Services", status: "Live", icon: "⚙️", path: "/services" },
              { name: "Team", status: "Dynamic", icon: "👥", path: "/team" },
              { name: "Portfolio", status: "Dynamic", icon: "📋", path: "/portfolio" },
              { name: "Testimonials", status: "Dynamic", icon: "💬", path: "/testimonials" },
              { name: "Contact", status: "Live", icon: "📬", path: "/contact" },
              { name: "Admin", status: "Active", icon: "🔐", path: "/admin/dashboard" },
            ].map((p, i) => (
              <a key={i} href={p.path} target={p.path.startsWith("/admin") ? "_self" : "_blank"} rel="noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl border border-theme hover:border-secondary transition-all group">
                <span className="text-base">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-primary truncate">{p.name}</div>
                  <div className="text-[10px]" style={{
                    color: p.status === "Live" ? "#0F6E56" : p.status === "Dynamic" ? "#C9A84C" : "#1A237E"
                  }}>{p.status}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
  );
}
