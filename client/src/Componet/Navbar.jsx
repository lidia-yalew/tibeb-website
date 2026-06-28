import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../assets/Img/logo.png"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Team", href: "/team" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin" }, // ✅ ADDED ADMIN HERE
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(26,35,126,0.10)]"
            : "bg-white border-b border-gray-100"
        }`}
        style={{
          background: theme === "dark"
            ? scrolled ? "rgba(17,24,39,0.97)" : "#111827"
            : scrolled ? "rgba(255,255,255,0.97)" : "#ffffff",
          borderColor: theme === "dark" ? "#374151" : "#f3f4f6",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center h-[72px] gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center bg-white">
              <img src={logo} alt="" />
            </div>
            <div>
              <div className="font-extrabold text-xl text-primary tracking-wide">
                T<span className="text-secondary">i</span>beb
              </div>
              <div className="text-[9px] text-secondary tracking-[2px] font-semibold">
                CONSULTING
              </div>
            </div>
          </Link>

 {/* Desktop Nav */}
<div className="hidden lg:flex items-center gap-3 flex-1 justify-center">
  {navLinks.map((link) => {
    const isActive = location.pathname === link.href;
    const isAdmin = link.label === "Admin";
    
    return (
      <Link
        key={link.label}
        to={link.href}
        className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
          isAdmin 
            ? `border-2 border-secondary hover:bg-secondary hover:text-white ${
                isActive ? 'bg-secondary text-white' : 'text-secondary'
              }`
            : `hover:bg-[#EEF0FA] hover:text-secondary ${
                isActive ? 'bg-[#EEF0FA] text-secondary' : 'text-primary'
              }`
        }`}
        style={{
          color: isAdmin 
            ? (isActive ? '#fff' : '#C9A84C')
            : (isActive ? 'var(--color-secondary)' : 'var(--color-primary)'),
        }}
      >
        {link.label}
        {/* Active dot indicator */}
        {isActive && !isAdmin && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
        )}
      </Link>
    );
  })}
</div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-105"
              style={{
                background: theme === "dark" ? "#1F2937" : "#EEF0FA",
                borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
              }}
            >
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="#C9A84C" strokeWidth="2"/>
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke="#1A237E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            {/* Hamburger */}
            <button
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-0.5 bg-primary rounded transition-all" style={{ background: "var(--color-primary)" }} />
              <div className="w-6 h-0.5 bg-primary rounded transition-all" style={{ background: "var(--color-primary)" }} />
              <div className="w-6 h-0.5 bg-primary rounded transition-all" style={{ background: "var(--color-primary)" }} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t px-6 py-4"
            style={{
              background: theme === "dark" ? "#111827" : "#ffffff",
              borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm font-medium border-b ${
                  link.label === "Admin" 
                    ? "text-secondary font-bold" 
                    : "text-primary"
                }`}
                style={{
                  color: link.label === "Admin" ? "#C9A84C" : "var(--color-primary)",
                  borderColor: theme === "dark" ? "#374151" : "#f3f4f6",
                }}
              >
                {link.label} {link.label === "Admin" && "🔑"}
              </Link>
            ))}
            <div className="flex items-center justify-between mt-4">
              <Link
                to="/contact"
                className="flex-1 bg-primary text-white text-center py-3 rounded-lg font-semibold mr-3"
              >
                Get in Touch →
              </Link>
              <button
                onClick={toggleTheme}
                className="w-12 h-12 rounded-full flex items-center justify-center border"
                style={{
                  background: theme === "dark" ? "#1F2937" : "#EEF0FA",
                  borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
                }}
              >
                {theme === "dark" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" stroke="#C9A84C" strokeWidth="2"/>
                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke="#1A237E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </nav>
      
      {/* IMPORTANT: This is where page content renders */}
      <main className="pt-[2px] min-h-screen">
        <Outlet />
      </main>
    </>
  );
}