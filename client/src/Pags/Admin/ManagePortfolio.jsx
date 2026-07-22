import { useEffect, useState } from "react";
import axios from "axios";

const token = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${token()}` });

const categories = [
  "Capacity Building & Training",
  "Data Analytics & Research",
  "Monitoring, Evaluation & Learning",
  "Institutional Development",
  "Human Resource & Recruitment",
  "Conference & Event Support",
  "Education & Digital Transformation",
];



const emptyForm = { title: "", client: "", description: "", date: "", category: "" };

const categoryColor = (cat) => {
  const map = {
    "Capacity Building & Training": "#1A237E",
    "Data Analytics & Research": "#C9A84C",
    "Monitoring, Evaluation & Learning": "#1A237E",
    "Institutional Development": "#C9A84C",
    "Human Resource & Recruitment": "#1A237E",
    "Conference & Event Support": "#C9A84C",
    "Education & Digital Transformation": "#1A237E",
  };
  return map[cat] || "#1A237E";
};

const categoryIcon = (cat) => {
  const map = {
    "Capacity Building & Training": "🎓",
    "Data Analytics & Research": "📊",
    "Monitoring, Evaluation & Learning": "📈",
    "Institutional Development": "🏛️",
    "Human Resource & Recruitment": "👥",
    "Conference & Event Support": "🏆",
    "Education & Digital Transformation": "💻",
  };
  return map[cat] || "📋";
};

export default function ManagePortfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

 const API = `${import.meta.env.VITE_API_URL}/portfolio`
  
  // Pagination state
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(API);
      setProjects(res.data);
    } catch { showToast("Failed to load projects", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form, { headers: headers() });
        showToast("Project updated successfully!");
      } else {
        await axios.post(API, form, { headers: headers() });
        showToast("Project added successfully!");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchProjects();
    } catch { showToast("Something went wrong", "error"); }
    finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title, client: p.client,
      description: p.description, date: p.date?.split("T")[0] || "",
      category: p.category || "",
    });
    setEditId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/${id}`, { headers: headers() });
      showToast("Project deleted");
      fetchProjects();
    } catch { showToast("Delete failed", "error"); }
    finally { setDeleting(null); }
  };

  const handleSeedAll = async () => {
    if (!window.confirm(`Add all ${seedProjects.length} real projects from the company profile?`)) return;
    setSeeding(true);
    try {
      for (const p of seedProjects) {
        await axios.post(API, p, { headers: headers() });
      }
      showToast(`${seedProjects.length} projects added from company profile!`);
      fetchProjects();
    } catch { showToast("Seed failed", "error"); }
    finally { setSeeding(false); }
  };

  const filtered = projects.filter((p) => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.client?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Get visible projects based on pagination
  const visibleProjects = filtered.slice(0, visibleCount);
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

  const inputStyle = {
    background: "var(--color-bg)",
    borderColor: "var(--color-border)",
    color: "var(--color-text)",
  };

  return (
    <div>
      <div className="max-w-6xl space-y-6">

        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold animate-slide-in"
            style={{ background: toast.type === "error" ? "#DC2626" : "#0F6E56" }}>
            {toast.type === "error" ? "❌" : "✅"} {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">Manage Portfolio</h2>
            <p className="text-theme-light text-sm mt-0.5">{projects.length} projects · {categories.length} categories</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {projects.length === 0 && (
              <button onClick={handleSeedAll} disabled={seeding}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:opacity-90 disabled:opacity-60"
                style={{ borderColor: "#C9A84C", color: "#C9A84C" }}>
                {seeding ? "⏳ Adding..." : "⚡ Seed from Profile"}
              </button>
            )}
            <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ background: "var(--color-primary)" }}>
              {showForm ? "✕ Cancel" : "+ Add Project"}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border-2 rounded-2xl p-6 animate-fade-in" style={{ borderColor: "var(--color-primary)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: "var(--color-primary)" }}>
                {editId ? "✏️" : "📁"}
              </div>
              <div>
                <h3 className="font-extrabold text-primary">{editId ? "Edit Project" : "Add New Project"}</h3>
                <p className="text-xs text-theme-light">Fill in the project details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-theme-light mb-1 block">Project Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  placeholder="e.g. SRA4C Terminal Evaluation"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Client */}
                <div>
                  <label className="text-xs font-semibold text-theme-light mb-1 block">Client / Organization *</label>
                  <input name="client" value={form.client} onChange={handleChange} required
                    placeholder="e.g. EECMY-DASSC"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} />
                </div>

                {/* Date */}
                <div>
                  <label className="text-xs font-semibold text-theme-light mb-1 block">Completion Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-theme-light mb-1 block">Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}>
                  <option value="">Select category...</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-theme-light mb-1 block">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                  placeholder="Describe what was done, the scope of work, and key outcomes..."
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} />
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--color-primary)" }}>
                  {saving ? "⏳ Saving..." : editId ? "✓ Update Project" : "+ Add Project"}
                </button>
                <button type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex justifay-between">
 <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-light">🔍</span>
            <input 
              value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(getVisibleCount());
              }}
              placeholder="Search by title or client..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none text-theme-light"
              style={{ background: "var(--color-card)", borderColor: "var(--color-border)",}}
              onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
              onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} 
            />
          </div>
       <select
  value={filterCat}
  onChange={(e) => {
    setFilterCat(e.target.value);
    setVisibleCount(getVisibleCount());
  }}
  className="px-3 py-2.5 rounded-xl border text-sm font-semibold outline-none flex-shrink-0 cursor-pointer text-theme-light"
  style={{ background: "var(--color-card)", borderColor: "var(--color-border)"}}
>
  <option value="All">📁 All Categories</option>
  {categories.map((c) => (
    <option key={c} value={c} className="text-theme-light">{categoryIcon(c)} {c}</option>
  ))}
</select>
</div>

        {/* Projects grid/list */}
        {loading ? (
          <div className={viewMode === "grid" ? "grid sm:grid-cols-2 gap-4" : "space-y-3"}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: "var(--color-border)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-theme rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <div className="font-bold text-primary mb-1">No projects found</div>
            <p className="text-theme-light text-sm mb-4">
              {projects.length === 0
                ? "Click '⚡ Seed from Profile' to add all 14 real projects at once."
                : "Try changing your search or filter."}
            </p>
            {projects.length === 0 && (
              <button onClick={handleSeedAll} disabled={seeding}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "var(--color-secondary)" }}>
                {seeding ? "Adding..." : "⚡ Seed All 14 Projects"}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={viewMode === "grid" 
              ? "grid sm:grid-cols-2 gap-4" 
              : "space-y-3"
            }>
              {visibleProjects.map((p) => {
                const color = categoryColor(p.category);
                const icon = categoryIcon(p.category);
                
                if (viewMode === "grid") {
                  return (
                    <div key={p.id}
  className="bg-card border border-theme rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
  onClick={() => setSelectedProject(p)}>
                    

                      {/* Top */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: color + "12" }}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-primary leading-snug line-clamp-2">{p.title}</h4>
                          <p className="text-xs font-semibold mt-0.5" style={{ color }}>{p.client}</p>
                        </div>
                      </div>

                      {/* Category + date */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                          style={{ background: color + "12", color }}>
                          {p.category || "Uncategorized"}
                        </span>
                        {p.date && (
                          <span className="text-[10px] text-theme-light">
                            📅 {new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-theme-light leading-relaxed line-clamp-3 flex-1 mb-3">
                        {p.description}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-theme mt-auto">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold border transition-all hover:opacity-90"
                          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                          ✏️ Edit
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} disabled={deleting === p.id}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-red-50"
                          style={{ borderColor: "#DC2626", color: "#DC2626" }}>
                          {deleting === p.id ? "⏳" : "🗑️"} Delete
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  // List View
                  return (
                    <div key={p.id}
className="bg-card border border-theme rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group flex items-center gap-4"
  onClick={() => setSelectedProject(p)}>
                      
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: color + "12" }}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-primary line-clamp-1">{p.title}</span>
                            <span className="text-xs font-semibold" style={{ color }}>{p.client}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: color + "12", color }}>
                              {p.category || "Uncategorized"}
                            </span>
                            {p.date && (
                              <span className="text-[10px] text-theme-light">
                                {new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                              </span>
                            )}
                            <p className="text-[10px] text-theme-light truncate line-clamp-1">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleEdit(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-primary/5"
                          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                          ✏️
                        </button>
                        <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-red-50"
                          style={{ borderColor: "#DC2626", color: "#DC2626" }}>
                          {deleting === p.id ? "⏳" : "🗑️"}
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
                  Showing {visibleProjects.length} of {filtered.length} projects
                </span>
              </div>
            )}
          </>
        )}
      </div>
{/* ── PROJECT DETAIL MODAL ── */}
{selectedProject && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    onClick={() => setSelectedProject(null)}>
    <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-theme animate-scale-in relative"
      onClick={(e) => e.stopPropagation()}>

      {/* Close button */}
      <button
        onClick={() => setSelectedProject(null)}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-theme-light transition-colors text-theme-light"
      >
        ✕
      </button>

      {/* Content */}
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
          style={{ background: categoryColor(selectedProject.category) + "15" }}>
          {categoryIcon(selectedProject.category)}
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-primary leading-snug">{selectedProject.title}</h2>
        <p className="text-sm font-semibold mt-1" style={{ color: categoryColor(selectedProject.category) }}>
          {selectedProject.client}
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: categoryColor(selectedProject.category) + "12", color: categoryColor(selectedProject.category) }}>
            {selectedProject.category || "Uncategorized"}
          </span>
          {selectedProject.date && (
            <span className="text-xs text-theme-light">
              📅 {new Date(selectedProject.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-theme">
        <h4 className="text-xs font-bold tracking-[2px] text-secondary mb-2 text-center">PROJECT DETAILS</h4>
        <p className="text-theme-light leading-relaxed text-sm text-center">{selectedProject.description}</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => { setSelectedProject(null); handleEdit(selectedProject); }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-90"
          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
        >
          ✏️ Edit Project
        </button>
        <button
          onClick={() => setSelectedProject(null)}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "var(--color-primary)" }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      <style>{`
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .line-clamp-3 { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }
        .line-clamp-1 { display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden; }
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
        .animate-slide-in { animation: slide-in 0.3s ease forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease forwards; }
      `}</style>
    </div>
  );
}