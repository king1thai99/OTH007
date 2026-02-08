
import React, { useState, useRef, useEffect } from 'react';
import { Character } from '../types';
import { generatePortrait } from '../services/gemini';

interface Props {
  character: Character | null;
  onSave: (c: Character) => void;
  onClose: () => void;
}

type Tab = 'identity' | 'biomathematics' | 'visuals' | 'clothing' | 'scene';

const ETHNICITIES = ['Asian', 'Black', 'White', 'Latina', 'Arab', 'Indian', 'Japanese', 'Elf', 'Alien', 'Demon', 'Angel'];
const SKIN_TONES = ['#f3e5ab', '#e8beac', '#d2b48c', '#8d5524', '#c68642', '#3c2012'];
const BODY_TYPES = ['Slim', 'Athletic', 'Voluptuous', 'Curvy', 'Muscular'];
const BREAST_SIZES = ['Flat', 'Small', 'Medium', 'Large', 'XL'];
const BUTT_SIZES = ['Small', 'Skinny', 'Athletic', 'Medium', 'Large'];
const HAIR_STYLES = ['Braided', 'Long', 'Bangs', 'Ponytail', 'Short', 'Bun', 'Buns', 'Wavy', 'Pixie'];
const BACKGROUNDS = ['Beach', 'Pool', 'Mountain', 'Desert', 'Ocean', 'Garden', 'Snow', 'Cyber-City'];
const POSES = ['Standing', 'Sitting', 'Kneeling', 'Yoga', 'Walking', 'Action-Ready'];
const CLOTHING_TYPES = ['Bikini', 'Cyber-Suit', 'Dress', 'Lingerie', 'Armor', 'Casual', 'Gown', 'Uniform'];

const Editor: React.FC<Props> = ({ character, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  const [formData, setFormData] = useState<Character>(character || {
    id: Date.now().toString(),
    name: '', img1: '', subImages: [], vids: [],
    gender: 'Female', age: 22, heightFeet: 5, heightInches: 6, weight: 55,
    bust: 34, waist: 24, hips: 36,
    ethnicity: 'White', skinTone: '#e8beac', bodyType: 'Slim', breastSize: 'Medium', buttSize: 'Medium',
    upperDressType: 'Casual', upperDressColor: 'Black',
    hairColor: 'Blonde', hairStyle: 'Long', hairType: 'Straight', eyeColor: 'Blue', expression: 'Smiling',
    background: 'Ocean', pose: 'Standing',
    condition: 'Stable', dnaHash: Math.random().toString(16).substring(2, 10).toUpperCase(), createdAt: Date.now()
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [showAiHint, setShowAiHint] = useState(false);

  useEffect(() => {
    if (formData.name && formData.gender && !formData.img1 && activeTab === 'identity') {
      setShowAiHint(true);
      const timer = setTimeout(() => setShowAiHint(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [formData.name, formData.gender, activeTab]);

  const setVal = (field: string, val: any) => setFormData(prev => ({ ...prev, [field]: val }));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'img1' | 'subImages' | 'vids') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (field === 'img1') setVal('img1', res);
        else if (field === 'subImages') setVal('subImages', [...formData.subImages, res]);
        else if (field === 'vids') setVal('vids', [...formData.vids, res]);
      };
      reader.readAsDataURL(file);
    }
  };

  const VisualGrid = ({ label, field, options }: any) => {
    const genderIcon = formData.gender === 'Female' ? 'fa-person-dress' : formData.gender === 'Male' ? 'fa-person' : 'fa-person-half-dress';
    return (
      <div className="space-y-4">
        <SectionHeader label={label} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {options.map((opt: string) => {
            const isActive = formData[field as keyof Character] === opt;
            return (
              <button key={opt} onClick={() => setVal(field, opt)} className={`relative group aspect-[3/4] rounded-3xl overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-theme shadow-theme scale-105 z-10' : 'border-white/5 grayscale hover:grayscale-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <i className={`fas ${genderIcon} text-6xl group-hover:scale-125 transition-transform`}></i>
                </div>
                <p className={`absolute bottom-3 inset-x-0 text-center text-[10px] font-black uppercase z-20 tracking-tighter transition-colors ${isActive ? 'text-theme' : 'text-white/60'}`}>{opt}</p>
                {isActive && <div className="absolute top-3 right-3 w-6 h-6 bg-theme rounded-full flex items-center justify-center z-20 shadow-lg"><i className="fas fa-check text-[10px] text-white"></i></div>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const ScrollPicker = ({ label, value, min, max, unit, onChange }: any) => {
    const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const listRef = useRef<HTMLDivElement>(null);

    return (
      <div className="space-y-2">
        <p className="text-[10px] text-theme font-black uppercase tracking-widest text-center">{label}</p>
        <div className="relative h-32 bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-theme/20 border-y border-theme/30 pointer-events-none"></div>
          <div ref={listRef} className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory scrollbar-hide py-12" onScroll={(e: any) => {
            const idx = Math.round(e.target.scrollTop / 32);
            if (items[idx] !== undefined && items[idx] !== value) onChange(items[idx]);
          }}>
            {items.map(i => (
              <div key={i} className="h-8 flex items-center justify-center snap-center">
                <span className={`mono text-sm font-bold transition-all ${value === i ? 'text-theme scale-125' : 'text-white/20'}`}>{i}</span>
              </div>
            ))}
          </div>
          <div className="absolute bottom-1 right-2 text-[8px] opacity-20 mono">{unit}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4">
      {showAiHint && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-theme text-white px-8 py-4 rounded-full font-black text-[10px] tracking-[0.3em] shadow-theme animate-in fade-in slide-in-from-top-4 z-[110] flex items-center gap-3">
          <i className="fas fa-sparkles animate-pulse"></i> DATA SUFFICIENT: TRY 'AI RENDER' FOR PORTRAIT
          <button onClick={() => setShowAiHint(false)} className="ml-2 hover:scale-125 transition-transform"><i className="fas fa-times"></i></button>
        </div>
      )}

      <div className="bg-[#050505] w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-500">
        
        {/* NAVIGATION SIDEBAR */}
        <div className="w-full md:w-72 bg-white/5 border-r border-white/5 p-10 flex flex-col">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-theme/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-theme/20 shadow-theme">
              <i className="fas fa-dna text-theme text-2xl animate-pulse"></i>
            </div>
            <h3 className="mono text-[10px] font-black text-theme tracking-[0.4em] uppercase">GENESIS_MATRIX</h3>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            <NavBtn active={activeTab === 'identity'} icon="fa-id-card" label="Identity" onClick={() => setActiveTab('identity')} />
            <NavBtn active={activeTab === 'biomathematics'} icon="fa-calculator" label="Biometrics" onClick={() => setActiveTab('biomathematics')} />
            <NavBtn active={activeTab === 'visuals'} icon="fa-palette" label="Visuals" onClick={() => setActiveTab('visuals')} />
            <NavBtn active={activeTab === 'clothing'} icon="fa-shirt" label="Clothing" onClick={() => setActiveTab('clothing')} />
            <NavBtn active={activeTab === 'scene'} icon="fa-mountain-sun" label="Scene" onClick={() => setActiveTab('scene')} />
          </div>

          <div className="mt-8 space-y-4">
            <button onClick={async () => { setAiLoading(true); const p = await generatePortrait(formData); if(p) setVal('img1', p); setAiLoading(false); }} disabled={aiLoading} className={`w-full py-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${aiLoading ? 'bg-white/5 text-white/20' : 'bg-theme/10 border border-theme/20 text-theme hover:bg-theme/20 shadow-theme'}`}>
              <i className={`fas ${aiLoading ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i> AI Render
            </button>
            <button onClick={() => onSave(formData)} className="w-full py-5 bg-theme text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-theme hover:scale-105 active:scale-95 transition-all">Synchronize</button>
            <button onClick={onClose} className="w-full py-3 text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest">Abort_Entry</button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
          {aiLoading && <div className="absolute inset-0 z-50 scanner pointer-events-none opacity-50"></div>}
          <div className="max-w-4xl mx-auto space-y-12 pb-20">

            {activeTab === 'identity' && (
              <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
                <div className="space-y-4">
                  <SectionHeader label="Subject Designation" />
                  <input value={formData.name} onChange={e => setVal('name', e.target.value)} placeholder="Full Name..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-3xl font-black outline-none focus:border-theme transition-all placeholder:opacity-10" />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {['Male', 'Female', 'Non-binary'].map(g => (
                    <button key={g} onClick={() => setVal('gender', g)} className={`p-6 rounded-3xl border flex flex-col items-center gap-3 transition-all ${formData.gender === g ? 'border-theme bg-theme/10 text-theme shadow-theme' : 'border-white/5 bg-white/5 text-white/20 hover:border-white/20'}`}>
                      <i className={`fas ${g === 'Male' ? 'fa-mars' : g === 'Female' ? 'fa-venus' : 'fa-transgender'} text-3xl`}></i>
                      <span className="text-[10px] font-black uppercase tracking-widest">{g}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <SectionHeader label="Primary Identification Visual" />
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-32 aspect-square rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center relative bg-white/5 overflow-hidden group">
                       {formData.img1 ? <img src={formData.img1} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : <i className="fas fa-id-badge text-white/5 text-4xl"></i>}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={e => handleFileUpload(e, 'img1')} />
                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10 pointer-events-none">
                          <i className="fas fa-upload text-white"></i>
                       </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <p className="text-[9px] text-white/20 uppercase mono">Neural_Link_URL</p>
                      <input value={formData.img1} onChange={e => setVal('img1', e.target.value)} placeholder="Paste Image Source URL..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-theme" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   <SectionHeader label="Archival Repositories (Infinite)" />
                   <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                      {formData.subImages.map((img, i) => (
                        <div key={i} className="aspect-square rounded-2xl border border-white/10 overflow-hidden relative group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button onClick={() => setVal('subImages', formData.subImages.filter((_, idx) => idx !== i))} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">❌</button>
                        </div>
                      ))}
                      <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 text-white/20 hover:text-theme transition-all relative">
                         <i className="fas fa-plus-circle text-xl mb-1"></i>
                         <span className="text-[8px] font-black uppercase">Add Photo</span>
                         <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'subImages')} />
                      </div>
                      <button onClick={() => { const url = prompt("Enter Image URL:"); if(url) setVal('subImages', [...formData.subImages, url]); }} className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:bg-white/5 text-white/20 hover:text-theme transition-all">
                         <i className="fas fa-link text-xl mb-1"></i>
                         <span className="text-[8px] font-black uppercase">From Link</span>
                      </button>
                   </div>
                </div>

                <div className="space-y-6">
                   <SectionHeader label="Surveillance Logs (Videos)" />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.vids.map((v, i) => (
                        <div key={i} className="flex gap-2 items-center bg-white/5 p-4 rounded-2xl border border-white/5 relative group">
                           <i className="fas fa-video text-theme opacity-30"></i>
                           <input value={v} onChange={e => {const nv=[...formData.vids]; nv[i]=e.target.value; setVal('vids', nv);}} className="flex-1 bg-transparent outline-none text-xs text-white/60 truncate" />
                           <button onClick={() => setVal('vids', formData.vids.filter((_, idx) => idx !== i))} className="text-red-500 hover:scale-125 transition-transform"><i className="fas fa-trash-alt"></i></button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                         <button onClick={() => setVal('vids', [...formData.vids, ''])} className="flex-1 py-4 border-2 border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-theme transition-all"><i className="fas fa-video-plus mr-2"></i> Add Video Log</button>
                         <label className="flex-1 py-4 border-2 border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-theme transition-all flex items-center justify-center cursor-pointer">
                            <i className="fas fa-upload mr-2"></i> Upload Video
                            <input type="file" hidden onChange={e => handleFileUpload(e, 'vids')} />
                         </label>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'biomathematics' && (
              <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
                <div className="grid grid-cols-3 gap-6">
                  <ScrollPicker label="Age" value={formData.age} min={1} max={100} unit="Yrs" onChange={(v:any) => setVal('age', v)} />
                  <div className="space-y-2">
                    <p className="text-[10px] text-theme font-black uppercase text-center">Height</p>
                    <div className="grid grid-cols-2 gap-2">
                       <ScrollPicker label="Feet" value={formData.heightFeet} min={1} max={8} unit="'" onChange={(v:any) => setVal('heightFeet', v)} />
                       <ScrollPicker label="Inch" value={formData.heightInches} min={0} max={11} unit='"' onChange={(v:any) => setVal('heightInches', v)} />
                    </div>
                  </div>
                  <ScrollPicker label="Weight" value={formData.weight} min={1} max={100} unit="Kg" onChange={(v:any) => setVal('weight', v)} />
                </div>
                <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 space-y-10 shadow-inner">
                  <SectionHeader label="Anatomical Mathematics" />
                  <div className="grid grid-cols-3 gap-8">
                    <ScrollPicker label="Bust_Max" value={formData.bust} min={20} max={65} unit="In" onChange={(v:any) => setVal('bust', v)} />
                    <ScrollPicker label="Waist_Min" value={formData.waist} min={15} max={55} unit="In" onChange={(v:any) => setVal('waist', v)} />
                    <ScrollPicker label="Hips_Max" value={formData.hips} min={20} max={65} unit="In" onChange={(v:any) => setVal('hips', v)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visuals' && (
              <div className="space-y-16 animate-in slide-in-from-right-8 duration-500">
                <VisualGrid label="Ethnicity Profile" field="ethnicity" options={ETHNICITIES} />
                <div className="space-y-6">
                  <SectionHeader label="Skin Chromatic Scale" />
                  <div className="flex flex-wrap gap-4">
                    {SKIN_TONES.map(t => (
                      <button key={t} onClick={() => setVal('skinTone', t)} className={`w-14 h-14 rounded-3xl border-2 transition-all duration-300 ${formData.skinTone === t ? 'border-theme scale-110 shadow-theme rotate-12' : 'border-white/10 hover:border-white/30'}`} style={{backgroundColor: t}} />
                    ))}
                  </div>
                </div>
                <VisualGrid label="Physique Orientation" field="bodyType" options={BODY_TYPES} />
                <div className="grid md:grid-cols-2 gap-12">
                   <VisualGrid label="Upper Geometry" field="breastSize" options={BREAST_SIZES} />
                   <VisualGrid label="Lower Geometry" field="buttSize" options={BUTT_SIZES} />
                </div>
                <VisualGrid label="Cranial Styling" field="hairStyle" options={HAIR_STYLES} />
              </div>
            )}

            {activeTab === 'clothing' && (
              <div className="space-y-16 animate-in slide-in-from-right-8 duration-500">
                <VisualGrid label="Attire Configuration" field="upperDressType" options={CLOTHING_TYPES} />
                <div className="space-y-4">
                  <SectionHeader label="Attire Chromatics" />
                  <input value={formData.upperDressColor} onChange={e => setVal('upperDressColor', e.target.value)} placeholder="Enter primary color (e.g. Red, Cyber-Chrome, Matte Black)..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-theme transition-all" />
                </div>
              </div>
            )}

            {activeTab === 'scene' && (
              <div className="space-y-16 animate-in slide-in-from-right-8 duration-500">
                <VisualGrid label="Ambient Environment" field="background" options={BACKGROUNDS} />
                <VisualGrid label="Mechanical Stance" field="pose" options={POSES} />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

const NavBtn = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-theme/10 text-theme border border-theme/20 shadow-theme translate-x-2' : 'text-white/20 hover:bg-white/5 hover:text-white border border-transparent'}`}>
    <i className={`fas ${icon} text-sm transition-transform ${active ? 'scale-125' : ''}`}></i>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

const SectionHeader = ({ label }: any) => (
  <div className="flex items-center gap-4">
    <p className="text-theme text-[10px] font-black tracking-[0.4em] uppercase mono whitespace-nowrap">{label}</p>
    <div className="h-px flex-1 bg-white/5"></div>
  </div>
);

export default Editor;
