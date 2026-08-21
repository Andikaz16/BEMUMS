import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export default function KalenderWidget({ db, setActivePage }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const kegiatan = db?.kegiatan || [];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

  // Helper to format date as YYYY-MM-DD
  const formatDate = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const todayStr = formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  // Get events for a specific day string
  const getEventsForDay = (dateStr) => {
    return kegiatan.filter(k => {
      if (k.endDate) {
        return dateStr >= k.date && dateStr <= k.endDate;
      }
      return k.date === dateStr;
    });
  };

  const days = [];
  // Empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-12 md:h-16"></div>);
  }

  // Actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDate(year, month, d);
    const dayEvents = getEventsForDay(dateStr);
    const hasEvents = dayEvents.length > 0;
    const isSelected = selectedDate === dateStr;
    const isToday = dateStr === todayStr;

    days.push(
      <button
        key={d}
        onClick={() => setSelectedDate(dateStr)}
        className={`relative h-12 md:h-16 flex items-start justify-start p-2 border rounded-lg transition-all
          ${hasEvents ? 'bg-primary/20 hover:bg-primary/40' : 'bg-black/20 hover:bg-white/10'}
          ${isToday && !isSelected ? 'border-white/50 bg-white/5 ring-1 ring-white/50' : 'border-white/5'}
          ${isSelected ? 'border-primary ring-1 ring-primary shadow-[0_0_15px_rgba(220,20,20,0.4)]' : ''}
        `}
      >
        <span className={`text-xs md:text-sm font-display ${hasEvents ? 'text-white' : 'text-neutral-400'}`}>
          {d}
        </span>
        {hasEvents && (
          <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(220,20,20,1)]"></span>
        )}
      </button>
    );
  }

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <section className="w-full px-6 md:px-12 max-w-7xl mx-auto mt-24 mb-16 relative">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white drop-shadow-lg">KALENDER <span className="text-primary">KEGIATAN</span></h2>
          <p className="text-sm text-neutral-400 font-body uppercase mt-2 tracking-wider">Jadwal Pergerakan dan Program BEM UMS 2026</p>
        </div>
        <button 
          onClick={() => setActivePage('kalender')}
          className="flex items-center gap-2 px-6 py-3 border border-primary text-primary font-display text-xs uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-all shadow-[0_0_15px_rgba(220,20,20,0.2)]"
        >
          Lihat Semua Kegiatan <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-2xl md:text-3xl text-white">
              {monthNames[month]} <span className="text-primary">{year}</span>
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 bg-white/5 hover:bg-primary/20 text-white rounded-lg transition-colors border border-white/10">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 bg-white/5 hover:bg-primary/20 text-white rounded-lg transition-colors border border-white/10">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
            {dayNames.map(d => (
              <div key={d} className="text-center font-display text-xs text-neutral-500 tracking-widest">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {days}
          </div>
        </div>

        {/* Right Side: Details View */}
        <div className="lg:col-span-4 bg-black/40 backdrop-blur-md border border-white/10 border-dashed rounded-[2rem] p-6 md:p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!selectedDate || selectedEvents.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <img src="/assets/maskot_bem.png" alt="BEM Mascot" className="w-72 h-72 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] -mt-4" />
                <div>
                  <h4 className="font-display text-xl text-white">Pilih Tanggal</h4>
                  <p className="font-body text-xs text-neutral-400 mt-2 max-w-[200px] leading-relaxed mx-auto">
                    Klik pada tanggal di kalender yang memiliki highlight warna untuk melihat detail kegiatan.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="events"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full h-full flex flex-col justify-start"
              >
                <div className="border-b border-white/10 pb-4 mb-6">
                  <span className="text-primary font-display text-sm tracking-widest uppercase">{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                  {selectedEvents.map(ev => (
                    <div key={ev.id} className="relative pl-4 border-l-2 border-primary">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(220,20,20,0.8)]"></div>
                      <h4 className="font-display text-lg text-white mb-2">{ev.title}</h4>
                      <p className="font-body text-sm text-neutral-400 leading-relaxed">{ev.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
