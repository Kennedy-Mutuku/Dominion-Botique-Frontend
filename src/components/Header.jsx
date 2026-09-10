import React from 'react';
import { Heart } from 'lucide-react';
import logo from '../assets/logo bq.png';
import dominionLogo from '../assets/dominion softwares main logo.png';

const Header = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-rose-50 shadow-sm">

      {/* ── Powered By strip ── */}
      <div className="w-full bg-slate-950 flex items-center justify-center gap-3 px-4 py-[5px]">
        <span className="text-[8px] uppercase font-bold text-white/35 tracking-[0.32em]">Powered By</span>
        <span className="w-px h-3 bg-white/10" />
        <a
          href="https://dominionsoftwares.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.28em] text-white/65 hover:text-rose-300 transition-colors duration-200"
        >
          <img src={dominionLogo} alt="Dominion Softwares" className="h-[14px] w-auto brightness-0 invert opacity-75" />
          Dominion Softwares
        </a>
      </div>

      <div className="flex flex-col items-center justify-center relative max-w-5xl mx-auto px-4 py-3">
        
        {/* Top Decoration & Logo */}
        <div className="flex items-center justify-center w-full gap-3 md:gap-6 mb-2">
          <div className="hidden sm:flex items-center w-full max-w-[120px] md:max-w-[200px] opacity-60">
            <div className="h-[1px] w-full bg-rose-300"></div>
            <div className="w-1 h-1 bg-rose-400 rotate-45 mx-2 flex-shrink-0"></div>
            <div className="h-[1px] w-full bg-rose-300"></div>
          </div>
          
          <img src={logo} alt="Logo" className="h-10 md:h-12 w-auto mix-blend-multiply flex-shrink-0" />
          
          <div className="hidden sm:flex items-center w-full max-w-[120px] md:max-w-[200px] opacity-60">
            <div className="h-[1px] w-full bg-rose-300"></div>
            <div className="w-1 h-1 bg-rose-400 rotate-45 mx-2 flex-shrink-0"></div>
            <div className="h-[1px] w-full bg-rose-300"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-medium serif-font text-slate-900 tracking-[0.2em] md:tracking-[0.25em] mb-1.5 text-center uppercase leading-none">
          Nyakoe Fassions
        </h1>
        
        {/* Subtitle */}
        <p className="text-[7px] md:text-[8px] font-bold tracking-[0.3em] md:tracking-[0.4em] text-rose-400 uppercase text-center mb-2">
          Timeless Style, Just For You
        </p>

        {/* Bottom Decoration */}
        <div className="flex items-center justify-center w-full max-w-[100px] md:max-w-[150px] opacity-60">
          <div className="h-[1px] w-full bg-rose-300"></div>
          <Heart size={10} className="text-rose-400 mx-2 flex-shrink-0 fill-rose-400" />
          <div className="h-[1px] w-full bg-rose-300"></div>
        </div>

      </div>
    </nav>
  );
};

export default Header;
