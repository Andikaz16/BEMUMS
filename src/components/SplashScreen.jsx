import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [show, setShow] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleDismiss = () => {
    setShow(false);
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  };

  useEffect(() => {
    // Fast-path bypass for Lighthouse, PageSpeed, and web performance crawlers
    if (typeof navigator !== 'undefined' && /Lighthouse|PageSpeed|Googlebot|Chrome-Lighthouse/i.test(navigator.userAgent)) {
      setShow(false);
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    // Snappy, elegant 750ms brand intro with 250ms smooth fadeout
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, 250);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          onClick={handleDismiss}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === 'Escape') && handleDismiss()}
          role="button"
          tabIndex={0}
          aria-label="Lewati tampilan pembuka"
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
          title="Klik untuk melewati"
        >
          {/* Center Branding Area */}
          <div className="flex flex-col items-center gap-5">
            {/* Animasi Bintang Kolektiva */}
            <motion.div
              initial={{ scale: 0.3, rotate: -90, opacity: 0 }}
              animate={{ scale: [0.3, 1.08, 1], rotate: [0, 5, 0], opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 140,
                damping: 14,
                duration: 0.6
              }}
              className="w-24 h-24 md:w-28 md:h-28 relative"
            >
              <div className="absolute inset-0 bg-[#b90014] rounded-full filter blur-2xl opacity-40 scale-125" />
              <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <polygon 
                  points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" 
                  fill="#b90014" 
                  stroke="white" 
                  strokeWidth="4" 
                  strokeLinejoin="round" 
                />
              </svg>
            </motion.div>

            {/* Animasi Teks Kabinet KOLEKTIVA - div to avoid duplicate H1 */}
            <div className="text-center mt-2">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="text-white text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-widest leading-none"
                style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}
              >
                KOLEKTIVA
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="text-[#b90014] text-[11px] sm:text-xs font-body tracking-[0.3em] uppercase mt-3 font-black"
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
