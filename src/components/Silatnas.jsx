import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, CheckCircle, X, Users, MapPin, Globe, 
  Download, Phone, HelpCircle, FileText, ChevronDown, 
  Award, Clock, CheckSquare, Sparkles, Send, GraduationCap
} from 'lucide-react';
import { addSilatnasApplicant } from '../db';

const faqData = [
  {
    q: "Kapan pelaksanaan Silatnas BEM UMS 2026?",
    a: "Pelaksanaan Silatnas dijadwalkan pada pertengahan tahun 2026. Tanggal pasti, tempat pelaksanaan, dan tentative rundown dapat Anda pantau melalui dokumen TOR Silatnas di bawah."
  },
  {
    q: "Siapa saja yang diperbolehkan mendaftar sebagai delegasi?",
    a: "Delegasi terbuka untuk seluruh pengurus inti BEM (Presiden Mahasiswa, Wakil Presiden Mahasiswa, jajaran Menteri, maupun Staff delegasi resmi) dari Perguruan Tinggi se-Indonesia."
  },
  {
    q: "Apakah pendaftaran dikenakan biaya (HTM)?",
    a: "Biaya pendaftaran, konsumsi, akomodasi, dan fasilitas delegasi disesuaikan dengan paket kegiatan yang dipilih. Detail rincian kontribusi delegasi dapat dilihat di dalam berkas TOR Silatnas."
  },
  {
    q: "Bagaimana cara melakukan verifikasi setelah mendaftar online?",
    a: "Setelah mengisi formulir pendaftaran di portal ini, panitia akan mengirimkan pesan konfirmasi via WhatsApp dalam waktu 1x24 jam berisi panduan verifikasi administrasi dan bukti pembayaran."
  }
];

const timelineData = [
  {
    day: "Hari 1",
    title: "Registrasi & Welcoming Dinner",
    desc: "Penyambutan delegasi dari seluruh Indonesia, verifikasi ulang berkas fisik, dan makan malam bersama jajaran rektorat UMS."
  },
  {
    day: "Hari 2",
    title: "Opening Ceremony & Seminar Nasional",
    desc: "Seminar kebangsaan menghadirkan tokoh nasional, diikuti dengan konsolidasi awal dan pembagian komisi sidang."
  },
  {
    day: "Hari 3",
    title: "Sidang Komisi & Perumusan Resolusi",
    desc: "Pembahasan isu strategis kebangsaan, perumusan hasil rekomendasi BEM se-Indonesia, dan malam deklarasi bersama."
  },
  {
    day: "Hari 4",
    title: "Field Trip & Closing Ceremony",
    desc: "Kunjungan budaya ke tempat bersejarah di Surakarta (Solo), dilanjutkan dengan malam keakraban, pembagian sertifikat, dan penutupan resmi."
  }
];

export default function Silatnas({ db }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', campus: '', jabatan: '', nowa: '', motivasi: '' });
  const [extraFields, setExtraFields] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(1);

  // Preload and animate mascot frames
  useEffect(() => {
    for (let i = 1; i <= 9; i++) {
      const img = new Image();
      img.src = `/assets/frame_maskot/${i}-removebg-preview.png`;
    }

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev % 9) + 1);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const catalog = db.silatnasCatalog || [];

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const applicantData = { ...formData, ...extraFields, submittedAt: new Date().toISOString() };
      await addSilatnasApplicant(selectedEvent.id, applicantData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pendaftaran, pastikan koneksi internet stabil lalu coba lagi.");
    }
  };

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
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-10 lg:px-20 text-white relative overflow-hidden bg-gradient-to-br from-[#082F49] via-[#0369A1] to-[#0EA5E9]">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-white/20 to-transparent opacity-50 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0369A1]/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* 1. HERO SECTION (FULL SCREEN FOLD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-7rem)] pb-12">
          <motion.div 
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2">
              <span className="flex items-center gap-2 text-xs font-bold font-body text-white drop-shadow-md uppercase tracking-widest bg-white/10 border border-white/20 px-4 py-2 rounded-full">
                <Globe className="w-4 h-4 animate-spin-slow" /> Silaturahmi Nasional 2026
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white drop-shadow-lg leading-tight">
              PORTAL UTAMA <br/>
              <span className="text-[#38BDF8] drop-shadow-md">SILATNAS BEM PTMAI</span>
            </h1>
            <p className="font-body text-[#E0F2FE] mt-4 max-w-2xl text-base md:text-lg leading-relaxed font-medium">
              Selamat datang di portal informasi dan pendaftaran Silaturahmi Nasional BEM se-Indonesia. Wadah resmi konsolidasi ide, kolaborasi strategis, dan persatuan ukhuwah gerakan mahasiswa nasional.
            </p>
            
            {/* Core Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-2xl">
              <div className="bg-black/35 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#BAE6FD] font-bold">Waktu Kegiatan</div>
                  <div className="text-xs font-heading font-bold text-white mt-0.5">30 September - 3 Oktober 2026</div>
                </div>
              </div>
              
              <div className="bg-black/35 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#BAE6FD] font-bold">Lokasi Utama</div>
                  <div className="text-xs font-heading font-bold text-white mt-0.5">Kampus UMS, Solo</div>
                </div>
              </div>

              <div className="bg-black/35 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#BAE6FD] font-bold">Total Kampus</div>
                  <div className="text-xs font-heading font-bold text-white mt-0.5">172 Kampus</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Animated Silatnas Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 35 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex justify-center"
          >
            <motion.img 
              src="/assets/logo_silatnas.png" 
              alt="Logo Silatnas" 
              className="w-80 h-80 md:w-[420px] md:h-[420px] object-contain relative"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* MASCOT SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center space-y-4 pt-12"
        >
          <img 
            src={`/assets/frame_maskot/${currentFrame}-removebg-preview.png`} 
            alt="Maskot Silatnas" 
            className="w-56 md:w-64 h-[300px] md:h-[380px] object-contain"
          />
          <div className="space-y-1">
            <h3 className="text-lg font-heading font-bold uppercase tracking-widest text-[#38BDF8]">Maskot Resmi Silatnas</h3>
            <p className="text-xs text-[#E0F2FE]/60 font-body max-w-md">
              Representasi ketangguhan, persatuan, dan intelektualisme mahasiswa Indonesia dalam menyongsong Silaturahmi Nasional 2026.
            </p>
          </div>
        </motion.div>

        {/* 2. TENTANG SILATNAS & VISI MISI */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              Visi & Misi Konsolidasi
            </h2>
            <p className="text-[#E0F2FE] font-body text-sm max-w-xl mx-auto mt-2 font-medium">
              Tujuan dan prinsip gerakan Silaturahmi Nasional BEM PTMAI 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/35 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#38BDF8]/40 transition duration-300 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/30 flex items-center justify-center text-[#38BDF8]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold uppercase text-white">Visi Kolaboratif</h3>
              <p className="text-sm font-body text-[#E0F2FE]/80 leading-relaxed">
                Menciptakan ruang dialog nasional yang terbuka dan konstruktif guna merumuskan rekomendasi kritis terhadap arah kebijakan nasional demi memperjuangkan hak-hak kesejahteraan masyarakat umum.
              </p>
            </div>

            <div className="bg-black/35 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#38BDF8]/40 transition duration-300 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/30 flex items-center justify-center text-[#38BDF8]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold uppercase text-white">Ukhuwah Gerakan</h3>
              <p className="text-sm font-body text-[#E0F2FE]/80 leading-relaxed">
                Mempererat jalinan tali persaudaraan intelektual antar seluruh pengurus BEM se-Indonesia, menyelaraskan persepsi isu, serta membangun solidaritas aliansi gerakan yang independen.
              </p>
            </div>
          </div>
        </div>

        {/* 3. ALUR PENDAFTARAN */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              Alur Pendaftaran Delegasi
            </h2>
            <p className="text-[#E0F2FE] font-body text-sm max-w-xl mx-auto mt-2 font-medium">
              Ikuti 4 langkah mudah berikut untuk mendaftarkan delegasi kampus Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Pilih Agenda", desc: "Cari agenda Silatnas aktif di bagian pendaftaran portal ini." },
              { step: "02", title: "Isi Formulir", desc: "Isi data delegasi, nomor WhatsApp, serta motivasi pendaftaran." },
              { step: "03", title: "Verifikasi Berkas", desc: "Panitia akan menghubungi Anda dalam 24 jam untuk verifikasi administrasi." },
              { step: "04", title: "Gabung Grup", desc: "Masuk grup resmi koordinasi delegasi untuk informasi akomodasi." }
            ].map((step, idx) => (
              <div key={idx} className="relative bg-black/35 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-3 shadow-xl">
                <div className="text-4xl font-heading font-black text-white/5 absolute top-4 right-4">{step.step}</div>
                <div className="w-8 h-8 rounded-full bg-[#0EA5E9]/20 text-[#38BDF8] flex items-center justify-center font-heading font-bold text-xs border border-[#0EA5E9]/30">
                  {idx + 1}
                </div>
                <h4 className="text-lg font-heading font-bold text-white uppercase">{step.title}</h4>
                <p className="text-xs font-body text-[#E0F2FE]/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. AGENDA KEGIATAN & TIMELINE */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              Agenda & Rangkaian Acara
            </h2>
            <p className="text-[#E0F2FE] font-body text-sm max-w-xl mx-auto mt-2 font-medium">
              Jadwal pelaksanaan tentatif Silatnas BEM se-Indonesia selama 4 hari penuh.
            </p>
          </div>

          <div className="relative border-l border-white/20 ml-4 md:ml-12 space-y-8 max-w-4xl mx-auto">
            {timelineData.map((item, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12 group">
                {/* Dot */}
                <div className="absolute left-[-6px] top-1 w-3 h-3 rounded-full bg-[#38BDF8] border-4 border-[#0369A1] group-hover:scale-125 transition duration-300"></div>
                <div className="space-y-2">
                  <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-[#0EA5E9]/20 border border-[#0EA5E9]/30 text-[#38BDF8] px-2.5 py-1 rounded-md">
                    {item.day}
                  </span>
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-[#38BDF8] transition duration-300 uppercase">
                    {item.title}
                  </h3>
                  <p className="text-sm font-body text-[#E0F2FE]/80 leading-relaxed max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. AGENDA PENDAFTARAN AKTIF (CATALOG DATABASE) */}
        <div className="space-y-10 pt-10 border-t border-white/10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              Agenda Pendaftaran Aktif
            </h2>
            <p className="text-[#E0F2FE] font-body text-sm max-w-xl mx-auto mt-2 font-medium">
              Formulir pendaftaran resmi yang dibuka untuk delegasi di bawah ini.
            </p>
          </div>

          {catalog.length === 0 ? (
            <div className="max-w-xl mx-auto text-center">
              <div className="bg-black/35 backdrop-blur-xl border border-white/10 rounded-3xl p-10 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-bold text-neutral-300 uppercase">Pendaftaran Belum Dibuka</h3>
                <p className="text-xs font-body text-[#E0F2FE]/60 leading-relaxed">
                  Saat ini belum ada agenda pendaftaran aktif dari admin BEM UMS. Silakan unduh dokumen panduan (TOR) di bawah untuk memantau jadwal pembukaan berikutnya.
                </p>
              </div>
            </div>
          ) : (
            <div className={catalog.length === 1 ? "max-w-2xl mx-auto w-full" : "grid grid-cols-1 md:grid-cols-2 gap-8 items-start"}>
              {catalog.map(v => (
                <div 
                  key={v.id} 
                  className="group relative bg-black/35 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between overflow-hidden hover:border-[#38BDF8]/40 transition duration-300 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <span className="flex items-center gap-2 text-[10px] font-bold font-body text-neutral-300 uppercase tracking-widest bg-black/40 border border-white/10 px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                      {v.schedule}
                    </span>
                    <span className={`px-4 py-1 font-bold text-[10px] uppercase tracking-widest rounded-full border ${
                      v.isOpen 
                        ? 'bg-emerald-950/35 text-emerald-400 border-emerald-900/50' 
                        : 'bg-red-950/35 text-red-400 border-red-900/50'
                    }`}>
                      {v.isOpen ? 'DIBUKA' : 'DITUTUP'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-heading font-extrabold uppercase tracking-tight text-white mb-6">
                    {v.title}
                  </h3>
                  
                  <div className="space-y-4 mb-8 text-sm">
                    {v.location && (
                      <div>
                        <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-300 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" /> Lokasi Pelaksanaan
                        </h4>
                        <p className="text-xs font-body text-[#E0F2FE]/80 leading-relaxed bg-black/35 p-4 rounded-xl border border-white/5">
                          {v.location}
                        </p>
                      </div>
                    )}
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-300 mb-2">
                        <Users className="w-3.5 h-3.5 text-[#38BDF8]" /> Deskripsi Pendaftaran
                      </h4>
                      <p className="text-xs font-body text-[#E0F2FE]/80 leading-relaxed bg-black/35 p-4 rounded-xl border border-white/5">
                        {v.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    {v.isOpen ? (
                      <button 
                        onClick={() => {
                          setSelectedEvent(v);
                          setSubmitted(false);
                          setFormData({ name: '', campus: '', jabatan: '', nowa: '', motivasi: '' });
                          setExtraFields({});
                        }}
                        className="w-full bg-[#0EA5E9] hover:bg-[#0369A1] text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                      >
                        Buka Formulir Pendaftaran
                      </button>
                    ) : (
                      <button 
                        disabled 
                        className="w-full bg-black/40 border border-white/5 text-neutral-600 font-bold uppercase tracking-widest text-xs py-4 rounded-xl cursor-not-allowed"
                      >
                        Pendaftaran Ditutup
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. UNDUHAN DOKUMEN PENTING */}
        <div className="space-y-10 pt-10 border-t border-white/10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              Dokumen & Panduan Penting
            </h2>
            <p className="text-[#E0F2FE] font-body text-sm max-w-xl mx-auto mt-2 font-medium">
              Unduh kelengkapan administrasi resmi yang dibutuhkan selama proses kegiatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Rundown Acara", desc: "Rincian tentatif jadwal kegiatan lengkap selama 4 hari.", size: "PDF (1.2 MB)" },
              { title: "Term of Reference (TOR)", desc: "Term of reference, tata tertib, dan syarat administrasi delegasi.", size: "PDF (2.5 MB)" },
              { title: "Surat Undangan Resmi", desc: "Format surat undangan resmi untuk birokrasi perizinan kampus.", size: "DOCX (850 KB)" }
            ].map((doc, idx) => (
              <div key={idx} className="bg-black/35 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-[#38BDF8]/40 transition duration-300 shadow-xl">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#38BDF8]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-heading font-bold text-white uppercase">{doc.title}</h4>
                  <p className="text-xs font-body text-[#E0F2FE]/70 leading-relaxed">{doc.desc}</p>
                </div>
                <div className="pt-6">
                  <button 
                    onClick={() => alert(`Unduhan ${doc.title} simulasi berhasil dilakukan.`)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-black/40 border border-white/5 hover:border-[#0EA5E9]/40 text-neutral-300 font-bold uppercase tracking-widest text-[10px] py-3.5 rounded-xl transition duration-300"
                  >
                    <Download className="w-3.5 h-3.5 text-[#38BDF8]" /> Unduh Berkas ({doc.size})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. FAQ (PERTANYAAN UMUM) */}
        <div className="space-y-10 pt-10 border-t border-white/10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="text-[#E0F2FE] font-body text-sm max-w-xl mx-auto mt-2 font-medium">
              Jawaban atas beberapa pertanyaan mendasar mengenai agenda Silatnas.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-black/25 border border-white/10 rounded-2xl overflow-hidden transition duration-300 hover:border-white/20"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none"
                >
                  <span className="font-heading font-bold text-sm md:text-base text-white uppercase tracking-tight leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[#38BDF8] transition-transform duration-300 shrink-0 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 border-t border-white/5 pt-4 text-xs md:text-sm font-body text-[#E0F2FE]/70 leading-relaxed bg-black/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* 8. HELPDESK & KONTAK PERSON */}
        <div className="bg-gradient-to-r from-[#082F49] via-[#0369A1] to-[#082F49] border border-white/15 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-[#38BDF8] animate-pulse">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-4xl font-heading font-extrabold uppercase text-white tracking-tight drop-shadow-md">
            Butuh Bantuan Lebih Lanjut?
          </h2>
          <p className="text-xs md:text-sm font-body text-[#E0F2FE] max-w-xl mx-auto leading-relaxed font-medium">
            Jika ada kendala pendaftaran, pertanyaan kemitraan, atau urusan akomodasi delegasi, silakan hubungi langsung narahubung panitia Silatnas BEM UMS.
          </p>
          <div className="pt-4">
            <a 
              href="https://wa.me/628123456789" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0369A1] text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-xl transition duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            >
              <Phone className="w-4 h-4" /> Hubungi WhatsApp Panitia
            </a>
          </div>
        </div>

      </div>

      {/* Dynamic Signup Form Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-[100]"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800 p-6 md:px-10 flex items-center justify-between z-20">
                <div>
                  <span className="text-white drop-shadow-md text-xs font-bold uppercase tracking-widest block mb-1">Formulir Pendaftaran</span>
                  <h2 className="text-xl md:text-2xl font-heading font-extrabold uppercase tracking-tight text-white">{selectedEvent.title}</h2>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-10 h-10 bg-black/50 hover:bg-[#0EA5E9] text-white rounded-full flex items-center justify-center transition-colors border border-neutral-700 hover:border-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-10">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-20 h-20 bg-emerald-950/30 border border-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                      <CheckCircle className="text-emerald-400 w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-heading font-bold text-white uppercase">Pendaftaran Berhasil!</h3>
                    <p className="text-neutral-400 font-body text-sm leading-relaxed">
                      Terima kasih, <strong>{formData.name}</strong>, telah mendaftar Silatnas BEM UMS.<br/>
                      Panitia kami akan segera menghubungi Anda melalui nomor WhatsApp <strong>{formData.nowa}</strong> untuk kelanjutan verifikasi berkas.
                    </p>
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="mt-8 px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-xs rounded-full transition-colors border border-neutral-800"
                    >
                      Tutup Jendela
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-6">
                    {/* Default Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Nama Lengkap *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors font-body text-sm"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Asal Kampus *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors font-body text-sm"
                          value={formData.campus}
                          onChange={(e) => setFormData({...formData, campus: e.target.value})}
                          placeholder="Universitas Muhammadiyah Surakarta"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Jabatan *</label>
                        <input 
                          type="text" 
                          required
                          className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors font-body text-sm"
                          value={formData.jabatan}
                          onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                          placeholder="Presiden BEM / Menteri / Staff / dll"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">No. WhatsApp Aktif *</label>
                        <input 
                          type="tel" 
                          required
                          minLength="10"
                          maxLength="15"
                          pattern="[0-9]+"
                          title="Hanya angka, minimal 10 digit, maksimal 15 digit"
                          className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors font-body text-sm"
                          value={formData.nowa}
                          onChange={(e) => setFormData({...formData, nowa: e.target.value})}
                          placeholder="08123456789"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Motivasi & Pesan Kesan *</label>
                        <span className={`text-[10px] ${formData.motivasi.length < 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {formData.motivasi.length}/30 karakter
                        </span>
                      </div>
                      <textarea 
                        required
                        minLength="30"
                        rows="4"
                        className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors font-body text-sm resize-none"
                        value={formData.motivasi}
                        onChange={(e) => setFormData({...formData, motivasi: e.target.value})}
                        placeholder="Tuliskan motivasi mengikuti Silatnas dan pesan kesan Anda (minimal 30 karakter)..."
                      ></textarea>
                    </div>

                    {/* Dynamic Extra Fields from Admin */}
                    {selectedEvent.extraFields && selectedEvent.extraFields.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedEvent.extraFields.map((field, idx) => (
                          <div key={idx} className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">
                              {field.label} {field.required && '*'}
                            </label>
                            {field.type === 'textarea' ? (
                              <textarea
                                required={field.required}
                                rows="3"
                                className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors font-body text-sm resize-none md:col-span-2"
                                value={extraFields[field.key] || ''}
                                onChange={(e) => setExtraFields({...extraFields, [field.key]: e.target.value})}
                                placeholder={field.placeholder || ''}
                              />
                            ) : (
                              <input 
                                type={field.type || 'text'}
                                required={field.required}
                                className="w-full bg-black border border-neutral-800 text-white px-5 py-3.5 rounded-xl focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-colors font-body text-sm"
                                value={extraFields[field.key] || ''}
                                onChange={(e) => setExtraFields({...extraFields, [field.key]: e.target.value})}
                                placeholder={field.placeholder || ''}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t border-neutral-800 flex justify-end">
                      <button 
                        type="submit"
                        className="bg-[#0EA5E9] hover:bg-[#0369A1] text-white font-bold uppercase tracking-widest text-sm px-10 py-4 rounded-xl transition duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                      >
                        Kirim Pendaftaran
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
