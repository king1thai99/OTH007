
import React, { useState } from 'react';
import { AppConfig } from '../types';

interface Props {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  onBack: () => void;
  onExport: () => void;
  onImport: (data: any) => void;
}

const THEME_PRESETS = [
  { name: 'Cyber Pink', color: '#ff477e' },
  { name: 'Toxic Green', color: '#39ff14' },
  { name: 'Neon Blue', color: '#00e5ff' },
  { name: 'Amber Gold', color: '#ffc107' },
  { name: 'Crimson', color: '#ff1744' },
  { name: 'Pure White', color: '#ffffff' },
  { name: 'Ultraviolet', color: '#9d00ff' },
];

const BG_PRESETS = [
  { name: 'Onyx Black', color: '#000000' },
  { name: 'Deep Space', color: '#050505' },
  { name: 'Midnight', color: '#0a0a14' },
  { name: 'Slate Gray', color: '#1a1a1a' },
  { name: 'Obsidian', color: '#080808' },
  { name: 'Abyss', color: '#020202' },
];

const Settings: React.FC<Props> = ({ config, setConfig, onBack, onExport, onImport }) => {
  const [newPass, setNewPass] = useState('');

  const handleUpdatePassword = () => {
    if (newPass.length > 0) {
      setConfig(prev => ({ ...prev, password: newPass }));
      setNewPass('');
      alert("Encryption key updated.");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          onImport(data);
        } catch (err) {
          alert("Invalid data structure.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-white/5 transition-colors border-white/10">
          <i className="fas fa-arrow-left text-theme"></i>
        </button>
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase mono">SYSTEM_CONFIG</h1>
          <p className="text-[10px] text-white/30 tracking-[0.4em] uppercase font-bold">Internal Terminal Adjustments</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Accent Color Section */}
        <section className="bg-white/5 rounded-[2rem] p-8 border border-white/5 space-y-6">
          <header className="flex items-center gap-3">
            <i className="fas fa-palette text-theme"></i>
            <h3 className="text-white text-[11px] font-black tracking-[0.3em] uppercase">Accent Color Matrix</h3>
          </header>
          
          <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
            {THEME_PRESETS.map((t) => (
              <button
                key={t.color}
                onClick={() => setConfig(prev => ({ ...prev, themeColor: t.color }))}
                className={`aspect-square rounded-2xl border-2 transition-all flex items-center justify-center group ${config.themeColor === t.color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: t.color }}
                title={t.name}
              >
                {config.themeColor === t.color && <i className="fas fa-check text-black text-xs"></i>}
              </button>
            ))}
            <div className="relative group aspect-square rounded-2xl overflow-hidden border border-white/20">
              <input 
                type="color" 
                value={config.themeColor} 
                onChange={(e) => setConfig(prev => ({ ...prev, themeColor: e.target.value }))}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs pointer-events-none group-hover:scale-125 transition-transform">
                <i className="fas fa-plus"></i>
              </div>
            </div>
          </div>
        </section>

        {/* Background Color Section */}
        <section className="bg-white/5 rounded-[2rem] p-8 border border-white/5 space-y-6">
          <header className="flex items-center gap-3">
            <i className="fas fa-fill-drip text-theme"></i>
            <h3 className="text-white text-[11px] font-black tracking-[0.3em] uppercase">Background Chromatics</h3>
          </header>
          
          <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
            {BG_PRESETS.map((t) => (
              <button
                key={t.color}
                onClick={() => setConfig(prev => ({ ...prev, backgroundColor: t.color }))}
                className={`aspect-square rounded-2xl border-2 transition-all flex items-center justify-center group ${config.backgroundColor === t.color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: t.color }}
                title={t.name}
              >
                {config.backgroundColor === t.color && <i className="fas fa-check text-white text-xs"></i>}
              </button>
            ))}
            <div className="relative group aspect-square rounded-2xl overflow-hidden border border-white/20">
              <input 
                type="color" 
                value={config.backgroundColor} 
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs pointer-events-none group-hover:scale-125 transition-transform">
                <i className="fas fa-plus"></i>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-widest italic">Ambient Hex: {config.backgroundColor}</p>
        </section>

        {/* Security Section */}
        <section className="bg-white/5 rounded-[2rem] p-8 border border-white/5 space-y-6">
          <header className="flex items-center gap-3">
            <i className="fas fa-shield-halved text-theme"></i>
            <h3 className="text-white text-[11px] font-black tracking-[0.3em] uppercase">Security Terminal</h3>
          </header>
          <div className="space-y-4">
            <input 
              type="password" 
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="New Encryption Key"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-theme mono"
            />
            <button 
              onClick={handleUpdatePassword}
              className="w-full bg-theme text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-theme active:scale-95 transition-all"
            >
              SYNCHRONIZE KEY
            </button>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="bg-white/5 rounded-[2rem] p-8 border border-white/5 space-y-6">
          <header className="flex items-center gap-3">
             <i className="fas fa-database text-theme"></i>
             <h3 className="text-white text-[11px] font-black tracking-[0.3em] uppercase">Archive Management</h3>
          </header>
          <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={onExport}
               className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-theme transition-all group"
             >
                <i className="fas fa-download text-xl text-white/20 group-hover:text-theme"></i>
                <span className="text-[9px] font-black uppercase tracking-widest">Backup_Vault</span>
             </button>
             <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-theme transition-all group cursor-pointer">
                <i className="fas fa-upload text-xl text-white/20 group-hover:text-theme"></i>
                <span className="text-[9px] font-black uppercase tracking-widest">Restore_Vault</span>
                <input type="file" hidden onChange={handleImport} />
             </label>
          </div>
        </section>

        <div className="text-center pt-10">
           <p className="text-[8px] text-white/10 uppercase tracking-[1em] mono">V2.8_ARCHIVE_TERMINAL_STABLE</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
