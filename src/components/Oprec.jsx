import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Oprec({ db, onUpdateDB }) {
  const oprec = db.oprec || {};
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    email: '',
    phone: '',
    faculty: '',
    choice1: '',
    choice2: '',
    cvLink: '',
    reason: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Available Ministries
  const kementerians = db.kementerian[db.currentPeriod] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oprec.isOpen) {
      alert('Pendaftaran saat ini sedang ditutup.');
      return;
    }
    if (!formData.name || !formData.nim || !formData.email || !formData.phone || !formData.faculty || !formData.choice1) {
      alert('Harap isi field wajib (*).');
      return;
    }

    const updatedApplicants = [...(oprec.applicants || []), { ...formData, id: Date.now() }];
    const updatedOprec = { ...oprec, applicants: updatedApplicants };
    
    onUpdateDB({ ...db, oprec: updatedOprec });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 text-white relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-0 -left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Status Recrutiment Tag */}
        <div className="flex justify-center mb-8">
          <span className={`px-4 py-2 font-display text-xs border uppercase tracking-widest rounded-full backdrop-blur-md shadow-lg ${
            oprec.isOpen ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-red-900/30 text-red-400 border-red-500/30'
          }`}>
            REKRUTMEN {oprec.isOpen ? 'DIBUKA' : 'DITUTUP'}
          </span>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 border-b border-white/10 pb-8 mb-12">
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight leading-none text-white drop-shadow-lg">
            {oprec.title}
          </h1>
          <p className="text-sm md:text-base font-body text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {oprec.desc}
          </p>
        </div>

        {submitted ? (
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 text-center space-y-6 shadow-2xl">
            <div className="inline-block bg-emerald-500/20 p-4 rounded-full border border-emerald-500/30 mb-2">
              <span className="material-symbols-outlined text-5xl text-emerald-500">check_circle</span>
            </div>
            <h2 className="text-3xl font-display uppercase text-white">Pendaftaran Terkirim!</h2>
            <p className="text-sm md:text-base font-body text-neutral-400 max-w-md mx-auto leading-relaxed">
              Terima kasih telah mendaftar di BEM UMS. Data Anda telah masuk ke database kami. Silakan pantau pengumuman selanjutnya di Instagram resmi BEM UMS.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '', nim: '', email: '', faculty: '', choice1: '', choice2: '', cvLink: '', reason: ''
                });
              }}
              className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold uppercase tracking-widest text-xs transition-colors border border-white/20"
            >
              DAFTAR LAGI
            </button>
          </div>
        ) : (
          <div className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl hover:border-primary/50 transition-colors duration-500">
            {/* Subtle glow effect behind the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              {!oprec.isOpen ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20 space-y-10 flex flex-col items-center justify-center relative overflow-hidden"
              >
                {/* Animated Background Glow */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    rotate: [0, 90, 180, 270, 360]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 blur-3xl rounded-full"
                ></motion.div>

                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-primary/40 blur-[30px] rounded-full"
                  ></motion.div>
                  
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="material-symbols-outlined text-[8rem] text-primary relative z-10 drop-shadow-[0_0_40px_rgba(185,0,20,0.9)]">
                      hourglass_top
                    </span>
                  </motion.div>
                </div>
                
                <div className="relative z-10 space-y-3">
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-5xl md:text-7xl font-display uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  >
                    Coming Soon
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-primary font-display tracking-[0.4em] text-xs md:text-sm uppercase drop-shadow-[0_0_8px_rgba(185,0,20,0.8)] font-bold"
                  >
                    Staf Muda Angkatan 2026
                  </motion.p>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="relative z-10 mt-6"
                >
                  <motion.div
                    animate={{ boxShadow: ["0 0 10px rgba(185,0,20,0.3)", "0 0 35px rgba(185,0,20,0.8)", "0 0 10px rgba(185,0,20,0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block bg-primary/10 text-primary px-10 py-3.5 rounded-full border border-primary/50"
                  >
                    <span className="font-display text-sm md:text-base uppercase tracking-widest font-bold">Persiapkan Dirimu!</span>
                  </motion.div>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-sm md:text-base text-neutral-400 font-body max-w-md mx-auto leading-relaxed relative z-10 mt-8"
                >
                  Pendaftaran Staf Muda BEM UMS akan segera dibuka. Pantau terus informasi selanjutnya di Instagram resmi kami.
                </motion.p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <h3 className="text-2xl font-display uppercase text-white border-b-2 border-primary pb-2 inline-block">Formulir Data Diri & Preferensi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Nama Lengkap *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Budi Gunawan"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-600 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">NIM Mahasiswa *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: L200230001"
                      value={formData.nim}
                      onChange={(e) => setFormData({...formData, nim: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-600 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Surat Elektronik (Email) *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="Contoh: budi@student.ums.ac.id"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-600 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">No. Telepon / WA *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Contoh: 08123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-600 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Fakultas / Program Studi *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: FKI / Teknik Informatika"
                      value={formData.faculty}
                      onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-600 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Tautan Link CV / Berkas Pendukung *</label>
                    <input 
                      type="url" 
                      required
                      placeholder="Contoh: https://drive.google.com/drive/..."
                      value={formData.cvLink}
                      onChange={(e) => setFormData({...formData, cvLink: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-600 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Pilihan Kementerian 1 *</label>
                    <select 
                      required
                      value={formData.choice1}
                      onChange={(e) => setFormData({...formData, choice1: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 text-sm [&>option]:bg-neutral-900"
                    >
                      <option value="">-- Pilih Kementerian --</option>
                      {kementerians.map(k => (
                        <option key={k.id} value={k.name}>{k.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Pilihan Kementerian 2 (Opsional)</label>
                    <select 
                      value={formData.choice2}
                      onChange={(e) => setFormData({...formData, choice2: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 text-sm [&>option]:bg-neutral-900"
                    >
                      <option value="">-- Pilih Kementerian --</option>
                      {kementerians.map(k => (
                        <option key={k.id} value={k.name}>{k.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Alasan Mendaftar *</label>
                    <textarea 
                      required
                      placeholder="Ceritakan motivasi dan alasanmu mendaftar..."
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      className="px-4 py-3 bg-[#0a0a0a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-600 text-sm h-32"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-primary hover:bg-primary/80 text-white rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(185,0,20,0.3)] hover:shadow-[0_0_30px_rgba(185,0,20,0.5)] border border-primary/50"
                >
                  KIRIM PENDAFTARAN
                </button>
              </form>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
