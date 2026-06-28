import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/portfolio";
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

const seedProjects = [
  {
    title: "Capacity Building Training — CARD",
    client: "Center for Advancement of Rights and Democracy (CARD)",
    description: "Designed and delivered training programs in Addis Ababa, Adama, and Dire Dawa covering project design, proposal development, resource mobilization, and project implementation.",
    date: "2024-06-01",
    category: "Capacity Building & Training",
  },
  {
    title: "Data Analytics & Digital Transformation Training — Diverse Tech",
    client: "Diverse Tech Solution PLC",
    description: "Designed and executed premium capacity-building programs covering data analytics, large-scale data processing, enterprise architecture, targeted sector strategies, and digital transformation.",
    date: "2025-12-01",
    category: "Capacity Building & Training",
  },
  {
    title: "National Technology Market Assessment & Business Survey",
    client: "Diverse Tech Solution PLC",
    description: "Conducted a national technology market assessment and business survey project providing strategic insights for technology sector positioning and growth.",
    date: "2025-12-01",
    category: "Data Analytics & Research",
  },
  {
    title: "Data Visualization & Business Performance Assessment",
    client: "Panacea Business and Engineering PLC",
    description: "Delivered data visualization, business performance assessment, trend analysis, and reporting project to support data-driven decision making.",
    date: "2024-12-01",
    category: "Data Analytics & Research",
  },
  {
    title: "Laboratory Sector Market Assessment & Marketing Strategy",
    client: "Oda Addi Trade PLC",
    description: "Conducted market assessment and marketing strategies research on diverse laboratory sectors across Ethiopia, providing actionable insights for market entry and growth.",
    date: "2025-02-01",
    category: "Data Analytics & Research",
  },
  {
    title: "Contract Staff Recruitment, Training & Deployment",
    client: "Tena Adam Gardens PLC",
    description: "Successfully recruited, trained, and deployed contract staff in Arada Sub City, Addis Ababa. Provided end-to-end workforce solutions including recruitment, screening, orientation, and deployment support.",
    date: "2026-12-01",
    category: "Human Resource & Recruitment",
  },
  {
    title: "SRA4C Project Terminal Evaluation",
    client: "EECMY-DASSC (Ethiopian Evangelical Church Mekane Yesus)",
    description: "Conducted the terminal evaluation of the Strengthening the Resilience and Adaptive Capacity of Communities to Climate Change (SRA4C) Project, producing evidence-based recommendations for future programming.",
    date: "2024-12-01",
    category: "Monitoring, Evaluation & Learning",
  },
  {
    title: "Organizational Manuals Development",
    client: "Nexsuses Trading and Consultancy Service",
    description: "Developed and delivered comprehensive organizational manuals including Organizational Bylaws, Human Resource Manual, Financial Administration Manual, Training Administration Manual, and Business Development Strategy.",
    date: "2024-05-01",
    category: "Institutional Development",
  },
  {
    title: "Organizational Model Diagnosis & Technology Integration",
    client: "DESHET Education and Training Service S.C.",
    description: "Delivered organizational development work covering organizational model diagnosis, change management strategy, and technology integration strategy development.",
    date: "2025-09-01",
    category: "Education & Digital Transformation",
  },
  {
    title: "Educational Systems & ICT Capacity Building",
    client: "Mahibere Kidusan Hawassa Center (MKHC)",
    description: "Recognized for contributions in educational systems building, ICT and digitalization, capacity building, and Leap Learning Applications (LLA) implementation.",
    date: "2025-01-01",
    category: "Education & Digital Transformation",
  },
  {
    title: "IBS 19th Biennial Conference Support",
    client: "International Biometrics Society (IBS) Ethiopian Region",
    description: "Received Certificate of Appreciation for outstanding support and contribution to the 19th Biennial Conference held in Addis Ababa, Ethiopia in September 2025.",
    date: "2025-09-01",
    category: "Conference & Event Support",
  },
  {
    title: "Professional Training — Multitasking, Data & Strategic Planning",
    client: "AfrInnovation Engineering and Business Solution PLC",
    description: "Delivered specialized training programs covering multitasking and productivity management, data and networking, and strategic planning preparation.",
    date: "2024-04-01",
    category: "Capacity Building & Training",
  },
  {
    title: "Project Design & Partnership Management Training",
    client: "Ethiolab Equipment Supply PLC",
    description: "Provided training programs covering project design and implementation, and partnership and stakeholder management.",
    date: "2024-12-01",
    category: "Capacity Building & Training",
  },
  {
    title: "Business Development & Strategy Preparation",
    client: "GATEM Trading PLC",
    description: "Delivered business development and strategy preparation services to strengthen organizational performance and market positioning.",
    date: "2026-11-01",
    category: "Institutional Development",
  },
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
          <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold"
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
          <div className="bg-card border-2 rounded-2xl p-6" style={{ borderColor: "var(--color-primary)" }}>
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
  max={new Date().toISOString().split("T")[0]}  // ← add this line
  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
  style={inputStyle}
  onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
  onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
/>
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

        {/* Category stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Training", cat: "Capacity Building & Training", icon: "🎓" },
            { label: "Research", cat: "Data Analytics & Research", icon: "📊" },
            { label: "MEL", cat: "Monitoring, Evaluation & Learning", icon: "📈" },
            { label: "Institutional", cat: "Institutional Development", icon: "🏛️" },
          ].map((s, i) => {
            const count = projects.filter((p) => p.category === s.cat).length;
            const color = categoryColor(s.cat);
            return (
              <div key={i} className="bg-card border border-theme rounded-xl p-3 text-center cursor-pointer hover:border-secondary transition-all"
                onClick={() => setFilterCat(filterCat === s.cat ? "All" : s.cat)}>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-xl font-extrabold" style={{ color }}>{count}</div>
                <div className="text-[10px] text-theme-light">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by title or client..."
            className="px-4 py-2 rounded-xl border text-sm outline-none flex-1 min-w-[200px]"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }} />
          <div className="flex flex-wrap gap-2">
            {["All", ...categories].map((c) => (
              <button key={c} onClick={() => setFilterCat(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap"
                style={{
                  background: filterCat === c ? "var(--color-primary)" : "var(--color-card)",
                  borderColor: filterCat === c ? "var(--color-primary)" : "var(--color-border)",
                  color: filterCat === c ? "#fff" : "var(--color-text)",
                }}>
                {c === "All" ? "All" : categoryIcon(c) + " " + c.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Projects list */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
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
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((p) => {
              const color = categoryColor(p.category);
              const icon = categoryIcon(p.category);
              return (
                <div key={p.id}
                  className="bg-card border border-theme rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col">

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
                    <button onClick={() => handleEdit(p)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold border transition-all hover:opacity-90"
                      style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-red-50"
                      style={{ borderColor: "#DC2626", color: "#DC2626" }}>
                      {deleting === p.id ? "⏳" : "🗑️"} Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .line-clamp-3 { display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden; }
        input::placeholder,textarea::placeholder { color:var(--color-text-light,#6B7280);opacity:0.6; }
        select option { background:var(--color-card);color:var(--color-text); }
      `}</style>
    </div>
  );
}
