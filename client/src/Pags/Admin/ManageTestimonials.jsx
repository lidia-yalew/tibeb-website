import { useEffect, useState } from "react";
import axios from "axios";


const token = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${token()}` });

const TABS = [
  { key: "pending",  label: "Pending Review", icon: "⏳", color: "#D97706" },
  { key: "approved", label: "Published",       icon: "✅", color: "#059669" },
];

const emptyForm = { client_name: "", client_role: "", organization: "", quote: "" };
const COLORS = ["#1A237E", "#C9A84C", "#1A237E", "#C9A84C", "#1A237E", "#C9A84C"];

const initials = (name) =>
  name?.split(" ").filter((w) => w.length > 1).map((w) => w[0]).slice(0, 2).join("") || "?";

const inputStyle = {
  background: "var(--color-bg)",
  borderColor: "var(--color-border)",
  color: "var(--color-text)",
};
const focusStyle = (e) => { e.target.style.borderColor = "#1A237E"; e.target.style.boxShadow = "0 0 0 3px rgba(26,35,126,0.1)"; };
const blurStyle  = (e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; };

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch]       = useState("");
  const [saving, setSaving]       = useState(false);
  const [acting, setActing]       = useState(null);
  const [toast, setToast]         = useState(null);
  const [selectedT, setSelectedT] = useState(null);
  const [viewMode, setViewMode]   = useState("grid");

  const API = `${import.meta.env.VITE_API_URL}/testimonials`

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, { headers: headers() });
      setTestimonials(res.data);
    } catch { showToast("Failed to load testimonials", "error"); }
    finally   { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  // Tab filtering
  const byTab = testimonials.filter((t) =>
    activeTab === "approved"
      ? t.is_published === true || t.status === "approved"
      : t.status === "pending" || (!t.status && !t.is_published)
  );
  const filtered = byTab.filter(
    (t) => t.client_name?.toLowerCase().includes(search.toLowerCase()) ||
           t.organization?.toLowerCase().includes(search.toLowerCase())
  );
  const tabCount = (key) =>
    testimonials.filter((t) =>
      key === "approved"
        ? t.is_published === true || t.status === "approved"
        : t.status === "pending" || (!t.status && !t.is_published)
    ).length;

  // PUBLISH
  const handlePublish = async (t) => {
    setActing(t.id);
    try {
      await axios.put(`${API}/${t.id}/publish`, { status: "approved", is_published: true }, { headers: headers() });
      showToast("Testimonial is now live on the website!");
      fetchAll();
    } catch { showToast("Action failed", "error"); }
    finally   { setActing(null); }
  };

  // UNPUBLISH
  const handleUnpublish = async (t) => {
    setActing(t.id);
    try {
      await axios.put(`${API}/${t.id}/publish`, { status: "pending", is_published: false }, { headers: headers() });
      showToast("Testimonial hidden from public site");
      fetchAll();
    } catch { showToast("Action failed", "error"); }
    finally   { setActing(null); }
  };

  // DELETE (REJECT) - permanently delete
  const handleDelete = async (t) => {
    if (!window.confirm(`Delete testimonial from "${t.client_name}"?\n\nThis cannot be undone.`)) return;
    setActing(t.id);
    try {
      await axios.delete(`${API}/${t.id}`, { headers: headers() });
      showToast("Testimonial deleted");
      if (selectedT?.id === t.id) setSelectedT(null);
      fetchAll();
    } catch { showToast("Delete failed", "error"); }
    finally   { setActing(null); }
  };

  const StatusBadge = ({ t }) => {
    const pub = t.is_published || t.status === "approved";
    return (
      <span style={{ background: pub ? "#ECFDF5" : "#FFFBEB", color: pub ? "#059669" : "#D97706",
        fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100, letterSpacing: 0.5 }}>
        {pub ? "Published" : "Pending"}
      </span>
    );
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2 animate-slide-in"
            style={{ background: toast.type === "error" ? "#DC2626" : "#059669" }}>
            {toast.msg}
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">Manage Testimonials</h2>
            <p className="text-sm text-theme-light mt-1">
              {tabCount("pending")} awaiting review · {tabCount("approved")} live on website
            </p>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 4, background: "var(--color-card)",
          border: "1px solid var(--color-border)", borderRadius: 14, padding: 6 }}>
          {TABS.map((tab) => {
            const count = tabCount(tab.key);
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 6, transition: "all 0.2s",
                  background: active ? tab.color : "transparent",
                  color: active ? "#fff" : "var(--color-text-muted)",
                  boxShadow: active ? `0 4px 12px ${tab.color}40` : "none" }}>
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {count > 0 && (
                  <span style={{ background: active ? "rgba(255,255,255,0.25)" : tab.color + "20",
                    color: active ? "#fff" : tab.color, fontSize: 11, fontWeight: 800,
                    padding: "1px 7px", borderRadius: 100, minWidth: 22 }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* INFO BANNERS */}
        {activeTab === "pending" && tabCount("pending") > 0 && (
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12,
            padding: "12px 16px", fontSize: 13, color: "#92400E", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>⏳</span>
            <span>
              Clients submitted these from the public website. They are <strong>invisible to visitors</strong> until published.
              <br /><strong>Publish</strong> = makes it live on the website &nbsp;·&nbsp; <strong>Delete</strong> = permanently removes it
            </span>
          </div>
        )}
        {activeTab === "approved" && (
          <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12,
            padding: "12px 16px", fontSize: 13, color: "#065F46", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>✅</span>
            <span>These are <strong>live on the public website</strong>. Click <strong>Unpublish</strong> to hide temporarily.</span>
          </div>
        )}

        {/* SEARCH + VIEW TOGGLE */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-light">🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or organization..."
              className="w-full pl-9 pr-4 py-3 rounded-xl border text-sm outline-none"
              style={{ background: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              onFocus={focusStyle} onBlur={blurStyle} />
          </div>
          <div className="flex items-center gap-1 bg-card rounded-xl p-1 border border-theme flex-shrink-0">
            {["grid", "list"].map((m) => (
              <button key={m} onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === m ? "bg-primary text-white shadow-md" : "text-theme-light"}`}>
                {m === "grid" ? "📐 Grid" : "📋 List"}
              </button>
            ))}
          </div>
        </div>

        {/* CARDS */}
        {loading ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-3"}>
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: "var(--color-border)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-theme rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">{activeTab === "pending" ? "⏳" : "✅"}</div>
            <div className="font-bold text-primary text-lg mb-2">
              No {activeTab === "pending" ? "pending" : "published"} testimonials
            </div>
            <p className="text-theme-light text-sm">
              {activeTab === "pending"
                ? "Client submissions will appear here for your review."
                : "Publish testimonials from the Pending tab to show them here."}
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-3">
            {filtered.map((t, i) => (
              <div key={t.id}
                className="bg-card border border-theme rounded-2xl p-4 hover:shadow-lg transition-all flex items-center gap-4 cursor-pointer"
                onClick={() => setSelectedT(t)}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: COLORS[i % COLORS.length] }}>
                  {initials(t.client_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-bold text-primary">{t.client_name}</span>
                    <StatusBadge t={t} />
                  </div>
                  <p className="text-xs text-theme-light line-clamp-2">"{t.quote}"</p>
                  <div className="text-[9px] text-theme-light mt-1">
                    {t.submitted_at
                      ? `Submitted ${new Date(t.submitted_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`
                      : `Added ${new Date(t.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {activeTab === "pending" && (
                    <>
                      <button onClick={() => handlePublish(t)} disabled={acting === t.id}
                        style={{ padding:"6px 14px",borderRadius:8,fontSize:11,fontWeight:700,background:"#059669",color:"#fff",border:"none",cursor:"pointer",opacity:acting===t.id?0.6:1 }}>
                        {acting===t.id?"⏳":"✅ Publish"}
                      </button>
                      <button onClick={() => handleDelete(t)} disabled={acting === t.id}
                        style={{ padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:700,background:"transparent",color:"#DC2626",border:"1.5px solid #DC2626",cursor:"pointer",opacity:acting===t.id?0.6:1 }}>
                        🗑️ Delete
                      </button>
                    </>
                  )}
                  {activeTab === "approved" && (
                    <>
                      <button onClick={() => handleUnpublish(t)} disabled={acting === t.id}
                        style={{ padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:700,background:"transparent",color:"#D97706",border:"1.5px solid #D97706",cursor:"pointer",opacity:acting===t.id?0.6:1 }}>
                        {acting===t.id?"⏳":"⏸️ Unpublish"}
                      </button>
                      <button onClick={() => handleDelete(t)} disabled={acting === t.id}
                        style={{ padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:700,background:"transparent",color:"#DC2626",border:"1.5px solid #DC2626",cursor:"pointer",opacity:acting===t.id?0.6:1 }}>
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((t, i) => (
              <div key={t.id}
                className="bg-card border border-theme rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => setSelectedT(t)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl font-black leading-none" style={{ color:COLORS[i%COLORS.length], opacity:0.12 }}>"</div>
                  <StatusBadge t={t} />
                </div>
                <p className="text-sm text-theme-light italic leading-relaxed flex-1 mb-4 line-clamp-4">{t.quote}</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: COLORS[i%COLORS.length] }}>
                    {initials(t.client_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-primary truncate">{t.client_name}</div>
                    <div className="text-[10px] text-theme-light truncate">{t.client_role} · {t.organization}</div>
                  </div>
                </div>
                {t.submitted_at && (
                  <div className="text-[10px] text-theme-light mb-2">
                    🕐 {new Date(t.submitted_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                  </div>
                )}
                <div className="flex gap-2 pt-3 border-t border-theme flex-wrap" onClick={(e) => e.stopPropagation()}>
                  {activeTab === "pending" && (
                    <>
                      <button onClick={() => handlePublish(t)} disabled={acting===t.id}
                        style={{ flex:1,padding:"8px 4px",borderRadius:10,fontSize:12,fontWeight:700,background:"#059669",color:"#fff",border:"none",cursor:acting===t.id?"not-allowed":"pointer",opacity:acting===t.id?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4 }}>
                        {acting===t.id?"⏳":"✅"} Publish
                      </button>
                      <button onClick={() => handleDelete(t)} disabled={acting===t.id}
                        style={{ flex:1,padding:"8px 4px",borderRadius:10,fontSize:12,fontWeight:700,background:"transparent",color:"#DC2626",border:"1.5px solid #DC2626",cursor:acting===t.id?"not-allowed":"pointer",opacity:acting===t.id?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4 }}>
                        🗑️ Delete
                      </button>
                    </>
                  )}
                  {activeTab === "approved" && (
                    <>
                      <button onClick={() => handleUnpublish(t)} disabled={acting===t.id}
                        style={{ flex:1,padding:"8px 4px",borderRadius:10,fontSize:12,fontWeight:700,background:"transparent",color:"#D97706",border:"1.5px solid #D97706",cursor:acting===t.id?"not-allowed":"pointer",opacity:acting===t.id?0.6:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4 }}>
                        {acting===t.id?"⏳":"⏸️"} Unpublish
                      </button>
                      <button onClick={() => handleDelete(t)} disabled={acting===t.id}
                        style={{ padding:"8px 14px",borderRadius:10,fontSize:12,fontWeight:700,background:"transparent",color:"#DC2626",border:"1.5px solid #DC2626",cursor:acting===t.id?"not-allowed":"pointer",opacity:acting===t.id?0.6:1 }}>
                        {acting===t.id?"⏳":"🗑️"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedT(null)}>
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-theme relative"
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedT(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-theme-light transition-colors text-theme-light">✕</button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4" style={{ background:"#1A237E" }}>
                {initials(selectedT.client_name)}
              </div>
              <h2 className="text-xl font-extrabold text-primary">{selectedT.client_name}</h2>
              <p className="text-sm font-semibold mt-1" style={{ color:"#C9A84C" }}>{selectedT.client_role} · {selectedT.organization}</p>
              <div className="mt-2"><StatusBadge t={selectedT} /></div>
              {selectedT.submitted_at && (
                <span className="text-xs text-theme-light mt-2">
                  🕐 Submitted {new Date(selectedT.submitted_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
                </span>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-theme">
              <p className="text-theme-light leading-relaxed text-sm text-center italic">"{selectedT.quote}"</p>
            </div>
            <div className="flex gap-3 mt-6">
              {(selectedT.status==="pending" || (!selectedT.status && !selectedT.is_published)) && (
                <>
                  <button onClick={() => { handlePublish(selectedT); setSelectedT(null); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background:"#059669" }}>
                    ✅ Publish
                  </button>
                  <button onClick={() => handleDelete(selectedT)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all" style={{ borderColor:"#DC2626",color:"#DC2626" }}>
                    🗑️ Delete
                  </button>
                </>
              )}
              {(selectedT.is_published || selectedT.status==="approved") && (
                <>
                  <button onClick={() => { handleUnpublish(selectedT); setSelectedT(null); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all" style={{ borderColor:"#D97706",color:"#D97706" }}>
                    ⏸️ Unpublish
                  </button>
                  <button onClick={() => handleDelete(selectedT)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all" style={{ borderColor:"#DC2626",color:"#DC2626" }}>
                    🗑️ Delete
                  </button>
                </>
              )}
              <button onClick={() => setSelectedT(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background:"var(--color-primary)" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-4{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
        .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        @keyframes slide-in{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fade-in{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        .animate-slide-in{animation:slide-in 0.3s ease forwards}
        .animate-fade-in{animation:fade-in 0.3s ease forwards}
      `}</style>
    </div>
  );
}