
import React from 'react';

interface Props {
  onSearch: (q: string) => void;
  onSettings: () => void;
  onHome: () => void;
}

const Navbar: React.FC<Props> = ({ onSearch, onSettings, onHome }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 glass flex items-center justify-between px-6 z-50 border-b border-white/5">
      <div className="flex items-center gap-4 cursor-pointer group" onClick={onHome}>
        <div className="w-10 h-10 bg-pink rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-pink">
          <i className="fas fa-vault text-white"></i>
        </div>
        <span className="hidden md:block font-black text-xl tracking-tighter italic">VAULT<span className="text-pink">PRO</span></span>
      </div>

      <div className="flex-1 max-w-lg mx-6">
        <div className="relative group">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pink transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search archive..." 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:bg-white/10 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onSettings}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-pink transition-all"
        >
          <i className="fas fa-cog text-xl"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
