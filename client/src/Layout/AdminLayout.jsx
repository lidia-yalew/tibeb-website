import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import logo from "../assets/Img/logo.png"

const navItems = [
  { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { path: "/admin/team", icon: "👥", label: "Manage Team" },
  { path: "/admin/portfolio", icon: "📋", label: "Portfolio" },
  { path: "/admin/testimonials", icon: "💬", label: "Testimonials" },
  { path: "/admin/messages", icon: "📬", label: "Messages" },
];

const profileMenuItems = [
  { path: "/admin/profile", icon: "👤", label: "My Profile" },
  { path: "/admin/profile/change-password", icon: "🔒", label: "Change Password" },
  { path: "/admin/settings", icon: "⚙️", label: "Settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode = savedTheme === "dark";
    setIsDark(isDarkMode);
    document.documentElement.setAttribute("data-theme", savedTheme || "light");
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const currentPage = navItems.find((n) => n.path === location.pathname)?.label || 
                      profileMenuItems.find((n) => location.pathname.startsWith(n.path))?.label || 
                      "Admin";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleProfileToggle = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-theme relative">
      {/* ── Mobile overlay ── */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed md:sticky top-0 left-0 flex flex-col transition-all duration-300 flex-shrink-0 h-screen overflow-y-auto z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          width: sidebarOpen ? "280px" : "72px",
          minHeight: "100vh",
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 md:py-6 border-b" style={{ borderColor: "var(--border-color)" }}>
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 bg-secondary/10 border-2 border-secondary/20">
            <img src={logo} alt="Tibeb" className="w-7 h-7 md:w-10 md:h-10 object-contain" />
          </div>
          {sidebarOpen && (
            <div className="hidden md:block">
              <div className="font-extrabold text-sm md:text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>Tibeb Admin</div>
              <div className="text-[8px] md:text-[9px] tracking-[2px] font-medium" style={{ color: "var(--text-muted)" }}>CONTENT MANAGER</div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 md:py-6 px-2 md:px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-2.5 rounded-xl md:rounded-2xl transition-all duration-200 group relative ${
                  isActive ? 'shadow-md' : ''
                }`}
                style={{
                  background: isActive ? "var(--nav-active-bg)" : "transparent",
                  color: isActive ? "var(--nav-active-text)" : "var(--text-secondary)",
                  boxShadow: isActive ? "0 4px 15px rgba(26, 35, 126, 0.10)" : "none",
                }}
              >
                <span className="text-lg md:text-xl flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-xs md:text-sm font-medium transition-colors truncate">
                    {item.label}
                  </span>
                )}
                {isActive && sidebarOpen && (
                  <div className="absolute right-2 md:right-3 w-1.5 h-6 md:h-8 rounded-full" style={{ background: "var(--gradient-primary)" }} />
                )}
                {isActive && !sidebarOpen && (
                  <div className="absolute right-0 w-1.5 h-6 md:h-8 rounded-l-full" style={{ background: "var(--gradient-primary)" }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom — logout */}
        <div className="px-2 md:px-3 py-3 border-t" style={{ borderColor: "var(--border-color)" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl transition-all duration-200 group hover:bg-red-50/10"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="text-lg md:text-xl flex-shrink-0">🚪</span>
            {sidebarOpen && (
              <span className="text-xs md:text-sm font-medium group-hover:text-red-500 transition-colors">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 w-full">

        {/* Top bar */}
        <header className="flex items-center gap-2 md:gap-4 px-4 md:px-8 py-3 md:py-4 border-b sticky top-0 z-30 backdrop-blur-xl"
          style={{ 
            background: "var(--header-bg)",
            borderColor: "var(--border-color)",
          }}>
          
          {/* Sidebar toggle - hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
            style={{ 
              background: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="font-extrabold text-base md:text-xl tracking-tight truncate" style={{ color: "var(--text-primary)" }}>
              {currentPage}
            </h1>
            <p className="text-[10px] md:text-xs truncate" style={{ color: "var(--text-muted)" }}>
              Tibeb Consultancy & Training PLC
            </p>
          </div>

          {/* Right side — theme toggle + profile */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
              style={{ 
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)"
              }}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v1M12 20v1M3 12H2M22 12h-1M5.6 5.6l.7.7M17.7 17.7l.7.7M5.6 18.4l.7-.7M17.7 6.3l.7-.7" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={handleProfileToggle}
                className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-xl md:rounded-2xl transition-all hover:scale-[1.02]"
                style={{ 
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-color)"
                }}
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-white text-xs md:text-sm flex-shrink-0"
                  style={{ background: "var(--gradient-primary)" }}>
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs md:text-sm font-semibold truncate max-w-[80px]" style={{ color: "var(--text-primary)" }}>
                    {user?.name || "Admin"}
                  </div>
                  <div className="text-[8px] md:text-[10px] font-medium tracking-wide" style={{ color: "var(--accent)" }}>
                    SUPER ADMIN
                  </div>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`hidden sm:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>
                  <path d="M2 4l4 4 4-4" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 md:w-72 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-slide-down"
                  style={{ 
                    background: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                  }}>
                  {/* User info */}
                  <div className="px-4 md:px-5 py-4 md:py-5 border-b" style={{ borderColor: "var(--border-color)" }}>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold text-white text-lg md:text-xl flex-shrink-0"
                        style={{ background: "var(--gradient-primary)" }}>
                        {user?.name?.charAt(0) || "A"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm md:text-base truncate" style={{ color: "var(--text-primary)" }}>
                          {user?.name || "Admin User"}
                        </div>
                        <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                          {user?.email || "admin@tibeb.com"}
                        </div>
                        <div className="text-[10px] font-semibold tracking-wide mt-1" style={{ color: "var(--accent)" }}>
                          SUPER ADMIN
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile menu items */}
                  <div className="py-2">
                    {profileMenuItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 text-sm transition-colors"
                          style={{ 
                            color: isActive ? "var(--accent)" : "var(--text-secondary)",
                            background: isActive ? "var(--nav-active-bg)" : "transparent",
                          }}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Logout */}
                  <div className="border-t px-3 md:px-4 py-2" style={{ borderColor: "var(--border-color)" }}>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-colors hover:bg-red-50/10"
                      style={{ color: "#DC2626" }}
                    >
                      <span className="text-lg">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto" style={{ background: "var(--main-bg)" }}>
          <Outlet />
        </main>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease forwards;
        }

        :root {
          --color-primary: #1A237E;
          --color-secondary: #C9A84C;
          --accent: #C9A84C;
          
          --gradient-primary: linear-gradient(135deg, #1A237E 0%, #283593 100%);
          
          --sidebar-bg: #ffffff;
          --main-bg: #f8f9fc;
          --header-bg: rgba(255, 255, 255, 0.8);
          --card-bg: #ffffff;
          --nav-active-bg: rgba(26, 35, 126, 0.08);
          --nav-active-text: #1A237E;
          
          --text-primary: #1a1a2e;
          --text-secondary: #4a4a6a;
          --text-muted: #8a8aa8;
          
          --border-color: #e8e8f0;
        }

        [data-theme="dark"] {
          --color-primary: #4a5fc1;
          --color-secondary: #C9A84C;
          --accent: #C9A84C;
          
          --gradient-primary: linear-gradient(135deg, #2a2a4a 0%, #1a1a3e 100%);
          
          --sidebar-bg: #1a1a2e;
          --main-bg: #0d0d1a;
          --header-bg: rgba(26, 26, 46, 0.85);
          --card-bg: #1e1e3a;
          --nav-active-bg: rgba(74, 95, 193, 0.15);
          --nav-active-text: #8a9fe0;
          
          --text-primary: #e8e8f0;
          --text-secondary: #b0b0c8;
          --text-muted: #6a6a8a;
          
          --border-color: #2a2a4a;
        }

        .bg-theme { background: var(--main-bg); }
        .bg-card { background: var(--card-bg); }
        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-theme-light { color: var(--text-muted); }
        .border-theme { border-color: var(--border-color); }
        .bg-theme-light { background: var(--nav-active-bg); }
      `}</style>
    </div>
  );
}