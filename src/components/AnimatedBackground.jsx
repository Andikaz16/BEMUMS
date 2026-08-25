import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Awan Tipe 1 (Original)
const AkatsukiCloud1 = ({ className }) => (
  <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M50,90 C30,90 10,75 20,50 C25,35 40,30 50,40 C55,15 90,5 110,30 C140,10 180,30 170,60 C190,75 180,100 160,95 C150,115 110,115 100,95 C80,105 55,100 50,90 Z" 
      fill="#b90014" stroke="white" strokeWidth="4" strokeLinejoin="round" 
    />
    <path d="M20,50 C30,40 40,60 30,70" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M170,60 C160,50 150,70 160,80" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Awan Tipe 2 (Lebih panjang dan landai)
const AkatsukiCloud2 = ({ className }) => (
  <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M30,80 C5,80 -5,55 15,40 C20,25 45,20 55,30 C60,5 110,0 130,25 C160,15 190,30 185,55 C205,65 190,95 160,90 C150,110 90,110 80,90 C60,100 40,95 30,80 Z" 
      fill="#b90014" stroke="white" strokeWidth="4" strokeLinejoin="round" 
    />
    <path d="M15,40 C25,30 45,45 35,55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Awan Tipe 3 (Berlawanan arah / Flipped & Gemuk)
const AkatsukiCloud3 = ({ className }) => (
  <svg viewBox="0 0 200 120" className={className} xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M150,90 C170,90 190,75 180,50 C175,35 160,30 150,40 C145,15 110,5 90,30 C60,10 20,30 30,60 C10,75 20,100 40,95 C50,115 90,115 100,95 C120,105 145,100 150,90 Z" 
      fill="#b90014" stroke="white" strokeWidth="4" strokeLinejoin="round" 
    />
    <path d="M180,50 C170,40 160,60 170,70" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <path d="M30,60 C40,50 50,70 40,80" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Awan Tunggal untuk performa tinggi & pergerakan awal langsung di layar
const SingleCloud = ({ c, i, isMobile, hoveredIndex, cloudsRef }) => {
  const isHovered = !isMobile && hoveredIndex === i;

  if (c.type === 'floating') {
    return (
      <motion.div
        className="absolute"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: c.top, left: c.left, width: c.w, height: c.h, willChange: 'transform' }}
      >
        <motion.div
          ref={el => cloudsRef.current[i] = el}
          animate={{ 
            scale: isHovered ? 1.25 : 1, 
            opacity: isHovered ? 0.8 : c.baseOpacity,
            y: isHovered ? -12 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full h-full"
        >
          <c.Component 
            className={"w-full h-full transition-all duration-300 " + (isHovered ? "drop-shadow-[0_0_18px_rgba(255,0,0,0.9)]" : "drop-shadow-[0_0_8px_rgba(185,0,20,0.6)]")} 
          />
        </motion.div>
      </motion.div>
    );
  }

  // Awan tipe panning (jalan dari kiri ke kanan)
  // c.startX menentukan posisi awal layar (misal: 10vw, 40vw, dll) agar langsung muncul ketika dibuka
  const controls = useAnimation();

  useEffect(() => {
    const startXNum = c.startX || -25;
    const distanceToTravel = 125 - startXNum;
    const firstDuration = c.duration * (distanceToTravel / 150);

    controls.start({
      x: '125vw',
      transition: { duration: firstDuration, ease: "linear" }
    }).then(() => {
      // Setel ulang posisi ke sebelah kiri luar layar (-25vw) lalu mulai loop infinity
      controls.set({ x: '-25vw' });
      controls.start({
        x: '125vw',
        transition: { duration: c.duration, repeat: Infinity, ease: "linear" }
      });
    });
    
    return () => controls.stop();
  }, [controls, c.duration, c.startX]);

  return (
    <motion.div
      initial={{ x: `${c.startX || -25}vw` }}
      animate={controls}
      className="absolute"
      style={{ top: c.top, width: c.w, height: c.h, willChange: 'transform' }}
    >
      <motion.div
        ref={el => cloudsRef.current[i] = el}
        animate={{ 
          scale: isHovered ? 1.25 : 1, 
          opacity: isHovered ? 0.8 : c.baseOpacity,
          y: isHovered ? -12 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-full"
      >
        <c.Component 
          className={"w-full h-full transition-all duration-300 " + (isHovered ? "drop-shadow-[0_0_18px_rgba(255,0,0,0.9)]" : "drop-shadow-[0_0_8px_rgba(185,0,20,0.6)]")} 
        />
      </motion.div>
    </motion.div>
  );
};

export default function AnimatedBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const cloudsRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hanya jalankan pelacakan kursor di Desktop saat mouse BENAR-BENAR bergerak (bukan loop 60fps terus menerus)
  useEffect(() => {
    if (isMobile) return; // Nonaktifkan total di HP untuk menghemat baterai & performa maksimal

    const handleMouseMove = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        let found = null;
        for (let i = 0; i < cloudsRef.current.length; i++) {
          const el = cloudsRef.current[i];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (
            e.clientX >= rect.left - 25 && e.clientX <= rect.right + 25 &&
            e.clientY >= rect.top - 25 && e.clientY <= rect.bottom + 25
          ) {
            found = i;
            break;
          }
        }
        setHoveredIndex(found);
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  // Data awan: di HP hanya tampilkan 3 awan mengambang ringan, di Desktop tampilkan 8
  const desktopClouds = [
    // --- 3 Awan Stay (Mengambang di tempat) ---
    { type: 'floating', left: '10%', top: '15%', w: 140, h: 84, baseOpacity: 0.35, Component: AkatsukiCloud1 },
    { type: 'floating', left: '75%', top: '45%', w: 180, h: 108, baseOpacity: 0.25, Component: AkatsukiCloud2 },
    { type: 'floating', left: '20%', top: '75%', w: 150, h: 90, baseOpacity: 0.3, Component: AkatsukiCloud3 },

    // --- 5 Awan Panning (Lewat perlahan dari kiri ke kanan) ---
    // startX mendistribusikan awan agar langsung muncul secara acak saat web dibuka
    { type: 'panning', startX: 10, duration: 65, top: '10%', w: 200, h: 120, baseOpacity: 0.25, Component: AkatsukiCloud1 },
    { type: 'panning', startX: 40, duration: 55, top: '30%', w: 150, h: 90, baseOpacity: 0.3, Component: AkatsukiCloud2 },
    { type: 'panning', startX: 70, duration: 75, top: '55%', w: 250, h: 150, baseOpacity: 0.2, Component: AkatsukiCloud3 },
    { type: 'panning', startX: 25, duration: 60, top: '80%', w: 180, h: 110, baseOpacity: 0.3, Component: AkatsukiCloud2 },
    { type: 'panning', startX: 90, duration: 80, top: '20%', w: 220, h: 130, baseOpacity: 0.2, Component: AkatsukiCloud1 },
  ];

  const mobileClouds = [
    { type: 'floating', left: '8%', top: '12%', w: 110, h: 66, baseOpacity: 0.3, Component: AkatsukiCloud1 },
    { type: 'floating', left: '70%', top: '45%', w: 130, h: 78, baseOpacity: 0.25, Component: AkatsukiCloud2 },
    { type: 'floating', left: '15%', top: '75%', w: 120, h: 72, baseOpacity: 0.25, Component: AkatsukiCloud3 },
  ];

  const activeClouds = isMobile ? mobileClouds : desktopClouds;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transform-gpu">
      {activeClouds.map((c, i) => (
        <SingleCloud
          key={i}
          c={c}
          i={i}
          isMobile={isMobile}
          hoveredIndex={hoveredIndex}
          cloudsRef={cloudsRef}
        />
      ))}
    </div>
  );
}
