import React from 'react';
import { ArrowRight, Sparkles, AlertTriangle, Layers, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ db, setActivePage }) {
  const oprec = db.oprec || {};
  const currentPeriod = db.currentPeriod;
  const recentArticles = (db.articles || []).slice(0, 3);
  const leaders = db.pimpinan[currentPeriod] || [];
  const president = leaders.find(l => l.id === 1 || l.role.toLowerCase().includes('ketua'));
  const presidentPhoto = president?.photo || '';
  const visiMisi = db.visiMisi || {};
  const galeriPergerakan = db.galeriPergerakan || [];
  // Duplicate array 3 times to ensure the marquee has enough items to scroll smoothly
  const marqueeItems = [...galeriPergerakan, ...galeriPergerakan, ...galeriPergerakan];

  const statCards = [
    { id: 1, val: "", title: "Presiden", sub: "BEM UMS 2026", img: "/assets/foto_presiden.jpg" },
    { id: 2, val: "", title: "Wakil presiden", sub: "BEM UMS 2026", img: "/assets/foto_wakil.jpg" },
    { id: 3, val: "2", title: "Seketaris Kabinet", sub: "BEM UMS 2026", img: "/assets/Seketaris.png" },
    { id: 4, val: "1", title: "Bendahara Kabinet", sub: "BEM UMS 2026", img: "/assets/Bendahara.png" },
    { id: 5, val: "7", title: "Kementerian", sub: "Advokasi & Kesejahteraan Mahasiswa", img: "/assets/Kementerian Advokasi & Kesejahteraan Mahasiswa.png" },
    { id: 6, val: "7", title: "Kementerian", sub: "Dalam Negeri", img: "/assets/Kementerian dalam negeri.png" },
    { id: 7, val: "7", title: "Kementerian", sub: "Pergerakan", img: "/assets/Kementerian Pergerakan.png" },
    { id: 8, val: "8", title: "Kementerian", sub: "Pengembangan Organisasi & Profesionalisme", img: "/assets/Kementerian Pengembangan Organisasi & Profesionalisme.png" },
    { id: 9, val: "6", title: "Kementerian", sub: "Luar Negeri", img: "/assets/Menteri luar neger.png" },
    { id: 10, val: "7", title: "Kementerian", sub: "Media & Informasi", img: "/assets/medinfo.png" },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO MAIN SECTION */}
      <section className="relative w-full min-h-[800px] md:min-h-screen flex items-center justify-center pt-48 pb-32 overflow-hidden">
        {/* Background Image with CSS Mask to fade out the bottom smoothly */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: "url('/assets/background.png')",
            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
          }}
        ></div>
        
        {/* Soft Radial Gradient for text readability without covering the whole image */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.6)_0%,_rgba(0,0,0,0)_60%)] z-0"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-3">
            <span className="font-body text-xs md:text-sm font-black text-black uppercase tracking-widest bg-white rounded-full px-5 py-1.5 shadow-[0_4px_15px_rgba(255,255,255,0.4)]">
              BEM UMS {currentPeriod}
            </span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-5xl sm:text-6xl md:text-8xl uppercase leading-none tracking-tight text-white"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 5px rgba(0,0,0,0.8)' }}
          >
            KABINET <span className="text-primary" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 5px rgba(0,0,0,0.8)' }}>KOLEKTIVA</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <p 
              className="font-display text-lg sm:text-2xl md:text-3xl uppercase text-neutral-100"
              style={{ textShadow: '0 4px 15px rgba(0,0,0,0.9)' }}
            >
              Badan Eksekutif Mahasiswa <br /> Universitas Muhammadiyah Surakarta
            </p>
            <p 
              className="font-body text-sm md:text-base text-neutral-100 leading-relaxed font-medium max-w-2xl mx-auto"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,1)' }}
            >
              Kabinet Kolektiva hadir sebagai wadah kolaborasi aktif dengan semangat kebersamaan, gotong royong, dan kesetaraan untuk memperjuangkan hak mahasiswa dan kemanusiaan.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 pt-6 justify-center"
          >
            <button 
              onClick={() => setActivePage('oprec')}
              className="bg-primary text-white border-2 border-black font-display text-xs md:text-sm px-8 py-3.5 uppercase hover:bg-primary-container shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform flex items-center gap-2"
            >
              <UserCheck size={18} /> GABUNG KABINET
            </button>
            <button 
              onClick={() => setActivePage('struktural')}
              className="bg-black/40 backdrop-blur-md text-white border-2 border-white font-display text-xs md:text-sm px-8 py-3.5 uppercase hover:bg-white/20 transition-colors flex items-center gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
            >
              LIHAT STRUKTURAL <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS CARDS (Carousel Layout) */}
      <section className="w-full relative z-20 pt-2 pb-16 max-w-full">
        {/* Carousel Container */}
        <div className="flex overflow-x-auto no-scrollbar gap-6 snap-x snap-mandatory py-8 px-6 md:px-12 lg:px-20 items-center">
          
          {statCards.map((stat, i) => (
            <motion.div 
              key={stat.id} 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex-none w-[280px] h-[400px] md:w-[300px] md:h-[450px] rounded-[2rem] overflow-hidden bg-black border border-white/20 group hover:scale-105 transition-all duration-500 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_-10px_rgba(220,20,20,0.6)] hover:border-primary/50 snap-center cursor-grab active:cursor-grabbing z-10 hover:z-20"
            >
              {/* Background Logo / Image */}
              <img 
                src={stat.img || "/assets/logo_icon.png"} 
                alt="Logo Background" 
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 pointer-events-none"
              />
              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
              
              {/* Top Right Stat */}
              <div className="absolute top-6 right-6 text-white font-display text-4xl flex items-start gap-1 drop-shadow-lg pointer-events-none">
                {stat.val} <span className="text-primary text-xl">✦</span>
              </div>

              {/* Bottom Text */}
              <div className="absolute bottom-0 left-0 p-8 w-full pointer-events-none">
                <h3 className="text-white font-display text-3xl uppercase leading-none mb-2 drop-shadow-md">{stat.title}</h3>
                <p className="text-neutral-400 font-body text-sm uppercase tracking-widest leading-relaxed">{stat.sub}</p>
              </div>
            </motion.div>
          ))}

        </div>
      </section>

      {/* 3. RECENT ARTICLES PREVIEW (Bento Grid) */}
      <section className="w-full px-6 md:px-12 max-w-7xl mx-auto pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 border-b border-white/20 pb-4">
          <div>
            <h2 className="font-display text-4xl uppercase tracking-tight text-white drop-shadow-lg">ARTIKEL TERBARU</h2>
            <p className="text-xs text-neutral-400 font-body uppercase mt-1 tracking-wider">Rilis Berita, Rilis Gerakan, dan Opini Mahasiswa</p>
          </div>
          <button 
            onClick={() => setActivePage('artikel')}
            className="flex items-center gap-2 text-primary font-display text-sm uppercase hover:text-white transition-colors"
          >
            LIHAT SEMUA ARTIKEL <ArrowRight size={14} />
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
        >
          
          {/* Main Featured Article (Col Span 8) */}
          {recentArticles[0] && (
            <article 
              onClick={() => setActivePage('artikel')}
              className="lg:col-span-8 bg-black/40 backdrop-blur-sm border border-white/10 rounded-[2rem] overflow-hidden hover:-translate-y-2 hover:shadow-[0_0_50px_-10px_rgba(220,20,20,0.4)] hover:border-primary/50 transition-all duration-500 cursor-pointer group flex flex-col"
            >
              <div className="aspect-video md:aspect-[21/9] bg-neutral-900 relative overflow-hidden shrink-0">
                {recentArticles[0].thumbnail ? (
                  <img src={recentArticles[0].thumbnail} alt={recentArticles[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-sm text-neutral-600">NO IMAGES</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>
                <span className="absolute top-6 left-6 bg-primary text-white px-4 py-1.5 text-xs font-display uppercase tracking-widest rounded-full shadow-lg backdrop-blur-md">
                  {recentArticles[0].category}
                </span>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center flex-grow">
                <span className="text-xs text-primary/80 font-bold block mb-3 uppercase tracking-widest">{recentArticles[0].date}</span>
                <h3 className="font-display text-3xl md:text-4xl uppercase leading-tight mb-4 text-white group-hover:text-primary transition-colors">{recentArticles[0].title}</h3>
                <p className="text-sm md:text-base text-neutral-400 line-clamp-3 leading-relaxed mb-6">{recentArticles[0].desc}</p>
                
                <div className="mt-auto text-sm font-display text-neutral-400 flex items-center gap-2 group-hover:text-white transition-colors">
                  BACA SELENGKAPNYA <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </article>
          )}

          {/* Secondary Articles (Col Span 4 Stacked) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
            {recentArticles.slice(1, 3).map(a => (
              <article 
                key={a.id} 
                onClick={() => setActivePage('artikel')}
                className="flex-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_0_40px_-10px_rgba(220,20,20,0.3)] hover:border-primary/50 transition-all duration-500 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="bg-white/10 text-white px-3 py-1.5 text-[10px] font-display uppercase tracking-widest rounded-full group-hover:bg-primary transition-colors">
                      {a.category}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{a.date}</span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl uppercase leading-tight line-clamp-3 mb-3 text-white group-hover:text-primary transition-colors">{a.title}</h3>
                  <p className="text-xs md:text-sm text-neutral-400 line-clamp-2 md:line-clamp-3 leading-relaxed">{a.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-display text-neutral-500 flex items-center gap-2 group-hover:text-white transition-colors">
                  BACA KILAT <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            ))}
          </div>

        </motion.div>
      </section>

      {/* 4. LAYANAN PUBLIK (App Dashboard) */}
      <section className="w-full px-6 md:px-12 max-w-7xl mx-auto mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
        >
          <div className="lg:col-span-5 p-4 md:p-8">
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-none drop-shadow-md text-white mb-6">LAYANAN<br /><span className="text-primary">PUBLIK</span></h2>
            <p className="text-base font-body leading-relaxed text-neutral-400 max-w-sm mb-8">
              Akses cepat ke seluruh layanan interaktif BEM UMS. Sampaikan aspirasi Anda atau jadilah bagian dari pergerakan secara instan.
            </p>
            <div className="flex gap-3 items-center">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(220,20,20,0.8)]"></span>
              <span className="text-xs font-display uppercase tracking-widest text-primary">Sistem Online 24/7 Aktif</span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Lapor Pres Widget */}
            <div 
              onClick={() => window.open('https://portal-layanan-bem-ums.vercel.app/', '_blank')}
              className="group relative p-8 rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-xl hover:bg-black overflow-hidden transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_0_50px_rgba(220,20,20,0.4)] hover:border-primary/50 hover:-translate-y-2 flex flex-col justify-between min-h-[280px]"
            >
              {/* Decorative Background Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-colors duration-500"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10 text-white mb-8 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(220,20,20,0.8)] transition-all duration-500">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="font-display text-3xl uppercase mb-3 text-white">Lapor Pres!</h3>
                <p className="text-sm font-body text-neutral-400 group-hover:text-neutral-300 leading-relaxed transition-colors">
                  Aspirasi dan pengaduan advokasi mahasiswa UMS langsung terhubung ke Ketua BEM.
                </p>
              </div>
              <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs font-display text-primary group-hover:text-white transition-colors">
                BUKA APLIKASI KANAL <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Volunteer Widget */}
            <div 
              onClick={() => setActivePage('volunteer')}
              className="group relative p-8 rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-xl hover:bg-black overflow-hidden transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_0_50px_rgba(220,20,20,0.4)] hover:border-primary/50 hover:-translate-y-2 flex flex-col justify-between min-h-[280px]"
            >
              {/* Decorative Background Glow */}
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-colors duration-500"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center bg-white/5 border border-white/10 text-white mb-8 group-hover:bg-primary group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(220,20,20,0.8)] transition-all duration-500">
                  <Layers size={32} />
                </div>
                <h3 className="font-display text-3xl uppercase mb-3 text-white">Volunteer</h3>
                <p className="text-sm font-body text-neutral-400 group-hover:text-neutral-300 leading-relaxed transition-colors">
                  Daftarkan diri berkontribusi dalam berbagai aksi sosial & pemberdayaan masyarakat.
                </p>
              </div>
              <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs font-display text-primary group-hover:text-white transition-colors">
                GABUNG SEKARANG <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 5. VISI MISI OVERVIEW (Interactive List) */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-24 mb-12"
      >
        <div className="lg:col-span-5 space-y-8 pr-0 lg:pr-8">
          <div className="inline-block">
            <span className="font-display text-xs text-primary uppercase tracking-widest font-bold border border-primary/30 bg-primary/10 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(220,20,20,0.2)]">Nilai Pergerakan</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase leading-none text-white drop-shadow-lg">
            {visiMisi.visi}
          </h2>
          <p className="text-base font-body text-neutral-400 leading-relaxed">
            {visiMisi.desc}
          </p>
          <button 
            onClick={() => setActivePage('visimisi')}
            className="bg-primary text-white rounded-full font-display text-xs px-8 py-4 uppercase hover:bg-white hover:text-black transition-all shadow-[0_4px_20px_rgba(220,20,20,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1"
          >
            EKSPLORASI VISI MISI
          </button>
        </div>

        <div className="lg:col-span-7 group/list flex flex-col gap-4">
          {visiMisi.pillars.map((p, idx) => (
            <div 
              key={p.id} 
              className="flex gap-6 items-center p-6 md:p-8 bg-black/40 backdrop-blur-md rounded-[2rem] border border-white/5 hover:bg-black hover:border-primary/50 transition-all duration-500 group-hover/list:opacity-40 hover:!opacity-100 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(220,20,20,0.3)] cursor-default"
            >
              <div className="w-16 h-16 shrink-0 rounded-[1.5rem] bg-white/5 border border-white/10 text-white font-display text-2xl flex items-center justify-center font-bold relative overflow-hidden group/num transition-colors">
                 {/* Number Glow */}
                 <div className="absolute inset-0 bg-primary opacity-0 group-hover/list:group-hover/num:opacity-30 transition-opacity"></div>
                 0{idx + 1}
              </div>
              <div>
                <h4 className="font-display uppercase text-2xl text-white mb-2">{p.title}</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 6. GALERI PERGERAKAN (Auto-Scrolling Marquee) */}
      <section className="w-full mt-24 mb-16 relative">
        <div className="text-center mb-10 px-6">
          <span className="font-display text-xs text-primary uppercase tracking-widest font-bold border border-primary/30 bg-primary/10 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(220,20,20,0.2)]">Dokumentasi</span>
          <h2 className="font-display text-4xl sm:text-5xl uppercase leading-none text-white mt-6 drop-shadow-md">
            GALERI PERGERAKAN
          </h2>
        </div>
        
        {/* Marquee Wrapper */}
        <div 
          className="relative w-full flex overflow-x-hidden group/marquee py-4"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        >
          <div className="flex animate-marquee whitespace-nowrap shrink-0 gap-6 pr-6">
            {marqueeItems.map((imgSrc, i) => (
              <div key={i} className="w-[280px] md:w-[400px] aspect-[4/3] rounded-[2rem] overflow-hidden shrink-0 border border-white/10 relative group cursor-pointer">
                <img 
                  src={imgSrc} 
                  alt={`Galeri ${i}`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                {/* Subtle dark overlay that lifts on hover */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>
              </div>
            ))}
          </div>
          <div className="flex animate-marquee whitespace-nowrap shrink-0 gap-6 pr-6" aria-hidden="true">
            {marqueeItems.map((imgSrc, i) => (
              <div key={i + 9} className="w-[280px] md:w-[400px] aspect-[4/3] rounded-[2rem] overflow-hidden shrink-0 border border-white/10 relative group cursor-pointer">
                <img 
                  src={imgSrc} 
                  alt={`Galeri ${i}`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ (Accordion) */}
      <section className="w-full px-6 md:px-12 max-w-3xl mx-auto mt-24 mb-32">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl uppercase leading-none text-white drop-shadow-md">
            TANYA JAWAB <span className="text-primary">(FAQ)</span>
          </h2>
        </div>
        <div className="space-y-4">
          {[
            { q: "Bagaimana cara mendaftar Volunteer BEM UMS?", a: "Pendaftaran volunteer dibuka setiap awal semester melalui menu Layanan > Volunteer di website ini. Pastikan Anda menyiapkan CV dan motivation letter." },
            { q: "Apakah pengaduan di Lapor Pres dijamin rahasia?", a: "Ya, sistem Lapor Pres dirancang dengan prinsip anonimitas jika pelapor memintanya. Data pribadi Anda aman bersama kami." },
            { q: "Bagaimana cara berkolaborasi proker dengan BEM UMS?", a: "Organisasi Mahasiswa (Ormawa) dapat mengajukan proposal kolaborasi melalui Kementerian Dalam Negeri BEM UMS atau langsung mengirimkan email ke kontak resmi kami." },
            { q: "Kapan Oprec pengurus BEM UMS dibuka?", a: "Open Recruitment (Oprec) pengurus baru BEM UMS biasanya dibuka satu kali dalam setahun pada awal masa pergantian periode (setelah Pemilu Mahasiswa). Pantau terus halaman Beranda dan Instagram kami." },
            { q: "Di mana letak sekretariat BEM UMS?", a: "Sekretariat BEM UMS berlokasi di Gedung Griya Mahasiswa Lt. 2, Kampus 1 Universitas Muhammadiyah Surakarta. Silakan mampir pada jam kerja operasional untuk berkonsultasi atau bersilaturahmi." },
            { q: "Bagaimana cara agar aspirasi saya cepat didengar?", a: "Cara tercepat adalah melalui fitur 'Lapor Pres' di website ini atau dengan mengikuti forum Audiensi Mahasiswa yang rutin diadakan oleh Kementerian Advokasi & Kesejahteraan Mahasiswa." },
            { q: "Siapa saja yang bisa menjadi bagian dari BEM UMS?", a: "Seluruh mahasiswa aktif UMS yang memenuhi syarat akademik dan telah melalui tahapan seleksi (Oprec) berhak untuk bergabung dan berkontribusi di BEM UMS." },
            { q: "Apakah ada program magang di BEM UMS?", a: "Saat ini kami lebih berfokus pada sistem Volunteer kepanitiaan. Namun, pantau terus media sosial kami karena inovasi program kerja selalu terbuka di periode selanjutnya." }
          ].map((faq, i) => (
            <details key={i} className="group p-6 md:p-8 rounded-[2rem] bg-black/40 backdrop-blur-md border border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer open:bg-black/80">
              <summary className="font-display text-xl md:text-2xl text-white uppercase list-none flex justify-between items-center outline-none">
                {faq.q}
                <span className="text-primary group-open:rotate-45 transition-transform duration-300 text-3xl font-light">+</span>
              </summary>
              <p className="text-sm md:text-base font-body text-neutral-400 mt-6 leading-relaxed pl-4 border-l-2 border-primary">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}


