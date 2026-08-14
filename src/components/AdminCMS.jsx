import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, Image, Phone, UserCheck, AlertTriangle, 
  Settings, Layers, Plus, Trash2, Edit3, Check, X, Download, Calendar 
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminCMS({ db, onUpdateDB }) {
  const [activeTab, setActiveTab] = useState('struktural');

  // --- Custom Alert State ---
  const [alertState, setAlertState] = useState({ isOpen: false, message: '', type: 'success' });
  
  const showCustomAlert = (message, type = 'success') => {
    setAlertState({ isOpen: true, message, type });
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, isOpen: false }));
    }, 4000);
  };

  // --- State for Forms ---
  // Period Form
  const [newPeriod, setNewPeriod] = useState('');
  
  // Member Form
  const [selectedPeriod, setSelectedPeriod] = useState(db.currentPeriod);
  const [memberForm, setMemberForm] = useState({ id: null, name: '', role: '', photo: '', bio: '' });
  const [isEditingMember, setIsEditingMember] = useState(false);

  // Department Form
  const [deptForm, setDeptForm] = useState({ id: null, name: '', desc: '', members: [] });
  const [isEditingDept, setIsEditingDept] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberTitle, setNewMemberTitle] = useState('');

  // Article Form
  const [articleForm, setArticleForm] = useState({ id: null, title: '', category: 'Berita', date: '', thumbnail: '', desc: '', content: '' });
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Album Form
  const [albumForm, setAlbumForm] = useState({ id: null, title: '', date: '', desc: '', driveUrl: '', photos: [] });
  const [isEditingAlbum, setIsEditingAlbum] = useState(false);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');

  // Contact Form
  const [contactForm, setContactForm] = useState({ ...db.contact });

  // Oprec Form
  const [oprecTitle, setOprecTitle] = useState(db.oprec.title);
  const [oprecDesc, setOprecDesc] = useState(db.oprec.desc);
  const [oprecIsOpen, setOprecIsOpen] = useState(db.oprec.isOpen);

  // Galeri Pergerakan
  const [newGaleriImg, setNewGaleriImg] = useState('');

  // Volunteer Catalog Form
  const [volForm, setVolForm] = useState({ id: null, title: '', isOpen: true, requirements: '', jobdesc: '', schedule: '' });
  const [isEditingVol, setIsEditingVol] = useState(false);

  // Visi Misi Form
  const [visiMisiForm, setVisiMisiForm] = useState({
    visi: db.visiMisi?.visi || '',
    desc: db.visiMisi?.desc || '',
    misi: db.visiMisi?.misi || [],
    pillars: db.visiMisi?.pillars || []
  });

  const [kegiatanList, setKegiatanList] = useState(db.kegiatan || []);
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
      setKegiatanList(updated);
      save({ kegiatan: updated });
      setEditingKegiatanId(null);
    } else {
      const updated = [...kegiatanList, { id: Date.now(), ...newKegiatan }].sort((a,b) => new Date(a.date) - new Date(b.date));
      setKegiatanList(updated);
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
    if(window.confirm("Hapus kegiatan kalender ini?")) {
      const updated = kegiatanList.filter(k => k.id !== id);
      setKegiatanList(updated);
      save({ kegiatan: updated });
      if (editingKegiatanId === id) {
        setEditingKegiatanId(null);
        setNewKegiatan({ date: '', title: '', desc: '' });
      }
    }
  };

  const [newMisiText, setNewMisiText] = useState('');

  // Save changes wrapper
  const save = (updatedData) => {
    onUpdateDB({ ...db, ...updatedData });
    showCustomAlert('Perubahan berhasil disimpan!', 'success');
  };

  // --- Handler Functions ---
  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
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
    if(!confirm('Hapus profil pimpinan ini?')) return;
    const list = db.pimpinan[selectedPeriod] || [];
    const updatedPimpinan = { ...db.pimpinan, [selectedPeriod]: list.filter(m => m.id !== id) };
    onUpdateDB({ ...db, pimpinan: updatedPimpinan });
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
    setIsEditingDept(false);
  };

  const handleAddMemberToDept = () => {
    if (!newMemberName.trim()) return;
    const updatedMembers = [...deptForm.members, { name: newMemberName.trim(), title: newMemberTitle.trim() || 'Anggota' }];
    setDeptForm({ ...deptForm, members: updatedMembers });
    setNewMemberName('');
    setNewMemberTitle('');
  };

  const handleRemoveMemberFromDept = (idx) => {
    const updatedMembers = deptForm.members.filter((_, i) => i !== idx);
    setDeptForm({ ...deptForm, members: updatedMembers });
  };

  const handleDeleteDept = (id) => {
    if(!confirm('Hapus kementerian ini beserta anggotanya?')) return;
    const list = db.kementerian[selectedPeriod] || [];
    const updatedKementerian = { ...db.kementerian, [selectedPeriod]: list.filter(d => d.id !== id) };
    onUpdateDB({ ...db, kementerian: updatedKementerian });
  };

  // Article Handlers
  const handleSaveArticle = () => {
    let updatedList;
    if (isEditingArticle) {
      updatedList = db.articles.map(a => a.id === articleForm.id ? { ...articleForm } : a);
    } else {
      updatedList = [...db.articles, { ...articleForm, id: Date.now() }];
    }
    onUpdateDB({ ...db, articles: updatedList });
    setArticleForm({ id: null, title: '', category: 'Berita', date: '', thumbnail: '', desc: '', content: '' });
    setIsEditingArticle(false);
    setShowArticleForm(false);
  };

  const handleDeleteArticle = (id) => {
    if(!confirm('Hapus artikel ini?')) return;
    onUpdateDB({ ...db, articles: db.articles.filter(a => a.id !== id) });
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
      updatedList = [...db.albums, { ...albumForm, id: Date.now() }];
    }
    onUpdateDB({ ...db, albums: updatedList });
    setAlbumForm({ id: null, title: '', date: '', desc: '', driveUrl: '', photos: [] });
    setIsEditingAlbum(false);
  };

  const handleAddPhotoToAlbum = () => {
    if (!tempPhotoUrl.trim()) return;
    setAlbumForm({ ...albumForm, photos: [...albumForm.photos, tempPhotoUrl.trim()] });
    setTempPhotoUrl('');
  };

  const handleDeleteAlbum = (id) => {
    if(!confirm('Hapus album ini?')) return;
    onUpdateDB({ ...db, albums: db.albums.filter(a => a.id !== id) });
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
    setVolForm({ id: null, title: '', isOpen: true, requirements: '', jobdesc: '', schedule: '' });
    setIsEditingVol(false);
  };

  const handleDeleteVol = (id) => {
    if(!confirm('Hapus katalog volunteer ini?')) return;
    onUpdateDB({ ...db, volunteerCatalog: db.volunteerCatalog.filter(v => v.id !== id) });
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

  // Export CSV (for spreadsheets)
  const downloadCSV = (data, filename) => {
    if (!data || !data.length) return;
    
    // Tentukan header yang rapi
    const headerMapping = {
      name: "Nama Lengkap",
      nim: "NIM",
      email: "Email",
      faculty: "Fakultas",
      choice1: "Pilihan 1",
      choice2: "Pilihan 2",
      cvLink: "Link CV / Portofolio",
      reason: "Alasan Mendaftar",
      id: "Waktu Daftar",
      phone: "No Telepon / WA",
      // untuk volunteer
      commitment: "Komitmen Waktu"
    };
    
    const rawKeys = Object.keys(data[0]);
    
    // Create CSV rows
    const csvRows = [];
    
    // Push headers row (using mapped names, or raw if not mapped)
    const headers = rawKeys.map(k => headerMapping[k] || k);
    // Menggunakan pemisah TITIK KOMA (;) agar terbaca rapi sebagai kolom di Excel (Indonesia)
    csvRows.push(headers.join(';'));
    
    // Push data rows
    for (const row of data) {
      const values = rawKeys.map(key => {
        let val = row[key];
        
        // Format waktu (id biasanya unix timestamp)
        if (key === 'id' && typeof val === 'number') {
          const date = new Date(val);
          val = date.toLocaleString('id-ID'); // Format tanggal Indonesia
        }
        
        // Escape quotes and wrap in quotes to prevent issue with semicolon/commas inside text
        const stringVal = val ? String(val) : '';
        const escaped = stringVal.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(';'));
    }
    
    // Tambahkan BOM (\uFEFF) agar Excel mengenali karakter UTF-8 dengan benar
    const csvString = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
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
            { id: 'artikel', name: '2. Artikel & Berita', icon: FileText },
            { id: 'dokumentasi', name: '3. Dokumentasi', icon: Image },
            { id: 'hubungi', name: '4. Hubungi Kami', icon: Phone },
            { id: 'oprec', name: '5. Oprec (Gabung)', icon: UserCheck },
            { id: 'galeri', name: '6. Galeri Pergerakan', icon: Image },
            { id: 'volunteer', name: '7. Volunteer', icon: Layers },
            { id: 'visimisi', name: '8. Visi & Misi', icon: Settings },
            { id: 'kalender', name: '9. Kalender Kegiatan', icon: Calendar }
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
                      
                      {/* Sub Form Add Members to Dept */}
                      <div className="p-3 border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden bg-neutral-800/40 text-white space-y-2">
                        <h5 className="font-display text-xs uppercase">Anggota Jajaran Kementerian</h5>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {deptForm.members.map((member, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-white/10 text-white border border-white/10 rounded-xl bg-neutral-800/40 overflow-hidden text-xs px-2 py-0.5">
                              {member.name} ({member.title})
                              <button onClick={() => handleRemoveMemberFromDept(i)} className="hover:text-primary font-bold">×</button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Nama Jajaran" 
                            value={newMemberName} 
                            onChange={e => setNewMemberName(e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-xs flex-1"
                          />
                          <input 
                            type="text" 
                            placeholder="Jabatan (cth: Dirjen)" 
                            value={newMemberTitle} 
                            onChange={e => setNewMemberTitle(e.target.value)}
                            className="px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors focus:ring-1 focus:ring-primary/50 placeholder-neutral-500 text-xs w-32"
                          />
                          <button onClick={handleAddMemberToDept} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-3 py-1 text-xs">Tambah</button>
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
                            theme="snow"
                            value={articleForm.content || ''} 
                            onChange={(val) => setArticleForm({ ...articleForm, content: val })} 
                            placeholder="Tulis konten artikel di sini..."
                            modules={{
                              toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'header': [1, 2, 3, false] }],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['blockquote', 'link', 'image'],
                                ['clean']
                              ]
                            }}
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
                  {db.articles.map(a => (
                    <div key={a.id} className="p-4 border border-white/10 rounded-2xl bg-neutral-800/40 backdrop-blur-md text-white overflow-hidden bg-neutral-800/40 text-white flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-black/80 text-white border-white/10 px-2 py-0.5 text-[10px] uppercase font-bold">{a.category}</span>
                          <span className="text-xs text-neutral-400">{a.date}</span>
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
                    setAlbumForm({ id: null, title: '', date: '', desc: '', driveUrl: '', photos: [] });
                  }} 
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.4)] hover:shadow-[0_0_25px_rgba(185,0,20,0.6)] border border-primary/50 font-bold px-5 py-2 text-sm"
                >
                  Buat Album Baru
                </button>
              </div>

              {/* Form Album */}
              {(albumForm.id !== null || isEditingAlbum || albumForm.title !== '') && (
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
                      onClick={() => setAlbumForm({ id: null, title: '', date: '', desc: '', photos: [] })} 
                      className="bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10 shadow-sm font-bold px-4 py-3 text-xs"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {/* List Albums */}
              <div className="space-y-4">
                {db.albums.map(a => (
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
                    onUpdateDB({ ...db, galeriPergerakan: [newGaleriImg, ...(db.galeriPergerakan || [])] });
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
                            if(!confirm('Hapus foto ini?')) return;
                            const newGaleri = [...db.galeriPergerakan];
                            newGaleri.splice(i, 1);
                            onUpdateDB({ ...db, galeriPergerakan: newGaleri });
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
                    setVolForm({ id: null, title: '', isOpen: true, requirements: '', jobdesc: '', schedule: '' });
                  }} 
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.4)] hover:shadow-[0_0_25px_rgba(185,0,20,0.6)] border border-primary/50 font-bold px-5 py-2 text-sm"
                >
                  Tambah Kegiatan Volunteer
                </button>
              </div>

              {/* Form Volunteer */}
              {(volForm.id !== null || isEditingVol || volForm.title !== '') && (
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
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveVol} className="bg-primary hover:bg-primary/80 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(185,0,20,0.3)] hover:shadow-[0_0_25px_rgba(185,0,20,0.5)] border border-primary/50 font-bold px-4 py-3 text-xs">Simpan Kegiatan</button>
                    <button 
                      onClick={() => setVolForm({ id: null, title: '', isOpen: true, requirements: '', jobdesc: '', schedule: '' })} 
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

          {/* TAB 8: VISI MISI */}
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

        </div>
      </div>

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
                {/* Logo with gentle pulse */}
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(185,0,20,0)", "0 0 30px rgba(185,0,20,0.3)", "0 0 0px rgba(185,0,20,0)"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 bg-black/50 border border-white/5 p-3 rounded-2xl flex items-center justify-center mb-2"
                >
                  <img src="/assets/logo-bem.png" alt="BEM UMS" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
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

    </div>
  );
}


























