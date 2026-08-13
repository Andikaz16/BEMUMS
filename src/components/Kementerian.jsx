import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen } from 'lucide-react';

export default function Kementerian({ db }) {
  const currentPeriod = db.currentPeriod;
  const kementerianData = db.kementerian[currentPeriod] || [];

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
            Profil <span className="text-primary">Kementerian</span>
          </h1>
          <p className="font-body text-neutral-400 mt-4 max-w-2xl text-lg md:text-xl">
            Mengenal lebih dekat arah gerak, tugas, dan susunan fungsionaris dari setiap kementerian Kabinet KOLEKTIVA BEM UMS {currentPeriod}.
          </p>
        </div>
      </motion.div>

      {/* Ministry Cards List */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto space-y-12 md:space-y-24"
      >
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
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-black/50 border border-neutral-800 p-4 flex items-center justify-center shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-500">
                      <img src={kem.logo} alt={kem.name} className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
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
                  {kem.members.map((member, mIdx) => (
                    <div 
                      key={mIdx}
                      className="bg-black/40 border border-neutral-800/80 rounded-xl p-5 hover:bg-neutral-900/80 transition-colors duration-300 flex flex-col justify-center"
                    >
                      <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1 block">
                        {member.title}
                      </span>
                      <span className="text-white font-body text-lg font-medium block">
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
