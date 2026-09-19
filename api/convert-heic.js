import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'imageBase64 is required' });
    }

    // Decode base64 HEIC to buffer
    const heicBuffer = Buffer.from(imageBase64, 'base64');

    // Convert HEIC to JPEG using sharp (uses libvips which supports HEIC natively)
    const jpegBuffer = await sharp(heicBuffer)
      .resize(1280, null, { withoutEnlargement: true, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const jpegBase64 = jpegBuffer.toString('base64');

    // Upload converted JPEG to Imgur
    const imgurRes = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 546c25a59c58ad7',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: jpegBase64, type: 'base64' }),
    });

    const imgurData = await imgurRes.json();

    if (imgurData.success) {
      return res.status(200).json({ success: true, link: imgurData.data.link });
    } else {
      return res.status(500).json({ success: false, error: imgurData.data?.error || 'Imgur rejected the image' });
    }
  } catch (err) {
    console.error('HEIC conversion error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
