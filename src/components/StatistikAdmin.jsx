import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Clock, CalendarDays, Eye, TrendingUp } from 'lucide-react';
import { subscribeAnalytics } from '../db';

export default function StatistikAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('24h'); // '24h', '7d', '30d', 'all'

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeAnalytics((rawData) => {
      setData(rawData);
      setLoading(false);
    });
    return () => unsubscribe();
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
    let uniqueVisits = 0;
    const pageCounts = {};

    filteredDocs.forEach(doc => {
      totalVisits += doc.total || 0;
      uniqueVisits += doc.uniqueVisitors || doc.total || 0; // fallback to total for older records
      if (doc.paths) {
        Object.entries(doc.paths).forEach(([path, count]) => {
          pageCounts[path] = (pageCounts[path] || 0) + count;
        });
      }
    });

    const sortedPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);

    return { total: totalVisits, unique: uniqueVisits, pages: sortedPages };
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1: PENGUNJUNG UNIK */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-neutral-400 text-sm font-bold uppercase tracking-widest leading-tight">Pengunjung Unik</h3>
                  <p className="text-xs text-neutral-500">
                    {filter === '24h' ? 'Hari ini' : filter === '7d' ? 'Seminggu terakhir' : filter === '30d' ? 'Sebulan terakhir' : 'Sepanjang waktu'}
                  </p>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">
                {stats.unique.toLocaleString('id-ID')}
              </div>
            </div>

            {/* CARD 2: TOTAL TAMPILAN HALAMAN (PAGE VIEWS) */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                  <Eye size={24} />
                </div>
                <div>
                  <h3 className="text-neutral-400 text-sm font-bold uppercase tracking-widest leading-tight">Total Kunjungan Halaman</h3>
                  <p className="text-xs text-neutral-500">Semua halaman dijumlahkan</p>
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">
                {stats.total.toLocaleString('id-ID')}
              </div>
            </div>

            {/* CARD 3: HALAMAN TERPOPULER */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-neutral-400 text-sm font-bold uppercase tracking-widest leading-tight">Halaman Terpopuler</h3>
                  <p className="text-xs text-neutral-500">Paling banyak dilihat</p>
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight truncate mt-2">
                {stats.pages.length > 0 ? getPageName(stats.pages[0].path) : '-'}
              </div>
            </div>

          </div>

          {/* New 2-Column Layout for Chart & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: Trading Style Trend Chart (Spans 2 columns) */}
            <div className="lg:col-span-2 bg-[#0b0e11] border border-white/10 rounded-2xl p-6 h-fit relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ecb81]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#0ecb81]" />
                  Grafik Tren Kunjungan (7 Hari Terakhir)
                </h3>
                <div className="text-[10px] uppercase font-bold text-[#0ecb81] bg-[#0ecb81]/10 px-3 py-1 rounded-md border border-[#0ecb81]/20">
                  LIVE MARKET
                </div>
              </div>
              
              {(() => {
                const today = new Date();
                today.setHours(today.getHours() + 7);
                
                const trend = [];
                let max = 0;
                
                // Generate last 7 days
                for (let i = 6; i >= 0; i--) {
                  const d = new Date(today);
                  d.setDate(d.getDate() - i);
                  const dateStr = d.toISOString().split('T')[0];
                  const doc = data.find(x => x.date === dateStr);
                  const total = doc ? doc.total : 0;
                  if (total > max) max = total;
                  
                  trend.push({
                    label: d.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase(),
                    date: dateStr,
                    total
                  });
                }
                
                const width = 1000;
                const height = 300;
                const padding = 20;
                const safeMax = max || 1;
                
                const points = trend.map((d, i) => {
                  const x = (i / (trend.length - 1)) * width;
                  const y = height - ((d.total / safeMax) * (height - padding * 2)) - padding;
                  return `${x},${y}`;
                });
                
                const polylinePoints = points.join(' ');
                const areaPoints = `${points.join(' ')} ${width},${height} 0,${height}`;
                
                return (
                  <div className="w-full overflow-x-auto pb-4">
                    <div className="min-w-[600px] relative">
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-[0_0_15px_rgba(14,203,129,0.3)]" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="tradingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0ecb81" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0b0e11" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Trading Grid Lines */}
                        <line x1="0" y1={padding} x2={width} y2={padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5,5" />
                        <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5,5" />
                        <line x1="0" y1={height - padding} x2={width} y2={height - padding} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        
                        {/* Fake Volume Bars (Trading Style) */}
                        {points.map((p, i) => {
                          const [x] = p.split(',');
                          const volHeight = (trend[i].total / safeMax) * 80 + 10; 
                          return (
                            <rect key={`vol-${i}`} x={Number(x) - (width/(trend.length-1)/4)} y={height - volHeight} width={width/(trend.length-1)/2} height={volHeight} fill="rgba(14,203,129,0.08)" rx="2" />
                          );
                        })}

                        {/* Gradient Area */}
                        <polygon points={areaPoints} fill="url(#tradingGradient)" />
                        
                        {/* Line */}
                        <polyline points={polylinePoints} fill="none" stroke="#0ecb81" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        
                        {/* Points & Tooltips */}
                        {points.map((p, i) => {
                          const [x, y] = p.split(',');
                          return (
                            <g key={i} className="transition-transform hover:scale-150 origin-center cursor-crosshair">
                              <circle cx={x} cy={y} r="6" fill="#0b0e11" stroke="#0ecb81" strokeWidth="3" />
                              {/* Price Label (Trading Style) */}
                              <rect x={Number(x) - 20} y={Number(y) - 35} width="40" height="20" fill="#0ecb81" rx="4" />
                              <text x={x} y={Number(y) - 21} fill="#0b0e11" fontSize="12" fontWeight="bold" textAnchor="middle">
                                {trend[i].total}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* X-Axis Labels */}
                      <div className="flex justify-between mt-4 px-2">
                        {trend.map((d, i) => (
                          <div key={i} className="text-center text-xs text-neutral-500 font-bold uppercase w-12">
                            <div className="mb-1 text-[#0ecb81]">{d.label}</div>
                            <div className="text-[9px] opacity-50">{d.date.slice(5, 10)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* RIGHT: Breakdown Per Page (Spans 1 column) */}
            <div className="lg:col-span-1">
              <h3 className="text-white font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <Eye size={18} className="text-primary" />
                Rincian Halaman
              </h3>
              
              {stats.pages.length === 0 ? (
                <div className="text-center py-10 bg-neutral-900/50 border border-white/10 rounded-2xl text-neutral-500 font-body">
                  Belum ada data kunjungan.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#b90014 transparent' }}>
                  {stats.pages.map((page, idx) => (
                    <div key={page.path} className="bg-neutral-900/50 border border-white/10 hover:border-primary/50 hover:bg-black/60 rounded-2xl p-5 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[100px]">
                      {idx === 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl -mr-4 -mt-4"></div>}
                      
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <div className="text-white font-bold truncate pr-6 text-sm">{getPageName(page.path)}</div>
                          <div className="text-neutral-500 text-[10px] font-mono truncate">/{page.path === 'beranda' ? '' : page.path}</div>
                        </div>
                        <div className="text-neutral-600 text-xs font-bold uppercase shrink-0">
                          #{idx + 1}
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between mt-4">
                        <div></div>
                        <div className="text-right">
                          <div className="text-primary font-display font-bold text-2xl leading-none">
                            {page.count.toLocaleString('id-ID')}
                          </div>
                          <div className="text-neutral-500 text-[9px] uppercase tracking-widest mt-1">
                            Views
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}
