import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, ChevronRight, X, Heart, MessageCircle, 
  MessageSquare, Share2, Send, Check, Copy, User, Clock 
} from 'lucide-react';
import { toggleArticleLike, addArticleComment, sortItemsByDateDesc } from '../db.js';

export default function Artikel({ db, onUpdateDB }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeArticle, setActiveArticle] = useState(null);

  // Interaction states for active article
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  
  // Share popup state
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const commentInputRef = useRef(null);
  const commentSectionRef = useRef(null);

  const categories = db?.categories || ["Semua"];
  const articles = sortItemsByDateDesc(db?.articles || []);

  // Filter articles based on selected label/category
  const filteredArticles = selectedCategory === 'Semua' 
    ? articles 
    : articles.filter(a => a.category?.toLowerCase() === selectedCategory.toLowerCase());

  // Helper to extract article id from hash (#artikel?id=xxx or #artikel/xxx)
  const getArticleIdFromHash = () => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash.substring(1);
    if (!hash.startsWith('artikel')) return null;

    const searchPart = hash.includes('?') ? hash.split('?')[1] : null;
    if (searchPart) {
      const params = new URLSearchParams(searchPart);
      const id = params.get('id');
      if (id) return id;
    }

    const slashParts = hash.split('/');
    if (slashParts.length > 1 && slashParts[1]) {
      return slashParts[1];
    }

    return null;
  };

  // Handle opening an article
  const handleOpenArticle = (article, updateHash = true) => {
    setActiveArticle(article);
    setLikesCount(typeof article.likes === 'number' ? article.likes : 0);
    setComments(Array.isArray(article.comments) ? article.comments : []);
    setIsLiked(localStorage.getItem(`bem_article_liked_${article.id}`) === 'true');
    setCommentSuccess(false);
    setShowShareModal(false);
    setCommentAuthor('');
    setCommentText('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (updateHash && typeof window !== 'undefined') {
      window.location.hash = `artikel?id=${article.id}`;
    }
  };

  // Handle back to article listing
  const handleBackToList = () => {
    setActiveArticle(null);
    if (typeof window !== 'undefined') {
      window.location.hash = 'artikel';
    }
  };

  // Synchronize activeArticle with URL hash (?id=...)
  useEffect(() => {
    const syncArticleFromHash = () => {
      const targetId = getArticleIdFromHash();
      if (targetId && articles.length > 0) {
        const found = articles.find(a => String(a.id) === String(targetId));
        if (found) {
          setActiveArticle(prev => {
            if (prev && String(prev.id) === String(found.id)) {
              return prev;
            }
            setLikesCount(typeof found.likes === 'number' ? found.likes : 0);
            setComments(Array.isArray(found.comments) ? found.comments : []);
            setIsLiked(localStorage.getItem(`bem_article_liked_${found.id}`) === 'true');
            setCommentSuccess(false);
            setShowShareModal(false);
            setCommentAuthor('');
            setCommentText('');
            return found;
          });
        }
      } else if (!targetId) {
        setActiveArticle(null);
      }
    };

    syncArticleFromHash();
    window.addEventListener('hashchange', syncArticleFromHash);
    return () => window.removeEventListener('hashchange', syncArticleFromHash);
  }, [articles]);

  // Sync likes and comments if db updates in real-time
  useEffect(() => {
    if (activeArticle && db?.articles) {
      const live = db.articles.find(a => String(a.id) === String(activeArticle.id));
      if (live) {
        setLikesCount(typeof live.likes === 'number' ? live.likes : 0);
        setComments(Array.isArray(live.comments) ? live.comments : []);
      }
    }
  }, [db?.articles, activeArticle?.id]);

  // Handle Like toggle
  const handleToggleLike = async () => {
    if (!activeArticle) return;
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    const newLikesCount = Math.max(0, likesCount + (nextLiked ? 1 : -1));
    setLikesCount(newLikesCount);

    // Save like status to device local storage
    if (nextLiked) {
      localStorage.setItem(`bem_article_liked_${activeArticle.id}`, 'true');
    } else {
      localStorage.removeItem(`bem_article_liked_${activeArticle.id}`);
    }

    try {
      await toggleArticleLike(activeArticle.id, nextLiked);
    } catch (err) {
      console.warn("Like update failed:", err);
    }
  };

  // Handle Share Click & dynamic article URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bem.ums.ac.id';
  const currentUrl = activeArticle 
    ? `${origin}/artikel?id=${activeArticle.id}` 
    : `${origin}/`;
  const shareTitle = activeArticle?.title || 'Artikel BEM UMS 2026';
  const shareText = `Baca "${shareTitle}" di Website Resmi BEM UMS:`;

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareText}\n${currentUrl}`,
          url: currentUrl,
        });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          setShowShareModal(prev => !prev);
        }
      }
    } else {
      setShowShareModal(prev => !prev);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Scroll and focus to comment input
  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 450);
  };

  // Handle Comment Submission
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim() || !activeArticle) return;

    setIsSubmittingComment(true);

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newComment = {
      id: Date.now().toString(),
      author: commentAuthor.trim(),
      text: commentText.trim(),
      timestamp: `${dateStr}, ${timeStr} WIB`,
      createdAt: Date.now()
    };

    // Update local state immediately for instant feedback
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    setCommentText('');
    setCommentSuccess(true);
    setIsSubmittingComment(false);

    setTimeout(() => {
      setCommentSuccess(false);
    }, 4000);

    // Save to Firestore
    try {
      await addArticleComment(activeArticle.id, newComment);
    } catch (err) {
      console.error("Gagal mengirim komentar:", err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-10 lg:px-20 text-white relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/20 to-transparent opacity-50 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {activeArticle ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-4xl mx-auto bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl mt-8"
        >
          {/* Header Image */}
          <div className="relative aspect-[21/9] bg-neutral-900 border-b border-neutral-800">
            {activeArticle.thumbnail ? (
              <img src={activeArticle.thumbnail} alt={activeArticle.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-800 bg-[#050505]">
                <span className="font-heading font-extrabold tracking-[0.2em] text-4xl opacity-20">KABINET KOLEKTIVA</span>
              </div>
            )}
            
            <button 
              onClick={handleBackToList}
              className="absolute top-6 left-6 z-10 px-4 py-2 bg-black/60 hover:bg-primary text-white rounded-full flex items-center gap-2 transition-all border border-neutral-700 hover:border-transparent backdrop-blur-md text-sm font-bold uppercase tracking-wider shadow-lg"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Kembali
            </button>
          </div>

          <div className="p-8 md:p-14">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <span className="bg-primary/15 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                {activeArticle.category}
              </span>
              <span className="text-neutral-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> {activeArticle.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold uppercase leading-tight text-white mb-10">
              {activeArticle.title}
            </h1>

            {/* Article Content */}
            <div className="prose prose-invert prose-p:font-body prose-p:text-neutral-300 prose-p:leading-relaxed max-w-none prose-lg">
              {activeArticle.content ? (
                <div dangerouslySetInnerHTML={{ __html: activeArticle.content }} />
              ) : (
                <p className="whitespace-pre-wrap">
                  {activeArticle.desc}
                </p>
              )}
            </div>

            {/* --- ACTION BAR: LIKE, COMMENT, SHARE --- */}
            <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* LIKE BUTTON */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleToggleLike}
                  className={`px-5 py-2.5 rounded-full flex items-center gap-2.5 font-body font-bold text-sm tracking-wider uppercase transition-all duration-300 border ${
                    isLiked
                      ? 'bg-rose-600/20 text-rose-400 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                      : 'bg-neutral-900/80 text-neutral-300 border-neutral-700 hover:border-rose-500/40 hover:text-rose-400 hover:bg-neutral-800'
                  }`}
                  title={isLiked ? "Batalkan Suka" : "Sukai Artikel ini"}
                >
                  <Heart className={`w-5 h-5 transition-transform duration-300 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                  <span>{likesCount} Suka</span>
                </motion.button>

                {/* COMMENT BUTTON */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToComments}
                  className="px-5 py-2.5 rounded-full flex items-center gap-2.5 font-body font-bold text-sm tracking-wider uppercase transition-all duration-300 border bg-neutral-900/80 text-neutral-300 border-neutral-700 hover:border-sky-500/40 hover:text-sky-400 hover:bg-neutral-800"
                  title="Lihat & Tulis Komentar"
                >
                  <MessageCircle className="w-5 h-5 text-sky-400" />
                  <span>{comments.length} Komentar</span>
                </motion.button>
              </div>

              {/* SHARE BUTTON */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShareClick}
                  className="px-5 py-2.5 rounded-full flex items-center gap-2.5 font-body font-bold text-sm tracking-wider uppercase transition-all duration-300 border bg-neutral-900/80 text-neutral-300 border-neutral-700 hover:border-primary/50 hover:text-primary hover:bg-neutral-800"
                  title="Bagikan Artikel"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Bagikan</span>
                </motion.button>

                {/* SHARE DROPDOWN / POPOVER */}
                <AnimatePresence>
                  {showShareModal && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 bottom-full mb-3 w-72 bg-[#121212]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl z-30 space-y-2.5"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-neutral-400">
                        <span>Bagikan Artikel</span>
                        <button 
                          onClick={() => setShowShareModal(false)}
                          className="text-neutral-400 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-1">
                        <button
                          onClick={handleCopyLink}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left flex items-center gap-3 text-sm text-neutral-200 transition-colors border border-white/5"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Tautan Berhasil Disalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-neutral-400" />
                              <span>Salin Tautan</span>
                            </>
                          )}
                        </button>

                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + currentUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-left flex items-center gap-3 text-sm text-[#25D366] transition-colors border border-[#25D366]/20 font-medium"
                        >
                          <span className="font-bold">WhatsApp</span>
                        </a>

                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-left flex items-center gap-3 text-sm text-neutral-200 transition-colors border border-white/5 font-medium"
                        >
                          <span className="font-bold">Twitter / X</span>
                        </a>

                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-left flex items-center gap-3 text-sm text-[#1877F2] transition-colors border border-[#1877F2]/20 font-medium"
                        >
                          <span className="font-bold">Facebook</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* --- KOMENTAR & DISKUSI SECTION --- */}
            <div ref={commentSectionRef} className="mt-14 pt-10 border-t border-white/10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl md:text-3xl font-heading font-extrabold uppercase text-white flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    Diskusi & Tanggapan
                  </h3>
                  <p className="text-sm text-neutral-400 font-body mt-1">
                    Suarakan pandangan kritis, opini mahasiswa, atau tanggapan Anda mengenai artikel ini.
                  </p>
                </div>
                <span className="self-start sm:self-auto px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest">
                  {comments.length} Tanggapan
                </span>
              </div>

              {/* Form Tambah Komentar */}
              <form onSubmit={handleSubmitComment} className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-primary" />
                    Nama / Inisial Mahasiswa
                  </label>
                  <input
                    ref={commentInputRef}
                    type="text"
                    required
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Contoh: Fulan (Mahasiswa UMS) atau Nama Anda"
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors text-sm font-body"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-primary" />
                    Tanggapan / Komentar
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Tuliskan gagasan, tanggapan, atau kritik yang membangun..."
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors text-sm font-body resize-y"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  {commentSuccess ? (
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
                      <Check className="w-4 h-4" /> Komentar Anda berhasil dipublikasikan!
                    </span>
                  ) : <div />}

                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentAuthor.trim() || !commentText.trim()}
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(185,0,20,0.3)] ml-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingComment ? 'Mengirim...' : 'Kirim Tanggapan'}</span>
                  </button>
                </div>
              </form>

              {/* Daftar Komentar */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl bg-neutral-900/30">
                    <MessageSquare className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                    <p className="text-neutral-400 font-body text-sm font-medium">
                      Belum ada komentar untuk artikel ini.
                    </p>
                    <p className="text-neutral-500 text-xs mt-1">
                      Jadilah pembaca pertama yang memberikan pandangan kritis dan gagasan solutif!
                    </p>
                  </div>
                ) : (
                  comments.map((c, idx) => (
                    <motion.div
                      key={c.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 md:p-6 bg-neutral-900/50 border border-white/5 rounded-2xl space-y-3 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-neutral-800 border border-primary/30 flex items-center justify-center text-white font-heading font-extrabold text-sm uppercase flex-shrink-0">
                            {c.author ? c.author.charAt(0) : 'U'}
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wide">
                              {c.author}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                              <Clock className="w-3 h-3 text-neutral-500" />
                              <span>{c.timestamp || 'Baru saja'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-neutral-300 font-body text-sm leading-relaxed whitespace-pre-wrap pl-12">
                        {c.text}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white drop-shadow-lg">
                Kabar <span className="text-primary">KOLEKTIVA</span>
              </h1>
              <p className="font-body text-neutral-400 mt-4 max-w-2xl text-lg md:text-xl">
                Kumpulan wawasan, kajian, opini mahasiswa, dan rilis gerakan resmi BEM UMS.
              </p>
            </div>
          </motion.div>

          {/* Filter Category Chips */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-6 py-2.5 font-body text-sm font-bold uppercase tracking-wider rounded-full border transition-all duration-300 ${
                  selectedCategory === c 
                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(185,0,20,0.4)]' 
                    : 'bg-transparent border-neutral-700 text-neutral-400 hover:border-primary hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>

          {/* Articles Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredArticles.length === 0 ? (
              <motion.div variants={itemVariants} className="col-span-full py-20 text-center">
                <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 inline-block">
                  <p className="text-neutral-400 font-body text-lg">Belum ada artikel yang dipublikasikan dalam kategori ini.</p>
                </div>
              </motion.div>
            ) : (
              filteredArticles.map(a => (
                <motion.article 
                  variants={itemVariants}
                  key={a.id} 
                  onClick={() => handleOpenArticle(a)}
                  className="group relative bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col h-full cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-10px_rgba(220,20,20,0.2)]"
                >
                  {/* Glow Effect */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700"></div>
                  
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden z-10">
                    {a.thumbnail ? (
                      <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700 bg-black/50">
                        <span className="font-heading font-bold tracking-widest text-xl opacity-30">KOLEKTIVA</span>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border border-primary/30">
                      {a.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
                    {/* Header meta: Date + Likes & Comments counters */}
                    <div className="flex items-center justify-between text-neutral-400 mb-4 text-xs font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{a.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <Heart className="w-3.5 h-3.5 text-rose-500/70" />
                          <span>{a.likes || 0}</span>
                        </span>
                        <span className="flex items-center gap-1 text-neutral-400">
                          <MessageCircle className="w-3.5 h-3.5 text-sky-400/70" />
                          <span>{(a.comments || []).length}</span>
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-heading font-extrabold uppercase leading-tight text-white mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {a.title}
                    </h3>
                    
                    <p className="font-body text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {a.desc}
                    </p>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenArticle(a);
                      }}
                      className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm group/btn mt-auto w-max"
                    >
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.article>
              ))
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}