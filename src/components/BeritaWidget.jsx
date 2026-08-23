import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function BeritaWidget({ setActivePage }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();

        if (data.status === 'ok' && data.articles) {
          setArticles(data.articles.slice(0, 6));
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };

    fetchNews();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const diffMins = Math.floor((new Date() - date) / 60000);
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${Math.floor(diffHours / 24)} hari lalu`;
  };

  return (
    <section className="w-full px-6 md:px-12 max-w-7xl mx-auto pt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 border-b border-white/20 pb-4">
        <div>
          <h2 className="font-display text-4xl uppercase tracking-tight text-white drop-shadow-lg">BERITA NASIONAL</h2>
          <p className="text-xs text-neutral-400 font-body uppercase mt-1 tracking-wider">Update terkini dari portal berita terpercaya Indonesia</p>
        </div>
        <button 
          onClick={() => setActivePage('berita')}
          className="flex items-center gap-2 text-primary font-display text-sm uppercase hover:text-white transition-colors"
        >
          LIHAT SEMUA BERITA <ArrowRight size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-neutral-500 text-sm font-body">Memuat berita...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 font-body text-sm">Berita tidak tersedia saat ini.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
        >
          {articles.map((article, i) => (
            <motion.a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl flex flex-col"
            >
              {article.thumbnail && (
                <div className="relative w-full h-40 overflow-hidden">
                  <img 
                    src={article.thumbnail} 
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-60"></div>
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span 
                    className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: article.sourceColor }}
                  >
                    {article.sourceName}
                  </span>
                  <span className="text-[10px] text-neutral-600 font-body whitespace-nowrap">
                    {formatDate(article.pubDate)}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-white text-sm leading-snug group-hover:text-primary transition-colors line-clamp-3 flex-1">
                  {article.title}
                </h3>

                <div className="mt-3 flex items-center gap-1 text-[10px] text-neutral-600 group-hover:text-primary transition-colors">
                  <span className="font-bold uppercase tracking-wider">Baca Selengkapnya</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}
    </section>
  );
}
