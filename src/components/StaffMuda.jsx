import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Sparkles, Award, Compass, HeartHandshake, Calendar, ShieldCheck } from 'lucide-react';

export default function StaffMuda({ db }) {
  const currentPeriod = db.currentPeriod || "2026";
  const members = db.staffMuda?.[currentPeriod] || [];
  const [searchTerm, setSearchTerm] = useState('');

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;
    const q = searchTerm.toLowerCase();
    return members.filter(m => 
      (m.name && m.name.toLowerCase().includes(q)) || 
      (m.role && m.role.toLowerCase().includes(q))
    );
  }, [members, searchTerm]);

  return (
    <div className="relative min-h-screen text-white pt-32 pb-24 px-6 sm:px-10 lg:px-16 flex flex-col overflow-hidden selection:bg-primary selection:text-white">
      
      {/* Ambient Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 -right-40 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-20 w-full">
        
        {/* ================= HERO & HEADER SECTION ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 flex flex-col items-center"
        >
          {/* Badge Top */}
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary border border-primary/40 rounded-full px-5 py-2 text-xs md:text-sm font-display uppercase tracking-widest shadow-[0_0_20px_rgba(220,20,20,0.3)]">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span>STAFF MUDA KOLEKTIVA</span>
          </div>

          {/* Main Logo with ambient drop-shadow */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/25 blur-3xl rounded-full pointer-events-none -z-10" />
            <img 
              src="/assets/logo-staff-muda.png" 
              alt="Logo Staff Muda BEM UMS" 
              className="w-52 h-52 md:w-64 md:h-64 object-contain filter drop-shadow-[0_0_35px_rgba(220,20,20,0.5)]"
            />
          </motion.div>

          {/* Title & Tagline */}
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tight text-primary drop-shadow-[0_4px_20px_rgba(220,20,20,0.4)]">
              STAFF MUDA<br />
              <span className="text-white text-3xl md:text-5xl font-extrabold">BEM UMS {currentPeriod}</span>
            </h1>

            <p className="text-neutral-300 font-body text-base md:text-lg leading-relaxed bg-neutral-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-xl">
              Kawah candradimuka kaderisasi dan inkubator kepemimpinan BEM Universitas Muhammadiyah Surakarta. 
              Membina mahasiswa berintegritas, berdaya kritis, dan siap melangkah bersama mewujudkan gerakan progresif.
            </p>
          </div>

          {/* Value Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-xs md:text-sm text-neutral-300">
              <Award size={16} className="text-primary" />
              <span>Inkubator Kepemimpinan</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-xs md:text-sm text-neutral-300">
              <Compass size={16} className="text-primary" />
              <span>Kolaborasi Kementerian</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-xs md:text-sm text-neutral-300">
              <HeartHandshake size={16} className="text-primary" />
              <span>Kaderisasi Berkelanjutan</span>
            </div>
          </div>
        </motion.div>

        {/* ================= MEMBER LIST SECTION ================= */}
        <div className="space-y-8">
          
          {/* Section Heading & Search Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-tight text-white">
                  Daftar Fungsionaris
                </h2>
                <p className="text-xs text-neutral-400 font-body">
                  Jajaran kader muda yang siap mengabdi di Kabinet KOLEKTIVA
                </p>
              </div>
            </div>

            {/* Search Bar (Only shown if members exist) */}
            {members.length > 0 && (
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Cari nama atau divisi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Members Content */}
          {members.length === 0 ? (
            /* ================= EMPTY STATE / COMING SOON ================= */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 text-center max-w-3xl mx-auto shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6 flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_25px_rgba(220,20,20,0.3)]">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-display uppercase tracking-widest text-primary font-bold">
                    Pengumuman Resmi Segera Hadir
                  </span>
                  <h3 className="text-2xl md:text-4xl font-heading font-extrabold uppercase text-white">
                    Susunan Nama Sedang Dipersiapkan
                  </h3>
                </div>

                <p className="text-neutral-300 font-body text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                  Daftar nama resmi Staff Muda BEM UMS Periode {currentPeriod} akan dirilis setelah pelaksanaan agenda koordinasi perdana.
                </p>

                <div className="inline-flex items-center gap-2 bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-xs md:text-sm text-neutral-200">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Nantikan pembaruan resmi melalui akun @bemums_official</span>
                </div>
              </div>
            </motion.div>
          ) : filteredMembers.length === 0 ? (
            /* ================= SEARCH NOT FOUND ================= */
            <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-white/5">
              <p className="text-neutral-400 text-base">Tidak ditemukan staff muda dengan kata kunci "{searchTerm}".</p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="mt-3 text-primary text-xs font-bold uppercase underline"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            /* ================= MEMBERS GRID ================= */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  key={index}
                  className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 hover:border-primary/50 hover:bg-neutral-900/90 transition-all duration-500 rounded-[2rem] p-6 flex flex-col items-center text-center group relative overflow-hidden shadow-xl hover:shadow-[0_0_35px_rgba(220,20,20,0.25)]"
                >
                  {/* Hover ambient light */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Member Photo */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden mb-5 border border-white/10 bg-neutral-950/80 shadow-md group-hover:border-primary/50 group-hover:scale-105 transition-all duration-500 flex items-center justify-center">
                    <img 
                      src={member.photo || '/assets/default-avatar.png'} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/assets/default-avatar.png'; }}
                    />
                  </div>

                  {/* Role / Ministry Badge */}
                  {member.role ? (
                    <span className="bg-primary/15 text-primary text-[10px] sm:text-[11px] font-display uppercase tracking-wider px-3 py-1.5 rounded-full border border-primary/30 mb-2.5 font-bold line-clamp-1">
                      {member.role}
                    </span>
                  ) : (
                    <span className="bg-white/10 text-neutral-300 text-[10px] sm:text-[11px] font-display uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/10 mb-2.5 font-bold">
                      Staff Muda
                    </span>
                  )}

                  {/* Member Name */}
                  <h3 className="font-heading font-extrabold text-white text-base sm:text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {member.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
