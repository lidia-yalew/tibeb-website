import { useEffect, useState } from "react";
import axios from "axios";
import { uploadImageApi } from "../../services/api";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const departments = [
  "All",
  "Executive Team",
  "Project Management & Research",
  "Data Intelligence, Research & Statistical Services",
  "Training & Capacity Building",
  "Finance & Human Resource"
];

export default function ManageTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", department: "Project Management & Research", bio: "", photo_url: "", cloudinary_public_id: "" });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const fetchMembers = () => {
    axios.get(`${API}/team`)
      .then(res => setMembers(Array.isArray(res.data) ? res.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. INSTANT local preview (0.01s - No lag!)
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, photo_url: reader.result }));
      setUploading(false);
    };
    reader.readAsDataURL(file);

    // 2. Background Cloudinary upload (Non-blocking)
    uploadImageApi(file, 'team', editing?.id || '')
      .then(res => {
        const imageUrl = res.url || res.data?.url;
        if (imageUrl) {
          setForm(prev => ({
            ...prev,
            photo_url: imageUrl,
            cloudinary_public_id: res.cloudinary_public_id || ''
          }));
        }
      })
      .catch(err => {
        console.log("Cloudinary background upload skipped, using instant Base64 preview.");
      });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      name: form.name,
      role: form.role,
      department: form.department,
      bio: form.bio,
      photo_url: form.photo_url,
      cloudinary_public_id: form.cloudinary_public_id
    };

    try {
      if (editing) {
        await axios.put(`${API}/admin/team/${editing.id}`, payload, { headers });
      } else {
        await axios.post(`${API}/admin/team`, payload, { headers });
      }
      setModal(false);
      setEditing(null);
      setForm({ name: "", role: "", department: "Project Management & Research", bio: "", photo_url: "", cloudinary_public_id: "" });
      fetchMembers();
    } catch (err) {
      alert("Failed to save team member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/admin/team/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchMembers();
    } catch (err) {
      alert("Failed to delete team member.");
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesDept = selectedDept === "All" || (m.department && m.department.toLowerCase() === selectedDept.toLowerCase());
    const matchesSearch = !search.trim() ||
      (m.name && m.name.toLowerCase().includes(search.toLowerCase())) ||
      (m.role && m.role.toLowerCase().includes(search.toLowerCase())) ||
      (m.department && m.department.toLowerCase().includes(search.toLowerCase())) ||
      (m.bio && m.bio.toLowerCase().includes(search.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Manage Team Members</h1>
          <p className="text-xs text-theme-light mt-1">Add, search, edit photos, or remove team members ({members.length} Total).</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: "", role: "", department: "Project Management & Research", bio: "", photo_url: "", cloudinary_public_id: "" }); setModal(true); }}
          className="bg-primary text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
        >
          + Add Member
        </button>
      </div>

      {/* Controls: Search & Department Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name, role, department, or bio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none bg-card text-primary shadow-sm focus:border-primary"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDept === dept
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-card text-theme-light border hover:border-primary'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-theme-light">Loading team members...</div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-2xl text-xs text-theme-light">No team members found matching your search.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.slice(0, visibleCount).map(m => (
            <div key={m.id} onClick={() => setViewing(m)} className="bg-card border border-theme rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-300 transform cursor-pointer">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-12 h-12 rounded-full object-cover border-2 border-secondary shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center border-2 border-secondary">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-primary leading-tight">{m.name}</h3>
                    <p className="text-[11px] font-semibold text-secondary">{m.role}</p>
                  </div>
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 tracking-wider mb-2">
                  {m.department}
                </span>
                <p className="text-xs text-theme-light leading-relaxed line-clamp-3">{m.bio}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-theme flex justify-end gap-3 text-xs font-bold" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setEditing(m); setForm(m); setModal(true); }} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredMembers.length > 6 && (
        <div className="flex justify-center mt-8">
          {visibleCount < filteredMembers.length ? (
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
              {viewing.photo_url ? (
                <img src={viewing.photo_url} alt={viewing.name} className="w-24 h-24 rounded-full object-cover border-4 border-secondary/20 mb-3" />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-primary bg-primary/10 font-bold text-2xl mb-3 border-4 border-secondary/20">
                  {viewing.name.charAt(0)}
                </div>
              )}
              <h2 className="text-xl font-extrabold text-primary">{viewing.name}</h2>
              <p className="text-xs font-semibold text-secondary">{viewing.role}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                {viewing.department}
              </span>
            </div>
            {viewing.bio && (
              <p className="text-xs text-theme-light text-center mt-4 border-t pt-4 line-clamp-4">{viewing.bio}</p>
            )}
            <button onClick={() => setViewing(null)} className="w-full mt-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all">
              Close
            </button>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-card rounded-2xl p-6 max-w-lg w-full space-y-4 border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setModal(false)} className="absolute top-4 right-4 text-xs font-bold text-gray-400 hover:text-gray-700">✕</button>
            <h3 className="font-bold text-lg text-primary">{editing ? "Edit Team Member" : "Add Team Member"}</h3>

            <div>
              <label className="text-[11px] font-bold text-theme-light uppercase">Profile Photo</label>
              <div className="flex items-center gap-4 mt-1.5">
                {form.photo_url ? (
                  <img src={form.photo_url} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-secondary" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border-2 border-secondary">Photo</div>
                )}
                <div className="flex-1 space-y-2">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="text-xs text-theme-light" />
                  {uploading && <span className="text-[10px] text-blue-600 font-bold">Uploading photo to Cloudinary...</span>}
                  <input placeholder="Or paste Photo URL (data:image or https://)" value={form.photo_url} onChange={e => setForm({...form, photo_url: e.target.value})} className="w-full p-2 text-xs border rounded-lg" />
                </div>
              </div>
            </div>

            <input placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full p-2.5 text-xs border rounded-xl" />
            <input placeholder="Role / Title" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required className="w-full p-2.5 text-xs border rounded-xl" />
            
            <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full p-2.5 text-xs border rounded-xl">
              <option value="Executive Team">Executive Team</option>
              <option value="Project Management & Research">Project Management & Research</option>
              <option value="Data Intelligence, Research & Statistical Services">Data Intelligence & Research</option>
              <option value="Training & Capacity Building">Training & Capacity Building</option>
              <option value="Finance & Human Resource">Finance & Human Resource</option>
            </select>

            <textarea placeholder="Bio" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full p-2.5 text-xs border rounded-xl h-24" />

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-xs font-bold border rounded-xl">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl">Save Member</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
