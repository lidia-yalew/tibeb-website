import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function Dashboard() {
  const [stats, setStats] = useState({ team: 0, portfolio: 0, testimonials: 0, messages: 0, unread: 0 });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.allSettled([
      axios.get(`${API}/team`),
      axios.get(`${API}/portfolio`),
      axios.get(`${API}/testimonials`),
      axios.get(`${API}/admin/contacts`, { headers }),
    ]).then(([teamRes, portRes, testRes, contactRes]) => {
      const teamData = teamRes.status === 'fulfilled' && Array.isArray(teamRes.value.data) ? teamRes.value.data : [];
      const portData = portRes.status === 'fulfilled' && Array.isArray(portRes.value.data) ? portRes.value.data : [];
      const testData = testRes.status === 'fulfilled' && Array.isArray(testRes.value.data) ? testRes.value.data : [];
      const msgs = contactRes.status === 'fulfilled' && Array.isArray(contactRes.value.data) ? contactRes.value.data : (contactRes.value?.data?.data || []);

      setStats({
        team: teamData.length,
        portfolio: portData.length,
        testimonials: testData.length,
        messages: msgs.length,
        unread: msgs.filter((m) => !m.is_read).length,
      });
      setMessages(msgs.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Team Members", value: stats.team, icon: "👥", color: "#1A237E", path: "/admin/team", action: "Manage Team" },
    { label: "Portfolio Projects", value: stats.portfolio, icon: "💼", color: "#C9A84C", path: "/admin/portfolio", action: "Manage Portfolio" },
    { label: "Testimonials", value: stats.testimonials, icon: "⭐", path: "/admin/testimonials", action: "Manage Testimonials" },
    { label: "Contact Messages", value: stats.messages, icon: "✉️", color: "#1A237E", path: "/admin/messages", action: "View Messages", badge: stats.unread ? `${stats.unread} unread` : null },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary">Dashboard Overview</h1>
        <p className="text-theme-light text-sm mt-1">Welcome to Tibeb CMS. Manage your team, portfolio, blog, and inquiries.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-theme-light">Loading dashboard analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((c, i) => (
              <div key={i} className="bg-card border border-theme rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-theme-light uppercase tracking-wider">{c.label}</span>
                    <h3 className="text-3xl font-extrabold text-primary mt-2">{c.value}</h3>
                  </div>
                  <span className="text-2xl p-3 bg-theme rounded-xl">{c.icon}</span>
                </div>
                <div className="mt-6 pt-4 border-t border-theme flex justify-between items-center">
                  <Link to={c.path} className="text-xs font-bold text-secondary hover:underline">{c.action} →</Link>
                  {c.badge && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">{c.badge}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-theme rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-primary">Recent Inquiries</h2>
              <Link to="/admin/messages" className="text-xs font-bold text-secondary hover:underline">View All →</Link>
            </div>
            {messages.length === 0 ? (
              <p className="text-xs text-theme-light text-center py-6">No recent contact inquiries.</p>
            ) : (
              <div className="divide-y divide-theme">
                {messages.map((m) => (
                  <div key={m.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-primary">{m.name}</strong> <span className="text-theme-light">({m.email})</span>
                      <p className="text-theme-light line-clamp-1 mt-0.5">{m.subject || m.message}</p>
                    </div>
                    <span className="text-[10px] text-theme-light">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
