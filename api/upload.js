export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    
    // 1. Coba upload ke Imgur
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Client-ID 546c25a59c58ad7'
        },
        body: formData
      });

      const data = await response.json();

      if (data.success && data.data?.link) {
        return res.status(200).json({
          success: true,
          url: data.data.link
        });
      }
    } catch (imgurErr) {
      console.warn("Imgur upload failed, trying Catbox fallback:", imgurErr.message);
    }

    // 2. Fallback ke Catbox.moe jika Imgur over capacity
    try {
      const buffer = Buffer.from(image, 'base64');
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      const catboxForm = new FormData();
      catboxForm.append('reqtype', 'fileupload');
      catboxForm.append('fileToUpload', blob, 'upload_' + Date.now() + '.jpg');

      const catboxRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: catboxForm
      });

      const resultText = await catboxRes.text();
      if (resultText && resultText.startsWith('https://')) {
        return res.status(200).json({
          success: true,
          url: resultText.trim()
        });
      }
    } catch (catboxErr) {
      console.error("Catbox fallback failed:", catboxErr.message);
    }

    return res.status(500).json({
      success: false,
      error: 'Server upload (Imgur & Catbox) sedang sibuk. Silakan coba lagi.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}
