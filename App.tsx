
import React, { useState, useEffect, useMemo } from 'react';
import { Character, AppConfig, ViewType } from './types';
import LockScreen from './components/LockScreen';
import Navbar from './components/Navbar';
import VaultGrid from './components/VaultGrid';
import ProfileDetail from './components/ProfileDetail';
import Editor from './components/Editor';
import Settings from './components/Settings';

const STORAGE_KEY = 'SECURE_VAULT_PRO_DATA_V3';
const CONFIG_KEY = 'SECURE_VAULT_PRO_CFG_V3';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    password: '007',
    isLocked: true,
    headerBanner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072',
    themeColor: '#ff477e',
    backgroundColor: '#000000'
  });
  const [view, setView] = useState<ViewType>('grid');
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  // Load Initial Data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedCfg = localStorage.getItem(CONFIG_KEY);
    if (savedData) {
      try { setCharacters(JSON.parse(savedData)); } catch (e) { console.error(e); }
    }
    if (savedCfg) {
      try { setConfig(JSON.parse(savedCfg)); } catch (e) { console.error(e); }
    }
  }, []);

  // Persist Characters
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters]);

  // Apply and Persist Config
  useEffect(() => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    
    // Apply theme variables globally
    document.documentElement.style.setProperty('--theme-color', config.themeColor);
    document.body.style.backgroundColor = config.backgroundColor;

    // Generate dynamic RGB shadow variables
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(config.themeColor);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      document.documentElement.style.setProperty('--theme-color-rgb', `${r}, ${g}, ${b}`);
    }
  }, [config]);

  const filteredCharacters = useMemo(() => {
    return characters.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.story?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [characters, searchQuery]);

  const handleUnlock = (success: boolean) => {
    if (success) setConfig(prev => ({ ...prev, isLocked: false }));
  };

  const handleSaveCharacter = (char: Character) => {
    setCharacters(prev => {
      const index = prev.findIndex(p => p.id === char.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = char;
        return updated;
      }
      return [char, ...prev];
    });
    setIsEditorOpen(false);
  };

  const handleDeleteCharacter = (id: string) => {
    // Immediate prompt for security
    const confirmed = window.confirm("PERMANENT ERASURE REQUESTED. THIS DATA CANNOT BE RECOVERED. PROCEED WITH ARCHIVE PURGE?");
    if (confirmed) {
      setCharacters(prev => prev.filter(c => c.id !== id));
      // Cleanup navigation state
      if (activeCharacterId === id) {
        setActiveCharacterId(null);
        setView('grid');
      }
    }
  };

  const openEditor = (char?: Character) => {
    setEditingCharacter(char || null);
    setIsEditorOpen(true);
  };

  if (config.isLocked) {
    return <LockScreen password={config.password} onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden select-none text-white transition-all duration-500" style={{ backgroundColor: config.backgroundColor }}>
      <Navbar 
        onSearch={setSearchQuery} 
        onSettings={() => setView('settings')} 
        onHome={() => setView('grid')}
      />

      <main className="flex-1 overflow-y-auto pt-24 px-4 pb-28">
        <div className="max-w-7xl mx-auto">
          {view === 'grid' && (
            <>
              <div className="mb-8 animate-in fade-in slide-in-from-top duration-700 relative group">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 rounded-3xl"></div>
                 <img 
                  src={config.headerBanner} 
                  className="w-full h-56 object-cover rounded-3xl border border-white/5 shadow-2xl transition-all duration-1000 group-hover:scale-[1.01]"
                  alt="Banner"
                />
                <div className="absolute bottom-6 left-8 z-20">
                  <h2 className="text-3xl font-black tracking-widest text-white uppercase italic mono">VAULT_ARCHIVE</h2>
                  <p className="text-[10px] text-theme tracking-[0.5em] font-bold mt-1 uppercase mono">Encrypted Data Management v2.0</p>
                </div>
              </div>
              <VaultGrid 
                characters={filteredCharacters} 
                onView={(id) => { setActiveCharacterId(id); setView('profile'); }}
                onEdit={openEditor}
                onDelete={handleDeleteCharacter}
              />
            </>
          )}

          {view === 'profile' && activeCharacterId && (
            <ProfileDetail 
              character={characters.find(c => c.id === activeCharacterId)!}
              onBack={() => setView('grid')}
              onEdit={(c) => openEditor(c)}
              onDelete={handleDeleteCharacter}
            />
          )}

          {view === 'settings' && (
            <Settings 
              config={config} 
              setConfig={setConfig} 
              onBack={() => setView('grid')}
              onExport={() => {
                 const blob = new Blob([JSON.stringify(characters)], {type: 'application/json'});
                 const url = URL.createObjectURL(blob);
                 const a = document.createElement('a');
                 a.href = url; a.download = 'vault_export.json'; a.click();
              }}
              onImport={(data) => {
                if (Array.isArray(data)) {
                  setCharacters(data);
                  alert("Data synchronized successfully.");
                } else {
                  alert("Malformed data package.");
                }
              }}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      {view === 'grid' && (
        <button 
          onClick={() => openEditor()}
          className="fixed bottom-10 right-10 w-20 h-20 bg-theme text-white rounded-2xl flex items-center justify-center shadow-theme hover:scale-110 active:scale-95 transition-all z-40 group"
        >
          <i className="fas fa-plus text-3xl group-hover:rotate-90 transition-transform duration-500"></i>
        </button>
      )}

      {isEditorOpen && (
        <Editor 
          character={editingCharacter} 
          onSave={handleSaveCharacter} 
          onClose={() => setIsEditorOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
