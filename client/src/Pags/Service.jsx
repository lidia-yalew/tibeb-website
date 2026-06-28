import { useEffect, useRef, useState } from "react";
import Navbar from "../Componet/Navbar";
import { Link } from "react-router-dom";

const sectors = [
  {
    id: "cross",
    icon: "🏛️",
    color: "#1A237E",
    label: "CROSS-CUTTING",
    title: "Institutional Development Services",
    subtitle: "Corporate · Government · NGO & International Development",
    tagline: "End-to-end tailored services for modern institutional governance and execution across all sectors.",
    whoWeServe: "We systematically translate insights across three major ecosystems: the highly competitive Corporate Business Sector, the policy-driven Government Sector, and the compliance-intensive NGO & International development domain.",
    impact: "52+ professionals · 3 sectors · 7 core service lines",
    clients: ["CARD (Addis Ababa, Adama, Dire Dawa)", "Diverse Tech Solution PLC", "Nexsuses Trading & Consultancy", "Tena Adam Gardens PLC", "DESHET Education & Training S.C."],
    services: [
      { icon: "🗺️", name: "Organizational Model & Strategic Advisory", desc: "Diagnosing organizational structures and designing fit-for-purpose models aligned to your strategic direction." },
      { icon: "📋", name: "Project Management & Research Development", desc: "End-to-end project design, planning, implementation oversight, and research coordination." },
      { icon: "📜", name: "Policy & Strategy Analysis", desc: "Rigorous analysis of policies, strategies, and regulatory frameworks to inform evidence-based decision-making." },
      { icon: "📈", name: "Monitoring, Evaluation & Learning (MEL)", desc: "Designing and implementing adaptive MEL systems that drive continuous learning and accountability." },
      { icon: "💾", name: "Data Management, Analytics & Visualization", desc: "Transforming raw data into actionable insights through robust management systems and compelling dashboards." },
      { icon: "🎓", name: "Training & Capacity Building", desc: "Designing and delivering impactful programs that build lasting institutional capability." },
      { icon: "💼", name: "Finance, HR & Administrative Management", desc: "Strengthening financial, human resource, and administrative systems for operational excellence." },
    ],
  },
  {
    id: "data",
    icon: "🤖",
    color: "#C9A84C",
    label: "DATA & DIGITAL",
    title: "Data Intelligence, Research & Statistical Services",
    subtitle: "Powering decisions with evidence, analytics and digital innovation",
    tagline: "Cutting-edge data science, research and digital transformation solutions for modern institutions.",
    whoWeServe: "We support organizations that need to move from intuition to evidence — delivering rigorous quantitative and qualitative research, advanced analytics, and machine learning solutions tailored to Ethiopia's development context.",
    impact: "6 PhD data scientists · National & international projects · Real-time dashboards",
    clients: ["Diverse Tech Solution PLC", "Panacea Business & Engineering PLC", "IBS 19th Biennial Conference (Addis Ababa, 2025)", "Oda Addi Trade PLC"],
    services: [
      { icon: "📱", name: "Digital Data Collection & Management", desc: "Designing digital data collection tools and robust management systems for clean, reliable data." },
      { icon: "📊", name: "Data Visualization & Dashboard Development", desc: "Building interactive dashboards and visual reports that communicate complex data clearly to decision-makers." },
      { icon: "🔬", name: "Data Science & Advanced Analytics", desc: "Applying statistical modelling, machine learning, and advanced analytics to uncover patterns and insights." },
      { icon: "🔍", name: "Quantitative & Qualitative Research", desc: "Conducting rigorous mixed-methods research using internationally validated frameworks and tools." },
      { icon: "🧠", name: "Machine Learning, AI & Predictive Modeling", desc: "Building predictive models and AI solutions to optimize operations and forecast outcomes." },
      { icon: "🔄", name: "Adaptive MEL Systems Development & Support", desc: "Developing responsive monitoring systems that learn and adapt to evolving program contexts." },
    ],
  },
  {
    id: "health",
    icon: "🏥",
    color: "#1A237E",
    label: "HEALTH",
    title: "Health Sector Services",
    subtitle: "Strengthening Ethiopia's health systems from policy to practice",
    tagline: "Comprehensive health consultancy spanning policy development, workforce training, and health data analytics.",
    whoWeServe: "We serve Ethiopia's Ministry of Health, regional health bureaus, NGOs, hospitals, and international health development partners — bringing both deep local knowledge and global health frameworks.",
    impact: "Policy to practice · Workforce development · Evidence-based programming",
    clients: ["EECMY-DASSC (SRA4C terminal evaluation)", "Regional Health Bureaus", "NGO health programs"],
    services: [
      { icon: "📜", name: "Health Policy & Strategy Development", desc: "Formulating evidence-based health policies, strategies and implementation frameworks for sustainable health outcomes." },
      { icon: "🏗️", name: "Health Systems Strengthening", desc: "Diagnosing and strengthening health system building blocks including governance, financing, and service delivery." },
      { icon: "🎯", name: "Public Health Program Design & Evaluation", desc: "Designing robust public health programs and conducting rigorous evaluations that generate actionable learning." },
      { icon: "👩‍⚕️", name: "Healthcare Workforce Development & Training", desc: "Building the knowledge and skills of health professionals through tailored, evidence-based training programs." },
      { icon: "🔬", name: "Health Research & Operational Studies", desc: "Conducting applied health research and operational studies that inform policy and program decisions." },
      { icon: "📊", name: "Health Data Analysis & Visualization", desc: "Analyzing health data and producing compelling visualizations that support reporting and strategic planning." },
      { icon: "⭐", name: "Healthcare Quality Improvement Initiatives", desc: "Implementing structured quality improvement approaches that elevate patient care and health outcomes." },
    ],
  },
  {
    id: "education",
    icon: "🎓",
    color: "#C9A84C",
    label: "EDUCATION",
    title: "Education Sector Services",
    subtitle: "Transforming learning systems and building educational excellence",
    tagline: "Quality assurance, institutional strengthening, and capacity building for Ethiopia's education sector.",
    whoWeServe: "We support Ministries of Education, regional education bureaus, schools, universities, and education NGOs — driving quality improvement from classroom to policy level.",
    impact: "Recognized by Mahibere Kidusan Hawassa Center · Lab setup · Digital transformation",
    clients: ["Mahibere Kidusan Hawassa Center (MKHC)", "DESHET Education & Training S.C.", "Leap Learning Applications (LLA)"],
    services: [
      { icon: "✅", name: "Education Quality Assurance Assessment", desc: "Conducting comprehensive quality audits of educational institutions against national and international standards." },
      { icon: "🔍", name: "School System Inspection & Performance Assessment", desc: "Systematic inspection of school operations, leadership, teaching quality and student outcomes." },
      { icon: "📚", name: "Capacity Building & Professional Development Training", desc: "Empowering educators and school leaders with cutting-edge pedagogical and management skills." },
      { icon: "🗺️", name: "Strategic Planning & School Improvement Programs", desc: "Facilitating school-level strategic planning processes and designing structured improvement programs." },
      { icon: "🔭", name: "School Science Laboratory Development & Setup", desc: "Designing, equipping, and preparing science labs including manual preparation and teacher orientation." },
      { icon: "🏫", name: "School Pedagogical Center Establishment", desc: "Establishing and organizing school pedagogical centers to support continuous teacher development." },
      { icon: "💻", name: "Educational Management Information System", desc: "Developing and implementing EMIS platforms for data-driven school and system management." },
      { icon: "🌟", name: "Student Talent Identification & Development", desc: "Designing systems to identify, develop and manage student talent for national competitiveness." },
      { icon: "🏆", name: "School Competitiveness & Institutional Transformation", desc: "Implementing transformation programs that build competitive, sustainable, high-performing schools." },
    ],
  },
  {
    id: "agriculture",
    icon: "🌾",
    color: "#1A237E",
    label: "AGRICULTURE",
    title: "Agriculture Sector Services",
    subtitle: "Growing sustainable food systems and resilient rural livelihoods",
    tagline: "From climate-smart farming to agribusiness development — supporting Ethiopia's agricultural transformation.",
    whoWeServe: "We serve Ethiopia's Ministry of Agriculture, development agencies, NGOs, farmer cooperatives, and agribusinesses — bridging the gap between smallholder farmers and modern market systems.",
    impact: "Climate-smart · Value chain development · Food security programming",
    clients: ["EECMY-DASSC SRA4C Project (climate resilience evaluation)", "Agricultural development NGOs & partners"],
    services: [
      { icon: "🌍", name: "Climate-Smart & Sustainable Agriculture", desc: "Designing and implementing climate-adaptive agricultural practices that build long-term food security and resilience." },
      { icon: "🔗", name: "Agricultural Value Chain Development", desc: "Analysing and strengthening agricultural value chains to improve productivity, quality and market access." },
      { icon: "🍽️", name: "Food Security & Livelihoods Programming", desc: "Designing integrated food security programs that address root causes of hunger and improve rural livelihoods." },
      { icon: "📈", name: "Agribusiness Development & Market Linkage", desc: "Supporting agribusinesses with strategic planning, market linkage, and business development services." },
      { icon: "👨‍🌾", name: "Farmer Training & Extension Services", desc: "Delivering practical, context-appropriate training to farmers and extension workers for improved productivity." },
      { icon: "📜", name: "Agricultural Policy & Investment Advisory", desc: "Providing evidence-based advisory on agricultural policy, investment planning, and sector development strategies." },
      { icon: "🏘️", name: "Rural Development Initiatives", desc: "Designing and implementing integrated rural development programs that address social, economic and infrastructure needs." },
    ],
  },
];

const audiences = [
  { icon: "🏛️", label: "Government Institutions" },
  { icon: "🌐", label: "Development Partners" },
  { icon: "🤝", label: "NGOs & CBOs" },
  { icon: "🏢", label: "Private Sector" },
];

export default function Services() {
  const [active, setActive] = useState("cross");
  const [hoveredService, setHoveredService] = useState(null);
  const sectionRefs = useRef([]);
  const [expandedServices, setExpandedServices] = useState({});

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
    <div className="bg-theme min-h-screen">
      {/* ── SERVICES HERO ── */}
      <section className="pt-[72px] relative overflow-hidden">
        <div className="relative min-h-[85vh] flex items-center justify-center px-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 animate-pulse"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
            <div className="absolute top-20 left-10 animate-float">
              <div className="w-16 h-16 rounded-full blur-xl" style={{ background: "var(--color-secondary)", opacity: 0.1 }} />
            </div>
            <div className="absolute bottom-20 right-10 animate-float-delayed">
              <div className="w-24 h-24 rounded-full blur-xl" style={{ background: "var(--color-secondary)", opacity: 0.05 }} />
            </div>
            <div className="absolute top-1/4 right-[15%] animate-float-delayed hidden lg:block">
              <div className="w-12 h-12 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>🏥</div>
            </div>
            <div className="absolute bottom-1/3 left-[10%] animate-float hidden lg:block">
              <div className="w-12 h-12 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>🎓</div>
            </div>
            <div className="absolute top-1/3 left-[20%] animate-float-delayed hidden lg:block">
              <div className="w-10 h-10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>🌾</div>
            </div>
            <div className="absolute bottom-1/4 right-[20%] animate-float hidden lg:block">
              <div className="w-10 h-10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>🤖</div>
            </div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-2 leading-tight animate-slide-up">
              <span className="text-secondary">Our</span>
              <span className="text-primary"> Services</span>
            </h1>
            <p className="text-muted text-sm md:text-xl max-w-2xl mx-auto leading-relaxed animate-slide-up-delayed">
              Comprehensive consultancy, research, training, and institutional strengthening
              across Ethiopia's most vital sectors.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-6 animate-slide-up-delayed-2">
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
            <div className="flex flex-wrap justify-center gap-4 mt-10 animate-slide-up-delayed-3">
              <Link to="/services" className="group text-secondary bg-primary font-bold px-2 md:px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-secondary/30 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Explore Services
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a href="/contact" className="backdrop-blur-sm border border-primary text-theme-light font-semibold px-8 py-3.5 rounded-full hover:bg-secondary transition-all duration-300 hover:scale-105">
                Contact Us
              </a>
            </div>
          </div>

          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block opacity-10">
            <div className="relative w-[250px] h-[250px]">
              <div className="absolute inset-0 border-2 border-secondary/30 rounded-full animate-spin-slow" />
              <div className="absolute inset-[20%] border-2 border-secondary/20 rounded-full animate-spin-slow-reverse" />
              <div className="absolute inset-[40%] border border-secondary/10 rounded-full" />
              <div className="absolute inset-[30%] flex items-center justify-center">
                <span className="text-7xl font-bold text-secondary/20">S</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-1">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-[40px]" preserveAspectRatio="none">
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30 L1440 60 L0 60Z" fill="var(--color-bg)" />
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30" stroke="var(--color-secondary)" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>
      </section>

    {/* ── SECTOR TABS + DETAIL — UPGRADED ── */}
<section id="services" className="py-20 px-4 md:px-6">
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

          <div className="bg-card border border-theme rounded-2xl p-4 md:p-6">
            <div className="text-[10px] md:text-xs font-bold tracking-[2px] mb-3 md:mb-4" style={{ color: activeSector.color }}>
              ✅ REAL CLIENT EXPERIENCE
            </div>
            <div className="space-y-2">
              {activeSector.clients.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: activeSector.color }} />
                  <span className="text-[10px] md:text-xs text-theme-light leading-relaxed">{c}</span>
                </div>
              ))}
            </div>
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

      {/* ── CTA ── */}
      <section ref={addRef} className="fade-up py-16 px-6">
        <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
          <h2 className="text-3xl font-extrabold text-white mb-3">Need a Custom Solution?</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Our multidisciplinary team is ready to design a tailored intervention that meets your organization's unique needs.
          </p>
          <a href="/contact"
            className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-glow">
            Get in Touch
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

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
  );
}
