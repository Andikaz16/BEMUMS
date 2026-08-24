import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Camera, Calendar, X, Maximize2, ExternalLink } from 'lucide-react';

export default function Dokumentasi({ db }) {
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const albums = db.albums || [];

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
          className="text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white drop-shadow-lg">
              Galeri <span className="text-primary">KOLEKTIVA</span>
            </h1>
            <p className="font-body text-neutral-400 mt-4 max-w-2xl text-lg md:text-xl">
              Arsip dokumentasi kegiatan, aksi nyata, dan momen berharga BEM UMS.
            </p>
          </div>
        </motion.div>

        {/* Albums Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {albums.length === 0 ? (
            <motion.div variants={itemVariants} className="col-span-full py-20 text-center">
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 inline-block">
                <p className="text-neutral-400 font-body text-lg">Belum ada album dokumentasi yang dipublikasikan.</p>
              </div>
            </motion.div>
          ) : (
            albums.map(a => (
              <motion.div 
                variants={itemVariants}
                key={a.id} 
                onClick={() => setActiveAlbum(a)}
                className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-500 cursor-pointer shadow-xl flex flex-col h-full"
              >
                {/* Hover Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
                
                {/* Album Cover */}
                <div className="aspect-[4/3] relative overflow-hidden bg-black z-10 border-b border-neutral-800">
                  {a.photos && a.photos[0] ? (
                    <img src={a.photos[0]} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 bg-neutral-900/50">
                      <ImageIcon className="w-12 h-12 mb-2 opacity-30" />
                      <span className="font-heading uppercase tracking-widest text-xs opacity-50">Album Kosong</span>
                    </div>
                  )}
                  
                  {/* Photo Count Badge */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold font-body">{a.photos ? a.photos.length : 0}</span>
                  </div>
                  
                  {/* Hover Overlay Icon */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <div className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500 ease-out shadow-[0_0_30px_rgba(185,0,20,0.5)]">
                       <span className="font-bold text-xs uppercase tracking-widest">Buka</span>
                     </div>
                  </div>
                </div>

                {/* Album Info */}
                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
                  <span className="text-primary text-xs font-bold font-body uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {a.date}
                  </span>
                  <h3 className="text-xl md:text-2xl font-heading font-extrabold uppercase leading-tight text-white mb-3 group-hover:text-primary transition-colors duration-300">
                    {a.title}
                  </h3>
                  <p className="text-sm font-body text-neutral-300 leading-relaxed mb-4">
                    {a.desc}
                  </p>
                  {a.driveUrl && (
                    <a href={a.driveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="mt-auto flex w-max items-center gap-2 text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-primary/10 hover:bg-primary/30 px-3 py-1.5 rounded-full border border-primary/20">
                      <ExternalLink className="w-3.5 h-3.5" /> Buka Google Drive
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Dynamic Album Viewer Modal */}
        <AnimatePresence>
          {activeAlbum && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 z-[100]"
            >
              <div className="absolute inset-0 flex flex-col h-full w-full">
                {/* Toolbar */}
                <div className="flex items-center justify-between p-6 md:px-12 border-b border-neutral-800 bg-black/50">
                  <div>
                    <span className="text-primary text-xs font-bold uppercase tracking-widest block mb-1">Menampilkan Album</span>
                    <h2 className="text-xl md:text-2xl font-heading font-extrabold text-white uppercase">{activeAlbum.title}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeAlbum.driveUrl && (
                      <a href={activeAlbum.driveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-primary/20 hover:bg-primary text-primary hover:text-white px-5 py-2.5 rounded-full transition-all border border-primary/30 hover:border-transparent font-bold text-xs uppercase tracking-widest">
                        <ExternalLink className="w-4 h-4" /> Google Drive
                      </a>
                    )}
                    <button 
                      onClick={() => setActiveAlbum(null)}
                      className="flex items-center gap-2 bg-neutral-900 hover:bg-primary text-neutral-400 hover:text-white px-5 py-2.5 rounded-full transition-all border border-neutral-800 hover:border-transparent font-bold text-xs uppercase tracking-widest"
                    >
                      Tutup <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Photos Grid within Modal */}
                <div className="flex-grow overflow-y-auto p-6 md:p-12">
                  {(!activeAlbum.photos || activeAlbum.photos.length === 0) ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                      <Camera className="w-16 h-16 mb-4 opacity-20" />
                      <p className="font-body text-lg">Tidak ada foto dalam album ini.</p>
                    </div>
                  ) : (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto"
                    >
                      {activeAlbum.photos.map((ph, idx) => (
                        <motion.div 
                          variants={itemVariants}
                          key={idx} 
                          onClick={() => setFullscreenImage(ph)}
                          className="aspect-square rounded-2xl overflow-hidden border border-neutral-800 relative group cursor-pointer"
                        >
                          <img src={ph} alt={`Dokumentasi ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 w-8 h-8 drop-shadow-lg" />
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen Single Image Viewer Overlay */}
        <AnimatePresence>
          {fullscreenImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFullscreenImage(null)}
              className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 cursor-zoom-out"
            >
              <button 
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-primary text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                src={fullscreenImage} 
                className="w-full h-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                alt="Fullscreen view" 
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}






