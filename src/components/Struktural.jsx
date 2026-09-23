import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, LayoutGrid, Layers, User, Star, ChevronRight, Shield } from 'lucide-react';

export default function Struktural({ db }) {
  const [selectedPeriod, setSelectedPeriod] = useState(db.currentPeriod);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [viewMode, setViewMode] = useState('bagan'); // 'bagan' (Bagan Poster) | 'grid' (Daftar Lengkap)

  const periods = db.periods || [];
  const leaders = db.pimpinan?.[selectedPeriod] || [];
  const depts = db.kementerian?.[selectedPeriod] || [];

  // Helper to find specific department by id or keyword
  const getDept = (identifier) => {
    return depts.find(d => {
      if (typeof identifier === 'string' && d.id === identifier) return true;
      if (typeof identifier === 'number' && d.id === identifier) return true;
      if (typeof identifier === 'string' && d.name?.toLowerCase().includes(identifier.toLowerCase())) return true;
      return false;
    });
  };

  // Structured positions for Kabinet Kolektiva 2026
  const presma = leaders.find(l => l.role?.toLowerCase().includes('presiden') && !l.role?.toLowerCase().includes('wakil')) || leaders[0];
  const wapresma = leaders.find(l => l.role?.toLowerCase().includes('wakil')) || leaders[1];

  const sekkab = getDept('sek') || getDept('sekretaris');
  const benkab = getDept('ben') || getDept('bendahara');

  const kemenlugri = getDept(2) || getDept('luar negeri');
  const kemendagri = getDept(1) || getDept('dalam negeri');
  const kemenpop = getDept(4) || getDept('pengembangan organisasi');

  const advokesma = getDept(3) || getDept('advokasi');
  const pergerakan = getDept(5) || getDept('pergerakan');
  const medinfo = getDept(6) || getDept('media');

  // CSS Filter to transform pure white PNG logos into vibrant official crimson red (#b90014)
  const RED_LOGO_FILTER = "brightness(0) saturate(100%) invert(18%) sepia(87%) saturate(5341%) hue-rotate(351deg) brightness(84%) contrast(106%)";

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 md:px-12 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header / Period Select & View Switcher */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/20 pb-8 gap-6"
        >
          <div>
            <span className="text-primary font-display text-xs tracking-[0.3em] uppercase block mb-2 font-bold">
              BEM UNIVERSITAS MUHAMMADIYAH SURAKARTA
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight leading-none text-white drop-shadow-lg">
              STRUKTUR <span className="text-primary">ORGANISASI</span>
            </h1>
            <p className="text-sm md:text-base font-body tracking-wider text-neutral-400 mt-4">
              Bagan Hierarki & Jajaran Kabinet BEM UMS Periode {selectedPeriod}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-1 flex items-center shadow-lg">
              <button
                onClick={() => setViewMode('bagan')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'bagan'
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(185,0,20,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Bagan Poster</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-heading uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(185,0,20,0.5)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Daftar Lengkap</span>
              </button>
            </div>

            {/* Periode Dropdown */}
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg">
              <span className="font-display text-xs tracking-widest uppercase text-neutral-400">PERIODE:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => {
                  setSelectedPeriod(e.target.value);
                  setSelectedDept(null);
                  setSelectedLeader(null);
                }}
                className="bg-transparent text-primary font-display text-base uppercase tracking-wider outline-none cursor-pointer hover:opacity-80 transition-opacity [&>option]:bg-neutral-900"
              >
                {periods.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* VIEW 1: BAGAN STRUKTURAL POSTER (Sesuai Konsep Poster Kementerian 2026)   */}
        {/* ========================================================================= */}
        {viewMode === 'bagan' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-b from-[#3d0606] via-[#1c0404] to-[#0a0202] border-2 border-red-500/30 rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl overflow-hidden"
          >
            {/* Background Decorative Ambient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-red-600/15 blur-[100px] pointer-events-none rounded-full" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            {/* Poster Header Title */}
            <div className="text-center mb-10 md:mb-14 relative z-10">
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                STRUKTURAL
              </h2>
              <div className="w-24 h-1 bg-white/40 mx-auto mt-3 rounded-full" />
            </div>

            <div className="space-y-8 sm:space-y-12 relative z-10 max-w-5xl mx-auto">
              
              {/* --- TIER 1: PIMPINAN UMUM (PRESIDEN & WAKIL PRESIDEN) --- */}
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full max-w-xl">
                  {/* PRESIDEN CARD */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => presma && setSelectedLeader(presma)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group relative overflow-hidden"
                  >
                    <div className="absolute top-2 right-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    {/* Star Logo */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3">
                      <svg viewBox="0 0 24 24" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_3px_6px_rgba(185,0,20,0.3)] transition-transform duration-300 group-hover:scale-110" fill="#b90014">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-black text-sm sm:text-base md:text-lg text-primary uppercase tracking-tight leading-tight">
                      PRESIDEN
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                      {presma?.name || 'Muh. Naufal Aulia Darojat'}
                    </p>
                  </motion.div>

                  {/* WAKIL PRESIDEN CARD */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => wapresma && setSelectedLeader(wapresma)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group relative overflow-hidden"
                  >
                    <div className="absolute top-2 right-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    {/* Star Logo */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3">
                      <svg viewBox="0 0 24 24" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_3px_6px_rgba(185,0,20,0.3)] transition-transform duration-300 group-hover:scale-110" fill="#b90014">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-black text-sm sm:text-base md:text-lg text-primary uppercase tracking-tight leading-tight">
                      WAKIL PRESIDEN
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                      {wapresma?.name || 'Muh. Faris Abid Muwaffaq'}
                    </p>
                  </motion.div>
                </div>

                {/* Connector Line down */}
                <div className="w-0.5 h-6 sm:h-10 bg-gradient-to-b from-white/40 to-white/80 my-1" />
              </div>

              {/* --- TIER 2: BPH INTI (SEKKAB - KABINET KOLEKTIVA - BENKAB) --- */}
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 w-full max-w-3xl items-center">
                  
                  {/* SEKRETARIS KABINET */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sekkab && setSelectedDept(sekkab)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group h-full justify-between"
                  >
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <img 
                        src="/assets/Seketaris.png" 
                        alt="Sekretaris Kabinet" 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: RED_LOGO_FILTER }}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs sm:text-sm md:text-base text-primary uppercase tracking-tight leading-tight">
                        SEKRETARIS KABINET
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                        {sekkab?.members?.[0]?.name || 'Figur Ahmad B.'}
                      </p>
                    </div>
                  </motion.div>

                  {/* KABINET KOLEKTIVA EMBLEM (CENTER) */}
                  <div className="flex flex-col items-center justify-center p-2 sm:p-4 text-center">
                    <span className="font-heading font-black text-base sm:text-2xl md:text-3xl text-white tracking-widest uppercase drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]">
                      KABINET
                    </span>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="font-heading font-black text-xl sm:text-3xl md:text-4xl text-primary tracking-tight uppercase drop-shadow-[0_0_15px_rgba(185,0,20,0.9)]">
                        KOLEKTIVA
                      </span>
                      <span className="text-primary text-xl sm:text-3xl animate-pulse">★</span>
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-body tracking-[0.25em] text-neutral-400 uppercase mt-1 border-t border-white/20 pt-0.5">
                      BEM UMS 2026
                    </span>
                  </div>

                  {/* BENDAHARA KABINET */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => benkab && setSelectedDept(benkab)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group h-full justify-between"
                  >
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <img 
                        src="/assets/Bendahara.png" 
                        alt="Bendahara Kabinet" 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: RED_LOGO_FILTER }}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs sm:text-sm md:text-base text-primary uppercase tracking-tight leading-tight">
                        BENDAHARA KABINET
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                        {benkab?.members?.[0]?.name || 'Nisa Hidayanti P.'}
                      </p>
                    </div>
                  </motion.div>

                </div>

                {/* Connector Line down */}
                <div className="w-0.5 h-6 sm:h-10 bg-gradient-to-b from-white/80 to-white/40 my-1" />
              </div>

              {/* --- TIER 3 & 4: JAJARAN KEMENTERIAN (2 ROWS OF 3 CARDS) --- */}
              <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto w-full">
                
                {/* ROW 1: KEMENLUGRI | KEMENDAGRI | KEMENPOP */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6">
                  {/* KEMENLUGRI */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => kemenlugri && setSelectedDept(kemenlugri)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group h-full justify-between"
                  >
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <img 
                        src="/assets/Menteri luar neger.png" 
                        alt="Kemenlugri" 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: RED_LOGO_FILTER }}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs sm:text-sm md:text-base text-primary uppercase tracking-tight leading-tight">
                        KEMENLUGRI
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                        {kemenlugri?.members?.[0]?.name || 'Jody Julian'}
                      </p>
                    </div>
                  </motion.div>

                  {/* KEMENDAGRI */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => kemendagri && setSelectedDept(kemendagri)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group h-full justify-between"
                  >
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <img 
                        src="/assets/Kementerian dalam negeri.png" 
                        alt="Kemendagri" 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: RED_LOGO_FILTER }}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs sm:text-sm md:text-base text-primary uppercase tracking-tight leading-tight">
                        KEMENDAGRI
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                        {kemendagri?.members?.[0]?.name || 'Firda Hayyuning'}
                      </p>
                    </div>
                  </motion.div>

                  {/* KEMENPOP */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => kemenpop && setSelectedDept(kemenpop)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group h-full justify-between"
                  >
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <img 
                        src="/assets/Kementerian Pengembangan Organisasi & Profesionalisme.png" 
                        alt="Kemenpop" 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: RED_LOGO_FILTER }}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs sm:text-sm md:text-base text-primary uppercase tracking-tight leading-tight">
                        KEMENPOP
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                        {kemenpop?.members?.[0]?.name || 'Bramantyo Ikhsanul'}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* ROW 2: KEMEN ADVOKESMA | KEMEN PERGERAKAN | KEMENDINFO */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6">
                  {/* KEMEN ADVOKESMA */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => advokesma && setSelectedDept(advokesma)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group h-full justify-between"
                  >
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <img 
                        src="/assets/Kementerian Advokasi & Kesejahteraan Mahasiswa.png" 
                        alt="Kemen Advokesma" 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: RED_LOGO_FILTER }}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs sm:text-sm md:text-base text-primary uppercase tracking-tight leading-tight">
                        KEMEN ADVOKESMA
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                        {advokesma?.members?.[0]?.name || 'Anggris Bagus Eka'}
                      </p>
                    </div>
                  </motion.div>

                  {/* KEMEN PERGERAKAN */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => pergerakan && setSelectedDept(pergerakan)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group h-full justify-between"
                  >
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <img 
                        src="/assets/Kementerian Pergerakan.png" 
                        alt="Kemen Pergerakan" 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: RED_LOGO_FILTER }}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs sm:text-sm md:text-base text-primary uppercase tracking-tight leading-tight">
                        KEMEN PERGERAKAN
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                        {pergerakan?.members?.[0]?.name || 'Riezky Prayudha'}
                      </p>
                    </div>
                  </motion.div>

                  {/* KEMENDINFO */}
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => medinfo && setSelectedDept(medinfo)}
                    className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-xl hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer flex flex-col items-center text-center border-2 border-red-500/20 group h-full justify-between"
                  >
                    <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                      <img 
                        src="/assets/medinfo.png" 
                        alt="Kemendinfo" 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ filter: RED_LOGO_FILTER }}
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs sm:text-sm md:text-base text-primary uppercase tracking-tight leading-tight">
                        KEMENDINFO
                      </h3>
                      <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-1 line-clamp-1">
                        {medinfo?.members?.[0]?.name || 'Chandra Nur P.'}
                      </p>
                    </div>
                  </motion.div>
                </div>

              </div>
            </div>

            {/* Hint footer */}
            <div className="mt-10 pt-6 border-t border-white/10 text-center">
              <p className="text-xs font-body text-neutral-400">
                💡 Klik pada salah satu kotak jabatan untuk melihat daftar pengurus dan tugas pokok secara lengkap.
              </p>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: DAFTAR KARTU LENGKAP (Tampilan Klasik dengan Foto & Bio)          */}
        {/* ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="space-y-16">
            {/* Pimpinan Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="inline-block">
                <h2 className="text-2xl font-display uppercase text-white pb-2 border-b-2 border-primary pr-8">
                  Pimpinan Umum
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {leaders.length === 0 ? (
                  <p className="text-neutral-500 italic text-sm">Data pimpinan belum diisi untuk periode ini.</p>
                ) : (
                  leaders.map((l, i) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + (i * 0.1) }}
                      key={l.id} 
                      onClick={() => setSelectedLeader(l)}
                      className="bg-black/40 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[2rem] flex flex-col sm:flex-row gap-8 items-center sm:items-start group hover:border-primary/50 transition-colors shadow-2xl hover:shadow-[0_0_40px_rgba(220,20,20,0.15)] cursor-pointer"
                    >
                      <div className="relative w-40 h-48 sm:w-32 sm:h-40 rounded-2xl shrink-0 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        {l.photo ? (
                          <img src={l.photo} alt={l.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-display text-xs text-center text-neutral-500 bg-neutral-900">
                            NO PHOTO
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
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
                <h2 className="text-2xl font-display uppercase text-white pb-2 border-b-2 border-primary pr-8">
                  Pengurus Inti & Kementerian
                </h2>
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
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="relative z-10">
                        {d.logo ? (
                          <div className="mb-6 flex items-start justify-start">
                            <img src={d.logo} alt={d.name} className="w-20 h-20 object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] group-hover:scale-110 transition-all duration-500" />
                          </div>
                        ) : (
                          <span className="font-display text-4xl block mb-6 text-white/20 group-hover:text-primary/40 transition-colors">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        )}
                        
                        <h3 className="text-xl font-display uppercase tracking-tight mb-3 text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {d.name}
                        </h3>
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
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DETAIL KEMENTERIAN / BPH                                         */}
      {/* ========================================================================= */}
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
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setSelectedDept(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl custom-scrollbar"
            >
              <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-8">
                <div className="flex items-center gap-6">
                  {selectedDept.logo && (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 hidden sm:flex items-center justify-center shrink-0">
                      <img src={selectedDept.logo} alt={selectedDept.name} className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                    </div>
                  )}
                  <div>
                    <span className="inline-block bg-primary/20 text-primary text-[10px] font-display uppercase tracking-widest px-3 py-1 rounded-full border border-primary/30 mb-3 font-bold">
                      DETAIL PENGURUS
                    </span>
                    <h3 className="text-2xl md:text-4xl font-display uppercase tracking-tight text-white leading-tight">
                      {selectedDept.name}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDept(null)}
                  className="p-2.5 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-primary transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-4">
                  <h4 className="font-display text-sm uppercase text-white border-b border-primary/30 pb-2 inline-block font-bold">
                    Tugas & Fungsi Utama
                  </h4>
                  <p className="text-sm md:text-base font-body text-neutral-300 leading-relaxed bg-black/40 p-6 rounded-2xl border border-white/5">
                    {selectedDept.desc}
                  </p>
                </div>
                
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-display text-sm uppercase text-white border-b border-primary/30 pb-2 inline-block font-bold">
                    Susunan Jajaran Pengurus
                  </h4>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {(!selectedDept.members || selectedDept.members.length === 0) ? (
                      <p className="text-sm text-neutral-500 italic p-4 bg-black/30 rounded-2xl border border-white/5">
                        Belum ada pengurus diinput.
                      </p>
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

      {/* ========================================================================= */}
      {/* MODAL 2: DETAIL PIMPINAN UMUM (PRESIDEN & WAPRES)                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedLeader && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setSelectedLeader(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="inline-block bg-primary/20 text-primary text-[10px] font-display uppercase tracking-widest px-3 py-1 rounded-full border border-primary/30 font-bold">
                  {selectedLeader.role}
                </span>
                <button 
                  onClick={() => setSelectedLeader(null)}
                  className="p-2 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-primary transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                  {selectedLeader.photo ? (
                    <img src={selectedLeader.photo} alt={selectedLeader.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-500 font-display text-xs">
                      FOTO
                    </div>
                  )}
                </div>

                <div className="space-y-4 text-center sm:text-left flex-1">
                  <h3 className="text-2xl sm:text-3xl font-display uppercase text-white font-bold leading-tight">
                    {selectedLeader.name}
                  </h3>
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                    <h5 className="text-xs uppercase text-primary font-bold tracking-wider mb-1">Visi & Kepemimpinan</h5>
                    <p className="text-sm font-body text-neutral-300 leading-relaxed">
                      {selectedLeader.bio || "Memimpin dengan visi KOLEKTIVA untuk kemaslahatan mahasiswa UMS."}
                    </p>
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
