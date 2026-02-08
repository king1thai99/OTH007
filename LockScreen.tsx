
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  password: string;
  onUnlock: (s: boolean) => void;
}

const LockScreen: React.FC<Props> = ({ password, onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val === password) {
      onUnlock(true);
    } else if (val.length >= password.length) {
      setError(true);
      setTimeout(() => { setInput(''); setError(false); }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-6 text-center">
      <div className={`transition-all duration-300 ${error ? 'animate-shake' : ''}`}>
        <div className="w-20 h-20 mb-8 border-4 border-pink rounded-full flex items-center justify-center shadow-pink animate-pulse">
           <i className="fas fa-fingerprint text-4xl text-pink"></i>
        </div>
        <h1 className="text-xl font-light tracking-[0.5em] text-white uppercase mb-4">ACCESS REQUIRED</h1>
        <div className="relative">
          <input
            ref={inputRef}
            type="password"
            value={input}
            onChange={handleChange}
            className={`bg-transparent border-b-2 ${error ? 'border-red-500' : 'border-pink'} text-pink text-4xl text-center w-64 outline-none tracking-widest py-2 transition-colors`}
            placeholder="······"
            autoFocus
          />
        </div>
        <p className="mt-8 text-white/30 text-xs tracking-widest uppercase">Encrypted Terminal V2.5</p>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default LockScreen;
