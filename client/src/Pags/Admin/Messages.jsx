import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/contact";
const token = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${token()}` });

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all"); // all | unread | read
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(API, { headers: headers() });
      setMessages(res.data);
    } catch { showToast("Failed to load messages", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkRead = async (msg) => {
    if (msg.is_read) return;
    try {
      await axios.put(`${API}/${msg.id}`, {}, { headers: headers() });
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
      if (selected?.id === msg.id) setSelected({ ...msg, is_read: true });
      showToast("Marked as read");
    } catch { showToast("Failed to update", "error"); }
  };

  const handleSelect = (msg) => {
    setSelected(msg);
    handleMarkRead(msg);
  };

  const filtered = messages.filter((m) => {
    const matchFilter = filter === "all" ? true : filter === "unread" ? !m.is_read : m.is_read;
    const matchSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  // Parse client type from message if stored
  const parseType = (msg) => {
    if (msg?.includes("[Client")) return { label: "Client / NGO", color: "#1A237E", icon: "🏢" };
    if (msg?.includes("[Partner")) return { label: "Partner / Donor", color: "#C9A84C", icon: "🤝" };
    if (msg?.includes("[Job")) return { label: "Job Seeker", color: "#1A237E", icon: "👤" };
    return { label: "General", color: "#6B7280", icon: "📬" };
  };

  const initials = (name) => name?.split(" ").map(w => w[0]).slice(0, 2).join("") || "?";

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="max-w-6xl space-y-5">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold"
          style={{ background: toast.type === "error" ? "#DC2626" : "#0F6E56" }}>
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">Messages</h2>
          <p className="text-theme-light text-sm mt-0.5">
            {messages.length} total · {" "}
            <span style={{ color: unreadCount > 0 ? "#DC2626" : "var(--color-text-light)" }}>
              {unreadCount} unread
            </span>
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3">
          {[
            { label: "Total", val: messages.length, color: "#1A237E" },
            { label: "Unread", val: unreadCount, color: "#DC2626" },
            { label: "Read", val: messages.length - unreadCount, color: "#0F6E56" },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-theme rounded-xl px-4 py-2 text-center min-w-[64px]">
              <div className="text-lg font-extrabold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[10px] text-theme-light">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & search */}
      <div className="flex flex-wrap gap-3 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search by name, email or message..."
          className="px-4 py-2 rounded-xl border text-sm outline-none flex-1 min-w-[200px]"
          style={{ background: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />

        <div className="flex gap-2">
          {["all", "unread", "read"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize"
              style={{
                background: filter === f ? "var(--color-primary)" : "var(--color-card)",
                borderColor: filter === f ? "var(--color-primary)" : "var(--color-border)",
                color: filter === f ? "#fff" : "var(--color-text)",
              }}>
              {f === "all" ? `All (${messages.length})` : f === "unread" ? `Unread (${unreadCount})` : `Read (${messages.length - unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Main panel — list + detail */}
      <div className="grid lg:grid-cols-5 gap-4" style={{ minHeight: "500px" }}>

        {/* Message list */}
        <div className="lg:col-span-2 bg-card border border-theme rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-theme">
            <div className="text-xs font-bold tracking-[2px] text-secondary">INBOX</div>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "var(--color-border)" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="text-4xl mb-3">📭</div>
              <div className="font-bold text-primary text-sm mb-1">No messages</div>
              <p className="text-theme-light text-xs">
                {messages.length === 0 ? "No messages received yet. Share the contact page!" : "No messages match your filter."}
              </p>
            </div>
          ) : (
            <div className="divide-y overflow-y-auto" style={{ borderColor: "var(--color-border)", maxHeight: "600px" }}>
              {filtered.map((m) => {
                const type = parseType(m.message);
                const isSelected = selected?.id === m.id;
                return (
                  <div key={m.id} onClick={() => handleSelect(m)}
                    className="flex items-start gap-3 p-4 cursor-pointer transition-all hover:bg-[var(--color-bg-light)]"
                    style={{
                      background: isSelected ? "var(--color-primary)08" : "transparent",
                      borderLeft: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                    }}>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: type.color }}>
                        {initials(m.name)}
                      </div>
                      {!m.is_read && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-card"
                          style={{ background: "#DC2626" }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-sm truncate ${!m.is_read ? "font-bold text-primary" : "font-medium text-theme-light"}`}>
                          {m.name}
                        </span>
                        <span className="text-[10px] text-theme-light flex-shrink-0">{formatDate(m.created_at)}</span>
                      </div>
                      <div className="text-xs text-theme-light truncate">{m.email}</div>
                      <div className="text-xs text-theme-light truncate mt-0.5 line-clamp-1">{m.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3 bg-card border border-theme rounded-2xl overflow-hidden">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
              <div className="text-5xl mb-4">📬</div>
              <div className="font-bold text-primary mb-1">Select a message</div>
              <p className="text-theme-light text-sm">Click any message on the left to read it here</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">

              {/* Detail header */}
              <div className="px-6 py-4 border-b border-theme">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: parseType(selected.message).color }}>
                    {initials(selected.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-primary">{selected.name}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: parseType(selected.message).color + "15",
                          color: parseType(selected.message).color
                        }}>
                        {parseType(selected.message).icon} {parseType(selected.message).label}
                      </span>
                      {selected.is_read ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "#0F6E5615", color: "#0F6E56" }}>✓ Read</span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "#DC262615", color: "#DC2626" }}>● New</span>
                      )}
                    </div>
                    <div className="text-sm text-theme-light mt-0.5">{selected.email}</div>
                    <div className="text-xs text-theme-light mt-0.5">
                      {new Date(selected.created_at).toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message body */}
              <div className="flex-1 px-6 py-5 overflow-y-auto">
                <div className="text-xs font-bold tracking-[2px] text-secondary mb-3">MESSAGE</div>
                <div className="bg-[var(--color-bg)] rounded-2xl p-5 border border-theme">
                  <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>

              {/* Reply actions */}
              <div className="px-6 py-4 border-t border-theme">
                <div className="text-xs font-bold tracking-[2px] text-secondary mb-3">REPLY OPTIONS</div>
                <div className="flex flex-wrap gap-3">
                  <a href={`mailto:${selected.email}?subject=Re: Your message to Tibeb Consultancy`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "var(--color-primary)" }}>
                    ✉️ Reply by Email
                  </a>
                  <a href={`tel:${selected.phone || ""}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-90"
                    style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                    📞 Call
                  </a>
                  {!selected.is_read && (
                    <button onClick={() => handleMarkRead(selected)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                      style={{ borderColor: "#0F6E56", color: "#0F6E56" }}>
                      ✓ Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
