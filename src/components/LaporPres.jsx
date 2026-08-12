import React, { useState } from 'react';

export default function LaporPres({ db, onUpdateDB }) {
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    faculty: '',
    aspiration: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.aspiration) {
      alert('Mohon isi Nama dan Aspirasi Anda.');
      return;
    }

    const newReport = {
      ...formData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReports = [newReport, ...(db.reports || [])];
    onUpdateDB({ ...db, reports: updatedReports });
    setSubmitted(true);
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Newspaper Style Header */}
        <div className="border-y-8 border-double border-black py-6 text-center space-y-2">
          <span className="font-display text-xs uppercase tracking-widest text-primary font-bold">
            SUARA ADVOKASI MAHASISWA UMS
          </span>
          <h1 className="text-4xl sm:text-6xl font-display uppercase tracking-tight leading-none heading-koran pb-2">
            LAPOR PRES!
          </h1>
          <p className="text-xs sm:text-sm font-body uppercase font-bold tracking-wider text-secondary">
            RUANG UTAMA PENYALURAN ASPIRASI — KABINET TRANSFORMASI PROGRESIF
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Brief info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-black text-white p-6 border-4 border-black space-y-4">
              <h3 className="font-display text-xl uppercase tracking-wider text-primary">Jaminan Kerahasiaan</h3>
              <p className="text-xs font-body leading-relaxed text-neutral-300">
                {db.laporDescription}
              </p>
              <div className="border-t border-neutral-700 pt-3">
                <span className="text-[10px] font-display uppercase tracking-widest text-neutral-400">
                  STATUS ADVOKASI: AKTIF
                </span>
              </div>
            </div>
            
            {/* Quote design block */}
            <div className="border-l-4 border-primary pl-4 py-2 italic font-body text-sm text-secondary">
              "Keadilan akademik dan fasilitas kampus tidak datang dengan sendirinya, ia harus disuarakan."
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white border-4 border-black p-8 text-center space-y-4 shadow-[6px_6px_0px_0px_#000]">
                <span className="material-symbols-outlined text-5xl text-emerald-600">done_all</span>
                <h3 className="text-2xl font-display uppercase">Laporan Berhasil Masuk!</h3>
                <p className="text-xs font-body text-secondary leading-relaxed max-w-sm mx-auto">
                  Aspirasi Anda telah terkirim langsung ke dashboard admin BEM UMS. Kami akan segera menganalisis dan menindaklanjuti.
                </p>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', nim: '', faculty: '', aspiration: '' });
                  }} 
                  className="neo-btn px-6 py-2 text-xs"
                >
                  KIRIM LAPORAN LAIN
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_#000] space-y-6">
                <h3 className="font-display text-lg uppercase border-b border-black pb-1.5">Saluran Aspirasi</h3>
                
                <div className="space-y-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Nama Lengkap / Samaran *</label>
                    {/* Minimalist industrial input (thick bottom border/box murni) */}
                    <input 
                      type="text" 
                      required
                      placeholder="Masukkan nama Anda (atau 'Anonim')"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="border-b-4 border-black bg-neutral-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-primary transition-all font-body font-bold rounded-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">NIM Mahasiswa</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: L200230001 (Boleh dikosongi jika Anonim)"
                      value={formData.nim}
                      onChange={e => setFormData({ ...formData, nim: e.target.value })}
                      className="border-b-4 border-black bg-neutral-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-primary transition-all font-body font-bold rounded-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Fakultas / Program Studi</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Fakultas Teknik / Teknik Sipil"
                      value={formData.faculty}
                      onChange={e => setFormData({ ...formData, faculty: e.target.value })}
                      className="border-b-4 border-black bg-neutral-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-primary transition-all font-body font-bold rounded-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Isi Aspirasi / Pengaduan *</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Tuliskan aspirasi, kritik, keluhan fasilitas, atau saran akademik secara lengkap dan jelas..."
                      value={formData.aspiration}
                      onChange={e => setFormData({ ...formData, aspiration: e.target.value })}
                      className="border-4 border-black bg-neutral-50 p-3 text-sm outline-none focus:bg-white focus:border-primary transition-all font-body font-bold rounded-none h-36 resize-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full neo-btn text-sm py-3.5 mt-2 bg-primary text-white font-bold border-3 border-black">
                  KIRIM SUARA ASPIRASI
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
