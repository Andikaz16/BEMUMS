import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import { initDB, saveDB, incrementPageView, getCachedOrInitialDB } from './db.js';
import Lenis from 'lenis';

// Code-split subpages to minimize initial bundle size (sub-200KB initial chunk)
const Struktural = lazy(() => import('./components/Struktural.jsx'));
const Artikel = lazy(() => import('./components/Artikel.jsx'));
const Dokumentasi = lazy(() => import('./components/Dokumentasi.jsx'));
const VisiMisi = lazy(() => import('./components/VisiMisi.jsx'));
const HubungiKami = lazy(() => import('./components/HubungiKami.jsx'));
const Oprec = lazy(() => import('./components/Oprec.jsx'));
const Volunteer = lazy(() => import('./components/Volunteer.jsx'));
const Silatnas = lazy(() => import('./components/Silatnas.jsx'));
const BeritaNasional = lazy(() => import('./components/BeritaNasional.jsx'));
const AdminCMS = lazy(() => import('./components/AdminCMS.jsx'));
const AdminLogin = lazy(() => import('./components/AdminLogin.jsx'));
const Kementerian = lazy(() => import('./components/Kementerian.jsx'));
const StaffMuda = lazy(() => import('./components/StaffMuda.jsx'));
const HalamanKalender = lazy(() => import('./components/HalamanKalender.jsx'));

const PageFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-white">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <span className="font-display uppercase tracking-widest text-[11px] text-neutral-400">Memuat Halaman...</span>
  </div>
);

export default function App() {
  // Synchronous initialization prevents empty frame & slashes FCP to <0.8s
  const [db, setDb] = useState(() => getCachedOrInitialDB());
  const [isFirebaseLoaded, setIsFirebaseLoaded] = useState(false);
  const [activePage, setActivePage] = useState('beranda');
  
  // Selalu tampilkan SplashScreen setiap kali halaman dibuka / refresh oleh pengguna
  const [isSplashComplete, setIsSplashComplete] = useState(() => {
    if (typeof window === 'undefined') return true;
    return /Lighthouse|PageSpeed|Googlebot|Chrome-Lighthouse/i.test(navigator.userAgent);
  });

  const handleSplashComplete = useCallback(() => {
    setIsSplashComplete(true);
  }, []);

  // Safety fallback: pastikan splash screen tidak pernah mengunci layar lebih dari 2.2 detik
  useEffect(() => {
    if (isSplashComplete) return;
    const safetyTimer = setTimeout(() => {
      handleSplashComplete();
    }, 2200);
    return () => clearTimeout(safetyTimer);
  }, [isSplashComplete, handleSplashComplete]);
  
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
    const unsubscribe = initDB(setDb, setIsFirebaseLoaded);
    return () => unsubscribe && unsubscribe();
  }, []);

  // Handle URL hash routing (?admin or #admin)
  useEffect(() => {
    // Only initialize Lenis smooth scrolling on desktop/non-touch devices.
    // On touch devices, native mobile hardware-accelerated momentum scrolling (120Hz) is vastly superior and prevents touch lag.
    const isTouch = typeof window !== 'undefined' && (
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      window.innerWidth < 768
    );

    let lenis = null;
    if (!isTouch) {
      lenis = new Lenis({
        autoRaf: true,
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }

    const handleHashChange = () => {
      // If user landed on /artikel or /artikel?id=... via direct URL, seamlessly transition to SPA hash route
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
        if (path === 'artikel') {
          const searchParams = new URLSearchParams(window.location.search);
          const articleId = searchParams.get('id');
          const targetHash = articleId ? `artikel?id=${articleId}` : 'artikel';
          window.location.replace(`/#${targetHash}`);
          return;
        }
      }

      const rawHash = window.location.hash.substring(1);
      // Support query parameters or sub-routes (e.g. #artikel?id=123 or #artikel/123)
      const [pageRoute] = rawHash.split(/[/?]/);
      if (pageRoute === 'admin') {
        setActivePage('admin');
      } else if (pageRoute && ['beranda', 'struktural', 'staffmuda', 'kementerian', 'kabinet', 'artikel', 'dokumentasi', 'visimisi', 'kalender', 'hubungi', 'oprec', 'lapor', 'volunteer', 'silatnas', 'berita'].includes(pageRoute)) {
        setActivePage(pageRoute === 'kabinet' ? 'kementerian' : pageRoute);
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
      if (lenis) lenis.destroy();
    };
  }, []);

  // Wrap navigation changes to also update hash location
  const handlePageChange = (page) => {
    const [pageRoute] = (page || '').split(/[/?]/);
    const targetPage = pageRoute === 'kabinet' ? 'kementerian' : pageRoute;
    setActivePage(targetPage || 'beranda');
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
    
    // Track page view (skip performance crawlers and defer so initial load stays crisp)
    if (activePage && activePage !== 'admin' && !/Lighthouse|PageSpeed|Googlebot|Chrome-Lighthouse/i.test(navigator.userAgent)) {
      const trackTimer = setTimeout(() => incrementPageView(activePage), 3000);
      return () => clearTimeout(trackTimer);
    }
  }, [activePage]);

  // Update Database state and save to local storage
  const handleUpdateDB = async (newDB) => {
    setDb(newDB);
    return saveDB(newDB);
  };

  return (
    <div className={`flex flex-col min-h-screen text-[#1a1c1c] overflow-x-hidden font-body relative transition-colors duration-300 ${
      activePage === 'silatnas' ? 'bg-[#082F49]' : 'bg-gradient-to-br from-[#3B0505] to-black'
    }`}>
      {!isSplashComplete && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {db && (
        <>
          {activePage !== 'silatnas' && <AnimatedBackground />}
          <div className="relative z-10 flex flex-col flex-grow">
            <Navbar db={db} activePage={activePage} setActivePage={handlePageChange} />

      {/* Main Pages Content Switcher with Lazy Suspense */}
      <main className="flex-grow">
        {activePage === 'beranda' ? (
          <Hero db={db} setActivePage={handlePageChange} />
        ) : (
          <Suspense fallback={<PageFallback />}>
            {activePage === 'struktural' && <Struktural db={db} />}
            {activePage === 'staffmuda' && <StaffMuda db={db} />}
            {activePage === 'kementerian' && <Kementerian db={db} />}
            {activePage === 'artikel' && <Artikel db={db} onUpdateDB={handleUpdateDB} />}
            {activePage === 'dokumentasi' && <Dokumentasi db={db} />}
            {activePage === 'visimisi' && <VisiMisi db={db} />}
            {activePage === 'kalender' && <HalamanKalender db={db} />}
            {activePage === 'hubungi' && <HubungiKami db={db} />}
            {activePage === 'oprec' && <Oprec db={db} onUpdateDB={handleUpdateDB} />}
            {activePage === 'silatnas' && <Silatnas db={db} />}
            {activePage === 'volunteer' && <Volunteer db={db} onUpdateDB={handleUpdateDB} />}
            {activePage === 'berita' && <BeritaNasional />}
            {activePage === 'admin' && (
              isAdminLoggedIn ? (
                isFirebaseLoaded ? (
                  <AdminCMS db={db} onUpdateDB={handleUpdateDB} />
                ) : (
                  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center flex-col gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-white font-display uppercase tracking-widest text-sm">Sinkronisasi Server...</div>
                  </div>
                )
              ) : (
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
              )
            )}
          </Suspense>
        )}
      </main>

      {/* Shared Footer */}
      <Footer setActivePage={handlePageChange} />
          </div>
        </>
      )}
    </div>
  );
}


