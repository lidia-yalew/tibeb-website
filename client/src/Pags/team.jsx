import { useEffect, useState } from "react";
import Navbar from "../Componet/Navbar";
import axios from "axios";
import teamhero from "../assets/Img/teamhero.png"
import { Link } from "react-router-dom";
import Footer from "../Componet/Footer";
import SEO from "../Componet/SEO";

const departments = [
  "Executive Team",
  "Project Management & Research",
  "Training & Capacity Building",
  "Data Intelligence, Research & Statistical Services",
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
  
  const API = `${import.meta.env.VITE_API_URL}`;
  // Pagination state
  const [visibleCount, setVisibleCount] = useState(6); // Default for desktop
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  useEffect(() => {
    axios.get(`${API}/team`)
      .then((res) => setMembers(res.data))
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

  const filtered = members.filter((m) => {
    const matchDept = filterDept === "All" || m.department === filterDept;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  // Get visible members based on pagination
  const visibleMembers = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Load more handler
  const loadMore = () => {
    const increment = isMobile ? 4 : 6;
    setVisibleCount(prev => Math.min(prev + increment, filtered.length));
  };

  // Show less handler
  const showLess = () => {
    setVisibleCount(isMobile ? 4 : 6);
  };

  const stats = departments.map((d) => ({
    name: d,
    count: members.filter((m) => m.department === d).length,
    icon: deptIcon(d),
    color: deptColor(d),
  }));

  return (
    <div className="bg-theme min-h-screen mt-25 sm:mt-0">

       <SEO 
        title="Our Team"
        description="Meet the expert team at Tibeb Consultancy - experienced professionals in consulting and training."
        keywords="team, consultants, experts, Ethiopia, professionals"
        url="https://www.tibeb.com/team"
      />
      {/* ── HERO ── */}
      <section className="relative pt-[78px] md:pt-[100px] overflow-hidden min-h-[500px] md:min-h-[600px]">
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0 fixed">
          <img 
            src={teamhero}
            alt="Consultant Team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content - Small Card on Left */}
        <div className="relative z-10 max-w-7xl mx-auto md:px-4 py-12 pt-5 md:pt-30">
          <div className="max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-4 shadow-2xl">
            {/* Subtitle */}
            <p className="text-[#2C3E50] text-base md:text-lg mb-2 font-light">
              <span className="text-[#D4A373]">—</span> Expert Advice.
              <span className="text-[#D4A373]">Real Solutions.</span>
            </p>

            {/* Heading */}
            <h1 className="text-xl md:text-4xl font-bold text-[#2C3E50] mb-3 leading-tight">
              Meet Our <span className="text-[#D4A373]">Team</span>
            </h1>

            {/* Description */}
            <p className="text-[#5D6D7E] text-sm leading-relaxed mb-5">
              Our consultant team is here to help your business grow with strategy, insight, and experience you can trust.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/Services" className="px-5 py-2 bg-[#D4A373] text-white font-semibold rounded-full hover:bg-[#C4956A] transition-all duration-300 text-sm shadow-md">
                Our Services
              </Link>
              <Link to="/team" className="px-5 py-2 bg-white text-[#2C3E50] font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 text-sm shadow-md border border-[#E8E0D8]">
                Meet the Team
              </Link>
            </div>
          </div>
        </div>

        {/* Curved divider */}
        <div className="relative z-10 -mt-1">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-[30px]" preserveAspectRatio="none">
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30 L1440 60 L0 60Z" fill="var(--color-bg)" />
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30" stroke="var(--color-secondary)" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative py-6 md:px-6 px-1 bg-theme-light border-b border-theme">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-6 gap-2">
            {/* All Members */}
            <div 
              className="bg-card rounded-xl p-2.5 text-center cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{
                border: filterDept === "All" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              }}
              onClick={() => {
                setFilterDept("All");
                setVisibleCount(isMobile ? 4 : 6);
              }}
            >
              <div className="text-lg font-extrabold" style={{ color: filterDept === "All" ? "var(--color-primary)" : "var(--color-text)" }}>
                {members.length}
              </div>
              <div className="text-lg text-theme-light uppercase tracking-wide">All</div>
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
                  onClick={() => {
                    setFilterDept(isActive ? "All" : s.name);
                    setVisibleCount(isMobile ? 4 : 6);
                  }}
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
      <section className="relative py-6 px-6 bg-theme">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 items-center">
            <input 
              value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(isMobile ? 4 : 6);
              }}
              placeholder="🔍 Search by name or role..."
              className="px-4 py-2.5 rounded-xl border text-sm outline-none flex-1 min-w-[200px] bg-card text-theme border-theme focus:border-primary transition-all"
            />
            
            {/* View Toggle Buttons */}
            <div className="flex items-center gap-1 bg-card rounded-xl p-1 border border-theme">
              <button
                onClick={() => {
                  setViewMode("grid");
                  setVisibleCount(isMobile ? 4 : 6);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid" 
                    ? "bg-primary text-white shadow-md" 
                    : "text-theme-light hover:bg-theme-light/20"
                }`}
              >
                📐 Grid
              </button>
              <button
                onClick={() => {
                  setViewMode("list");
                  setVisibleCount(isMobile ? 4 : 6);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "list" 
                    ? "bg-primary text-white shadow-md" 
                    : "text-theme-light hover:bg-theme-light/20"
                }`}
              >
                📋 List
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => {
                  setFilterDept("All");
                  setVisibleCount(isMobile ? 4 : 6);
                }}
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
                    onClick={() => {
                      setFilterDept(isActive ? "All" : d);
                      setVisibleCount(isMobile ? 4 : 6);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap text-theme"
                    style={{
                      background: isActive ? color : "var(--color-card)",
                      borderColor: isActive ? color : "var(--color-border)",
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM GRID/LIST ── */}
      <section className="relative py-8 px-6 bg-theme">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Our <span className="text-secondary">Team</span>
            </h2>
            <p className="text-theme-light text-sm max-w-2xl mx-auto">
              Each of our team members brings unique expertise and real-world experience to help your business thrive.
            </p>
          </div>

          {loading ? (
            <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 rounded-2xl animate-pulse bg-theme-light" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-card border border-theme rounded-2xl p-12 text-center">
              <div className="text-4xl mb-3">👥</div>
              <div className="font-bold text-primary mb-1">No team members found</div>
              <p className="text-theme-light text-sm">Try changing your search or filter.</p>
            </div>
          ) : (
            <>
              <div className={viewMode === "grid" 
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {visibleMembers.map((m) => {
                  const color = deptColor(m.department);
                  const initials = m.name.split(" ").filter(w => !["Dr.", "Mr.", "PhD"].includes(w)).map(w => w[0]).slice(0, 2).join("");
                  
                  if (viewMode === "grid") {
                    return (
                      <div 
                        key={m.id}
                        className="group bg-card rounded-2xl overflow-hidden border border-theme hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedMember(m)}
                      >
                        <div className="p-6">
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold mt-2"
                              style={{ background: color + "12", color }}>
                              {deptIcon(m.department)} {m.department?.split("... ")}
                            </div>
                          <div className="flex flex-col items-center text-center">
                            {m.photo_url ? (
                              <img 
                                src={m.photo_url} 
                                alt={m.name}
                                className="w-24 h-24 rounded-full object-cover border-4 mb-3 group-hover:scale-105 transition-transform duration-300"
                                style={{ borderColor: color + "40" }}
                              />
                            ) : (
                              <div 
                                className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3 group-hover:scale-105 transition-transform duration-300"
                                style={{ background: color }}
                              >
                                {initials}
                              </div>
                            )}
                            
                            <h3 className="font-bold text-base text-primary group-hover:text-secondary transition-colors">
                              {m.name}
                            </h3>
                            
                            <p className="text-xs font-medium mt-1" style={{ color }}>
                              {m.role}
                            </p>

                            

                            {m.bio && (
                              <p className="text-xs text-theme-light leading-relaxed mt-3 line-clamp-2">
                                {m.bio}
                              </p>
                            )}

                            <div className="mt-4 pt-3 border-t border-theme w-full">
                              <span 
                                className="text-xs font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                                style={{ color }}
                              >
                                View Profile →
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // List View
                    return (
                      <div 
                        key={m.id}
                        className="group bg-card rounded-2xl overflow-hidden border border-theme hover:shadow-xl transition-all duration-300 cursor-pointer p-4 flex items-center gap-4"
                        onClick={() => setSelectedMember(m)}
                      >
                        <div className="flex-shrink-0">
                          {m.photo_url ? (
                            <img 
                              src={m.photo_url} 
                              alt={m.name}
                              className="w-16 h-16 rounded-full object-cover border-4"
                              style={{ borderColor: color + "40" }}
                            />
                          ) : (
                            <div 
                              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                              style={{ background: color }}
                            >
                              {initials}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base text-primary group-hover:text-secondary transition-colors">
                            {m.name}
                          </h3>
                          <p className="text-xs font-medium" style={{ color }}>
                            {m.role}
                          </p>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1"
                            style={{ background: color + "12", color }}>
                            {deptIcon(m.department)} {m.department?.split(" ").slice(0, 2).join(" ")}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <span 
                            className="text-xs font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
                            style={{ color }}
                          >
                            View →
                          </span>
                        </div>
                      </div>
                    );
                  }
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

                  {/* Counter */}
                  <span className="text-xs text-muted">
                    Showing {visibleMembers.length} of {filtered.length} team members
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── MODAL ── */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedMember(null)}>
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-theme animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-theme-light transition-colors text-theme-light"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              {selectedMember.photo_url ? (
                <img src={selectedMember.photo_url} alt={selectedMember.name}
                  className="w-28 h-28 rounded-full object-cover border-4 mb-4"
                  style={{ borderColor: deptColor(selectedMember.department) + "40" }} />
              ) : (
                <div className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4"
                  style={{ background: deptColor(selectedMember.department) }}>
                  {selectedMember.name.split(" ").filter(w => !["Dr.", "Mr.", "PhD"].includes(w)).map(w => w[0]).slice(0, 2).join("")}
                </div>
              )}
              <h2 className="text-2xl font-extrabold text-primary">{selectedMember.name}</h2>
              <p className="text-sm font-semibold mt-1" style={{ color: deptColor(selectedMember.department) }}>
                {selectedMember.role}
              </p>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-2"
                style={{ background: deptColor(selectedMember.department) + "12", color: deptColor(selectedMember.department) }}>
                {selectedMember.department}
              </span>
            </div>

            {selectedMember.bio && (
              <div className="mt-6 pt-6 border-t border-theme">
                <h4 className="text-xs font-bold tracking-[2px] text-secondary mb-2 text-center">ABOUT</h4>
                <p className="text-theme-light leading-relaxed text-sm text-center">{selectedMember.bio}</p>
              </div>
            )}

            <button 
              onClick={() => setSelectedMember(null)}
              className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 w-full"
              style={{ background: "var(--color-primary)" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
<Footer/>
      <style>{`
        .line-clamp-2 { 
          display: -webkit-box; 
          -webkit-line-clamp: 2; 
          -webkit-box-orient: vertical; 
          overflow: hidden; 
        }
        
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