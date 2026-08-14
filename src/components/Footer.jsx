import React from 'react';
import { ArrowRight, Mail, MapPin, Instagram, Youtube, Facebook, AtSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer({ setActivePage }) {
  return (
    <footer className="w-full bg-black text-white pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Background Giant Watermark */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
        whileInView={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 text-[15rem] md:text-[25rem] font-display text-white/5 whitespace-nowrap select-none pointer-events-none z-0"
      >
        KOLEKTIVA
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        


        {/* Middle Section: Links & Info */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20"
        >
          
          {/* Col 1: Logo & Address */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img 
              src="/assets/logo-bem.png" 
              alt="BEM UMS Logo" 
              className="h-24 w-auto object-contain mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setActivePage('beranda')}
            />
            <h3 className="font-display text-xl uppercase mb-2">Sekretariat BEM UMS</h3>
            <p className="text-neutral-400 font-body text-sm leading-relaxed flex items-start justify-center md:justify-start gap-2">
              <MapPin size={16} className="mt-1 shrink-0 text-primary" />
              Gedung Griya Mahasiswa Lt. 2, Kampus 1 Universitas Muhammadiyah Surakarta.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-display text-lg uppercase mb-6 text-white/80">Tautan Cepat</h4>
            <div className="flex flex-col gap-3 font-body text-sm text-neutral-400 text-center md:text-left">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActivePage('visimisi')}>Visi & Misi</span>
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActivePage('struktural')}>Struktural Kabinet</span>
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActivePage('artikel')}>Artikel & Opini</span>
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActivePage('dokumentasi')}>Dokumentasi Kegiatan</span>
            </div>
          </div>

          {/* Col 3: Layanan */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-display text-lg uppercase mb-6 text-white/80">Layanan Mahasiswa</h4>
            <div className="flex flex-col gap-3 font-body text-sm text-neutral-400 text-center md:text-left">
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActivePage('lapor')}>Lapor Pres!</span>
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActivePage('volunteer')}>Pendaftaran Volunteer</span>
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActivePage('oprec')}>Open Recruitment</span>
              <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => setActivePage('hubungi')}>Hubungi Kami</span>
            </div>
          </div>

          {/* Col 4: Socials */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-display text-lg uppercase mb-6 text-white/80">Ikuti Kami</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/bem.ums?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-neutral-400 hover:text-white">
                <Instagram size={18} />
              </a>
              <a href="https://www.threads.com/@bem.ums" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-neutral-400 hover:text-white" title="Threads">
                <AtSign size={18} />
              </a>
              <a href="https://www.instagram.com/bem.ums?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-neutral-400 hover:text-white" title="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/bem.ums?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-neutral-400 hover:text-white">
                <Youtube size={18} />
              </a>
              <a href="mailto:bem@ums.ac.id" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-neutral-400 hover:text-white">
                <Mail size={18} />
              </a>
            </div>
          </div>

        </motion.div>
        
        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left pt-8 border-t border-white/10 text-neutral-500">
          <div className="font-body text-[10px] sm:text-xs uppercase tracking-widest">
            © 2026 BEM UNIVERSITAS MUHAMMADIYAH SURAKARTA. ALL RIGHTS RESERVED.
          </div>
          <div className="font-display text-xs uppercase text-primary tracking-wider flex items-center gap-4">
            <span className="cursor-pointer hover:text-white transition-colors" onClick={() => setActivePage('admin')}>JAJARAN KABINET 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


