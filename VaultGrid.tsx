
import React, { useState } from 'react';
import { Character } from '../types';

interface Props {
  characters: Character[];
  onView: (id: string) => void;
  onEdit: (c: Character) => void;
  onDelete: (id: string) => void;
}

const VaultGrid: React.FC<Props> = ({ characters, onView, onEdit, onDelete }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-white/10 border-2 border-dashed border-white/5 rounded-[3rem]">
        <i className="fas fa-folder-open text-7xl mb-6"></i>
        <p className="uppercase tracking-[0.5em] font-black text-sm mono">ARCHIVE_IS_EMPTY</p>
      </div>
    );
  }

  const handlePurge = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenu(null);
    onDelete(id);
  };

  const handleEdit = (e: React.MouseEvent, char: Character) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenu(null);
    onEdit(char);
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {characters.map((c) => (
        <div 
          key={c.id} 
          className="group relative bg-[#0a0a0a] rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-500 cursor-pointer card-hover animate-in zoom-in-95"
          onClick={() => onView(c.id)}
        >
          {/* Options Toggle - Stay visible if menu is active */}
          <button 
            type="button"
            className={`absolute top-4 right-4 z-40 w-10 h-10 rounded-xl glass flex items-center justify-center transition-all ${activeMenu === c.id ? 'opacity-100 text-theme border-theme/50 bg-theme/10' : 'opacity-0 group-hover:opacity-100 text-white/50 hover:text-white'}`}
            onClick={(e) => toggleMenu(e, c.id)}
          >
            <i className={`fas ${activeMenu === c.id ? 'fa-times' : 'fa-ellipsis-h'}`}></i>
          </button>

          {/* Context Menu */}
          {activeMenu === c.id && (
            <div 
              className="absolute top-16 right-4 z-50 w-40 glass border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                type="button"
                className="w-full px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-theme/10 hover:text-theme flex items-center gap-3 transition-colors"
                onClick={(e) => handleEdit(e, c)}
              >
                <i className="fas fa-edit text-xs"></i> Modify
              </button>
              <button 
                type="button"
                className="w-full px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 flex items-center gap-3 transition-colors"
                onClick={(e) => handlePurge(e, c.id)}
              >
                <i className="fas fa-trash-alt text-xs"></i> Purge
              </button>
            </div>
          )}

          <div className="aspect-[3/4] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
            <img 
              src={c.img1 || `https://picsum.photos/seed/${c.id}/500/700`} 
              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
              alt={c.name}
              loading="lazy"
            />
          </div>

          <div className="p-6 bg-black relative z-10 border-t border-white/5">
            <h3 className="text-sm font-black tracking-widest text-center uppercase truncate mono italic">{c.name}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
               <div className="h-0.5 w-4 bg-theme/30 rounded-full"></div>
               <p className="text-[9px] text-theme font-black tracking-[0.3em] uppercase">
                {c.condition || 'Verified'}
               </p>
               <div className="h-0.5 w-4 bg-theme/30 rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        </div>
      ))}
    </div>
  );
};

export default VaultGrid;
