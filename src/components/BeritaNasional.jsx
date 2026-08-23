import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const SOURCES = [
  { id: 'kompas', name: 'Kompas', color: '#0062CC' },
  { id: 'cnn', name: 'CNN Indonesia', color: '#CC0000' },
  { id: 'detik', name: 'Detik', color: '#00A529' },
  { id: 'antara', name: 'Antara', color: '#E8B500' },
  { id: 'tempo', name: 'Tempo', color: '#1A56DB' },
  { id: 'cnbc', name: 'CNBC Indonesia', color: '#005596' },
];

export default function BeritaNasional() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSource, setActiveSource] = useState('semua');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/news');
      const data = await response.json();

      if (data.status === 'ok' && data.articles.length > 0) {
        setArticles(data.articles);
        setLastUpdated(new Date());
      } else {
        setError('Tidak dapat memuat berita saat ini. Silakan coba lagi nanti.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat berita. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filteredArticles = activeSource === 'semua' 
    ? articles 
    : articles.filter(a => a.source === activeSource);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const sourceCount = (sourceId) => {
    if (sourceId === 'semua') return articles.length;
    return articles.filter(a => a.source === sourceId).length;
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-10 lg:px-20 text-white relative overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[#1a0505] -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent opacity-50 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="flex items-center gap-2 text-xs font-bold font-body text-primary uppercase tracking-widest bg-primary/10 border border-primary/20 px-4 py-2 rounded-full w-fit mb-6">
              Berita Nasional Indonesia
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter">
              <span className="text-white">BERITA</span>{' '}
              <span className="text-primary">TERKINI</span>
            </h1>
            <p className="font-body text-neutral-400 mt-4 max-w-2xl text-lg">
              Kumpulan berita terbaru dari portal berita nasional terpercaya Indonesia. Update otomatis setiap 5 menit.
            </p>
            {lastUpdated && (
              <p className="font-body text-neutral-600 mt-2 text-sm">
                Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </p>
            )}
          </div>
        </motion.div>

        {/* Source Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          <button
            onClick={() => setActiveSource('semua')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              activeSource === 'semua'
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
            }`}
          >
            Semua Sumber ({sourceCount('semua')})
          </button>
          {SOURCES.map(source => (
            <button
              key={source.id}
              onClick={() => setActiveSource(source.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                activeSource === source.id
                  ? 'text-white shadow-lg'
                  : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
              style={activeSource === source.id ? { 
                backgroundColor: source.color, 
                borderColor: source.color,
                boxShadow: `0 0 15px ${source.color}40`
              } : {}}
            >
              {source.name} ({sourceCount(source.id)})
            </button>
          ))}

          <button
            onClick={fetchNews}
            disabled={loading}
            className="ml-auto px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border border-neutral-700 hover:border-primary hover:text-primary text-neutral-400 disabled:opacity-50"
          >
            {loading ? 'Memuat...' : 'Refresh'}
          </button>
        </motion.div>

        {/* Loading State */}
        {loading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-400 font-body text-sm">Mengambil berita terkini dari berbagai sumber...</p>
          </div>
        )}

        {/* Error State */}
        {error && articles.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-neutral-900/50 backdrop-blur-xl border border-red-900/30 rounded-3xl p-12 inline-block">
              <p className="text-red-400 font-body text-lg mb-4">{error}</p>
              <button 
                onClick={fetchNews}
                className="bg-primary hover:bg-primary/80 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* News Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSource}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredArticles.map((article) => (
              <motion.a
                variants={itemVariants}
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col"
              >
                {article.thumbnail && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img 
                      src={article.thumbnail} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-60"></div>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: article.sourceColor }}
                    >
                      {article.sourceName}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-body whitespace-nowrap">
                      {formatDate(article.pubDate)}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-white text-sm leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-3">
                    {article.title}
                  </h3>

                  <p className="text-neutral-500 text-xs font-body leading-relaxed line-clamp-3 flex-1">
                    {article.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs text-neutral-600 group-hover:text-primary transition-colors">
                    <span className="font-bold uppercase tracking-wider">Baca Selengkapnya</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </AnimatePresence>

        {!loading && filteredArticles.length === 0 && articles.length > 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-500 font-body">Tidak ada berita dari sumber ini saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
