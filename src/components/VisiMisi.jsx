import React from 'react';
import { motion } from 'framer-motion';

export default function VisiMisi({ db }) {
  const data = db.visiMisi || {};

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* SECTION 1: HERO VISI */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative p-8 md:p-16 rounded-[2.5rem] bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 bg-primary/20 text-primary font-display text-xs px-6 py-2 border-b border-r border-primary/30 uppercase tracking-widest rounded-br-[2rem]">
            Visi Utama BEM UMS
          </div>
          <div className="mt-10 md:mt-6 space-y-6 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight text-white leading-none drop-shadow-lg">
              "{data.visi}"
            </h1>
            <p className="text-sm md:text-base font-body text-neutral-400 leading-relaxed max-w-3xl mx-auto">
              {data.desc}
            </p>
          </div>
        </motion.div>

        {/* SECTION 2: LIST VERTIKAL MISI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 sticky top-32"
          >
            <div className="inline-block font-display text-xs text-primary uppercase tracking-widest font-bold border border-primary/30 bg-primary/10 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(220,20,20,0.2)] mb-4">
              Langkah Strategis
            </div>
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-white leading-none drop-shadow-md">
              MISI <span className="text-primary">ORGANISASI</span>
            </h2>
            <p className="text-sm font-body text-neutral-400 mt-4 leading-relaxed">
              Program aksi berkelanjutan kami untuk mewujudkan visi ekosistem kampus yang inklusif dan progresif.
            </p>
          </motion.div>

          <div className="lg:col-span-8 space-y-6">
            {data.misi.map((m, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="group p-6 md:p-8 rounded-[2rem] bg-black/40 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(220,20,20,0.15)] flex gap-6 items-start"
              >
                {/* Numbered box */}
                <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display border border-primary/30 font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-[0_0_15px_rgba(220,20,20,0.2)]">
                  0{idx + 1}
                </div>
                <p className="text-base font-body text-neutral-300 leading-relaxed pt-2">
                  {m}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 3: GRID 3 PILAR */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12 pt-16 border-t border-white/10"
        >
          <div className="text-center space-y-4">
            <span className="inline-block font-display text-xs text-primary uppercase tracking-widest font-bold border border-primary/30 bg-primary/10 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(220,20,20,0.2)]">
              KABINET KOLEKTIVA
            </span>
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-white drop-shadow-md">
              TIGA PILAR ORGANISASI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.pillars.map((p, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                key={p.id} 
                className="group relative p-8 rounded-[2rem] bg-black/40 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(220,20,20,0.2)] flex flex-col justify-between overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <div>
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-[1rem] bg-primary/20 text-primary font-display border border-primary/30 flex items-center justify-center font-bold text-2xl mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    P{idx + 1}
                  </div>
                  <h3 className="text-2xl font-display uppercase tracking-tight text-white mb-4">
                    {p.title}
                  </h3>
                  <p className="text-sm font-body text-neutral-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
