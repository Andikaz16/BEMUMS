import React from 'react';

/**
 * Global ErrorBoundary to catch uncaught runtime crashes.
 * Automatically recovers from chunk loading errors (e.g. after new deployments)
 * without requiring the user to manually execute hard reloads (Ctrl + Shift + R).
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('BEM UMS caught an error:', error, errorInfo);

    // Detect missing chunk / dynamic import error after a new deployment
    const errorMsg = String(error?.message || '');
    const isChunkError = 
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('Loading chunk') ||
      errorMsg.includes('Importing a module script failed') ||
      errorMsg.includes('error loading dynamically imported module');

    if (isChunkError) {
      const lastReload = sessionStorage.getItem('bem_chunk_auto_reload');
      const now = Date.now();
      // Guard against infinite reload loop (max once every 10 seconds)
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem('bem_chunk_auto_reload', String(now));
        console.warn('Chunk load error detected! Auto-reloading page with latest assets...');
        window.location.reload();
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem('bem_chunk_auto_reload');
    sessionStorage.removeItem('bem_preload_reload');
    window.location.reload();
  };

  handleGoHome = () => {
    sessionStorage.removeItem('bem_chunk_auto_reload');
    sessionStorage.removeItem('bem_preload_reload');
    window.location.href = window.location.origin;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-20 h-20 rounded-full bg-red-600/15 border border-red-500/30 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-red-500">autorenew</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-display uppercase tracking-wider mb-3 text-white">
            Pembaruan Sistem Tersedia
          </h1>
          
          <p className="text-white/70 max-w-md text-sm leading-relaxed mb-8">
            Website baru saja diperbarui ke versi terbaru. Silakan klik tombol di bawah untuk memuat ulang data terkini secara otomatis.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={this.handleReload}
              className="w-full px-6 py-3 bg-[#b90014] hover:bg-[#8f0010] text-white font-medium rounded-xl transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Muat Ulang Halaman
            </button>
            <button
              onClick={this.handleGoHome}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white/90 font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              Beranda
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
