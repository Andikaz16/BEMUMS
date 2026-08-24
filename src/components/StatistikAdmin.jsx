import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Clock, CalendarDays, Eye, TrendingUp } from 'lucide-react';
import { getAnalytics } from '../db';

export default function StatistikAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('24h'); // '24h', '7d', '30d', 'all'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const rawData = await getAnalytics();
      setData(rawData);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filter and aggregate data
  const getFilteredData = () => {
    if (!data.length) return { total: 0, pages: [] };

    const today = new Date();
    today.setHours(today.getHours() + 7);
    const todayStr = today.toISOString().split('T')[0];

    let filteredDocs = [];

    if (filter === '24h') {
      filteredDocs = data.filter(d => d.date === todayStr);
    } else if (filter === '7d') {
      const past = new Date(today);
      past.setDate(past.getDate() - 7);
      const pastStr = past.toISOString().split('T')[0];
      filteredDocs = data.filter(d => d.date >= pastStr && d.date <= todayStr);
    } else if (filter === '30d') {
      const past = new Date(today);
      past.setDate(past.getDate() - 30);
      const pastStr = past.toISOString().split('T')[0];
      filteredDocs = data.filter(d => d.date >= pastStr && d.date <= todayStr);
    } else {
      filteredDocs = [...data];
    }

    let totalVisits = 0;
    const pageCounts = {};

    filteredDocs.forEach(doc => {
      totalVisits += doc.total || 0;
      if (doc.paths) {
        Object.entries(doc.paths).forEach(([path, count]) => {
          pageCounts[path] = (pageCounts[path] || 0) + count;
        });
      }
    });

    const sortedPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    return { total: totalVisits, pages: sortedPages };
  };

  const stats = getFilteredData();

  const getPageName = (path) => {
    if (path === 'beranda') return 'Beranda Utama';
    if (path.startsWith('ormawa-')) return `Ormawa: ${path.replace('ormawa-', '').toUpperCase()}`;
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="text-primary" />
            Statistik Pengunjung
          </h2>
          <p className="text-neutral-400 text-sm mt-1">Lacak lalu lintas dan popularitas halaman web BEM UMS</p>
        </div>

        <div className="flex bg-neutral-900 border border-white/10 rounded-xl p-1">
          {[
            { id: '24h', label: '24 Jam' },
            { id: '7d', label: '7 Hari' },
            { id: '30d', label: '30 Hari' },
            { id: 'all', label: 'Semua Waktu' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                filter === f.id 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-neutral-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Total Kunjungan</h3>
                  <p className="text-xs text-neutral-500">
                    {filter === '24h' ? 'Hari ini' : filter === '7d' ? 'Seminggu terakhir' : filter === '30d' ? 'Sebulan terakhir' : 'Sepanjang waktu'}
                  </p>
                </div>
              </div>
              <div className="text-5xl font-display font-bold text-white tracking-tighter">
                {stats.total.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Halaman Terpopuler</h3>
                  <p className="text-xs text-neutral-500">Paling banyak dilihat</p>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight truncate">
                {stats.pages.length > 0 ? getPageName(stats.pages[0].path) : '-'}
              </div>
            </div>
          </div>

          {/* Breakdown Per Page */}
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
              <Eye size={18} className="text-primary" />
              Rincian Per Halaman
            </h3>
            
            {stats.pages.length === 0 ? (
              <div className="text-center py-10 text-neutral-500 font-body">
                Belum ada data kunjungan untuk rentang waktu ini.
              </div>
            ) : (
              <div className="space-y-4">
                {stats.pages.map((page, idx) => (
                  <div key={page.path} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-white font-bold">{getPageName(page.path)}</div>
                        <div className="text-neutral-500 text-xs font-mono">/{page.path === 'beranda' ? '' : page.path}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-primary font-bold text-xl">{page.count.toLocaleString('id-ID')}</div>
                        <div className="text-neutral-500 text-[10px] uppercase tracking-widest">Views</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
