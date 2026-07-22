import React from 'react';
import Lidimg from "../assets/IMG/lidia.jpg";

/**
 * Standalone "meet the developer" component.
 * Use this on an About/Credits page, or anywhere you want a
 * more playful, attention-grabbing developer shoutout
 * (separate from the main site Footer, which stays minimal).
 */
function Developer() {
  const openPortfolio = () => {
    window.open('https://lidia-portfolio.vercel.app/', '_blank');
  };

  return (
    <div className="bg-theme  border border-gray-200 rounded-2xl p-1 max-w-sm mx-auto">
      <div className="flex flex-col items-center justify-center gap-3 text-center">

        {/* Profile image */}
        <button onClick={openPortfolio} className="cursor-pointer">
          <div className="w-16 h-16 bg-primary rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-all duration-300">
            <img src={Lidimg} alt="Lidia" className="w-full h-full object-cover" />
          </div>
        </button>

        {/* Name + role */}
        <div>
          <div className="text-sm font-bold text-primary">Lidia Yalew</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">
            Full-Stack Developer
          </div>
        </div>

        {/* Animated CTA */}
        <button onClick={openPortfolio} className="cursor-pointer">
          <div className="flex items-center gap-2 text-green-500 px-4 py-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
            <p animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              👇
            </p>
            <span className="text-xs font-medium">View her portfolio</span>
            <p animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>
              👇
            </p>
          </div>
        </button>

        <button
          onClick={openPortfolio}
          className="text-xs font-medium text-primary underline hover:text-primary/80 transition-colors"
        >
          lidia-portfolio.vercel.app
        </button>
      </div>
    </div>
  );
}

export default Developer;
