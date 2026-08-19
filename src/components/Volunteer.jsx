import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, X, Users, ClipboardList, Download, ExternalLink } from 'lucide-react';

export default function Volunteer({ db, onUpdateDB }) {
  const [selectedVol, setSelectedVol] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    email: '',
    phone: '',
    faculty: '',
    commitment: '',
    commitmentLink: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const catalog = db.volunteerCatalog || [];

  const handleSignup = (e) => {
    e.preventDefault();
    if (!selectedVol) return;
    if (!formData.name || !formData.nim || !formData.phone || !formData.commitment) {
      alert('Harap isi Nama, NIM, No. HP, dan Komitmen Anda.');
      return;
    }

    const updatedCatalog = catalog.map(v => {
      if (v.id === selectedVol.id) {
        const applicants = v.applicants || [];
        return {
          ...v,
          applicants: [...applicants, { ...formData, id: Date.now() }]
        };
      }
      return v;
    });

    onUpdateDB({ ...db, volunteerCatalog: updatedCatalog });
    setSubmitted(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-10 lg:px-20 text-white relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/20 to-transparent opacity-50 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white drop-shadow-lg">
              Jadilah <span className="text-primary">Volunteer</span>
            </h1>
            <p className="font-body text-neutral-400 mt-4 max-w-2xl text-lg md:text-xl">
              Salurkan kepedulian sosial & kontribusi nyata bersama komunitas relawan BEM UMS.
            </p>
          </div>
        </motion.div>

        {/* Catalog list */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {catalog.length === 0 ? (
             <motion.div variants={itemVariants} className="col-span-full py-20 text-center">
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 inline-block">
                <p className="text-neutral-400 font-body text-lg">Belum ada program volunteer yang tersedia saat ini.</p>
              </div>
            </motion.div>
          ) : (
            catalog.map(v => (
              <motion.div 
                variants={itemVariants}
                key={v.id} 
                className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col justify-between overflow-hidden hover:border-primary/50 transition-colors duration-500 shadow-2xl"
              >
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
                
                <div className="relative z-10">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <span className="flex items-center gap-2 text-[11px] font-bold font-body text-neutral-400 uppercase tracking-widest bg-neutral-900/50 border border-neutral-800 px-3 py-1.5 rounded-full">
                      <Calendar className="w-3.5 h-3.5" />
                      {v.schedule}
                    </span>
                    <span className={`px-4 py-1.5 font-bold text-xs uppercase tracking-widest rounded-full border ${
                      v.isOpen 
                        ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50 shadow-[0_0_10px_rgba(52,211,153,0.1)]' 
                        : 'bg-red-950/30 text-red-400 border-red-900/50 shadow-[0_0_10px_rgba(248,113,113,0.1)]'
                    }`}>
                      {v.isOpen ? 'DIBUKA' : 'DITUTUP'}
                    </span>
                  </div>

                  <h3 className="text-3xl font-heading font-extrabold uppercase tracking-tight text-white mb-6 group-hover:text-primary transition-colors">
                    {v.title}
                  </h3>
                  
                  <div className="space-y-5 mb-8">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-2">
                        <ClipboardList className="w-4 h-4" />
                        Syarat & Ketentuan
                      </h4>
                      <p className="text-sm font-body text-neutral-400 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/10">
                        {v.requirements}
                      </p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-2">
                        <Users className="w-4 h-4" />
                        Deskripsi Tugas
                      </h4>
                      <p className="text-sm font-body text-neutral-400 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/10">
                        {v.jobdesc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-auto pt-4">
                  {v.isOpen ? (
                    <button 
                      onClick={() => {
                        setSelectedVol(v);
                        setSubmitted(false);
                        setFormData({ name: '', nim: '', email: '', phone: '', faculty: '', commitment: '', commitmentLink: '' });
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(185,0,20,0.3)] hover:shadow-[0_0_30px_rgba(185,0,20,0.5)] transform hover:-translate-y-1"
                    >
                      Daftar Volunteer
                    </button>
                  ) : (
                    <button 
                      disabled 
                      className="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-600 font-bold uppercase tracking-widest text-sm py-4 rounded-xl cursor-not-allowed"
                    >
                      Pendaftaran Ditutup
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Dynamic Signup Form Modal */}
        <AnimatePresence>
          {selectedVol && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-[100]"
              onClick={() => setSelectedVol(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800 p-6 md:px-10 flex items-center justify-between z-20">
                  <div>
                    <span className="text-primary text-xs font-bold uppercase tracking-widest block mb-1">Formulir Pendaftaran</span>
                    <h2 className="text-xl md:text-2xl font-heading font-extrabold uppercase tracking-tight text-white">{selectedVol.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedVol(null)}
                    className="w-10 h-10 bg-black/50 hover:bg-primary text-white rounded-full flex items-center justify-center transition-colors border border-neutral-700 hover:border-transparent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 md:p-10">
                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 space-y-4"
                    >
                      <div className="w-20 h-20 bg-emerald-950/30 border border-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                        <CheckCircle className="text-emerald-400 w-10 h-10" />
                      </div>
                      <h3 className="text-3xl font-heading font-bold text-white uppercase">Pendaftaran Berhasil!</h3>
                      <p className="text-neutral-400 font-body">
                        Terima kasih, <strong>{formData.name}</strong>, telah mendaftar sebagai volunteer.<br/>
                        Tim kami akan segera menghubungi Anda untuk tahap selanjutnya.
                      </p>
                      <button 
                        onClick={() => setSelectedVol(null)}
                        className="mt-8 px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-sm rounded-full transition-colors border border-neutral-800"
                      >
                        Tutup Jendela
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Nama Lengkap *</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">NIM *</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
                            value={formData.nim}
                            onChange={(e) => setFormData({...formData, nim: e.target.value})}
                            placeholder="A123456789"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Fakultas/Jurusan</label>
                          <input 
                            type="text" 
                            className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
                            value={formData.faculty}
                            onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                            placeholder="Fakultas Teknik / Informatika"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Email Aktif</label>
                          <input 
                            type="email" 
                            className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="email@student.ums.ac.id"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">No. HP / WA *</label>
                          <input 
                            type="tel" 
                            required
                            className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="0812xxxx"
                          />
                        </div>
                      </div>

                      {/* Download Template Komitmen */}
                      {selectedVol.templateUrl && (
                        <div className="space-y-2 bg-primary/5 border border-primary/20 rounded-xl p-5">
                          <label className="block text-xs font-bold uppercase tracking-widest text-primary">📄 Download Template Formulir Komitmen</label>
                          <p className="text-xs font-body text-neutral-400 leading-relaxed mb-3">
                            Silakan unduh template formulir komitmen di bawah ini, isi dengan lengkap, lalu upload kembali pada kolom di bawahnya.
                          </p>
                          <a 
                            href={selectedVol.templateUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold uppercase tracking-widest text-xs px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)]"
                          >
                            <Download className="w-4 h-4" /> Download Template
                          </a>
                        </div>
                      )}

                      {/* Link Upload Formulir Komitmen */}
                      {selectedVol.templateUrl && (
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Link Google Drive Formulir Komitmen *</label>
                          <p className="text-[11px] font-body text-neutral-500 leading-relaxed -mt-1">
                            Upload formulir yang sudah diisi ke Google Drive Anda, lalu paste link-nya di bawah ini. Pastikan akses file diatur ke "Anyone with the link".
                          </p>
                          <input 
                            type="url" 
                            required
                            className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
                            value={formData.commitmentLink}
                            onChange={(e) => setFormData({...formData, commitmentLink: e.target.value})}
                            placeholder="https://drive.google.com/file/d/..."
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Komitmen & Alasan Mengikuti *</label>
                        <textarea 
                          required
                          rows="4"
                          className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body resize-none"
                          value={formData.commitment}
                          onChange={(e) => setFormData({...formData, commitment: e.target.value})}
                          placeholder="Jelaskan motivasi dan komitmen waktu Anda untuk program ini..."
                        ></textarea>
                      </div>

                      <div className="pt-4 border-t border-neutral-800 flex justify-end">
                        <button 
                          type="submit"
                          className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-sm px-10 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(185,0,20,0.3)] hover:shadow-[0_0_30px_rgba(185,0,20,0.5)] transform hover:-translate-y-1"
                        >
                          Kirim Pendaftaran
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}


