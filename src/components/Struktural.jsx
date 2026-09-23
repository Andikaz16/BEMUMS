import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Struktural({ db }) {
  const [selectedPeriod, setSelectedPeriod] = useState(db.currentPeriod);

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
    <div className="min-h-screen pt-28 sm:pt-32 pb-24 px-3 sm:px-6 md:px-12 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Header / Period Select */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/20 pb-6 sm:pb-8 gap-4 sm:gap-6"
        >
          <div>
            <span className="text-primary font-display text-xs tracking-[0.3em] uppercase block mb-1.5 font-bold">
              BEM UNIVERSITAS MUHAMMADIYAH SURAKARTA
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight leading-none text-white drop-shadow-lg">
              STRUKTUR <span className="text-primary">ORGANISASI</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-body tracking-wider text-neutral-400 mt-2 sm:mt-4">
              Bagan Hierarki & Jajaran Kabinet BEM UMS Periode {selectedPeriod}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-lg self-start md:self-auto">
            <span className="font-display text-xs tracking-widest uppercase text-neutral-400">PERIODE:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-primary font-display text-sm sm:text-base uppercase tracking-wider outline-none cursor-pointer hover:opacity-80 transition-opacity [&>option]:bg-neutral-900"
            >
              {periods.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* BAGAN STRUKTURAL HIERARKI (RESPONSIF MOBILE, IPAD, & DESKTOP)             */}
        {/* ========================================================================= */}
        <div className="relative py-2 sm:py-6">
          <div className="space-y-6 sm:space-y-10 relative z-10 max-w-5xl mx-auto">
            
            {/* --- TIER 1: PIMPINAN UMUM (PRESIDEN & WAKIL PRESIDEN) --- */}
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8 w-full max-w-sm sm:max-w-md md:max-w-xl">
                {/* PRESIDEN CARD */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-5 md:p-6 shadow-xl flex flex-col items-center text-center border border-red-500/15 relative overflow-hidden min-h-[160px] sm:min-h-[200px] md:min-h-[230px] justify-between cursor-default"
                >
                  {/* Star Logo */}
                  <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center mb-1.5 sm:mb-2">
                    <svg viewBox="0 0 24 24" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 drop-shadow-[0_2px_8px_rgba(185,0,20,0.35)]" fill="#b90014">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-xs sm:text-base md:text-lg text-primary uppercase tracking-tight leading-tight">
                      PRESIDEN
                    </h3>
                    <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 sm:mt-1 truncate max-w-full px-1">
                      {presma?.name || 'Muh. Naufal Aulia Darojat'}
                    </p>
                  </div>
                </div>

                {/* WAKIL PRESIDEN CARD */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-5 md:p-6 shadow-xl flex flex-col items-center text-center border border-red-500/15 relative overflow-hidden min-h-[160px] sm:min-h-[200px] md:min-h-[230px] justify-between cursor-default"
                >
                  {/* Star Logo */}
                  <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center mb-1.5 sm:mb-2">
                    <svg viewBox="0 0 24 24" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 drop-shadow-[0_2px_8px_rgba(185,0,20,0.35)]" fill="#b90014">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-xs sm:text-base md:text-lg text-primary uppercase tracking-tight leading-tight">
                      WAKIL PRESIDEN
                    </h3>
                    <p className="text-[10px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 sm:mt-1 truncate max-w-full px-1">
                      {wapresma?.name || 'Muh. Faris Abid Muwaffaq'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector Line down */}
              <div className="w-0.5 h-6 sm:h-8 md:h-10 bg-gradient-to-b from-white/30 to-white/70 mx-auto my-1" />
            </div>

            {/* --- TIER 2: BPH INTI (SEKKAB - KABINET KOLEKTIVA - BENKAB) --- */}
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 w-full max-w-3xl items-center">
                
                {/* SEKRETARIS KABINET */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-5 shadow-xl flex flex-col items-center text-center border border-red-500/15 h-full justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[210px] cursor-default"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-1.5 sm:mb-2.5">
                    <img 
                      src="/assets/Seketaris.png" 
                      alt="Sekretaris Kabinet" 
                      className="w-full h-full object-contain"
                      style={{ filter: RED_LOGO_FILTER }}
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-[9px] sm:text-xs md:text-base text-primary uppercase tracking-tight leading-tight">
                      SEKRETARIS KABINET
                    </h3>
                    <p className="text-[8px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 truncate max-w-full px-0.5">
                      {sekkab?.members?.[0]?.name || 'Figur Ahmad B.'}
                    </p>
                  </div>
                </div>

                {/* KABINET KOLEKTIVA EMBLEM (CENTER) */}
                <div className="flex flex-col items-center justify-center px-0.5 py-1 sm:p-4 text-center overflow-hidden">
                  <span className="font-heading font-black text-[10px] sm:text-lg md:text-2xl text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-tight">
                    KABINET
                  </span>
                  <div className="flex items-center justify-center gap-0.5 sm:gap-1 mt-0.5 max-w-full">
                    <span className="font-heading font-black text-[11px] sm:text-xl md:text-3xl text-primary tracking-tight uppercase drop-shadow-[0_0_12px_rgba(185,0,20,0.9)] truncate">
                      KOLEKTIVA
                    </span>
                    <span className="text-primary text-[11px] sm:text-xl md:text-3xl">★</span>
                  </div>
                  <span className="text-[7px] sm:text-[10px] md:text-xs font-body tracking-wider text-neutral-400 uppercase mt-0.5 border-t border-white/20 pt-0.5 whitespace-nowrap">
                    BEM UMS 2026
                  </span>
                </div>

                {/* BENDAHARA KABINET */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-5 shadow-xl flex flex-col items-center text-center border border-red-500/15 h-full justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[210px] cursor-default"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-1.5 sm:mb-2.5">
                    <img 
                      src="/assets/Bendahara.png" 
                      alt="Bendahara Kabinet" 
                      className="w-full h-full object-contain"
                      style={{ filter: RED_LOGO_FILTER }}
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-[9px] sm:text-xs md:text-base text-primary uppercase tracking-tight leading-tight">
                      BENDAHARA KABINET
                    </h3>
                    <p className="text-[8px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 truncate max-w-full px-0.5">
                      {benkab?.members?.[0]?.name || 'Nisa Hidayanti P.'}
                    </p>
                  </div>
                </div>

              </div>

              {/* Connector Line down */}
              <div className="w-0.5 h-6 sm:h-8 md:h-10 bg-gradient-to-b from-white/70 to-white/30 mx-auto my-1" />
            </div>

            {/* --- TIER 3 & 4: JAJARAN KEMENTERIAN (2 ROWS OF 3 CARDS) --- */}
            <div className="space-y-2.5 sm:space-y-4 md:space-y-6 max-w-4xl mx-auto w-full">
              
              {/* ROW 1: KEMENLUGRI | KEMENDAGRI | KEMENPOP */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                {/* KEMENLUGRI */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-5 shadow-xl flex flex-col items-center text-center border border-red-500/15 h-full justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[210px] cursor-default"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-1.5 sm:mb-2.5">
                    <img 
                      src="/assets/Menteri luar neger.png" 
                      alt="Kemenlugri" 
                      className="w-full h-full object-contain"
                      style={{ filter: RED_LOGO_FILTER }}
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-[9px] sm:text-xs md:text-base text-primary uppercase tracking-tight leading-tight">
                      KEMENLUGRI
                    </h3>
                    <p className="text-[8px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 truncate max-w-full px-0.5">
                      {kemenlugri?.members?.[0]?.name || 'Jody Julian'}
                    </p>
                  </div>
                </div>

                {/* KEMENDAGRI */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-5 shadow-xl flex flex-col items-center text-center border border-red-500/15 h-full justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[210px] cursor-default"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-1.5 sm:mb-2.5">
                    <img 
                      src="/assets/Kementerian dalam negeri.png" 
                      alt="Kemendagri" 
                      className="w-full h-full object-contain"
                      style={{ filter: RED_LOGO_FILTER }}
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-[9px] sm:text-xs md:text-base text-primary uppercase tracking-tight leading-tight">
                      KEMENDAGRI
                    </h3>
                    <p className="text-[8px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 truncate max-w-full px-0.5">
                      {kemendagri?.members?.[0]?.name || 'Firda Hayyuning'}
                    </p>
                  </div>
                </div>

                {/* KEMENPOP */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-5 shadow-xl flex flex-col items-center text-center border border-red-500/15 h-full justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[210px] cursor-default"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-1.5 sm:mb-2.5">
                    <img 
                      src="/assets/Kementerian Pengembangan Organisasi & Profesionalisme.png" 
                      alt="Kemenpop" 
                      className="w-full h-full object-contain"
                      style={{ filter: RED_LOGO_FILTER }}
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-[9px] sm:text-xs md:text-base text-primary uppercase tracking-tight leading-tight">
                      KEMENPOP
                    </h3>
                    <p className="text-[8px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 truncate max-w-full px-0.5">
                      {kemenpop?.members?.[0]?.name || 'Bramantyo Ikhsanul'}
                    </p>
                  </div>
                </div>
              </div>

              {/* ROW 2: KEMEN ADVOKESMA | KEMEN PERGERAKAN | KEMENDINFO */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                {/* KEMEN ADVOKESMA */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-5 shadow-xl flex flex-col items-center text-center border border-red-500/15 h-full justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[210px] cursor-default"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-1.5 sm:mb-2.5">
                    <img 
                      src="/assets/Kementerian Advokasi & Kesejahteraan Mahasiswa.png" 
                      alt="Kemen Advokesma" 
                      className="w-full h-full object-contain"
                      style={{ filter: RED_LOGO_FILTER }}
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-[9px] sm:text-xs md:text-base text-primary uppercase tracking-tight leading-tight">
                      KEMEN ADVOKESMA
                    </h3>
                    <p className="text-[8px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 truncate max-w-full px-0.5">
                      {advokesma?.members?.[0]?.name || 'Anggris Bagus Eka'}
                    </p>
                  </div>
                </div>

                {/* KEMEN PERGERAKAN */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-5 shadow-xl flex flex-col items-center text-center border border-red-500/15 h-full justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[210px] cursor-default"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-1.5 sm:mb-2.5">
                    <img 
                      src="/assets/Kementerian Pergerakan.png" 
                      alt="Kemen Pergerakan" 
                      className="w-full h-full object-contain"
                      style={{ filter: RED_LOGO_FILTER }}
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-[9px] sm:text-xs md:text-base text-primary uppercase tracking-tight leading-tight">
                      KEMEN PERGERAKAN
                    </h3>
                    <p className="text-[8px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 truncate max-w-full px-0.5">
                      {pergerakan?.members?.[0]?.name || 'Riezky Prayudha'}
                    </p>
                  </div>
                </div>

                {/* KEMENDINFO */}
                <div
                  className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-5 shadow-xl flex flex-col items-center text-center border border-red-500/15 h-full justify-between min-h-[140px] sm:min-h-[180px] md:min-h-[210px] cursor-default"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-1.5 sm:mb-2.5">
                    <img 
                      src="/assets/medinfo.png" 
                      alt="Kemendinfo" 
                      className="w-full h-full object-contain"
                      style={{ filter: RED_LOGO_FILTER }}
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-heading font-black text-[9px] sm:text-xs md:text-base text-primary uppercase tracking-tight leading-tight">
                      KEMENDINFO
                    </h3>
                    <p className="text-[8px] sm:text-xs text-neutral-600 font-body font-medium mt-0.5 truncate max-w-full px-0.5">
                      {medinfo?.members?.[0]?.name || 'Chandra Nur P.'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
