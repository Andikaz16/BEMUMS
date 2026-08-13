import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, X } from 'lucide-react';

export default function Artikel({ db }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = db.categories || ["Semua"];
  const articles = db.articles || [];

  // Filter articles based on selected label/category
  const filteredArticles = selectedCategory === 'Semua' 
    ? articles 
    : articles.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());

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

      
      {activeArticle ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-4xl mx-auto bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl mt-12"
        >
          {/* Header Image */}
          <div className="relative aspect-[21/9] bg-neutral-900 border-b border-neutral-800">
            {activeArticle.thumbnail ? (
              <img src={activeArticle.thumbnail} alt={activeArticle.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-800 bg-[#050505]">
                <span className="font-heading font-extrabold tracking-[0.2em] text-4xl opacity-20">KABINET KOLEKTIVA</span>
              </div>
            )}
            
            <button 
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/50 hover:bg-primary text-white rounded-full flex items-center gap-2 transition-colors border border-neutral-700 hover:border-transparent backdrop-blur-md text-sm font-bold uppercase tracking-wider"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Kembali
            </button>
          </div>

          <div className="p-8 md:p-16">
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                {activeArticle.category}
              </span>
              <span className="text-neutral-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {activeArticle.date}
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-heading font-extrabold uppercase leading-tight text-white mb-12">
              {activeArticle.title}
            </h2>

            <div className="prose prose-invert prose-p:font-body prose-p:text-neutral-300 prose-p:leading-relaxed max-w-none prose-lg">
              {/* Fallback to desc if content is empty */}
              <p className="whitespace-pre-wrap">
                {activeArticle.content || activeArticle.desc}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}

        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white drop-shadow-lg">
              Kabar <span className="text-primary">KOLEKTIVA</span>
            </h1>
            <p className="font-body text-neutral-400 mt-4 max-w-2xl text-lg md:text-xl">
              Ikuti rilis berita, opini, dan dokumentasi kegiatan resmi BEM UMS.
            </p>
          </div>
        </motion.div>

        {/* Filter Category Chips */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-wrap gap-3 justify-center lg:justify-start"
        >
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-6 py-2.5 font-body text-sm font-bold uppercase tracking-wider rounded-full border transition-all duration-300 ${
                selectedCategory === c 
                  ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(185,0,20,0.4)]' 
                  : 'bg-transparent border-neutral-700 text-neutral-400 hover:border-primary hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredArticles.length === 0 ? (
            <motion.div variants={itemVariants} className="col-span-full py-20 text-center">
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 inline-block">
                <p className="text-neutral-400 font-body text-lg">Belum ada artikel yang dipublikasikan dalam kategori ini.</p>
              </div>
            </motion.div>
          ) : (
            filteredArticles.map(a => (
              <motion.article 
                variants={itemVariants}
                key={a.id} 
                className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col h-full"
              >
                {/* Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
                
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden z-10">
                  {a.thumbnail ? (
                    <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 bg-black/50">
                      <span className="font-heading font-bold tracking-widest text-xl opacity-30">KOLEKTIVA</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border border-primary/30">
                    {a.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
                  <div className="flex items-center gap-2 text-neutral-400 mb-4 text-xs font-bold uppercase tracking-wider">
                    <Calendar className="w-4 h-4" />
                    <span>{a.date}</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-heading font-extrabold uppercase leading-tight text-white mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {a.title}
                  </h3>
                  
                  <p className="font-body text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                    {a.desc}
                  </p>
                  
                  <button 
                    onClick={() => setActiveArticle(a)}
                    className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm group/btn mt-auto w-max"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.article>
            ))
          )}
        </motion.div>

        

              </div>
      )}
    </div>
  );
}