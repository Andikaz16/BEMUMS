import React from 'react';
import { motion } from 'framer-motion';

export default function StaffMuda({ db }) {
  const currentPeriod = db.currentPeriod || "2026";
  const members = db.staffMuda?.[currentPeriod] || [];

  return (
    <div className="relative min-h-screen text-white pt-32 pb-20 px-6 sm:px-12 md:px-24 flex flex-col overflow-hidden">
      
      {/* Background Image Similar to Hero */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('/assets/background.png')",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
        }}
      ></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.7)_0%,_rgba(0,0,0,0.2)_100%)] z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-16 w-full">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 flex flex-col items-center"
        >
          <img 
            src="/assets/logo-staff-muda.png" 
            alt="Logo Staff Muda" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain filter drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]"
          />
          <div>
            <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tighter mb-4 text-primary">
              STAFF MUDA<br />
              <span className="text-white">BEM UMS {currentPeriod}</span>
            </h1>
            <p className="text-neutral-300 font-body max-w-2xl mx-auto text-lg leading-relaxed bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
              Jajaran pengurus Staff Muda BEM UMS Periode {currentPeriod}. 
              Agen perubahan yang siap berdedikasi dan melangkah maju untuk UMS.
            </p>
          </div>
        </motion.div>

        {/* Member List Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="border-t border-white/10 pt-12"
        >
          <div className="flex justify-center mb-10">
             <span className="inline-block bg-primary/20 text-primary text-xs font-display uppercase tracking-widest px-4 py-2 rounded-full border border-primary/30 shadow-[0_0_15px_rgba(220,20,20,0.3)]">
                SUSUNAN JAJARAN
             </span>
          </div>

          {members.length === 0 ? (
            <div className="text-center bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-12 max-w-2xl mx-auto">
              <p className="text-xl text-neutral-400 font-body italic">
                Daftar nama Staff Muda belum dirilis.
              </p>
              <p className="text-sm text-neutral-500 mt-4">
                Nantikan pengumuman resmi selanjutnya!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {members.map((member, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:border-primary/40 hover:bg-black/70 transition-all shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    {member.photo ? (
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                        <span className="text-lg text-neutral-400 font-bold">{member.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="font-bold text-base text-white">{member.name}</span>
                  </div>
                  {member.role && (
                    <span className="bg-primary/10 text-primary text-[11px] font-display uppercase tracking-wider px-3 py-1.5 rounded-md border border-primary/20 text-center shrink-0">
                      {member.role}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
