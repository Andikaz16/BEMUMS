import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Generates an asymmetrical tube distortion curve to simulate a high-gain guitar amplifier cabinet
 */
function createGuitarDistortion(amount = 75) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    // High-gain overdrive emulation
    curve[i] = ((3 + amount) * x * 38 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

/**
 * Synthesizes an epic, heavy Metal/Rock intro sound
 * Layer 1: Drum Snare & Kick impact slam (at 0.2s)
 * Layer 2: Distorted double-tracked guitar power chord (E chord) (0.22s - 2.5s)
 * Layer 3: High-frequency guitar feedback squeal with vibrato (0.6s - 2.3s)
 */
function playSplashAudio() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Master Compressor/Limiter to pack maximum punch and crunch
    const masterCompressor = ctx.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-6, now);
    masterCompressor.knee.setValueAtTime(10, now);
    masterCompressor.ratio.setValueAtTime(15, now);
    masterCompressor.attack.setValueAtTime(0.001, now);
    masterCompressor.release.setValueAtTime(0.15, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.1, now);

    masterCompressor.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Distortion Cabinet Unit
    const guitarDistortion = ctx.createWaveShaper();
    guitarDistortion.curve = createGuitarDistortion(85);
    guitarDistortion.oversample = '4x';
    guitarDistortion.connect(masterCompressor);

    // =========================================================================
    // LAYER 1: HEAVY Snare + Kick Acoustic Drum Slam (At 0.2s)
    // =========================================================================
    // Snare shell transient (Noise + Mid-range Triangle pop)
    const snareNoiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const channelData = snareNoiseBuffer.getChannelData(0);
    for (let i = 0; i < snareNoiseBuffer.length; i++) {
      channelData[i] = Math.random() * 2 - 1;
    }
    const snareNoiseSource = ctx.createBufferSource();
    snareNoiseSource.buffer = snareNoiseBuffer;

    const snareNoiseFilter = ctx.createBiquadFilter();
    snareNoiseFilter.type = 'bandpass';
    snareNoiseFilter.frequency.setValueAtTime(1000, now + 0.2);
    snareNoiseFilter.Q.setValueAtTime(3.0, now + 0.2);

    const snareNoiseGain = ctx.createGain();
    snareNoiseGain.gain.setValueAtTime(0.0001, now + 0.2);
    snareNoiseGain.gain.linearRampToValueAtTime(0.5, now + 0.205);
    snareNoiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    snareNoiseSource.connect(snareNoiseFilter);
    snareNoiseFilter.connect(snareNoiseGain);
    snareNoiseGain.connect(masterCompressor);

    // Snare tone osc
    const snareOsc = ctx.createOscillator();
    const snareOscGain = ctx.createGain();
    snareOsc.type = 'triangle';
    snareOsc.frequency.setValueAtTime(180, now + 0.2);
    snareOscGain.gain.setValueAtTime(0.0001, now + 0.2);
    snareOscGain.gain.linearRampToValueAtTime(0.35, now + 0.205);
    snareOscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    snareOsc.connect(snareOscGain);
    snareOscGain.connect(masterCompressor);

    // Kick drum thump
    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(160, now + 0.2);
    kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

    kickGain.gain.setValueAtTime(0.0001, now + 0.2);
    kickGain.gain.linearRampToValueAtTime(0.85, now + 0.21);
    kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    kickOsc.connect(kickGain);
    kickGain.connect(masterCompressor);

    // Start Snare & Kick
    snareNoiseSource.start(now + 0.2);
    snareOsc.start(now + 0.2);
    kickOsc.start(now + 0.2);
    snareNoiseSource.stop(now + 0.5);
    snareOsc.stop(now + 0.4);
    kickOsc.stop(now + 0.8);

    // =========================================================================
    // LAYER 2: DISTORTED GUITAR POWER CHORD SLAM (0.22s - 2.5s)
    // =========================================================================
    // E minor / E power chord frequencies
    // E1 = 41.2Hz, E2 = 82.4Hz, B2 = 123.47Hz, E3 = 164.81Hz, B3 = 246.94Hz, E4 = 329.63Hz
    const powerChord = [41.20, 82.41, 123.47, 164.81, 246.94, 329.63];

    powerChord.forEach((freq, idx) => {
      // Detune pair to simulate fat, double-tracked heavy guitars
      [-7, 7].forEach((detuneVal) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + 0.22);
        osc.detune.setValueAtTime(detuneVal, now + 0.22);

        // Lowpass filter simulates the guitar cabinet tone control
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(4.0, now + 0.22);
        filter.frequency.setValueAtTime(2500, now + 0.22);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 1.2);
        filter.frequency.exponentialRampToValueAtTime(800, now + 2.4);

        gain.gain.setValueAtTime(0.0001, now + 0.22);
        // Stagger guitar attack slightly for natural string strumming effect
        const strumDelay = 0.22 + idx * 0.015;
        gain.gain.linearRampToValueAtTime(0.18 / (idx + 1.2), now + strumDelay + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(guitarDistortion); // Route into high-gain cabinet distortion

        osc.start(now + strumDelay);
        osc.stop(now + 2.6);
      });
    });

    // =========================================================================
    // LAYER 3: GUITAR FEEDBACK / PINCH HARMONIC SQUEAL (0.6s - 2.3s)
    // =========================================================================
    const squealOsc = ctx.createOscillator();
    const squealGain = ctx.createGain();
    const squealFilter = ctx.createBiquadFilter();

    squealOsc.type = 'sine';
    squealOsc.frequency.setValueAtTime(987.77, now + 0.6); // B5 string harmonic

    // Add vibrato LFO for screaming guitar feedback vibrato effect
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.5, now); // 5.5Hz vibrato speed
    lfoGain.gain.setValueAtTime(18, now); // Vibrato depth (amount of frequency shift)

    lfo.connect(lfoGain);
    lfoGain.connect(squealOsc.frequency);

    squealFilter.type = 'bandpass';
    squealFilter.Q.setValueAtTime(2.0, now + 0.6);
    squealFilter.frequency.setValueAtTime(1200, now + 0.6);

    squealGain.gain.setValueAtTime(0.0001, now + 0.6);
    squealGain.gain.linearRampToValueAtTime(0.07, now + 1.0);
    squealGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

    squealOsc.connect(squealFilter);
    squealFilter.connect(squealGain);
    squealGain.connect(guitarDistortion); // Feed feedback squeal through high-gain distortion too!

    lfo.start(now);
    squealOsc.start(now + 0.6);

    lfo.stop(now + 2.4);
    squealOsc.stop(now + 2.4);

  } catch (err) {
    console.debug('Audio error:', err);
  }
}

export default function SplashScreen({ onComplete }) {
  const [show, setShow] = useState(true);
  const audioPlayedRef = useRef(false);

  useEffect(() => {
    // Initial audio trigger
    if (!audioPlayedRef.current) {
      playSplashAudio();
      audioPlayedRef.current = true;
    }

    const handleFirstInteraction = () => {
      if (!audioPlayedRef.current) {
        playSplashAudio();
        audioPlayedRef.current = true;
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 800); // Beri waktu untuk animasi fade out
    }, 2800); // Tayang selama ~2.8 detik

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [onComplete]);

  const handleDismiss = () => {
    setShow(false);
    setTimeout(onComplete, 800);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onClick={() => {
            if (!audioPlayedRef.current) {
              playSplashAudio();
              audioPlayedRef.current = true;
            }
          }}
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center pointer-events-auto select-none overflow-hidden cursor-pointer"
        >
          {/* Center Branding Area */}
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