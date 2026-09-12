import React from 'react';
import { motion } from 'framer-motion';

export default function StaffMuda({ db }) {
  const currentPeriod = db.currentPeriod || "2026";
  const members = db.staffMuda?.[currentPeriod] || [];

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20 px-6 sm:px-12 md:px-24">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 flex flex-col items-center"
        >
          <img 
            src="/assets/logo-staff-muda.png" 
            alt="Logo Staff Muda" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          />
          <div>
            <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tighter mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">STAFF MUDA</span><br />
              BEM UMS {currentPeriod}
            </h1>
            <p className="text-neutral-400 font-body max-w-2xl mx-auto text-lg leading-relaxed">
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
          className="border-t border-white/10 pt-16"
        >
          <div className="flex justify-center mb-12">
             <span className="inline-block bg-primary/20 text-primary text-xs font-display uppercase tracking-widest px-4 py-2 rounded-full border border-primary/30 shadow-[0_0_15px_rgba(220,20,20,0.3)]">
                JAJARAN STAFF MUDA
             </span>
          </div>

          {members.length === 0 ? (
            <div className="text-center bg-white/5 border border-white/10 rounded-3xl p-12 max-w-2xl mx-auto">
              <p className="text-xl text-neutral-400 font-body italic">
                Daftar nama Staff Muda belum dirilis.
              </p>
              <p className="text-sm text-neutral-500 mt-4">
                Nantikan pengumuman resmi selanjutnya!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map((member, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-primary/50 hover:bg-black/60 shadow-xl rounded-2xl p-6 flex flex-col items-center text-center group transition-all duration-300"
                >
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-white/10 group-hover:border-primary/50 transition-colors"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4 border-2 border-white/10 group-hover:border-primary/50 transition-colors">
                      <span className="text-3xl text-neutral-500">{member.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white mb-1 leading-snug">{member.name}</h3>
                  {member.role && (
                    <p className="text-xs text-primary font-display uppercase tracking-wider">{member.role}</p>
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
