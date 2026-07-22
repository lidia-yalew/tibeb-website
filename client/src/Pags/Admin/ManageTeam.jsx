import { useEffect, useState } from "react";
import axios from "axios";

const token = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${token()}` });

const departments = [
  "Executive Team",
  "Data Intelligence, Research & Statistical Services",
  "Training & Capacity Building",
  "Project Management & Research",
  "Finance & Human Resource",
];

const emptyForm = { name: "", role: "", department: "", bio: "", photo_url: "" };

// Compress image using canvas before sending to server
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) {
      reject("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 400;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = Math.round((h * MAX) / w); w = MAX; } }
        else { if (h > MAX) { w = Math.round((w * MAX) / h); h = MAX; } }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = () => reject("Failed to load image");
      img.src = e.target.result;
    };
    reader.onerror = () => reject("Failed to read file");
    reader.readAsDataURL(file);
  });
};

export default function ManageTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterDept, setFilterDept] = useState("All");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  const API = `${import.meta.env.VITE_API_URL}/team`;

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(API);
      setMembers(res.data);
    } catch { 
      showToast("Failed to load team", "error"); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  // Detect screen size for responsive pagination
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setVisibleCount(mobile ? 4 : 6);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    try {
      const compressed = await compressImage(file);
      setForm((prev) => ({ ...prev, photo_url: compressed }));
      showToast("Photo ready!");
    } catch (err) {
      showToast(typeof err === "string" ? err : "Image error", "error");
    } finally {
      setPhotoLoading(false);
    }
  };

  const clearPhoto = () => setForm((prev) => ({ ...prev, photo_url: "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form, { headers: headers() });
        showToast("Member updated successfully!");
      } else {
        await axios.post(API, form, { headers: headers() });
        showToast("Member added successfully!");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchMembers();
    } catch { 
      showToast("Something went wrong", "error"); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleEdit = (m) => {
    setForm({ 
      name: m.name, 
      role: m.role, 
      department: m.department, 
      bio: m.bio || "", 
      photo_url: m.photo_url || "" 
    });
    setEditId(m.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/${id}`, { headers: headers() });
      showToast("Member removed");
      fetchMembers();
    } catch { 
      showToast("Delete failed", "error"); 
    } finally { 
      setDeleting(null); 
    }
  };

  const filtered = members.filter((m) => {
    const matchDept = filterDept === "All" || m.department === filterDept;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  // Get visible members based on pagination
  const visibleMembers = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Get the correct number of items to show based on screen size
  const getVisibleCount = () => {
    return isMobile ? 4 : 6;
  };

  // Load more handler
  const loadMore = () => {
    const increment = isMobile ? 4 : 6;
    setVisibleCount(prev => Math.min(prev + increment, filtered.length));
  };

  // Show less handler
  const showLess = () => {
    setVisibleCount(getVisibleCount());
  };

  const deptColor = (dept) =>
    dept?.includes("Executive") ? "#1A237E" :
    dept?.includes("Data") ? "#C9A84C" :
    dept?.includes("Training") ? "#1A237E" :
    dept?.includes("Project") ? "#C9A84C" : "#1A237E";

  const initials = (name) =>
    name?.split(" ").filter(w => !["Dr.", "Mr.", "PhD"].includes(w)).map(w => w[0]).slice(0, 2).join("") || "?";

  // Helper to get short department name for display
  const getShortDept = (dept) => {
    if (dept === "Data Intelligence, Research & Statistical Services") return "Data Intelligence";
    return dept;
  };

  return (
    <div className="max-w-6xl space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold animate-slide-in"
          style={{ background: toast.type === "error" ? "#DC2626" : "#0F6E56" }}>
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">Manage Team</h2>
          <p className="text-theme-light text-sm mt-0.5">{members.length} members · {departments.length} departments</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: "var(--color-primary)" }}
          >
            {showForm ? "✕ Cancel" : "+ Add Member"}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border-2 rounded-2xl p-6 animate-fade-in" style={{ borderColor: "var(--color-primary)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: "var(--color-primary)" }}>
              {editId ? "✏️" : "👤"}
            </div>
            <div>
              <h3 className="font-extrabold text-primary">{editId ? "Edit Team Member" : "Add New Team Member"}</h3>
              <p className="text-xs text-theme-light">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-theme-light mb-1 block">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  placeholder="e.g. Dr. Tizazu Abza"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} />
              </div>
              <div>
                <label className="text-xs font-semibold text-theme-light mb-1 block">Role / Title *</label>
                <input name="role" value={form.role} onChange={handleChange} required
                  placeholder="e.g. General Manager"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-light mb-1 block">Department *</label>
              <select name="department" value={form.department} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}>
                <option value="">Select department...</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Photo upload */}
            <div>
              <label className="text-xs font-semibold text-theme-light mb-2 block">Photo (optional)</label>
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  {form.photo_url ? (
                    <>
                      <img src={form.photo_url} alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover border-2"
                        style={{ borderColor: "var(--color-secondary)" }} />
                      <button type="button" onClick={clearPhoto}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md"
                        style={{ background: "#DC2626" }}>✕</button>
                    </>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center text-2xl"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
                      {photoLoading ? (
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="var(--color-border)" strokeWidth="3"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                      ) : "👤"}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    name="photo_url"
                    value={form.photo_url?.startsWith("data:") ? "" : form.photo_url}
                    onChange={handleChange}
                    placeholder="Paste image URL..."
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                    style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} />

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1" style={{ background: "var(--color-border)" }} />
                    <span className="text-[10px] text-theme-light">or</span>
                    <div className="h-px flex-1" style={{ background: "var(--color-border)" }} />
                  </div>

                  <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-primary hover:bg-[var(--color-bg-light)]"
                    style={{ borderColor: "var(--color-border)" }}>
                    {photoLoading ? (
                      <span className="text-xs text-theme-light">⏳ Compressing...</span>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                            stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                          Upload from device
                        </span>
                        <span className="text-[10px] text-theme-light">(auto-compressed)</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>

                  {form.photo_url && (
                    <p className="text-[10px] text-theme-light">
                      ✅ Photo ready ·{" "}
                      <button type="button" onClick={clearPhoto} className="underline" style={{ color: "#DC2626" }}>Remove</button>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs font-semibold text-theme-light mb-1 block">Bio / Description</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                placeholder="Brief description of expertise and background..."
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving || photoLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--color-primary)" }}>
                {saving ? "⏳ Saving..." : editId ? "✓ Update Member" : "+ Add Member"}
              </button>
              <button type="button"
                onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & View Toggle */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-light">🔍</span>
          <input 
            value={search} 
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(getVisibleCount());
            }}
            placeholder="Search by name or role..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} 
          />
        </div>
        
        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1 bg-card rounded-xl p-1 border border-theme flex-shrink-0">
          <button
            onClick={() => {
              setViewMode("grid");
              setVisibleCount(getVisibleCount());
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "grid" 
                ? "bg-primary text-white shadow-md" 
                : "text-theme-light hover:bg-theme-light/20"
            }`}
          >
            📐 Grid
          </button>
          <button
            onClick={() => {
              setViewMode("list");
              setVisibleCount(getVisibleCount());
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "list" 
                ? "bg-primary text-white shadow-md" 
                : "text-theme-light hover:bg-theme-light/20"
            }`}
          >
            📋 List
          </button>
        </div>
      </div>

      {/* Dept stat cards */}
      <div className="grid grid-cols-5 md:grid-cols-5 gap-3">
        {departments.map((d, i) => {
          const count = members.filter((m) => m.department === d).length;
          const color = deptColor(d);
          const isActive = filterDept === d;
          return (
            <button key={i} onClick={() => { setFilterDept(isActive ? "All" : d); setVisibleCount(getVisibleCount()); }}
              className="bg-card border rounded-xl p-3 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              style={{
                borderColor: isActive ? color : "var(--color-border)",
                boxShadow: isActive ? `0 4px 20px ${color}25` : "none",
              }}>
              <div className="text-xl font-extrabold" style={{ color: isActive ? color : "var(--color-text)" }}>{count}</div>
              <div className="text-[10px] text-theme-light leading-tight mt-0.5">
                {d === "Data Intelligence, Research & Statistical Services" ? "Data Intelligence" : d.split(" ").slice(0, 2).join(" ")}
              </div>
              {isActive && <div className="mt-1.5 flex justify-center"><div className="w-6 h-0.5 rounded-full" style={{ background: color }} /></div>}
            </button>
          );
        })}
      </div>

      {/* Team grid/list */}
      {loading ? (
        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: "var(--color-border)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-theme rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">👥</div>
          <div className="font-bold text-primary mb-1">No team members found</div>
          <p className="text-theme-light text-sm">
            {members.length === 0 ? "Start by adding your first team member!" : "Try changing your search or filter."}
          </p>
        </div>
      ) : (
        <>
          <div className={viewMode === "grid" 
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {visibleMembers.map((m) => {
              const color = deptColor(m.department);
              
              if (viewMode === "grid") {
                return (
                  <div key={m.id} 
                    className="bg-card border border-theme rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedMember(m)}>
                    
                    {/* Header with avatar */}
                    <div className="flex items-start gap-3 mb-3">
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border-2"
                          style={{ borderColor: color + "40" }} />
                      ) : (
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: color }}>
                          {initials(m.name)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-primary leading-snug">{m.name}</h4>
                        <p className="text-xs font-semibold mt-0.5" style={{ color }}>{m.role}</p>
                      </div>
                    </div>

                    {/* Department badge */}
                    <div className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold mb-3"
                      style={{ background: color + "12", color }}>
                      {getShortDept(m.department)}
                    </div>

                    {/* Bio */}
                    {m.bio && <p className="text-xs text-theme-light leading-relaxed line-clamp-2 mb-3">{m.bio}</p>}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-theme">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(m); }}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-primary/5"
                        style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                        ✏️ Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} disabled={deleting === m.id}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-red-50"
                        style={{ borderColor: "#DC2626", color: "#DC2626" }}>
                        {deleting === m.id ? "⏳" : "🗑️"} Remove
                      </button>
                    </div>
                  </div>
                );
              } else {
                // List View - Compact
                return (
                  <div key={m.id} 
                    className="bg-card border border-theme rounded-2xl p-4 hover:shadow-lg transition-all duration-300 flex items-center gap-4 group cursor-pointer"
                    onClick={() => setSelectedMember(m)}>
                    
                    {/* Avatar */}
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.name}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border-2"
                        style={{ borderColor: color + "40" }} />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: color }}>
                        {initials(m.name)}
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-primary">{m.name}</span>
                        <span className="text-xs font-semibold" style={{ color }}>{m.role}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: color + "12", color }}>
                          {getShortDept(m.department)}
                        </span>
                        {m.bio && (
                          <span className="text-[10px] text-theme-light truncate max-w-[300px]">{m.bio}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(m); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-primary/5"
                        style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                        ✏️
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} disabled={deleting === m.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-red-50"
                        style={{ borderColor: "#DC2626", color: "#DC2626" }}>
                        {deleting === m.id ? "⏳" : "🗑️"}
                      </button>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* ── SHOW MORE / SHOW LESS BUTTON ── */}
          {filtered.length > getVisibleCount() && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              {hasMore && (
                <button
                  onClick={loadMore}
                  className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-md"
                  style={{ background: "var(--color-primary)" }}
                >
                  Show More ({filtered.length - visibleCount} remaining)
                </button>
              )}
              
              {visibleCount > getVisibleCount() && (
                <button
                  onClick={showLess}
                  className="px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-gray-100 border"
                  style={{ 
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)"
                  }}
                >
                  Show Less
                </button>
              )}

              {/* Counter */}
              <span className="text-xs text-muted">
                Showing {visibleMembers.length} of {filtered.length} team members
              </span>
            </div>
          )}
        </>
      )}

      {/* ── MODAL ── */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedMember(null)}>
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-theme animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}>
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-theme-light transition-colors text-theme-light"
            >
              ✕
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              {selectedMember.photo_url ? (
                <img src={selectedMember.photo_url} alt={selectedMember.name}
                  className="w-28 h-28 rounded-full object-cover border-4 mb-4"
                  style={{ borderColor: deptColor(selectedMember.department) + "40" }} />
              ) : (
                <div className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4"
                  style={{ background: deptColor(selectedMember.department) }}>
                  {initials(selectedMember.name)}
                </div>
              )}
              <h2 className="text-2xl font-extrabold text-primary">{selectedMember.name}</h2>
              <p className="text-sm font-semibold mt-1" style={{ color: deptColor(selectedMember.department) }}>
                {selectedMember.role}
              </p>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-2"
                style={{ background: deptColor(selectedMember.department) + "12", color: deptColor(selectedMember.department) }}>
                {selectedMember.department}
              </span>
            </div>

            {selectedMember.bio && (
              <div className="mt-6 pt-6 border-t border-theme">
                <h4 className="text-xs font-bold tracking-[2px] text-secondary mb-2 text-center">ABOUT</h4>
                <p className="text-theme-light leading-relaxed text-sm text-center">{selectedMember.bio}</p>
              </div>
            )}

            <button 
              onClick={() => setSelectedMember(null)}
              className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 w-full"
              style={{ background: "var(--color-primary)" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        input::placeholder,textarea::placeholder { color:var(--color-text-light,#6B7280);opacity:0.6; }
        select option { background:var(--color-card);color:var(--color-text); }
        
        @keyframes slide-in {
          from { opacity:0; transform: translateX(20px); }
          to { opacity:1; transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity:0; transform: translateY(-10px); }
          to { opacity:1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity:0; transform: scale(0.95); }
          to { opacity:1; transform: scale(1); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease forwards; }
        .animate-scale-in { animation: scale-in 0.25s ease forwards; }
      `}</style>
    </div>
  );
}