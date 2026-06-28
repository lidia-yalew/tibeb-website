import { useEffect, useRef } from "react";
import Navbar from "../Componet/Navbar";
import logo from "../assets/Img/logo.png"
import img1 from "../assets/Img/tbimg1.png"
import { Link } from "react-router-dom";

const values = [
  { icon: "⚖️", title: "Integrity", desc: "Upholding the highest ethical standards, ensuring honesty, transparency, and accountability in all our engagements.", color: "#1A237E" },
  { icon: "🏆", title: "Excellence", desc: "Striving for unparalleled quality in our services, delivering innovative, evidence-based, and impactful solutions that exceed client expectations.", color: "#C9A84C" },
  { icon: "🤝", title: "Collaboration", desc: "Fostering strong partnerships with our clients, stakeholders, and within our team, believing that collective wisdom leads to superior outcomes.", color: "#1A237E" },
  { icon: "💡", title: "Innovation", desc: "Continuously seeking new and better ways to address complex challenges, embracing creativity and forward-thinking approaches.", color: "#C9A84C" },
  { icon: "🌍", title: "Impact", desc: "Dedicated to creating measurable, sustainable, and positive change that genuinely contributes to the well-being and development of Ethiopian communities.", color: "#1A237E" },
  { icon: "🎯", title: "Client-Centricity", desc: "Placing our clients' needs at the forefront, ensuring tailored solutions and exceptional service that drives their success.", color: "#C9A84C" },
  { icon: "🌐", title: "Inclusiveness", desc: "We promote diversity, equity, participation, and mutual respect in all our work.", color: "#1A237E" },
];

const approach = [
  { num: "01", title: "Client-Centric Solutions", desc: "We listen intently to understand your unique challenges and objectives, developing customized strategies that align perfectly with your vision." },
  { num: "02", title: "Evidence-Based & Data-Driven", desc: "Our recommendations are grounded in robust research, current data, and proven methodologies, ensuring practical and effective outcomes." },
  { num: "03", title: "Capacity Building Focus", desc: "Training is at the heart of what we do. We design and deliver impactful programs that empower your teams with the skills, knowledge, and confidence." },
  { num: "04", title: "Holistic Perspective", desc: "Recognizing the interconnectedness of health, education, and agriculture, we adopt a comprehensive approach that considers cross-sectoral synergies." },
  { num: "05", title: "Sustainable Impact", desc: "We are committed to fostering solutions that are not only effective in the short term but also self-sustaining, leaving a lasting legacy of positive change." },
  { num: "06", title: "Co-Creation over Imposition", desc: "We work alongside client teams to co-author workflows, standard operating procedures, and curriculums for natural internal integration." },
];

export default function About() {
  const sectionRefs = useRef([]);

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

  return (
    <div className="bg-theme min-h-screen">

      {/* ── HERO ── */}
<section className="relative min-h-screen overflow-hidden flex items-center pt-[78px] md:pt-[100px]">
  {/* Background glow */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-0 right-0 md:w-[500px] md:h-[500px] rounded-full opacity-20 animate-pulse"
      style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 animate-pulse"
      style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
      style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
    <div className="absolute top-20 left-20 animate-float">
      <div className="md:w-16 md:h-16 rounded-full blur-xl" style={{ background: "var(--color-secondary)", opacity: 0.1 }} />
    </div>
    <div className="absolute bottom-20 right-10 animate-float-delayed">
      <div className="w-24 h-24 rounded-full blur-xl" style={{ background: "var(--color-secondary)", opacity: 0.05 }} />
    </div>
    <div className="absolute top-1/4 right-[15%] animate-float-delayed hidden lg:block">
      <div className="w-12 h-12 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}></div>
    </div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
    {/* LEFT */}
    <div className="about-hero-text text-center md:text-left">
      <h1 className="text-[clamp(30px,5vw,72px)] font-extrabold leading-[1.05] mb-4 md:mb-6">
        <span className="text-primary">Wisdom,</span><br />
        <span className="text-secondary">Innovation &amp;</span>
        <span className="text-primary"> Impact</span>
      </h1>
      <p className="text-muted text-sm md:text-base leading-relaxed max-w-[460px] mx-auto md:mx-0">
        Transforming Ethiopia's vital sectors through evidence-based consultancy,
        research, and capacity building.
      </p>
    </div>

    {/* RIGHT — logo */}
    <div className="relative flex items-center justify-center mx-auto md:mx-0">
      <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border-2 border-secondary flex items-center justify-center">
        <img src={logo} alt="Tibeb Logo" className="w-3/4 h-3/4 object-contain" />
      </div>
    </div>
  </div>

  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[var(--color-bg)] to-transparent pointer-events-none" />
</section>

      {/* ── WHO WE ARE ── */}
      <section className="md:py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={addRef} className="fade-up grid md:grid-cols-2 gap-8 items-center">

            {/* Left — Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-card ring-1 ring-[rgba(201,168,76,0.2)]">
              <img
                src={img1}
                alt="Tibeb consulting team at work"
                className="w-full md:h-[330px] object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
              {/* dark-mode safe gradient — uses CSS var not white */}
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[var(--color-bg)] to-transparent pointer-events-none" />
              {/* Fallback */}
              <div className="hidden h-[330px] bg-gradient-to-br from-primary via-[#283593] to-primary items-center justify-center flex-col gap-4 text-white">
                <div className="font-bold text-xl">Tibeb Consulting</div>
                <div className="text-[13px] text-secondary tracking-[2px]">WISDOM · INNOVATION · IMPACT</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[rgba(26,35,126,0.4)] to-transparent" />
              <div className="absolute bottom-4 left-4 bg-white/95 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-sm">
                <div className="w-9 h-9 rounded-full border-2 border-secondary flex items-center justify-center bg-white overflow-hidden">
                  <img src={logo} alt="Tibeb" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="font-extrabold text-[13px] text-primary">Tibeb</div>
                  <div className="text-[9px] text-secondary tracking-[1.5px] font-semibold">WISDOM · INNOVATION · IMPACT</div>
                </div>
              </div>
            </div>

            {/* Right — Text */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 w-8 bg-secondary rounded" />
                <span className="text-xl font-bold text-secondary tracking-[2px]">WHO WE ARE</span>
                <div className="h-0.5 w-8 bg-secondary rounded" />
              </div>
              <h2 className="text-2xl font-extrabold text-primary mb-3 leading-snug">
                The Name <span className="text-secondary">"Tibeb"</span> Means Wisdom and Knowledge
              </h2>
              <p className="text-theme-light leading-relaxed mb-3 text-sm">
                Tibeb Consultancy and Training PLC is a dynamic Ethiopian consulting firm established
                in May 2024 and legally registered under the Commercial Registration and Business
                License Proclamation No. 980/2016. Headquartered in Addis Ababa, Ethiopia.
              </p>
              <p className="text-theme-light leading-relaxed mb-3 text-sm">
                <span className="text-secondary font-semibold">Tibeb </span>combines strong local
                expertise with international best practices to support government institutions,
                development partners, NGOs, private sector entities, and community-based organizations.
              </p>
              <p className="text-theme-light leading-relaxed text-sm">
                Through tailored interventions, we help clients improve performance, strengthen
                systems, build capacity, and achieve their strategic objectives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 bg-[var(--color-bg-light)]">
        <div className="max-w-6xl mx-auto">
          <div ref={addRef} className="fade-up">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-0.5 w-16 bg-secondary rounded" />
              <span className="text-xs font-bold text-secondary tracking-[2px]">OUR NUMBERS</span>
              <div className="h-0.5 w-16 bg-secondary rounded" />
            </div>
            <h2 className="text-3xl font-extrabold text-primary mb-2 text-center">
              Company <span className="text-secondary">Statistics</span>
            </h2>
            <p className="text-theme-light mb-8 text-center text-sm max-w-xl mx-auto">
              Key metrics that define our journey and impact in Ethiopia's development sector.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { num: "01", val: "15+", label: "Founding Members", icon: "👥", color: "#1A237E" },
                { num: "02", val: "37+", label: "Senior Consultants", icon: "🎓", color: "#C9A84C" },
                { num: "03", val: "2024", label: "Established", icon: "📍", color: "#1A237E" },
                { num: "04", val: "5+", label: "Sectors Served", icon: "🌍", color: "#C9A84C" },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-theme rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                  <div className="absolute top-3 right-3 text-xs font-bold opacity-10 group-hover:opacity-20 transition-colors" style={{ color: s.color }}>{s.num}</div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3" style={{ background: s.color + "15" }}>{s.icon}</div>
                  <div className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-sm text-theme-light font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      <section className="py-16 px-6 bg-theme">
        <div className="max-w-6xl mx-auto">
          <div ref={addRef} className="fade-up text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-0.5 w-8 bg-secondary rounded" />
              <span className="text-xs font-bold text-secondary tracking-[2px]">OUR DIRECTION</span>
              <div className="h-0.5 w-8 bg-secondary rounded" />
            </div>
            <h2 className="text-3xl font-extrabold text-primary">Vision & Mission</h2>
          </div>

          <div ref={addRef} className="fade-up grid md:grid-cols-2 gap-8">
            {/* Vision — navy card */}
            <div className="relative bg-primary rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-5">🔭</div>
              <div className="text-secondary text-xs font-bold tracking-[2px] mb-3">OUR VISION</div>
              <p className="text-white text-base font-semibold leading-relaxed">
                To be the premier Ethiopian consultancy firm, recognized for its transformative
                impact and unparalleled expertise for organizational optimization in the emerging
                economy — transforming structural performance and cultivating resilient,
                high-capability talent.
              </p>
            </div>

            {/* Mission — white card with navy border */}
            <div className="relative bg-card border-2 rounded-3xl p-8 overflow-hidden" style={{ borderColor: "#1A237E" }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 pointer-events-none"
                style={{ background: "radial-gradient(circle, #1A237E, transparent)" }} />
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5" style={{ background: "#1A237E15" }}>🎯</div>
              <div className="text-primary text-xs font-bold tracking-[2px] mb-3">OUR MISSION</div>
              <p className="text-theme-light text-base font-semibold leading-relaxed">
                To empower organizations and individuals to deliver elite diagnostic advisory,
                rigorous capacity building programs, and responsive data analytics systems that
                empower modern institutions to execute complex mandates with absolute precision.
              </p>
            </div>
          </div>
        </div>
      </section>

{/* ── CORE VALUES ── */}
<section className="py-20 px-6 bg-[var(--color-bg-light)] relative overflow-hidden">
  <div className="max-w-7xl mx-auto relative z-10 w-full">
    <div ref={addRef} className="fade-up text-center mb-12">
      <div className="inline-flex items-center gap-3 bg-secondary/10 px-6 py-2 rounded-full mb-4 border border-secondary/20">
        <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
        <span className="text-xs font-bold text-secondary tracking-[2px]">WHAT GUIDES US</span>
      </div>
      <h2 className="text-4xl font-extrabold text-primary mb-3">Our <span className="text-secondary">Core</span> Values</h2>
      <p className="text-theme-light max-w-xl mx-auto text-sm">The foundation of everything we do at Tibeb</p>
    </div>

    <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-5xl mx-auto">
      {/* Left column */}
      <div className="space-y-3 md:space-y-4">
        {values.filter((_, i) => i % 2 === 0).map((v, idx) => {
          const originalIndex = idx * 2;
          return (
            <div key={originalIndex} className="group relative bg-card rounded-2xl p-3 md:p-6 border border-theme hover:scale-[1.02] hover:shadow-xl hover:border-secondary/50 transition-all duration-400 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at center, ${v.color}12, transparent 70%)` }} />
              <div className="flex items-start gap-2 md:gap-4 relative z-10">
                <div className="text-3xl md:text-5xl font-black leading-none opacity-10 group-hover:opacity-20 transition-opacity flex-shrink-0" style={{ color: v.color }}>
                  {String(originalIndex + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-xl mb-2 md:mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" style={{ background: v.color + "15" }}>{v.icon}</div>
                  <h3 className="font-bold text-xs md:text-base mb-1 group-hover:text-secondary transition-colors" style={{ color: v.color }}>{v.title}</h3>
                  
                  {/* Description: Always visible on desktop, hidden on mobile with toggle */}
                  <div className="hidden md:block">
                    <p className="text-theme-light text-xs leading-relaxed">{v.desc}</p>
                  </div>
                  
                  {/* Mobile: description hidden with "Learn More" button */}
                  <div className="md:hidden">
                    <div className="overflow-hidden max-h-0 transition-all duration-500 ease-in-out" id={`desc-${originalIndex}`}>
                      <p className="text-theme-light text-[10px] leading-relaxed mt-1">{v.desc}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const desc = document.getElementById(`desc-${originalIndex}`);
                        const btn = e.currentTarget;
                        if (desc) {
                          if (desc.style.maxHeight === '100px') {
                            desc.style.maxHeight = '0px';
                            btn.textContent = 'Learn More →';
                          } else {
                            desc.style.maxHeight = '100px';
                            btn.textContent = 'Show Less ↑';
                          }
                        }
                      }}
                      className="text-[10px] font-medium mt-1 hover:underline transition-all"
                      style={{ color: v.color }}
                    >
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Right column */}
      <div className="space-y-3 md:space-y-4 mt-[30px]">
        {values.filter((_, i) => i % 2 !== 0).map((v, idx) => {
          const originalIndex = idx * 2 + 1;
          return (
            <div key={originalIndex} className="group relative bg-card rounded-2xl p-3 md:p-6 border border-theme hover:scale-[1.02] hover:shadow-xl hover:border-secondary/50 transition-all duration-400 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at center, ${v.color}12, transparent 70%)` }} />
              <div className="flex items-start gap-2 md:gap-4 relative z-10">
                <div className="text-3xl md:text-5xl font-black leading-none opacity-10 group-hover:opacity-20 transition-opacity flex-shrink-0" style={{ color: v.color }}>
                  {String(originalIndex + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-base md:text-xl mb-2 md:mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" style={{ background: v.color + "15" }}>{v.icon}</div>
                  <h3 className="font-bold text-xs md:text-base mb-1 group-hover:text-secondary transition-colors" style={{ color: v.color }}>{v.title}</h3>
                  
                  {/* Description: Always visible on desktop */}
                  <div className="hidden md:block">
                    <p className="text-theme-light text-xs leading-relaxed">{v.desc}</p>
                  </div>
                  
                  {/* Mobile: description hidden with "Learn More" button */}
                  <div className="md:hidden">
                    <div className="overflow-hidden max-h-0 transition-all duration-500 ease-in-out" id={`desc-${originalIndex}`}>
                      <p className="text-theme-light text-[10px] leading-relaxed mt-1">{v.desc}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const desc = document.getElementById(`desc-${originalIndex}`);
                        const btn = e.currentTarget;
                        if (desc) {
                          if (desc.style.maxHeight === '100px') {
                            desc.style.maxHeight = '0px';
                            btn.textContent = 'Learn More →';
                          } else {
                            desc.style.maxHeight = '100px';
                            btn.textContent = 'Show Less ↑';
                          }
                        }
                      }}
                      className="text-[10px] font-medium mt-1 hover:underline transition-all"
                      style={{ color: v.color }}
                    >
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Hover indicator - only visible on mobile */}
    <div className="mt-10 text-center md:hidden">
      <div className="inline-flex items-center gap-2 text-xs text-theme-light">
        <span className="w-6 h-px bg-secondary" />
        <span>👆 Tap "Learn More" to read full description</span>
        <span className="w-6 h-px bg-secondary" />
      </div>
    </div>
  </div>
</section>

{/* ── CORE APPROACH ── */}
<section className="py-12 px-4 bg-theme relative overflow-hidden">
  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

  <div className="max-w-4xl mx-auto relative z-10">
    <div ref={addRef} className="fade-up text-center mb-4">
      <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-1 rounded-full mb-3 border border-secondary/20">
        <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
        <span className="text-[10px] font-bold text-secondary tracking-[2px]">HOW WE WORK</span>
      </div>
      <h2 className="text-2xl font-extrabold text-primary">Our Core <span className="text-secondary">Approach</span></h2>
    </div>

    {/* Desktop: Orbiting cards */}
    <div className="hidden lg:block relative" style={{ height: "480px" }}>
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-20 h-20 rounded-full border-2 border-secondary flex items-center justify-center bg-card shadow-md">
          <img src={logo} alt="Tibeb Logo" className="w-3/4 h-3/4 object-contain" />
        </div>
        <p className="text-center text-[6px] text-secondary tracking-[2px] mt-1 font-semibold">WISDOM IN ACTION</p>
      </div>

      {/* Orbiting cards */}
      {approach.map((a, i) => {
        const isEven = i % 2 === 0;
        const color = isEven ? "#1A237E" : "#C9A84C";
        const icons = ["🎯", "📊", "📚", "🧠", "🌱", "🤝"];
        const radius = 180;
        const angle = (i / approach.length) * 2 * Math.PI - Math.PI / 2;
        const startX = Math.cos(angle) * radius;
        const startY = Math.sin(angle) * radius;

        return (
          <div 
            key={i} 
            className="orbit-card"
            style={{ 
              '--start-x': `${startX}px`,
              '--start-y': `${startY}px`,
              animationDelay: `${i * 0.3}s`
            }}
            onMouseEnter={() => {
              document.querySelectorAll('.orbit-card').forEach(c => c.style.animationPlayState = 'paused');
            }}
            onMouseLeave={() => {
              document.querySelectorAll('.orbit-card').forEach(c => c.style.animationPlayState = 'running');
            }}
          >
            <div className="group w-36 bg-card rounded-xl border border-theme p-3 hover:border-secondary/50 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden hover:z-30">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                style={{ background: `radial-gradient(circle at center, ${color}8, transparent 70%)` }} />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xl font-black opacity-10 group-hover:opacity-20 transition-opacity" style={{ color }}>{a.num}</div>
                  <div className="w-1.5 h-1.5 rounded-full opacity-30 group-hover:opacity-100 transition-opacity" style={{ background: color }} />
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mx-auto mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ background: color + "12" }}>{icons[i]}</div>
                <h3 className="text-[10px] font-bold text-center group-hover:text-secondary transition-colors leading-tight" style={{ color }}>{a.title}</h3>
                <div className="overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-300 mt-1">
                  <p className="text-theme-light text-[8px] text-center leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">{a.desc}</p>
                </div>
                <div className="flex justify-center gap-1 mt-2">
                  <div className="h-1 w-1 rounded-full group-hover:w-3 transition-all duration-300" style={{ background: color }} />
                  <div className="h-1 w-1 rounded-full group-hover:w-3 transition-all duration-300 delay-75" style={{ background: color, opacity: 0.4 }} />
                  <div className="h-1 w-1 rounded-full group-hover:w-3 transition-all duration-300 delay-150" style={{ background: color, opacity: 0.2 }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Mobile: Grid layout with hover hide/show */}
    <div className="lg:hidden grid grid-cols-2 gap-2">
      {approach.map((a, i) => {
        const isEven = i % 2 === 0;
        const color = isEven ? "#1A237E" : "#C9A84C";
        const icons = ["🎯", "📊", "📚", "🧠", "🌱", "🤝"];
        return (
          <div 
            key={i} 
            className="group relative bg-card border border-theme rounded-xl p-3 transition-all duration-300 hover:border-secondary hover:shadow-md hover:scale-105 hover:z-10"
            style={{ 
              transition: 'all 0.3s ease',
            }}
          >
            {/* Other cards hide on hover */}
            <div className="relative z-10">
              <div className="text-2xl font-black opacity-10 mb-1" style={{ color }}>{a.num}</div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-1" style={{ background: color + "12" }}>{icons[i]}</div>
              <h3 className="font-bold text-xs mb-1 group-hover:text-secondary transition-colors" style={{ color }}>{a.title}</h3>
              <p className="text-theme-light text-[10px] leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">{a.desc}</p>
            </div>
          </div>
        );
      })}
    </div>

    <div className="mt-6 text-center hidden lg:block">
      <div className="inline-flex items-center gap-2 text-[10px] text-theme-light">
        <span className="w-4 h-px bg-secondary" />
        <span>🖱 Hover any card to pause</span>
        <span className="w-4 h-px bg-secondary" />
      </div>
    </div>
    
    {/* Mobile hint */}
    <div className="mt-4 text-center lg:hidden">
      <div className="inline-flex items-center gap-2 text-[10px] text-theme-light">
        <span className="w-4 h-px bg-secondary" />
        <span>👆 Tap to expand</span>
        <span className="w-4 h-px bg-secondary" />
      </div>
    </div>
  </div>

  {/* Mobile hover effect - hide other cards */}
  <style>{`
    /* Desktop orbit */
    .orbit-card {
      position: absolute;
      top: 50%;
      left: 50%;
      animation: orbit 30s ease-in-out infinite;
      animation-delay: var(--delay, 0s);
      animation-play-state: running;
      will-change: transform;
    }
    
    @keyframes orbit {
      0% { transform: translate(-50%, -50%) translate(var(--start-x), var(--start-y)); animation-timing-function: ease-in-out; }
      16.66% { transform: translate(-50%, -50%) translate(var(--start-y), calc(-1 * var(--start-x))); animation-timing-function: ease-in-out; }
      33.33% { transform: translate(-50%, -50%) translate(calc(-1 * var(--start-x)), calc(-1 * var(--start-y))); animation-timing-function: ease-in-out; }
      50% { transform: translate(-50%, -50%) translate(calc(-1 * var(--start-y)), var(--start-x)); animation-timing-function: ease-in-out; }
      66.66% { transform: translate(-50%, -50%) translate(var(--start-x), var(--start-y)); animation-timing-function: ease-in-out; }
      100% { transform: translate(-50%, -50%) translate(var(--start-x), var(--start-y)); animation-timing-function: ease-in-out; }
    }

    /* Mobile: Hide other cards when one is hovered */
    .lg\\:hidden .group:hover ~ .group {
      opacity: 0.3;
      transform: scale(0.95);
      filter: blur(2px);
      pointer-events: none;
    }
    
    .lg\\:hidden .group {
      transition: all 0.3s ease;
    }
    
    .lg\\:hidden .group:hover {
      opacity: 1 !important;
      transform: scale(1.05) !important;
      filter: blur(0) !important;
      pointer-events: auto !important;
      z-index: 10;
    }
  `}</style>
</section>

      {/* ── WHY CHOOSE TIBEB ── */}
      <section className="py-16 px-6 bg-[var(--color-bg-light)]">
        <div className="max-w-5xl mx-auto">
          <div ref={addRef} className="fade-up text-center mb-10">
            <div className="inline-flex items-center gap-3 bg-secondary/10 px-5 py-1.5 rounded-full mb-3 border border-secondary/20">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-secondary tracking-[2px]">WHY TIBEB</span>
            </div>
            <h2 className="text-3xl font-extrabold text-primary mb-2">Why Choose <span className="text-secondary">Tibeb?</span></h2>
            <p className="text-theme-light text-sm max-w-xl mx-auto">Local expertise meets international best practices.</p>
          </div>

          <div ref={addRef} className="fade-up grid md:grid-cols-2 gap-4">
            {[
              { icon: "🧠", title: "Deep Sectoral Mastery", desc: "Experts in Health, Education & Agriculture with local & international experience." },
              { icon: "🇪🇹", title: "Ethiopian Contextual Understanding", desc: "Intimate knowledge of local socio-cultural nuances, regulatory frameworks & market dynamics." },
              { icon: "✨", title: "Innovation & Creativity", desc: "Fresh perspectives and cutting-edge solutions to complex challenges." },
              { icon: "📊", title: "Commitment to Excellence", desc: "Highest professional standards ensuring integrity, quality & measurable results." },
            ].map((w, i) => {
              const isEven = i % 2 === 0;
              const color = isEven ? "#1A237E" : "#C9A84C";
              return (
                <div key={i} className="group relative bg-card rounded-xl overflow-hidden border border-theme hover:border-secondary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-0.5 w-full group-hover:h-1 transition-all duration-300" style={{ background: color }} />
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" style={{ background: color + "12" }}>{w.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base group-hover:text-secondary transition-colors" style={{ color }}>{w.title}</h3>
                          <span className="text-xs font-bold opacity-20 group-hover:opacity-40 transition-opacity ml-2" style={{ color }}>{String(i + 1).padStart(2, "0")}</span>
                        </div>
                        <p className="text-theme-light text-sm leading-relaxed mt-1">{w.desc}</p>
                        <div className="flex gap-1 mt-2">
                          <div className="h-0.5 w-3 rounded-full group-hover:w-6 transition-all duration-300" style={{ background: color }} />
                          <div className="h-0.5 w-2 rounded-full group-hover:w-4 transition-all duration-300 delay-75" style={{ background: color, opacity: 0.4 }} />
                          <div className="h-0.5 w-1 rounded-full group-hover:w-2 transition-all duration-300 delay-150" style={{ background: color, opacity: 0.2 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${color}06, transparent 70%)` }} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={addRef} className="fade-up py-16 px-6">
        <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Ready to Work with <span className="text-secondary">Tibeb?</span>
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto text-sm">
            Discover how Tibeb Training and Consultancy PLC can empower your organization
            and contribute to a prosperous future.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all shadow-glow">
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
        .about-hero-text { opacity: 0; transform: translateY(24px); animation: heroIn 0.9s ease forwards 0.2s; }
        @keyframes heroIn { to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
