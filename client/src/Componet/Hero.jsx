import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import img1 from "../assets/Img/tbimg1.png"
import logo from "../assets/Img/logo.png"


const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "12+", label: "Years Experience" },
  { value: "40+", label: "Expert Consultants" },
  { value: "95%", label: "Client Satisfaction" },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen pt-[50px]  bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-bg-light)] to-[var(--color-bg-warm)] relative overflow-hidden flex flex-col"
    >
      {/* Decorative shapes */}
      <div className="absolute -top-25 -right-25 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(26,35,126,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto  py-12 px-4 flex-1 flex items-center w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* LEFT */}
          <div
            className={`transition-all duration-800 ease-out ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
            }`}
          >
            {/* Headline */}
            <h1 className="text-[36px] font-extrabold leading-[1.15] text-primary mb-3  ">
              Catalyzing{" "}
              <span className="text-secondary block">
                Transformative Growth
              </span>
              in Ethiopia's Vital Sectors
            </h1>

            {/* Divider */}
            <div className="flex items-center gap-3 mt-8 mb-6">
              <div className="h-0.5 w-10 bg-secondary rounded" />
              <span className="text-xs font-bold text-primary tracking-[2px]">
                WISDOM · INNOVATION · IMPACT
              </span>
              <div className="h-0.5 w-10 bg-secondary rounded" />
            </div>

            {/* Description */}
            <p className="text-[15px] text-theme-light leading-relaxed mb-4 max-w-[480px]">
              We empower institutions through consultancy, research, training, innovation
              and sustainable development solutions that create measurable and lasting impact
              across Ethiopia's key development sectors.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap  gap-1 md:gap-2 text-[12px] md:text-[16]">
              <Link
                href="#services"
                className="bg-card text-theme-light px-2 py-3.5 rounded-lg  font-semibold flex items-center gap-2 shadow-glow hover:bg-secondary hover:text-primary hover:-translate-y-0.5 transition-all duration-250 border-secondary border-2"
              >
                Explore Our Services
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#1A237E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="#about"
                className="bg-transparent text-secondary px-7 py-3.5 rounded-lg font-semibold border-2 border-primary flex items-center gap-2 hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all duration-250"
              >
                Learn More About Us
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT - Image */}
          <div
            className={`transition-all duration-1000 ease-out delay-200 ${
              visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[30px] scale-97"
            } relative`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card ring-1 ring-[rgba(201,168,76,0.2)] ">
              <img
                src={img1}
                alt="Tibeb consulting team at work"
                className="w-full h-[330px] object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/90 to-transparent pointer-events-none" />
              {/* Fallback */}
              <div className="hidden h-[400px] bg-gradient-to-br from-primary via-[#283593] to-primary items-center justify-center flex-col gap-4 text-white">
                <div className="w-[90px] h-[90px] rounded-full border-3 border-secondary flex items-center justify-center bg-white/8">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <path d="M10 16 Q16 8 22 16 Q28 24 34 16" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M10 24 Q16 16 22 24 Q28 32 34 24" stroke="var(--color-secondary)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M10 32 Q16 24 22 32 Q28 40 34 32" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="font-bold text-xl">Tibeb Consulting</div>
                <div className="text-[13px] text-secondary tracking-[2px]">WISDOM · INNOVATION · IMPACT</div>
                <div className="text-xs text-white/50 mt-2">Add your hero image to /public/hero-image.jpg</div>
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[rgba(26,35,126,0.4)] to-transparent" />

              {/* Logo badge */}
              <div className="absolute bottom-4 left-4 bg-white/95 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-sm">
                <div className="w-9 h-9 rounded-full border-2 border-secondary flex items-center justify-center bg-white">
                  <img src={logo} alt="" />
                </div>
                <div>
                  <div className="font-extrabold text-[13px] text-primary">Tibeb</div>
                  <div className="text-[9px] text-secondary tracking-[1.5px] font-semibold">
                    WISDOM · INNOVATION · IMPACT
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
          
          </div>
        </div>
      </div>

      {/* Stats Bar */}
<div className="bg-primary mt-auto">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`text-center py-5 px-4 ${
            i < 2 ? "border-b border-white/10 md:border-b-0" : ""
          } ${i < 3 ? "md:border-r border-white/10" : ""} ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          } transition-all duration-600`}
          style={{ transitionDelay: `${0.4 + i * 0.1}s` }}
        >
          <div className="text-[18px] md:text-[28] font-extrabold text-secondary">{s.value}</div>
          <div className="text-[10px] md:text-[13] text-white/70 font-medium mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  </div>
</div>

{/* DECORATIVE WAVY LINE DIVIDER - PRIMARY + SECONDARY */}
<div className="relative overflow-hidden bg-primary">
  <svg
    viewBox="0 0 1440 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-[60px] md:h-[80px]"
    preserveAspectRatio="none"
  >
    {/* Main wave - Primary color (same as background) */}
    <path
      d="M0 60 C360 120 720 0 1080 60 C1260 90 1380 70 1440 60 L1440 120 L0 120 L0 60Z"
      fill="var(--color-bg)"
    />
    
    {/* Secondary/Gold accent wave line */}
    <path
      d="M0 60 C360 120 720 0 1080 60 C1260 90 1380 70 1440 60"
      stroke="var(--color-secondary)"
      strokeWidth="3"
      fill="none"
      opacity="0.8"
    />
    
    {/* Second subtle gold line */}
    <path
      d="M0 65 C360 125 720 5 1080 65 C1260 95 1380 75 1440 65"
      stroke="var(--color-secondary)"
      strokeWidth="1.5"
      fill="none"
      opacity="0.4"
    />
  </svg>
</div>
    </section>
  );
}