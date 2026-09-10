import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function ManageTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [viewing, setViewing] = useState(null);

  const fetchAll = () => {
    const token = localStorage.getItem("token");
    axios.get(`${API}/admin/testimonials/admin`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        axios.get(`${API}/testimonials`).then(r => setItems(Array.isArray(r.data) ? r.data : []));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleToggle = async (id, status, isPublished) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`${API}/admin/testimonials/${id}/publish`, { status, is_published: isPublished }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/admin/testimonials/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch (err) {
      alert("Failed to delete testimonial.");
    }
  };

  const filteredItems = items.filter(t => {
    const matchesStatus = statusFilter === "All" ||
      (statusFilter === "Published" && t.is_published) ||
      (statusFilter === "Unpublished" && !t.is_published);
    
    const matchesSearch = !search.trim() ||
      (t.client_name && t.client_name.toLowerCase().includes(search.toLowerCase())) ||
      (t.organization && t.organization.toLowerCase().includes(search.toLowerCase())) ||
      (t.client_role && t.client_role.toLowerCase().includes(search.toLowerCase())) ||
      (t.quote && t.quote.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Manage Client Testimonials</h1>
          <p className="text-xs text-theme-light mt-1">Review, approve, filter, and search client feedback ({items.length} Total).</p>
        </div>
      </div>

      {/* Controls: Search & Category/Status Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by client name, organization, role, or quote..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none bg-card text-primary shadow-sm focus:border-primary"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
        </div>

        <div className="flex items-center gap-2">
          {["All", "Published", "Unpublished"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-card text-theme-light border hover:border-primary'
              }`}
            >
              {status} {status === "Published" ? `(${items.filter(i => i.is_published).length})` : status === "Unpublished" ? `(${items.filter(i => !i.is_published).length})` : `(${items.length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-theme-light">Loading testimonials...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-2xl text-xs text-theme-light">No client testimonials found matching filter.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.slice(0, visibleCount).map(t => (
            <div key={t.id} onClick={() => setViewing(t)} className="bg-card border border-theme rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-300 transform cursor-pointer">
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-sm text-primary leading-tight">{t.client_name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${t.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t.is_published ? 'PUBLISHED' : 'UNPUBLISHED'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-secondary">{t.client_role} - {t.organization}</p>
                <p className="text-xs text-theme-light mt-3 italic leading-relaxed">"{t.quote}"</p>
              </div>

              <div className="mt-4 pt-3 border-t border-theme flex justify-end gap-3 text-xs font-bold" onClick={e => e.stopPropagation()}>
                <button onClick={() => handleToggle(t.id, t.is_published ? 'pending' : 'approved', !t.is_published)} className="text-blue-600 hover:underline">
                  {t.is_published ? 'Unpublish' : 'Approve & Publish'}
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredItems.length > 6 && (
        <div className="flex justify-center mt-8">
          {visibleCount < filteredItems.length ? (
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
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl flex-shrink-0 bg-primary/10 text-primary mb-3 border-4 border-primary/20">
                💬
              </div>
              <h2 className="text-xl font-extrabold text-primary">{viewing.client_name}</h2>
              <p className="text-xs font-semibold text-secondary">{viewing.client_role} - {viewing.organization}</p>
            </div>
            <p className="text-xs text-theme-light text-center mt-4 border-t pt-4 italic">"{viewing.quote}"</p>
            <button onClick={() => setViewing(null)} className="w-full mt-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
