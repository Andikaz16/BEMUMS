import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Komponen Bintang Merah Kabinet Kolektiva (Merah dengan outline putih)
const KolektivaStar = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <polygon 
      points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" 
      fill="#b90014" 
      stroke="white" 
      strokeWidth="4" 
      strokeLinejoin="round" 
    />
  </svg>
);

// Bintang Tunggal dengan pergerakan awal langsung di layar
const SingleStar = ({ c, i, isMobile, hoveredIndex, starsRef }) => {
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
          ref={el => starsRef.current[i] = el}
          animate={{ 
            scale: isHovered ? 1.3 : 1, 
            opacity: isHovered ? 0.9 : c.baseOpacity,
            y: isHovered ? -12 : 0,
            rotate: isHovered ? 180 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full h-full"
        >
          <KolektivaStar 
            className={"w-full h-full transition-all duration-300 " + (isHovered ? "drop-shadow-[0_0_20px_rgba(255,0,0,1)]" : "drop-shadow-[0_0_8px_rgba(185,0,20,0.6)]")} 
          />
        </motion.div>
      </motion.div>
    );
  }

  // Awan tipe panning (jalan dari kiri ke kanan)
  const controls = useAnimation();

  useEffect(() => {
    const startXNum = c.startX || -25;
    const distanceToTravel = 125 - startXNum;
    const firstDuration = c.duration * (distanceToTravel / 150);

    controls.start({
      x: '125vw',
      transition: { duration: firstDuration, ease: "linear" }
    }).then(() => {
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
        ref={el => starsRef.current[i] = el}
        animate={{ 
          scale: isHovered ? 1.3 : 1, 
          opacity: isHovered ? 0.9 : c.baseOpacity,
          y: isHovered ? -12 : 0,
          rotate: isHovered ? 180 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-full"
      >
        <KolektivaStar 
          className={"w-full h-full transition-all duration-300 " + (isHovered ? "drop-shadow-[0_0_20px_rgba(255,0,0,1)]" : "drop-shadow-[0_0_8px_rgba(185,0,20,0.6)]")} 
        />
      </motion.div>
    </motion.div>
  );
};

export default function AnimatedBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const starsRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pelacakan kursor di Desktop saat mouse bergerak
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        let found = null;
        for (let i = 0; i < starsRef.current.length; i++) {
          const el = starsRef.current[i];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (
            e.clientX >= rect.left - 20 && e.clientX <= rect.right + 20 &&
            e.clientY >= rect.top - 20 && e.clientY <= rect.bottom + 20
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

  // Data bintang: di HP 3 bintang mengambang, di Desktop 8 bintang (3 stay, 5 jalan)
  const desktopStars = [
    // --- 3 Bintang Stay ---
    { type: 'floating', left: '10%', top: '15%', w: 70, h: 70, baseOpacity: 0.35 },
    { type: 'floating', left: '75%', top: '45%', w: 90, h: 90, baseOpacity: 0.25 },
    { type: 'floating', left: '20%', top: '75%', w: 80, h: 80, baseOpacity: 0.3 },

    // --- 5 Bintang Panning ---
    { type: 'panning', startX: 10, duration: 65, top: '10%', w: 90, h: 90, baseOpacity: 0.25 },
    { type: 'panning', startX: 40, duration: 55, top: '30%', w: 60, h: 60, baseOpacity: 0.3 },
    { type: 'panning', startX: 70, duration: 75, top: '55%', w: 110, h: 110, baseOpacity: 0.2 },
    { type: 'panning', startX: 25, duration: 60, top: '80%', w: 80, h: 80, baseOpacity: 0.3 },
    { type: 'panning', startX: 90, duration: 80, top: '20%', w: 100, h: 100, baseOpacity: 0.2 },
  ];

  const mobileStars = [
    { type: 'floating', left: '8%', top: '12%', w: 55, h: 55, baseOpacity: 0.3 },
    { type: 'floating', left: '70%', top: '45%', w: 65, h: 65, baseOpacity: 0.25 },
    { type: 'floating', left: '15%', top: '75%', w: 60, h: 60, baseOpacity: 0.25 },
  ];

  const activeStars = isMobile ? mobileStars : desktopStars;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transform-gpu">
      {activeStars.map((c, i) => (
        <SingleStar
          key={i}
          c={c}
          i={i}
          isMobile={isMobile}
          hoveredIndex={hoveredIndex}
          starsRef={starsRef}
        />
      ))}
    </div>
  );
}
