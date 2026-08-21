import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';

export default function HalamanKalender({ db }) {
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

  const formatDate = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const todayStr = formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const getEventsForDay = (dateStr) => {
    return kegiatan.filter(k => k.date === dateStr);
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-16 md:h-24"></div>);
  }

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
        className={`relative h-16 md:h-24 flex flex-col items-start justify-start p-2 md:p-3 border rounded-xl transition-all
          ${hasEvents ? 'bg-primary/20 hover:bg-primary/40' : 'bg-black/20 hover:bg-white/10'}
          ${isToday && !isSelected ? 'border-white/50 bg-white/5 ring-2 ring-white/50' : 'border-white/5'}
          ${isSelected ? 'border-primary ring-2 ring-primary shadow-[0_0_20px_rgba(220,20,20,0.4)] scale-[1.02] z-10' : ''}
        `}
      >
        <span className={`text-sm md:text-lg font-display ${hasEvents ? 'text-white font-bold' : 'text-neutral-400'}`}>
          {d}
        </span>
        {hasEvents && (
          <div className="mt-auto w-full flex flex-col gap-1">
            {dayEvents.slice(0, 2).map((ev, idx) => (
              <div key={idx} className="w-full text-left truncate text-[8px] md:text-[10px] bg-primary/80 text-white px-1.5 py-0.5 rounded font-body">
                {ev.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="w-full text-left text-[8px] text-neutral-400">+{dayEvents.length - 2} lagi</div>
            )}
          </div>
        )}
      </button>
    );
  }

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block font-display text-xs text-primary uppercase tracking-widest font-bold border border-primary/30 bg-primary/10 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(220,20,20,0.2)] mb-4">
            Jadwal Kegiatan BEM UMS
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight text-white leading-none drop-shadow-lg">
            KALENDER <span className="text-primary">KEGIATAN</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Main Calendar Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wider">
                {monthNames[month]} <span className="text-primary">{year}</span>
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-3 bg-white/5 hover:bg-primary text-white rounded-xl transition-colors border border-white/10 hover:border-primary shadow-lg">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextMonth} className="p-3 bg-white/5 hover:bg-primary text-white rounded-xl transition-colors border border-white/10 hover:border-primary shadow-lg">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
              {dayNames.map(d => (
                <div key={d} className="text-center font-display text-sm text-neutral-500 tracking-widest bg-white/5 py-2 rounded-lg">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {days}
            </div>
          </motion.div>

          {/* Details Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-4 flex flex-col h-full"
          >
            <div className="bg-gradient-to-br from-black/80 to-[#2a0404]/80 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-2xl h-full min-h-[500px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {!selectedDate ? (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center h-full my-auto space-y-6"
                  >
                    <div className="w-72 h-72 flex items-center justify-center -mt-4">
                      <img src="/assets/maskot_bem.png" alt="Maskot BEM" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-white mb-2">Pilih Tanggal</h3>
                      <p className="font-body text-sm text-neutral-400 leading-relaxed">
                        Klik pada tanggal di kalender untuk melihat detail kegiatan, rapat, atau program kerja yang dijadwalkan.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="events-list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-grow flex flex-col"
                  >
                    <div className="border-b border-white/10 pb-6 mb-6">
                      <div className="flex items-center gap-3 text-primary mb-2">
                        <Calendar size={20} />
                        <span className="font-display text-sm tracking-widest uppercase">Jadwal Harian</span>
                      </div>
                      <h3 className="font-display text-3xl text-white leading-none">
                        {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </h3>
                    </div>

                    {selectedEvents.length === 0 ? (
                      <div className="text-center py-12 text-neutral-500 font-body">
                        Tidak ada kegiatan yang dijadwalkan pada tanggal ini.
                      </div>
                    ) : (
                      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                        {selectedEvents.map(ev => (
                          <div key={ev.id} className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-primary/50 transition-all duration-300">
                            <h4 className="font-display text-xl text-white mb-2 group-hover:text-primary transition-colors">{ev.title}</h4>
                            <p className="font-body text-sm text-neutral-400 leading-relaxed mb-4">{ev.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
