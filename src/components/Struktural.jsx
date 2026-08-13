import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

export default function Struktural({ db }) {
  const [selectedPeriod, setSelectedPeriod] = useState(db.currentPeriod);
  const [selectedDept, setSelectedDept] = useState(null);

  const periods = db.periods || [];
  const leaders = db.pimpinan[selectedPeriod] || [];
  const depts = db.kementerian[selectedPeriod] || [];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header / Period Select */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/20 pb-8 gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight leading-none text-white drop-shadow-lg">
              STRUKTUR <span className="text-primary">ORGANISASI</span>
            </h1>
            <p className="text-sm md:text-base font-body uppercase tracking-widest text-neutral-400 mt-4">
              Jajaran Pimpinan & Pengurus Kabinet BEM UMS
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg">
            <span className="font-display text-sm tracking-widest uppercase text-white">PERIODE:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value);
                setSelectedDept(null);
              }}
              className="bg-transparent text-primary font-display text-lg uppercase tracking-wider outline-none cursor-pointer hover:opacity-80 transition-opacity [&>option]:bg-neutral-900"
            >
              {periods.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Pimpinan Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="inline-block">
            <h2 className="text-2xl font-display uppercase text-white pb-2 border-b-2 border-primary pr-8">Pimpinan Umum</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leaders.length === 0 ? (
              <p className="text-neutral-500 italic text-sm">Data pimpinan belum diisi untuk periode ini.</p>
            ) : (
              leaders.map((l, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={l.id} 
                  className="bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[2rem] flex flex-col sm:flex-row gap-8 items-center sm:items-start group hover:border-primary/50 transition-colors shadow-2xl hover:shadow-[0_0_40px_rgba(220,20,20,0.15)]"
                >
                  <div className="relative w-40 h-48 sm:w-32 sm:h-40 rounded-2xl shrink-0 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    {l.photo ? (
                      <img src={l.photo} alt={l.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display text-xs text-center text-neutral-500 bg-neutral-900">
                        NO PHOTO
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
                  </div>
                  
                  <div className="space-y-4 text-center sm:text-left flex-1">
                    <span className="inline-block bg-primary/20 text-primary text-[10px] font-display uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary/30">
                      {l.role}
                    </span>
                    <h3 className="text-2xl font-display uppercase tracking-tight text-white leading-tight">{l.name}</h3>
                    <p className="text-sm text-neutral-400 font-body leading-relaxed">{l.bio}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Kementerian Section Grid */}
        <div className="space-y-8 pt-12 border-t border-white/10 relative">
          <div className="inline-block">
            <h2 className="text-2xl font-display uppercase text-white pb-2 border-b-2 border-primary pr-8">Pengurus Inti & Kementerian</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {depts.length === 0 ? (
              <p className="text-neutral-500 italic text-sm">Data pengurus belum diisi untuk periode ini.</p>
            ) : (
              depts.map((d, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  key={d.id}
                  onClick={() => setSelectedDept(d)}
                  className={`relative p-6 md:p-8 rounded-[2rem] cursor-pointer transition-all duration-500 flex flex-col justify-between group overflow-hidden ${
                    selectedDept?.id === d.id 
                      ? 'bg-primary/20 border-primary shadow-[0_0_30px_rgba(220,20,20,0.3)]' 
                      : 'bg-black/40 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:bg-black/60 shadow-xl'
                  }`}
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    {/* Render Logo Instead of Number */}
                    {d.logo ? (
                      <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 p-2 border border-white/10 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 flex items-center justify-center">
                        <img src={d.logo} alt={d.name} className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all" />
                      </div>
                    ) : (
                      <span className="font-display text-4xl block mb-6 text-white/20 group-hover:text-primary/40 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                    
                    <h3 className="text-xl font-display uppercase tracking-tight mb-3 text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">{d.name}</h3>
                    <p className="text-xs font-body leading-relaxed text-neutral-400 line-clamp-3">
                      {d.desc}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-display uppercase tracking-widest text-neutral-300 group-hover:text-white transition-colors border-b border-transparent group-hover:border-white/30 pb-0.5">
                      Lihat Jajaran
                    </span>
                    <ArrowRight size={16} className={`transition-transform duration-500 ${selectedDept?.id === d.id ? 'text-primary translate-x-2' : 'text-neutral-500 group-hover:text-white group-hover:translate-x-1'}`} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Active Department Details Overlay */}
      <AnimatePresence>
        {selectedDept && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedDept(null)}
            ></div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl custom-scrollbar"
            >
              <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-8">
                <div className="flex items-center gap-6">
                  {selectedDept.logo && (
                    <div className="w-16 h-16 rounded-xl bg-black/50 p-2 border border-white/10 hidden sm:flex items-center justify-center shrink-0">
                      <img src={selectedDept.logo} alt={selectedDept.name} className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                    </div>
                  )}
                  <div>
                    <span className="inline-block bg-primary/20 text-primary text-[10px] font-display uppercase tracking-widest px-3 py-1 rounded-full border border-primary/30 mb-3">
                      DETAIL PENGURUS
                    </span>
                    <h3 className="text-2xl md:text-4xl font-display uppercase tracking-tight text-white">{selectedDept.name}</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDept(null)}
                  className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-primary/50 hover:shadow-[0_0_15px_rgba(220,20,20,0.5)] transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-3 space-y-4">
                  <h4 className="font-display text-sm uppercase text-white border-b border-primary/30 pb-2 inline-block">Tugas & Fungsi Utama</h4>
                  <p className="text-base font-body text-neutral-300 leading-relaxed bg-black/30 p-6 rounded-2xl border border-white/5">{selectedDept.desc}</p>
                </div>
                
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-display text-sm uppercase text-white border-b border-primary/30 pb-2 inline-block">Susunan Jajaran</h4>
                  <div className="space-y-3">
                    {selectedDept.members.length === 0 ? (
                      <p className="text-sm text-neutral-500 italic p-4 bg-black/30 rounded-2xl border border-white/5">Belum ada pengurus diinput.</p>
                    ) : (
                      selectedDept.members.map((m, i) => (
                        <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-black/40 border border-white/5 p-4 rounded-2xl hover:border-primary/30 transition-colors">
                          <span className="font-bold text-sm text-white">{m.name}</span>
                          <span className="bg-white/10 text-neutral-300 text-[10px] font-display uppercase tracking-wider px-2.5 py-1 rounded border border-white/10 text-center">
                            {m.title}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
