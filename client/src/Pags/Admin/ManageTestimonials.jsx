import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/testimonials";
const token = () => localStorage.getItem("token");
const headers = () => ({ Authorization: `Bearer ${token()}` });

const seedTestimonials = [
  {
    client_name: "International Biometrics Society (IBS)",
    client_role: "Conference Organizer",
    organization: "IBS Ethiopian Region",
    quote: "Tibeb Consultancy received a Certificate of Appreciation for its outstanding support and contribution to the 19th Biennial Conference held in Addis Ababa, Ethiopia, in September 2025. Their professionalism and dedication were exceptional.",
  },
  {
    client_name: "Mahibere Kidusan Hawassa Center",
    client_role: "Leadership",
    organization: "MKHC",
    quote: "Recognized Tibeb for their remarkable expertise in educational systems building, ICT and digitalization, capacity building, and Leap Learning Applications. Their contribution has transformed our educational operations.",
  },
  {
    client_name: "EECMY-DASSC",
    client_role: "Program Director",
    organization: "Ethiopian Evangelical Church Mekane Yesus Development and Social Services Commission",
    quote: "Tibeb conducted a rigorous and professional terminal evaluation of our SRA4C climate change resilience project. Their evidence-based recommendations have been invaluable for our future programming decisions.",
  },
  {
    client_name: "Diverse Tech Solution PLC",
    client_role: "Managing Director",
    organization: "Diverse Tech Solution PLC",
    quote: "Tibeb delivered outstanding capacity building programs in data analytics and digital transformation. Their tailored training models and toolkits exceeded our expectations and directly impacted our team's performance.",
  },
  {
    client_name: "Nexsuses Trading and Consultancy",
    client_role: "General Manager",
    organization: "Nexsuses Trading and Consultancy Service",
    quote: "The organizational manuals developed by Tibeb — including our bylaws, HR manual, financial administration manual, and training manual — have become the backbone of our operations. Truly professional work.",
  },
  {
    client_name: "CARD",
    client_role: "Program Manager",
    organization: "Center for Advancement of Rights and Democracy",
    quote: "Tibeb designed and delivered exceptional training programs for our staff in Addis Ababa, Adama, and Dire Dawa. The training on project design, proposal development, and resource mobilization was practical and highly impactful.",
  },
  {
    client_name: "DESHET Education & Training",
    client_role: "Executive Director",
    organization: "DESHET Education and Training Service S.C.",
    quote: "Tibeb's organizational model diagnosis and technology integration strategy transformed how we operate. Their expertise in change management and digital transformation is unmatched in Ethiopia.",
  },
  {
    client_name: "Panacea Business & Engineering PLC",
    client_role: "Operations Director",
    organization: "Panacea Business and Engineering PLC",
    quote: "The data visualization and business performance assessment delivered by Tibeb gave us clear, actionable insights. Their ability to translate complex data into strategic decisions is remarkable.",
  },
];

const emptyForm = { client_name: "", client_role: "", organization: "", quote: "" };

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(API);
      setTestimonials(res.data);
    } catch { showToast("Failed to load testimonials", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form, { headers: headers() });
        showToast("Testimonial updated!");
      } else {
        await axios.post(API, form, { headers: headers() });
        showToast("Testimonial added!");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchTestimonials();
    } catch { showToast("Something went wrong", "error"); }
    finally { setSaving(false); }
  };

  const handleEdit = (t) => {
    setForm({ client_name: t.client_name, client_role: t.client_role, organization: t.organization, quote: t.quote });
    setEditId(t.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/${id}`, { headers: headers() });
      showToast("Testimonial deleted");
      fetchTestimonials();
    } catch { showToast("Delete failed", "error"); }
    finally { setDeleting(null); }
  };

  const handleSeedAll = async () => {
    if (!window.confirm(`Add all ${seedTestimonials.length} testimonials from the company profile?`)) return;
    setSeeding(true);
    try {
      for (const t of seedTestimonials) {
        await axios.post(API, t, { headers: headers() });
      }
      showToast(`${seedTestimonials.length} testimonials added!`);
      fetchTestimonials();
    } catch { showToast("Seed failed", "error"); }
    finally { setSeeding(false); }
  };

  const filtered = testimonials.filter((t) =>
    t.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.organization?.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) => name?.split(" ").filter(w => w.length > 1).map(w => w[0]).slice(0, 2).join("") || "?";
  const colors = ["#1A237E", "#C9A84C", "#1A237E", "#C9A84C", "#1A237E", "#C9A84C", "#1A237E", "#C9A84C"];

  const inputStyle = {
    background: "var(--color-bg)",
    borderColor: "var(--color-border)",
    color: "var(--color-text)",
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold flex items-center gap-2 animate-slide-in"
            style={{ background: toast.type === "error" ? "#DC2626" : "#0F6E56" }}>
            {toast.type === "error" ? "❌" : "✅"} {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">Manage Testimonials</h2>
            <p className="text-sm text-theme-light mt-1">{testimonials.length} testimonials from real clients</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {testimonials.length === 0 && (
              <button onClick={handleSeedAll} disabled={seeding}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:opacity-80 disabled:opacity-60"
                style={{ borderColor: "var(--color-secondary)", color: "var(--color-secondary)" }}>
                {seeding ? "⏳ Adding..." : "⚡ Seed"}
              </button>
            )}
            <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "var(--color-primary)" }}>
              {showForm ? "✕ Cancel" : "+ Add Testimonials"}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card border-2 rounded-2xl p-4 sm:p-6 animate-fade-in" style={{ borderColor: "var(--color-primary)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
                style={{ background: "var(--color-primary)" }}>
                {editId ? "✏️" : "💬"}
              </div>
              <div>
                <h3 className="font-extrabold text-primary text-base sm:text-lg">{editId ? "Edit Testimonial" : "Add New"}</h3>
                <p className="text-xs text-theme-light">Client feedback shown on the public website</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-theme-light mb-1 block">Client Name *</label>
                  <input name="client_name" value={form.client_name} onChange={handleChange} required
                    placeholder="e.g. IBS Ethiopian Region"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,35,126,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-light mb-1 block">Client Role *</label>
                  <input name="client_role" value={form.client_role} onChange={handleChange} required
                    placeholder="e.g. Program Director"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,35,126,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; }} />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light mb-1 block">Organization *</label>
                <input name="organization" value={form.organization} onChange={handleChange} required
                  placeholder="e.g. EECMY-DASSC"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,35,126,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; }} />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light mb-1 block">Quote *</label>
                <textarea name="quote" value={form.quote} onChange={handleChange} required rows={4}
                  placeholder="What did the client say about Tibeb's work..."
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none focus:ring-2"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,35,126,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; }} />
                <div className="text-[10px] text-theme-light mt-1">{form.quote.length} characters</div>
              </div>

              {/* Live preview */}
              {(form.client_name || form.quote) && (
                <div className="rounded-2xl p-4 sm:p-5 border" style={{ background: "var(--color-primary)08", borderColor: "var(--color-primary)25" }}>
                  <div className="text-[10px] font-bold tracking-[2px] text-secondary mb-3">LIVE PREVIEW</div>
                  <div className="text-2xl text-secondary mb-2">"</div>
                  <p className="text-sm text-theme-light italic leading-relaxed mb-3">{form.quote || "Your quote will appear here..."}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: "var(--color-primary)" }}>
                      {initials(form.client_name)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary">{form.client_name || "Client Name"}</div>
                      <div className="text-[10px] text-theme-light">{form.client_role || "Role"} · {form.organization || "Organization"}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--color-primary)" }}>
                  {saving ? "⏳ Saving..." : editId ? "✓ Update" : "+ Add"}
                </button>
                <button type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-theme-light"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by client name or organization..."
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 pl-10"
            style={{ background: "var(--color-card)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(26,35,126,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; }} />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-light">🔍</span>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-card border border-theme rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold text-primary">{testimonials.length}</div>
            <div className="text-[10px] ">Total</div>
          </div>
          <div className="bg-card border border-theme rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold">{testimonials.filter(t => t.client_name).length}</div>
            <div className="text-[10px]">Clients</div>
          </div>
          <div className="bg-card border border-theme rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold text-primary">{new Set(testimonials.map(t => t.organization)).size}</div>
            <div className="text-[10px]">Orgs</div>
          </div>
          <div className="bg-card border border-theme rounded-xl p-3 text-center">
            <div className="text-2xl font-extrabold text-secondary">{testimonials.length > 0 ? "4.9" : "0"}</div>
            <div className="text-[10px] text-theme-light">⭐ Rating</div>
          </div>
        </div>

        {/* Testimonials grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: "var(--color-border)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-theme rounded-2xl p-8 sm:p-12 text-center">
            <div className="text-5xl mb-3">💬</div>
            <div className="font-bold text-primary text-lg mb-1">No testimonials yet</div>
            <p className="text-theme-light text-sm mb-4">
              {testimonials.length === 0
                ? "Click '⚡ Seed' to add 8 real client testimonials at once."
                : "Try changing your search."}
            </p>
            {testimonials.length === 0 && (
              <button onClick={handleSeedAll} disabled={seeding}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: "var(--color-secondary)" }}>
                {seeding ? "Adding..." : "⚡ Seed 8 Testimonials"}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((t, i) => {
              const color = colors[i % colors.length];
              return (
                <div key={t.id}
                  className="bg-card border border-theme rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">

                  {/* Quote mark */}
                  <div className="text-4xl font-black mb-2 leading-none" style={{ color, opacity: 0.15 }}>"</div>

                  {/* Quote */}
                  <p className="text-sm text-theme-light italic leading-relaxed flex-1 mb-4 line-clamp-4">
                    {t.quote}
                  </p>

                  {/* Client info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: color }}>
                      {initials(t.client_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-primary truncate">{t.client_name}</div>
                      <div className="text-[10px] text-theme-light truncate">
                        {t.client_role} · {t.organization}
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  </div>

                  {/* Date */}
                  <div className="text-[10px] text-theme-light mb-3">
                    {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-theme mt-auto">
                    <button onClick={() => handleEdit(t)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-primary/5"
                      style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold border transition-all hover:bg-red-50"
                      style={{ borderColor: "#DC2626", color: "#DC2626" }}>
                      {deleting === t.id ? "⏳" : "🗑️"} Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-4 { display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden; }
        input::placeholder,textarea::placeholder { color:var(--color-text-light,#6B7280);opacity:0.6; }
        
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