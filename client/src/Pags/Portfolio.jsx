import { useEffect, useState } from "react";
import axios from "axios";

const categories = [
  "Capacity Building & Training",
  "Data Analytics & Research",
  "Monitoring, Evaluation & Learning",
  "Institutional Development",
  "Human Resource & Recruitment",
  "Conference & Event Support",
  "Education & Digital Transformation",
];

const categoryColor = (cat) => {
  const map = {
    "Capacity Building & Training": "var(--color-primary)",
    "Data Analytics & Research": "var(--color-secondary)",
    "Monitoring, Evaluation & Learning": "var(--color-primary)",
    "Institutional Development": "var(--color-secondary)",
    "Human Resource & Recruitment": "var(--color-primary)",
    "Conference & Event Support": "var(--color-secondary)",
    "Education & Digital Transformation": "var(--color-primary)",
  };
  return map[cat] || "var(--color-primary)";
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

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/portfolio")
      .then((res) => setProjects(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.client?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const stats = categories.map((cat) => ({
    name: cat,
    count: projects.filter((p) => p.category === cat).length,
    icon: categoryIcon(cat),
    color: categoryColor(cat),
  }));

  return (
    <div className="min-h-screen bg-theme">
      {/* ── HERO ── */}
      <section className="relative pt-[60px] overflow-hidden">
        <div className="relative py-16 md:py-24 px-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 animate-pulse"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-secondary text-xs font-semibold tracking-[2px]">OUR WORK</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
              Our <span className="text-secondary">Portfolio</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Explore our projects and impact across Ethiopia's vital sectors.
            </p>
          </div>
        </div>

        <div className="relative -mt-1">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-[40px]" preserveAspectRatio="none">
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30 L1440 60 L0 60Z" fill="var(--main-bg)" />
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30" stroke="var(--color-secondary)" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section className="py-6 md:px-6 px-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 items-center">
             <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search by name or role..."
              className="px-4 py-2.5 rounded-xl border text-sm outline-none flex-1 min-w-[120px] bg-card text-theme border-theme focus:border-primary transition-all"
            />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 ">
              <button 
                onClick={() => setFilterCat("All")}
                className="px-3  py-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={{
                  background: filterCat === "All" ? "var(--color-primary)" : "var(--card-bg)",
                  borderColor: filterCat === "All" ? "var(--color-primary)" : "var(--border-color)",
                  color: filterCat === "All" ? "#fff" : "var(--text-primary)",
                }}
              >
                All
              </button>
              {categories.slice(0, 5).map((cat) => {
                const isActive = filterCat === cat;
                const color = categoryColor(cat);
                return (
                  <button 
                    key={cat}
                    onClick={() => setFilterCat(isActive ? "All" : cat)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap"
                    style={{
                      background: isActive ? color : "var(--card-bg)",
                      borderColor: isActive ? color : "var(--border-color)",
                      color: isActive ? "#fff" : "var(--text-primary)",
                    }}
                  >
                    {categoryIcon(cat)} {cat.split(" ").slice(0, 2).join(" ")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section className="py-8 px-6 bg-theme">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: "var(--border-color)" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-theme rounded-2xl p-12 text-center">
              <div className="text-4xl mb-3">📋</div>
              <div className="font-bold text-primary mb-1">No projects found</div>
              <p className="text-muted text-sm">Try changing your search or filter.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const color = categoryColor(p.category);
                const icon = categoryIcon(p.category);
                return (
                  <div 
                    key={p.id}
                    className="group bg-card border border-theme rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer card-hover"
                    onClick={() => setSelectedProject(p)}
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                          style={{ background: color + "15" }}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-primary leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-xs text-muted mt-0.5 line-clamp-1">{p.client}</p>
                        </div>
                      </div>

                      {/* Category badge */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                          style={{ background: color + "12", color }}>
                          {p.category || "Uncategorized"}
                        </span>
                        {p.date && (
                          <span className="text-[10px] text-muted">
                            📅 {new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted leading-relaxed line-clamp-3">
                        {p.description}
                      </p>

                      {/* Read more */}
                      <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                        style={{ color }}>
                        Read More →
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
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedProject(null)}>
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-theme animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}>
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-theme-light transition-colors text-primary"
            >
              ✕
            </button>

            {/* Content */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: categoryColor(selectedProject.category) + "15" }}>
                {categoryIcon(selectedProject.category)}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-primary">{selectedProject.title}</h2>
                <p className="text-sm text-muted">{selectedProject.client}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: categoryColor(selectedProject.category) + "15", color: categoryColor(selectedProject.category) }}>
                {selectedProject.category || "Uncategorized"}
              </span>
              {selectedProject.date && (
                <span className="text-xs text-muted">
                  📅 {new Date(selectedProject.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              )}
            </div>

            <p className="text-muted leading-relaxed text-sm whitespace-pre-line">
              {selectedProject.description}
            </p>

            <button 
              onClick={() => setSelectedProject(null)}
              className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        
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
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
}