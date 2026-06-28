import { useEffect, useState } from "react";
import Navbar from "../Componet/Navbar";
import axios from "axios";

const colors = ["#1A237E", "#C9A84C", "#1A237E", "#C9A84C", "#1A237E", "#C9A84C", "#1A237E", "#C9A84C"];

const initials = (name) => name?.split(" ").filter(w => w.length > 1).map(w => w[0]).slice(0, 2).join("") || "?";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/testimonials")
      .then((res) => setTestimonials(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = testimonials.filter((t) =>
    t.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.organization?.toLowerCase().includes(search.toLowerCase()) ||
    t.quote?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-theme min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-[78px] md:pt-[100px] overflow-hidden">
        <div className="relative py-12 md:py-20 lg:py-24 px-4 sm:px-6 ">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full opacity-20 animate-pulse"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-[250px] sm:w-[350px] md:w-[400px] h-[250px] sm:h-[350px] md:h-[400px] rounded-full opacity-10 animate-pulse"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6">
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[2px] text-secondary">TESTIMONIALS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary mb-3 sm:mb-4">
              What Our <span className="text-secondary">Clients Say</span>
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              Real feedback from organizations and partners we've worked with across Ethiopia.
            </p>
          </div>
        </div>

        <div className="relative -mt-1">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-[30px] sm:h-[40px]" preserveAspectRatio="none">
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30 L1440 60 L0 60Z" fill="var(--color-bg)" />
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30" stroke="var(--color-secondary)" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-4 sm:py-6 px-4 sm:px-6 bg-theme-light border-b border-theme">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-card border border-theme rounded-xl p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-primary">{testimonials.length}</div>
              <div className="text-[8px] sm:text-[10px] text-theme-light">Total</div>
            </div>
            <div className="bg-card border border-theme rounded-xl p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-secondary">
                {testimonials.filter(t => t.client_name).length}
              </div>
              <div className="text-[8px] sm:text-[10px] text-theme-light">Clients</div>
            </div>
            <div className="bg-card border border-theme rounded-xl p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-primary">
                {new Set(testimonials.map(t => t.organization)).size}
              </div>
              <div className="text-[8px] sm:text-[10px] text-theme-light">Orgs</div>
            </div>
            <div className="bg-card border border-theme rounded-xl p-2 sm:p-3 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-secondary">
                {testimonials.length > 0 ? "4.9" : "0"}
              </div>
              <div className="text-[8px] sm:text-[10px] text-theme-light">⭐ Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <section className="py-4 sm:py-6 px-4 sm:px-6 bg-theme">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-theme-light text-sm sm:text-base">🔍</span>
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client, organization, or keyword..."
              className="w-full pl-8 sm:pl-11 pr-4 py-2.5 sm:py-3 rounded-xl border text-sm sm:text-base outline-none bg-card text-theme border-theme focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS GRID ── */}
      <section className="py-6 sm:py-8 px-4 sm:px-6 bg-theme">
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
              <p className="text-theme-light text-sm">Try changing your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filtered.map((t, i) => {
                const color = colors[i % colors.length];
                return (
                  <div 
                    key={t.id}
                    className="group bg-card border border-theme rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedTestimonial(t)}
                  >
                    {/* Quote mark */}
                    <div className="text-3xl sm:text-5xl font-black leading-none mb-1 sm:mb-2" style={{ color, opacity: 0.15 }}>"</div>

                    {/* Quote */}
                    <p className="text-xs sm:text-sm text-theme-light leading-relaxed line-clamp-4 mb-3 sm:mb-4">
                      {t.quote}
                    </p>

                    {/* Client info */}
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
          )}
        </div>
      </section>

      {/* ── MODAL ── */}
      {selectedTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedTestimonial(null)}>
          <div className="bg-card rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 md:p-8 shadow-2xl border border-theme animate-scale-in mx-2 sm:mx-0"
            onClick={(e) => e.stopPropagation()}>
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-theme-light transition-colors text-lg sm:text-xl"
            >
              ✕
            </button>

            {/* Content */}
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
        
        input::placeholder { color: var(--color-text-light); opacity: 0.6; }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
}