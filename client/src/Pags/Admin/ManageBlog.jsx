import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function ManageBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [form, setForm] = useState({ 
    title: "", 
    category: "news", 
    excerpt: "", 
    content: "", 
    author_name: "Tibeb Team", 
    source: "Tibeb Consultancy",
    is_published: true 
  });
  
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [viewing, setViewing] = useState(null);

  const fetchBlogs = () => {
    const token = localStorage.getItem("token");
    axios.get(`${API}/admin/blog-news`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : (raw?.data || []);
        setBlogs(list);
      })
      .catch(() => {
        axios.get(`${API}/blog-news`).then(r => setBlogs(Array.isArray(r.data) ? r.data : (r.data?.data || [])));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setGalleryFiles(files);
    
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setGalleryPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const openAddModal = () => {
    setEditing(null);
    setForm({ title: "", category: "news", excerpt: "", content: "", author_name: "Tibeb Team", source: "Tibeb Consultancy", is_published: true });
    setCoverFile(null);
    setCoverPreview("");
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setModal(true);
  };

  const openEditModal = (item) => {
    const b = item.post || item;
    setEditing(b);
    setForm({
      title: b.title || "",
      category: (b.category || "news").toLowerCase(),
      excerpt: b.excerpt || "",
      content: b.content || "",
      author_name: b.author_name || "Tibeb Team",
      source: b.source || "Tibeb Consultancy",
      is_published: b.is_published !== false
    });
    
    // Find cover image if returned in item.images
    const images = item.images || [];
    const coverObj = images.find(img => img.is_cover) || images[0];
    setCoverPreview(coverObj ? coverObj.url : "");
    setCoverFile(null);
    
    const galleryObjs = images.filter(img => !img.is_cover);
    setGalleryPreviews(galleryObjs.map(g => g.url));
    setGalleryFiles([]);
    
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append("category", (form.category || "news").toLowerCase());
    formData.append("title", form.title);
    formData.append("excerpt", form.excerpt);
    formData.append("content", form.content);
    formData.append("author_name", form.author_name);
    formData.append("source", form.source);
    formData.append("is_published", form.is_published);

    if (coverFile) {
      formData.append("cover", coverFile);
    }

    if (galleryFiles.length > 0) {
      galleryFiles.forEach(file => {
        formData.append("gallery", file);
      });
    }

    try {
      if (editing) {
        await axios.put(`${API}/admin/blog-news/${editing.id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${API}/admin/blog-news`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setModal(false);
      fetchBlogs();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save article. Please check all fields.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/admin/blog-news/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchBlogs();
    } catch (err) {
      alert("Failed to delete article.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary">Manage Blog & News</h1>
          <p className="text-xs text-theme-light mt-1">Publish articles with cover photo & up to 3+ gallery photos.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
        >
          + Add Article
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-theme-light">Loading articles...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-2xl text-xs text-theme-light">No blog articles published yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(0, visibleCount).map((item) => {
            const b = item.post || item;
            const images = item.images || [];
            const coverImg = images.find(img => img.is_cover)?.url || images[0]?.url || b.cover_url || "";

            return (
              <div key={b.id} onClick={() => setViewing({ ...b, coverImg, images })} className="bg-card border border-theme rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all duration-300 transform cursor-pointer">
                {coverImg ? (
                  <div className="h-40 w-full overflow-hidden bg-gray-100">
                    <img src={coverImg} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-28 w-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-400">
                    No Cover Image
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{b.category || "news"}</span>
                      {images.length > 1 && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                          +{images.length - 1} Gallery Photos
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-primary mt-1.5 leading-snug line-clamp-2">{b.title}</h3>
                    <p className="text-xs text-theme-light mt-2 line-clamp-3">{b.excerpt || b.content}</p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-theme flex justify-between items-center text-xs" onClick={e => e.stopPropagation()}>
                    <span className="text-[10px] text-theme-light">{b.created_at ? new Date(b.created_at).toLocaleDateString() : 'Draft'}</span>
                    <div className="flex gap-3 font-bold">
                      <button onClick={() => openEditModal(item)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {blogs.length > 6 && (
        <div className="flex justify-center mt-8">
          {visibleCount < blogs.length ? (
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
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-theme relative flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setViewing(null)} className="absolute top-4 right-4 text-white hover:text-gray-200 bg-black/40 w-8 h-8 rounded-full flex items-center justify-center z-10 backdrop-blur-md">✕</button>
            {viewing.coverImg ? (
              <img src={viewing.coverImg} alt={viewing.title} className="w-full h-64 object-cover bg-gray-100 flex-shrink-0" />
            ) : (
              <div className="w-full h-40 bg-primary/10 flex items-center justify-center text-primary text-4xl flex-shrink-0">📰</div>
            )}
            <div className="p-6">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider mb-3">
                {viewing.category}
              </span>
              <h2 className="text-2xl font-extrabold text-primary leading-tight">{viewing.title}</h2>
              <p className="text-xs font-semibold text-secondary mt-1 mb-6">Author: {viewing.author_name}</p>
              
              <div className="text-sm text-theme-light leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: viewing.content || viewing.excerpt }} />

              {viewing.images && viewing.images.filter(img => img.url !== viewing.coverImg).length > 0 && (
                <div className="mt-8 border-t border-theme pt-6">
                  <h3 className="text-xs font-bold text-secondary mb-4 uppercase tracking-wider">Gallery Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {viewing.images.filter(img => img.url !== viewing.coverImg).map((img, idx) => (
                      <img key={idx} src={img.url ? img.url.trim() : ''} alt={`Gallery ${idx}`} className="w-full h-32 object-cover rounded-xl border border-theme shadow-sm hover:scale-105 transition-transform cursor-pointer" onClick={() => window.open(img.url, '_blank')} />
                    ))}
                  </div>
                </div>
              )}
              
              <button onClick={() => setViewing(null)} className="w-full mt-8 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pt-26 z-50 overflow-y-auto">
          <form onSubmit={handleSave} className="bg-card rounded-2xl p-6 max-w-xl w-full space-y-4 border shadow-2xl my-8">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-lg text-primary">{editing ? "Edit Article" : "Add Article"}</h3>
              <button type="button" onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-theme-light mb-1">Article Title *</label>
              <input 
                placeholder="Title" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                required 
                className="w-full p-2.5 text-xs border rounded-xl" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-theme-light mb-1">Category *</label>
                <select 
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})} 
                  className="w-full p-2.5 text-xs border rounded-xl"
                >
                  <option value="news">News</option>
                  <option value="blog">Blog / Research</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-theme-light mb-1">Author Name</label>
                <input 
                  placeholder="Author Name" 
                  value={form.author_name} 
                  onChange={e => setForm({...form, author_name: e.target.value})} 
                  className="w-full p-2.5 text-xs border rounded-xl" 
                />
              </div>
            </div>

            {/* COVER IMAGE FILE INPUT */}
            <div>
              <label className="block text-[11px] font-bold text-theme-light mb-1">Cover Image (Main Photo)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleCoverSelect} 
                className="w-full text-xs p-2 border rounded-xl" 
              />
              {coverPreview && (
                <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border">
                  <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Cover</span>
                </div>
              )}
            </div>

            {/* GALLERY IMAGES FILE INPUT (MULTIPLE 3+ IMAGES) */}
            <div>
              <label className="block text-[11px] font-bold text-theme-light mb-1">Gallery Images (Select 3+ Images)</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleGallerySelect} 
                className="w-full text-xs p-2 border rounded-xl" 
              />
              {galleryPreviews.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                  {galleryPreviews.map((src, idx) => (
                    <div key={idx} className="w-20 h-16 rounded-lg overflow-hidden border flex-shrink-0 relative">
                      <img src={src} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 font-bold">#{idx+1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-theme-light mb-1">Short Excerpt</label>
              <input 
                placeholder="Brief summary..." 
                value={form.excerpt} 
                onChange={e => setForm({...form, excerpt: e.target.value})} 
                className="w-full p-2.5 text-xs border rounded-xl" 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-theme-light mb-1">Content Body *</label>
              <textarea 
                placeholder="Full article content..." 
                value={form.content} 
                onChange={e => setForm({...form, content: e.target.value})} 
                required 
                className="w-full p-2.5 text-xs border rounded-xl h-32" 
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button 
                type="button" 
                onClick={() => setModal(false)} 
                className="px-4 py-2 text-xs font-bold border rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting} 
                className="px-5 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:opacity-90 transition-all shadow-md"
              >
                {submitting ? "Publishing..." : "Publish Article"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
