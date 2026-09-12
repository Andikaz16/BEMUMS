const fs = require('fs');
const file = 'src/components/AdminCMS.jsx';
let content = fs.readFileSync(file, 'utf8');

const staffMudaTab = `
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
                      className={\`cursor-pointer px-4 py-1.5 rounded-full text-sm font-display \${selectedPeriod === p ? 'bg-primary text-white font-bold' : 'bg-white/10 text-neutral-400 hover:bg-white/20'}\`}
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
                    placeholder="Jabatan/Peran (Contoh: Staff Muda Kementrian A)" 
                    value={staffMudaForm.role} 
                    onChange={e => setStaffMudaForm({...staffMudaForm, role: e.target.value})}
                    className="p-3 bg-[#0a0a0a]/60 border border-white/10 rounded-xl outline-none focus:border-primary text-white"
                  />
                  <div className="md:col-span-2">
                    <label className="text-xs text-neutral-400 mb-1 block">Foto (Opsional)</label>
                    <div className="flex gap-2">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if(file) {
                            try {
                              showCustomAlert("Mengupload gambar...", "info", 2000);
                              const url = await uploadImageToImgur(file);
                              setStaffMudaForm({...staffMudaForm, photo: url});
                              showCustomAlert("Upload berhasil!", "success");
                            } catch(err) {
                              showCustomAlert("Gagal upload gambar", "error");
                            }
                          }
                        }}
                        className="p-2 flex-grow bg-[#0a0a0a]/60 border border-white/10 rounded-xl text-sm"
                      />
                      {staffMudaForm.photo && <img src={staffMudaForm.photo} alt="Preview" className="w-10 h-10 object-cover rounded-xl" />}
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

          {/* TAB 2: ARTIKEL */}`;

content = content.replace('{/* TAB 2: ARTIKEL */}', staffMudaTab);
fs.writeFileSync(file, content, 'utf8');
console.log("Success");
