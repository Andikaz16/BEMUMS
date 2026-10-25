import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, Image, Phone, UserCheck, AlertTriangle, 
  Settings, Layers, Plus, Trash2, Edit3, Check, X, Download, Calendar, BarChart3, Navigation, MessageCircle,
  Lock, Unlock, ClipboardCheck, Upload, QrCode, Maximize2, Minimize2, Clock, MapPin, Sparkles, ArrowLeft, Copy, ExternalLink
} from 'lucide-react';
import QRCode from 'qrcode';
import * as XLSX from 'xlsx';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import StatistikAdmin from './StatistikAdmin.jsx';
import { sortItemsByDateDesc } from '../db.js';

export default function AdminCMS({ db, onUpdateDB }) {
  const [activeTab, setActiveTab] = useState('struktural');
  const quillRef = React.useRef(null);
  
  const [autoBackups, setAutoBackups] = useState([]);

  // --- Auto Backup System ---
  React.useEffect(() => {
    if (!db) return;
    try {
      const stored = localStorage.getItem("bem_ums_auto_backups");
      let backups = stored ? JSON.parse(stored) : [];
      
      const now = Date.now();
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;
      
      let shouldBackup = false;
      if (backups.length === 0) {
        shouldBackup = true;
      } else {
        const lastBackupTime = backups[0].timestamp;
        if (now - lastBackupTime >= TWELVE_HOURS) {
          shouldBackup = true;
        }
      }
      
      if (shouldBackup) {
        const newBackup = {
          timestamp: now,
          dateString: new Date(now).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
          lastSynced: now,
          data: db
        };
        backups.unshift(newBackup);
        if (backups.length > 14) backups.pop(); // Simpan max 14 backup (7 hari terakhir)
        localStorage.setItem("bem_ums_auto_backups", JSON.stringify(backups));
      } else if (backups.length > 0) {
        // SINKRONISASI OTOMATIS: Jika admin menambah/mengedit data di sesi ini,
        // perbarui isi file backup teratas agar SELALU membawa data paling baru!
        backups[0].data = db;
        backups[0].lastSynced = now;
        localStorage.setItem("bem_ums_auto_backups", JSON.stringify(backups));
      }
      
      setAutoBackups(backups);
    } catch(e) {
      console.error("Gagal memproses auto backup", e);
    }
  }, [db]);

  // --- Custom Alert State ---
  const [alertState, setAlertState] = useState({ isOpen: false, message: '', type: 'success' });
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: '', onConfirm: null });
  const alertTimeoutRef = React.useRef(null);
  
  const showCustomAlert = React.useCallback((message, type = 'success', duration = 4000) => {
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    setAlertState({ isOpen: true, message, type });
    
    if (duration > 0) {
      alertTimeoutRef.current = setTimeout(() => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
      }, duration);
    }
  }, []);

  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `backup_bemums_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    showCustomAlert("Database berhasil didownload! Simpan file ini baik-baik.");
  };

  const handleDownloadAutoBackup = (backup) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup.data, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    const safeDate = backup.dateString.replace(/[,:\s]+/g, '_').toLowerCase();
    dlAnchorElem.setAttribute("download", `auto_backup_bemums_${safeDate}.json`);
    dlAnchorElem.click();
    showCustomAlert(`Auto-Backup (${backup.dateString}) berhasil didownload!`);
  };

  const handleRestoreBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    confirmAction("PERINGATAN! Me-restore database akan menimpa SELURUH data yang ada saat ini. Anda yakin?", () => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target.result);
          if (parsedData.categories) {
            onUpdateDB(parsedData);
            showCustomAlert("Database berhasil dipulihkan!");
          } else {
            showCustomAlert("File backup tidak valid!", "error");
          }
        } catch (e) {
          showCustomAlert("Gagal membaca file backup!", "error");
        }
      };
      reader.readAsText(file);
    });
    e.target.value = null; // reset input
  };

  // PROTEKSI COPY-PASTE GAMBAR BASE64
  React.useEffect(() => {
    const handlePaste = (e) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          e.stopPropagation();
          showCustomAlert("DILARANG COPY-PASTE GAMBAR! 🚫\nSistem menolak gambar copy-paste karena akan merusak database. Silakan gunakan ikon 'Gambar' di menu bar atas artikel untuk mengupload gambar dengan aman.", "error", 8000);
          return false;
        }
      }
    };
    // Gunakan capture phase agar jalan sebelum Quill memprosesnya
    document.addEventListener('paste', handlePaste, true);
    return () => document.removeEventListener('paste', handlePaste, true);
  }, [showCustomAlert]);

  const confirmAction = (message, callback) => {
    setConfirmState({ isOpen: true, message, onConfirm: callback });
  };

  // --- State for Forms ---
  // Period Form
  const [newPeriod, setNewPeriod] = useState('');
  
  // Member Form
  const [selectedPeriod, setSelectedPeriod] = useState(db.currentPeriod);
  const [memberForm, setMemberForm] = useState({ id: null, name: '', role: '', photo: '', bio: '' });
  const [isEditingMember, setIsEditingMember] = useState(false);

  // Staff Muda Form
  const [staffMudaForm, setStaffMudaForm] = useState({ id: null, name: '', role: '', photo: '' });
  const [isEditingStaffMuda, setIsEditingStaffMuda] = useState(false);

  // Department Form
  const [deptForm, setDeptForm] = useState({ id: null, name: '', desc: '', members: [] });
  const [isEditingDept, setIsEditingDept] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberTitle, setNewMemberTitle] = useState('');
  const [newMemberPhoto, setNewMemberPhoto] = useState('');
  const [editingMemberIndex, setEditingMemberIndex] = useState(null);

  // Article Form
  const [articleForm, setArticleForm] = useState({ id: null, title: '', category: 'Berita', date: '', thumbnail: '', desc: '', content: '' });
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Album Form
  const [albumForm, setAlbumForm] = useState({ id: null, title: '', date: '', desc: '', driveUrl: '', photos: [] });
  const [isEditingAlbum, setIsEditingAlbum] = useState(false);
  const [isAddingAlbum, setIsAddingAlbum] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  // Ormawa Hub Form
  const [ormawaForm, setOrmawaForm] = useState({ id: null, name: '', category: '', desc: '', fullDesc: '', logoUrl: '', bannerUrl: '', websiteUrl: '', proker: [], strukpimp: [] });
  const [isEditingOrmawa, setIsEditingOrmawa] = useState(false);
  const [isAddingOrmawa, setIsAddingOrmawa] = useState(false);
  const [newProkerTitle, setNewProkerTitle] = useState('');
  const [newProkerDesc, setNewProkerDesc] = useState('');
  const [newPimpName, setNewPimpName] = useState('');
  const [newPimpRole, setNewPimpRole] = useState('');

  // Contact Form
  const [contactForm, setContactForm] = useState({ ...db.contact });

  // Oprec Form
  const [oprecTitle, setOprecTitle] = useState(db.oprec.title);
  const [oprecDesc, setOprecDesc] = useState(db.oprec.desc);
  const [oprecIsOpen, setOprecIsOpen] = useState(db.oprec.isOpen);

  // Galeri Pergerakan
  const [newGaleriImg, setNewGaleriImg] = useState('');

  // Volunteer Catalog Form
  const [volForm, setVolForm] = useState({ id: null, title: '', isOpen: true, requirements: '', jobdesc: '', schedule: '', templateUrl: '' });
  const [isEditingVol, setIsEditingVol] = useState(false);
  const [isAddingVol, setIsAddingVol] = useState(false);

  // Silatnas Catalog Form
  const [silatnasForm, setSilatnasForm] = useState({ id: null, title: '', isOpen: true, description: '', location: '', schedule: '', extraFields: [] });
  const [isEditingSilatnas, setIsEditingSilatnas] = useState(false);
  const [isAddingSilatnas, setIsAddingSilatnas] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');

  // Visi Misi Form
  const [visiMisiForm, setVisiMisiForm] = useState({
    visi: db.visiMisi?.visi || '',
    desc: db.visiMisi?.desc || '',
    misi: db.visiMisi?.misi || [],
    pillars: db.visiMisi?.pillars || []
  });

  // Silatnas Additional Fields
  const [silatnasVisiMisiForm, setSilatnasVisiMisiForm] = useState({
    visiTitle: db.silatnasVisiMisi?.visiTitle || '',
    visiDesc: db.silatnasVisiMisi?.visiDesc || '',
    misiTitle: db.silatnasVisiMisi?.misiTitle || '',
    misiDesc: db.silatnasVisiMisi?.misiDesc || ''
  });
  const [silatnasAlurForm, setSilatnasAlurForm] = useState(db.silatnasAlur || []);
  const [silatnasTimelineList, setSilatnasTimelineList] = useState(db.silatnasTimeline || []);
  const [newSilatnasDay, setNewSilatnasDay] = useState({ day: '', title: '', desc: '' });
  const [editingSilatnasDayIndex, setEditingSilatnasDayIndex] = useState(null);

  const [silatnasDocsList, setSilatnasDocsList] = useState(db.silatnasDocs || []);
  const [newSilatnasDoc, setNewSilatnasDoc] = useState({ title: '', desc: '', size: '', url: '' });
  const [editingSilatnasDocIndex, setEditingSilatnasDocIndex] = useState(null);

  const [silatnasCultureList, setSilatnasCultureList] = useState(db.silatnasCulture || []);
  const [newSilatnasCulture, setNewSilatnasCulture] = useState({ category: '', title: '', desc: '', highlight: '', location: '', image: '' });
  const [editingSilatnasCultureIndex, setEditingSilatnasCultureIndex] = useState(null);

  const [silatnasCampusesList, setSilatnasCampusesList] = useState(db.silatnasCampuses || []);
  const [newSilatnasCampus, setNewSilatnasCampus] = useState({ name: '', shortName: '', region: 'Jawa & DIY', city: '', status: 'Terkonfirmasi', delegates: 2, confirmed: true });
  const [editingSilatnasCampusIndex, setEditingSilatnasCampusIndex] = useState(null);
  const [silatnasGroupWaLink, setSilatnasGroupWaLink] = useState(db.silatnasGroupWaLink || '');

  // Sync forms when database receives an update from Firebase
  useEffect(() => {
    if (db.contact) setContactForm(db.contact);
    if (db.oprec) {
      setOprecTitle(db.oprec.title);
      setOprecDesc(db.oprec.desc);
      setOprecIsOpen(db.oprec.isOpen);
    }
    if (db.visiMisi) {
      setVisiMisiForm({
        visi: db.visiMisi.visi || '',
        desc: db.visiMisi.desc || '',
        misi: db.visiMisi.misi || [],
        pillars: db.visiMisi.pillars || []
      });
    }
    if (db.silatnasVisiMisi) {
      setSilatnasVisiMisiForm({
        visiTitle: db.silatnasVisiMisi.visiTitle || '',
        visiDesc: db.silatnasVisiMisi.visiDesc || '',
        misiTitle: db.silatnasVisiMisi.misiTitle || '',
        misiDesc: db.silatnasVisiMisi.misiDesc || ''
      });
    }
    if (db.silatnasAlur) setSilatnasAlurForm(db.silatnasAlur);
    if (db.silatnasTimeline) setSilatnasTimelineList(db.silatnasTimeline);
    if (db.silatnasDocs) setSilatnasDocsList(db.silatnasDocs);
    if (db.silatnasCulture) setSilatnasCultureList(db.silatnasCulture);
    if (db.silatnasCampuses) setSilatnasCampusesList(db.silatnasCampuses);
    if (db.silatnasGroupWaLink !== undefined) setSilatnasGroupWaLink(db.silatnasGroupWaLink || '');
  }, [db.lastUpdated]);

  const kegiatanList = db.kegiatan || [];
  const [newKegiatan, setNewKegiatan] = useState({ date: '', title: '', desc: '' });
  const [editingKegiatanId, setEditingKegiatanId] = useState(null);

  const handleAddKegiatan = () => {
    if (!newKegiatan.date || !newKegiatan.title) {
      showCustomAlert("Lengkapi tanggal dan judul kegiatan!", "warning");
      return;
    }
    
    if (editingKegiatanId) {
      const updated = kegiatanList.map(k => k.id === editingKegiatanId ? { ...newKegiatan, id: editingKegiatanId } : k)
        .sort((a,b) => new Date(a.date) - new Date(b.date));
      save({ kegiatan: updated });
      setEditingKegiatanId(null);
    } else {
      const updated = [...kegiatanList, { id: Date.now(), ...newKegiatan }].sort((a,b) => new Date(a.date) - new Date(b.date));
      save({ kegiatan: updated });
    }
    setNewKegiatan({ date: '', title: '', desc: '' });
  };

  const handleEditKegiatan = (id) => {
    const target = kegiatanList.find(k => k.id === id);
    if (target) {
      setNewKegiatan({ date: target.date, title: target.title, desc: target.desc });
      setEditingKegiatanId(id);
    }
  };

  const handleDeleteKegiatan = (id) => {
    confirmAction("Hapus kegiatan kalender ini?", () => {
      const updated = kegiatanList.filter(k => k.id !== id);
      save({ kegiatan: updated });
      if (editingKegiatanId === id) {
        setEditingKegiatanId(null);
        setNewKegiatan({ date: '', title: '', desc: '' });
      }
    });
  };

  const [newMisiText, setNewMisiText] = useState('');

  // Save changes wrapper
  const save = async (partialData) => {
    const newData = { ...db, ...partialData };
    try {
      await onUpdateDB(newData);
      showCustomAlert("Perubahan berhasil dikonfirmasi dan disimpan ke server!", "success");
    } catch (error) {
      showCustomAlert("Gagal: " + (error.message || "Unknown error"), "error");
    }
  };

  // --- Handler Functions ---
  const handleImageUpload = async (e, callback) => {
    let file = e.target.files[0];
    if (!file) return;
    
    // Cek ukuran file (Max 15MB untuk mencegah browser nge-freeze)
    if (file.size > 15 * 1024 * 1024) {
      showCustomAlert("Ukuran file terlalu besar (Maksimal 15 MB).", "error");
      if (e.target) e.target.value = null;
      return;
    }

    // Deteksi file HEIC/HEIF (iPhone)
    const fileName = file.name.toLowerCase();
    let isHeicFile = fileName.endsWith('.heic') || fileName.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';
    
    if (!isHeicFile) {
      try {
        const { isHeic } = await import('heic-to');
        isHeicFile = await isHeic(file);
      } catch (checkErr) {
        // ignore check error
      }
    }

    if (isHeicFile) {
      showCustomAlert("Mengonversi foto HEIC/iPhone ke JPG... Mohon Tunggu.", "warning", 0);
      try {
        const { heicTo } = await import('heic-to');
        const jpegBlob = await heicTo({
          blob: file,
          type: "image/jpeg",
          quality: 0.85
        });
        file = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
      } catch (err) {
        console.error("heic-to conversion error:", err);
        showCustomAlert("Gagal mengonversi file HEIC: " + (err.message || "Format tidak didukung"), "error");
        if (e.target) e.target.value = null;
        return;
      }
    }
    
    // Untuk file non-HEIC (JPG/PNG), kompres via Canvas lalu upload
    showCustomAlert("Mengompres & Mengupload foto HD ke Imgur Cloud... Mohon Tunggu.", "warning", 0);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.onload = async () => {
        try {
          const MAX_WIDTH = 1280;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const format = (file.type === 'image/png' && file.size < 1024 * 1024) ? 'image/png' : 'image/jpeg';
          const quality = format === 'image/jpeg' ? 0.80 : undefined;
          
          const base64Data = canvas.toDataURL(format, quality).split(',')[1];
          
          if (!base64Data) throw new Error("Gagal mengompres gambar (Canvas Error)");

          let uploadSuccess = false;
          let uploadedUrl = null;

          // 1. Coba upload langsung ke Imgur
          try {
            const formData = new FormData();
            formData.append('image', base64Data);

            const res = await fetch('https://api.imgur.com/3/image', {
              method: 'POST',
              headers: {
                'Authorization': 'Client-ID 546c25a59c58ad7'
              },
              body: formData
            });
            
            const data = await res.json();
            if (data.success && data.data?.link) {
              uploadSuccess = true;
              uploadedUrl = data.data.link;
            } else {
              console.warn("Imgur response error, will use fallback:", data.data?.error || data);
            }
          } catch (imgurErr) {
            console.warn("Direct Imgur failed, trying fallback...", imgurErr);
          }

          // 2. Fallback ke /api/upload (Catbox) jika Imgur over capacity atau gagal
          if (!uploadSuccess) {
            try {
              showCustomAlert("Server Imgur sibuk, mengalihkan ke server cadangan...", "warning", 0);
              const fallbackRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Data })
              });
              const fallbackData = await fallbackRes.json();
              if (fallbackData.success && fallbackData.url) {
                uploadSuccess = true;
                uploadedUrl = fallbackData.url;
              }
            } catch (fallbackErr) {
              console.error("Fallback upload error:", fallbackErr);
            }
          }

          if (uploadSuccess && uploadedUrl) {
            showCustomAlert("Upload foto berhasil!", "success");
            callback(uploadedUrl);
          } else {
            showCustomAlert("Gagal upload gambar: Server cloud sedang sibuk. Silakan coba sesaat lagi.", "error");
          }
        } catch (err) {
          console.error("Upload Error:", err);
          showCustomAlert("Error Sistem: " + err.message, "error");
        }
      };
      
      img.onerror = () => {
        showCustomAlert("Format gambar tidak didukung. Gunakan JPG/PNG.", "error");
      };
      
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    
    // Clear input value so selecting the same file again triggers onChange
    e.target.value = null;
  };

  const quillImageHandler = React.useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        // Pass a mock event object because handleImageUpload expects e.target.files
        handleImageUpload({ target: { files: [file] } }, (url) => {
          if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', url);
          }
        });
      }
    };
  }, []);

  const quillModules = React.useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': [1, 2, 3, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }],
        ['blockquote', 'link', 'image'],
        ['clean']
      ],
      handlers: {
        image: quillImageHandler
      }
    }
  }), [quillImageHandler]);

  // Period Handlers
  const handleAddPeriod = () => {
    if (!newPeriod.trim()) return;
    if (db.periods.includes(newPeriod.trim())) {
      showCustomAlert('Periode tahun sudah ada!', 'error');
      return;
    }
    const updated = {
      periods: [newPeriod.trim(), ...db.periods],
      pimpinan: { ...db.pimpinan, [newPeriod.trim()]: [] },
      kementerian: { ...db.kementerian, [newPeriod.trim()]: [] }
    };
    onUpdateDB({ ...db, ...updated });
    setNewPeriod('');
  };

  // Pimpinan / Member Handlers
  const handleSaveMember = () => {
    const list = db.pimpinan[selectedPeriod] || [];
    let updatedList;
    if (isEditingMember) {
      updatedList = list.map(m => m.id === memberForm.id ? { ...memberForm } : m);
    } else {
      updatedList = [...list, { ...memberForm, id: Date.now() }];
    }
    const updatedPimpinan = { ...db.pimpinan, [selectedPeriod]: updatedList };
    onUpdateDB({ ...db, pimpinan: updatedPimpinan });
    setMemberForm({ id: null, name: '', role: '', photo: '', bio: '' });
    setIsEditingMember(false);
  };

  const handleEditMember = (m) => {
    setMemberForm(m);
    setIsEditingMember(true);
  };

  const handleDeleteMember = (id) => {
    confirmAction('Hapus profil pimpinan ini?', () => {
      const list = db.pimpinan[selectedPeriod] || [];
      const updatedPimpinan = { ...db.pimpinan, [selectedPeriod]: list.filter(m => m.id !== id) };
      onUpdateDB({ ...db, pimpinan: updatedPimpinan });
    });
  };

  // Department Handlers
  const handleSaveDept = () => {
    const list = db.kementerian[selectedPeriod] || [];
    let updatedList;
    if (isEditingDept) {
      updatedList = list.map(d => d.id === deptForm.id ? { ...deptForm } : d);
    } else {
      updatedList = [...list, { ...deptForm, id: Date.now() }];
    }
    const updatedKementerian = { ...db.kementerian, [selectedPeriod]: updatedList };
    onUpdateDB({ ...db, kementerian: updatedKementerian });
    setDeptForm({ id: null, name: '', desc: '', members: [] });
    setNewMemberName('');
    setNewMemberTitle('');
    setNewMemberPhoto('');
    setEditingMemberIndex(null);
    setIsEditingDept(false);
  };

  const handleAddMemberToDept = () => {
    if (!newMemberName.trim()) return;
    if (editingMemberIndex !== null) {
      const updatedMembers = [...deptForm.members];
      updatedMembers[editingMemberIndex] = {
        ...updatedMembers[editingMemberIndex],
        name: newMemberName.trim(),
        title: newMemberTitle.trim() || 'Anggota',
        photo: newMemberPhoto.trim()
      };
      setDeptForm({ ...deptForm, members: updatedMembers });
      setEditingMemberIndex(null);
    } else {
      const updatedMembers = [...deptForm.members, { 
        name: newMemberName.trim(), 
        title: newMemberTitle.trim() || 'Anggota',
        photo: newMemberPhoto.trim()
      }];
      setDeptForm({ ...deptForm, members: updatedMembers });
    }
    setNewMemberName('');
    setNewMemberTitle('');
    setNewMemberPhoto('');
  };

  const handleEditMemberInDept = (idx) => {
    const m = deptForm.members[idx];
    setNewMemberName(m.name || '');
    setNewMemberTitle(m.title || '');
    setNewMemberPhoto(m.photo || '');
    setEditingMemberIndex(idx);
  };

  const handleCancelEditMember = () => {
    setNewMemberName('');
    setNewMemberTitle('');
    setNewMemberPhoto('');
    setEditingMemberIndex(null);
  };

  const handleRemoveMemberFromDept = (idx) => {
    const updatedMembers = deptForm.members.filter((_, i) => i !== idx);
    setDeptForm({ ...deptForm, members: updatedMembers });
    if (editingMemberIndex === idx) {
      handleCancelEditMember();
    }
  };

  const handleDeleteDept = (id) => {
    confirmAction('Hapus kementerian ini beserta anggotanya?', () => {
      const list = db.kementerian[selectedPeriod] || [];
      const updatedKementerian = { ...db.kementerian, [selectedPeriod]: list.filter(d => d.id !== id) };
      onUpdateDB({ ...db, kementerian: updatedKementerian });
    });
  };

  // Article Handlers
  const handleSaveArticle = () => {
    let updatedList;
    if (isEditingArticle) {
      updatedList = db.articles.map(a => a.id === articleForm.id ? { ...a, ...articleForm } : a);
    } else {
      updatedList = [{ ...articleForm, id: Date.now(), likes: 0, comments: [] }, ...(db.articles || [])];
    }
    updatedList = sortItemsByDateDesc(updatedList);
    onUpdateDB({ ...db, articles: updatedList });
    setArticleForm({ id: null, title: '', category: 'Berita', date: '', thumbnail: '', desc: '', content: '' });
    setIsEditingArticle(false);
    setShowArticleForm(false);
  };

  const handleDeleteArticle = (id) => {
    confirmAction('Hapus artikel ini?', () => {
      onUpdateDB({ ...db, articles: db.articles.filter(a => a.id !== id) });
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (db.categories.includes(newCategory.trim())) return;
    onUpdateDB({ ...db, categories: [...db.categories, newCategory.trim()] });
    setNewCategory('');
  };

  // Album Handlers
  const handleSaveAlbum = () => {
    let updatedList;
    if (isEditingAlbum) {
      updatedList = db.albums.map(a => a.id === albumForm.id ? { ...albumForm } : a);
    } else {
      updatedList = [{ ...albumForm, id: Date.now() }, ...(db.albums || [])];
    }
    updatedList = sortItemsByDateDesc(updatedList);
    onUpdateDB({ ...db, albums: updatedList });
    setAlbumForm({ id: null, title: '', date: '', desc: '', driveUrl: '', photos: [] });
    setIsEditingAlbum(false);
    setIsAddingAlbum(false);
  };

  const handleAddPhotoToAlbum = () => {
    if (!tempPhotoUrl.trim()) return;
    setAlbumForm({ ...albumForm, photos: [...albumForm.photos, tempPhotoUrl.trim()] });
    setTempPhotoUrl('');
  };

  const handleDeleteAlbum = (id) => {
    confirmAction('Hapus album ini?', () => {
      onUpdateDB({ ...db, albums: db.albums.filter(a => a.id !== id) });
    });
  };

  // Volunteer Handlers
  const handleSaveVol = () => {
    let updatedList;
    if (isEditingVol) {
      updatedList = db.volunteerCatalog.map(v => v.id === volForm.id ? { ...volForm } : v);
    } else {
      updatedList = [...db.volunteerCatalog, { ...volForm, id: Date.now(), applicants: [] }];
    }
    onUpdateDB({ ...db, volunteerCatalog: updatedList });
    setVolForm({ id: null, title: '', isOpen: true, requirements: '', jobdesc: '', schedule: '', templateUrl: '' });
    setIsEditingVol(false);
    setIsAddingVol(false);
  };

  const handleDeleteVol = (id) => {
    confirmAction('Hapus katalog volunteer ini?', () => {
      onUpdateDB({ ...db, volunteerCatalog: db.volunteerCatalog.filter(v => v.id !== id) });
    });
  };

  // Silatnas Handlers
  const handleSaveSilatnas = () => {
    let updatedList;
    if (isEditingSilatnas) {
      updatedList = (db.silatnasCatalog || []).map(v => v.id === silatnasForm.id ? { ...silatnasForm } : v);
    } else {
      updatedList = [...(db.silatnasCatalog || []), { ...silatnasForm, id: Date.now(), applicants: [] }];
    }
    onUpdateDB({ ...db, silatnasCatalog: updatedList });
    setSilatnasForm({ id: null, title: '', isOpen: true, description: '', location: '', schedule: '', extraFields: [] });
    setIsEditingSilatnas(false);
    setIsAddingSilatnas(false);
  };

  const handleDeleteSilatnas = (id) => {
    confirmAction('Hapus agenda Silatnas ini?', () => {
      onUpdateDB({ ...db, silatnasCatalog: (db.silatnasCatalog || []).filter(v => v.id !== id) });
    });
  };

  const handleDeleteShuttleItem = (id) => {
    confirmAction('Hapus data konfirmasi penjemputan LO ini?', () => {
      onUpdateDB({ ...db, silatnasShuttle: (db.silatnasShuttle || []).filter(item => item.id !== id) });
    });
  };

  const handleDeleteApplicant = (catalogId, applicantToDelete) => {
    confirmAction(`Hapus pendaftar "${applicantToDelete.name}" (${applicantToDelete.campus || 'Tanpa Kampus'}) dari daftar peserta?`, () => {
      const updatedCatalog = (db.silatnasCatalog || []).map(cat => {
        if (cat.id === catalogId) {
          const updatedApplicants = (cat.applicants || []).filter(app => {
            if (applicantToDelete.submittedAt && app.submittedAt) {
              return app.submittedAt !== applicantToDelete.submittedAt;
            }
            return !(app.name === applicantToDelete.name && app.nowa === applicantToDelete.nowa);
          });
          return { ...cat, applicants: updatedApplicants };
        }
        return cat;
      });
      onUpdateDB({ ...db, silatnasCatalog: updatedCatalog });
    });
  };

  // Fungsi utilitas deduplikasi pendaftar delegasi (menghapus data ganda dan mempertahankan data kiriman terbaru)
  const deduplicateApplicants = (list) => {
    if (!Array.isArray(list) || list.length === 0) return [];

    const map = new Map();

    list.forEach((app, index) => {
      const rawPhone = String(app.nowa || app.phone || '').replace(/[^0-9]/g, '');
      let normPhone = rawPhone;
      if (normPhone.startsWith('62')) normPhone = '0' + normPhone.substring(2);

      const normName = String(app.name || '').toLowerCase().replace(/\s+/g, ' ').trim();
      const normCampus = String(app.campus || '').toLowerCase().replace(/\s+/g, ' ').trim();
      const normNim = String(app.nim || '').toLowerCase().replace(/\s+/g, ' ').trim();

      let key;
      if (normPhone.length >= 9) {
        key = `phone:${normPhone}`;
      } else if (normNim && normCampus) {
        key = `nim:${normNim}@${normCampus}`;
      } else {
        key = `name:${normName}@${normCampus}`;
      }

      if (!map.has(key)) {
        map.set(key, { ...app, _index: index });
      } else {
        const existing = map.get(key);
        const timeExisting = new Date(existing.submittedAt || existing.id || 0).getTime();
        const timeCurrent = new Date(app.submittedAt || app.id || 0).getTime();

        if (timeCurrent >= timeExisting) {
          map.set(key, { ...app, _index: index });
        }
      }
    });

    // Secondary pass: sinkronkan jika ada perbedaan minor penulisan no WA tetapi nama & kampus sama persis
    const secondaryMap = new Map();
    for (const item of map.values()) {
      const normName = String(item.name || '').toLowerCase().replace(/\s+/g, ' ').trim();
      const normCampus = String(item.campus || '').toLowerCase().replace(/\s+/g, ' ').trim();
      const nameCampusKey = `${normName}@${normCampus}`;

      if (!secondaryMap.has(nameCampusKey)) {
        secondaryMap.set(nameCampusKey, item);
      } else {
        const existing = secondaryMap.get(nameCampusKey);
        const timeExisting = new Date(existing.submittedAt || existing.id || 0).getTime();
        const timeCurrent = new Date(item.submittedAt || item.id || 0).getTime();
        if (timeCurrent >= timeExisting) {
          secondaryMap.set(nameCampusKey, item);
        }
      }
    }

    return Array.from(secondaryMap.values()).map(({ _index, ...cleanItem }) => cleanItem);
  };

  const handleDeduplicateApplicants = (catalogId) => {
    const targetCat = (db.silatnasCatalog || []).find(c => c.id === catalogId);
    if (!targetCat || !targetCat.applicants || targetCat.applicants.length === 0) {
      showCustomAlert("Belum ada data pendaftar untuk dibersihkan.", "info");
      return;
    }

    const currentApplicants = targetCat.applicants || [];
    const cleanedApplicants = deduplicateApplicants(currentApplicants);
    const duplicatesCount = currentApplicants.length - cleanedApplicants.length;

    if (duplicatesCount === 0) {
      showCustomAlert(`Data pendaftar sudah bersih! Tidak ada data ganda ditemukan (semua ${currentApplicants.length} delegasi unik).`, "info");
      return;
    }

    confirmAction(
      `Ditemukan ${duplicatesCount} data pendaftar ganda dari total ${currentApplicants.length} berkas pendaftaran.\n\nApakah Anda ingin menghapus data lama dan menyimpan data terbaru dari masing-masing delegasi?`,
      () => {
        const updatedCatalog = (db.silatnasCatalog || []).map(cat => {
          if (cat.id === catalogId) {
            return { ...cat, applicants: cleanedApplicants };
          }
          return cat;
        });
        onUpdateDB({ ...db, silatnasCatalog: updatedCatalog });
        showCustomAlert(`Berhasil membersihkan ${duplicatesCount} data ganda! Data terbaru dari ${cleanedApplicants.length} delegasi telah disimpan.`, "success");
      }
    );
  };

  const handleAddExtraField = () => {
    if (!newFieldLabel.trim()) return;
    const key = newFieldLabel.trim().toLowerCase().replace(/\s+/g, '_');
    const newField = { key, label: newFieldLabel.trim(), type: 'text', required: false, placeholder: '' };
    setSilatnasForm({ ...silatnasForm, extraFields: [...(silatnasForm.extraFields || []), newField] });
    setNewFieldLabel('');
  };

  const handleRemoveExtraField = (idx) => {
    setSilatnasForm({ ...silatnasForm, extraFields: silatnasForm.extraFields.filter((_, i) => i !== idx) });
  };

  // Silatnas Visi Misi Handlers
  const handleSaveSilatnasVisiMisi = () => {
    save({ silatnasVisiMisi: silatnasVisiMisiForm });
  };

  // Silatnas Alur Handlers
  const handleUpdateAlurField = (idx, field, value) => {
    const updated = [...silatnasAlurForm];
    updated[idx] = { ...updated[idx], [field]: value };
    setSilatnasAlurForm(updated);
  };

  const handleSaveSilatnasAlur = () => {
    save({ silatnasAlur: silatnasAlurForm });
  };

  // Silatnas Timeline CRUD Handlers
  const handleAddSilatnasDay = () => {
    if (!newSilatnasDay.day || !newSilatnasDay.title || !newSilatnasDay.desc) {
      showCustomAlert("Lengkapi semua kolom Hari, Judul, dan Deskripsi Agenda!", "warning");
      return;
    }
    let updated;
    if (editingSilatnasDayIndex !== null) {
      updated = [...silatnasTimelineList];
      updated[editingSilatnasDayIndex] = newSilatnasDay;
      setEditingSilatnasDayIndex(null);
    } else {
      updated = [...silatnasTimelineList, newSilatnasDay];
    }
    setSilatnasTimelineList(updated);
    setNewSilatnasDay({ day: '', title: '', desc: '' });
    save({ silatnasTimeline: updated });
  };

  const handleEditSilatnasDay = (idx) => {
    setNewSilatnasDay(silatnasTimelineList[idx]);
    setEditingSilatnasDayIndex(idx);
  };

  const handleDeleteSilatnasDay = (idx) => {
    confirmAction("Hapus agenda timeline hari ini?", () => {
      const updated = silatnasTimelineList.filter((_, i) => i !== idx);
      setSilatnasTimelineList(updated);
      save({ silatnasTimeline: updated });
      if (editingSilatnasDayIndex === idx) {
        setEditingSilatnasDayIndex(null);
        setNewSilatnasDay({ day: '', title: '', desc: '' });
      }
    });
  };

  // Silatnas Docs CRUD Handlers
  const handleAddSilatnasDoc = () => {
    if (!newSilatnasDoc.title || !newSilatnasDoc.desc || !newSilatnasDoc.size) {
      showCustomAlert("Lengkapi semua kolom Nama Berkas, Deskripsi, dan Ukuran!", "warning");
      return;
    }
    let updated;
    if (editingSilatnasDocIndex !== null) {
      updated = [...silatnasDocsList];
      updated[editingSilatnasDocIndex] = newSilatnasDoc;
      setEditingSilatnasDocIndex(null);
    } else {
      updated = [...silatnasDocsList, newSilatnasDoc];
    }
    setSilatnasDocsList(updated);
    setNewSilatnasDoc({ title: '', desc: '', size: '', url: '' });
    save({ silatnasDocs: updated });
  };

  const handleEditSilatnasDoc = (idx) => {
    setNewSilatnasDoc(silatnasDocsList[idx]);
    setEditingSilatnasDocIndex(idx);
  };

  const handleDeleteSilatnasDoc = (idx) => {
    confirmAction("Hapus dokumen download ini?", () => {
      const updated = silatnasDocsList.filter((_, i) => i !== idx);
      setSilatnasDocsList(updated);
      save({ silatnasDocs: updated });
      if (editingSilatnasDocIndex === idx) {
        setEditingSilatnasDocIndex(null);
        setNewSilatnasDoc({ title: '', desc: '', size: '', url: '' });
      }
    });
  };

  // Silatnas Culture CRUD Handlers
  const handleAddSilatnasCulture = () => {
    if (!newSilatnasCulture.title || !newSilatnasCulture.desc) {
      showCustomAlert("Judul dan deskripsi destinasi wisata/budaya harus diisi!", "warning");
      return;
    }
    let updated;
    if (editingSilatnasCultureIndex !== null) {
      updated = [...silatnasCultureList];
      updated[editingSilatnasCultureIndex] = newSilatnasCulture;
      setEditingSilatnasCultureIndex(null);
    } else {
      updated = [...silatnasCultureList, { ...newSilatnasCulture, id: Date.now() }];
    }
    setSilatnasCultureList(updated);
    setNewSilatnasCulture({ category: '', title: '', desc: '', highlight: '', location: '', image: '' });
    save({ silatnasCulture: updated });
  };

  const handleEditSilatnasCulture = (idx) => {
    setNewSilatnasCulture(silatnasCultureList[idx]);
    setEditingSilatnasCultureIndex(idx);
  };

  const handleDeleteSilatnasCulture = (idx) => {
    confirmAction("Hapus destinasi budaya ini dari Silatnas?", () => {
      const updated = silatnasCultureList.filter((_, i) => i !== idx);
      setSilatnasCultureList(updated);
      save({ silatnasCulture: updated });
      if (editingSilatnasCultureIndex === idx) {
        setEditingSilatnasCultureIndex(null);
        setNewSilatnasCulture({ category: '', title: '', desc: '', highlight: '', location: '', image: '' });
      }
    });
  };

  const handleSaveSilatnasCampus = (e) => {
    e.preventDefault();
    if (!newSilatnasCampus.name) return;
    let updated;
    if (editingSilatnasCampusIndex !== null) {
      updated = [...silatnasCampusesList];
      updated[editingSilatnasCampusIndex] = newSilatnasCampus;
      setEditingSilatnasCampusIndex(null);
    } else {
      updated = [...silatnasCampusesList, { ...newSilatnasCampus, id: Date.now() }];
    }
    setSilatnasCampusesList(updated);
    setNewSilatnasCampus({ name: '', shortName: '', region: 'Jawa & DIY', city: '', status: 'Terkonfirmasi', delegates: 2, confirmed: true });
    save({ silatnasCampuses: updated });
  };

  const handleEditSilatnasCampus = (idx) => {
    setNewSilatnasCampus(silatnasCampusesList[idx]);
    setEditingSilatnasCampusIndex(idx);
  };

  const handleDeleteSilatnasCampus = (idx) => {
    confirmAction("Hapus data kampus ini dari daftar roll-call Silatnas?", () => {
      const updated = silatnasCampusesList.filter((_, i) => i !== idx);
      setSilatnasCampusesList(updated);
      save({ silatnasCampuses: updated });
      if (editingSilatnasCampusIndex === idx) {
        setEditingSilatnasCampusIndex(null);
        setNewSilatnasCampus({ name: '', shortName: '', region: 'Jawa & DIY', city: '', status: 'Terkonfirmasi', delegates: 2, confirmed: true });
      }
    });
  };

  const handleSaveSilatnasGroupWaLink = () => {
    save({ silatnasGroupWaLink: (silatnasGroupWaLink || '').trim() });
  };

  const [adminPresensiTab, setAdminPresensiTab] = useState('hari1');

  // --- SISTEM QR CODE VIDEOTRON PRESENSI DELEGASI ---
  const DEFAULT_QR_SESSIONS = {
    stage2: {
      key: 'stage2',
      dropdownLabel: 'Hari Pertama — Presensi Grand Opening & Seminar Nasional',
      category: 'AGENDA HARI PERTAMA',
      title: 'Presensi Grand Opening & Seminar Nasional',
      speaker: 'Opening Ceremony & Seminar Nasional Kebangsaan',
      speakerRole: 'Mandataris BEM PTMAI Se-Indonesia',
      date: 'Kamis, 29 Oktober 2026',
      time: '08:00 - 15:00 WIB',
      location: 'Kampus Universitas Muhammadiyah Surakarta (UMS)',
      customUrl: ''
    },
    stage3: {
      key: 'stage3',
      dropdownLabel: 'Hari Kedua — Presensi Persidangan Nasional (Pleno & Komisi)',
      category: 'AGENDA HARI KEDUA',
      title: 'Presensi Persidangan Nasional Silatnas',
      speaker: 'Sidang Pleno & Sidang Komisi Strategis',
      speakerRole: 'Pembahasan Tata Tertib, AD/ART & Rekomendasi Nasional',
      date: 'Jumat, 30 Oktober 2026',
      time: '08:00 - 22:00 WIB',
      location: 'Kampus Universitas Muhammadiyah Surakarta (UMS)',
      customUrl: ''
    },
    stage4: {
      key: 'stage4',
      dropdownLabel: 'Hari Ketiga — Presensi Penutupan & Deklarasi Resolusi',
      category: 'AGENDA HARI KETIGA',
      title: 'Presensi Penutupan & Deklarasi Resolusi',
      speaker: 'Closing Ceremony, Resolusi Bersama & Malam Keakraban',
      speakerRole: 'Pembacaan Naskah Deklarasi Silatnas BEM PTMAI 2026',
      date: 'Sabtu, 31 Oktober 2026',
      time: '08:00 - 21:00 WIB',
      location: 'Kampus Universitas Muhammadiyah Surakarta (UMS)',
      customUrl: ''
    },
    stage1: {
      key: 'stage1',
      dropdownLabel: 'Tahap 1 — Pendaftaran Resmi Delegasi Silatnas',
      category: 'REGISTRASI MANDATARIS',
      title: 'Pendaftaran Resmi Delegasi Silatnas 2026',
      speaker: 'Registrasi Mandataris & Berkas Administrasi',
      speakerRole: 'Pendaftaran Delegasi Kampus PTMAI Se-Indonesia',
      date: '29 - 31 Oktober 2026',
      time: 'Terbuka 24 Jam',
      location: 'Universitas Muhammadiyah Surakarta',
      customUrl: ''
    }
  };

  const [isVideotronOpen, setIsVideotronOpen] = useState(false);
  const [selectedQrStage, setSelectedQrStage] = useState('stage2');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isVideotronFullscreen, setIsVideotronFullscreen] = useState(false);
  const [videotronClock, setVideotronClock] = useState('');
  const [isEditingQrConfig, setIsEditingQrConfig] = useState(false);
  const [qrEditForm, setQrEditForm] = useState(DEFAULT_QR_SESSIONS.stage2);
  const [qrCopied, setQrCopied] = useState(false);

  const getStageQrConfig = React.useCallback((stageKey) => {
    const base = DEFAULT_QR_SESSIONS[stageKey] || DEFAULT_QR_SESSIONS.stage2;
    const saved = db?.silatnasQrConfig?.[stageKey] || {};
    return { ...base, ...saved };
  }, [db?.silatnasQrConfig]);

  const getStageQrUrl = React.useCallback((stageKey) => {
    const cfg = getStageQrConfig(stageKey);
    if (cfg.customUrl && cfg.customUrl.trim()) return cfg.customUrl.trim();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bemums.id';
    return `${origin}/#silatnas?presensi=${stageKey}`;
  }, [getStageQrConfig]);

  // Generate Static QR Code (Tanpa Durasi / Fiks)
  useEffect(() => {
    const targetUrl = getStageQrUrl(selectedQrStage);
    QRCode.toDataURL(targetUrl, {
      width: 520,
      margin: 2,
      color: {
        dark: '#001F3F',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation failed:', err));
  }, [selectedQrStage, getStageQrUrl]);

  // Live Clock di Layar Videotron
  useEffect(() => {
    if (!isVideotronOpen) return;
    const updateClock = () => {
      setVideotronClock(
        new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [isVideotronOpen]);

  // Pantau status Fullscreen browser
  useEffect(() => {
    const onFsChange = () => setIsVideotronFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleVideotronFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleOpenVideotron = (stageKey = 'stage2', openEditor = false) => {
    setSelectedQrStage(stageKey);
    setQrEditForm(getStageQrConfig(stageKey));
    setIsEditingQrConfig(openEditor);
    setIsVideotronOpen(true);
  };

  const handleOpenQrEditor = (stageKey = selectedQrStage) => {
    setQrEditForm(getStageQrConfig(stageKey));
    setIsEditingQrConfig(true);
  };

  const handleSaveQrConfig = (e) => {
    if (e) e.preventDefault();
    const currentAll = db.silatnasQrConfig || {};
    const updatedAll = {
      ...currentAll,
      [selectedQrStage]: {
        category: qrEditForm.category || '',
        title: qrEditForm.title || '',
        speaker: qrEditForm.speaker || '',
        speakerRole: qrEditForm.speakerRole || '',
        date: qrEditForm.date || '',
        time: qrEditForm.time || '',
        location: qrEditForm.location || '',
        customUrl: (qrEditForm.customUrl || '').trim()
      }
    };
    save({ silatnasQrConfig: updatedAll });
    setIsEditingQrConfig(false);
    showCustomAlert('Tampilan informasi & QR Presensi berhasil diperbarui!');
  };

  const handleResetQrConfig = () => {
    const def = DEFAULT_QR_SESSIONS[selectedQrStage] || DEFAULT_QR_SESSIONS.stage2;
    setQrEditForm(def);
  };

  const handleCopyQrUrl = () => {
    const url = getStageQrUrl(selectedQrStage);
    navigator.clipboard.writeText(url);
    setQrCopied(true);
    showCustomAlert('Link presensi QR berhasil disalin ke clipboard!');
    setTimeout(() => setQrCopied(false), 2500);
  };

  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const cfg = getStageQrConfig(selectedQrStage);
    const safeTitle = (cfg.title || selectedQrStage).replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase();
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr_presensi_${safeTitle}.png`;
    link.click();
    showCustomAlert('Gambar Kode QR berhasil didownload!');
  };

  const handleToggleStage = (stageKey) => {
    const currentStages = db.silatnasStages || {
      stage1: { id: "stage1", phaseNumber: "01", phaseLabel: "PENDAFTARAN RESMI", title: "Pendaftaran Delegasi Silatnas", subTitle: "Registrasi Mandataris & Berkas Administrasi", desc: "Pengisian formulir resmi delegasi perwakilan kampus PTMAI se-Indonesia, pemilihan official merchandise kaos, dan verifikasi bukti pembayaran SWO & SWP.", isOpen: true },
      stage2: { id: "stage2", phaseNumber: "02", phaseLabel: "HARI PERTAMA", title: "Presensi Grand Opening & Seminar", subTitle: "Opening Ceremony & Seminar Nasional", desc: "Presensi kehadiran delegasi pada pembukaan akbar Silatnas BEM PTMAI 2026 dan Seminar Nasional Kebangsaan di Kampus Universitas Muhammadiyah Surakarta (UMS).", isOpen: false },
      stage3: { id: "stage3", phaseNumber: "03", phaseLabel: "HARI KEDUA", title: "Presensi Persidangan Nasional", subTitle: "Sidang Pleno & Sidang Komisi", desc: "Presensi kehadiran mandataris kampus dalam agenda persidangan, pembahasan tata tertib, sidang komisi isu strategis, dan rekomendasi nasional.", isOpen: false },
      stage4: { id: "stage4", phaseNumber: "04", phaseLabel: "HARI KETIGA", title: "Presensi Penutupan & Resolusi", subTitle: "Closing Ceremony & Malam Keakraban", desc: "Presensi kehadiran malam puncak penutupan Silatnas PTMAI 2026, pembacaan naskah deklarasi resolusi bersama, serta evaluasi kegiatan.", isOpen: false }
    };
    const currentStage = currentStages[stageKey] || {};
    const newIsOpen = !currentStage.isOpen;
    const updatedStages = {
      ...currentStages,
      [stageKey]: {
        ...currentStage,
        isOpen: newIsOpen
      }
    };

    let updatedCatalog = db.silatnasCatalog || [];
    if (stageKey === 'stage1' && updatedCatalog.length > 0) {
      updatedCatalog = updatedCatalog.map((item, idx) => idx === 0 ? { ...item, isOpen: newIsOpen } : item);
    }

    save({ silatnasStages: updatedStages, silatnasCatalog: updatedCatalog });
  };

  const handleDeletePresensi = (dayNumber, itemToDelete) => {
    confirmAction(`Hapus data presensi "${itemToDelete.name}" (${itemToDelete.campus || 'Tanpa Kampus'})?`, () => {
      const fieldKey = `silatnasPresensiHari${dayNumber}`;
      const currentList = db[fieldKey] || [];
      const updated = currentList.filter(item => {
        if (item.id && itemToDelete.id) return item.id !== itemToDelete.id;
        if (item.submittedAt && itemToDelete.submittedAt) return item.submittedAt !== itemToDelete.submittedAt;
        return !(item.name === itemToDelete.name && item.nim === itemToDelete.nim);
      });
      save({ [fieldKey]: updated });
    });
  };

  // Export JSON (for backup/rekap)
  const downloadJSON = (data, filename) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = filename;
    link.click();
  };

  // Export Data to Excel (.xlsx) / CSV
  const downloadCSV = (data, filename) => {
    if (!data || !data.length) return;
    
    // Tentukan header yang rapi
    const headerMapping = {
      no: "No",
      campus: "Asal Kampus",
      name: "Nama Lengkap",
      jabatan: "Jabatan",
      nowa: "No. WhatsApp",
      sizeKaos: "Ukuran Kaos",
      tipeLengan: "Tipe Lengan",
      buktiSWO: "Bukti Pembayaran SWO",
      buktiSWP: "Bukti Pembayaran SWP",
      buktiSWOFileName: "File SWO",
      buktiSWPFileName: "File SWP",
      buktiPembayaran: "Bukti Pembayaran (Legacy)",
      buktiDriveLink: "Link GDrive Bukti Pembayaran",
      buktiFileName: "Nama File Bukti",
      motivasi: "Motivasi & Pesan Kesan",
      submittedAt: "Waktu Daftar / Presensi",
      point: "Titik Kedatangan / Penjemputan",
      date: "Tanggal Tiba",
      time: "Estimasi Jam Tiba (WIB)",
      count: "Jumlah Delegasi (Orang)",
      leaderName: "Nama Koordinator",
      phone: "No. WhatsApp Koordinator",
      nim: "NIM / ID Delegasi",
      email: "Email",
      faculty: "Fakultas",
      choice1: "Pilihan 1",
      choice2: "Pilihan 2",
      cvLink: "Link CV / Portofolio",
      reason: "Alasan Mendaftar",
      id: "ID Pendaftaran",
      commitment: "Komitmen Waktu",
      commitmentLink: "Link Google Drive Dokumen",
      commitmentFileName: "Nama Berkas Terlampir",
      sesi: "Sesi Acara / Kehadiran",
      status: "Status Kehadiran",
      komisi: "Komisi Sidang",
      statusSuara: "Hak Suara / Status Delegasi",
      notes: "Catatan Kursi / Usulan",
      kesanPesan: "Pesan Kesan & Evaluasi"
    };
    
    let processedData = data.map(item => ({ ...item }));

    // Jika ini adalah rekap Shuttle LO:
    if (filename.includes('shuttle')) {
      // Urutkan secara kronologis berdasarkan Tanggal & Jam Tiba agar LO siap menjemput sesuai jadwal
      processedData.sort((a, b) => {
        const dtA = `${a.date || ''} ${a.time || ''}`;
        const dtB = `${b.date || ''} ${b.time || ''}`;
        if (dtA !== dtB) return dtA.localeCompare(dtB);
        return (a.campus || '').localeCompare(b.campus || '');
      });

      processedData = processedData.map((row, idx) => ({
        no: idx + 1,
        ...row
      }));
    } else if (filename.includes('silatnas') || filename.includes('presensi') || processedData.some(d => d.campus)) {
      // DEDUP: Otomatis buang duplikat jika ada, simpan data terbaru berdasarkan submittedAt / id
      processedData = deduplicateApplicants(processedData);

      // Jika rekap Delegasi Silatnas:
      // Urutkan berdasarkan Asal Kampus (A-Z) agar delegasi dari kampus yang sama langsung sejajar rapi
      processedData.sort((a, b) => {
        const campusA = (a.campus || '').trim().toLowerCase();
        const campusB = (b.campus || '').trim().toLowerCase();
        if (campusA !== campusB) {
          return campusA.localeCompare(campusB, 'id');
        }
        const nameA = (a.name || '').trim().toLowerCase();
        const nameB = (b.name || '').trim().toLowerCase();
        return nameA.localeCompare(nameB, 'id');
      });

      processedData = processedData.map((row, idx) => ({
        no: idx + 1,
        ...row
      }));
    }

    let rawKeys = Object.keys(processedData[0]);

    if (filename.includes('shuttle')) {
      const preferredOrder = ['no', 'date', 'time', 'point', 'campus', 'count', 'leaderName', 'phone', 'submittedAt'];
      const otherKeys = rawKeys.filter(k => !preferredOrder.includes(k));
      rawKeys = [...preferredOrder.filter(k => rawKeys.includes(k)), ...otherKeys];
    } else if (filename.includes('silatnas')) {
      const preferredOrder = ['no', 'campus', 'name', 'jabatan', 'nowa', 'sizeKaos', 'tipeLengan', 'buktiSWO', 'buktiSWP', 'buktiSWOFileName', 'buktiSWPFileName', 'submittedAt'];
      const otherKeys = rawKeys.filter(k => !preferredOrder.includes(k));
      rawKeys = [...preferredOrder.filter(k => rawKeys.includes(k)), ...otherKeys];
    }

    // Fungsi pembersih sel agar Excel tidak rusak oleh teks Base64 raksasa atau karakter newline (\n)
    const sanitizeCell = (val, key, row) => {
      if (val == null) return '';
      let str = String(val);

      // Tangani data URI Base64 (seperti unggahan berkas PDF atau gambar lokal berukuran ratusan ribu karakter)
      if (str.startsWith('data:')) {
        const fileName = (key === 'buktiSWO' ? row.buktiSWOFileName : row.buktiSWPFileName) || row.buktiFileName || '';
        const isPdf = str.includes('application/pdf') || (fileName && fileName.toLowerCase().endsWith('.pdf'));
        if (isPdf) {
          return fileName ? `[File PDF: ${fileName}]` : '[File PDF Terlampir]';
        }
        return fileName ? `[Gambar: ${fileName}]` : '[Gambar Terlampir]';
      }

      // Hapus karakter baris baru (\r, \n) agar tidak memecah baris tabel Excel
      str = str.replace(/[\r\n]+/g, ' ').trim();

      // Format tanggal / waktu jika berupa integer timestamp
      if (key === 'id' && typeof val === 'number') {
        str = new Date(val).toLocaleString('id-ID');
      }
      if (key === 'submittedAt' && typeof val === 'string') {
        const date = new Date(val);
        if (!isNaN(date.getTime())) {
          str = date.toLocaleString('id-ID');
        }
      }

      // Batasi panjang maksimal per sel (Excel memiliki batas 32.767 karakter)
      if (str.length > 32000) {
        str = str.substring(0, 32000) + '...';
      }

      return str;
    };
    
    // Siapkan baris objek bersih untuk Excel (.xlsx)
    const formattedRows = processedData.map(row => {
      const rowObj = {};
      rawKeys.forEach(key => {
        const headerTitle = headerMapping[key] || key;
        rowObj[headerTitle] = sanitizeCell(row[key], key, row);
      });
      return rowObj;
    });

    // 1. Ekspor langsung sebagai file native Microsoft Excel (.xlsx)
    // Format .xlsx dijamin terbuka rapi di SEMUA versi Excel (lama/baru) & semua locale Windows
    try {
      const ws = XLSX.utils.json_to_sheet(formattedRows);

      // Kunci kolom nomor telepon agar tidak diubah menjadi notasi ilmiah (8,22E+10) & angka 0 di depan tetap utuh
      for (const cellAddr in ws) {
        if (cellAddr[0] === '!') continue;
        const cell = ws[cellAddr];
        if (cell && (typeof cell.v === 'string' || typeof cell.v === 'number')) {
          const valStr = String(cell.v).trim();
          if (/^0\d{8,}/.test(valStr) || /^\+62\d+/.test(valStr)) {
            cell.t = 's'; // Tipe data teks murni
            cell.v = valStr; // Nilai string asli
            cell.z = '@'; // Format Text Excel
          }
        }
      }
      
      // Auto-fit lebar kolom agar rapi dan tidak terpotong
      const colWidths = Object.keys(formattedRows[0] || {}).map(headerKey => {
        let maxLen = headerKey.length;
        formattedRows.forEach(r => {
          const cellLen = String(r[headerKey] || '').length;
          if (cellLen > maxLen) maxLen = cellLen;
        });
        return { wch: Math.min(Math.max(maxLen + 3, 12), 48) };
      });
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Rekap Data");

      const xlsxFilename = filename.endsWith('.csv') 
        ? filename.replace(/\.csv$/, '.xlsx') 
        : (filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);

      XLSX.writeFile(wb, xlsxFilename);
      showCustomAlert(`File Excel (${xlsxFilename}) berhasil didownload dan tertata rapi!`);
      return;
    } catch (err) {
      console.warn("Ekspor XLSX beralih ke fallback CSV:", err);
    }

    // 2. Fallback CSV: Disertai direktif 'sep=;\r\n' & formula teks agar Excel tetap rapi
    const csvRows = [];
    const headers = rawKeys.map(k => headerMapping[k] || k);
    csvRows.push(headers.join(';'));
    
    for (const row of processedData) {
      const values = rawKeys.map(key => {
        let val = sanitizeCell(row[key], key, row);
        
        // Proteksi nomor telepon di CSV: gunakan formula ="08..." agar Excel tidak mengubah ke scientific notation
        if ((key === 'nowa' || key === 'phone') && /^0\d+/.test(val)) {
          return `="` + val.replace(/"/g, '""') + `"`;
        }
        
        const stringVal = val ? String(val) : '';
        const escaped = stringVal.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(';'));
    }
    
    const csvString = '\uFEFFsep=;\r\n' + csvRows.join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- STAFF MUDA HANDLERS ---
  const handleSaveStaffMuda = () => {
    if (!staffMudaForm.name) {
      showCustomAlert("Nama Staff Muda wajib diisi!", "warning");
      return;
    }
    
    const staffList = db.staffMuda?.[selectedPeriod] || [];
    let updatedList;
    if (isEditingStaffMuda) {
      updatedList = staffList.map(s => s.id === staffMudaForm.id ? staffMudaForm : s);
    } else {
      updatedList = [...staffList, { ...staffMudaForm, id: Date.now() }];
    }
    
    onUpdateDB({
      ...db,
      staffMuda: { ...db.staffMuda, [selectedPeriod]: updatedList }
    });
    
    setStaffMudaForm({ id: null, name: '', role: '', photo: '' });
    setIsEditingStaffMuda(false);
    showCustomAlert("Data Staff Muda berhasil disimpan!", "success");
  };

  const handleDeleteStaffMuda = (id) => {
    setConfirmState({
      isOpen: true,
      message: "Yakin ingin menghapus nama ini?",
      onConfirm: () => {
        const staffList = db.staffMuda?.[selectedPeriod] || [];
        const updatedList = staffList.filter(s => s.id !== id);
        onUpdateDB({
          ...db,
          staffMuda: { ...db.staffMuda, [selectedPeriod]: updatedList }
        });
        showCustomAlert("Nama Staff Muda dihapus!", "success");
      }
    });
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden pt-24 pb-16 px-6 md:px-12">
      {/* Newspaper style header */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/20 to-transparent opacity-50 blur-3xl -z-10 pointer-events-none"></div>
<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
<div className="max-w-7xl mx-auto mb-10 pb-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight">DASHBOARD ADMIN BEM UMS</h1>
        <p className="text-sm font-body uppercase tracking-wider text-neutral-400">
          ARSITEKTUR DYNAMIC CMS & LOG ASPIRASI MAHASISWA — KABINET 2026
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
          {[
            { id: 'struktural', name: '1. Struktural', icon: Users },
            { id: 'staffmuda', name: '1.5. Staff Muda', icon: Users },
            { id: 'artikel', name: '2. Artikel & Berita', icon: FileText },
            { id: 'dokumentasi', name: '3. Dokumentasi', icon: Image },
            { id: 'hubungi', name: '4. Hubungi Kami', icon: Phone },
            { id: 'oprec', name: '5. Oprec (Gabung)', icon: UserCheck },
            { id: 'galeri', name: '6. Galeri Pergerakan', icon: Image },
            { id: 'volunteer', name: '7. Volunteer', icon: Layers },
            { id: 'silatnas', name: '8. Silatnas', icon: Users },
            { id: 'visimisi', name: '10. Visi & Misi', icon: Settings },
            { id: 'kalender', name: '11. Kalender Kegiatan', icon: Calendar },
            { id: 'statistik', name: '12. Statistik Web', icon: BarChart3 },
            { id: 'backup', name: '13. Backup Database', icon: Download },
            { id: 'presensi', name: '14. Presensi', icon: QrCode }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 p-4 font-display uppercase tracking-wider text-left border rounded-2xl backdrop-blur-md transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(185,0,20,0.2)]' 
                  : 'bg-[#0a0a0a]/60 border-white/10 text-neutral-400 hover:text-white hover:border-primary/50'
              }`}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="col-span-12 lg:col-span-9 relative z-10 bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col h-full">
          
          {/* TAB 1: STRUKTURAL */}
          {activeTab === 'struktural' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Struktural Organisasi</h2>
              
              {/* Year/Period Control */}
              <div className="p-4 bg-[#0a0a0a]/40 border border-white/10 rounded-2xl">
                <h3 className="font-display uppercase mb-2">Periode Tahun</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {db.periods.map(p => (
                    <span 
                      key={p} 
                      onClick={() => setSelectedPeriod(p)}
                      className={`px-3 py-1 font-body text-sm font-bold border rounded-lg cursor-pointer transition-colors ${
                        selectedPeriod === p ? 'bg-primary border-primary text-white shadow-[0_0_10px_rgba(185,0,20,0.3)]' : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input 
                    type="text" 
                    placeholder="Tambah Periode Baru (Contoh: 2027)" 
                    value={newPeriod}
                    onChange={e => setNewPeriod(e.target.value)}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 flex-1 py-1 px-3 text-sm"
                  />
                  <button onClick={handleAddPeriod} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-1 text-xs">Tambah</button>
                </div>
              </div>

              {/* Jajaran Pimpinan */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-xl uppercase">1. Jajaran Pimpinan ({selectedPeriod})</h3>
                  <button 
                    onClick={() => {
                      setIsEditingMember(false);
                      setMemberForm({ id: null, name: '', role: '', photo: '', bio: '' });
                    }} 
                    className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.4)] hover:shadow-[0_0_25px_rgba(185,0,20,0.6)] border border-primary/50 font-bold px-5 py-2 text-sm"
                  >
                    Tambah Pimpinan
                  </button>
                </div>

                {/* Form Pimpinan */}
                {(memberForm.id !== null || isEditingMember || memberForm.name !== '') && (
                  <div className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden space-y-3 bg-neutral-800/40 text-white">
                    <h4 className="font-display text-sm uppercase">{isEditingMember ? 'Edit Pimpinan' : 'Tambah Pimpinan Baru'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="Nama Lengkap" 
                        value={memberForm.name} 
                        onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                      />
                      <input 
                        type="text" 
                        placeholder="Jabatan (Contoh: Ketua Umum)" 
                        value={memberForm.role} 
                        onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                      />
                      <div className="md:col-span-2 bg-black/50 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
                        <label className="text-xs text-neutral-400 font-bold uppercase">Foto Profil (Opsional)</label>
                        <div className="flex gap-4 items-center">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => handleImageUpload(e, (res) => setMemberForm({ ...memberForm, photo: res }))}
                            className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary hover:file:text-white transition-all cursor-pointer text-neutral-400"
                          />
                          {memberForm.photo && <img src={memberForm.photo} alt="Preview" className="h-12 w-12 object-cover rounded-md shrink-0" />}
                        </div>
                      </div>
                      <textarea 
                        placeholder="Bio singkat" 
                        value={memberForm.bio} 
                        onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2 h-32"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSaveMember} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-3 text-xs">Simpan</button>
                      <button 
                        onClick={() => setMemberForm({ id: null, name: '', role: '', photo: '', bio: '' })} 
                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10 shadow-sm font-bold px-4 py-3 text-xs"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {/* List Pimpinan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(db.pimpinan[selectedPeriod] || []).map(m => (
                    <div key={m.id} className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white flex justify-between items-start">
                      <div>
                        <h4 className="font-display uppercase text-lg">{m.name}</h4>
                        <p className="text-xs font-bold text-primary mb-1">{m.role}</p>
                        <p className="text-xs text-neutral-400">{m.bio}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditMember(m)} className="p-1 hover:text-primary"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteMember(m.id)} className="p-1 hover:text-primary"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jajaran Kementerian */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-xl uppercase">2. Kementerian ({selectedPeriod})</h3>
                  <button 
                    onClick={() => {
                      setIsEditingDept(false);
                      setDeptForm({ id: null, name: '', desc: '', members: [] });
                    }} 
                    className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.4)] hover:shadow-[0_0_25px_rgba(185,0,20,0.6)] border border-primary/50 font-bold px-5 py-2 text-sm"
                  >
                    Tambah Kementerian
                  </button>
                </div>

                {/* Form Kementerian */}
                {(deptForm.id !== null || isEditingDept || deptForm.name !== '') && (
                  <div className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden space-y-3 bg-neutral-800/40 text-white">
                    <h4 className="font-display text-sm uppercase">{isEditingDept ? 'Edit Kementerian' : 'Tambah Kementerian Baru'}</h4>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Nama Kementerian" 
                        value={deptForm.name} 
                        onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 w-full text-sm"
                      />
                      <textarea 
                        placeholder="Deskripsi Tugas & Fungsi" 
                        value={deptForm.desc} 
                        onChange={e => setDeptForm({ ...deptForm, desc: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 w-full text-sm h-32"
                      />
                      
                      {/* Sub Form Add/Edit Members to Dept */}
                      <div className="p-4 border border-white/10 rounded-xl bg-neutral-900/60 text-white space-y-4">
                        <div className="flex justify-between items-center">
                          <h5 className="font-display text-xs uppercase text-neutral-300 font-bold tracking-wider">
                            Anggota Jajaran Kementerian ({deptForm.members.length})
                          </h5>
                          <span className="text-[11px] text-neutral-500">Foto otomatis default jika belum diunggah</span>
                        </div>

                        {/* Member List Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                          {deptForm.members.map((member, i) => (
                            <div 
                              key={i} 
                              className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                                editingMemberIndex === i 
                                  ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(220,20,20,0.2)]' 
                                  : 'bg-black/50 border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <img 
                                  src={member.photo || '/assets/default-avatar.png'} 
                                  alt={member.name} 
                                  className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0 bg-neutral-800"
                                  onError={(e) => { e.target.src = '/assets/default-avatar.png'; }}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-white truncate">{member.name}</p>
                                  <p className="text-[10px] text-primary truncate uppercase tracking-wider">{member.title}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button 
                                  type="button"
                                  onClick={() => handleEditMemberInDept(i)} 
                                  className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                                  title="Edit Anggota & Foto"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleRemoveMemberFromDept(i)} 
                                  className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/20 transition-colors"
                                  title="Hapus Anggota"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Subform: Add / Edit Member */}
                        <div className="pt-3 border-t border-white/10 space-y-3 bg-black/30 p-3.5 rounded-xl">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                              {editingMemberIndex !== null ? '✏️ Edit Anggota & Foto' : '➕ Tambah Anggota Baru'}
                            </span>
                            {editingMemberIndex !== null && (
                              <button 
                                type="button" 
                                onClick={handleCancelEditMember}
                                className="text-xs text-neutral-400 hover:text-white underline"
                              >
                                Batal Edit
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input 
                              type="text" 
                              placeholder="Nama Lengkap Jajaran" 
                              value={newMemberName} 
                              onChange={e => setNewMemberName(e.target.value)}
                              className="px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 text-xs w-full"
                            />
                            <input 
                              type="text" 
                              placeholder="Jabatan (cth: Menteri / Staff)" 
                              value={newMemberTitle} 
                              onChange={e => setNewMemberTitle(e.target.value)}
                              className="px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 text-xs w-full"
                            />
                          </div>

                          {/* Upload Foto Anggota */}
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="flex items-center gap-3 flex-1 w-full">
                              <img 
                                src={newMemberPhoto || '/assets/default-avatar.png'} 
                                alt="Preview" 
                                className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0 bg-neutral-800"
                                onError={(e) => { e.target.src = '/assets/default-avatar.png'; }}
                              />
                              <div className="flex-1 min-w-0">
                                <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1">
                                  Upload Foto Anggota (Opsional)
                                </label>
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={e => handleImageUpload(e, setNewMemberPhoto)}
                                  className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-white/10 file:text-white hover:file:bg-primary file:transition-colors cursor-pointer"
                                />
                              </div>
                              {newMemberPhoto && (
                                <button
                                  type="button"
                                  onClick={() => setNewMemberPhoto('')}
                                  className="text-[11px] text-red-400 hover:text-red-300 underline shrink-0"
                                >
                                  Hapus Foto
                                </button>
                              )}
                            </div>

                            <button 
                              type="button"
                              onClick={handleAddMemberToDept} 
                              className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-2 text-xs shrink-0 w-full sm:w-auto"
                            >
                              {editingMemberIndex !== null ? 'Simpan Perubahan' : 'Tambah ke Jajaran'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={handleSaveDept} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-3 text-xs">Simpan</button>
                      <button 
                        onClick={() => setDeptForm({ id: null, name: '', desc: '', members: [] })} 
                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10 shadow-sm font-bold px-4 py-3 text-xs"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {/* List Kementerian */}
                <div className="space-y-3">
                  {(db.kementerian[selectedPeriod] || []).map(d => (
                    <div key={d.id} className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white flex justify-between items-start">
                      <div>
                        <h4 className="font-display uppercase text-lg">{d.name}</h4>
                        <p className="text-xs text-neutral-400 mb-2">{d.desc}</p>
                        <p className="text-xs font-bold uppercase text-primary">Anggota ({d.members.length}):</p>
                        <div className="text-xs text-neutral-400 flex flex-wrap gap-2 mt-1">
                          {d.members.map((m, idx) => (
                            <span key={idx} className="bg-neutral-800/40 text-white px-2 py-0.5 border border-neutral-300">{m.name} ({m.title})</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setDeptForm(d);
                            setIsEditingDept(true);
                          }} 
                          className="p-1 hover:text-primary"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDeleteDept(d.id)} className="p-1 hover:text-primary">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1.5: STAFF MUDA */}
          {activeTab === 'staffmuda' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Staff Muda</h2>
              
              {/* Year/Period Control */}
              <div className="p-4 bg-[#0a0a0a]/40 border border-white/10 rounded-2xl">
                <h3 className="font-display uppercase mb-2">Periode Tahun</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {db.periods.map(p => (
                    <span 
                      key={p} 
                      onClick={() => setSelectedPeriod(p)}
                      className={`cursor-pointer px-4 py-1.5 rounded-full text-sm font-display ${selectedPeriod === p ? 'bg-primary text-white font-bold' : 'bg-white/10 text-neutral-400 hover:bg-white/20'}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Form Tambah/Edit Staff Muda */}
              <div className="p-6 bg-black/40 border border-white/10 rounded-[2rem]">
                <h3 className="font-display uppercase text-xl mb-4 text-primary">
                  {isEditingStaffMuda ? "Edit Data Staff Muda" : "Tambah Staff Muda Baru"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    value={staffMudaForm.name} 
                    onChange={e => setStaffMudaForm({...staffMudaForm, name: e.target.value})}
                    className="p-3 bg-[#0a0a0a]/60 border border-white/10 rounded-xl outline-none focus:border-primary text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Jabatan/Peran (Contoh: Staff Muda Kementerian A)" 
                    value={staffMudaForm.role} 
                    onChange={e => setStaffMudaForm({...staffMudaForm, role: e.target.value})}
                    className="p-3 bg-[#0a0a0a]/60 border border-white/10 rounded-xl outline-none focus:border-primary text-white"
                  />
                  <div className="md:col-span-2">
                    <label className="text-xs text-neutral-400 mb-1 block">Foto (Opsional)</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-4 items-center">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={e => handleImageUpload(e, url => setStaffMudaForm({...staffMudaForm, photo: url}))}
                          className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary hover:file:text-white transition-all cursor-pointer text-neutral-400"
                        />
                        {staffMudaForm.photo && <img src={staffMudaForm.photo} alt="Preview" className="w-12 h-12 object-cover rounded-xl shrink-0" />}
                      </div>
                      <input 
                        type="text" 
                        placeholder="Atau masukkan URL Gambar/path lokal secara manual"
                        value={staffMudaForm.photo}
                        onChange={e => setStaffMudaForm({...staffMudaForm, photo: e.target.value})}
                        className="p-2 w-full bg-[#0a0a0a]/60 border border-white/10 rounded-xl text-xs outline-none focus:border-primary/50 text-neutral-400"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button onClick={handleSaveStaffMuda} className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex-grow md:flex-grow-0 hover:bg-primary/80 transition-colors">
                    {isEditingStaffMuda ? "Simpan Perubahan" : "Simpan Data"}
                  </button>
                  {isEditingStaffMuda && (
                    <button onClick={() => { setIsEditingStaffMuda(false); setStaffMudaForm({ id: null, name: '', role: '', photo: '' }); }} className="bg-neutral-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-neutral-700 transition-colors">
                      Batal
                    </button>
                  )}
                </div>
              </div>

              {/* Daftar Staff Muda */}
              <div>
                <h3 className="font-display uppercase text-lg mb-4">Daftar Staff Muda ({selectedPeriod})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(!db.staffMuda?.[selectedPeriod] || db.staffMuda[selectedPeriod].length === 0) && (
                    <p className="text-neutral-500 italic col-span-full">Belum ada data staff muda di periode ini.</p>
                  )}
                  {db.staffMuda?.[selectedPeriod]?.map(s => (
                    <div key={s.id} className="bg-[#0a0a0a]/60 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {s.photo ? (
                          <img src={s.photo} alt={s.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                            <Users size={20} className="text-neutral-500" />
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="font-bold truncate" title={s.name}>{s.name}</h4>
                          <p className="text-xs text-neutral-400 truncate" title={s.role}>{s.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0 ml-2">
                        <button onClick={() => { setStaffMudaForm(s); setIsEditingStaffMuda(true); }} className="p-1.5 text-blue-400 hover:bg-blue-400/20 rounded">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDeleteStaffMuda(s.id)} className="p-1.5 text-primary hover:bg-primary/20 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTIKEL */}
          {activeTab === 'artikel' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Artikel & Kegiatan</h2>
              
              {/* Category label setup */}
              <div className="p-4 bg-[#0a0a0a]/40 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
                <h3 className="font-display uppercase mb-2">Kategori Label</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {db.categories.map(c => (
                    <span key={c} className="bg-black/80 text-white border-white/10 text-xs uppercase px-3 py-1 font-bold border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm">
                  <input 
                    type="text" 
                    placeholder="Kategori Baru" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-xs flex-1 py-1"
                  />
                  <button onClick={handleAddCategory} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-1 text-xs">Tambah</button>
                </div>
              </div>

              {/* Form Artikel */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-xl uppercase">Daftar Artikel</h3>
                  <button 
                    onClick={() => {
                      setIsEditingArticle(false);
                      setShowArticleForm(true);
                      setArticleForm({ id: null, title: '', category: 'Berita', date: '', thumbnail: '', desc: '', content: '' });
                    }} 
                    className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.4)] hover:shadow-[0_0_25px_rgba(185,0,20,0.6)] border border-primary/50 font-bold px-5 py-2 text-sm"
                  >
                    Tulis Artikel Baru
                  </button>
                </div>

                {(showArticleForm || isEditingArticle) && (
                  <div className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white space-y-3">
                    <h4 className="font-display text-sm uppercase">{isEditingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="Judul Artikel" 
                        value={articleForm.title}
                        onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2"
                      />
                      <select 
                        value={articleForm.category}
                        onChange={e => setArticleForm({ ...articleForm, category: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm bg-neutral-800/40 text-white"
                      >
                        {db.categories.filter(c => c !== 'Semua').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input 
                        type="date" 
                        value={articleForm.date}
                        onChange={e => setArticleForm({ ...articleForm, date: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                      />
                      <div className="flex gap-4 items-center">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => handleImageUpload(e, (res) => setArticleForm({ ...articleForm, thumbnail: res }))}
                            className="px-4 py-3 bg-[#0a0a0a]/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary hover:file:text-white transition-all cursor-pointer"
                          />
                          {articleForm.thumbnail && <img src={articleForm.thumbnail} alt="Preview" className="h-10 w-10 object-cover rounded-md shrink-0" />}
                        </div>
                        <input type="hidden"
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2"
                      />
                      <textarea 
                        placeholder="Konten deskripsi artikel..." 
                        value={articleForm.desc}
                        onChange={e => setArticleForm({ ...articleForm, desc: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2 h-32"
                      />
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Konten Artikel (Lengkap)</label>
                        <div className="bg-white text-black rounded-xl overflow-hidden [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-neutral-100 [&_.ql-container]:border-none [&_.ql-container]:text-base [&_.ql-editor]:min-h-[300px]">
                          <ReactQuill 
                            ref={quillRef}
                            theme="snow"
                            value={articleForm.content || ''} 
                            onChange={(val) => setArticleForm({ ...articleForm, content: val })} 
                            placeholder="Tulis konten artikel di sini..."
                            modules={quillModules}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSaveArticle} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-3 text-xs">Simpan Artikel</button>
                      <button 
                        onClick={() => {
                          setShowArticleForm(false);
                          setIsEditingArticle(false);
                          setArticleForm({ id: null, title: '', category: 'Berita', date: '', thumbnail: '', desc: '', content: '' });
                        }} 
                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10 shadow-sm font-bold px-4 py-3 text-xs"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {/* List Artikel */}
                <div className="space-y-3">
                  {sortItemsByDateDesc(db.articles || []).map(a => (
                    <div key={a.id} className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-black/80 text-white border-white/10 px-2 py-0.5 text-[10px] uppercase font-bold">{a.category}</span>
                          <span className="text-xs text-neutral-400">{a.date}</span>
                          <span className="text-xs text-rose-400 font-bold ml-2">❤️ {a.likes || 0}</span>
                          <span className="text-xs text-sky-400 font-bold">💬 {(a.comments || []).length}</span>
                        </div>
                        <h4 className="font-display text-lg uppercase">{a.title}</h4>
                        <p className="text-xs text-neutral-400 line-clamp-2">{a.desc}</p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <button 
                          onClick={() => {
                            setArticleForm(a);
                            setIsEditingArticle(true);
                            setShowArticleForm(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} 
                          className="p-2 hover:text-primary"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDeleteArticle(a.id)} className="p-2 hover:text-primary">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOKUMENTASI */}
          {activeTab === 'dokumentasi' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Galeri Dokumentasi</h2>
              
              <div className="flex justify-between items-center">
                <h3 className="font-display text-xl uppercase">Album Kegiatan</h3>
                <button 
                  onClick={() => {
                    setIsEditingAlbum(false);
                    setIsAddingAlbum(true);
                    setAlbumForm({ id: null, title: '', date: '', desc: '', driveUrl: '', photos: [] });
                  }} 
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.4)] hover:shadow-[0_0_25px_rgba(185,0,20,0.6)] border border-primary/50 font-bold px-5 py-2 text-sm"
                >
                  Buat Album Baru
                </button>
              </div>

              {/* Form Album */}
              {(isAddingAlbum || isEditingAlbum) && (
                <div className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white space-y-3">
                  <h4 className="font-display text-sm uppercase">{isEditingAlbum ? 'Edit Album' : 'Buat Album Baru'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Nama Kegiatan (Cth: PKKMB 2026)" 
                      value={albumForm.title}
                      onChange={e => setAlbumForm({ ...albumForm, title: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                    />
                    <input 
                      type="date" 
                      value={albumForm.date}
                      onChange={e => setAlbumForm({ ...albumForm, date: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                    />
                    <textarea 
                        placeholder="Deskripsi Album/Kegiatan" 
                        value={albumForm.desc}
                        onChange={e => setAlbumForm({ ...albumForm, desc: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2 h-32"
                      />
                      <input 
                        type="text" 
                        placeholder="URL Folder Google Drive (Opsional)" 
                        value={albumForm.driveUrl || ''}
                        onChange={e => setAlbumForm({ ...albumForm, driveUrl: e.target.value })}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2"
                      />

                    {/* Photo upload subform */}
                    <div className="p-3 border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden bg-neutral-800/40 text-white md:col-span-2 space-y-2">
                      <h5 className="font-display text-xs uppercase">Unggah Multi-Foto (URL)</h5>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {albumForm.photos.map((ph, idx) => (
                          <div key={idx} className="relative w-16 h-16 border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden bg-white/10 text-white flex items-center justify-center text-[10px] text-center font-bold">
                            Foto {idx + 1}
                            <button 
                              onClick={() => {
                                const up = albumForm.photos.filter((_, i) => i !== idx);
                                setAlbumForm({ ...albumForm, photos: up });
                              }} 
                              className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all rounded-xl border-none rounded-full w-4 h-4 flex items-center justify-center font-bold text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex gap-4 items-center flex-grow w-full">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => handleImageUpload(e, setTempPhotoUrl)}
                                className="px-4 py-3 bg-[#0a0a0a]/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary hover:file:text-white transition-all cursor-pointer"
                              />
                              {tempPhotoUrl && <img src={tempPhotoUrl} alt="Preview" className="h-10 w-10 object-cover rounded-md shrink-0" />}
                            </div>
                            <input type="hidden"
                          className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-xs flex-1"
                        />
                        <button onClick={handleAddPhotoToAlbum} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-3 py-1 text-xs">Tambahkan Foto</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={handleSaveAlbum} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-3 text-xs">Simpan Album</button>
                    <button 
                      onClick={() => {
                        setAlbumForm({ id: null, title: '', date: '', desc: '', photos: [] });
                        setIsAddingAlbum(false);
                        setIsEditingAlbum(false);
                      }} 
                      className="bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10 shadow-sm font-bold px-4 py-3 text-xs"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* List Albums */}
              <div className="space-y-4">
                {sortItemsByDateDesc(db.albums || []).map(a => (
                  <div key={a.id} className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white flex justify-between items-start">
                    <div>
                      <h4 className="font-display text-lg uppercase">{a.title}</h4>
                      <p className="text-xs text-neutral-400 font-bold uppercase mb-1">{a.date}</p>
                      <p className="text-xs text-neutral-400 mb-2">{a.desc}</p>
                      <span className="bg-white/10 text-white text-xs px-2.5 py-1 border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden font-bold uppercase">
                        {a.photos.length} FOTO UNGGAHAN
                      </span>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button 
                        onClick={() => {
                          setAlbumForm(a);
                          setIsEditingAlbum(true);
                        }} 
                        className="p-2 hover:text-primary"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteAlbum(a.id)} className="p-2 hover:text-primary">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HUBUNGI KAMI */}
          {activeTab === 'hubungi' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Konfigurasi Hubungi Kami</h2>
              
              <div className="space-y-4 max-w-xl">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">Link WhatsApp</label>
                  <input 
                    type="text" 
                    value={contactForm.whatsapp}
                    onChange={e => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">Instagram URL</label>
                  <input 
                    type="text" 
                    value={contactForm.instagram}
                    onChange={e => setContactForm({ ...contactForm, instagram: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">TikTok URL</label>
                  <input 
                    type="text" 
                    value={contactForm.tiktok}
                    onChange={e => setContactForm({ ...contactForm, tiktok: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">Email Sekretariat</label>
                  <input 
                    type="email" 
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">Alamat Sekretariat</label>
                  <textarea 
                    value={contactForm.address}
                    onChange={e => setContactForm({ ...contactForm, address: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm h-24"
                  />
                </div>

                <button 
                  onClick={() => save({ contact: contactForm })} 
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-6 py-3 text-sm mt-2"
                >
                  Simpan Kontak
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: OPREC */}
          {activeTab === 'oprec' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Orec (Pendaftaran)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white">
                <div className="md:col-span-2">
                  <h3 className="font-display uppercase text-lg">Status Pendaftaran</h3>
                  <p className="text-xs text-neutral-400">Buka atau tutup akses formulir pendaftaran jajaran BEM.</p>
                </div>
                <button 
                  onClick={() => {
                    const status = !oprecIsOpen;
                    setOprecIsOpen(status);
                    save({ oprec: { ...db.oprec, isOpen: status } });
                  }}
                  className={`px-4 py-3 font-display text-sm border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden uppercase ${
                    oprecIsOpen ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)] transition-all rounded-xl border-none' : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all rounded-xl border-none'
                  }`}
                >
                  {oprecIsOpen ? 'DIBUKA (KLIK TUTUP)' : 'DITUTUP (KLIK BUKA)'}
                </button>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">Judul Pengumuman</label>
                  <input 
                    type="text" 
                    value={oprecTitle}
                    onChange={e => setOprecTitle(e.target.value)}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">Deskripsi Ajakan</label>
                  <textarea 
                    value={oprecDesc}
                    onChange={e => setOprecDesc(e.target.value)}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm h-28"
                  />
                </div>
                <button 
                  onClick={() => save({ oprec: { ...db.oprec, title: oprecTitle, desc: oprecDesc, isOpen: oprecIsOpen } })} 
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-6 py-3 text-sm"
                >
                  Simpan Info Oprec
                </button>
              </div>

              {/* Database Pendaftar */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display text-xl uppercase">Database Pendaftar Jajaran BEM</h3>
                    <p className="text-xs text-neutral-400">Total pendaftar masuk: {db.oprec.applicants.length}</p>
                  </div>
                  <button 
                    onClick={() => downloadCSV(db.oprec.applicants, 'rekap_pendaftar_oprec.csv')}
                    className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.4)] hover:shadow-[0_0_25px_rgba(185,0,20,0.6)] border border-primary/50 font-bold flex items-center gap-2 px-5 py-2 text-sm"
                    disabled={db.oprec.applicants.length === 0}
                  >
                    <Download size={14} /> Unduh Rekapan
                  </button>
                </div>

                <div className="border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden overflow-x-auto bg-neutral-800/40 text-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/10 text-white border-b border-white/10 uppercase font-display">
                        <th className="p-3 border-r border-white/10">Nama</th>
                        <th className="p-3 border-r border-white/10">NIM / Fak</th>
                        <th className="p-3 border-r border-white/10">Pilihan 1</th>
                        <th className="p-3 border-r border-white/10">Pilihan 2</th>
                        <th className="p-3">CV/Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.oprec.applicants.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-neutral-400">Belum ada pendaftar masuk.</td>
                        </tr>
                      ) : (
                        db.oprec.applicants.map((a, idx) => (
                          <tr key={idx} className="border-b border-white/10 last:border-b-0 hover:bg-neutral-800/40 text-white">
                            <td className="p-3 border-r border-white/10 font-bold">{a.name}</td>
                            <td className="p-3 border-r border-white/10">{a.nim} / {a.faculty}</td>
                            <td className="p-3 border-r border-white/10">{a.choice1}</td>
                            <td className="p-3 border-r border-white/10">{a.choice2}</td>
                            <td className="p-3 truncate max-w-[120px]">
                              <a href={a.cvLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">{a.cvLink}</a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GALERI PERGERAKAN */}
          {activeTab === 'galeri' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Galeri Pergerakan</h2>
              
              <div className="space-y-4 max-w-xl">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">Tambah Foto (URL)</label>
                  <div className="flex gap-4 items-center w-full">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, setNewGaleriImg)}
                      className="px-4 py-3 bg-[#0a0a0a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 text-sm flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary hover:file:text-white transition-all cursor-pointer"
                    />
                    {newGaleriImg && <img src={newGaleriImg} alt="Preview" className="h-10 w-10 object-cover rounded-md shrink-0" />}
                  </div>
                  <input type="hidden"
                    className="px-4 py-3 bg-[#0a0a0a]/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                  />
                </div>
                <button 
                  onClick={() => {
                    if(!newGaleriImg) return;
                    save({ galeriPergerakan: [newGaleriImg, ...(db.galeriPergerakan || [])] });
                    setNewGaleriImg('');
                  }} 
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-6 py-3 text-sm"
                >
                  Tambah Foto
                </button>
              </div>

              {/* List of Photos */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="font-display text-xl uppercase mb-4">Foto Galeri Saat Ini</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(db.galeriPergerakan || []).map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group">
                      <img src={img} alt={`Galeri ${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => {
                            confirmAction('Hapus foto ini?', () => {
                              const newGaleri = [...db.galeriPergerakan];
                              newGaleri.splice(i, 1);
                              save({ galeriPergerakan: newGaleri });
                            });
                          }}
                          className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: VOLUNTEER */}
          {activeTab === 'volunteer' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Katalog Volunteer</h2>
              
              <div className="flex justify-between items-center">
                <h3 className="font-display text-xl uppercase">Katalog Pilihan Volunteer</h3>
                <button 
                  onClick={() => {
                    setIsEditingVol(false);
                    setIsAddingVol(true);
                    setVolForm({ id: null, title: '', isOpen: true, requirements: '', jobdesc: '', schedule: '', templateUrl: '' });
                  }} 
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.4)] hover:shadow-[0_0_25px_rgba(185,0,20,0.6)] border border-primary/50 font-bold px-5 py-2 text-sm"
                >
                  Tambah Kegiatan Volunteer
                </button>
              </div>

              {/* Form Volunteer */}
              {(isAddingVol || isEditingVol) && (
                <div className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white space-y-3">
                  <h4 className="font-display text-sm uppercase">{isEditingVol ? 'Edit Kegiatan Volunteer' : 'Tambah Kegiatan Volunteer Baru'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Nama Kegiatan" 
                      value={volForm.title}
                      onChange={e => setVolForm({ ...volForm, title: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2"
                    />
                    <input 
                      type="text" 
                      placeholder="Jadwal Pelaksanaan" 
                      value={volForm.schedule}
                      onChange={e => setVolForm({ ...volForm, schedule: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                    />
                    <select 
                      value={volForm.isOpen ? 'open' : 'closed'}
                      onChange={e => setVolForm({ ...volForm, isOpen: e.target.value === 'open' })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm bg-neutral-800/40 text-white"
                    >
                      <option value="open">DIBUKA</option>
                      <option value="closed">DITUTUP</option>
                    </select>
                    <textarea 
                      placeholder="Syarat Ketentuan" 
                      value={volForm.requirements}
                      onChange={e => setVolForm({ ...volForm, requirements: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2 h-32"
                    />
                    <textarea 
                      placeholder="Job description" 
                      value={volForm.jobdesc}
                      onChange={e => setVolForm({ ...volForm, jobdesc: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2 h-32"
                    />
                    <input 
                      type="url" 
                      placeholder="Link Template Formulir Komitmen (Google Drive)" 
                      value={volForm.templateUrl || ''}
                      onChange={e => setVolForm({ ...volForm, templateUrl: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveVol} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-3 text-xs">Simpan Kegiatan</button>
                    <button 
                      onClick={() => {
                        setVolForm({ id: null, title: '', isOpen: true, requirements: '', jobdesc: '', schedule: '', templateUrl: '' });
                        setIsAddingVol(false);
                        setIsEditingVol(false);
                      }} 
                      className="bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10 shadow-sm font-bold px-4 py-3 text-xs"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* List Volunteer */}
              <div className="space-y-4">
                {db.volunteerCatalog.map(v => (
                  <div key={v.id} className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-[10px] border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden font-bold uppercase ${
                          v.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {v.isOpen ? 'DIBUKA' : 'DITUTUP'}
                        </span>
                        <span className="text-xs text-neutral-400">{v.schedule}</span>
                      </div>
                      <h4 className="font-display text-lg uppercase">{v.title}</h4>
                      <p className="text-xs text-neutral-700 font-bold mt-1">Syarat: <span className="font-normal text-neutral-400">{v.requirements}</span></p>
                      
                      {/* Sub Rekap Pendaftar */}
                      <div className="mt-3 bg-neutral-800/40 text-white p-2.5 border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden max-w-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-display text-[10px] uppercase">Pendaftar ({v.applicants?.length || 0}):</span>
                          <button 
                            onClick={() => downloadCSV(v.applicants || [], `rekap_${v.title.toLowerCase().replace(/\s+/g, '_')}.csv`)}
                            className="text-[9px] font-bold uppercase underline hover:text-primary"
                            disabled={!v.applicants || v.applicants.length === 0}
                          >
                            Download Rekap
                          </button>
                        </div>
                        <div className="max-h-24 overflow-y-auto text-[10px]">
                          {!v.applicants || v.applicants.length === 0 ? (
                            <span className="text-neutral-400">Belum ada mahasiswa mendaftar.</span>
                          ) : (
                            v.applicants.map((app, i) => (
                              <div key={i} className="border-b border-neutral-300 py-1 last:border-0">
                                {app.name} ({app.nim} / {app.faculty}) — Komitmen: "{app.commitment}"
                                {app.commitmentLink && (
                                  <a href={app.commitmentLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline font-bold">
                                    [🔗 Link Drive]
                                  </a>
                                )}
                                {app.commitmentFile && (
                                  <a href={app.commitmentFile} download={app.commitmentFileName || "Pakta_Integritas.pdf"} target="_blank" rel="noopener noreferrer" className="ml-2 text-emerald-600 hover:underline font-bold">
                                    [📎 Download Berkas: {app.commitmentFileName || "Pakta Integritas"}]
                                  </a>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button 
                        onClick={() => {
                          setVolForm(v);
                          setIsEditingVol(true);
                        }} 
                        className="p-2 hover:text-primary"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteVol(v.id)} className="p-2 hover:text-primary">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SILATNAS */}
          {activeTab === 'silatnas' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Silatnas</h2>

              {/* CARD: PENGATURAN LINK GRUP WHATSAPP PESERTA SILATNAS */}
              <div className="p-5 md:p-6 border border-emerald-500/30 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-neutral-900/60 backdrop-blur-md text-white space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm md:text-base uppercase font-bold text-white tracking-wide">
                        Link Undangan Grup WhatsApp Peserta Silatnas 2026
                      </h3>
                      <p className="text-xs text-neutral-400 font-body">
                        Setelah pendaftar mengirim formulir, sistem akan otomatis mengarahkan delegasi untuk masuk ke grup ini.
                      </p>
                    </div>
                  </div>
                  {silatnasGroupWaLink ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold self-start sm:self-auto flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Grup Aktif
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold self-start sm:self-auto shrink-0">
                      Menunggu Link dari Sekretaris
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                    URL Link Undangan WhatsApp (Contoh: https://chat.whatsapp.com/...)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="url" 
                      placeholder="https://chat.whatsapp.com/..." 
                      value={silatnasGroupWaLink}
                      onChange={e => setSilatnasGroupWaLink(e.target.value)}
                      className="flex-1 px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition placeholder-neutral-500 font-mono"
                    />
                    <button 
                      onClick={handleSaveSilatnasGroupWaLink}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition shadow-lg shadow-emerald-950/50 shrink-0 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Simpan Link Grup WA
                    </button>
                    {silatnasGroupWaLink && (
                      <a 
                        href={silatnasGroupWaLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition shrink-0 flex items-center justify-center gap-1.5 border border-white/10"
                        title="Uji coba buka link WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" /> Test Buka
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 font-body">
                    *Jika kolom ini masih kosong, formulir pendaftaran akan menampilkan pemberitahuan bahwa tautan grup sedang dipersiapkan oleh sekretaris dan panitia akan mengundang via nomor WhatsApp peserta.
                  </p>
                </div>
              </div>

              {/* CARD: KONTROL STATUS 4 TAHAP FORMULIR & PRESENSI SILATNAS */}
              <div className="p-5 md:p-6 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/20 text-primary shrink-0">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base md:text-lg uppercase font-bold text-white tracking-wide">
                        Kontrol Status 4 Tahap Silatnas (Buka / Tutup)
                      </h3>
                      <p className="text-xs text-neutral-400 font-body">
                        Kelola akses pembukaan formulir pendaftaran dan presensi kehadiran per hari secara mandiri.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Tahap Grid */}
                {(() => {
                  const stages = db.silatnasStages || {
                    stage1: { id: "stage1", phaseLabel: "PENDAFTARAN RESMI", title: "Pendaftaran Delegasi Silatnas", isOpen: (db.silatnasCatalog && db.silatnasCatalog[0]?.isOpen) ?? true },
                    stage2: { id: "stage2", phaseLabel: "HARI PERTAMA", title: "Presensi Grand Opening & Seminar", isOpen: false },
                    stage3: { id: "stage3", phaseLabel: "HARI KEDUA", title: "Presensi Persidangan Nasional", isOpen: false },
                    stage4: { id: "stage4", phaseLabel: "HARI KETIGA", title: "Presensi Penutupan & Resolusi", isOpen: false }
                  };

                  const stageItems = [
                    { 
                      key: 'stage1', 
                      label: 'Tahap 1: Pendaftaran Delegasi', 
                      tag: 'REGISTRASI',
                      count: (db.silatnasCatalog && db.silatnasCatalog[0]?.applicants?.length) || 0,
                      countLabel: 'Pendaftar',
                      isOpen: stages.stage1?.isOpen ?? ((db.silatnasCatalog && db.silatnasCatalog[0]?.isOpen) ?? true)
                    },
                    { 
                      key: 'stage2', 
                      label: 'Tahap 2: Presensi Hari Pertama', 
                      tag: 'GRAND OPENING',
                      count: (db.silatnasPresensiHari1 || []).length,
                      countLabel: 'Hadir',
                      isOpen: stages.stage2?.isOpen ?? false
                    },
                    { 
                      key: 'stage3', 
                      label: 'Tahap 3: Presensi Hari Kedua', 
                      tag: 'PERSIDANGAN',
                      count: (db.silatnasPresensiHari2 || []).length,
                      countLabel: 'Hadir',
                      isOpen: stages.stage3?.isOpen ?? false
                    },
                    { 
                      key: 'stage4', 
                      label: 'Tahap 4: Presensi Hari Ketiga', 
                      tag: 'PENUTUPAN',
                      count: (db.silatnasPresensiHari3 || []).length,
                      countLabel: 'Hadir',
                      isOpen: stages.stage4?.isOpen ?? false
                    }
                  ];

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {stageItems.map(item => (
                        <div 
                          key={item.key} 
                          className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-white/20 transition"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                                {item.tag}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                item.isOpen 
                                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40' 
                                  : 'bg-red-950/40 text-red-400 border-red-500/40'
                              }`}>
                                {item.isOpen ? 'DIBUKA' : 'DITUTUP'}
                              </span>
                            </div>
                            <h4 className="font-display text-sm font-bold text-white uppercase leading-snug">
                              {item.label}
                            </h4>
                            <div className="text-xs text-neutral-400 font-body">
                              Data Masuk: <strong className="text-white">{item.count}</strong> {item.countLabel}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleStage(item.key)}
                            className={`w-full py-2.5 px-3 rounded-xl font-bold uppercase tracking-wider text-xs transition flex items-center justify-center gap-1.5 shadow-sm ${
                              item.isOpen
                                ? 'bg-red-900/40 hover:bg-red-800 text-red-200 border border-red-700/60'
                                : 'bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/50'
                            }`}
                          >
                            {item.isOpen ? (
                              <>
                                <Lock className="w-3.5 h-3.5" /> Tutup Tahap Ini
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3.5 h-3.5" /> Buka Tahap Ini
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* CARD: REKAPITULASI DATA PRESENSI PER HARI */}
              <div className="p-5 md:p-6 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-display text-base md:text-lg uppercase font-bold text-white tracking-wide">
                      Rekapitulasi Presensi Kehadiran Delegasi
                    </h3>
                    <p className="text-xs text-neutral-400 font-body">
                      Lihat data delegasi yang hadir per agenda hari pelaksanaan dan download rekapitulasi CSV.
                    </p>
                  </div>

                  {/* Sub-tab Presensi Selector */}
                  <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                    {[
                      { id: 'hari1', label: 'Hari 1 (Opening)', dayNumber: 1, list: db.silatnasPresensiHari1 || [] },
                      { id: 'hari2', label: 'Hari 2 (Sidang)', dayNumber: 2, list: db.silatnasPresensiHari2 || [] },
                      { id: 'hari3', label: 'Hari 3 (Closing)', dayNumber: 3, list: db.silatnasPresensiHari3 || [] }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setAdminPresensiTab(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition flex items-center gap-1.5 ${
                          adminPresensiTab === tab.id
                            ? 'bg-primary text-white shadow'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40">
                          {tab.list.length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-tab Content */}
                {(() => {
                  const dayMap = {
                    hari1: {
                      title: "Presensi Hari Pertama (Grand Opening & Seminar)",
                      dayNumber: 1,
                      filename: "rekap_presensi_silatnas_hari_1_grand_opening.csv",
                      data: db.silatnasPresensiHari1 || []
                    },
                    hari2: {
                      title: "Presensi Hari Kedua (Persidangan: Pleno & Komisi)",
                      dayNumber: 2,
                      filename: "rekap_presensi_silatnas_hari_2_persidangan.csv",
                      data: db.silatnasPresensiHari2 || []
                    },
                    hari3: {
                      title: "Presensi Hari Ketiga (Penutupan & Resolusi)",
                      dayNumber: 3,
                      filename: "rekap_presensi_silatnas_hari_3_penutupan.csv",
                      data: db.silatnasPresensiHari3 || []
                    }
                  };

                  const currentTabInfo = dayMap[adminPresensiTab] || dayMap.hari1;
                  const presensiList = currentTabInfo.data;

                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-display text-sm uppercase font-bold text-white">
                            {currentTabInfo.title}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold">
                            {presensiList.length} Delegasi Hadir
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadCSV(presensiList, currentTabInfo.filename)}
                          disabled={presensiList.length === 0}
                          className="bg-primary hover:bg-primary/80 text-white border border-primary/50 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-40"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Rekap Presensi (Excel)
                        </button>
                      </div>

                      {/* List Attendees */}
                      {presensiList.length === 0 ? (
                        <div className="text-center py-8 text-neutral-400 text-xs font-body bg-black/40 rounded-xl border border-white/5">
                          Belum ada delegasi yang mengisi formulir presensi pada agenda hari ini.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                            {[...presensiList]
                              .sort((a, b) => {
                                const timeA = new Date(a.submittedAt || a.id || 0).getTime();
                                const timeB = new Date(b.submittedAt || b.id || 0).getTime();
                                return timeB - timeA;
                              })
                              .map((att, i) => (
                                <div key={i} className="bg-neutral-900/90 border border-white/5 p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-3 hover:border-white/20 transition">
                                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                                    <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary font-bold text-[10px] uppercase border border-primary/30 shrink-0">
                                      {att.campus || 'Tanpa Kampus'}
                                    </span>
                                    <span className="text-white font-bold text-xs md:text-sm truncate">
                                      {att.name}
                                    </span>
                                    {att.nim && (
                                      <span className="text-neutral-400 text-xs shrink-0 font-mono">
                                        ({att.nim})
                                      </span>
                                    )}
                                    {att.komisi && (
                                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase border border-indigo-500/30 shrink-0">
                                        {att.komisi.split(':')[0]}
                                      </span>
                                    )}
                                    {att.sesi && (
                                      <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-bold text-[10px] uppercase border border-sky-500/30 shrink-0">
                                        {att.sesi}
                                      </span>
                                    )}
                                    {att.nowa && (
                                      <span className="text-neutral-400 font-mono text-[11px] hidden sm:inline shrink-0">
                                        | {att.nowa}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {att.nowa && (
                                      <a
                                        href={`https://wa.me/${att.nowa.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 text-neutral-400 hover:text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition"
                                        title="Chat WhatsApp"
                                      >
                                        <Phone className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                    <button
                                      onClick={() => handleDeletePresensi(currentTabInfo.dayNumber, att)}
                                      className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"
                                      title="Hapus data presensi ini"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>

                          <div className="text-center py-2 px-3 bg-white/5 border border-white/5 rounded-xl text-neutral-400 text-xs font-body mt-2">
                            Menampilkan seluruh <strong>{presensiList.length} delegasi yang hadir</strong> (diurutkan dari waktu presensi terbaru di paling atas).
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              
              <div className="flex justify-between items-center">
                <h3 className="font-display text-xl uppercase">Agenda Silatnas</h3>
                <button 
                  onClick={() => {
                    setIsEditingSilatnas(false);
                    setIsAddingSilatnas(true);
                    setSilatnasForm({ id: null, title: '', isOpen: true, description: '', location: '', schedule: '', extraFields: [] });
                  }} 
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.4)] hover:shadow-[0_0_25px_rgba(185,0,20,0.6)] border border-primary/50 font-bold px-5 py-2 text-sm"
                >
                  Tambah Agenda Silatnas
                </button>
              </div>

              {/* Form Silatnas */}
              {(isAddingSilatnas || isEditingSilatnas) && (
                <div className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden space-y-3">
                  <h4 className="font-display text-sm uppercase">{isEditingSilatnas ? 'Edit Agenda Silatnas' : 'Tambah Agenda Silatnas Baru'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Nama Agenda Silatnas" 
                      value={silatnasForm.title}
                      onChange={e => setSilatnasForm({ ...silatnasForm, title: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2"
                    />
                    <input 
                      type="text" 
                      placeholder="Jadwal Pelaksanaan" 
                      value={silatnasForm.schedule}
                      onChange={e => setSilatnasForm({ ...silatnasForm, schedule: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                    />
                    <select 
                      value={silatnasForm.isOpen ? 'open' : 'closed'}
                      onChange={e => setSilatnasForm({ ...silatnasForm, isOpen: e.target.value === 'open' })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm"
                    >
                      <option value="open">DIBUKA</option>
                      <option value="closed">DITUTUP</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Lokasi (opsional)" 
                      value={silatnasForm.location}
                      onChange={e => setSilatnasForm({ ...silatnasForm, location: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2"
                    />
                    <textarea 
                      placeholder="Deskripsi Kegiatan" 
                      value={silatnasForm.description}
                      onChange={e => setSilatnasForm({ ...silatnasForm, description: e.target.value })}
                      className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm md:col-span-2 h-32"
                    />
                  </div>

                  {/* Dynamic Extra Fields Builder */}
                  <div className="border border-white/10 rounded-xl p-4 bg-black/30 space-y-3">
                    <h5 className="font-display text-xs uppercase text-primary">Kolom Form Tambahan (selain Nama & Kampus)</h5>
                    <p className="text-[10px] text-neutral-500 font-body">Tambahkan kolom isian form tambahan yang akan muncul di formulir pendaftaran publik.</p>
                    
                    {/* List existing extra fields */}
                    {(silatnasForm.extraFields || []).map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-neutral-800/60 px-3 py-2 rounded-lg">
                        <span className="text-sm font-body text-white flex-1">{field.label}</span>
                        <select 
                          value={field.type}
                          onChange={e => {
                            const updated = [...silatnasForm.extraFields];
                            updated[idx] = { ...updated[idx], type: e.target.value };
                            setSilatnasForm({ ...silatnasForm, extraFields: updated });
                          }}
                          className="text-[10px] bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-white"
                        >
                          <option value="text">Teks</option>
                          <option value="email">Email</option>
                          <option value="tel">Telepon</option>
                          <option value="url">URL/Link</option>
                          <option value="textarea">Teks Panjang</option>
                        </select>
                        <label className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <input 
                            type="checkbox" 
                            checked={field.required}
                            onChange={e => {
                              const updated = [...silatnasForm.extraFields];
                              updated[idx] = { ...updated[idx], required: e.target.checked };
                              setSilatnasForm({ ...silatnasForm, extraFields: updated });
                            }}
                          />
                          Wajib
                        </label>
                        <button onClick={() => handleRemoveExtraField(idx)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                      </div>
                    ))}

                    {/* Add new field */}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nama kolom baru (cth: NIM, No. HP, Fakultas)" 
                        value={newFieldLabel}
                        onChange={e => setNewFieldLabel(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddExtraField())}
                        className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 placeholder-neutral-600 text-xs"
                      />
                      <button 
                        onClick={handleAddExtraField}
                        className="bg-primary/20 hover:bg-primary/40 text-primary font-bold text-xs px-4 py-2 rounded-lg border border-primary/30 transition-colors"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={handleSaveSilatnas} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-3 text-xs">Simpan Agenda</button>
                    <button 
                      onClick={() => {
                        setSilatnasForm({ id: null, title: '', isOpen: true, description: '', location: '', schedule: '', extraFields: [] });
                        setIsAddingSilatnas(false);
                        setIsEditingSilatnas(false);
                      }} 
                      className="bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10 shadow-sm font-bold px-4 py-3 text-xs"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* List Silatnas */}
              <div className="space-y-4">
                {(db.silatnasCatalog || []).map(v => (
                  <div key={v.id} className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-[10px] border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden font-bold uppercase ${
                          v.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {v.isOpen ? 'DIBUKA' : 'DITUTUP'}
                        </span>
                        <span className="text-xs text-neutral-400">{v.schedule}</span>
                      </div>
                      <h4 className="font-display text-lg uppercase">{v.title}</h4>
                      {v.location && <p className="text-xs text-neutral-500 mt-0.5">Lokasi: {v.location}</p>}
                      {v.extraFields && v.extraFields.length > 0 && (
                        <p className="text-[10px] text-primary mt-1">+ {v.extraFields.length} kolom tambahan: {v.extraFields.map(f => f.label).join(', ')}</p>
                      )}
                      
                      {/* Rekap Pendaftar - Desain Luas & Rapi */}
                      <div className="mt-4 bg-black/60 text-white p-4 md:p-5 border border-white/10 rounded-2xl shadow-xl space-y-3.5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="font-display text-xs md:text-sm uppercase font-bold tracking-wider">
                              Daftar Pendaftar Masuk
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold">
                              {v.applicants?.length || 0} Pendaftar
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button 
                              type="button"
                              onClick={() => handleDeduplicateApplicants(v.id)}
                              className="bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-400/30 text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-40"
                              disabled={!v.applicants || v.applicants.length === 0}
                              title="Deteksi data ganda dan simpan hanya data terbaru dari setiap delegasi"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Bersihkan Data Ganda
                            </button>
                            <button 
                              type="button"
                              onClick={() => downloadCSV(v.applicants || [], `rekap_silatnas_${v.title.toLowerCase().replace(/\s+/g, '_')}.csv`)}
                              className="bg-primary hover:bg-primary/80 text-white border border-primary/50 text-[10px] md:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-40"
                              disabled={!v.applicants || v.applicants.length === 0}
                            >
                              <Download className="w-3.5 h-3.5" /> Download Seluruh Rekap (Excel)
                            </button>
                          </div>
                        </div>

                        {/* List Pendaftar (Maksimal 10) */}
                        <div className="space-y-2">
                          {!v.applicants || v.applicants.length === 0 ? (
                            <div className="text-center py-5 text-neutral-400 text-xs font-body">
                              Belum ada delegasi yang mengisi formulir pendaftaran pada agenda ini.
                            </div>
                          ) : (
                            <>
                              <div className="space-y-1.5 max-h-[720px] overflow-y-auto pr-1 custom-scrollbar">
                                {[...(v.applicants || [])]
                                  .sort((a, b) => {
                                    const timeA = new Date(a.submittedAt || a.id || 0).getTime();
                                    const timeB = new Date(b.submittedAt || b.id || 0).getTime();
                                    return timeB - timeA;
                                  })
                                  .map((app, i) => (
                                    <div key={app.id || app.submittedAt || i} className="bg-neutral-900/90 border border-white/5 p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-3 hover:border-white/20 transition">
                                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                                        <span className="w-5 h-5 rounded-md bg-white/10 text-neutral-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                                          {i + 1}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary font-bold text-[10px] uppercase border border-primary/30 shrink-0">
                                          {app.campus || 'Tanpa Kampus'}
                                        </span>
                                        <span className="text-white font-bold text-xs md:text-sm truncate">
                                          {app.name}
                                        </span>
                                        <span className="text-neutral-400 text-xs shrink-0">
                                          ({app.jabatan || 'Delegasi'})
                                        </span>
                                        {app.sizeKaos && (
                                          <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-bold text-[10px] uppercase border border-sky-500/30 shrink-0">
                                            Kaos: {app.sizeKaos} ({app.tipeLengan || 'Lengan Panjang'})
                                          </span>
                                        )}
                                        {app.nowa && (
                                          <span className="text-neutral-400 font-mono text-[11px] hidden sm:inline shrink-0">
                                            | {app.nowa}
                                          </span>
                                        )}
                                        {app.submittedAt && (
                                          <span className="text-neutral-500 font-mono text-[10px] hidden md:inline shrink-0">
                                            | {new Date(app.submittedAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1 shrink-0">
                                        {app.buktiSWO && (
                                          <a 
                                            href={app.buktiSWO} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-neutral-400 hover:text-[#38BDF8] rounded-lg hover:bg-sky-500/10 transition flex items-center gap-1 border border-transparent hover:border-sky-500/30"
                                            title="Lihat Bukti Pembayaran SWO"
                                          >
                                            <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
                                            <span className="text-[10px] font-bold text-[#38BDF8] hidden md:inline">SWO</span>
                                          </a>
                                        )}
                                        {app.buktiSWP && (
                                          <a 
                                            href={app.buktiSWP} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-neutral-400 hover:text-amber-400 rounded-lg hover:bg-amber-500/10 transition flex items-center gap-1 border border-transparent hover:border-amber-500/30"
                                            title="Lihat Bukti Pembayaran SWP"
                                          >
                                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                                            <span className="text-[10px] font-bold text-amber-400 hidden md:inline">SWP</span>
                                          </a>
                                        )}
                                        {(!app.buktiSWO && !app.buktiSWP && (app.buktiPembayaran || app.buktiDriveLink)) && (
                                          <a 
                                            href={app.buktiPembayaran || app.buktiDriveLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-neutral-400 hover:text-[#38BDF8] rounded-lg hover:bg-sky-500/10 transition flex items-center gap-1 border border-transparent hover:border-sky-500/30"
                                            title="Lihat Bukti Pembayaran"
                                          >
                                            <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
                                            <span className="text-[10px] font-bold text-[#38BDF8] hidden md:inline">Bukti</span>
                                          </a>
                                        )}
                                        {app.nowa && (
                                          <a 
                                            href={`https://wa.me/${app.nowa.replace(/[^0-9]/g, '')}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-neutral-400 hover:text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition"
                                            title="Chat WhatsApp"
                                          >
                                            <Phone className="w-3.5 h-3.5" />
                                          </a>
                                        )}
                                        <button
                                          onClick={() => handleDeleteApplicant(v.id, app)}
                                          className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition"
                                          title="Hapus pendaftar ini saja"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>

                              <div className="text-center py-2 px-3 bg-white/5 border border-white/5 rounded-xl text-neutral-400 text-xs font-body mt-2 flex flex-col sm:flex-row items-center justify-between gap-1.5">
                                <span>
                                  Menampilkan seluruh <strong>{v.applicants.length} pendaftar</strong> (diurutkan dari data pendaftar terbaru di paling atas).
                                </span>
                                <span className="text-[11px] text-neutral-500">
                                  Klik tombol <strong>Download Seluruh Rekap (Excel)</strong> di atas untuk menyimpan file lengkap.
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button 
                        onClick={() => {
                          setSilatnasForm(v);
                          setIsEditingSilatnas(true);
                        }} 
                        className="p-2 hover:text-primary"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDeleteSilatnas(v.id)} className="p-2 hover:text-primary">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- REKAP PERMINTAAN SHUTTLE & PENJEMPUTAN LO --- */}
              <div className="border border-amber-500/30 rounded-2xl p-6 bg-gradient-to-b from-neutral-800/60 to-black/60 backdrop-blur-md text-white space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-display text-xl uppercase text-amber-400 flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-amber-400" />
                      Jadwal Penjemputan Shuttle LO ({db.silatnasShuttle?.length || 0})
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Data konfirmasi kedatangan kontingen delegasi dari luar kota/luar Jawa untuk tim Liaison Officer (LO).
                    </p>
                  </div>
                  <button 
                    onClick={() => downloadCSV(db.silatnasShuttle || [], 'rekap_penjemputan_shuttle_lo.csv')}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg disabled:opacity-40"
                    disabled={!db.silatnasShuttle || db.silatnasShuttle.length === 0}
                  >
                    <Download className="w-4 h-4" /> Download Rekap LO (Excel)
                  </button>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {!db.silatnasShuttle || db.silatnasShuttle.length === 0 ? (
                    <div className="text-center py-8 text-neutral-400 text-xs">
                      Belum ada kontingen yang mengisi form konfirmasi penjemputan LO.
                    </div>
                  ) : (
                    [...db.silatnasShuttle]
                      .sort((a, b) => {
                        const dtA = `${a.date || ''} ${a.time || ''}`;
                        const dtB = `${b.date || ''} ${b.time || ''}`;
                        return dtA.localeCompare(dtB);
                      })
                      .map((s, idx) => (
                        <div key={s.id || idx} className="p-4 bg-black/50 border border-white/10 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-amber-400/40 transition">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase border border-amber-500/30">
                                {s.point}
                              </span>
                              <span className="text-sm text-white font-bold">{s.campus}</span>
                              <span className="text-xs text-neutral-400">({s.count} Delegasi)</span>
                            </div>
                            <p className="text-xs text-neutral-300">
                              Tiba: <strong className="text-amber-400">{s.date}</strong> pukul <strong className="text-amber-400">{s.time} WIB</strong> | Koordinator: <strong>{s.leaderName}</strong>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {s.phone && (
                              <a 
                                href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                              >
                                <Phone className="w-3.5 h-3.5" /> Chat WA ({s.phone})
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteShuttleItem(s.id)}
                              className="p-2 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition"
                              title="Hapus data"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* --- EDIT TEMA SILATNAS (Hides Visi Misi as it is hardcoded now) --- */}
              {/* <div className="border border-white/10 rounded-2xl p-6 bg-neutral-800/40 backdrop-blur-md text-white space-y-4">
                ... (form removed as Tema is now grandly hardcoded) ...
              </div> */}

              {/* --- EDIT ALUR PENDAFTARAN DELEGASI --- */}
              <div className="border border-white/10 rounded-2xl p-6 bg-neutral-800/40 backdrop-blur-md text-white space-y-4">
                <h3 className="font-display text-xl uppercase border-b border-white/5 pb-2 text-primary">Alur Pendaftaran Delegasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {silatnasAlurForm.map((item, idx) => (
                    <div key={idx} className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#38BDF8]">Langkah {item.step}</span>
                        <input 
                          type="text" 
                          value={item.step}
                          onChange={e => handleUpdateAlurField(idx, 'step', e.target.value)}
                          className="w-12 text-center py-1 bg-black border border-white/10 rounded-md text-[10px] text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <input 
                          type="text" 
                          placeholder="Judul Langkah" 
                          value={item.title}
                          onChange={e => handleUpdateAlurField(idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none text-xs"
                        />
                        <textarea 
                          placeholder="Deskripsi Langkah" 
                          value={item.desc}
                          onChange={e => handleUpdateAlurField(idx, 'desc', e.target.value)}
                          className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none text-xs h-16"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleSaveSilatnasAlur}
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl font-bold px-5 py-2.5 text-xs transition-all border border-primary/50"
                >
                  Simpan Alur Pendaftaran
                </button>
              </div>

              {/* --- EDIT AGENDA & RANGKAIAN ACARA (TIMELINE) --- */}
              <div className="border border-white/10 rounded-2xl p-6 bg-neutral-800/40 backdrop-blur-md text-white space-y-4">
                <h3 className="font-display text-xl uppercase border-b border-white/5 pb-2 text-primary">Agenda & Rangkaian Acara (Timeline)</h3>
                
                {/* Form Input Day */}
                <div className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-3 max-w-xl">
                  <h4 className="text-xs font-bold uppercase text-neutral-400">{editingSilatnasDayIndex !== null ? 'Edit Agenda Acara' : 'Tambah Agenda Acara Baru'}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Hari (Cth: Hari 1, Day 1)" 
                      value={newSilatnasDay.day}
                      onChange={e => setNewSilatnasDay({ ...newSilatnasDay, day: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Judul Acara" 
                      value={newSilatnasDay.title}
                      onChange={e => setNewSilatnasDay({ ...newSilatnasDay, title: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-xs"
                    />
                    <textarea 
                      placeholder="Deskripsi Acara" 
                      value={newSilatnasDay.desc}
                      onChange={e => setNewSilatnasDay({ ...newSilatnasDay, desc: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-xs sm:col-span-2 h-16"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleAddSilatnasDay}
                      className="bg-[#0EA5E9] hover:bg-[#0369A1] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                    >
                      {editingSilatnasDayIndex !== null ? 'Simpan Edit' : '+ Tambah Agenda'}
                    </button>
                    {editingSilatnasDayIndex !== null && (
                      <button 
                        onClick={() => {
                          setEditingSilatnasDayIndex(null);
                          setNewSilatnasDay({ day: '', title: '', desc: '' });
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors border border-white/10"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </div>

                {/* List Days */}
                <div className="space-y-2">
                  {silatnasTimelineList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                      <div className="flex-1">
                        <span className="text-[10px] bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/30 px-2 py-0.5 rounded-md font-bold uppercase">{item.day}</span>
                        <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5 font-body leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex gap-1 ml-4 shrink-0">
                        <button onClick={() => handleEditSilatnasDay(idx)} className="p-2 hover:text-[#38BDF8] text-neutral-400">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteSilatnasDay(idx)} className="p-2 hover:text-red-400 text-neutral-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- EDIT DOKUMEN & PANDUAN PENTING --- */}
              <div className="border border-white/10 rounded-2xl p-6 bg-neutral-800/40 backdrop-blur-md text-white space-y-4">
                <h3 className="font-display text-xl uppercase border-b border-white/5 pb-2 text-primary">Dokumen & Panduan Penting</h3>
                
                {/* Form Input Doc */}
                <div className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-3 max-w-xl">
                  <h4 className="text-xs font-bold uppercase text-neutral-400">{editingSilatnasDocIndex !== null ? 'Edit Dokumen' : 'Tambah Dokumen Baru'}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Nama Dokumen (Cth: Rundown Acara, TOR)" 
                      value={newSilatnasDoc.title}
                      onChange={e => setNewSilatnasDoc({ ...newSilatnasDoc, title: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Ukuran File (Cth: PDF (1.2 MB))" 
                      value={newSilatnasDoc.size}
                      onChange={e => setNewSilatnasDoc({ ...newSilatnasDoc, size: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-xs"
                    />
                    <input 
                      type="text" 
                      placeholder="Tautan Unduh (Google Drive/Link File)" 
                      value={newSilatnasDoc.url}
                      onChange={e => setNewSilatnasDoc({ ...newSilatnasDoc, url: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-xs sm:col-span-2"
                    />
                    <textarea 
                      placeholder="Deskripsi Dokumen" 
                      value={newSilatnasDoc.desc}
                      onChange={e => setNewSilatnasDoc({ ...newSilatnasDoc, desc: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-white text-xs sm:col-span-2 h-16"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleAddSilatnasDoc}
                      className="bg-[#0EA5E9] hover:bg-[#0369A1] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                    >
                      {editingSilatnasDocIndex !== null ? 'Simpan Edit' : '+ Tambah Dokumen'}
                    </button>
                    {editingSilatnasDocIndex !== null && (
                      <button 
                        onClick={() => {
                          setEditingSilatnasDocIndex(null);
                          setNewSilatnasDoc({ title: '', desc: '', size: '', url: '' });
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors border border-white/10"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </div>

                {/* List Docs */}
                <div className="space-y-2">
                  {silatnasDocsList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                      <div className="flex-1">
                        <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-2 py-0.5 rounded-md font-bold uppercase">{item.size}</span>
                        <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5 font-body leading-relaxed">{item.desc}</p>
                        {item.url && <p className="text-[10px] text-[#38BDF8] mt-1 break-all select-all font-body">🔗 Link: {item.url}</p>}
                      </div>
                      <div className="flex gap-1 ml-4 shrink-0">
                        <button onClick={() => handleEditSilatnasDoc(idx)} className="p-2 hover:text-[#38BDF8] text-neutral-400">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteSilatnasDoc(idx)} className="p-2 hover:text-red-400 text-neutral-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Manager: Cultural & Heritage Showcase */}
              <div className="bg-black/30 border border-white/10 p-6 rounded-2xl space-y-4">
                <h3 className="text-xl font-bold uppercase text-white flex items-center gap-2">
                  🏛️ Wisata & Budaya Solo (Solo Cultural Showcase)
                </h3>
                <p className="text-xs text-neutral-400 font-body">
                  Kelola kartu destinasi wisata, heritage, kuliner, dan landmark kampus UMS yang tampil pada seksi "Solo Cultural Showcase" di halaman Silatnas.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-neutral-400">Kategori / Label Badge</label>
                    <input
                      type="text"
                      className="bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg text-xs"
                      placeholder="Misal: Ikon Religi Megah, Warisan Batik Dunia"
                      value={newSilatnasCulture.category}
                      onChange={(e) => setNewSilatnasCulture({ ...newSilatnasCulture, category: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-neutral-400">Judul Destinasi *</label>
                    <input
                      type="text"
                      className="bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg text-xs"
                      placeholder="Misal: Masjid Raya Sheikh Zayed Surakarta"
                      value={newSilatnasCulture.title}
                      onChange={(e) => setNewSilatnasCulture({ ...newSilatnasCulture, title: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-neutral-400">Deskripsi Singkat *</label>
                    <textarea
                      rows="2"
                      className="w-full bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg text-xs"
                      placeholder="Deskripsi keunikan dan daya tarik destinasi ini..."
                      value={newSilatnasCulture.desc}
                      onChange={(e) => setNewSilatnasCulture({ ...newSilatnasCulture, desc: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-neutral-400">Highlight Tag</label>
                    <input
                      type="text"
                      className="bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg text-xs"
                      placeholder="Misal: Destinasi Field Trip, Kunjungan Budaya"
                      value={newSilatnasCulture.highlight}
                      onChange={(e) => setNewSilatnasCulture({ ...newSilatnasCulture, highlight: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-neutral-400">Lokasi / Keterangan Wilayah</label>
                    <input
                      type="text"
                      className="bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg text-xs"
                      placeholder="Misal: Solo Utara, Laweyan, Kampus UMS"
                      value={newSilatnasCulture.location}
                      onChange={(e) => setNewSilatnasCulture({ ...newSilatnasCulture, location: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-neutral-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Upload size={12} className="text-[#38BDF8]" />
                        Upload Media / Foto Destinasi
                      </span>
                      {newSilatnasCulture.image && (
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold">
                          <Check size={12} /> Media Terpilih
                        </span>
                      )}
                    </label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageUpload(e, (url) => setNewSilatnasCulture(prev => ({ ...prev, image: url })));
                          e.target.value = null;
                        }}
                        className="w-full text-xs text-neutral-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0EA5E9]/20 file:text-[#38BDF8] hover:file:bg-[#0EA5E9] hover:file:text-white cursor-pointer transition-all bg-black/60 border border-neutral-800 p-2 rounded-xl"
                      />
                      <input
                        type="text"
                        className="bg-black border border-neutral-800 text-white px-3 py-2 rounded-lg text-xs placeholder-neutral-600 focus:border-[#0EA5E9]"
                        placeholder="Atau tempel URL gambar langsung (https://... atau /assets/...)"
                        value={newSilatnasCulture.image}
                        onChange={(e) => setNewSilatnasCulture({ ...newSilatnasCulture, image: e.target.value })}
                      />
                    </div>
                    {newSilatnasCulture.image && (
                      <div className="relative inline-block mt-1 w-fit group">
                        <img
                          src={newSilatnasCulture.image}
                          alt="Preview Destinasi"
                          className="h-28 w-44 object-cover rounded-xl border border-sky-500/30 shadow-lg shadow-sky-950/40"
                        />
                        <button
                          type="button"
                          onClick={() => setNewSilatnasCulture(prev => ({ ...prev, image: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                          title="Hapus gambar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 flex gap-2 pt-2">
                    <button
                      onClick={handleAddSilatnasCulture}
                      className="bg-[#0EA5E9] hover:bg-[#0369A1] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors"
                    >
                      {editingSilatnasCultureIndex !== null ? 'Simpan Perubahan' : '+ Tambah Destinasi Budaya'}
                    </button>
                    {editingSilatnasCultureIndex !== null && (
                      <button
                        onClick={() => {
                          setEditingSilatnasCultureIndex(null);
                          setNewSilatnasCulture({ category: '', title: '', desc: '', highlight: '', location: '', image: '' });
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors border border-white/10"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </div>

                {/* List Culture Destinations */}
                <div className="space-y-2 pt-2">
                  {silatnasCultureList.map((item, idx) => (
                    <div key={item.id || idx} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                      <div className="flex-1">
                        <span className="text-[10px] bg-sky-950/40 text-[#38BDF8] border border-sky-900/30 px-2 py-0.5 rounded-md font-bold uppercase">{item.category || 'Destinasi Solo'}</span>
                        <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5 font-body leading-relaxed">{item.desc || item.description}</p>
                        <div className="flex gap-4 mt-1 text-[10px] text-neutral-500 font-mono">
                          <span>Highlight: {item.highlight || 'Field Trip'}</span>
                          <span>Lokasi: {item.location || 'Surakarta'}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4 shrink-0">
                        <button onClick={() => handleEditSilatnasCulture(idx)} className="p-2 hover:text-[#38BDF8] text-neutral-400">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteSilatnasCulture(idx)} className="p-2 hover:text-red-400 text-neutral-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 7: DAFTAR KAMPUS DELEGASI SILATNAS (LIVE ROLL-CALL) */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold uppercase text-[#38BDF8]">
                      7. Daftar Kampus Delegasi Silatnas (Live Roll-Call)
                    </h3>
                    <p className="text-xs text-neutral-400 font-body">
                      Kelola daftar perguruan tinggi terkonfirmasi yang tampil pada sebaran roll-call interaktif ({silatnasCampusesList.length} kampus terdata).
                    </p>
                  </div>
                </div>

                {/* Form Add / Edit Campus */}
                <div className="bg-white/5 p-4 rounded-xl space-y-4 border border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {editingSilatnasCampusIndex !== null ? '✏️ Edit Data Kampus' : '➕ Tambah Kampus Terkonfirmasi'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Nama Perguruan Tinggi *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Universitas Muhammadiyah Surakarta"
                        value={newSilatnasCampus.name}
                        onChange={(e) => setNewSilatnasCampus({ ...newSilatnasCampus, name: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Singkatan / Inisial</label>
                      <input
                        type="text"
                        placeholder="Contoh: UMS"
                        value={newSilatnasCampus.shortName}
                        onChange={(e) => setNewSilatnasCampus({ ...newSilatnasCampus, shortName: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Zona Wilayah *</label>
                      <select
                        value={newSilatnasCampus.region}
                        onChange={(e) => setNewSilatnasCampus({ ...newSilatnasCampus, region: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                      >
                        <option value="Jawa & DIY">Jawa & DIY</option>
                        <option value="Sumatera">Sumatera</option>
                        <option value="Kalimantan">Kalimantan</option>
                        <option value="Sulawesi">Sulawesi</option>
                        <option value="Bali & Nusa Tenggara">Bali & Nusa Tenggara</option>
                        <option value="Maluku & Papua">Maluku & Papua</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Kota / Provinsi</label>
                      <input
                        type="text"
                        placeholder="Contoh: Surakarta, Jawa Tengah"
                        value={newSilatnasCampus.city}
                        onChange={(e) => setNewSilatnasCampus({ ...newSilatnasCampus, city: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Jumlah Delegasi</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="2"
                        value={newSilatnasCampus.delegates || 2}
                        onChange={(e) => setNewSilatnasCampus({ ...newSilatnasCampus, delegates: parseInt(e.target.value) || 1 })}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveSilatnasCampus}
                      className="bg-[#0EA5E9] hover:bg-[#0369A1] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-md"
                    >
                      {editingSilatnasCampusIndex !== null ? 'Simpan Perubahan' : 'Tambahkan Kampus'}
                    </button>
                    {editingSilatnasCampusIndex !== null && (
                      <button
                        onClick={() => {
                          setEditingSilatnasCampusIndex(null);
                          setNewSilatnasCampus({ name: '', shortName: '', region: 'Jawa & DIY', city: '', status: 'Terkonfirmasi', delegates: 2, confirmed: true });
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors border border-white/10"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </div>

                {/* List Campuses */}
                <div className="space-y-2 pt-2 max-h-[420px] overflow-y-auto pr-1">
                  {silatnasCampusesList.map((item, idx) => (
                    <div key={item.id || idx} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5 hover:border-white/10 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-sky-950/40 text-[#38BDF8] border border-sky-900/30 px-2 py-0.5 rounded-md font-bold">{item.shortName || 'BEM'}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">Zona {item.region}</span>
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">{item.delegates || 2} Delegasi</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{item.name}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5 font-body">Kota/Wilayah: {item.city || item.region}</p>
                      </div>
                      <div className="flex gap-1 ml-4 shrink-0">
                        <button onClick={() => handleEditSilatnasCampus(idx)} className="p-2 hover:text-[#38BDF8] text-neutral-400">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDeleteSilatnasCampus(idx)} className="p-2 hover:text-red-400 text-neutral-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: VISI MISI */}
          {activeTab === 'visimisi' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Konten Visi & Misi</h2>
              
              <div className="space-y-4 max-w-xl">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">Visi Utama</label>
                  <textarea 
                    value={visiMisiForm.visi}
                    onChange={e => setVisiMisiForm({ ...visiMisiForm, visi: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm h-32"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold uppercase">Deskripsi Penjelas Visi</label>
                  <textarea 
                    value={visiMisiForm.desc}
                    onChange={e => setVisiMisiForm({ ...visiMisiForm, desc: e.target.value })}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm h-28"
                  />
                </div>
              </div>

              {/* Misi List */}
              <div className="pt-4 border-t border-white/10 space-y-4 max-w-xl">
                <h3 className="font-display text-xl uppercase">Daftar Poin Misi</h3>
                <div className="space-y-2">
                  {visiMisiForm.misi.map((m, idx) => (
                    <div key={idx} className="flex gap-2 items-start bg-neutral-800/40 text-white p-2.5 border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden text-sm">
                      <span className="font-display font-bold text-primary">{idx + 1}.</span>
                      <p className="flex-1">{m}</p>
                      <button 
                        onClick={() => {
                          const updated = visiMisiForm.misi.filter((_, i) => i !== idx);
                          setVisiMisiForm({ ...visiMisiForm, misi: updated });
                        }} 
                        className="hover:text-primary font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Misi Baru..." 
                    value={newMisiText}
                    onChange={e => setNewMisiText(e.target.value)}
                    className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-sm flex-1"
                  />
                  <button 
                    onClick={() => {
                      if(!newMisiText.trim()) return;
                      setVisiMisiForm({ ...visiMisiForm, misi: [...visiMisiForm.misi, newMisiText.trim()] });
                      setNewMisiText('');
                    }} 
                    className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 text-xs"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Three Pillars */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h3 className="font-display text-xl uppercase">Organisasi Tiga Pilar / Nilai Utama</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {visiMisiForm.pillars.map((p, idx) => (
                    <div key={p.id} className="p-3 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white space-y-2">
                      <span className="bg-primary text-white font-display text-xs px-2 py-0.5">Pilar {idx + 1}</span>
                      <input 
                        type="text" 
                        value={p.title}
                        onChange={e => {
                          const updated = visiMisiForm.pillars.map(x => x.id === p.id ? { ...x, title: e.target.value } : x);
                          setVisiMisiForm({ ...visiMisiForm, pillars: updated });
                        }}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-xs w-full font-bold"
                      />
                      <textarea 
                        value={p.desc}
                        onChange={e => {
                          const updated = visiMisiForm.pillars.map(x => x.id === p.id ? { ...x, desc: e.target.value } : x);
                          setVisiMisiForm({ ...visiMisiForm, pillars: updated });
                        }}
                        className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-xs w-full h-32"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => save({ visiMisi: visiMisiForm })}
                className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-6 py-3 text-sm mt-4"
              >
                Simpan Visi & Misi
              </button>

            </div>
          )}

          {/* TAB 8.5: ORMAWA HUB */}
          {activeTab === 'ormawahub' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-display uppercase">Manajemen Ormawa Hub</h2>
                {!isEditingOrmawa && !isAddingOrmawa && (
                  <button onClick={() => {
                    setOrmawaForm({ id: '', name: '', category: 'universitas', desc: '', fullDesc: '', logoUrl: '', bannerUrl: '', websiteUrl: '', proker: [], strukpimp: [] });
                    setIsAddingOrmawa(true);
                  }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-primary-container rounded">
                    <Plus size={16} /> Tambah Ormawa
                  </button>
                )}
              </div>

              {(isEditingOrmawa || isAddingOrmawa) ? (
                <div className="p-6 bg-[#0a0a0a]/40 border border-white/10 rounded-3xl backdrop-blur-md">
                  <h3 className="font-display uppercase mb-6 text-primary border-b border-white/10 pb-2">
                    {isAddingOrmawa ? 'Tambah Ormawa Baru' : 'Edit Ormawa'}
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">ID Unik (untuk URL)</label>
                        <input type="text" value={ormawaForm.id || ''} onChange={e => setOrmawaForm({...ormawaForm, id: e.target.value})} disabled={isEditingOrmawa} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white disabled:opacity-50" placeholder="contoh: dpm-universitas" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Nama Organisasi</label>
                        <input type="text" value={ormawaForm.name} onChange={e => setOrmawaForm({...ormawaForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Kategori</label>
                        <select value={ormawaForm.category} onChange={e => setOrmawaForm({...ormawaForm, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white">
                          <option value="universitas">Ormawa Universitas</option>
                          <option value="olahraga">Olahraga & Beladiri</option>
                          <option value="seni">Kesenian & Penerbitan</option>
                          <option value="penalaran">Penalaran & Khusus</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Link Website Resmi (Opsional)</label>
                        <input type="text" value={ormawaForm.websiteUrl} onChange={e => setOrmawaForm({...ormawaForm, websiteUrl: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="https://..." />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Deskripsi Singkat</label>
                        <input type="text" value={ormawaForm.desc} onChange={e => setOrmawaForm({...ormawaForm, desc: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Deskripsi Lengkap</label>
                        <textarea value={ormawaForm.fullDesc} onChange={e => setOrmawaForm({...ormawaForm, fullDesc: e.target.value})} className="w-full h-32 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white resize-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-white/10 pt-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Upload Logo UKM / Ormawa</label>
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setOrmawaForm({...ormawaForm, logoUrl: url}))} className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" />
                      <input type="text" placeholder="Atau ketik URL / path lokal (misal: /assets/logo.png)" value={ormawaForm.logoUrl} onChange={e => setOrmawaForm({...ormawaForm, logoUrl: e.target.value})} className="mt-2 w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded text-xs text-white placeholder-neutral-600 focus:border-primary/50" />
                      {ormawaForm.logoUrl && (
                        <div className="relative inline-block mt-3">
                          <img src={ormawaForm.logoUrl} alt="Logo" className="h-32 object-contain bg-white/5 p-2 rounded-lg border border-white/10" />
                          <button onClick={() => setOrmawaForm({...ormawaForm, logoUrl: ''})} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-white text-sm mb-2 font-bold mt-4">Banner UKM/Ormawa</label>
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => setOrmawaForm({...ormawaForm, bannerUrl: url}))} className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" />
                      <input type="text" placeholder="Atau ketik URL / path lokal (misal: /assets/banner.jpg)" value={ormawaForm.bannerUrl} onChange={e => setOrmawaForm({...ormawaForm, bannerUrl: e.target.value})} className="mt-2 w-full px-3 py-1.5 bg-black/50 border border-white/10 rounded text-xs text-white placeholder-neutral-600 focus:border-primary/50" />
                      {ormawaForm.bannerUrl && (
                        <div className="relative mt-3">
                          <img src={ormawaForm.bannerUrl} alt="Banner" className="w-full h-40 object-cover rounded-lg border border-white/10 shadow-lg" />
                          <button onClick={() => setOrmawaForm({...ormawaForm, bannerUrl: ''})} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 border-t border-white/10 pt-6">
                    {/* Proker Section */}
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                      <h4 className="font-bold text-white mb-4">Program Kerja</h4>
                      <div className="flex flex-col xl:flex-row gap-2 mb-4">
                        <input type="text" placeholder="Nama Proker" value={newProkerTitle} onChange={e => setNewProkerTitle(e.target.value)} className="flex-1 min-w-0 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm" />
                        <input type="text" placeholder="Deskripsi Singkat" value={newProkerDesc} onChange={e => setNewProkerDesc(e.target.value)} className="flex-1 min-w-0 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm" />
                        <button onClick={() => {
                          if(!newProkerTitle) return;
                          setOrmawaForm(prev => ({ ...prev, proker: [...prev.proker, { title: newProkerTitle, desc: newProkerDesc }] }));
                          setNewProkerTitle(''); setNewProkerDesc('');
                        }} className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded flex justify-center items-center"><Plus size={16}/></button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {(ormawaForm.proker || []).map((p, i) => (
                          <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded text-sm">
                            <div><strong className="block text-primary">{p.title}</strong><span className="text-neutral-400 text-xs">{p.desc}</span></div>
                            <button onClick={() => setOrmawaForm(prev => ({ ...prev, proker: prev.proker.filter((_, idx) => idx !== i) }))} className="text-red-500 hover:text-red-400 p-1"><Trash2 size={14}/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strukpimp Section */}
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                      <h4 className="font-bold text-white mb-4">Struktur Pimpinan</h4>
                      <div className="flex flex-col xl:flex-row gap-2 mb-4">
                        <input type="text" placeholder="Nama Lengkap" value={newPimpName} onChange={e => setNewPimpName(e.target.value)} className="flex-1 min-w-0 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm" />
                        <input type="text" placeholder="Jabatan" value={newPimpRole} onChange={e => setNewPimpRole(e.target.value)} className="flex-1 min-w-0 bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm" />
                        <button onClick={() => {
                          if(!newPimpName) return;
                          setOrmawaForm(prev => ({ ...prev, strukpimp: [...prev.strukpimp, { nama: newPimpName, jabatan: newPimpRole }] }));
                          setNewPimpName(''); setNewPimpRole('');
                        }} className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded flex justify-center items-center"><Plus size={16}/></button>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {(ormawaForm.strukpimp || []).map((p, i) => (
                          <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded text-sm">
                            <div><strong className="block text-white">{p.nama}</strong><span className="text-neutral-400 text-xs">{p.jabatan}</span></div>
                            <button onClick={() => setOrmawaForm(prev => ({ ...prev, strukpimp: prev.strukpimp.filter((_, idx) => idx !== i) }))} className="text-red-500 hover:text-red-400 p-1"><Trash2 size={14}/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => { setIsEditingOrmawa(false); setIsAddingOrmawa(false); }} className="px-6 py-2 border border-white/20 hover:bg-white/10 rounded font-bold uppercase text-xs">Batal</button>
                    <button onClick={() => {
                      if (!ormawaForm.id || !ormawaForm.name) return showCustomAlert('ID dan Nama harus diisi', 'error');
                      let newOrmawaList = [...(db.ormawa || [])];
                      if (isAddingOrmawa) {
                        if (newOrmawaList.find(o => o.id === ormawaForm.id)) return showCustomAlert('ID sudah digunakan', 'error');
                        newOrmawaList.push(ormawaForm);
                      } else {
                        const index = newOrmawaList.findIndex(o => o.id === ormawaForm.id);
                        if (index > -1) newOrmawaList[index] = ormawaForm;
                      }
                      onUpdateDB({ ...db, ormawa: newOrmawaList });
                      setIsEditingOrmawa(false); setIsAddingOrmawa(false);
                      showCustomAlert('Data Ormawa berhasil disimpan!');
                    }} className="px-6 py-2 bg-primary hover:bg-primary-container text-white rounded font-bold uppercase text-xs">Simpan Data</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(db?.ormawa || []).map((o) => (
                    <div key={o.id} className="bg-[#0a0a0a]/40 border border-white/10 rounded-2xl p-5 flex flex-col hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                          {o.logoUrl ? <img src={o.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" /> : <Users className="w-6 h-6 text-neutral-500" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-white leading-tight">{o.name}</h4>
                          <span className="text-[10px] text-primary uppercase tracking-widest">{o.category}</span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-400 mb-4 line-clamp-2 flex-grow">{o.desc}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <div className="text-[10px] text-neutral-500">
                          {o.proker?.length || 0} Proker • {o.strukpimp?.length || 0} Pimpinan
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setOrmawaForm(o); setIsEditingOrmawa(true); }} className="p-2 bg-white/5 hover:bg-white/20 rounded text-neutral-300 transition-colors"><Edit3 size={14}/></button>
                          <button onClick={() => {
                            confirmAction(`Yakin ingin menghapus ${o.name}?`, () => {
                              onUpdateDB({ ...db, ormawa: db.ormawa.filter(item => item.id !== o.id) });
                              showCustomAlert(`${o.name} berhasil dihapus`);
                            });
                          }} className="p-2 bg-red-500/10 hover:bg-red-500/30 rounded text-red-500 transition-colors"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: KALENDER KEGIATAN */}
          {activeTab === 'kalender' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2">Manajemen Kalender Kegiatan</h2>
              
              <div className="p-6 bg-[#0a0a0a]/40 border border-white/10 rounded-3xl backdrop-blur-md">
                <h3 className="font-display uppercase mb-4 text-primary">
                  {editingKegiatanId ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Tanggal (YYYY-MM-DD)</label>
                    <input 
                      type="date"
                      value={newKegiatan.date}
                      onClick={(e) => { try { e.target.showPicker() } catch(e) {} }}
                      onChange={e => setNewKegiatan({...newKegiatan, date: e.target.value})}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Judul Kegiatan</label>
                    <input 
                      type="text"
                      placeholder="Contoh: Rapat Paripurna"
                      value={newKegiatan.title}
                      onChange={e => setNewKegiatan({...newKegiatan, title: e.target.value})}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Deskripsi</label>
                  <textarea
                    rows="3"
                    placeholder="Deskripsi singkat kegiatan..."
                    value={newKegiatan.desc}
                    onChange={e => setNewKegiatan({...newKegiatan, desc: e.target.value})}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
                  ></textarea>
                </div>
                <button onClick={handleAddKegiatan} className="bg-primary hover:bg-primary/80 text-white rounded-xl font-bold px-6 py-3 text-sm shadow-[0_0_15px_rgba(185,0,20,0.3)]">
                  {editingKegiatanId ? 'Update Kegiatan' : 'Tambah Kegiatan'}
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-display uppercase text-lg border-b border-white/10 pb-2">Daftar Kegiatan</h3>
                <div className="space-y-3">
                  {kegiatanList.length === 0 && <p className="text-neutral-500 text-sm">Belum ada kegiatan.</p>}
                  {kegiatanList.map(k => (
                    <div key={k.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-primary/50 transition-colors">
                      <div>
                        <span className="bg-primary/20 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-2 inline-block">{k.date}</span>
                        <h4 className="font-display text-xl text-white">{k.title}</h4>
                        <p className="text-sm text-neutral-400 mt-1">{k.desc}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { handleEditKegiatan(k.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-neutral-400 hover:text-white transition-colors p-2 bg-black rounded-lg border border-white/5">
                          <Edit3 size={20} />
                        </button>
                        <button onClick={() => handleDeleteKegiatan(k.id)} className="text-neutral-400 hover:text-primary transition-colors p-2 bg-black rounded-lg border border-white/5">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => save({ kegiatan: kegiatanList })}
                className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-6 py-3 text-sm mt-4 w-full md:w-auto"
              >
                Simpan Perubahan Kalender
              </button>
            </div>
          )}

            {activeTab === 'statistik' && (
              <StatistikAdmin />
            )}

            {activeTab === 'backup' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-display uppercase border-b border-white/10 pb-2 flex items-center gap-3">
                  <Download size={28} className="text-primary" />
                  Backup & Restore Database
                </h2>
                <div className="bg-[#0a0a0a]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                  <div className="flex items-start gap-4 p-4 bg-primary/10 rounded-xl mb-6">
                    <AlertTriangle className="text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-white mb-1">Pusat Keamanan Data</h4>
                      <p className="text-sm text-neutral-400 leading-relaxed">
                        Fitur ini memungkinkan Anda untuk mengunduh seluruh data BEM UMS (Struktural, Artikel, Galeri, Kalender) sebagai file cadangan (Backup) ke laptop Anda. Jika terjadi hal yang tidak diinginkan, Anda bisa mengunggah file tersebut di sini untuk memulihkan (Restore) website ke kondisi semula.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
                        <Download size={32} />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">Download Backup Data</h3>
                      <p className="text-sm text-neutral-400 mb-6">Unduh semua data website saat ini ke laptop Anda dalam format .json.</p>
                      <button 
                        onClick={handleDownloadBackup}
                        className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] w-full"
                      >
                        Download (.json)
                      </button>
                    </div>

                    <div className="border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-red-500/20 text-primary rounded-full flex items-center justify-center mb-4">
                        <Edit3 size={32} />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">Restore Backup Data</h3>
                      <p className="text-sm text-neutral-400 mb-6">Pilih file .json dari laptop Anda untuk memulihkan database.</p>
                      <label className="mt-auto bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] w-full cursor-pointer">
                        Pilih File Restore
                        <input 
                          type="file" 
                          accept=".json"
                          onChange={handleRestoreBackup}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    {/* Auto Backup History UI */}
                    {autoBackups.length > 0 && (
                      <div className="mt-8 border-t border-white/10 pt-6 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="font-bold text-white text-lg">Riwayat Auto-Backup (Otomatis per 12 Jam)</h3>
                          <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">LOKAL LENGKAP</span>
                        </div>
                        <p className="text-xs text-neutral-400 mb-4">
                          Sistem otomatis membackup data ke memori laptop ini setiap kali Anda mengakses halaman admin (maksimal 2x sehari). File-file di bawah ini bisa didownload jika dibutuhkan.
                        </p>
                        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {autoBackups.map((backup, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 shrink-0">
                                  <Download size={20} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-white font-bold text-sm md:text-base">{backup.dateString}</p>
                                    {idx === 0 && (
                                      <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                                        TERKINI & OTOMATIS TERSINKRON
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider">
                                    {idx === 0 ? "Penyimpanan Lokal Browser • Selalu Mengikuti Data Terbaru" : "Penyimpanan Lokal Browser"}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDownloadAutoBackup(backup)}
                                className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs md:text-sm font-bold py-2.5 px-6 rounded-xl transition-colors border border-white/5 hover:border-white/20 shrink-0"
                              >
                                Download
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 14: PRESENSI & VIDEOTRON QR */}
            {activeTab === 'presensi' && (() => {
              const cfg = getStageQrConfig(selectedQrStage);
              const targetUrl = getStageQrUrl(selectedQrStage);
              const isStageCurrentlyOpen =
                selectedQrStage === 'stage1'
                  ? (db.silatnasStages?.stage1?.isOpen ?? db.silatnasCatalog?.[0]?.isOpen ?? true)
                  : Boolean(db.silatnasStages?.[selectedQrStage]?.isOpen);

              const dayMap = {
                stage2: {
                  id: 'hari1',
                  title: 'Presensi Hari Pertama (Grand Opening & Seminar)',
                  dayNumber: 1,
                  filename: 'rekap_presensi_silatnas_hari_1_grand_opening.csv',
                  data: db.silatnasPresensiHari1 || []
                },
                stage3: {
                  id: 'hari2',
                  title: 'Presensi Hari Kedua (Persidangan: Pleno & Komisi)',
                  dayNumber: 2,
                  filename: 'rekap_presensi_silatnas_hari_2_persidangan.csv',
                  data: db.silatnasPresensiHari2 || []
                },
                stage4: {
                  id: 'hari3',
                  title: 'Presensi Hari Ketiga (Penutupan & Resolusi)',
                  dayNumber: 3,
                  filename: 'rekap_presensi_silatnas_hari_3_penutupan.csv',
                  data: db.silatnasPresensiHari3 || []
                },
                stage1: {
                  id: 'tahap1',
                  title: 'Tahap 1: Pendaftaran Resmi Delegasi Silatnas',
                  dayNumber: 0,
                  filename: 'rekap_pendaftar_silatnas_tahap_1.csv',
                  data: db.silatnasCatalog?.[0]?.applicants || []
                }
              };

              const currentRekap = dayMap[selectedQrStage] || dayMap.stage2;

              return (
                <div className="space-y-8">
                  {/* Tab Title Header */}
                  <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display uppercase tracking-wider text-white">
                          14. Presensi Delegasi & Layar Videotron QR
                        </h2>
                      </div>
                      <p className="text-xs md:text-sm text-neutral-400 mt-1 font-body max-w-3xl">
                        Pusat kontrol kode QR presensi untuk layar videotron / proyektor ruangan sidang Silatnas BEM PTMAI 2026. Kode QR bersifat permanen/fiks (tanpa hitung mundur), dilengkapi counter real-time dan rekapitulasi data kehadiran.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenVideotron(selectedQrStage, false)}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-[#001428] font-display font-extrabold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer shrink-0"
                    >
                      <Maximize2 className="w-4 h-4" /> Buka Layar Videotron QR
                    </button>
                  </div>

                  {/* HERO BANNER CARD (MAIN LAUNCHPAD) */}
                  <div className="p-6 md:p-8 rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-[#002855]/90 via-[#001F3F]/95 to-neutral-900 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                      {/* Left: Info & Stats */}
                      <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/50">
                            {cfg.category || 'PRESENSI SILATNAS'}
                          </span>
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            KODE QR FIKS • TANPA DURASI
                          </span>
                        </div>

                        <div>
                          <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                            {cfg.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-300 font-body mt-1.5">
                            {cfg.speaker} {cfg.speakerRole ? `— ${cfg.speakerRole}` : ''}
                          </p>
                          <p className="text-xs text-amber-300/90 font-medium mt-1">
                            📅 {cfg.date} • ⏰ {cfg.time} • 📍 {cfg.location}
                          </p>
                        </div>

                        {/* Attendance Counter Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                          {[
                            { key: 'stage2', label: 'Hari 1 (Opening)', count: (db.silatnasPresensiHari1 || []).length },
                            { key: 'stage3', label: 'Hari 2 (Sidang)', count: (db.silatnasPresensiHari2 || []).length },
                            { key: 'stage4', label: 'Hari 3 (Closing)', count: (db.silatnasPresensiHari3 || []).length },
                            { key: 'stage1', label: 'Tahap 1 (Pendaftar)', count: (db.silatnasCatalog?.[0]?.applicants || []).length },
                          ].map((item) => (
                            <div
                              key={item.key}
                              onClick={() => {
                                setSelectedQrStage(item.key);
                                setQrEditForm(getStageQrConfig(item.key));
                              }}
                              className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                                selectedQrStage === item.key
                                  ? 'bg-amber-400/20 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                                  : 'bg-black/40 border-white/10 hover:border-white/20 text-neutral-300'
                              }`}
                            >
                              <div className="text-[10px] uppercase font-bold tracking-wider line-clamp-1">
                                {item.label}
                              </div>
                              <div className="font-display text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
                                {item.count}
                              </div>
                              <div className="text-[9px] text-neutral-400 uppercase">
                                Delegasi
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Quick Action Buttons & QR Preview */}
                      <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-black/40 border border-white/15 space-y-3.5 text-center">
                        <div className="relative p-2.5 bg-white rounded-2xl shadow-md border border-slate-200">
                          {qrDataUrl ? (
                            <div className="relative w-36 h-36">
                              <img
                                src={qrDataUrl}
                                alt="QR Preview"
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-8 h-8 rounded-lg bg-white p-1 shadow border border-[#003366] flex items-center justify-center">
                                  <img
                                    src="/assets/logo_qr_presensi.png"
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.currentTarget.src = '/assets/logo-bem.png'; }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-36 h-36 flex items-center justify-center text-xs text-neutral-400">
                              Memuat...
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 w-full">
                          <button
                            type="button"
                            onClick={() => handleOpenVideotron(selectedQrStage, false)}
                            className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#001428] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                          >
                            <Maximize2 className="w-4 h-4" /> Buka Mode Videotron
                          </button>

                          <div className="flex gap-2 w-full">
                            <button
                              type="button"
                              onClick={handleCopyQrUrl}
                              className="flex-1 py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 border border-white/10 transition cursor-pointer"
                            >
                              {qrCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{qrCopied ? 'Tersalin' : 'Salin Link'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleDownloadQrPng}
                              className="flex-1 py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 border border-white/10 transition cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-amber-400" />
                              <span>Unduh PNG</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 HORIZONTAL SESSION SELECTOR CARDS */}
                  <div className="space-y-3">
                    <h3 className="font-display text-base md:text-lg uppercase font-bold text-white tracking-wide flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      Pilih Agenda Kegiatan Silatnas
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {Object.values(DEFAULT_QR_SESSIONS).map((ses) => {
                        const customCfg = getStageQrConfig(ses.key);
                        const isSelected = selectedQrStage === ses.key;
                        const isOpen =
                          ses.key === 'stage1'
                            ? (db.silatnasStages?.stage1?.isOpen ?? db.silatnasCatalog?.[0]?.isOpen ?? true)
                            : Boolean(db.silatnasStages?.[ses.key]?.isOpen);
                        const count =
                          ses.key === 'stage2'
                            ? (db.silatnasPresensiHari1 || []).length
                            : ses.key === 'stage3'
                            ? (db.silatnasPresensiHari2 || []).length
                            : ses.key === 'stage4'
                            ? (db.silatnasPresensiHari3 || []).length
                            : (db.silatnasCatalog?.[0]?.applicants || []).length;

                        return (
                          <div
                            key={ses.key}
                            onClick={() => {
                              setSelectedQrStage(ses.key);
                              setQrEditForm(getStageQrConfig(ses.key));
                            }}
                            className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                              isSelected
                                ? 'bg-[#002855] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.25)]'
                                : 'bg-[#0a0a0a]/60 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                                  {customCfg.category || 'AGENDA'}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                                    isOpen
                                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                                      : 'bg-red-950/40 text-red-400 border-red-500/40'
                                  }`}
                                >
                                  {isOpen ? 'DIBUKA' : 'DITUTUP'}
                                </span>
                              </div>
                              <h4 className="font-display text-sm font-bold text-white uppercase leading-snug line-clamp-1">
                                {customCfg.title}
                              </h4>
                              <p className="text-[11px] text-neutral-300 font-body line-clamp-1">
                                {customCfg.date} • {customCfg.time}
                              </p>
                              <div className="text-xs text-neutral-400 font-body">
                                Hadir: <strong className="text-white">{count}</strong> Delegasi
                              </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-white/10">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStage(ses.key);
                                }}
                                className={`w-full py-2 px-3 rounded-xl font-bold uppercase tracking-wider text-[11px] transition flex items-center justify-center gap-1.5 shadow-sm ${
                                  isOpen
                                    ? 'bg-red-900/40 hover:bg-red-800 text-red-200 border border-red-700/60'
                                    : 'bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/50'
                                }`}
                              >
                                {isOpen ? (
                                  <>
                                    <Lock className="w-3 h-3" /> Tutup Form
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-3 h-3" /> Buka Form
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedQrStage(ses.key);
                                  handleOpenVideotron(ses.key, false);
                                }}
                                className="w-full py-2 px-3 rounded-xl font-bold uppercase tracking-wider text-[11px] transition flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-[#001428] shadow-sm"
                              >
                                <QrCode className="w-3 h-3" /> Tampilkan QR
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FORM PENYESUAIAN TEKS & INFORMASI LAYAR VIDEOTRON */}
                  <div className="p-5 md:p-6 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white space-y-5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <h3 className="font-display text-base md:text-lg uppercase font-bold text-white flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-amber-400" />
                          Sesuaikan Teks Informasi Layar Videotron ({selectedQrStage.toUpperCase()})
                        </h3>
                        <p className="text-xs text-neutral-400 font-body">
                          Teks di bawah ini akan langsung tampil di kartu sebelah kiri layar Videotron saat sesi ini dipilih.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetQrConfig}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold text-neutral-300 border border-white/10 transition"
                      >
                        Reset Sesi Ini
                      </button>
                    </div>

                    <form onSubmit={handleSaveQrConfig} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                            Label Kategori Atas
                          </label>
                          <input
                            type="text"
                            value={qrEditForm.category || ''}
                            onChange={(e) => setQrEditForm({ ...qrEditForm, category: e.target.value })}
                            placeholder="Contoh: AGENDA HARI PERTAMA"
                            className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                            Tanggal Pelaksanaan
                          </label>
                          <input
                            type="text"
                            value={qrEditForm.date || ''}
                            onChange={(e) => setQrEditForm({ ...qrEditForm, date: e.target.value })}
                            placeholder="Contoh: Kamis, 29 Oktober 2026"
                            className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                          Judul Utama Kegiatan
                        </label>
                        <input
                          type="text"
                          value={qrEditForm.title || ''}
                          onChange={(e) => setQrEditForm({ ...qrEditForm, title: e.target.value })}
                          placeholder="Contoh: Presensi Grand Opening & Seminar Nasional"
                          className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                            Sub-Agenda / Pemateri / Sesi
                          </label>
                          <input
                            type="text"
                            value={qrEditForm.speaker || ''}
                            onChange={(e) => setQrEditForm({ ...qrEditForm, speaker: e.target.value })}
                            placeholder="Contoh: Opening Ceremony & Seminar Nasional"
                            className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                            Keterangan / Peserta Sesi
                          </label>
                          <input
                            type="text"
                            value={qrEditForm.speakerRole || ''}
                            onChange={(e) => setQrEditForm({ ...qrEditForm, speakerRole: e.target.value })}
                            placeholder="Contoh: Mandataris BEM PTMAI Se-Indonesia"
                            className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                            Waktu Pelaksanaan
                          </label>
                          <input
                            type="text"
                            value={qrEditForm.time || ''}
                            onChange={(e) => setQrEditForm({ ...qrEditForm, time: e.target.value })}
                            placeholder="Contoh: 08:00 - 15:00 WIB"
                            className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                            Lokasi Kegiatan
                          </label>
                          <input
                            type="text"
                            value={qrEditForm.location || ''}
                            onChange={(e) => setQrEditForm({ ...qrEditForm, location: e.target.value })}
                            placeholder="Contoh: Kampus Universitas Muhammadiyah Surakarta (UMS)"
                            className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                          Link Tujuan QR Code (Kosongkan untuk Mengarah Otomatis ke Form Presensi Web)
                        </label>
                        <input
                          type="text"
                          value={qrEditForm.customUrl || ''}
                          onChange={(e) => setQrEditForm({ ...qrEditForm, customUrl: e.target.value })}
                          placeholder={`Otomatis: ${typeof window !== 'undefined' ? window.location.origin : ''}/#silatnas?presensi=${selectedQrStage}`}
                          className="w-full p-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                        />
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Link saat ini: <code className="text-amber-300">{targetUrl}</code>
                        </p>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#001428] font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          Simpan Teks Informasi Sesi Ini
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* REKAPITULASI TABEL DATA PRESENSI */}
                  <div className="p-5 md:p-6 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white space-y-5 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <h3 className="font-display text-base md:text-lg uppercase font-bold text-white tracking-wide">
                          Rekapitulasi Kehadiran: {currentRekap.title}
                        </h3>
                        <p className="text-xs text-neutral-400 font-body">
                          Total data masuk: <strong className="text-white">{currentRekap.data.length}</strong> delegasi tercatat.
                        </p>
                      </div>

                      {currentRekap.data.length > 0 && (
                        <button
                          type="button"
                          onClick={() => downloadCSV(currentRekap.data, currentRekap.filename)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
                        >
                          <Download className="w-4 h-4" /> Export Excel ({currentRekap.data.length})
                        </button>
                      )}
                    </div>

                    {currentRekap.data.length === 0 ? (
                      <div className="text-center py-12 text-neutral-400 text-xs font-body space-y-2">
                        <Users className="w-10 h-10 text-neutral-600 mx-auto" />
                        <p>Belum ada delegasi yang melakukan presensi pada sesi ini.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-body text-neutral-200">
                          <thead className="bg-black/60 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                            <tr>
                              <th className="py-3 px-3">No</th>
                              <th className="py-3 px-3">Waktu Presensi</th>
                              <th className="py-3 px-3">Nama Delegasi</th>
                              <th className="py-3 px-3">Asal Kampus PTMAI</th>
                              <th className="py-3 px-3">NIM / Identitas</th>
                              <th className="py-3 px-3">No WhatsApp</th>
                              <th className="py-3 px-3">Sesi / Komisi</th>
                              <th className="py-3 px-3">Status Hadir</th>
                              <th className="py-3 px-3 text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {currentRekap.data.map((item, idx) => (
                              <tr key={item.id || idx} className="hover:bg-white/5 transition-colors">
                                <td className="py-3 px-3 font-mono text-neutral-400">{idx + 1}</td>
                                <td className="py-3 px-3 font-mono text-neutral-300">
                                  {item.submittedAt ? new Date(item.submittedAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                                </td>
                                <td className="py-3 px-3 font-bold text-white">{item.name}</td>
                                <td className="py-3 px-3 text-amber-300">{item.campus || '-'}</td>
                                <td className="py-3 px-3 font-mono text-neutral-300">{item.nim || '-'}</td>
                                <td className="py-3 px-3 font-mono text-neutral-300">{item.nowa || '-'}</td>
                                <td className="py-3 px-3 text-neutral-300">{item.sesi || item.komisi || item.jabatan || '-'}</td>
                                <td className="py-3 px-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    {item.status || item.statusSuara || 'Hadir'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  {currentRekap.dayNumber > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePresensi(currentRekap.dayNumber, item)}
                                      className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-400 transition"
                                      title="Hapus presensi"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* FULL-SCREEN VIDEOTRON QR DISPLAY (MOUNTED VIA PORTAL DIRECTLY TO DOCUMENT.BODY) */}
        {isVideotronOpen && typeof document !== 'undefined' && createPortal(
          (() => {
            const cfg = getStageQrConfig(selectedQrStage);
            const attendeeList =
              selectedQrStage === 'stage2'
                ? (db.silatnasPresensiHari1 || [])
                : selectedQrStage === 'stage3'
                ? (db.silatnasPresensiHari2 || [])
                : selectedQrStage === 'stage4'
                ? (db.silatnasPresensiHari3 || [])
                : (db.silatnasCatalog?.[0]?.applicants || []);
            const recentAttendees = [...attendeeList].slice(-3).reverse();
            const isStageCurrentlyOpen =
              selectedQrStage === 'stage1'
                ? (db.silatnasStages?.stage1?.isOpen ?? db.silatnasCatalog?.[0]?.isOpen ?? true)
                : Boolean(db.silatnasStages?.[selectedQrStage]?.isOpen);

            return (
              <div className="fixed inset-0 z-[999999] w-screen h-screen bg-[#001428] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto select-none font-body">
                {/* Ambient Background Glows */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-[#0047AB]/30 blur-[140px]" />
                  <div className="absolute top-1/2 -right-32 w-[550px] h-[550px] rounded-full bg-amber-500/20 blur-[150px]" />
                  <div className="absolute -bottom-32 left-1/3 w-[650px] h-[450px] rounded-full bg-[#003366]/40 blur-[130px]" />
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                      backgroundSize: '48px 48px',
                    }}
                  />
                </div>

                {/* 1. TOP BAR (HEADER) */}
                <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (document.fullscreenElement) {
                          document.exitFullscreen().catch(() => {});
                        }
                        setIsVideotronOpen(false);
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Kembali ke Admin</span>
                    </button>

                    <div className="h-8 w-[1px] bg-white/15 hidden sm:block" />

                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/10 border border-amber-400/30 flex items-center justify-center p-1.5 shadow-inner">
                        <img
                          src="/assets/logo_qr_presensi.png"
                          alt="Logo Presensi"
                          className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                          onError={(e) => { e.currentTarget.src = '/assets/logo-bem.png'; }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-bold tracking-wide text-white uppercase font-display">
                            LAYAR PROYEKTOR PRESENSI
                          </span>
                          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            QR FIKS AKTIF
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-amber-400 font-medium tracking-wider uppercase font-body">
                          SILATNAS BEM PTMAI 2026 — UNIVERSITAS MUHAMMADIYAH SURAKARTA
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Controls: Clock + Edit + Fullscreen */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-white">
                        {videotronClock || '--:--:--'}
                      </span>
                      <span className="text-[10px] font-semibold text-white/60 uppercase">
                        WIB
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenQrEditor(selectedQrStage)}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      title="Sesuaikan Teks & Informasi Agenda"
                    >
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <span className="hidden md:inline">Sesuaikan Tampilan</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleVideotronFullscreen}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#001F3F] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all cursor-pointer"
                      title="Tampilkan Layar Penuh (Videotron / Proyektor)"
                    >
                      {isVideotronFullscreen ? (
                        <>
                          <Minimize2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Keluar Fullscreen</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Mode Videotron</span>
                        </>
                      )}
                    </button>
                  </div>
                </header>

                {/* 2. ACTIVITY SELECTOR BAR */}
                <div className="relative z-10 my-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/[0.04] border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                  <div className="flex items-center gap-2.5 flex-1">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/70 shrink-0 font-display">
                      PILIH KEGIATAN AKTIF:
                    </span>
                    <select
                      value={selectedQrStage}
                      onChange={(e) => {
                        setSelectedQrStage(e.target.value);
                        setQrEditForm(getStageQrConfig(e.target.value));
                      }}
                      className="flex-1 bg-[#001F3F] text-white text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2 border border-white/15 focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {Object.values(DEFAULT_QR_SESSIONS).map((ses) => {
                        const customCfg = getStageQrConfig(ses.key);
                        return (
                          <option key={ses.key} value={ses.key} className="bg-[#001F3F] text-white">
                            {customCfg.category} — {customCfg.title} ({customCfg.date})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pr-1">
                    <button
                      type="button"
                      onClick={() => handleToggleStage(selectedQrStage)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider border flex items-center gap-1.5 transition cursor-pointer ${
                        isStageCurrentlyOpen
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                      }`}
                      title="Klik untuk membuka/menutup akses tab tahap ini di halaman publik"
                    >
                      {isStageCurrentlyOpen ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" /> Status Tahap: Dibuka
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Status Tahap: Ditutup (QR Tetap Aktif)
                        </>
                      )}
                    </button>

                    <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] text-white/60">
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      Kode QR Fiks (Tanpa Batas Waktu)
                    </span>
                  </div>
                </div>

                {/* 3. MAIN CONTENT GRID (LEFT: INFO & COUNTER, RIGHT: GIANT STATIC QR) */}
                <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto py-2">
                  {/* LEFT COLUMN (5 Cols): Event Info + Real-Time Counter */}
                  <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-[#002855]/80 via-[#001F3F]/80 to-[#001428]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 lg:p-8 shadow-2xl h-full">
                    <div>
                      {/* Category Badge */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
                        <span>{cfg.category}</span>
                      </div>

                      {/* Title */}
                      <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                        {cfg.title}
                      </h1>

                      {/* Sub-agenda / Pemateri */}
                      {cfg.speaker && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 mb-5 flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">
                              Agenda / Keterangan Sesi
                            </p>
                            <p className="text-sm sm:text-base font-bold text-white">
                              {cfg.speaker}
                            </p>
                            {cfg.speakerRole && (
                              <p className="text-xs text-amber-300/90">{cfg.speakerRole}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Date, Time, Location */}
                      <div className="space-y-2.5 text-xs sm:text-sm text-white/80 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{cfg.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{cfg.time}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{cfg.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Real-Time Attendance Counter Box */}
                    <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-2 border-amber-400/40 rounded-2xl p-4 lg:p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 block mb-1">
                            TOTAL PRESENSI HADIR
                          </span>
                          <div className="flex items-baseline gap-2.5">
                            <span className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                              {attendeeList.length}
                            </span>
                            <span className="text-sm font-semibold text-amber-300">
                              Delegasi
                            </span>
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-amber-400 text-[#001F3F] flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.4)]">
                          <Users className="w-7 h-7" />
                        </div>
                      </div>

                      {/* Latest Attendees Ticker */}
                      {recentAttendees.length > 0 ? (
                        <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 block">
                            Baru Saja Presensi:
                          </span>
                          {recentAttendees.map((att, idx) => (
                            <div
                              key={att.id || idx}
                              className="flex items-center justify-between text-xs bg-white/5 rounded-lg px-2.5 py-1.5"
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="font-semibold text-white truncate">
                                  {att.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-amber-300/90 shrink-0 truncate max-w-[140px]">
                                {att.campus || 'Delegasi PTMAI'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                          <span>Menunggu delegasi melakukan scan QR...</span>
                          <span className="text-emerald-300 font-semibold">Real-Time Aktif</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN (7 Cols): Giant Static QR Display */}
                  <div className="lg:col-span-7 flex flex-col items-center justify-center bg-white text-[#001F3F] rounded-3xl p-6 lg:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-4 border-amber-400/80 relative overflow-hidden h-full">
                    {/* Top Accent Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#003366]/10 text-[#003366] text-xs font-extrabold uppercase tracking-widest mb-3">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>ARAHKAN KAMERA HP KE LAYAR</span>
                    </div>

                    <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#001F3F] text-center mb-1">
                      Scan Kode QR untuk Mengisi Presensi
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 text-center max-w-md mb-5">
                      Gunakan kamera HP, Google Lens, atau pemindai QR untuk langsung membuka formulir presensi delegasi.
                    </p>

                    {/* QR Frame with Corner Accents */}
                    <div className="relative p-4 sm:p-5 rounded-3xl bg-white shadow-[0_10px_40px_rgba(0,31,63,0.12)] border-2 border-slate-100 my-1">
                      {/* Corner Borders */}
                      <div className="absolute -top-1.5 -left-1.5 w-8 h-8 border-t-4 border-l-4 border-[#003366] rounded-tl-2xl" />
                      <div className="absolute -top-1.5 -right-1.5 w-8 h-8 border-t-4 border-r-4 border-[#003366] rounded-tr-2xl" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-8 h-8 border-b-4 border-l-4 border-[#003366] rounded-bl-2xl" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 border-b-4 border-r-4 border-[#003366] rounded-br-2xl" />

                      {qrDataUrl ? (
                        <div className="relative">
                          <img
                            src={qrDataUrl}
                            alt="QR Code Presensi Silatnas"
                            className="w-[230px] h-[230px] sm:w-[280px] sm:h-[280px] lg:w-[310px] lg:h-[310px] object-contain"
                          />
                          {/* Center Logo Overlay with Removed Background */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1.5 shadow-[0_4px_14px_rgba(0,31,63,0.25)] border-2 border-[#003366] flex items-center justify-center">
                              <img
                                src="/assets/logo_qr_presensi.png"
                                alt="Logo Presensi"
                                className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                                onError={(e) => { e.currentTarget.src = '/assets/logo-bem.png'; }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-[260px] h-[260px] flex items-center justify-center text-slate-400">
                          Memuat Kode QR...
                        </div>
                      )}
                    </div>

                    {/* Static QR Status & Quick Action Bar (No Countdown / Fixed QR) */}
                    <div className="w-full max-w-md mt-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Kode QR Fiks • Tanpa Batas Durasi
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleCopyQrUrl}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-[#001F3F] border border-slate-300 text-[11px] font-bold transition cursor-pointer"
                          >
                            {qrCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{qrCopied ? 'Tersalin' : 'Salin Link'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleDownloadQrPng}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#003366] hover:bg-[#002855] text-white text-[11px] font-bold transition cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            <span>Unduh QR</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 3-Step Guide */}
                    <div className="grid grid-cols-3 gap-2.5 w-full max-w-lg mt-5 pt-4 border-t border-slate-200 text-center">
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80">
                        <span className="text-[10px] font-extrabold uppercase text-amber-600 block">
                          1. Scan QR Code
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          Arahkan kamera HP ke layar
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80">
                        <span className="text-[10px] font-extrabold uppercase text-amber-600 block">
                          2. Isi Data Delegasi
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          Masukkan nama & asal kampus
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200/80">
                        <span className="text-[10px] font-extrabold uppercase text-amber-600 block">
                          3. Tercatat Otomatis
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          Presensi langsung terverifikasi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODAL PENYESUAIAN TAMPILAN & INFORMASI QR PRESENSI */}
                {isEditingQrConfig && (
                  <div className="fixed inset-0 z-[1000000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#001F3F] border-2 border-amber-400/50 rounded-3xl max-w-xl w-full p-6 sm:p-7 text-white shadow-2xl space-y-5 my-auto">
                      <div className="flex items-center justify-between border-b border-white/15 pb-4">
                        <div>
                          <h3 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-amber-400" />
                            Sesuaikan Tampilan Layar QR Presensi
                          </h3>
                          <p className="text-xs text-white/70 mt-0.5">
                            Ubah teks judul, kategori, sub-agenda, jadwal, maupun lokasi yang tampil di Videotron.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingQrConfig(false)}
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveQrConfig} className="space-y-3.5 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                              Label Kategori Atas
                            </label>
                            <input
                              type="text"
                              value={qrEditForm.category || ''}
                              onChange={(e) => setQrEditForm({ ...qrEditForm, category: e.target.value })}
                              placeholder="Contoh: AGENDA HARI PERTAMA"
                              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                              Tanggal Pelaksanaan
                            </label>
                            <input
                              type="text"
                              value={qrEditForm.date || ''}
                              onChange={(e) => setQrEditForm({ ...qrEditForm, date: e.target.value })}
                              placeholder="Contoh: Kamis, 29 Oktober 2026"
                              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                            Judul Utama Kegiatan
                          </label>
                          <input
                            type="text"
                            value={qrEditForm.title || ''}
                            onChange={(e) => setQrEditForm({ ...qrEditForm, title: e.target.value })}
                            placeholder="Contoh: Presensi Grand Opening & Seminar Nasional"
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                              Sub-Agenda / Pemateri / Sesi
                            </label>
                            <input
                              type="text"
                              value={qrEditForm.speaker || ''}
                              onChange={(e) => setQrEditForm({ ...qrEditForm, speaker: e.target.value })}
                              placeholder="Contoh: Opening Ceremony & Seminar Nasional"
                              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                              Keterangan / Peserta Sesi
                            </label>
                            <input
                              type="text"
                              value={qrEditForm.speakerRole || ''}
                              onChange={(e) => setQrEditForm({ ...qrEditForm, speakerRole: e.target.value })}
                              placeholder="Contoh: Mandataris BEM PTMAI Se-Indonesia"
                              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                              Waktu Pelaksanaan
                            </label>
                            <input
                              type="text"
                              value={qrEditForm.time || ''}
                              onChange={(e) => setQrEditForm({ ...qrEditForm, time: e.target.value })}
                              placeholder="Contoh: 08:00 - 15:00 WIB"
                              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                              Lokasi Kegiatan
                            </label>
                            <input
                              type="text"
                              value={qrEditForm.location || ''}
                              onChange={(e) => setQrEditForm({ ...qrEditForm, location: e.target.value })}
                              placeholder="Contoh: Kampus Universitas Muhammadiyah Surakarta (UMS)"
                              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                            Link Tujuan QR Code (Kosongkan untuk Otomatis ke Form Presensi)
                          </label>
                          <input
                            type="text"
                            value={qrEditForm.customUrl || ''}
                            onChange={(e) => setQrEditForm({ ...qrEditForm, customUrl: e.target.value })}
                            placeholder={`Otomatis: ${typeof window !== 'undefined' ? window.location.origin : ''}/#silatnas?presensi=${selectedQrStage}`}
                            className="w-full p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                          />
                          <p className="text-[10px] text-white/50 mt-1">
                            Default mengarah langsung ke formulir <strong>{selectedQrStage}</strong> di halaman Silatnas.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/15">
                          <button
                            type="button"
                            onClick={handleResetQrConfig}
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white/80 transition cursor-pointer"
                          >
                            Reset ke Default
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsEditingQrConfig(false)}
                              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#001428] text-xs font-extrabold uppercase tracking-wider transition cursor-pointer"
                            >
                              Simpan Perubahan
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })(),
          document.body
        )}

      {/* Modern Center Modal Alert */}
      <AnimatePresence>
        {alertState.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Blurred Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-neutral-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-5">
                {/* Logo with White Glow */}
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], filter: ["drop-shadow(0 0 10px rgba(255,255,255,0.2))", "drop-shadow(0 0 25px rgba(255,255,255,0.6))", "drop-shadow(0 0 10px rgba(255,255,255,0.2))"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 flex items-center justify-center mb-2"
                >
                  <img src="/assets/logo-bem.png" alt="BEM UMS" className="w-full h-full object-contain" />
                </motion.div>
                
                <div className="space-y-2">
                  <h4 className="font-display uppercase tracking-widest text-sm font-bold text-white">
                    {alertState.type === 'success' ? 'Berhasil' : 'Peringatan'}
                  </h4>
                  <p className="font-body text-neutral-400 text-sm leading-relaxed">
                    {alertState.message}
                  </p>
                </div>
                
                <button 
                  onClick={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                  className="mt-4 w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/50 transition-colors py-3 rounded-xl font-display text-xs uppercase tracking-widest font-bold"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Center Modal Confirm */}
      <AnimatePresence>
        {confirmState.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-neutral-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-5">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], filter: ["drop-shadow(0 0 10px rgba(255,255,255,0.2))", "drop-shadow(0 0 25px rgba(255,255,255,0.6))", "drop-shadow(0 0 10px rgba(255,255,255,0.2))"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 flex items-center justify-center mb-2"
                >
                  <img src="/assets/logo-bem.png" alt="BEM UMS" className="w-full h-full object-contain" />
                </motion.div>
                
                <div className="space-y-2">
                  <h4 className="font-display uppercase tracking-widest text-sm font-bold text-white">
                    Konfirmasi
                  </h4>
                  <p className="font-body text-neutral-400 text-sm leading-relaxed">
                    {confirmState.message}
                  </p>
                </div>
                
                <div className="flex gap-3 w-full mt-4">
                  <button 
                    onClick={() => setConfirmState({ isOpen: false, message: '', onConfirm: null })}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 transition-colors py-3 rounded-xl font-display text-xs uppercase tracking-widest font-bold"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => {
                      if (confirmState.onConfirm) confirmState.onConfirm();
                      setConfirmState({ isOpen: false, message: '', onConfirm: null });
                    }}
                    className="flex-1 bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 hover:border-primary/60 transition-colors py-3 rounded-xl font-display text-xs uppercase tracking-widest font-bold"
                  >
                    Lanjutkan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}


























