import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Share2, MessageCircle, ExternalLink, Navigation } from 'lucide-react';

export default function HubungiKami({ db }) {
  const contact = db.contact || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-10 lg:px-20 text-white relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/20 to-transparent opacity-50 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white drop-shadow-lg">
              Hubungi <span className="text-primary">Kami</span>
            </h1>
            <p className="font-body text-neutral-400 mt-4 max-w-2xl text-lg md:text-xl">
              Saluran resmi komunikasi & hubungan masyarakat BEM UMS.
            </p>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Digital Contact Channels */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Box 1: WhatsApp */}
            <motion.div variants={itemVariants} className="group relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-neutral-800/50 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden hover:border-emerald-500/50 transition-colors duration-500 shadow-xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
                  <MessageCircle size={24} />
                </div>
                <h3 className="font-heading font-extrabold uppercase text-2xl tracking-tight text-white mb-2">WhatsApp</h3>
                <p className="text-sm text-neutral-400 font-body leading-relaxed mb-6">Konsultasi cepat atau pertanyaan ringan seputar BEM UMS.</p>
              </div>
              <a 
                href={contact.whatsapp} 
                target="_blank" 
                rel="noreferrer" 
                className="relative z-10 flex items-center justify-center gap-2 w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-600/30 hover:border-transparent font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all duration-300"
              >
                Kirim Pesan <ExternalLink size={14} />
              </a>
            </motion.div>

            {/* Box 2: Email */}
            <motion.div variants={itemVariants} className="group relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-neutral-800/50 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden hover:border-blue-500/50 transition-colors duration-500 shadow-xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-700"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-950/30 border border-blue-900/50 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <Mail size={24} />
                </div>
                <h3 className="font-heading font-extrabold uppercase text-2xl tracking-tight text-white mb-2">Surel Resmi</h3>
                <p className="text-sm text-neutral-400 font-body leading-relaxed mb-6">Untuk keperluan persuratan, kemitraan, dan proposal formal.</p>
              </div>
              <a 
                href={`mailto:${contact.email}`} 
                className="relative z-10 flex items-center justify-center gap-2 w-full bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-600/30 hover:border-transparent font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all duration-300"
              >
                Kirim Email <ExternalLink size={14} />
              </a>
            </motion.div>

            {/* Box 3: Social Media */}
            <motion.div variants={itemVariants} className="sm:col-span-2 group relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-neutral-800/50 rounded-[2rem] p-8 overflow-hidden hover:border-purple-500/50 transition-colors duration-500 shadow-xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-700"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
                <div className="text-center md:text-left flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-purple-950/30 border border-purple-900/50 flex items-center justify-center mb-6 text-purple-400 mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <Share2 size={24} />
                  </div>
                  <h3 className="font-heading font-extrabold uppercase text-2xl tracking-tight text-white mb-2">Media Sosial</h3>
                  <p className="text-sm text-neutral-400 font-body leading-relaxed max-w-sm mx-auto md:mx-0">Ikuti aktivitas, infografis harian, dan live update agenda kampus BEM UMS.</p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-48 shrink-0">
                  <a 
                    href="https://www.instagram.com/bem.ums?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600 hover:to-pink-600 text-pink-400 hover:text-white border border-pink-500/30 hover:border-transparent font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all duration-300"
                  >
                    Instagram <ExternalLink size={14} />
                  </a>
                  <a 
                    href="https://www.threads.com/@bem.ums" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-center gap-2 w-full bg-neutral-800/50 hover:bg-neutral-100 text-neutral-300 hover:text-black border border-neutral-700 hover:border-transparent font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all duration-300"
                  >
                    Threads <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Address Box */}
          <motion.div variants={itemVariants} className="lg:col-span-5 group relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-neutral-800/50 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between overflow-hidden hover:border-primary/50 transition-colors duration-500 shadow-xl h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(185,0,20,0.1)]">
                  <MapPin size={24} />
                </div>
                <h3 className="font-heading font-extrabold uppercase text-3xl tracking-tight text-white mb-4">Sekretariat</h3>
                <p className="text-base text-neutral-400 font-body leading-relaxed mb-8 border-l-2 border-primary/30 pl-4">
                  {contact.address}
                </p>
              </div>
              
              {/* Google Maps Iframe */}
              <div className="mt-auto relative rounded-2xl overflow-hidden border border-neutral-800 group-hover:border-primary/30 transition-colors duration-500 h-48 md:h-64">
                <iframe 
                  src="https://maps.google.com/maps?q=Griya%20Mahasiswa%20UMS&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Griya Mahasiswa UMS"
                ></iframe>
                
                {/* Overlay link to open in new tab */}
                <a 
                  href="https://www.google.com/maps/search/Griya+Mahasiswa+UMS" 
                  target="_blank" 
                  rel="noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-300 z-10"
                >
                  <span className="bg-primary text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Buka di Aplikasi Maps <ExternalLink size={14} />
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}








