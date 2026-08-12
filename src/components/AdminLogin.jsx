import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  // Hardcoded secure password
  const CORRECT_PASSWORD = 'AdminBEM2026!';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
      setPassword('');
      
      // Shake effect timeout
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-neutral-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
          
          {/* Top Edge Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Lock className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display uppercase tracking-widest text-white">
              Sistem Akses
            </h1>
            <p className="text-sm font-body text-neutral-400">
              Silakan masukkan kata sandi untuk mengakses Panel Kendali Admin BEM UMS.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div 
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Sandi..."
                className={`w-full px-5 py-4 bg-black/50 border rounded-xl text-white font-mono tracking-widest text-center focus:outline-none transition-all ${
                  error ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50'
                }`}
                autoFocus
              />
              {error && (
                <div className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-xs flex items-center justify-center gap-1">
                  <ShieldAlert size={12} /> Akses ditolak! Kata sandi salah.
                </div>
              )}
            </motion.div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/80 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50"
            >
              Buka Kunci <ArrowRight size={16} />
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
