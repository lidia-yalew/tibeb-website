import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const statusFilters = [
  { id: "all", label: "All Messages" },
  { id: "unread", label: "Unread" },
  { id: "read", label: "Read" },
];

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMsg, setSelectedMsg] = useState(null);

  const fetchMessages = () => {
    const token = localStorage.getItem("token");
    axios.get(`${API}/admin/contacts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setMessages(list);
        if (list.length > 0 && !selectedMsg) {
          setSelectedMsg(list[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API}/admin/contacts/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
      if (selectedMsg?.id === id) {
        setSelectedMsg(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/admin/contacts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const remaining = messages.filter(m => m.id !== id);
      setMessages(remaining);
      if (selectedMsg?.id === id) {
        setSelectedMsg(remaining[0] || null);
      }
    } catch (err) {
      alert("Failed to delete message.");
    }
  };

  const filteredMessages = messages.filter(m => {
    const status = (m.status || "unread").toLowerCase();
    const matchesFilter = activeFilter === "all" || status === activeFilter;
    const matchesSearch = !search.trim() ||
      (m.name && m.name.toLowerCase().includes(search.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(search.toLowerCase())) ||
      (m.phone && m.phone.toLowerCase().includes(search.toLowerCase())) ||
      (m.subject && m.subject.toLowerCase().includes(search.toLowerCase())) ||
      (m.message && m.message.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(m => (m.status || 'unread').toLowerCase() === 'unread').length;
  const readCount = messages.filter(m => (m.status || '').toLowerCase() === 'read').length;

  const getAvatarGradient = (name = "") => {
    const gradients = [
      "from-blue-600 to-indigo-700",
      "from-emerald-500 to-teal-700",
      "from-purple-600 to-indigo-800",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-700"
    ];
    const charCode = name.charCodeAt(0) || 0;
    return gradients[charCode % gradients.length];
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Analytics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-primary">Inquiries & Messages</h1>
            {unreadCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-theme-light mt-1">Manage client messages and business inquiries from your website.</p>
        </div>

        {/* Stats Summary Pills */}
        <div className="flex gap-2">
          <div className="bg-card border rounded-xl px-3 py-1.5 text-center shadow-sm">
            <div className="text-xs font-extrabold text-primary">{messages.length}</div>
            <div className="text-[9px] text-theme-light uppercase font-bold">Total</div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 text-center shadow-sm">
            <div className="text-xs font-extrabold text-amber-600">{unreadCount}</div>
            <div className="text-[9px] text-amber-600 uppercase font-bold">Unread</div>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-center shadow-sm">
            <div className="text-xs font-extrabold text-emerald-600">{readCount}</div>
            <div className="text-[9px] text-emerald-600 uppercase font-bold">Read</div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filter Tabs */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-card p-3 rounded-2xl border shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by sender, email, phone, subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs outline-none bg-theme/30 text-primary focus:border-primary transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-theme-light">🔍</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0">
          {statusFilters.map(f => {
            const count = f.id === 'all' ? messages.length :
                          f.id === 'unread' ? unreadCount : readCount;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'bg-theme/40 text-theme-light hover:bg-theme/70'
                }`}
              >
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-card border text-theme-light'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Inbox View: Split Master-Detail Layout */}
      {loading ? (
        <div className="text-center py-16 text-xs text-theme-light animate-pulse">Loading inbox messages...</div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-16 bg-card border rounded-2xl text-xs text-theme-light space-y-2">
          <div className="text-3xl">📥</div>
          <div className="font-bold text-primary">No messages found</div>
          <p className="text-[11px] text-theme-light max-w-sm mx-auto">There are no client inquiries matching your search filter.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Message Cards List */}
          <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredMessages.map(m => {
              const isSelected = selectedMsg?.id === m.id;
              const status = (m.status || 'unread').toLowerCase();
              const isUnread = status === 'unread';

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    if (isUnread) {
                      const updatedMsg = { ...m, status: 'read' };
                      setSelectedMsg(updatedMsg);
                      handleUpdateStatus(m.id, 'read');
                    } else {
                      setSelectedMsg(m);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex gap-3.5 items-start ${
                    isSelected 
                      ? 'bg-card border-primary ring-2 ring-primary/20 shadow-md' 
                      : isUnread 
                      ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60' 
                      : 'bg-card border-theme hover:border-primary/40'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getAvatarGradient(m.name)} text-white font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {(m.name || "C")[0].toUpperCase()}
                  </div>

                  {/* Message Summary */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className={`text-xs truncate ${isUnread ? 'font-black text-primary' : 'font-bold text-primary/90'}`}>
                        {m.name}
                      </h4>
                      <span className="text-[10px] text-theme-light flex-shrink-0">
                        {new Date(m.created_at || m.submitted_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {m.organization && (
                      <div className="text-[10px] font-semibold text-blue-600 truncate mt-0.5">
                        🏢 {m.organization}
                      </div>
                    )}

                    <div className="text-[11px] font-medium text-primary mt-1 truncate">
                      {m.subject || "No Subject"}
                    </div>

                    <p className="text-[11px] text-theme-light mt-0.5 line-clamp-2 leading-relaxed">
                      {m.message}
                    </p>

                    {/* Status Pill */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        status === 'unread' ? 'bg-amber-500/15 text-amber-700 border border-amber-500/30' :
                        'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                      }`}>
                        {status}
                      </span>
                      {isUnread && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Active Message Detail Viewer */}
          <div className="lg:col-span-7 bg-card border rounded-2xl p-6 shadow-md sticky top-6 space-y-6">
            {selectedMsg ? (
              <>
                {/* Sender Header Card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarGradient(selectedMsg.name)} text-white font-black text-lg flex items-center justify-center shadow-md`}>
                      {(selectedMsg.name || "C")[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-primary">{selectedMsg.name}</h2>
                      <div className="text-xs text-theme-light flex flex-wrap items-center gap-2 mt-0.5">
                        <span>📧 {selectedMsg.email}</span>
                        {selectedMsg.phone && <span>• 📞 {selectedMsg.phone}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
                        (selectedMsg.status || 'unread').toLowerCase() === 'unread' 
                          ? 'bg-amber-500/10 text-amber-600' 
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                      {(selectedMsg.status || 'unread').toUpperCase()}
                    </span>

                    <button
                      onClick={() => handleDelete(selectedMsg.id)}
                      className="p-1.5 px-3 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold border border-red-200"
                      title="Delete Message"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Metadata Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-theme/30 p-3.5 rounded-xl border text-xs">
                  <div>
                    <span className="text-[10px] text-theme-light block font-semibold uppercase">Organization</span>
                    <span className="font-bold text-primary">{selectedMsg.organization || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-light block font-semibold uppercase">Date & Time</span>
                    <span className="font-bold text-primary">
                      {new Date(selectedMsg.created_at || selectedMsg.submitted_at || Date.now()).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-light block font-semibold uppercase">Subject</span>
                    <span className="font-bold text-primary truncate block">{selectedMsg.subject || "-"}</span>
                  </div>
                </div>

                {/* Full Message Body */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-theme-light uppercase tracking-wider">Message Content</h3>
                  <div className="bg-theme/20 border p-5 rounded-2xl text-xs text-primary leading-relaxed whitespace-pre-wrap font-normal shadow-inner min-h-[160px]">
                    {selectedMsg.message}
                  </div>
                </div>

        
              </>
            ) : (
              <div className="text-center py-20 text-xs text-theme-light">
                Select a message from the left list to read details.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
