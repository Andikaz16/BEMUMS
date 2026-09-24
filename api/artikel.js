export default async function handler(req, res) {
  const { id } = req.query;

  // If no article ID is provided, redirect to articles page
  if (!id) {
    return res.redirect(302, '/#artikel');
  }

  let article = null;

  // Try to fetch articles from Firestore REST API
  try {
    const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/web-bem-ums/databases/(default)/documents/cms/articles';
    const response = await fetch(firestoreUrl, {
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const json = await response.json();
      const rawValues = json?.fields?.data?.arrayValue?.values || [];
      for (const val of rawValues) {
        const fields = val?.mapValue?.fields || {};
        const itemId = fields.id?.stringValue || fields.id?.integerValue;
        if (String(itemId) === String(id)) {
          article = {
            id: itemId,
            title: fields.title?.stringValue || 'Artikel BEM UMS',
            desc: fields.desc?.stringValue || '',
            thumbnail: fields.thumbnail?.stringValue || '',
            date: fields.date?.stringValue || '',
            category: fields.category?.stringValue || 'Artikel'
          };
          break;
        }
      }
    }
  } catch (err) {
    console.error('Error fetching article from Firestore:', err);
  }

  // Fallback defaults if not found in Firestore
  if (!article) {
    const defaultArticles = [
      { id: '1', title: 'Revitalisasi Fasilitas Olahraga Kampus Terpadu', desc: 'BEM UMS bersama Rektorat menyepakati renovasi lapangan sepak bola dan gedung olahraga mulai September 2026.', thumbnail: '' },
      { id: '2', title: 'WAHAI ENGKAU YANG LALAI TERHADAP TUGASNYA', desc: 'Delapan puluh satu tahun sudah bendera merah putih berkibar sebagai simbol sebuah bangsa yang mengaku bebas dari penjajahan.', thumbnail: 'https://i.imgur.com/PxaTdjM.jpeg' },
      { id: '3', title: 'Diskusi Publik: Masa Depan Pendidikan Tinggi', desc: 'Menghadirkan tokoh nasional dalam mengupas arah kebijakan pendidikan pasca pergantian kurikulum nasional.', thumbnail: '' }
    ];
    article = defaultArticles.find(a => String(a.id) === String(id)) || {
      id: id,
      title: 'Artikel BEM UMS 2026',
      desc: 'Baca artikel resmi dari Badan Eksekutif Mahasiswa Universitas Muhammadiyah Surakarta.',
      thumbnail: ''
    };
  }

  const defaultOgImage = 'https://bem.ums.ac.id/assets/kolektiva_app_icon_512.png';
  let ogImage = article.thumbnail && article.thumbnail.trim() ? article.thumbnail.trim() : defaultOgImage;
  if (!ogImage.startsWith('http')) {
    ogImage = `https://bem.ums.ac.id${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  }

  const escapeHtml = (str = '') => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const safeTitle = escapeHtml(article.title);
  const safeDesc = escapeHtml(article.desc || 'Kumpulan wawasan, kajian, opini mahasiswa, dan rilis gerakan resmi BEM UMS.');
  const targetSpaUrl = `/#artikel?id=${encodeURIComponent(id)}`;

  // Return HTML with Open Graph meta tags and instant redirect to the React SPA article view
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle} — BEM UMS</title>
  <meta name="description" content="${safeDesc}" />

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="BEM UMS" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:url" content="https://bem.ums.ac.id/artikel?id=${id}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:secure_url" content="${ogImage}" />
  <meta property="og:image:alt" content="${safeTitle}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@bem_ums" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- Canonical & Favicon -->
  <link rel="canonical" href="https://bem.ums.ac.id/artikel?id=${id}" />
  <link rel="icon" type="image/png" href="/favicon.png" />

  <!-- Instant Browser Redirect to the SPA article view -->
  <script>
    window.location.replace("${targetSpaUrl}");
  </script>
  <meta http-equiv="refresh" content="0;url=${targetSpaUrl}" />
</head>
<body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;padding:20px;">
    <p style="font-size:16px;">Membuka artikel: <strong>${safeTitle}</strong>...</p>
    <p><a href="${targetSpaUrl}" style="color:#e00613;text-decoration:none;font-weight:bold;">Klik di sini jika tidak otomatis beralih</a></p>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).send(html);
}
