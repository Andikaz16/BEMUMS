// Database Mock using LocalStorage for Dynamic CMS Architecture

const DEFAULT_DATA = {
  // 1. Struktural
  periods: ["2026", "2025"],
  currentPeriod: "2026",
  pimpinan: {
    "2026": [
      { id: 1, name: "Muh. Naufal Aulia Darojat", role: "Presiden Mahasiswa", photo: "/assets/foto_presiden.jpg", bio: "Memimpin dengan visi KOLEKTIVA untuk kemaslahatan mahasiswa UMS." },
      { id: 2, name: "Muh. Faris Abid Muwaffaq", role: "Wakil Presiden Mahasiswa", photo: "/assets/foto_wakil.jpg", bio: "Sinergi aksi dan kolaborasi nyata untuk pelayanan terbaik mahasiswa UMS." }
    ],
    "2025": [
      { id: 3, name: "Ahmad Dahlan", role: "Ketua Umum BEM UMS", photo: "", bio: "Membangun harmoni gerakan mahasiswa." },
      { id: 4, name: "Laila Fitriani", role: "Wakil Ketua Umum BEM UMS", photo: "", bio: "Mewujudkan gerakan advokasi yang tangguh." }
    ]
  },
  kementerian: {
    "2026": [
      { id: 'sek', name: "Sekretaris Kabinet", logo: "/assets/Seketaris.png", desc: "Mengatur tata kelola administrasi dan kesekretariatan BEM UMS secara tersistem dan profesional.", members: [
        { name: "Figur Ahmad Brilian", title: "Sekretaris Kabinet" },
        { name: "Khalda Syifa Nida", title: "Wakil Sekretaris Kabinet" }
      ]},
      { id: 'ben', name: "Bendahara Kabinet", logo: "/assets/Bendahara.png", desc: "Mengelola arus kas, transparansi finansial, dan penganggaran kegiatan BEM UMS.", members: [
        { name: "Nisa Hidayanti Putri", title: "Bendahara Kabinet" }
      ]},
      { id: 3, name: "Kementerian Advokasi & Kesejahteraan Mahasiswa", logo: "/assets/Kementerian Advokasi & Kesejahteraan Mahasiswa.png", desc: "Mengawal kebijakan kampus, memperjuangkan hak-hak akademik dan finansial mahasiswa UMS.", members: [
        { name: "Anggris Bagus Eka Saputra", title: "Menteri" },
        { name: "Pinkan Nuraini", title: "Sekretaris Menteri" },
        { name: "Abdullah Tsaqif Imtiyazi", title: "Staff Menteri" },
        { name: "Arkan Ramadhani Inayatullah", title: "Staff Menteri" },
        { name: "Muhammad Kafi Najamul Daim", title: "Staff Menteri" },
        { name: "Sherlina Devi Oktavia", title: "Staff Menteri" },
        { name: "Alya Nabila", title: "Staff Menteri" }
      ]},
      { id: 1, name: "Kementerian Dalam Negeri", logo: "/assets/Kementerian dalam negeri.png", desc: "Mengoordinasikan hubungan internal organisasi, fakultas, dan lembaga mahasiswa di lingkungan UMS.", members: [
        { name: "Firda Hayyuning Nusa", title: "Menteri" },
        { name: "Shilvy Ameilina Putri", title: "Sekretaris Menteri" },
        { name: "Febriani Sekar Cikal", title: "Staff Menteri" },
        { name: "Yasinta Widia Anjati", title: "Staff Menteri" },
        { name: "Rangga Budi Hartono", title: "Staff Menteri" },
        { name: "Ridwan Dimas Arya Rangga Pangestu", title: "Staff Menteri" },
        { name: "Astriana Dwi Yuliyanti", title: "Staff Menteri" }
      ]},
      { id: 5, name: "Kementerian Pergerakan", logo: "/assets/Kementerian Pergerakan.png", desc: "Menjadi lokomotif pergerakan sosial-politik dan kebangsaan, merespons isu-isu strategis secara tangkas dan kritis.", members: [
        { name: "Riezky Prayudha Anggito Prabowo", title: "Menteri" },
        { name: "Hafidh Dzaky Hananta", title: "Sekretaris Menteri" },
        { name: "Ahmad Muwaffiqul Choir", title: "Staff Menteri" },
        { name: "Daffa Alfarozy Aristyanova", title: "Staff Menteri" },
        { name: "Jordan Purwoko Putro", title: "Staff Menteri" },
        { name: "Rafa Hanif Maulida", title: "Staff Menteri" },
        { name: "Muhammad Rifqi Amani", title: "Staff Menteri" }
      ]},
      { id: 4, name: "Kementerian Pengembangan Organisasi & Profesionalisme", logo: "/assets/Kementerian Pengembangan Organisasi & Profesionalisme.png", desc: "Menyelenggarakan pelatihan kepemimpinan, kaderisasi, dan pengembangan potensi keorganisasian mahasiswa.", members: [
        { name: "Bramantyo Ikhsanul Hakim", title: "Menteri" },
        { name: "Sheila Mei Lisa", title: "Sekretaris Menteri" },
        { name: "Vivia Ayu Maharani", title: "Staff Menteri" },
        { name: "Puput Rahmawati", title: "Staff Menteri" },
        { name: "Muhamad Amarrudin Khan", title: "Staff Menteri" },
        { name: "Naura Shifa Putri Sofiani", title: "Staff Menteri" },
        { name: "Burhanuddin Alhakim", title: "Staff Menteri" },
        { name: "Calista Putri Fatimaheswari", title: "Staff Menteri" }
      ]},
      { id: 2, name: "Kementerian Luar Negeri", logo: "/assets/Menteri luar neger.png", desc: "Membangun jaringan kemitraan strategis eksternal dengan BEM universitas lain, media, dan instansi nasional.", members: [
        { name: "Jody Julian Putra Caesar", title: "Menteri" },
        { name: "Arya Firmansyah", title: "Sekretaris Menteri" },
        { name: "Sabrina Qurrotul'ain Dakhan", title: "Staff Menteri" },
        { name: "Ahmad Rizky Fuady", title: "Staff Menteri" },
        { name: "Aulia Annisa Musdhalifah", title: "Staff Menteri" },
        { name: "Nisa Fadhilah Purnomo", title: "Staff Menteri" }
      ]},
      { id: 6, name: "Kementerian Media & Informasi", logo: "/assets/medinfo.png", desc: "Membangun citra publik, mengelola media sosial, dan menyebarkan informasi pergerakan BEM UMS secara masif dan kreatif.", members: [
        { name: "Chandra Nur Prasetya", title: "Menteri" },
        { name: "Farida Amani", title: "Sekretaris Menteri" },
        { name: "Muhammad Afrizal Zaini", title: "Staff Menteri" },
        { name: "Siti Rusmiati", title: "Staff Menteri" },
        { name: "Daffa Chandra Himawan", title: "Staff Menteri" },
        { name: "Salsa Dwi Anggraini", title: "Staff Menteri" },
        { name: "Yoga Andika Hanryant Pratama", title: "Staff Menteri" }
      ]}
    ],
    "2025": [
      { id: 1, name: "Kementerian Keorganisasian", desc: "Mengatur administrasi organisasi internal.", members: [{ name: "Taufik Hidayat", title: "Menteri" }]}
    ]
  },

  // 2. Artikel & Kegiatan
  categories: ["Semua", "Berita", "Opini", "Kegiatan"],
  articles: [
    { id: 1, title: "Revitalisasi Fasilitas Olahraga Kampus Terpadu", date: "2026-08-05", category: "Berita", thumbnail: "", desc: "BEM UMS bersama Rektorat menyepakati renovasi lapangan sepak bola dan gedung olahraga mulai September 2026." },
    { id: 2, title: "Suara Mahasiswa: Urgensi Kebebasan Akademik", date: "2026-08-01", category: "Opini", thumbnail: "", desc: "Ulasan mendalam mengenai peran mahasiswa dalam menjaga iklim demokrasi dan akademik yang sehat di kampus." },
    { id: 3, title: "Diskusi Publik: Masa Depan Pendidikan Tinggi", date: "2026-07-28", category: "Kegiatan", thumbnail: "", desc: "Menghadirkan tokoh nasional dalam mengupas arah kebijakan pendidikan pasca pergantian kurikulum nasional." }
  ],

  // 3. Dokumentasi (Albums)
  albums: [
    { id: 1, title: "PKKMB UMS 2026", date: "2026-07-15", desc: "Dokumentasi penyambutan mahasiswa baru tahun ajaran 2026/2027.", photos: [] },
    { id: 2, title: "Latihan Kepemimpinan Mahasiswa", date: "2026-06-10", desc: "Pelatihan manajerial tingkat menengah bagi calon pemimpin organisasi.", photos: [] },
    { id: 3, title: "Aksi Sosial Peduli Bencana", date: "2026-05-20", desc: "Penyaluran bantuan logistik dan trauma healing pasca bencana lokal.", photos: [] }
  ],

  // 4. Hubungi Kami
  contact: {
    whatsapp: "https://wa.me/6281234567890",
    instagram: "https://instagram.com/bem_ums",
    tiktok: "https://tiktok.com/@bem_ums",
    email: "bem@ums.ac.id",
    address: "Gedung Student Center UMS Lantai 2, Jl. Ahmad Yani, Pabelan, Kartasura, Sukoharjo, Jawa Tengah"
  },

  // 5. Oprec (Halaman Bergabung)
  oprec: {
    isOpen: false,
    title: "OPEN RECRUITMENT BEM UMS 2026",
    desc: "Mari bergabung menjadi bagian dari agen perubahan! Bersama Kabinet KOLEKTIVA, saatnya berdedikasi dan melangkah maju untuk UMS yang lebih berdaya saing global.",
    applicants: []
  },

  // 6. Lapor Pres!
  reports: [],
  laporDescription: "Sampaikan aspirasi, kritik, keluhan fasilitas, atau aduan akademik secara langsung kepada Ketua BEM UMS. Kerahasiaan identitas dan data Anda terjamin sepenuhnya.",

  // 7. Jadilah Volunteer
  volunteerCatalog: [
    { id: 1, title: "Volunteer UMS Mengajar", isOpen: true, requirements: "Mahasiswa aktif UMS minimal semester 3, memiliki minat mengajar anak-anak.", jobdesc: "Mengajar sekolah dasar di pinggiran kota selama 3 bulan.", schedule: "Agustus - Oktober 2026", applicants: [] },
    { id: 2, title: "Panitia Aksi Peduli Lingkungan", isOpen: false, requirements: "Terbuka untuk seluruh mahasiswa aktif UMS.", jobdesc: "Mengoordinasi aksi penanaman 1000 pohon di kawasan Lereng Lawu.", schedule: "Selesai (Juli 2026)", applicants: [] }
  ],

  // 8. Visi & Misi
  visiMisi: {
    visi: "MENCIPTAKAN EKOSISTEM KAMPUS YANG INKLUSIF DAN PROGRESIF",
    desc: "Visi kami adalah menjadi motor penggerak perubahan yang inklusif, transparan, dan berorientasi pada kesejahteraan mahasiswa melalui program kerja yang nyata dan berkelanjutan.",
    misi: [
      "Mengoptimalkan peran advokasi yang solutif bagi permasalahan akademik dan fasilitas mahasiswa.",
      "Membangun sinergi kolaboratif antar lembaga kemahasiswaan di tingkat fakultas dan universitas.",
      "Mendorong digitalisasi layanan informasi dan aspirasi mahasiswa yang transparan dan akuntabel.",
      "Menyelenggarakan kegiatan pengembangan minat bakat, keilmuan, dan aksi sosial masyarakat secara merata."
    ],
    pillars: [
      { id: 1, title: "Advokasi & Solutif", desc: "Mendampingi serta memperjuangkan aspirasi dan hak mahasiswa di segala tingkat kebijakan." },
      { id: 2, title: "Sinergi Kolaboratif", desc: "Memupuk kebersamaan dan kerja sama antar ormawa demi keselarasan gerak mahasiswa." },
      { id: 3, title: "Aksi Sosial Nyata", desc: "Mengabdi dengan ketulusan hati untuk memecahkan problematika kemasyarakatan." }
    ]
  },
  galeriPergerakan: [
    "/assets/gedung.jpg",
    "/assets/foto_presiden.jpg",
    "/assets/foto_wakil.jpg"
  ]
};

import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db as firestore } from "./firebase";

export const initDB = (setDb) => {
  // Optimistic initial load from localStorage
  const localData = localStorage.getItem("bem_ums_db");
  if (localData) {
    setDb(JSON.parse(localData));
  } else {
    setDb(DEFAULT_DATA);
  }

  const DOC_REF = doc(firestore, "cms", "data");

  // Subscribe to realtime updates
  const unsubscribe = onSnapshot(DOC_REF, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Auto-patch photo, names & roles for Ketua Umum & Wakil in existing session
      if (data.pimpinan && data.pimpinan["2026"]) {
        const fadhil = data.pimpinan["2026"].find(p => p.id === 1);
        if (fadhil) {
          fadhil.name = "Muhammad Naufal Aulia Darojat";
          fadhil.role = "Presiden Mahasiswa";
          fadhil.photo = "/assets/foto_presiden.jpg";
        }
        const rahma = data.pimpinan["2026"].find(p => p.id === 2);
        if (rahma) {
          rahma.name = "Muhammad Faris Abid Muwaffaq";
          rahma.role = "Wakil Presiden Mahasiswa";
          rahma.photo = "/assets/foto_wakil.jpg";
        }
      }
      
      localStorage.setItem("bem_ums_db", JSON.stringify(data));
      setDb(data);
    } else {
      // Initialize if empty
      setDoc(DOC_REF, DEFAULT_DATA);
    }
  }, (error) => {
    console.error("Firebase sync error: ", error);
  });

  return unsubscribe;
};

// Deprecated synchronous getDB, only used for initial state fallback
export const getDB = () => {
  const localData = localStorage.getItem("bem_ums_db");
  return localData ? JSON.parse(localData) : DEFAULT_DATA;
};

export const saveDB = async (data) => {
  // Save locally first for instant UI response
  localStorage.setItem("bem_ums_db", JSON.stringify(data));
  
  // Then upload to Firebase
  try {
    const DOC_REF = doc(firestore, "cms", "data");
    await setDoc(DOC_REF, data);
  } catch (error) {
    console.error("Error saving to Firebase: ", error);
    alert("Gagal menyimpan ke server: " + error.message);
  }
};






