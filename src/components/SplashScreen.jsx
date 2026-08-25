import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 800); // Beri waktu untuk animasi fade out
    }, 2800); // Tayang selama ~2.8 detik
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center pointer-events-auto select-none"
        >
          <div className="flex flex-col items-center gap-6">
            
            {/* Animasi Bintang Kolektiva */}
            <motion.div
              initial={{ scale: 0, rotate: -220, opacity: 0 }}
              animate={{ scale: [0, 1.15, 1], rotate: [0, 10, 0], opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 1.2,
                delay: 0.2
              }}
              className="w-28 h-28 relative"
            >
              {/* Efek pendaran merah dibelakang bintang */}
              <div className="absolute inset-0 bg-[#b90014] rounded-full filter blur-2xl opacity-40 scale-125" />
              
              <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" xmlns="http://www.w3.org/2000/svg">
                <polygon 
                  points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" 
                  fill="#b90014" 
                  stroke="white" 
                  strokeWidth="4" 
                  strokeLinejoin="round" 
                />
              </svg>
            </motion.div>

            {/* Animasi Teks Kabinet KOLEKTIVA */}
            <div className="text-center mt-2">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
                className="text-white text-5xl md:text-6xl font-display uppercase tracking-widest leading-none"
                style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}
              >
                KOLEKTIVA
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-[#b90014] text-xs font-body tracking-[0.35em] uppercase mt-4 font-black"
              >
                BEM UMS KABINET 2026
              </motion.p>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}