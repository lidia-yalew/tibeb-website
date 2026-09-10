import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const categories = [
  "All",
  "Capacity Development and Training",
  "Data Analysis and Digital Transformation",
  "Monitoring, Evaluation and Research",
  "Institutional Development",
  "Human Resource Management",
  "Business Development and Strategy",
  "Education and Digital Transformation",
  "Event Management",
  "Professional Training Services",
  "General"
];

export default function ManagePortfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ title: "", client: "", category: "Capacity Development and Training", description: "", date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const fetchProjects = () => {
    axios.get(`${API}/portfolio`)
      .then(res => setProjects(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      title: form.title,
      client: form.client,
      category: form.category,
      description: form.description,
      date: form.date || new Date().toISOString().split('T')[0]
    };

    try {
      if (editing) {
        await axios.put(`${API}/admin/portfolio/${editing.id}`, payload, { headers });
      } else {
        await axios.post(`${API}/admin/portfolio`, payload, { headers });
      }
      setModal(false);
      setEditing(null);
      setForm({ title: "", client: "", category: "Capacity Development and Training", description: "", date: "" });
      fetchProjects();
    } catch (err) {
      alert("Failed to save portfolio project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/admin/portfolio/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProjects();
    } catch (err) {
      alert("Failed to delete project.");
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesCat = selectedCat === "All" || (p.category && p.category.toLowerCase() === selectedCat.toLowerCase());
    const matchesSearch = !search.trim() ||
      (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
      (p.client && p.client.toLowerCase().includes(search.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Manage Portfolio Projects</h1>
          <p className="text-xs text-theme-light mt-1">Add, search, or edit projects completed by Tibeb Consultancy ({projects.length} Total).</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ title: "", client: "", category: "Capacity Development and Training", description: "", date: "" }); setModal(true); }}
          className="bg-primary text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
        >
          + Add Project
        </button>
      </div>

      {/* Controls: Search & Category Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by title, client, category, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none bg-card text-primary shadow-sm focus:border-primary"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-card text-theme-light border hover:border-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-theme-light">Loading portfolio projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-2xl text-xs text-theme-light">No portfolio projects found matching search.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.slice(0, visibleCount).map(p => (
            <div key={p.id} onClick={() => setViewing(p)} className="bg-card border border-theme rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-300 transform cursor-pointer">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{p.category}</span>
                <h3 className="font-bold text-base text-primary mt-1">{p.title}</h3>
                <p className="text-xs font-semibold text-theme-light mt-0.5">Client: {p.client}</p>
                <p className="text-xs text-theme-light mt-2 line-clamp-3 leading-relaxed">{p.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-theme flex justify-end gap-3 text-xs font-bold" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setEditing(p); setForm(p); setModal(true); }} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProjects.length > 6 && (
        <div className="flex justify-center mt-8">
          {visibleCount < filteredProjects.length ? (
            <button onClick={() => setVisibleCount(prev => prev + 6)} className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-full shadow-md hover:bg-primary/90 transition-all transform hover:scale-105">
              Load More
            </button>
          ) : (
            <button onClick={() => setVisibleCount(6)} className="px-6 py-2.5 bg-card border border-theme text-primary text-xs font-bold rounded-full shadow-sm hover:bg-gray-50 transition-all transform hover:scale-105">
              Show Less
            </button>
          )}
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setViewing(null)}>
          <div className="bg-card rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-theme relative"
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">✕</button>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-blue-50 text-blue-600 mb-3 border-2 border-blue-100">
                📁
              </div>
              <h2 className="text-xl font-extrabold text-primary">{viewing.title}</h2>
              <p className="text-xs font-semibold text-secondary">Client: {viewing.client}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase tracking-wider">
                {viewing.category}
              </span>
            </div>
            <p className="text-xs text-theme-light text-center mt-4 border-t pt-4">{viewing.description}</p>
            <button onClick={() => setViewing(null)} className="w-full mt-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-card rounded-2xl p-6 max-w-lg w-full space-y-4 border shadow-2xl relative">
            <button type="button" onClick={() => setModal(false)} className="absolute top-4 right-4 text-xs font-bold text-gray-400 hover:text-gray-700">✕</button>
            <h3 className="font-bold text-lg text-primary">{editing ? "Edit Project" : "Add Project"}</h3>
            <input placeholder="Project Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full p-2.5 text-xs border rounded-xl" />
            <input placeholder="Client Organization" value={form.client} onChange={e => setForm({...form, client: e.target.value})} required className="w-full p-2.5 text-xs border rounded-xl" />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-2.5 text-xs border rounded-xl">
              {categories.filter(c => c !== "All").map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required className="w-full p-2.5 text-xs border rounded-xl h-24" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-xs font-bold border rounded-xl">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl">Save Project</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
