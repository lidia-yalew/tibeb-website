import React, { useState, useEffect } from 'react';
import Lidimg from "../assets/IMG/lidia.jpg";
import Developer from './Developer';
import logo from "../assets/Img/Logo.png"

function Footer() {
  const [isDark, setIsDark] = useState(false);
  const [showDeveloper, setShowDeveloper] = useState(false);

  const openPortfolio = () => {
    window.open('https://lidia-portfolio.vercel.app/', '_blank');
  };

  const year = new Date().getFullYear();

  // Check and apply theme on mount
  useEffect(() => {
    // Check if dark mode is enabled via data-theme attribute
    const theme = document.documentElement.getAttribute('data-theme');
    setIsDark(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Set the data-theme attribute (this is what your global theme system uses)
    htmlElement.setAttribute('data-theme', newTheme);
    setIsDark(newTheme === 'dark');
    
    // Store preference in localStorage
    localStorage.setItem('theme', newTheme);
  };

  return (
    <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Main footer content ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-gray-200/60 dark:border-gray-700/60">

          {/* Company brand - 5 columns */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                <img src={logo} alt="" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-primary dark:text-white leading-tight">
                  Tibeb Consultancy
                </h3>
                <p className="text-[10px] font-semibold text-secondary tracking-wider">WISDOM · INNOVATION · IMPACT</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              Advancing sustainable development through consultancy, research, 
              training, and institutional strengthening across Ethiopia and beyond.
            </p>
            
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              <a className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              
              <a  className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a  className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.825.58C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links - 3 columns */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold tracking-[2px] text-secondary uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></span>
                  Our Services
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></span>
                  Portfolio
                </a>
              </li>
              <li>
                <a href="/testimonials" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></span>
                  Testimonials
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-secondary transition-all duration-300 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-all"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - 4 columns */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-bold tracking-[2px] text-secondary uppercase mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-lg flex-shrink-0">📍</span>
                <span>Arada Sub City, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-lg flex-shrink-0">✉️</span>
                <a href="mailto:info@tibebconsulting.com" className="hover:text-primary dark:hover:text-secondary transition-colors">
                  tibebconsultancy@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-lg flex-shrink-0">📞</span>
                <a href="tel:+251XXX" className="hover:text-primary dark:hover:text-secondary transition-colors">
                  +251  950020373
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5">
          <div className="flex items-center gap-4">
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              © {year} Tibeb Consultancy &amp; Training PLC. All rights reserved.
            </p>
          </div>

          {/* ── Developer credit with toggle ── */}
          <div className="flex items-center gap-3">
            {!showDeveloper ? (
              <button
                onClick={() => setShowDeveloper(true)}
                className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-secondary transition-colors"
              >
                Show Developer →
              </button>
            ) : (
              <div className="flex items-center gap-3 animate-fade-in">
                <button
                  onClick={openPortfolio}
                  className="flex items-center gap-2 group cursor-pointer"
                  title="Visit developer's portfolio"
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all duration-300 flex-shrink-0 shadow-lg shadow-primary/20">
                    <img src={Lidimg} alt="Lidia Yalew" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Developed by{" "}
                    <span className="text-primary dark:text-secondary font-medium group-hover:underline">
                      Lidia Yalew
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => setShowDeveloper(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Developer />
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease forwards;
        }
      `}</style>
    </footer>
  );
}

export default Footer;