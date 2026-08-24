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

    // Convert base64 to Blob
    const buffer = Buffer.from(image, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    
    // Construct FormData for Catbox
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', blob, 'upload_' + Date.now() + '.jpg');

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });

    const resultText = await response.text();

    if (resultText.startsWith('https://')) {
      return res.status(200).json({
        success: true,
        url: resultText
      });
    } else {
      return res.status(400).json({
        success: false,
        error: resultText || 'Catbox upload failed'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
}
