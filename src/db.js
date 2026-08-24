// Database Mock using LocalStorage for Dynamic CMS Architecture
import { ormawaList } from './data/ormawaData.js'; // Temporary import for migration

const DEFAULT_DATA = {
  // 0. Ormawa Hub
  ormawa: ormawaList,
  
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
      { id: 3, name: "Kementerian Advokasi & Kesejahteraan Mahasiswa", logo: "/assets/Kementerian Advokasi & Kesejahteraan Mahasiswa.png", desc: "Kementerian yang menjadi representasi BEM UMS dalam hubungan eksternal, baik dengan BEM/organisasi mahasiswa kampus lain, aliansi mahasiswa, maupun mitra di luar kampus.", members: [
        { name: "Anggris Bagus Eka Saputra", title: "Menteri" },
        { name: "Pinkan Nuraini", title: "Sekretaris Menteri" },
        { name: "Abdullah Tsaqif Imtiyazi", title: "Staff Menteri" },
        { name: "Arkan Ramadhani Inayatullah", title: "Staff Menteri" },
        { name: "Muhammad Kafi Najamul Daim", title: "Staff Menteri" },
        { name: "Sherlina Devi Oktavia", title: "Staff Menteri" },
        { name: "Alya Nabila", title: "Staff Menteri" }
      ]},
      { id: 1, name: "Kementerian Dalam Negeri", logo: "/assets/Kementerian dalam negeri.png", desc: "Kementerian yang berfokus pada konsolidasi dan hubungan internal kampus, yaitu menjaga komunikasi dan sinergi antara BEM UMS dengan lembaga-lembaga kemahasiswaan internal seperti Himpunan Mahasiswa Program Studi (HMP), Unit Kegiatan Mahasiswa (UKM), dan Dewan Perwakilan Mahasiswa (DPM).", members: [
        { name: "Firda Hayyuning Nusa", title: "Menteri" },
        { name: "Shilvy Ameilina Putri", title: "Sekretaris Menteri" },
        { name: "Febriani Sekar Cikal", title: "Staff Menteri" },
        { name: "Yasinta Widia Anjati", title: "Staff Menteri" },
        { name: "Rangga Budi Hartono", title: "Staff Menteri" },
        { name: "Ridwan Dimas Arya Rangga Pangestu", title: "Staff Menteri" },
        { name: "Astriana Dwi Yuliyanti", title: "Staff Menteri" }
      ]},
      { id: 5, name: "Kementerian Pergerakan", logo: "/assets/Kementerian Pergerakan.png", desc: "Kementerian yang menjadi motor penggerak sikap kritis mahasiswa, dengan fokus pada pengkajian isu-isu strategis serta penyikapan dan penyuaraan aspirasi mahasiswa atas isu kampus, daerah, maupun nasional.", members: [
        { name: "Riezky Prayudha Anggito Prabowo", title: "Menteri" },
        { name: "Hafidh Dzaky Hananta", title: "Sekretaris Menteri" },
        { name: "Ahmad Muwaffiqul Choir", title: "Staff Menteri" },
        { name: "Daffa Alfarozy Aristyanova", title: "Staff Menteri" },
        { name: "Jordan Purwoko Putro", title: "Staff Menteri" },
        { name: "Rafa Hanif Maulida", title: "Staff Menteri" },
        { name: "Muhammad Rifqi Amani", title: "Staff Menteri" }
      ]},
      { id: 4, name: "Kementerian Pengembangan Organisasi & Profesionalisme", logo: "/assets/Kementerian Pengembangan Organisasi & Profesionalisme.png", desc: "Kementerian yang berfokus pada pengembangan kapasitas sumber daya manusia (SDM) pengurus BEM UMS serta peningkatan tata kelola organisasi yang profesional.", members: [
        { name: "Bramantyo Ikhsanul Hakim", title: "Menteri" },
        { name: "Sheila Mei Lisa", title: "Sekretaris Menteri" },
        { name: "Vivia Ayu Maharani", title: "Staff Menteri" },
        { name: "Puput Rahmawati", title: "Staff Menteri" },
        { name: "Muhamad Amarrudin Khan", title: "Staff Menteri" },
        { name: "Naura Shifa Putri Sofiani", title: "Staff Menteri" },
        { name: "Burhanuddin Alhakim", title: "Staff Menteri" },
        { name: "Calista Putri Fatimaheswari", title: "Staff Menteri" }
      ]},
      { id: 2, name: "Kementerian Luar Negeri", logo: "/assets/Menteri luar neger.png", desc: "Kementerian yang menjadi representasi BEM UMS dalam hubungan eksternal, baik dengan BEM/organisasi mahasiswa kampus lain, aliansi mahasiswa, maupun mitra di luar kampus.", members: [
        { name: "Jody Julian Putra Caesar", title: "Menteri" },
        { name: "Arya Firmansyah", title: "Sekretaris Menteri" },
        { name: "Sabrina Qurrotul'ain Dakhan", title: "Staff Menteri" },
        { name: "Ahmad Rizky Fuady", title: "Staff Menteri" },
        { name: "Aulia Annisa Musdhalifah", title: "Staff Menteri" },
        { name: "Nisa Fadhilah Purnomo", title: "Staff Menteri" }
      ]},
      { id: 6, name: "Kementerian Media & Informasi", logo: "/assets/medinfo.png", desc: "Kementerian yang mengelola seluruh publikasi, dokumentasi, dan komunikasi informasi BEM UMS kepada mahasiswa maupun publik, sekaligus menjaga citra dan branding organisasi.", members: [
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
    { id: 1, title: "Volunteer Kepanitiaan Seleknas PTMAI 2026", isOpen: true, requirements: "Terbuka untuk seluruh mahasiswa aktif UMS.", jobdesc: "Berpartisipasi sebagai panitia untuk menyukseskan agenda Seleksi Nasional PTMAI 2026.", schedule: "Agustus - September 2026", applicants: [] }
  ],

  // 8. Visi & Misi
  visiMisi: {
    visi: "GERAKAN PROGRESIF DAN KOLEKTIF",
    desc: "Terciptanya gerakan progresif dan kolektif mahasiswa demi terwujudnya perubahan sosial yang konstruktif dan berkeadilan.",
    misi: [
      "Mendorong gerakan progresif untuk memperbarui pola pikir dan aksi mahasiswa agar lebih responsif terhadap perubahan zaman.",
      "Membangun gerakan kolektif melalui penguatan solidaritas, partisipasi, dan kerja kolaboratif lintas ORMAWA serta seluruh elemen mahasiswa.",
      "Menghadirkan gerakan konstruktif dengan memposisikan BEM sebagai mitra kritis sekaligus solutif dalam merespons berbagai persoalan kampus dan sosial.",
      "Mewujudkan gerakan berkeadilan melalui keberpihakan nyata pada perlindungan kepentingan mahasiswa dan masyarakat yang termarjinalkan."
    ],
    pillars: [
      { id: 1, title: "ORGANIZE", desc: "Membangun ruang-ruang konsolidasi yang inklusif, mempererat solidaritas antar-fakultas, dan menyatukan setiap potensi mahasiswa menjadi kekuatan yang terorganisir." },
      { id: 2, title: "EDUCATE", desc: "Menghidupkan iklim akademis yang kritis melalui diskusi, wacana publik, dan literasi gerakan guna membekali mahasiswa dengan kesadaran sosial yang tajam." },
      { id: 3, title: "AGITATE", desc: "Mendorong aksi nyata, mengawal kebijakan kampus maupun nasional, dan berani bersuara tegas menolak segala bentuk ketidakadilan." }
    ]
  },
  galeriPergerakan: [
    "/assets/background.png",
    "/assets/foto_presiden.jpg",
    "/assets/foto_wakil.jpg"
  ],
  silatnasCatalog: [],
  kegiatan: [
    {
      id: 1,
      date: "2026-08-15",
      title: "Rapat Kerja Paripurna",
      desc: "Rapat pembahasan program kerja seluruh kementerian BEM UMS 2026."
    },
    {
      id: 2,
      date: "2026-08-17",
      title: "Upacara Kemerdekaan",
      desc: "Upacara bendera memperingati HUT RI di Lapangan Utama UMS."
    },
    { id: 'masta-2026', title: "Rangkaian Masta Mahasiswa Baru", desc: "Universitaria, Fakultaria, Ekspo UKM, Tes Baca Al-Qur'an, dan Pretest TOEP.", date: "2026-08-31", endDate: "2026-09-05" },
    { id: 'kuliah-1-2026', title: "Masa Kuliah Hari Pertama", desc: "Awal perkuliahan Semester Ganjil TA 2026/2027.", date: "2026-09-07" },
    { id: 'uts-2026', title: "Ujian Tengah Semester (UTS)", desc: "UTS Semester Ganjil TA 2026/2027.", date: "2026-11-02", endDate: "2026-11-14" },
    { id: 'uas-2027', title: "Ujian Akhir Semester (UAS)", desc: "UAS Semester Ganjil TA 2026/2027.", date: "2027-01-04", endDate: "2027-01-16" }
  ]
};

import { doc, setDoc, onSnapshot, runTransaction, increment, collection, getDocs } from "firebase/firestore";
import { db as firestore } from "./firebase";

export const initDB = (setDb, setIsFirebaseLoaded) => {
  // Optimistic initial load agar tidak ada layar hitam "Loading" yang lama
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
      
      // Simpan data terbaru dari Firebase ke memori lokal untuk loading cepat berikutnya
      localStorage.setItem("bem_ums_db", JSON.stringify(data));

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

      // Auto-patch Kalender Kegiatan
      if (data.kegiatan) {
        const eventsToAdd = [
          { id: 'kuliah-1-2026', title: "Masa Kuliah Hari Pertama", desc: "Awal perkuliahan Semester Ganjil TA 2026/2027.", date: "2026-09-07" },
          { id: 'uts-2026', title: "Ujian Tengah Semester (UTS)", desc: "UTS Semester Ganjil TA 2026/2027.", date: "2026-11-02", endDate: "2026-11-14" },
          { id: 'uas-2027', title: "Ujian Akhir Semester (UAS)", desc: "UAS Semester Ganjil TA 2026/2027.", date: "2027-01-04", endDate: "2027-01-16" },
        ];
        
        eventsToAdd.forEach(ev => {
          if (!data.kegiatan.find(k => k.id === ev.id)) {
            data.kegiatan.push(ev);
          }
        });
      }
      
      setDb(data);
      if (setIsFirebaseLoaded) setIsFirebaseLoaded(true);
    } else {
      // Initialize if empty
      setDoc(DOC_REF, DEFAULT_DATA);
      if (setIsFirebaseLoaded) setIsFirebaseLoaded(true);
    }
  }, (error) => {
    console.error("Firebase sync error: ", error);
    if (setIsFirebaseLoaded) setIsFirebaseLoaded(true);
  });

  return unsubscribe;
};

// Deprecated
export const getDB = () => {
  return DEFAULT_DATA;
};

export const saveDB = async (data) => {
  // Add timestamp to prevent old Firebase snapshots from overriding local data
  data.lastUpdated = Date.now();
  
  // Save locally first for instant UI response (agar tidak ada delay saat admin klik simpan)
  localStorage.setItem("bem_ums_db", JSON.stringify(data));
  
  // Then upload to Firebase
  try {
    const DOC_REF = doc(firestore, "cms", "data");
    await setDoc(DOC_REF, data);
  } catch (error) {
    console.error("Error saving to Firebase: ", error);
    alert("GAGAL MENYIMPAN KE SERVER!\n\nUkuran file/foto yang Anda masukkan terlalu besar (batas maksimal server adalah 1MB per kali simpan). \n\nMohon hapus beberapa foto terakhir atau kompres foto menjadi lebih kecil, lalu coba simpan lagi.");
    throw error;
  }
};

// --- SAFE TRANSACTION FUNCTIONS FOR PUBLIC FORMS ---
// These prevent a user with stale local cache from wiping the whole database when submitting a form

export const addOprecApplicant = async (applicantData) => {
  const DOC_REF = doc(firestore, "cms", "data");
  await runTransaction(firestore, async (transaction) => {
    const docSnap = await transaction.get(DOC_REF);
    if (!docSnap.exists()) throw new Error("Database kosong!");
    const data = docSnap.data();
    transaction.update(DOC_REF, {
      oprec: {
        ...data.oprec,
        applicants: [...(data.oprec.applicants || []), applicantData]
      }
    });
  });
};

export const addVolunteerApplicant = async (volId, applicantData) => {
  const DOC_REF = doc(firestore, "cms", "data");
  await runTransaction(firestore, async (transaction) => {
    const docSnap = await transaction.get(DOC_REF);
    if (!docSnap.exists()) throw new Error("Database kosong!");
    const data = docSnap.data();
    
    const updatedCatalog = (data.volunteerCatalog || []).map(v => {
      if (v.id === volId) {
        return {
          ...v,
          applicants: [...(v.applicants || []), applicantData]
        };
      }
      return v;
    });
    
    transaction.update(DOC_REF, { volunteerCatalog: updatedCatalog });
  });
};

export const addSilatnasApplicant = async (eventId, applicantData) => {
  const DOC_REF = doc(firestore, "cms", "data");
  await runTransaction(firestore, async (transaction) => {
    const docSnap = await transaction.get(DOC_REF);
    if (!docSnap.exists()) throw new Error("Database kosong!");
    const data = docSnap.data();
    
    const updatedCatalog = (data.silatnasCatalog || []).map(v => {
      if (v.id === eventId) {
        return {
          ...v,
          applicants: [...(v.applicants || []), applicantData]
        };
      }
      return v;
    });
    
    transaction.update(DOC_REF, { silatnasCatalog: updatedCatalog });
  });
};




// --- WEB ANALYTICS ---
export const incrementPageView = async (pageName) => {
  if (pageName === 'admin' || !pageName) return;
  try {
    const today = new Date();
    today.setHours(today.getHours() + 7); // Force WIB
    const dateStr = today.toISOString().split('T')[0];
    
    // --- SISTEM ANTI-CHEAT (Berdasarkan Device/Browser) ---
    // Mencegah spam klik / refresh halaman berkali-kali
    const viewedKey = `visited_${dateStr}_${pageName}`;
    
    // Bersihkan kunci localStorage hari-hari sebelumnya agar tidak menumpuk
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('visited_') && !key.includes(dateStr)) {
        localStorage.removeItem(key);
      }
    });

    if (localStorage.getItem(viewedKey)) {
      // Jika device ini sudah pernah mengunjungi halaman ini pada hari yang sama, abaikan!
      return; 
    }
    
    // Tandai bahwa device ini SAH sudah berkunjung hari ini
    localStorage.setItem(viewedKey, 'true');

    const DOC_REF = doc(firestore, 'analytics', dateStr);
    await setDoc(DOC_REF, {
      date: dateStr,
      total: increment(1),
      paths: {
        [pageName]: increment(1)
      }
    }, { merge: true });
  } catch (err) {
    console.warn('Analytics disabled/error');
  }
};

export const getAnalytics = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, 'analytics'));
    const data = [];
    snapshot.forEach(doc => data.push(doc.data()));
    return data.sort((a, b) => b.date.localeCompare(a.date));
  } catch (err) {
    console.error('Failed to get analytics', err);
    return [];
  }
};
