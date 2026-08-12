import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import Struktural from './components/Struktural.jsx';
import Artikel from './components/Artikel.jsx';
import Dokumentasi from './components/Dokumentasi.jsx';
import VisiMisi from './components/VisiMisi.jsx';
import HubungiKami from './components/HubungiKami.jsx';
import Oprec from './components/Oprec.jsx';
import LaporPres from './components/LaporPres.jsx';
import Volunteer from './components/Volunteer.jsx';
import AdminCMS from './components/AdminCMS.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import Kementerian from './components/Kementerian.jsx';
import { initDB, saveDB } from './db.js';
import Lenis from 'lenis';

export default function App() {
  const [db, setDb] = useState(null);
  const [activePage, setActivePage] = useState('beranda');
  
  // Auth state for Admin CMS
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('bem_admin_auth') === 'true';
  });

  const handleLoginSuccess = () => {
    sessionStorage.setItem('bem_admin_auth', 'true');
    setIsAdminLoggedIn(true);
  };

  // Initialize DB from Firebase
  useEffect(() => {
    const unsubscribe = initDB(setDb);
    return () => unsubscribe && unsubscribe();
  }, []);

  // Handle URL hash routing (?admin or #admin)
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
    });

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === 'admin') {
        setActivePage('admin');
      } else if (hash && ['beranda', 'struktural', 'kementerian', 'artikel', 'dokumentasi', 'visimisi', 'hubungi', 'oprec', 'lapor', 'volunteer'].includes(hash)) {
        setActivePage(hash);
      } else {
        // Fallback or default
        setActivePage('beranda');
      }
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    // Trigger on first load
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      lenis.destroy();
    };
  }, []);

  // Wrap navigation changes to also update hash location
  const handlePageChange = (page) => {
    setActivePage(page);
    window.location.hash = page === 'beranda' ? '' : page;
  };

  // Automatically scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto-logout: if user leaves the admin page, clear the login session for security
    if (activePage !== 'admin') {
      sessionStorage.removeItem('bem_admin_auth');
      setIsAdminLoggedIn(false);
    }
  }, [activePage]);

  // Update Database state and save to local storage
  const handleUpdateDB = (newDB) => {
    setDb(newDB);
    saveDB(newDB);
  };

  if (!db) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-primary font-display font-bold">
        MEMUAT DATABASE...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#3B0505] to-black text-[#1a1c1c] overflow-x-hidden font-body">
      {/* Dynamic Navigation Header */}
      <Navbar activePage={activePage} setActivePage={handlePageChange} />

      {/* Main Pages Content Switcher */}
      <main className="flex-grow">
        {activePage === 'beranda' && (
          <Hero db={db} setActivePage={handlePageChange} />
        )}
        {activePage === 'struktural' && (
          <Struktural db={db} />
        )}
        {activePage === 'kementerian' && (
          <Kementerian db={db} />
        )}
        {activePage === 'artikel' && (
          <Artikel db={db} />
        )}
        {activePage === 'dokumentasi' && (
          <Dokumentasi db={db} />
        )}
        {activePage === 'visimisi' && (
          <VisiMisi db={db} />
        )}
        {activePage === 'hubungi' && (
          <HubungiKami db={db} />
        )}
        {activePage === 'oprec' && (
          <Oprec db={db} onUpdateDB={handleUpdateDB} />
        )}
        {activePage === 'lapor' && (
          <LaporPres db={db} onUpdateDB={handleUpdateDB} />
        )}
        {activePage === 'volunteer' && (
          <Volunteer db={db} onUpdateDB={handleUpdateDB} />
        )}
        {activePage === 'admin' && (
          isAdminLoggedIn ? (
            <AdminCMS db={db} onUpdateDB={handleUpdateDB} />
          ) : (
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          )
        )}
      </main>

      {/* Shared Footer */}
      <Footer setActivePage={handlePageChange} />
    </div>
  );
}


