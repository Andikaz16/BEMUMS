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
                const padding = 40; // Increased padding for labels
                const safeMax = max || 1;
                const chartMax = safeMax * 1.15; // Give 15% headroom for wicks and labels
                
                // Calculate OHLC for Candlesticks
                const step = width / trend.length;
                const candleWidth = 40;
                
                const candles = trend.map((d, i) => {
                  // Fake Open: Yesterday's Close. (If day 0, fake an open)
                  const O = i === 0 ? (trend[0].total > 0 ? trend[0].total * 0.5 : 0) : trend[i-1].total;
                  const C = d.total;
                  const isUp = C >= O;
                  const color = isUp ? '#0ecb81' : '#f6465d';
                  const glow = isUp ? 'rgba(14,203,129,0.3)' : 'rgba(246,70,93,0.3)';
                  
                  // Fake Wicks (High/Low)
                  const wickVariance = safeMax * 0.05;
                  const H = Math.max(O, C) + wickVariance;
                  const L = Math.max(0, Math.min(O, C) - wickVariance);
                  
                  // Map to Y coordinates (inverted Y-axis)
                  const yO = height - ((O / chartMax) * (height - padding * 2)) - padding;
                  const yC = height - ((C / chartMax) * (height - padding * 2)) - padding;
                  const yH = height - ((H / chartMax) * (height - padding * 2)) - padding;
                  const yL = height - ((L / chartMax) * (height - padding * 2)) - padding;
                  
                  const x = (step * i) + (step / 2);
                  
                  let bodyY = Math.min(yO, yC);
                  let bodyHeight = Math.abs(yO - yC);
                  if (bodyHeight < 2) bodyHeight = 2; // Doji (flat line) minimum height
                  
                  return { x, yO, yC, yH, yL, bodyY, bodyHeight, isUp, color, glow, total: d.total };
                });
                
                return (
                  <div className="w-full overflow-x-auto pb-4">
                    <div className="min-w-[600px] relative">
                      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
                        
                        {/* Trading Grid Lines */}
                        <line x1="0" y1={padding} x2={width} y2={padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5,5" />
                        <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="5,5" />
                        <line x1="0" y1={height - padding} x2={width} y2={height - padding} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        
                        {/* Candlesticks & Fake Volume */}
                        {candles.map((c, i) => {
                          const volHeight = (c.total / safeMax) * 80 + 10; 
                          const volColor = c.isUp ? 'rgba(14,203,129,0.15)' : 'rgba(246,70,93,0.15)';
                          
                          return (
                            <g key={i} className="transition-transform hover:scale-[1.02] origin-bottom cursor-crosshair">
                              {/* Volume Bar */}
                              <rect x={c.x - candleWidth/1.5} y={height - volHeight} width={candleWidth * 1.3} height={volHeight} fill={volColor} rx="2" />
                              
                              {/* Wick */}
                              <line x1={c.x} y1={c.yH} x2={c.x} y2={c.yL} stroke={c.color} strokeWidth="2" style={{ filter: `drop-shadow(0 0 5px ${c.glow})` }} />
                              
                              {/* Body */}
                              <rect x={c.x - candleWidth/2} y={c.bodyY} width={candleWidth} height={c.bodyHeight} fill={c.color} rx="1" style={{ filter: `drop-shadow(0 0 8px ${c.glow})` }} />
                              
                              {/* Price Label (Total Kunjungan) */}
                              <rect x={c.x - 20} y={c.yH - 25} width="40" height="20" fill={c.color} rx="4" />
                              <text x={c.x} y={c.yH - 11} fill="#0b0e11" fontSize="12" fontWeight="bold" textAnchor="middle">
                                {c.total}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* X-Axis Labels */}
                      <div className="flex justify-between mt-4 px-2">
                        {trend.map((d, i) => {
                          const isUp = candles[i].isUp;
                          return (
                            <div key={i} className="text-center text-xs font-bold uppercase w-16" style={{ marginLeft: `${(candles[i].x / width) * 100}%`, transform: 'translateX(-50%)', position: 'absolute' }}>
                              <div className="mb-1" style={{ color: isUp ? '#0ecb81' : '#f6465d' }}>{d.label}</div>
                              <div className="text-[9px] text-neutral-500 opacity-50">{d.date.slice(5, 10)}</div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Empty spacer for absolute labels */}
                      <div className="h-10"></div>
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
