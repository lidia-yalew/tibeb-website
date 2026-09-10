import { useEffect, useState } from "react";
import Navbar from "../Componet/Navbar";
import axios from "axios";
import test from "../assets/Img/test.png"
import SEO from "../Componet/SEO";

const colors = ["#1A237E", "#C9A84C", "#1A237E", "#C9A84C", "#1A237E", "#C9A84C", "#1A237E", "#C9A84C"];

const initials = (name) => name?.split(" ").filter(w => w.length > 1).map(w => w[0]).slice(0, 2).join("") || "?";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    client_role: "",
    organization: "",
    quote: ""
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  
  // Pagination state
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Fetch ONLY published testimonials (status: approved, is_published: true)
    axios.get(`${API}/testimonials`)
      .then((res) => setTestimonials(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  const filtered = testimonials.filter((t) =>
    t.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.organization?.toLowerCase().includes(search.toLowerCase()) ||
    t.quote?.toLowerCase().includes(search.toLowerCase())
  );

  const visibleTestimonials = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => {
    const increment = isMobile ? 4 : 6;
    setVisibleCount(prev => Math.min(prev + increment, filtered.length));
  };

  const showLess = () => {
    setVisibleCount(isMobile ? 4 : 6);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Submit to the public endpoint - always saved as pending
      const response = await axios.post(`${API}/testimonials/submit`, formData);
      
      if (response.data.success) {
        setSubmitSuccess(true);
        setFormData({ client_name: "", client_role: "", organization: "", quote: "" });
        setTimeout(() => {
          setShowForm(false);
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-theme min-h-screen">
       <SEO 
        title="Client Testimonials"
        description="Read what our clients say about Tibeb Consultancy's services and impact on their organizations."
        keywords="testimonials, client feedback, reviews, success stories, Ethiopia"
        url="https://www.tibeb.com/testimonials"
      />
      {/* ── TESTIMONIALS HERO ── */}
      <section className="relative pt-[68px] md:pt-[100px] overflow-hidden min-h-[400px]">
        <div className="fixed inset-0 z-0">
          <img 
            src={test}
            alt="Client Testimonials"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #1A237E 0%, #C9A84C 100%)';
            }}
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 h-[calc(100vh-78px)] md:h-[calc(100vh-100px)] flex items-end justify-end max-w-7xl mx-auto px-4 sm:px-6 pb-8 md:pb-2">
          <div className="max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-2 leading-tight">
              What Our <span className="text-[#D4A373]">Clients Say</span>
            </h1>
            <p className="text-[#5D6D7E] text-sm leading-relaxed mb-4">
              Real feedback from organizations and partners we've worked with across Ethiopia.
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowForm(true)} className="px-12 mx-auto py-1.5 bg-primary text-white font-semibold rounded-full hover:bg-[#C4956A] transition-all duration-300 text-xl shadow-md animate-bounce ">
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative py-4 sm:py-6 px-4 sm:px-6 bg-theme-light border-b border-theme">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-card border border-theme rounded-xl p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-secondary">
                {testimonials.filter(t => t.client_name).length}
              </div>
              <div className="text-[8px] sm:text-[10px] text-theme-light">Clients</div>
            </div>
            <div className="bg-card border border-theme rounded-xl p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-secondary">
                {testimonials.length > 0 ? "4.9" : "0"}
              </div>
              <div className="text-[8px] sm:text-[10px] text-theme-light">⭐ Rating</div>
            </div>
            <div className="bg-card border border-theme rounded-xl p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-secondary">
                {testimonials.length}
              </div>
              <div className="text-[8px] sm:text-[10px] text-theme-light">Stories</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-theme-light text-sm sm:text-base">🔍</span>
              <input 
                value={search} 
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(isMobile ? 4 : 6);
                }}
                placeholder="Search by client, organization, or keyword..."
                className="w-full pl-8 sm:pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base outline-none bg-card text-theme border-theme focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS GRID ── */}
      <section className="relative py-6 sm:py-8 px-4 sm:px-6 bg-theme">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-48 sm:h-56 rounded-2xl animate-pulse bg-theme-light" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-theme rounded-2xl p-8 sm:p-12 text-center">
              <div className="text-4xl sm:text-5xl mb-3">💬</div>
              <div className="font-bold text-primary text-base sm:text-lg mb-1">No testimonials found</div>
              <p className="text-theme-light text-sm">Try changing your search or be the first to share your story!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {visibleTestimonials.map((t, i) => {
                  const color = colors[i % colors.length];
                  return (
                    <div 
                      key={t.id}
                      className="group bg-card border border-theme rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedTestimonial(t)}
                    >
                      <div className="text-3xl sm:text-5xl font-black leading-none mb-1 sm:mb-2" style={{ color, opacity: 0.15 }}>"</div>
                      <p className="text-xs sm:text-sm text-theme-light leading-relaxed line-clamp-4 mb-3 sm:mb-4">
                        {t.quote}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-theme">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold flex-shrink-0"
                          style={{ background: color }}>
                          {initials(t.client_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-primary truncate">{t.client_name}</div>
                          <div className="text-[8px] sm:text-[10px] text-theme-light truncate">
                            {t.client_role} · {t.organization}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="var(--color-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── SHOW MORE / SHOW LESS BUTTON ── */}
              {filtered.length > (isMobile ? 4 : 6) && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {hasMore && (
                    <button
                      onClick={loadMore}
                      className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-md"
                      style={{ background: "var(--color-primary)" }}
                    >
                      Show More ({filtered.length - visibleCount} remaining)
                    </button>
                  )}
                  
                  {visibleCount > (isMobile ? 4 : 6) && (
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

                  <span className="text-xs text-muted">
                    Showing {visibleTestimonials.length} of {filtered.length} testimonials
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── SUBMISSION FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => !submitting && setShowForm(false)}>
          <div className="bg-card rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 md:p-8 shadow-2xl border border-theme animate-scale-in mx-2 sm:mx-0 relative"
            onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => !submitting && setShowForm(false)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-theme-light transition-colors text-lg sm:text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">Share Your Story</h2>
            <p className="text-sm text-theme-light mb-5">Your testimonial will be reviewed before being published.</p>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-lg font-bold text-primary mb-2">Thank You!</h3>
                <p className="text-sm text-theme-light">Your testimonial has been submitted and is pending review.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-theme-light mb-1 block">Your Name *</label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Dr. Aster Tekle"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-card text-theme border-theme focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-theme-light mb-1 block">Your Role</label>
                  <input
                    type="text"
                    name="client_role"
                    value={formData.client_role}
                    onChange={handleChange}
                    placeholder="e.g. Program Director"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-card text-theme border-theme focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-theme-light mb-1 block">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. EECMY-DASSC"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-card text-theme border-theme focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-theme-light mb-1 block">Your Testimonial *</label>
                  <textarea
                    name="quote"
                    value={formData.quote}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Share your experience working with us..."
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none bg-card text-theme border-theme focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                  <div className="text-[10px] text-theme-light mt-1 text-right">{formData.quote.length} characters</div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--color-primary)" }}
                >
                  {submitting ? "⏳ Submitting..." : "💬 Submit Testimonial"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL ── */}
      {selectedTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedTestimonial(null)}>
          <div className="bg-card rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 md:p-8 shadow-2xl border border-theme animate-scale-in mx-2 sm:mx-0 relative"
            onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-theme-light transition-colors text-lg sm:text-xl"
            >
              ✕
            </button>

            <div className="text-4xl sm:text-6xl font-black mb-3 sm:mb-4" style={{ color: colors[testimonials.indexOf(selectedTestimonial) % colors.length], opacity: 0.15 }}>"</div>
            
            <p className="text-base sm:text-lg text-primary leading-relaxed mb-5 sm:mb-6 italic">
              {selectedTestimonial.quote}
            </p>

            <div className="flex items-center gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-theme">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-base sm:text-lg font-bold flex-shrink-0"
                style={{ background: colors[testimonials.indexOf(selectedTestimonial) % colors.length] }}>
                {initials(selectedTestimonial.client_name)}
              </div>
              <div>
                <div className="text-base sm:text-lg font-extrabold text-primary">{selectedTestimonial.client_name}</div>
                <div className="text-xs sm:text-sm text-theme-light">{selectedTestimonial.client_role}</div>
                <div className="text-xs sm:text-sm font-semibold" style={{ color: colors[testimonials.indexOf(selectedTestimonial) % colors.length] }}>
                  {selectedTestimonial.organization}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedTestimonial(null)}
              className="mt-5 sm:mt-6 px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all hover:opacity-90 w-full sm:w-auto"
              style={{ background: "var(--color-primary)" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease forwards; }
        .animate-scale-in { animation: scale-in 0.25s ease forwards; }
        
        input::placeholder, textarea::placeholder { color: var(--color-text-light); opacity: 0.6; }
        input:focus, textarea:focus { outline: none; }
      `}</style>
    </div>
  );
}