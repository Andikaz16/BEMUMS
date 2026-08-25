import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000] to-black opacity-90" />
      
      {/* Moving cloud 1 (Reddish) */}
      <motion.div
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['-10%', '10%', '-10%'],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#590000] mix-blend-screen filter blur-[120px] opacity-30"
      />

      {/* Moving cloud 2 (Darker Red) */}
      <motion.div
        animate={{
          x: ['20%', '-20%', '20%'],
          y: ['10%', '-10%', '10%'],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#3b0505] mix-blend-screen filter blur-[120px] opacity-50"
      />
      
      {/* Moving cloud 3 (Subtle Accent) */}
      <motion.div
        animate={{
          x: ['0%', '10%', '-10%', '0%'],
          y: ['10%', '0%', '-10%', '10%'],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-[#8b0000] mix-blend-screen filter blur-[150px] opacity-20"
      />
      
      {/* Noise overlay for texture (Membuatnya terlihat lebih elegan) */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    </div>
  );
}
