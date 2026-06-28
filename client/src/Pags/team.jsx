import { useEffect, useState } from "react";
import Navbar from "../Componet/Navbar";
import axios from "axios";

const departments = [
  "Executive Team",
  "Data Intelligence, Research & Statistical Services",
  "Training & Capacity Building",
  "Project Management & Research",
  "Finance & Human Resource",
];

const deptColor = (dept) => dept?.includes("Executive") ? "var(--color-primary)" :
  dept?.includes("Data") ? "var(--color-secondary)" :
  dept?.includes("Training") ? "var(--color-primary)" :
  dept?.includes("Project") ? "var(--color-secondary)" : "var(--color-primary)";

const deptIcon = (dept) => {
  if (dept?.includes("Executive")) return "👔";
  if (dept?.includes("Data")) return "📊";
  if (dept?.includes("Training")) return "🎓";
  if (dept?.includes("Project")) return "📋";
  if (dept?.includes("Finance")) return "💰";
  return "👤";
};

export default function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/team")
      .then((res) => setMembers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) => {
    const matchDept = filterDept === "All" || m.department === filterDept;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const stats = departments.map((d) => ({
    name: d,
    count: members.filter((m) => m.department === d).length,
    icon: deptIcon(d),
    color: deptColor(d),
  }));

  return (
    <div className="bg-theme min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-[78px] md:pt-[100px] overflow-hidden">
        <div className="relative py-16 md:py-24 px-6 ">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 animate-pulse"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
              Meet Our <span className="text-secondary">Team</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Experts dedicated to transforming Ethiopia's vital sectors through wisdom, innovation, and impact.
            </p>
          </div>
        </div>

        <div className="relative -mt-1">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-[40px]" preserveAspectRatio="none">
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30 L1440 60 L0 60Z" fill="var(--color-bg)" />
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30" stroke="var(--color-secondary)" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>
      </section>

{/* ── STATS BAR ── */}
<section className="py-6 md:px-6 px-1 bg-theme-light border-b border-theme">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-6 gap-2">
      {/* All Members */}
      <div 
        className="bg-card rounded-xl p-2.5 text-center cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
        style={{
          border: filterDept === "All" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
        }}
        onClick={() => setFilterDept("All")}
      >
        <div className="text-lg font-extrabold" style={{ color: filterDept === "All" ? "var(--color-primary)" : "var(--color-text)" }}>
          {members.length}
        </div>
        <div className="text-[8px] text-theme-light uppercase tracking-wide">All</div>
        {filterDept === "All" && (
          <div className="mt-0.5 flex justify-center">
            <div className="w-4 h-0.5 rounded-full bg-primary" />
          </div>
        )}
      </div>

      {/* Department cards */}
      {stats.map((s, i) => {
        const isActive = filterDept === s.name;
        return (
          <div 
            key={i}
            className="bg-card rounded-xl p-2.5 text-center cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{
              border: isActive ? `2px solid ${s.color}` : "1px solid var(--color-border)",
            }}
            onClick={() => setFilterDept(isActive ? "All" : s.name)}
          >
            <div className="text-lg mb-0.5">{s.icon}</div>
            <div className="text-base font-extrabold" style={{ color: isActive ? s.color : "var(--color-text)" }}>
              {s.count}
            </div>
            <div className="text-[7px] text-theme-light truncate uppercase tracking-wide">
              {s.name.split(" ").slice(0, 2).join(" ")}
            </div>
            {isActive && (
              <div className="mt-0.5 flex justify-center">
                <div className="w-4 h-0.5 rounded-full" style={{ background: s.color }} />
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* Total count label */}
    <div className="text-center text-[10px] text-theme-light mt-3">
      {members.length} team members · {departments.length} departments
    </div>
  </div>
</section>

      {/* ── FILTERS ── */}
      <section className="py-6 px-6 bg-theme">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 items-center">
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search by name or role..."
              className="px-4 py-2.5 rounded-xl border text-sm outline-none flex-1 min-w-[200px] bg-card text-theme border-theme focus:border-primary transition-all"
            />
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilterDept("All")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={{
                  background: filterDept === "All" ? "var(--color-primary)" : "var(--color-card)",
                  borderColor: filterDept === "All" ? "var(--color-primary)" : "var(--color-border)",
                  color: filterDept === "All" ? "#fff" : "var(--color-text)",
                }}
              >
                All
              </button>
              {departments.map((d) => {
                const isActive = filterDept === d;
                const color = deptColor(d);
                return (
                  <button 
                    key={d}
                    onClick={() => setFilterDept(isActive ? "All" : d)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap"
                    style={{
                      background: isActive ? color : "var(--color-card)",
                      borderColor: isActive ? color : "var(--color-border)",
                      color: isActive ? "#fff" : "var(--color-text)",
                    }}
                  >
                    {d.split(" ").slice(0, 2).join(" ")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM GRID ── */}
      <section className="py-8 px-6 bg-theme">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-56 rounded-2xl animate-pulse bg-theme-light" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-theme rounded-2xl p-12 text-center">
              <div className="text-4xl mb-3">👥</div>
              <div className="font-bold text-primary mb-1">No team members found</div>
              <p className="text-theme-light text-sm">Try changing your search or filter.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((m) => {
                const color = deptColor(m.department);
                const initials = m.name.split(" ").filter(w => !["Dr.", "Mr.", "PhD"].includes(w)).map(w => w[0]).slice(0, 2).join("");
                return (
                  <div 
                    key={m.id}
                    className="group bg-card border border-theme rounded-2xl p-5 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedMember(m)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {/* Avatar */}
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border-2 group-hover:scale-105 transition-transform duration-300"
                          style={{ borderColor: color + "30" }} />
                      ) : (
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                          style={{ background: color }}>
                          {initials}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-primary leading-snug group-hover:text-secondary transition-colors">
                          {m.name}
                        </h3>
                        <p className="text-xs font-semibold mt-0.5" style={{ color }}>{m.role}</p>
                      </div>
                    </div>

                    {/* Department badge */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold mb-3"
                      style={{ background: color + "12", color }}>
                      {deptIcon(m.department)} {m.department?.split(" ").slice(0, 2).join(" ")}
                    </div>

                    {/* Bio */}
                    {m.bio && (
                      <p className="text-xs text-theme-light leading-relaxed line-clamp-2">{m.bio}</p>
                    )}

                    {/* View profile */}
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                      style={{ color }}>
                      View Profile →
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── MODAL ── */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedMember(null)}>
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-theme animate-scale-in"
            onClick={(e) => e.stopPropagation()}>
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-theme-light transition-colors"
            >
              ✕
            </button>

            {/* Content */}
            <div className="flex items-start gap-4 mb-6">
              {selectedMember.photo_url ? (
                <img src={selectedMember.photo_url} alt={selectedMember.name}
                  className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border-2"
                  style={{ borderColor: deptColor(selectedMember.department) + "30" }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                  style={{ background: deptColor(selectedMember.department) }}>
                  {selectedMember.name.split(" ").filter(w => !["Dr.", "Mr.", "PhD"].includes(w)).map(w => w[0]).slice(0, 2).join("")}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-extrabold text-primary">{selectedMember.name}</h2>
                <p className="text-sm font-semibold" style={{ color: deptColor(selectedMember.department) }}>
                  {selectedMember.role}
                </p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold mt-1"
                  style={{ background: deptColor(selectedMember.department) + "12", color: deptColor(selectedMember.department) }}>
                  {selectedMember.department}
                </span>
              </div>
            </div>

            {selectedMember.bio && (
              <div className="mb-4">
                <h4 className="text-xs font-bold tracking-[2px] text-secondary mb-2">BIO</h4>
                <p className="text-theme-light leading-relaxed text-sm">{selectedMember.bio}</p>
              </div>
            )}

            <button 
              onClick={() => setSelectedMember(null)}
              className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "var(--color-primary)" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
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
      `}</style>
    </div>
  );
}