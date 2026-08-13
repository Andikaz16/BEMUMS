import React, { useState } from 'react';
import { Menu, X, ShieldAlert } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tentangDropdownOpen, setTentangDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'beranda', label: 'Beranda' }
  ];

  const tentangItems = [
    { id: 'visimisi', label: 'Visi & Misi' },
    { id: 'kementerian', label: 'Kementerian' },
    { id: 'struktural', label: 'Struktural' },
    { id: 'kalender', label: 'Kalender Kegiatan' }
  ];

  const services = [
    { id: 'lapor', label: 'Lapor Pres!', href: 'https://portal-layanan-bem-ums.vercel.app/' },
    { id: 'artikel', label: 'Artikel' },
    { id: 'volunteer', label: 'Volunteer' },
    { id: 'oprec', label: 'Oprec Jajaran' },
    { id: 'dokumentasi', label: 'Dokumentasi' }
  ];

  return (
    <header className="fixed top-4 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-[96%] lg:max-w-7xl z-50 bg-gradient-to-r from-black via-black to-[#3B0505] text-white rounded-full shadow-lg border border-neutral-800 transition-all">
      <div className="h-14 md:h-16 w-full px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('beranda')}>
          <img 
            src="/assets/logo_bem_baru.png" 
            alt="BEM UMS Logo" 
            className="h-16 md:h-24 w-auto object-contain scale-110 md:scale-125 origin-left z-10"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          
          <button
            onClick={() => setActivePage('beranda')}
            className={`font-body text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 py-1 ${
              activePage === 'beranda' 
                ? 'text-primary border-primary' 
                : 'text-neutral-300 border-transparent hover:text-white'
            }`}
          >
            Beranda
          </button>

          {/* Submenu for Tentang */}
          <div 
            className="relative"
            onMouseEnter={() => setTentangDropdownOpen(true)}
            onMouseLeave={() => setTentangDropdownOpen(false)}
          >
            <button 
              type="button"
              onClick={() => setTentangDropdownOpen(!tentangDropdownOpen)}
              className="font-body text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer border-b-2 border-transparent py-1"
            >
              Tentang <span className="text-[10px]">▼</span>
            </button>
            {tentangDropdownOpen && (
              <div className="absolute left-0 top-full pt-1 w-48 z-50">
                <div className="bg-[#1a0000] border border-[#3B0505] shadow-xl rounded-2xl overflow-hidden mt-2">
                  {tentangItems.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setActivePage(s.id);
                        setTentangDropdownOpen(false);
                      }}
                      className={`w-full text-left font-body text-xs font-bold uppercase p-3 hover:bg-black border-b border-[#3B0505] last:border-0 cursor-pointer transition-colors ${
                        activePage === s.id ? 'text-primary' : 'text-neutral-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          
          {/* Submenu for interactive services */}
          <div 
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button 
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="font-body text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer border-b-2 border-transparent py-1"
            >
              Layanan <span className="text-[10px]">▼</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full pt-1 w-48 z-50">
                <div className="bg-[#1a0000] border border-[#3B0505] shadow-xl rounded-2xl overflow-hidden mt-2">
                  {services.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        if (s.href) {
                          window.open(s.href, '_blank');
                        } else {
                          setActivePage(s.id);
                        }
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left font-body text-xs font-bold uppercase p-3 hover:bg-black border-b border-[#3B0505] last:border-0 cursor-pointer transition-colors ${
                        activePage === s.id ? 'text-primary' : 'text-neutral-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActivePage('hubungi')}
            className={`font-body text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 py-1 ${
              activePage === 'hubungi' 
                ? 'text-primary border-primary' 
                : 'text-neutral-300 border-transparent hover:text-white'
            }`}
          >
            Contact Us
          </button>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActivePage('oprec')}
            className="hidden sm:inline-block bg-primary text-white border-2 border-black font-display text-xs px-5 py-2 uppercase hover:bg-primary-container shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 active:translate-y-0.5"
          >
            GABUNG KABINET
          </button>

          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden flex flex-col gap-1.5 p-2 border border-transparent hover:border-white rounded-full"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-4 bg-gradient-to-br from-black to-[#1a0000] rounded-3xl shadow-xl border border-neutral-800 py-6 px-8 space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            
            <button
              onClick={() => {
                setActivePage('beranda');
                setIsOpen(false);
              }}
              className={`text-left font-body text-xs font-bold uppercase py-2 border-b border-neutral-800 ${
                activePage === 'beranda' ? 'text-primary' : 'text-neutral-300'
              }`}
            >
              Beranda
            </button>

            <div className="pt-2">
              <span className="text-[9px] font-display text-secondary tracking-widest uppercase block mb-1">Tentang BEM</span>
              {tentangItems.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActivePage(s.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left font-body text-xs font-bold uppercase py-2 pl-3 border-l-2 border-neutral-700 mb-1 ${
                    activePage === s.id ? 'text-primary' : 'text-neutral-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>



            <div className="pt-2">
              <span className="text-[9px] font-display text-secondary tracking-widest uppercase block mb-1">Daftar Layanan</span>
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (s.href) {
                      window.open(s.href, '_blank');
                    } else {
                      setActivePage(s.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full text-left font-body text-xs font-bold uppercase py-2 pl-3 border-l-2 border-neutral-700 mb-1 ${
                    activePage === s.id ? 'text-primary' : 'text-neutral-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setActivePage('hubungi');
                setIsOpen(false);
              }}
              className={`text-left font-body text-xs font-bold uppercase py-2 mt-2 border-b border-neutral-800 ${
                activePage === 'hubungi' ? 'text-primary' : 'text-neutral-300'
              }`}
            >
              Contact Us
            </button>
          </div>
          <button 
            onClick={() => {
              setActivePage('oprec');
              setIsOpen(false);
            }}
            className="bg-primary text-white border-2 border-black font-display text-xs w-full py-3 uppercase text-center mt-4 shadow-[2px_2px_0px_0px_#000]"
          >
            GABUNG KABINET
          </button>
        </div>
      )}
    </header>
  );
}


