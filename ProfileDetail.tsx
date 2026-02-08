
import React, { useState, useRef } from 'react';
import { Character } from '../types';
import { generateSpeech, decodeBase64, decodeAudioData } from '../services/gemini';

interface Props {
  character: Character;
  onBack: () => void;
  onEdit: (c: Character) => void;
  onDelete: (id: string) => void;
}

const ProfileDetail: React.FC<Props> = ({ character: c, onBack, onEdit, onDelete }) => {
  const [playing, setPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const downloadFile = (url: string, filename: string) => {
    fetch(url).then(res => res.blob()).then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }).catch(() => alert("Could not fetch remote archive for local save."));
  };

  const handlePlayVoice = async () => {
    if (playing) return;
    setPlaying(true);
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const base64 = await generateSpeech(c.story || "Subject biographic data cached and verified.");
      if (base64) {
        const buffer = await decodeAudioData(decodeBase64(base64), audioCtxRef.current);
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtxRef.current.destination);
        source.onended = () => setPlaying(false);
        source.start();
      } else setPlaying(false);
    } catch { setPlaying(false); }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 pb-24 px-4">
      
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-white/10 transition-all border-white/10 group">
          <i className="fas fa-chevron-left text-theme text-xl group-hover:-translate-x-1 transition-transform"></i>
        </button>
        <div className="flex gap-4">
          <button onClick={handlePlayVoice} disabled={playing} className="w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-white/10 transition-all border-white/10">
            <i className={`fas ${playing ? 'fa-waveform-lines animate-pulse' : 'fa-volume-high'} text-theme text-xl`}></i>
          </button>
          <button onClick={() => onEdit(c)} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-theme transition-all flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase group">
            <i className="fas fa-sliders text-theme group-hover:rotate-90 transition-transform"></i> Modify_Archive
          </button>
          <button onClick={() => onDelete(c.id)} className="w-14 h-14 rounded-2xl glass flex items-center justify-center hover:bg-red-500/10 border-white/10 text-white/30 hover:text-red-500 transition-all">
            <i className="fas fa-trash-alt text-xl"></i>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* Visual Dossier */}
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative group bg-black">
            <img src={c.img1 || `https://picsum.photos/seed/${c.id}/500/700`} className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110" alt="Portrait" />
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              <span className="px-4 py-1.5 glass rounded-lg text-[9px] font-black text-theme border-theme/20 uppercase tracking-widest">{c.gender}</span>
              <span className="px-4 py-1.5 glass rounded-lg text-[9px] font-black text-white/40 border-white/10 uppercase tracking-widest">{c.ethnicity}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            <button onClick={() => downloadFile(c.img1, `${c.name}_master.png`)} className="absolute bottom-6 right-6 w-14 h-14 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20 shadow-theme">
              <i className="fas fa-download text-theme text-lg"></i>
            </button>
          </div>

          <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-6">
            <h3 className="text-theme text-[9px] font-black tracking-[0.4em] uppercase border-b border-white/5 pb-3">Sub-Archives</h3>
            <div className="grid grid-cols-3 gap-3">
              {c.subImages?.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5 relative group bg-black">
                  <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  <button onClick={() => downloadFile(img, `${c.name}_sub_${i}.png`)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-download text-white text-xs"></i>
                  </button>
                </div>
              ))}
              {(!c.subImages || c.subImages.length === 0) && <p className="col-span-3 text-[8px] text-white/10 uppercase text-center py-8 italic">No archival imagery detected</p>}
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
             <h3 className="text-theme text-[9px] font-black tracking-[0.4em] uppercase border-b border-white/5 pb-3">Security Logs (Videos)</h3>
             <div className="space-y-3">
                {c.vids?.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 truncate">
                      <i className="fas fa-video text-theme text-xs opacity-50"></i>
                      <span className="text-[10px] font-bold text-white/50 truncate">LOG_VERIFIED_0{i+1}</span>
                    </div>
                    <button onClick={() => downloadFile(v, `${c.name}_log_${i}.mp4`)} className="text-theme hover:scale-125 transition-transform"><i className="fas fa-file-download"></i></button>
                  </div>
                ))}
                {(!c.vids || c.vids.length === 0) && <p className="text-[8px] text-white/10 uppercase text-center py-4 italic">No surveillance logs</p>}
             </div>
          </div>
        </div>

        {/* Technical Data */}
        <div className="lg:col-span-8 space-y-12">
          <header className="animate-in slide-in-from-top-8 duration-700">
            <p className="text-theme font-black tracking-[0.5em] text-[10px] uppercase mb-4 opacity-50">Authorized_Archive_Access</p>
            <h1 className="text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none break-words">{c.name}</h1>
            <div className="flex flex-wrap gap-4">
               <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 font-black tracking-[0.4em] text-[10px] uppercase italic">{c.bodyType} Physique</span>
               <span className="px-6 py-2 bg-theme/10 border border-theme/20 rounded-full text-theme font-black tracking-[0.4em] text-[10px] uppercase italic shadow-theme">{c.condition}</span>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in slide-in-from-right-8 duration-700">
            <StatItem label="Age" val={`${c.age} Yrs`} />
            <StatItem label="Height" val={`${c.heightFeet}'${c.heightInches}"`} />
            <StatItem label="Weight" val={`${c.weight} Kg`} />
            <StatItem label="DNA_Hash" val={c.dnaHash} />
          </div>

          <div className="bg-white/5 p-12 rounded-[4rem] border border-white/10 grid grid-cols-3 gap-8 shadow-inner animate-in zoom-in-95 duration-700">
             <div className="text-center p-4 border-r border-white/5">
                <p className="text-[8px] text-white/20 uppercase mono mb-3 tracking-[0.2em]">Bust_Matrix</p>
                <p className="text-4xl font-black text-theme italic tracking-tighter">{c.bust}"</p>
             </div>
             <div className="text-center p-4 border-r border-white/5">
                <p className="text-[8px] text-white/20 uppercase mono mb-3 tracking-[0.2em]">Waist_Matrix</p>
                <p className="text-4xl font-black text-theme italic tracking-tighter">{c.waist}"</p>
             </div>
             <div className="text-center p-4">
                <p className="text-[8px] text-white/20 uppercase mono mb-3 tracking-[0.2em]">Hips_Matrix</p>
                <p className="text-4xl font-black text-theme italic tracking-tighter">{c.hips}"</p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700">
             <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-8">
                <h3 className="text-theme text-[9px] font-black tracking-[0.4em] uppercase border-b border-white/5 pb-4">Biometric_Specs</h3>
                <div className="grid grid-cols-2 gap-8">
                  <DItem label="Hair" val={c.hairStyle} />
                  <DItem label="Eyes" val={c.eyeColor} />
                  <DItem label="Skin" val={c.skinTone} isColor />
                  <DItem label="Ethnicity" val={c.ethnicity} />
                </div>
             </div>
             <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-8">
                <h3 className="text-theme text-[9px] font-black tracking-[0.4em] uppercase border-b border-white/5 pb-4">Environmental_Specs</h3>
                <div className="grid grid-cols-2 gap-8">
                  <DItem label="Habitat" val={c.background} />
                  <DItem label="Posture" val={c.pose} />
                  <DItem label="Upper_G" val={c.breastSize} />
                  <DItem label="Lower_G" val={c.buttSize} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, val }: any) => (
  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-theme/30 transition-all group">
    <p className="text-[9px] text-white/20 uppercase mb-2 mono tracking-widest group-hover:text-theme/50 transition-colors">{label}</p>
    <p className="text-lg font-black text-white">{val}</p>
  </div>
);

const DItem = ({ label, val, isColor }: any) => (
  <div className="space-y-2">
    <p className="text-[9px] text-white/20 uppercase mono tracking-widest">{label}</p>
    <div className="flex items-center gap-3">
       {isColor && val && <div className="w-4 h-4 rounded-full border border-white/10" style={{backgroundColor: val}}></div>}
       <p className="text-xs font-bold text-white/80 truncate uppercase tracking-tighter">{val || 'NONE_DETECTED'}</p>
    </div>
  </div>
);

export default ProfileDetail;
