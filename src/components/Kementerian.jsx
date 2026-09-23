import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen } from 'lucide-react';

export default function Kementerian({ db }) {
  const currentPeriod = db?.currentPeriod || "2026";
  const kementerianData = db?.kementerian?.[currentPeriod] || [];
  const pimpinanData = db?.pimpinan?.[currentPeriod] || [];

  // Pimpinan Presma & Wapresma
  const presma = pimpinanData.find(l => l.role?.toLowerCase().includes('presiden') && !l.role?.toLowerCase().includes('wakil')) || {
    id: 1,
    name: "Muh. Naufal Aulia Darojat",
    role: "Presiden Mahasiswa",
    photo: "/assets/foto_presiden.jpg"
  };

  const wapresma = pimpinanData.find(l => l.role?.toLowerCase().includes('wakil')) || {
    id: 2,
    name: "Muh. Faris Abid Muwaffaq",
    role: "Wakil Presiden Mahasiswa",
    photo: "/assets/foto_wakil.jpg"
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-10 lg:px-20 text-white selection:bg-primary selection:text-white relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/20 to-transparent opacity-50 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-16 md:mb-24 text-center lg:text-left flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white drop-shadow-lg">
            Profil <span className="text-primary">Kabinet</span>
          </h1>
          <p className="font-body text-neutral-400 mt-4 max-w-2xl text-lg md:text-xl">
            Mengenal lebih dekat jajaran pimpinan umum, pengurus inti, dan kementerian Kabinet KOLEKTIVA BEM UMS {currentPeriod}.
          </p>
        </div>
      </motion.div>

      {/* Cards List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto space-y-12 md:space-y-24"
      >
        
        {/* ========================================================================= */}
        {/* CARD 0: PIMPINAN UMUM (PRESMA & WAPRESMA - DI ATAS SEKRETARIS KABINET)   */}
        {/* ========================================================================= */}
        <motion.div 
          variants={cardVariants}
          className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden hover:border-primary/50 transition-colors duration-500 shadow-2xl"
        >
          {/* Subtle glow effect behind the card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
          
          <div className="relative z-10 flex flex-col xl:flex-row gap-12 xl:gap-16">
            
            {/* Left Column: Info Pimpinan */}
            <div className="xl:w-1/3 flex flex-col">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-32 h-32 md:w-48 md:h-48 relative flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-28 h-28 md:w-40 md:h-40 relative z-10 drop-shadow-[0_0_20px_rgba(185,0,20,0.8)]" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon 
                      points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" 
                      fill="#b90014" 
                      stroke="white" 
                      strokeWidth="4" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white mb-4">
                Presiden & Wakil Presiden Mahasiswa
              </h2>
              
              <div className="flex items-start gap-3 mt-2 mb-8 xl:mb-0">
                <BookOpen className="w-6 h-6 text-primary shrink-0 mt-1" />
                <p className="font-body text-neutral-400 text-lg leading-relaxed">
                  Nakhoda kepengurusan BEM UMS Kabinet Kolektiva, memimpin arah gerak strategis, merawat marwah kelembagaan, serta memperjuangkan hak dan aspirasi kemahasiswaan demi kemaslahatan civitas akademika UMS.
                </p>
              </div>
            </div>

            {/* Right Column: Foto & Nama Presma/Wapresma */}
            <div className="xl:w-2/3 border-t xl:border-t-0 xl:border-l border-neutral-800/60 pt-8 xl:pt-0 xl:pl-16">
              <div className="flex items-center gap-3 mb-8">
                <Users className="w-6 h-6 text-neutral-500" />
                <h3 className="font-heading font-bold text-xl uppercase tracking-widest text-neutral-300">Susunan Jajaran Pimpinan</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Presma */}
                <div className="bg-black/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-7 hover:bg-neutral-900/80 hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center group shadow-lg">
                  <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl overflow-hidden mb-5 border border-white/10 bg-neutral-900/80 shadow-md group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                    <img 
                      src={presma.photo || '/assets/foto_presiden.jpg'} 
                      alt={presma.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/assets/foto_presiden.jpg'; }}
                    />
                  </div>
                  <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1.5 block">
                    {presma.role || "Presiden Mahasiswa"}
                  </span>
                  <span className="text-white font-body text-base md:text-lg font-medium block">
                    {presma.name}
                  </span>
                </div>

                {/* Wapresma */}
                <div className="bg-black/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-7 hover:bg-neutral-900/80 hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center group shadow-lg">
                  <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl overflow-hidden mb-5 border border-white/10 bg-neutral-900/80 shadow-md group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                    <img 
                      src={wapresma.photo || '/assets/foto_wakil.jpg'} 
                      alt={wapresma.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/assets/foto_wakil.jpg'; }}
                    />
                  </div>
                  <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1.5 block">
                    {wapresma.role || "Wakil Presiden Mahasiswa"}
                  </span>
                  <span className="text-white font-body text-base md:text-lg font-medium block">
                    {wapresma.name}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* CARDS 1+: JAJARAN KEMENTERIAN & BPH (DIMULAI DARI SEKRETARIS KABINET)     */}
        {/* ========================================================================= */}
        {kementerianData.map((kem, index) => (
          <motion.div 
            key={kem.id}
            variants={cardVariants}
            className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden hover:border-primary/50 transition-colors duration-500"
          >
            {/* Subtle glow effect behind the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
            
            <div className="relative z-10 flex flex-col xl:flex-row gap-12 xl:gap-16">
              
              {/* Left Column: Info */}
              <div className="xl:w-1/3 flex flex-col">
                <div className="flex items-center gap-6 mb-8">
                  {kem.logo ? (
                    <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <img src={kem.logo} alt={kem.name} className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-black/50 border border-neutral-800 flex items-center justify-center shrink-0 shadow-xl">
                      <span className="text-4xl font-heading font-bold text-neutral-600">{(index + 1).toString().padStart(2, '0')}</span>
                    </div>
                  )}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white mb-4">
                  {kem.name}
                </h2>
                
                <div className="flex items-start gap-3 mt-2 mb-8 xl:mb-0">
                  <BookOpen className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <p className="font-body text-neutral-400 text-lg leading-relaxed">
                    {kem.desc}
                  </p>
                </div>
              </div>

              {/* Right Column: Members */}
              <div className="xl:w-2/3 border-t xl:border-t-0 xl:border-l border-neutral-800/60 pt-8 xl:pt-0 xl:pl-16">
                <div className="flex items-center gap-3 mb-8">
                  <Users className="w-6 h-6 text-neutral-500" />
                  <h3 className="font-heading font-bold text-xl uppercase tracking-widest text-neutral-300">Susunan Jajaran</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {kem.members?.map((member, mIdx) => (
                    <div 
                      key={mIdx}
                      className="bg-black/40 border border-neutral-800/80 rounded-2xl p-6 sm:p-7 hover:bg-neutral-900/80 hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center group shadow-lg"
                    >
                      <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl overflow-hidden mb-5 border border-white/10 bg-neutral-900/80 shadow-md group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                        <img 
                          src={member.photo || '/assets/default-avatar.png'} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/assets/default-avatar.png'; }}
                        />
                      </div>
                      <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1.5 block">
                        {member.title}
                      </span>
                      <span className="text-white font-body text-base md:text-lg font-medium block">
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
