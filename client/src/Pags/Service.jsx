import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Componet/Footer";
import SEO from "../Componet/SEO";
import teamhero from "../assets/Img/teamhero.png"
import axios from "axios";


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

 

export default function Services() {
  const [active, setActive] = useState("cross");
  const [hoveredService, setHoveredService] = useState(null);
  const sectionRefs = useRef([]);
  const [expandedServices, setExpandedServices] = useState({});
   const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  // Pagination state
  const [visibleCount, setVisibleCount] = useState(6); // Default for desktop
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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


const sectors = [
  {
    id: "cross",
    label: "Agriculture & Food Security",
    icon: "🌾",
    color: "#1A7A3A",
    tagline: "Building resilience from field to fork",
    whoWeServe: "Smallholder farmers, agribusinesses, cooperatives, and government extension services.",
    services: [
      { name: "Value Chain Analysis", icon: "🔗", desc: "End-to-end mapping and optimization of agricultural value chains." },
      { name: "Food Security Assessment", icon: "📊", desc: "Comprehensive food security and nutrition surveys." },
      { name: "Agri-Business Development", icon: "📈", desc: "Supporting agri-enterprises with business planning and market access." },
      { name: "Extension Services", icon: "👨‍🌾", desc: "Strengthening agricultural extension and advisory services." },
    ]
  },
  {
    id: "health",
    label: "Health & Nutrition",
    icon: "🏥",
    color: "#C0392B",
    tagline: "Strengthening health systems for better outcomes",
    whoWeServe: "Government health institutions, NGOs, community-based organizations, and health programs.",
    services: [
      { name: "Health System Strengthening", icon: "🏛️", desc: "Improving health governance, financing, and service delivery." },
      { name: "Nutrition Programs", icon: "🍎", desc: "Design and evaluation of nutrition interventions." },
      { name: "M&E for Health Programs", icon: "📋", desc: "Monitoring and evaluation frameworks for health projects." },
      { name: "Community Health", icon: "👥", desc: "Community-based health promotion and disease prevention." },
    ]
  },
  {
    id: "education",
    label: "Education & Training",
    icon: "🎓",
    color: "#2980B9",
    tagline: "Empowering through knowledge and skills",
    whoWeServe: "Educational institutions, training centers, youth programs, and government ministries.",
    services: [
      { name: "Curriculum Development", icon: "📚", desc: "Design of competency-based curricula and learning materials." },
      { name: "Teacher Training", icon: "👨‍🏫", desc: "Professional development for educators and trainers." },
      { name: "Youth Empowerment", icon: "🌟", desc: "Skills development and livelihood programs for youth." },
      { name: "Education System Assessment", icon: "🔍", desc: "Evaluation of education systems and learning outcomes." },
    ]
  },
  {
    id: "governance",
    label: "Governance & Institutions",
    icon: "🏛️",
    color: "#8E44AD",
    tagline: "Building responsive and accountable institutions",
    whoWeServe: "Government agencies, civil society organizations, and public sector institutions.",
    services: [
      { name: "Institutional Assessment", icon: "📋", desc: "Capacity assessments and organizational development." },
      { name: "Policy Analysis", icon: "📝", desc: "Policy research, analysis, and reform support." },
      { name: "Governance Reform", icon: "⚖️", desc: "Support for governance and public sector reforms." },
      { name: "Civil Society Strengthening", icon: "🤝", desc: "Capacity building for CSOs and community organizations." },
    ]
  },
  {
    id: "data",
    label: "Data & Analytics",
    icon: "📊",
    color: "#F39C12",
    tagline: "Turning data into actionable insights",
    whoWeServe: "Research institutions, development organizations, and government agencies.",
    services: [
      { name: "Data Collection & Analysis", icon: "📊", desc: "Survey design, data collection, and statistical analysis." },
      { name: "M&E Systems", icon: "📈", desc: "Design and implementation of monitoring and evaluation systems." },
      { name: "Data Visualization", icon: "📉", desc: "Creating impactful data visualizations and dashboards." },
      { name: "Research & Studies", icon: "🔬", desc: "Qualitative and quantitative research for development." },
    ]
  }
];

const audiences = [
  { icon: "🏛️", label: "Government Institutions" },
  { icon: "🌐", label: "Development Partners" },
  { icon: "🤝", label: "NGOs & CBOs" },
  { icon: "🏢", label: "Private Sector" },
];

const toggleExpand = (index) => {
  setExpandedServices(prev => ({
    ...prev,
    [index]: !prev[index]
  }));
};

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("animate-in")),
      { threshold: 0.1 }
    );
    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  const activeSector = sectors.find((s) => s.id === active);

  return (
    <> <SEO 
        title="Our Team"
        description="Meet the expert team at Tibeb Consultancy - experienced professionals in consulting and training."
        keywords="team, consultants, experts, Ethiopia, professionals"
        url="https://www.tibeb.com/team"
      />
    <div className="bg-theme min-h-screen">
      
      {/* ── SERVICES HERO ── */}
     <section className="relative pt-[80px] md:pt-[100px] overflow-hidden min-h-[500px] md:min-h-[600px]">
             {/* Full Background Image */}
             <div className="fixed inset-0 z-0">
               <img 
                 src={teamhero}
                 alt="Consultant Team"
                 className="w-full h-full object-cover md:object-center object-right"
               />
               <div className="absolute inset-0 bg-black/10"></div>
             </div>
     
             {/* Content - Small Card on Left */}
             <div className="relative z-10 max-w-7xl mx-auto md:px-4 py-12 pt-5 md:pt-30 ">
               <div className="max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-4  md:mt-0 shadow-2xl mb-80 md:mb-0">
                 
     
                 {/* Heading */}
                 <h1 className="text-xl md:text-4xl font-bold text-[#2C3E50] mb-3 leading-tight">
                  Our <span className="text-[#D4A373]">Services</span>
                 </h1>
                  
    
                 {/* Description */}
                 <p className="text-[#5D6D7E] text-sm leading-relaxed mb-5">
                   Comprehensive consultancy, research, training, and institutional strengthening
              across Ethiopia's most vital sectors.
                 </p>
     
                 {/* CTA Buttons */}
                 <div className="flex items-center gap-3">
                  <div className="flex flex-wrap justify-center gap-3  animate-slide-up-delayed-2">
              <div>
                <p className="text-3xl font-extrabold text-secondary">5</p>
                <p className="text-xs text-theme-light tracking-wide">Core Sectors</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-3xl font-extrabold text-secondary">37+</p>
                <p className="text-xs text-theme-light tracking-wide">Service Offerings</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-3xl font-extrabold text-secondary">4</p>
                <p className="text-xs text-theme-light tracking-wide">Audience Types</p>
              </div>
            </div>
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

    {/* ── SECTOR TABS + DETAIL — UPGRADED ── */}
<section id="services" className="relative  bg-theme-light  py-20 px-4 md:px-6">
  <div className="max-w-7xl mx-auto">

    {/* Header */}
    <div ref={addRef} className="fade-up text-center mb-10 md:mb-12">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-0.5 w-8 md:w-10 bg-secondary rounded" />
        <span className="text-[10px] md:text-xs font-bold text-secondary tracking-[2px]">EXPLORE BY SECTOR</span>
        <div className="h-0.5 w-8 md:w-10 bg-secondary rounded" />
      </div>
      <h2 className="text-2xl md:text-4xl font-extrabold text-primary mb-2">Our Service Areas</h2>
      <p className="text-theme-light text-xs md:text-sm max-w-xl mx-auto px-4">
        Select a sector to explore our full range of services, real client experience, and how we can help you.
      </p>
    </div>

    {/* Sector tab buttons - scrollable on mobile */}
    <div ref={addRef} className="fade-up flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 mb-10 md:mb-14 overflow-x-auto pb-4 px-1 hide-scrollbar">
      {sectors.map((s) => (
        <button
          key={s.id}
          onClick={() => { setActive(s.id); setHoveredService(null); }}
          className="relative flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold border-2 transition-all duration-300 flex-shrink-0 whitespace-nowrap"
          style={{
            background: active === s.id ? s.color : "var(--color-card)",
            borderColor: active === s.id ? s.color : "var(--color-border)",
            color: active === s.id ? "#fff" : s.color,
            boxShadow: active === s.id ? `0 8px 25px ${s.color}35` : "none",
            transform: active === s.id ? "translateY(-2px)" : "translateY(0)",
          }}
        >
          <span className="text-sm md:text-base">{s.icon}</span>
          <span className="text-[10px] md:text-sm">{s.label}</span>
          {active === s.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "rgba(255,255,255,0.35)" }} />
          )}
        </button>
      ))}
    </div>

    {/* Active sector content */}
    <div key={active} className="animate-fadeSlideIn">
      {/* Two column layout - single column on mobile */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">

        {/* LEFT — Overview + clients + CTA */}
        <div className="lg:col-span-2 space-y-4 md:space-y-5">

          <div className="bg-card border border-theme rounded-2xl p-4 md:p-6 md:mt-16">
            <div className="text-[10px] md:text-xs font-bold tracking-[2px] mb-2 md:mb-3" style={{ color: activeSector.color }}>OVERVIEW</div>
            <p className="text-theme-light text-xs md:text-sm leading-relaxed mb-3 md:mb-4">{activeSector.tagline}</p>
            <div className="h-px w-full bg-[var(--color-border)] mb-3 md:mb-4" />
            <div className="text-[10px] md:text-xs font-bold tracking-[2px] mb-1 md:mb-2" style={{ color: activeSector.color }}>WHO WE SERVE</div>
            <p className="text-theme-light text-[10px] md:text-xs leading-relaxed">{activeSector.whoWeServe}</p>
          </div>

         

          <a href="/contact"
            className="flex items-center justify-center gap-2 w-full py-3 md:py-4 rounded-2xl font-bold text-white text-xs md:text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: activeSector.color, boxShadow: `0 6px 24px ${activeSector.color}40` }}>
            Request This Service
            <svg width="14" height="14" md:width="16" md:height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

 {/* RIGHT — service cards grid */}
<div className="lg:col-span-3">
  <div className="text-[16px] md:text-xs font-bold tracking-[2px] mb-3 md:mb-4 " style={{ color: activeSector.color }}>
    {activeSector.services.length} SERVICES IN THIS SECTOR
  </div>
 
  <div className="grid grid-cols-2 gap-2 md:gap-3">
    {activeSector.services.map((srv, i) => {
      const isHovered = hoveredService === i;
      // Use the state from component level, not useState inside map
      const isExpanded = expandedServices[i] || false;
      
      return (
        <div
          key={i}
          onMouseEnter={() => setHoveredService(i)}
          onMouseLeave={() => {
            setHoveredService(null);
          }}
          className="relative bg-card border rounded-xl md:rounded-2xl p-3 md:p-4 cursor-pointer transition-all duration-300 overflow-hidden group"
          style={{
            borderColor: isHovered ? activeSector.color : "var(--color-border)",
            boxShadow: isHovered ? `0 8px 24px ${activeSector.color}20` : "none",
            transform: isHovered ? "translateY(-3px)" : "translateY(0)",
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl md:rounded-2xl pointer-events-none"
            style={{ background: `radial-gradient(circle at 30% 30%, ${activeSector.color}08, transparent 70%)` }} />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-1 md:mb-2">
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl flex items-center justify-center text-sm md:text-base group-hover:scale-110 transition-transform duration-300"
                style={{ background: activeSector.color + "12" }}>
                {srv.icon}
              </div>
              <span className="text-sm md:text-xl font-black opacity-[0.06] group-hover:opacity-[0.14] transition-opacity"
                style={{ color: activeSector.color }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            <h4 className="font-bold text-[10px] md:text-xs mb-0.5 md:mb-1 leading-snug transition-colors duration-300 group-hover:text-secondary"
              style={{ color: activeSector.color }}>
              {srv.name}
            </h4>

            {/* Desktop: Show full description on hover */}
            <div className="hidden md:block overflow-hidden transition-all duration-400"
              style={{ maxHeight: isHovered ? "60px" : "40px" }}>
              <p className="text-theme-light text-[10px] leading-relaxed line-clamp-2">{srv.desc}</p>
            </div>

            {/* Mobile: Show truncated description with Read More button */}
            <div className="md:hidden">
              <div className="overflow-hidden transition-all duration-400"
                style={{ maxHeight: isExpanded ? "100px" : "18px" }}>
                <p className="text-theme-light text-[9px] leading-relaxed">{srv.desc}</p>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {!isExpanded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(i);
                    }}
                    className="text-[8px] font-semibold hover:underline transition-all"
                    style={{ color: activeSector.color }}
                  >
                    Read More →
                  </button>
                )}
                {isExpanded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(i);
                    }}
                    className="text-[8px] font-semibold hover:underline transition-all"
                    style={{ color: activeSector.color }}
                  >
                    Show Less ↑
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-1 mt-1 md:mt-2">
              <div className="h-0.5 rounded-full transition-all duration-300"
                style={{ width: isHovered ? "12px" : "4px", background: activeSector.color }} />
              <div className="h-0.5 rounded-full transition-all duration-300 delay-75"
                style={{ width: isHovered ? "8px" : "3px", background: activeSector.color, opacity: 0.4 }} />
              <div className="h-0.5 rounded-full transition-all duration-300 delay-150"
                style={{ width: isHovered ? "4px" : "2px", background: activeSector.color, opacity: 0.2 }} />
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
      </div>
    </div>
  </div>
</section>
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

            <div className="w-full md:w-auto">
              {/* Mobile Select */}
              <div className="md:hidden relative w-full z-20">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-theme bg-card text-theme text-sm outline-none focus:border-primary transition-all"
                >
                  <span className="truncate">{filterDept === "All" ? "All Departments" : filterDept}</span>
                  <svg width="12" height="8" viewBox="0 0 12 8" className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-theme rounded-xl shadow-lg overflow-hidden animate-fade-in z-50">
                    <button
                      onClick={() => {
                        setFilterDept("All");
                        setVisibleCount(isMobile ? 4 : 6);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filterDept === "All" ? 'bg-primary/10 text-primary font-semibold' : 'text-theme hover:bg-theme-light'}`}
                    >
                      All Departments
                    </button>
                    {departments.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setFilterDept(d);
                          setVisibleCount(isMobile ? 4 : 6);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filterDept === d ? 'bg-primary/10 text-primary font-semibold' : 'text-theme hover:bg-theme-light'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop Buttons */}
              <div className="hidden md:flex flex-wrap gap-2">
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

        {/* ── CTA ── */}
      <section ref={addRef} className="fade-up py-16 px-6">
        <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
          <h2 className="text-3xl font-extrabold text-white mb-3">Need a Custom Solution?</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Our multidisciplinary team is ready to design a tailored intervention that meets your organization's unique needs.
          </p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-glow">
            Get in Touch
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
      <Footer/>
      <style>{`
        .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.animate-in { opacity: 1; transform: translateY(0); }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatDelayed { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spinSlowReverse { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 5s ease-in-out infinite 1s; }
        .animate-spin-slow { animation: spinSlow 20s linear infinite; }
        .animate-spin-slow-reverse { animation: spinSlowReverse 15s linear infinite; }
        .animate-slide-up { animation: slideUp 0.7s ease forwards; }
        .animate-slide-up-delayed { animation: slideUp 0.7s ease forwards 0.15s; opacity:0; }
        .animate-slide-up-delayed-2 { animation: slideUp 0.7s ease forwards 0.3s; opacity:0; }
        .animate-slide-up-delayed-3 { animation: slideUp 0.7s ease forwards 0.45s; opacity:0; }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
    </>
  );
}
