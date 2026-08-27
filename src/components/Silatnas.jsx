import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, CheckCircle, X, Users, MapPin, Globe, 
  Download, Phone, HelpCircle, FileText, ChevronDown, 
  Award, Clock, CheckSquare, Sparkles, Send, GraduationCap,
  Compass, Utensils, Landmark, Camera, Heart,
  Car, Bus, Hotel, ShieldAlert, Navigation, Search, Building2, Map, Star
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



export default function Silatnas({ db }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', campus: '', jabatan: '', nowa: '', motivasi: '' });
  const [extraFields, setExtraFields] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Roll-Call & Sebaran 7 Zona State
  const [selectedZone, setSelectedZone] = useState('Semua');
  const [hoveredZone, setHoveredZone] = useState(null);
  const [isRegisterCampusOpen, setIsRegisterCampusOpen] = useState(false);
  const [campusFormData, setCampusFormData] = useState({
    campusName: '',
    shortName: '',
    leaderName: '',
    jabatan: 'Presiden Mahasiswa',
    region: 'Jawa & DIY',
    city: '',
    delegates: '3',
    nowa: '',
    motivasi: ''
  });
  const [campusSubmitted, setCampusSubmitted] = useState(false);

  const handleCampusSignup = async (e) => {
    e.preventDefault();
    try {
      const applicantData = {
        name: campusFormData.leaderName,
        campus: campusFormData.campusName,
        shortName: campusFormData.shortName,
        jabatan: campusFormData.jabatan,
        region: campusFormData.region,
        city: campusFormData.city,
        delegates: campusFormData.delegates,
        nowa: campusFormData.nowa,
        motivasi: campusFormData.motivasi,
        submittedAt: new Date().toISOString()
      };
      
      const targetEventId = (catalog.length > 0) ? catalog[0].id : 'silatnas-2026';
      await addSilatnasApplicant(targetEventId, applicantData);
      setCampusSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pendaftaran, pastikan koneksi internet stabil lalu coba lagi.");
    }
  };

  // Hospitality & Service Hub State
  const [hospitalityTab, setHospitalityTab] = useState('shuttle');
  const [shuttleForm, setShuttleForm] = useState({
    campus: '',
    count: '2',
    point: 'Stasiun Solo Balapan',
    date: '',
    time: '',
    leaderName: '',
    phone: ''
  });

  const handleShuttleSubmit = (e) => {
    e.preventDefault();
    const text = `Halo LO Silatnas BEM UMS 2026!\n\nKami mengonfirmasi kedatangan delegasi kontingen:\n- *Kampus/BEM:* ${shuttleForm.campus}\n- *Jumlah Delegasi:* ${shuttleForm.count} Orang\n- *Titik Penjemputan:* ${shuttleForm.point}\n- *Tanggal & Waktu Tiba:* ${shuttleForm.date} jam ${shuttleForm.time} WIB\n- *Koordinator Kontingen:* ${shuttleForm.leaderName} (${shuttleForm.phone})\n\nMohon pendampingan penjemputan shuttle LO. Terima kasih!`;
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };


  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const frames = [1, 2, 5, 6, 7, 8, 9];

  // Preload and animate mascot frames smoothly
  useEffect(() => {
    frames.forEach((f) => {
      const img = new Image();
      img.src = `/assets/frame_maskot/${f}-removebg-preview.png`;
    });

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, 220);
    return () => clearInterval(interval);
  }, []);

  const safeDb = db || {};

  const catalog = Array.isArray(safeDb.silatnasCatalog) ? safeDb.silatnasCatalog : [];

  const visiMisi = (safeDb.silatnasVisiMisi && typeof safeDb.silatnasVisiMisi === 'object') ? safeDb.silatnasVisiMisi : {
    visiTitle: "Visi Kolaboratif",
    visiDesc: "Menciptakan ruang dialog nasional yang terbuka dan konstruktif guna merumuskan rekomendasi kritis terhadap arah kebijakan nasional demi memperjuangkan hak-hak kesejahteraan masyarakat umum.",
    misiTitle: "Ukhuwah Gerakan",
    misiDesc: "Mempererat jalinan tali persaudaraan intelektual antar seluruh pengurus BEM se-Indonesia, menyelaraskan persepsi isu, serta membangun solidaritas aliansi gerakan yang independen."
  };

  const alurData = Array.isArray(safeDb.silatnasAlur) ? safeDb.silatnasAlur : [
    { step: "01", title: "Pilih Agenda", desc: "Cari agenda Silatnas aktif di bagian pendaftaran portal ini." },
    { step: "02", title: "Isi Formulir", desc: "Isi data delegasi, nomor WhatsApp, serta motivasi pendaftaran." },
    { step: "03", title: "Verifikasi Berkas", desc: "Panitia akan menghubungi Anda dalam 24 jam untuk verifikasi administrasi." },
    { step: "04", title: "Gabung Grup", desc: "Masuk grup resmi koordinasi delegasi untuk informasi akomodasi." }
  ];

  const timeline = Array.isArray(safeDb.silatnasTimeline) ? safeDb.silatnasTimeline : [
    { day: "Hari 1", title: "Registrasi & Welcoming Dinner", desc: "Penyambutan delegasi dari seluruh Indonesia, verifikasi ulang berkas fisik, dan makan malam bersama jajaran rektorat UMS." },
    { day: "Hari 2", title: "Opening Ceremony & Seminar Nasional", desc: "Seminar kebangsaan menghadirkan tokoh nasional, diikuti dengan konsolidasi awal dan pembagian komisi sidang." },
    { day: "Hari 3", title: "Sidang Komisi & Perumusan Resolusi", desc: "Pembahasan isu strategis kebangsaan, perumusan hasil rekomendasi BEM se-Indonesia, dan malam deklarasi bersama." },
    { day: "Hari 4", title: "Field Trip & Closing Ceremony", desc: "Kunjungan budaya ke tempat bersejarah di Surakarta (Solo), dilanjutkan dengan malam keakraban, pembagian sertifikat, dan penutupan resmi." }
  ];

  const docsList = Array.isArray(safeDb.silatnasDocs) ? safeDb.silatnasDocs : [
    { title: "Rundown Acara", desc: "Rincian tentatif jadwal kegiatan lengkap selama 4 hari.", size: "PDF (1.2 MB)", url: "" },
    { title: "Term of Reference (TOR)", desc: "Term of reference, tata tertib, dan syarat administrasi delegasi.", size: "PDF (2.5 MB)", url: "" },
    { title: "Surat Undangan Resmi", desc: "Format surat undangan resmi untuk birokrasi perizinan kampus.", size: "DOCX (850 KB)", url: "" }
  ];

  const cultureList = Array.isArray(safeDb.silatnasCulture) && safeDb.silatnasCulture.length > 0 ? safeDb.silatnasCulture : [
    {
      id: 1,
      category: "Ikon Religi Megah",
      title: "Masjid Raya Sheikh Zayed Surakarta",
      desc: "Replika megah Sheikh Zayed Grand Mosque Abu Dhabi dengan perpaduan seni ukir khas Surakarta. Destinasi ibadah dan ziarah arsitektur kebanggaan warga Solo.",
      highlight: "Destinasi Field Trip",
      location: "Solo Utara",
      image: "https://images.unsplash.com/photo-1590076175571-4b5459efb08c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      category: "Pusat Sejarah & Tradisi",
      title: "Keraton Surakarta & Mangkunegaran",
      desc: "Istana kerajaan bersejarah pusat tatanan budaya Jawa. Tempat lahirnya karya seni tari sakral, arsitektur joglo luhur, dan museum pusaka nusantara.",
      highlight: "Kunjungan Budaya",
      location: "Pusat Kota Solo",
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      category: "Warisan Batik Dunia",
      title: "Kampung Batik Laweyan & Kauman",
      desc: "Kawasan cagar budaya produsen batik tertua di Solo dengan lorong-lorong arsitektur klasik Jawa-Eropa. Tempat belanja cenderamata batik asli Solo.",
      highlight: "Wisata Oleh-oleh",
      location: "Laweyan, Solo",
      image: "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      category: "Cita Rasa Legend",
      title: "Gastronomi & Kuliner Surakarta",
      desc: "Nikmati kelezatan authentic Selat Solo, Nasi Liwet Gurih, Timlo, Tengkleng, hingga Es Dawet Telasih khas Pasar Gede yang legendaris.",
      highlight: "Jamuan Malam Panitia",
      location: "Kuliner Solo",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      category: "Landmark Kampus UMS",
      title: "Edutorium Universitas Muhammadiyah Surakarta",
      desc: "Gedung convention hall termegah di Jawa Tengah milik UMS dengan kapasitas puluhan ribu orang, dilengkapi museum sejarah kebudayaan dan fasilitas konvensi internasional. Tempat digelarnya Pembukaan & Malam Puncak Silatnas BEM UMS 2026.",
      highlight: "Lokasi Utama Silatnas",
      location: "Kampus UMS, Surakarta",
      image: "/assets/artefak/edutorium.png"
    }
  ];

  const defaultCampuses = [
    { id: 1, name: "Universitas Muhammadiyah Surakarta", shortName: "UMS", region: "Jawa & DIY", city: "Surakarta, Jawa Tengah", status: "Host Silatnas", delegates: 12, confirmed: true },
    { id: 2, name: "Universitas Muhammadiyah Yogyakarta", shortName: "UMY", region: "Jawa & DIY", city: "Yogyakarta, DIY", status: "Terkonfirmasi", delegates: 4, confirmed: true },
    { id: 3, name: "Universitas Muhammadiyah Jakarta", shortName: "UMJ", region: "Jawa & DIY", city: "Jakarta Selatan, DKI Jakarta", status: "Terkonfirmasi", delegates: 5, confirmed: true },
    { id: 4, name: "Universitas Muhammadiyah Prof. Dr. HAMKA", shortName: "UHAMKA", region: "Jawa & DIY", city: "Jakarta Timur, DKI Jakarta", status: "Terkonfirmasi", delegates: 4, confirmed: true },
    { id: 5, name: "Universitas Ahmad Dahlan", shortName: "UAD", region: "Jawa & DIY", city: "Yogyakarta, DIY", status: "Terkonfirmasi", delegates: 4, confirmed: true },
    { id: 6, name: "Universitas Muhammadiyah Malang", shortName: "UMM", region: "Jawa & DIY", city: "Malang, Jawa Timur", status: "Terkonfirmasi", delegates: 5, confirmed: true },
    { id: 7, name: "Universitas Muhammadiyah Sumatera Utara", shortName: "UMSU", region: "Sumatera", city: "Medan, Sumatera Utara", status: "Terkonfirmasi", delegates: 3, confirmed: true },
    { id: 8, name: "Universitas Muhammadiyah Sumatera Barat", shortName: "UMSB", region: "Sumatera", city: "Padang, Sumatera Barat", status: "Terkonfirmasi", delegates: 3, confirmed: true },
    { id: 9, name: "Universitas Muhammadiyah Palembang", shortName: "UM Palembang", region: "Sumatera", city: "Palembang, Sumatera Selatan", status: "Terkonfirmasi", delegates: 3, confirmed: true },
    { id: 10, name: "Universitas Muhammadiyah Aceh", shortName: "UNMUHA", region: "Sumatera", city: "Banda Aceh, Aceh", status: "Terkonfirmasi", delegates: 2, confirmed: true },
    { id: 11, name: "Universitas Muhammadiyah Pontianak", shortName: "UM Pontianak", region: "Kalimantan", city: "Pontianak, Kalimantan Barat", status: "Terkonfirmasi", delegates: 3, confirmed: true },
    { id: 12, name: "Universitas Muhammadiyah Kalimantan Timur", shortName: "UMKT", region: "Kalimantan", city: "Samarinda, Kalimantan Timur", status: "Terkonfirmasi", delegates: 3, confirmed: true },
    { id: 13, name: "Universitas Muhammadiyah Palangkaraya", shortName: "UMPR", region: "Kalimantan", city: "Palangkaraya, Kalimantan Tengah", status: "Terkonfirmasi", delegates: 2, confirmed: true },
    { id: 14, name: "Universitas Muhammadiyah Banjarmasin", shortName: "UM Banjarmasin", region: "Kalimantan", city: "Banjarmasin, Kalimantan Selatan", status: "Terkonfirmasi", delegates: 3, confirmed: true },
    { id: 15, name: "Universitas Muhammadiyah Makassar", shortName: "Unismuh Makassar", region: "Sulawesi", city: "Makassar, Sulawesi Selatan", status: "Terkonfirmasi", delegates: 4, confirmed: true },
    { id: 16, name: "Universitas Muhammadiyah Kendari", shortName: "UM Kendari", region: "Sulawesi", city: "Kendari, Sulawesi Tenggara", status: "Terkonfirmasi", delegates: 2, confirmed: true },
    { id: 17, name: "Universitas Muhammadiyah Palu", shortName: "Unismuh Palu", region: "Sulawesi", city: "Palu, Sulawesi Tengah", status: "Terkonfirmasi", delegates: 2, confirmed: true },
    { id: 18, name: "Universitas Muhammadiyah Gorontalo", shortName: "UMGO", region: "Sulawesi", city: "Gorontalo", status: "Terkonfirmasi", delegates: 2, confirmed: true },
    { id: 19, name: "Universitas Muhammadiyah Mataram", shortName: "UMMAT", region: "Bali & Nusa Tenggara", city: "Mataram, NTB", status: "Terkonfirmasi", delegates: 3, confirmed: true },
    { id: 20, name: "Universitas Muhammadiyah Kupang", shortName: "UM Kupang", region: "Bali & Nusa Tenggara", city: "Kupang, NTT", status: "Terkonfirmasi", delegates: 2, confirmed: true },
    { id: 21, name: "Universitas Pendidikan Muhammadiyah Sorong", shortName: "UNIMUDA Sorong", region: "Maluku & Papua", city: "Sorong, Papua Barat Daya", status: "Terkonfirmasi", delegates: 3, confirmed: true },
    { id: 22, name: "Universitas Muhammadiyah Maluku Utara", shortName: "UMMU Ternate", region: "Maluku & Papua", city: "Ternate, Maluku Utara", status: "Terkonfirmasi", delegates: 2, confirmed: true },
    { id: 23, name: "Universitas Muhammadiyah Papua", shortName: "UM Papua", region: "Maluku & Papua", city: "Jayapura, Papua", status: "Terkonfirmasi", delegates: 2, confirmed: true },
  ];

  const silatnasZones = [
    {
      id: 1,
      zoneNumber: "ZONA 1",
      name: "Sumatera",
      title: "Zona 1 // Sumatera",
      x: 13.5,
      y: 38.0,
      badgePos: "left",
      scope: "Aceh, Sumatera Utara, Sumatera Barat, Riau, Kepri, Jambi, Bengkulu, Sumatera Selatan, Bangka Belitung, Lampung",
      status: "Terkonfirmasi",
      target: "38+ Kampus Terdaftar",
      isHost: false
    },
    {
      id: 2,
      zoneNumber: "ZONA 2",
      name: "Kalimantan",
      title: "Zona 2 // Kalimantan",
      x: 39.5,
      y: 41.5,
      badgePos: "top",
      scope: "Kalimantan Barat, Kalimantan Tengah, Kalimantan Selatan, Kalimantan Timur, Kalimantan Utara",
      status: "Terkonfirmasi",
      target: "28+ Kampus Terdaftar",
      isHost: false
    },
    {
      id: 3,
      zoneNumber: "ZONA 3",
      name: "DKI Jakarta, Jawa Barat, Banten",
      title: "Zona 3 // DKI Jakarta, Jawa Barat & Banten",
      x: 25.5,
      y: 73.0,
      badgePos: "left",
      scope: "DKI Jakarta, Jawa Barat, Banten",
      status: "Terkonfirmasi",
      target: "32+ Kampus Terdaftar",
      isHost: false
    },
    {
      id: 4,
      zoneNumber: "ZONA 4",
      name: "Jateng & DIY",
      title: "Zona 4 // Jawa Tengah & D.I. Yogyakarta",
      x: 36.0,
      y: 77.0,
      badgePos: "top",
      scope: "Jawa Tengah, D.I. Yogyakarta (Edutorium UMS Surakarta)",
      status: "Tuan Rumah Silatnas 2026 (Host)",
      target: "12+ Kampus (Host)",
      isHost: true
    },
    {
      id: 5,
      zoneNumber: "ZONA 5",
      name: "Jatim & Bali",
      title: "Zona 5 // Jawa Timur & Bali",
      x: 44.0,
      y: 80.5,
      badgePos: "bottom",
      scope: "Jawa Timur, Bali",
      status: "Terkonfirmasi",
      target: "18+ Kampus Terdaftar",
      isHost: false
    },
    {
      id: 6,
      zoneNumber: "ZONA 6",
      name: "NTT & NTB",
      title: "Zona 6 // Nusa Tenggara Barat & Nusa Tenggara Timur",
      x: 55.0,
      y: 85.5,
      badgePos: "bottom",
      scope: "Nusa Tenggara Barat, Nusa Tenggara Timur",
      status: "Terkonfirmasi",
      target: "16+ Kampus Terdaftar",
      isHost: false
    },
    {
      id: 7,
      zoneNumber: "ZONA 7",
      name: "Sulawesi, Maluku & Papua",
      title: "Zona 7 // Sulawesi, Maluku & Papua",
      x: 64.0,
      y: 44.0,
      badgePos: "right",
      scope: "Sulawesi, Maluku, Papua",
      status: "Terkonfirmasi",
      target: "8+ Kampus Terdaftar",
      isHost: false
    }
  ];

  const filteredZones = silatnasZones.filter(z => {
    return selectedZone === 'Semua' || z.id === selectedZone || z.name === selectedZone || z.zoneNumber === selectedZone;
  });

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
    <div className="min-h-screen pt-28 pb-0 px-6 md:px-10 lg:px-20 text-white relative overflow-hidden bg-gradient-to-br from-[#082F49] via-[#0369A1] to-[#0EA5E9]">
      {/* ================= BACKGROUND BANNERS (PEEKING PARALLAX) ================= */}
      {/* LEFT SIDE BANNERS */}
      {/* 1. Left Gunungan (Back Layer) */}
      <div 
        style={{ transform: 'rotate(12deg)' }}
        className="fixed left-[-45vw] sm:left-[-35vw] md:left-[-30vw] lg:left-[-28vw] xl:left-[-22vw] top-[20vh] lg:top-[-5vh] h-[60vh] md:h-[90vh] lg:h-[110vh] w-auto z-0 pointer-events-none block"
      >
        <motion.img 
          src="/assets/artefak/right and left.png" 
          alt="" 
          animate={{ 
            x: [0, 30, 0],
            y: [-5, 5, -5]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full object-contain opacity-[0.45] transform-gpu will-change-transform" 
        />
      </div>
      {/* 2. Left Wayang (Front Layer - Facing Inward/Right) */}
      <div 
        style={{ transform: 'rotate(12deg)' }}
        className="fixed left-[-40vw] sm:left-[-30vw] md:left-[-26vw] lg:left-[-24vw] xl:left-[-18vw] top-[20vh] lg:top-[-5vh] h-[60vh] md:h-[90vh] lg:h-[110vh] w-auto z-0 pointer-events-none block"
      >
        <motion.img 
          src="/assets/artefak/right and left2.png" 
          alt="" 
          animate={{ 
            x: [0, 50, 0],
            y: [5, -5, 5]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="w-full h-full object-contain opacity-[0.45] transform-gpu will-change-transform" 
        />
      </div>
      
      {/* RIGHT SIDE BANNERS */}
      {/* 3. Right Gunungan (Back Layer - Mirrored) */}
      <div 
        style={{ transform: 'scaleX(-1) rotate(12deg)' }}
        className="fixed right-[-45vw] sm:right-[-35vw] md:right-[-30vw] lg:right-[-28vw] xl:right-[-22vw] top-[20vh] lg:top-[-5vh] h-[60vh] md:h-[90vh] lg:h-[110vh] w-auto z-0 pointer-events-none block"
      >
        <motion.img 
          src="/assets/artefak/right and left.png" 
          alt="" 
          animate={{ 
            x: [0, 30, 0],
            y: [-5, 5, -5]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full object-contain opacity-[0.45] transform-gpu will-change-transform" 
        />
      </div>
      
      {/* 4. Right Wayang (Front Layer - Mirrored - Facing Inward/Left) */}
      <div 
        style={{ transform: 'scaleX(-1) rotate(12deg)' }}
        className="fixed right-[-40vw] sm:right-[-30vw] md:right-[-26vw] lg:right-[-24vw] xl:right-[-18vw] top-[20vh] lg:top-[-5vh] h-[60vh] md:h-[90vh] lg:h-[110vh] w-auto z-0 pointer-events-none block"
      >
        <motion.img 
          src="/assets/artefak/right and left2.png" 
          alt="" 
          animate={{ 
            x: [0, 50, 0],
            y: [5, -5, 5]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="w-full h-full object-contain opacity-[0.45] transform-gpu will-change-transform" 
        />
      </div>
      
      {/* ================= FLOATING JAVANESE CLOUDS (MEGAMENDUNG PNG - 20 MEDIUM INSTANCES) ================= */}
      {/* Cloud 1 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-35, 35, -35], y: [-8, 8, -8] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[3%] left-[4%] w-28 md:w-52 h-auto opacity-[0.4] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 2 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [40, -40, 40], y: [9, -9, 9] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[7%] right-[6%] w-32 md:w-56 h-auto opacity-[0.45] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 3 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-30, 30, -30], y: [-6, 6, -6] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[12%] left-[40%] w-24 md:w-44 h-auto opacity-[0.35] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 4 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [45, -45, 45], y: [10, -10, 10] }}
        transition={{ duration: 27, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[16%] right-[28%] w-28 md:w-48 h-auto opacity-[0.4] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 5 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-35, 35, -35], y: [-8, 8, -8] }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[21%] left-[18%] w-32 md:w-52 h-auto opacity-[0.42] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 6 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [35, -35, 35], y: [7, -7, 7] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[26%] right-[10%] w-30 md:w-54 h-auto opacity-[0.45] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 7 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-40, 40, -40], y: [-9, 9, -9] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[31%] left-[45%] w-26 md:w-46 h-auto opacity-[0.38] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 8 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [40, -40, 40], y: [8, -8, 8] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[36%] left-[6%] w-32 md:w-56 h-auto opacity-[0.42] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 9 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-45, 45, -45], y: [-10, 10, -10] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[41%] right-[18%] w-30 md:w-52 h-auto opacity-[0.4] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 10 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [35, -35, 35], y: [7, -7, 7] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[46%] left-[32%] w-28 md:w-48 h-auto opacity-[0.38] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 11 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-40, 40, -40], y: [-9, 9, -9] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[51%] right-[5%] w-34 md:w-58 h-auto opacity-[0.45] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 12 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [45, -45, 45], y: [10, -10, 10] }}
        transition={{ duration: 29, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[56%] left-[12%] w-30 md:w-50 h-auto opacity-[0.4] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 13 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-30, 30, -30], y: [-6, 6, -6] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[61%] right-[35%] w-26 md:w-46 h-auto opacity-[0.36] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 14 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [40, -40, 40], y: [8, -8, 8] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[66%] left-[42%] w-30 md:w-52 h-auto opacity-[0.4] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 15 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-45, 45, -45], y: [-10, 10, -10] }}
        transition={{ duration: 27, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[71%] right-[12%] w-34 md:w-56 h-auto opacity-[0.44] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 16 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [35, -35, 35], y: [7, -7, 7] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[76%] left-[8%] w-28 md:w-48 h-auto opacity-[0.38] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 17 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-40, 40, -40], y: [-9, 9, -9] }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[81%] right-[25%] w-32 md:w-54 h-auto opacity-[0.42] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 18 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [45, -45, 45], y: [10, -10, 10] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[85%] left-[28%] w-26 md:w-46 h-auto opacity-[0.36] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 19 */}
      <motion.img
        src="/assets/artefak/awan_jawa-remove-bg-io.png"
        alt=""
        animate={{ x: [-35, 35, -35], y: [-8, 8, -8] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[89%] right-[5%] w-34 md:w-58 h-auto opacity-[0.45] z-[1] pointer-events-none transform-gpu"
      />
      {/* Cloud 20 */}
      <motion.img
        src="/assets/artefak/awan_jawa2-remove-bg-io.png"
        alt=""
        animate={{ x: [40, -40, 40], y: [8, -8, 8] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[93%] left-[5%] w-30 md:w-50 h-auto opacity-[0.4] z-[1] pointer-events-none transform-gpu"
      />
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-white/20 to-transparent opacity-50 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0369A1]/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
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
              Selamat datang di portal informasi dan pendaftaran Silaturahmi Nasional BEM PTMAI se-Indonesia. Wadah resmi konsolidasi ide, kolaborasi strategis, dan persatuan ukhuwah gerakan mahasiswa nasional.
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
                  <div className="text-xs font-heading font-bold text-white mt-0.5">164 Kampus</div>
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
          <div className="relative w-72 md:w-80 h-[380px] md:h-[480px] flex items-center justify-center">
            {frames.map((f, idx) => (
              <img 
                key={f}
                src={`/assets/frame_maskot/${f}-removebg-preview.png`} 
                alt="Maskot Silatnas" 
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${
                  currentFrameIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                loading="eager"
              />
            ))}
          </div>
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
              <h3 className="text-xl font-heading font-bold uppercase text-white">{visiMisi.visiTitle}</h3>
              <p className="text-sm font-body text-[#E0F2FE]/80 leading-relaxed">
                {visiMisi.visiDesc}
              </p>
            </div>

            <div className="bg-black/35 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-4 hover:border-[#38BDF8]/40 transition duration-300 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/30 flex items-center justify-center text-[#38BDF8]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold uppercase text-white">{visiMisi.misiTitle}</h3>
              <p className="text-sm font-body text-[#E0F2FE]/80 leading-relaxed">
                {visiMisi.misiDesc}
              </p>
            </div>
          </div>
        </div>

        {/* 2.5 PETA INTERAKTIF SEBARAN 7 ZONA WILAYAH SILATNAS */}
        <div className="space-y-8 pt-6 border-t border-white/10" id="rollcall-section">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              Peta Sebaran 7 Zona Wilayah Silatnas
            </h2>
            <p className="text-[#E0F2FE] font-body text-sm max-w-2xl mx-auto font-medium leading-relaxed">
              Sebaran konsolidasi kontingen delegasi dari <span className="text-[#38BDF8] font-bold">164+ Perguruan Tinggi se-Indonesia</span> yang terbagi dalam 7 Zona Wilayah Nusantara untuk berkumpul di Surakarta.
            </p>
          </div>

          {/* Quick Metrics Bar (3 Cards - Total Delegasi Removed) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-center space-y-1 hover:border-[#38BDF8]/40 transition duration-300">
              <div className="text-3xl md:text-4xl font-heading font-black text-[#38BDF8]">164+</div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#BAE6FD]">Kampus Terdaftar</div>
              <div className="text-[10px] text-neutral-400 font-mono">164+ PTMA & BEM se-Indonesia</div>
            </div>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-center space-y-1 hover:border-amber-400/40 transition duration-300">
              <div className="text-3xl md:text-4xl font-heading font-black text-amber-400">7</div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-200">Zona Pulau Terwakili</div>
              <div className="text-[10px] text-neutral-400 font-mono">Konsolidasi Sabang s.d. Merauke</div>
            </div>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-center space-y-1 hover:border-sky-400/40 transition duration-300">
              <div className="text-xl md:text-2xl font-heading font-black text-white pt-1">BEM UMS</div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">Tuan Rumah Resmi</div>
              <div className="text-[10px] text-neutral-400 font-mono">Edutorium UMS Surakarta</div>
            </div>
          </div>

          {/* ================= INTERACTIVE INDONESIA MAP CANVAS (7 ZONES) ================= */}
          <div className="max-w-5xl mx-auto bg-black/50 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 md:p-8 shadow-2xl relative overflow-x-auto scrollbar-thin">
            {/* Background Grid Pattern & Compass Decor */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute top-4 right-4 text-white/20 font-mono text-[9px] uppercase tracking-widest hidden md:block">
              GEO-RADAR // 7 ZONA NUSANTARA 0° N 118° E
            </div>

            {/* Map Canvas with exact 748/301 Aspect Ratio Container */}
            <div className="relative w-full min-w-[760px] md:min-w-0 max-w-4xl mx-auto aspect-[748/301] flex items-center justify-center select-none shrink-0">
              
              {/* Authentic Island Image from /assets/artefak/pulau.png */}
              <img 
                src="/assets/artefak/pulau.png" 
                alt="Peta Kepulauan Indonesia" 
                className="w-full h-full object-fill filter drop-shadow-[0_0_25px_rgba(56,189,248,0.35)] select-none opacity-95 pointer-events-none"
              />

              {/* ================= 7 DYNAMIC ZONE PINS & ZONE BADGES ================= */}
              {silatnasZones.map((z) => {
                const isSelected = selectedZone === 'Semua' || selectedZone === z.id;
                const isHovered = hoveredZone && hoveredZone.id === z.id;
                const isHost = z.isHost;

                // Smart positioning to prevent overlap
                const badgePositionClass = z.badgePos === 'top' 
                  ? '-top-6 left-1/2 -translate-x-1/2' 
                  : z.badgePos === 'left'
                    ? 'top-1/2 -translate-y-1/2 right-4'
                    : z.badgePos === 'right'
                      ? 'top-1/2 -translate-y-1/2 left-4'
                      : 'top-4 left-1/2 -translate-x-1/2';

                return (
                  <div
                    key={z.id}
                    style={{ left: `${z.x}%`, top: `${z.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isSelected ? 'opacity-100 scale-100 z-20' : 'opacity-25 scale-75 z-0 pointer-events-none'
                    }`}
                    onMouseEnter={() => setHoveredZone(z)}
                    onClick={() => { setSelectedZone(z.id); setHoveredZone(z); }}
                  >
                    {/* Zone Pin Marker with Radar Ring */}
                    <div className="relative group cursor-pointer flex items-center justify-center">
                      
                      {/* Pulsing Radar Ring */}
                      <span className={`absolute -inset-2.5 rounded-full animate-ping opacity-75 ${
                        isHost ? 'bg-amber-400' : 'bg-[#38BDF8]'
                      }`} />

                      {/* Pin Center Dot (Bigger & Prominent for Zones) */}
                      <div className={`w-5 h-5 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-125 ${
                        isHost ? 'bg-amber-400 ring-4 ring-amber-300/60' : 'bg-[#0284C7] ring-2 ring-sky-300/60'
                      }`}>
                        {isHost ? (
                          <span className="text-[10px] font-black text-black leading-none">★</span>
                        ) : (
                          <span className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>

                      {/* Zone Number & Name Badge on Map */}
                      <div className={`absolute ${badgePositionClass} px-2 py-0.5 rounded-lg text-[9px] md:text-[11px] font-heading font-black tracking-tight whitespace-nowrap shadow-lg border transition-all ${
                        isHost 
                          ? 'bg-amber-400 text-black border-amber-200 ring-2 ring-amber-400/60 scale-110 font-black z-30 shadow-[0_0_15px_rgba(251,191,36,0.6)]' 
                          : isHovered || (selectedZone === z.id)
                            ? 'bg-[#38BDF8] text-black border-white scale-110 z-30 shadow-[0_0_15px_rgba(56,189,248,0.6)]'
                            : 'bg-black/90 text-[#BAE6FD] border-white/20 backdrop-blur-sm group-hover:border-[#38BDF8] group-hover:text-white'
                      }`}>
                        {isHost ? (
                          <span className="flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-black text-black shrink-0" />
                            {z.zoneNumber}: {z.name} (HOST)
                          </span>
                        ) : (
                          `${z.zoneNumber}: ${z.name}`
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Floating Tooltip Detail Card on Hover / Selection */}
              {hoveredZone && (
                <div 
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-black/95 backdrop-blur-2xl border border-[#38BDF8]/70 p-4 md:p-5 rounded-2xl shadow-[0_0_35px_rgba(14,165,233,0.5)] max-w-md w-[92%] flex items-start justify-between gap-3 animate-in fade-in zoom-in-95 duration-200"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#38BDF8] bg-sky-950/80 px-2.5 py-0.5 rounded-md border border-sky-700">
                        {hoveredZone.zoneNumber}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                        hoveredZone.isHost ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {hoveredZone.status}
                      </span>
                    </div>
                    <h4 className="text-sm md:text-base font-heading font-extrabold text-white uppercase leading-tight pt-0.5">
                      {hoveredZone.title}
                    </h4>
                    <p className="text-xs text-neutral-300 font-body leading-relaxed">
                      <span className="text-[#38BDF8] font-bold">Cakupan Wilayah:</span> {hoveredZone.scope}
                    </p>
                    <div className="pt-1 text-[11px] text-[#BAE6FD] font-mono font-bold flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" /> {hoveredZone.target}
                    </div>
                  </div>
                  <button 
                    onClick={() => { setHoveredZone(null); setSelectedZone('Semua'); }}
                    className="text-neutral-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
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
            {alurData.map((step, idx) => (
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
            {timeline.map((item, idx) => (
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
        <div className="space-y-10 pt-10 border-t border-white/10" id="catalog-section">
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
            {docsList.map((doc, idx) => (
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
                    onClick={() => {
                      if (doc.url) {
                        window.open(doc.url, '_blank');
                      } else {
                        alert(`Unduhan ${doc.title} simulasi berhasil dilakukan.`);
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-black/40 border border-white/5 hover:border-[#0EA5E9]/40 text-neutral-300 font-bold uppercase tracking-widest text-[10px] py-3.5 rounded-xl transition duration-300"
                  >
                    <Download className="w-3.5 h-3.5 text-[#38BDF8]" /> Unduh Berkas ({doc.size})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6.5 SENTUHAN BUDAYA & WISATA SOLO (SOLO CULTURAL & HERITAGE SHOWCASE) */}
        <div className="space-y-10 pt-10 border-t border-white/10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              Eksplorasi Budaya & Wisata Surakarta
            </h2>
            <p className="text-[#E0F2FE] font-body text-sm max-w-2xl mx-auto mt-2 font-medium leading-relaxed">
              <span className="text-[#38BDF8] font-semibold italic">Sugeng Rawuh ing Solo!</span> Nikmati kehangatan hospitality Solo Kota Budaya. BEM UMS memanjakan seluruh kontingen delegasi BEM se-Indonesia dengan keindahan arsitektur, sejarah luhur, dan kelezatan gastronomi khas Surakarta.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {cultureList.map((item, idx) => (
              <div 
                key={item.id || idx} 
                className={`group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#38BDF8]/40 transition-all duration-300 shadow-xl flex flex-col justify-between ${idx === cultureList.length - 1 && cultureList.length % 3 !== 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <Compass className="w-12 h-12 text-[#38BDF8]/40 animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#0EA5E9] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {item.category || 'Destinasi Solo'}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-lg font-heading font-bold text-white uppercase group-hover:text-[#38BDF8] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs font-body text-[#E0F2FE]/70 leading-relaxed">
                      {item.desc || item.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-[#38BDF8]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" /> {item.highlight || 'Destinasi Field Trip'}
                    </span>
                    <span className="text-neutral-400 text-[10px] font-mono">{item.location || 'Surakarta'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special Host Commitment Banner */}
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-sky-950/60 via-black/80 to-slate-950/60 border border-[#0EA5E9]/30 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#38BDF8] uppercase tracking-widest">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> Jaminan Keramahan Tuan Rumah BEM UMS
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-white uppercase">
                  "Solo Kota Ramah & Berbudaya: Berwacana Tajam, Bersilaturahmi Hangat"
                </h3>
                <p className="text-xs font-body text-[#E0F2FE]/80 max-w-3xl leading-relaxed">
                  Panitia Silatnas BEM UMS 2026 berkomitmen penuh memberikan pelayanan terbaik, pendampingan Liaison Officer (LO) 24 jam, serta akomodasi terbaik demi kenyamanan seluruh saudara mahasiswa dari Sabang sampai Merauke.
                </p>
              </div>
              <div className="shrink-0">
                <a 
                  href="#helpdesk" 
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('helpdesk-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0369A1] text-white font-bold uppercase tracking-widest text-xs px-6 py-3.5 rounded-xl transition duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                >
                  <Phone className="w-4 h-4" /> Tanya Panitia / LO
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 6.8 PANDUAN LAYANAN & HOSPITALITAS DELEGASI (DELEGATE SERVICES & HOSPITALITY HUB) */}
        <div className="space-y-10 pt-10 border-t border-white/10" id="hospitality-section">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase tracking-tight text-white drop-shadow-md">
              Panduan Layanan & Hospitalitas Delegasi
            </h2>
            <p className="text-[#E0F2FE] font-body text-sm max-w-2xl mx-auto mt-2 font-medium leading-relaxed">
              Layanan komprehensif pendampingan kontingen, penjemputan shuttle LO, akomodasi penginapan, dan posko darurat 24 jam untuk seluruh delegasi BEM se-Indonesia.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            <button
              onClick={() => setHospitalityTab('shuttle')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                hospitalityTab === 'shuttle'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-black/40 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <Bus className="w-4 h-4" /> 1. Layanan Shuttle & Penjemputan LO
            </button>
            <button
              onClick={() => setHospitalityTab('hotel')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                hospitalityTab === 'hotel'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-black/40 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <Hotel className="w-4 h-4" /> 2. Penginapan Delegasi (Wisma Pesantren Mahasiswa)
            </button>
            <button
              onClick={() => setHospitalityTab('medical')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                hospitalityTab === 'medical'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-black/40 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> 3. Posko Medis & Emergency 24 Jam
            </button>
          </div>

          {/* TAB 1: SHUTTLE & PENJEMPUTAN LO */}
          {hospitalityTab === 'shuttle' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">Pick-up Points & Shuttle LO</span>
                  <h3 className="text-2xl font-heading font-extrabold text-white uppercase">Titik Penjemputan Resmi Delegasi</h3>
                  <p className="text-xs font-body text-neutral-400 mt-2 leading-relaxed">
                    Panitia Silatnas BEM UMS menyediakan tim Liaison Officer (LO) & Armada Penjemputan di seluruh gerbang masuk utama Kota Surakarta & Kartasura secara gratis untuk seluruh kontingen resmi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1 hover:border-amber-400/30 transition">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                      <Navigation className="w-3.5 h-3.5" /> Stasiun Solo Balapan
                    </div>
                    <p className="text-[11px] text-neutral-400 font-body">Penjemputan Armada Kereta Api Eksekutif & Bisnis.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1 hover:border-amber-400/30 transition">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                      <Navigation className="w-3.5 h-3.5" /> Bandara Adi Soemarmo (SOC)
                    </div>
                    <p className="text-[11px] text-neutral-400 font-body">Penjemputan Delegasi Jalur Penerbangan Udara.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1 hover:border-amber-400/30 transition">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                      <Navigation className="w-3.5 h-3.5" /> Terminal Tirtonadi
                    </div>
                    <p className="text-[11px] text-neutral-400 font-body">Penjemputan Delegasi Armada Bus Intercity.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1 hover:border-amber-400/30 transition">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                      <Navigation className="w-3.5 h-3.5" /> Terminal Kartasura
                    </div>
                    <p className="text-[11px] text-neutral-400 font-body">Penjemputan Delegasi Bus & Travel Jalur Barat.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1 sm:col-span-2 hover:border-amber-400/30 transition">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                      <Navigation className="w-3.5 h-3.5" /> Stasiun Purwosari / Jebres
                    </div>
                    <p className="text-[11px] text-neutral-400 font-body">Penjemputan Kereta Api Ekonomi & Commuter Line.</p>
                  </div>
                </div>
              </div>

              {/* Form Konfirmasi Kedatangan */}
              <div className="lg:col-span-6 bg-gradient-to-b from-neutral-900 to-black p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <h4 className="text-base font-heading font-bold text-white uppercase flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-400" /> Form Konfirmasi Kedatangan Delegasi
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-body mt-1">
                    Isi data kedatangan kontingen Anda agar tim LO penjemputan siap menyambut di lokasi tiba.
                  </p>
                </div>

                <form onSubmit={handleShuttleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Nama BEM / Perguruan Tinggi *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: BEM UMS / BEM Universitas Muhammadiyah Jakarta"
                      className="w-full bg-black/80 border border-neutral-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                      value={shuttleForm.campus}
                      onChange={(e) => setShuttleForm({...shuttleForm, campus: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Jumlah Delegasi *</label>
                      <input 
                        type="number" 
                        min="1"
                        required
                        className="w-full bg-black/80 border border-neutral-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                        value={shuttleForm.count}
                        onChange={(e) => setShuttleForm({...shuttleForm, count: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Titik Kedatangan *</label>
                      <select
                        className="w-full bg-black/80 border border-neutral-800 text-white text-xs px-3 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                        value={shuttleForm.point}
                        onChange={(e) => setShuttleForm({...shuttleForm, point: e.target.value})}
                      >
                        <option value="Stasiun Solo Balapan">Stasiun Solo Balapan</option>
                        <option value="Bandara Adi Soemarmo (SOC)">Bandara Adi Soemarmo (SOC)</option>
                        <option value="Terminal Tirtonadi">Terminal Tirtonadi</option>
                        <option value="Terminal Kartasura">Terminal Kartasura</option>
                        <option value="Stasiun Purwosari / Jebres">Stasiun Purwosari / Jebres</option>
                        <option value="Kendaraan Pribadi / Bus Kontingen">Kendaraan Pribadi / Bus Kontingen</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Tanggal Tiba *</label>
                      <input 
                        type="date" 
                        required
                        className="w-full bg-black/80 border border-neutral-800 text-white text-xs px-3 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                        value={shuttleForm.date}
                        onChange={(e) => setShuttleForm({...shuttleForm, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Estimasi Jam Tiba *</label>
                      <input 
                        type="time" 
                        required
                        className="w-full bg-black/80 border border-neutral-800 text-white text-xs px-3 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                        value={shuttleForm.time}
                        onChange={(e) => setShuttleForm({...shuttleForm, time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Nama Koordinator *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nama Ketua Delegasi"
                        className="w-full bg-black/80 border border-neutral-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                        value={shuttleForm.leaderName}
                        onChange={(e) => setShuttleForm({...shuttleForm, leaderName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">No. WhatsApp *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="0812xxxx"
                        className="w-full bg-black/80 border border-neutral-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                        value={shuttleForm.phone}
                        onChange={(e) => setShuttleForm({...shuttleForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-xs py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Kirim Konfirmasi Penjemputan via WhatsApp LO
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: INFORMASI AKOMODASI & WISMA PESANTREN MAHASISWA (KAMPUS 4 UMS) */}
          {hospitalityTab === 'hotel' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header Hero Banner for Wisma Pesantren Mahasiswa UMS */}
              <div className="bg-gradient-to-r from-neutral-900/90 via-sky-950/40 to-neutral-900/90 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/40 inline-flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> PENGINAPAN RESMI KONTINGEN SILATNAS 2026
                    </span>
                    <h3 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight">
                      Wisma Pesantren Mahasiswa — Kampus 4 UMS
                    </h3>
                    <p className="text-xs md:text-sm font-body text-neutral-300 leading-relaxed">
                      Seluruh kontingen delegasi BEM Perguruan Tinggi se-Indonesia secara resmi ditempatkan di <strong>Wisma Pesantren Mahasiswa (Kompleks Kampus 4 UMS)</strong>. Lokasi penginapan terpadu yang nyaman, bersih, representatif, bernuansa islami, serta terintegrasi langsung dengan layanan shuttle bus panitia menuju Edutorium UMS.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                    <button 
                      onClick={() => window.open('https://maps.google.com/?q=Pesantren+Mahasiswa+KH+Mas+Mansur+UMS+Surakarta', '_blank')}
                      className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" /> Buka Rute Google Maps
                    </button>
                    <button 
                      onClick={() => {
                        const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent('Halo LO Akomodasi Silatnas BEM UMS, kami dari kontingen ingin menanyakan informasi check-in Wisma Pesantren Mahasiswa Kampus 4 UMS.')}`;
                        window.open(waUrl, '_blank');
                      }}
                      className="bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-amber-400" /> Hubungi LO Akomodasi
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Detail Feature Cards for Wisma Pesantren Mahasiswa */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-3 hover:border-amber-400/40 transition duration-300">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-heading font-bold text-white uppercase">Lokasi Kampus 4 UMS</h4>
                  <p className="text-xs font-body text-neutral-300 leading-relaxed">
                    Terletak di Kompleks Kampus 4 UMS (Jl. KH. Ahmad Dahlan, Gonilan / Kartasura). Berdampingan dengan Fakultas Kedokteran, RSGM, dan Pesantren Mahasiswa KH. Mas Mansur UMS.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> ~3-5 Menit ke Edutorium UMS
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-3 hover:border-sky-400/40 transition duration-300">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-[#38BDF8]">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-heading font-bold text-white uppercase">Fasilitas Wisma Pesantren</h4>
                  <p className="text-xs font-body text-neutral-300 leading-relaxed">
                    Kamar tidur representatif, ranjang & kasur bersih, pendingin ruangan (AC), kamar mandi bersih, akses Wi-Fi kencang UMS, musala/masjid, serta area parkir luas untuk armada kontingen.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-[#38BDF8] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" /> Nyaman & Siap Huni Delegasi
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-3 hover:border-emerald-400/40 transition duration-300">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Bus className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-heading font-bold text-white uppercase">Shuttle & Keamanan 24 Jam</h4>
                  <p className="text-xs font-body text-neutral-300 leading-relaxed">
                    Layanan armada shuttle bus khusus antar-jemput dari Wisma Pesantren Mahasiswa Kampus 4 ke Edutorium UMS selama rangkaian acara berlangsung, didukung posko keamanan & LO 24 jam penuh.
                  </p>
                  <div className="pt-2 text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Standby Pendampingan LO
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POSKO MEDIS & EMERGENCY 24 JAM */}
          {hospitalityTab === 'medical' && (
            <div className="max-w-6xl mx-auto bg-black/40 backdrop-blur-xl border border-red-900/30 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-950/50 border border-red-800/50 flex items-center justify-center text-red-500 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white uppercase">Posko Kesehatan & Layanan Darurat 24 Jam</h3>
                  <p className="text-xs font-body text-neutral-400">Tim Medis & Security BEM UMS siaga penuh memberikan perlindungan selama kegiatan Silatnas.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-red-950/20 border border-red-900/30 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-red-500/20 text-red-400" /> Posko Utama Venue
                  </span>
                  <h4 className="text-sm font-heading font-bold text-white uppercase">Posko Medis Edutorium UMS</h4>
                  <p className="text-xs text-neutral-400 font-body">Dokter, Perawat & Obat-obatan gratis di lantai 1 venue utama.</p>
                </div>
                <div className="bg-red-950/20 border border-red-900/30 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-red-400" /> Rumah Sakit Rujukan
                  </span>
                  <h4 className="text-sm font-heading font-bold text-white uppercase">RS PKU Muhammadiyah & RS UMS</h4>
                  <p className="text-xs text-neutral-400 font-body">Penanganan emergensi tingkat lanjut & unit gawat darurat (IGD 24 Jam).</p>
                </div>
                <div className="bg-red-950/20 border border-red-900/30 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Keamanan Kampus
                  </span>
                  <h4 className="text-sm font-heading font-bold text-white uppercase">Security Patrol UMS</h4>
                  <p className="text-xs text-neutral-400 font-body">Pengawalan rute & keamanan barang bawaan kontingen di lokasi venue.</p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <a
                  href="https://wa.me/6281234567890?text=HALO%20TIM%20MEDIS%20SILATNAS%20BEM%20UMS%20DARURAT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl transition duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                >
                  <Phone className="w-4 h-4" /> Hubungi Posko Medis / Emergency Call Center
                </a>
              </div>
            </div>
          )}
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
        <div id="helpdesk-section" className="bg-gradient-to-r from-[#082F49] via-[#0369A1] to-[#082F49] border border-white/15 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-2xl">
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

        {/* 9. BALAI KOTA SURAKARTA SKYLINE */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[150px] sm:h-[220px] md:h-[300px] mt-32 md:mt-40 pointer-events-none"
        >
          {/* Edutorium UMS (Far Left, deepest layer, viewport-bound) */}
          <img 
            src="/assets/artefak/edutorium.png" 
            alt="Edutorium UMS" 
            className="hidden md:block absolute left-[-28%] lg:left-[-22%] xl:left-[-16%] bottom-[-25px] md:bottom-[-42px] w-[320px] md:w-[460px] lg:w-[580px] xl:w-[660px] h-auto object-contain z-0 opacity-80"
          />

          {/* Siti Walidah UMS (Far Right, deepest layer, viewport-bound) */}
          <img 
            src="/assets/artefak/sitiwalidah.png" 
            alt="Siti Walidah UMS" 
            className="hidden md:block absolute right-[-28%] lg:right-[-22%] xl:right-[-16%] bottom-[-25px] md:bottom-[-42px] w-[320px] md:w-[460px] lg:w-[580px] xl:w-[660px] h-auto object-contain z-0 opacity-80"
          />

          {/* Centered Composition Wrapper (Balai Kota & Gunungan Jawa) */}
          <div className="absolute inset-x-0 bottom-0 h-full max-w-5xl mx-auto flex items-end justify-center z-10">
            {/* Left Gunungan (Tilted Left) */}
            <motion.img 
              src="/assets/artefak/gunungan_jawa.png" 
              alt="" 
              animate={{ rotate: [-14, -10, -14], y: [0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ x: "-50%", rotate: -12 }}
              className="absolute bottom-[-48px] sm:bottom-[-78px] md:bottom-[-110px] left-[18%] sm:left-[22%] md:left-[25%] w-[160px] sm:w-[240px] md:w-[320px] h-auto object-contain opacity-[0.45] origin-bottom transform-gpu z-[5]"
            />

            {/* Right Gunungan (Tilted Right) */}
            <motion.img 
              src="/assets/artefak/gunungan_jawa.png" 
              alt="" 
              animate={{ rotate: [10, 14, 10], y: [0, -2, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{ x: "50%", rotate: 12 }}
              className="absolute bottom-[-48px] sm:bottom-[-78px] md:bottom-[-110px] right-[18%] sm:right-[22%] md:right-[25%] w-[160px] sm:w-[240px] md:w-[320px] h-auto object-contain opacity-[0.45] origin-bottom transform-gpu z-[5]"
            />

            {/* Center Gunungan (Big, Straight) */}
            <motion.img 
              src="/assets/artefak/gunungan_jawa.png" 
              alt="" 
              animate={{ rotate: [-2, 2, -2], y: [0, -3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ x: "-50%", rotate: 0 }}
              className="absolute bottom-[-42px] sm:bottom-[-72px] md:bottom-[-95px] left-1/2 w-[240px] sm:w-[340px] md:w-[460px] h-auto object-contain opacity-[0.45] origin-bottom transform-gpu z-[5]"
            />

            {/* Balai Kota Building in Front */}
            <img 
              src="/assets/artefak/balaikota solo.png" 
              alt="Balai Kota Surakarta" 
              className="absolute bottom-[-30px] sm:bottom-[-50px] md:bottom-[-80px] left-1/2 -translate-x-1/2 w-full max-w-4xl h-auto object-contain z-10 opacity-95"
            />
          </div>
        </motion.div>

      </div>



      {/* Modal 2: Dynamic Signup Form Modal for Catalog Agenda */}
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
