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
    
    // Construct FormData for Catbox
    const formData = new FormData();
    formData.append('image', image); // Imgur accepts base64 directly

    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 546c25a59c58ad7'
      },
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({
        success: true,
        url: data.data.link
      });
    } else {
      return res.status(400).json({
        success: false,
        error: data.data?.error || 'Imgur upload failed'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}
