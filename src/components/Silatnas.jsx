import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, X, Users, MapPin, Globe } from 'lucide-react';
import { addSilatnasApplicant } from '../db';

export default function Silatnas({ db }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', campus: '', jabatan: '', motivasi: '' });
  const [extraFields, setExtraFields] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const catalog = db.silatnasCatalog || [];

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const applicantData = { ...formData, ...extraFields, submittedAt: new Date().toISOString() };
      await addSilatnasApplicant(selectedEvent.id, applicantData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pendaftaran, pastikan koneksi internet stabil lalu coba lagi.");
    }
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
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="flex items-center gap-2 text-xs font-bold font-body text-primary uppercase tracking-widest bg-primary/10 border border-primary/30 px-4 py-2 rounded-full">
                <Globe className="w-4 h-4" /> Silaturahmi Nasional
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white drop-shadow-lg">
              <span className="text-primary">SILATNAS</span>
            </h1>
            <p className="font-body text-neutral-400 mt-4 max-w-2xl text-lg md:text-xl">
              Silaturahmi Nasional — wadah konsolidasi & mempererat ukhuwah antar BEM se-Indonesia.
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
                <p className="text-neutral-400 font-body text-lg">Belum ada agenda Silatnas yang tersedia saat ini.</p>
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
                    {v.location && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-2">
                          <MapPin className="w-4 h-4" />
                          Lokasi
                        </h4>
                        <p className="text-sm font-body text-neutral-400 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/10">
                          {v.location}
                        </p>
                      </div>
                    )}
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary mb-2">
                        <Users className="w-4 h-4" />
                        Deskripsi Kegiatan
                      </h4>
                      <p className="text-sm font-body text-neutral-400 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/10">
                        {v.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-auto pt-4">
                  {v.isOpen ? (
                    <button 
                      onClick={() => {
                        setSelectedEvent(v);
                        setSubmitted(false);
                        setFormData({ name: '', campus: '', jabatan: '', motivasi: '' });
                        setExtraFields({});
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(185,0,20,0.3)] hover:shadow-[0_0_30px_rgba(185,0,20,0.5)] transform hover:-translate-y-1"
                    >
                      Daftar Silatnas
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
          {selectedEvent && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-[100]"
              onClick={() => setSelectedEvent(null)}
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
                    <h2 className="text-xl md:text-2xl font-heading font-extrabold uppercase tracking-tight text-white">{selectedEvent.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(null)}
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
                        Terima kasih, <strong>{formData.name}</strong>, telah mendaftar Silatnas.<br/>
                        Tim kami akan segera menghubungi Anda untuk informasi selanjutnya.
                      </p>
                      <button 
                        onClick={() => setSelectedEvent(null)}
                        className="mt-8 px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-sm rounded-full transition-colors border border-neutral-800"
                      >
                        Tutup Jendela
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-6">
                      {/* Default Fields */}
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
                          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Asal Kampus *</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
                            value={formData.campus}
                            onChange={(e) => setFormData({...formData, campus: e.target.value})}
                            placeholder="Universitas Muhammadiyah Surakarta"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Jabatan *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
                          value={formData.jabatan}
                          onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                          placeholder="Presiden BEM / Menteri / Staff / dll"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Motivasi & Pesan Kesan *</label>
                        <textarea 
                          required
                          rows="4"
                          className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body resize-none"
                          value={formData.motivasi}
                          onChange={(e) => setFormData({...formData, motivasi: e.target.value})}
                          placeholder="Tuliskan motivasi mengikuti Silatnas dan pesan kesan Anda..."
                        ></textarea>
                      </div>

                      {/* Dynamic Extra Fields from Admin */}
                      {selectedEvent.extraFields && selectedEvent.extraFields.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedEvent.extraFields.map((field, idx) => (
                            <div key={idx} className="space-y-2">
                              <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">
                                {field.label} {field.required && '*'}
                              </label>
                              {field.type === 'textarea' ? (
                                <textarea
                                  required={field.required}
                                  rows="3"
                                  className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body resize-none md:col-span-2"
                                  value={extraFields[field.key] || ''}
                                  onChange={(e) => setExtraFields({...extraFields, [field.key]: e.target.value})}
                                  placeholder={field.placeholder || ''}
                                />
                              ) : (
                                <input 
                                  type={field.type || 'text'}
                                  required={field.required}
                                  className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body"
                                  value={extraFields[field.key] || ''}
                                  onChange={(e) => setExtraFields({...extraFields, [field.key]: e.target.value})}
                                  placeholder={field.placeholder || ''}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

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
