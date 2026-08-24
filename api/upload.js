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

    const formData = new FormData();
    formData.append('key', '6d207e02198a847aa98d0a2a901485a5');
    formData.append('source', image);
    formData.append('format', 'json');

    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.status_code === 200) {
      return res.status(200).json({
        success: true,
        url: data.image.url,
        thumb: data.image.thumb?.url || data.image.url,
        display_url: data.image.display_url
      });
    } else {
      return res.status(400).json({
        success: false,
        error: data.error?.message || 'Upload failed'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}
