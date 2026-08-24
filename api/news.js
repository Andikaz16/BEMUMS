export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const RSS_SOURCES = [
    { id: 'ums', name: 'UMS News', color: '#002660', url: 'https://news.ums.ac.id/id/feed/' },
    { id: 'cnn', name: 'CNN Indonesia', color: '#CC0000', url: 'https://www.cnnindonesia.com/nasional/rss' },
    { id: 'antara', name: 'Antara', color: '#E8B500', url: 'https://www.antaranews.com/rss/terkini' },
    { id: 'tempo', name: 'Tempo', color: '#1A56DB', url: 'https://rss.tempo.co/nasional' },
    { id: 'cnbc', name: 'CNBC Indonesia', color: '#005596', url: 'https://www.cnbcindonesia.com/news/rss' },
    { id: 'kumparan', name: 'Kumparan', color: '#00BFA5', url: 'https://lapi.kumparan.com/v2.0/rss' },
    { id: 'liputan6', name: 'Liputan6', color: '#E65100', url: 'https://feed.liputan6.com/rss/news' },
    { id: 'okezone', name: 'Okezone', color: '#1565C0', url: 'https://sindikasi.okezone.com/index.php/rss/0/RSS2.0' },
    { id: 'sindo', name: 'SindoNews', color: '#7B1FA2', url: 'https://sindonews.com/feed' },
  ];

  try {
    const allArticles = [];

    const results = await Promise.allSettled(
      RSS_SOURCES.map(async (source) => {
        try {
          const response = await fetch(source.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 BEM-UMS-News-Aggregator/1.0' }
          });
          if (!response.ok) return [];
          const xmlText = await response.text();
          return parseRSS(xmlText, source);
        } catch (err) {
          console.error(`Failed to fetch ${source.name}:`, err.message);
          return [];
        }
      })
    );

    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value) {
        allArticles.push(...r.value);
      }
    });

    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    return res.status(200).json({ 
      status: 'ok', 
      count: allArticles.length, 
      articles: allArticles 
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
}

function parseRSS(xmlText, source) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  let index = 0;

  while ((match = itemRegex.exec(xmlText)) !== null && index < 15) {
    const itemXml = match[1];

    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const descRaw = extractTag(itemXml, 'description');
    const description = descRaw.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').substring(0, 200);

    // Extract thumbnail
    let thumbnail = null;
    
    // Try enclosure
    const encMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i);
    if (encMatch) thumbnail = encMatch[1];
    
    // Try media:thumbnail
    if (!thumbnail) {
      const mediaThumbnail = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
      if (mediaThumbnail) thumbnail = mediaThumbnail[1];
    }

    // Try media:content
    if (!thumbnail) {
      const mediaContent = itemXml.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*type=["']image/i);
      if (mediaContent) thumbnail = mediaContent[1];
    }

    // Try img in description
    if (!thumbnail) {
      const imgMatch = descRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) thumbnail = imgMatch[1];
    }

    items.push({
      id: `${source.id}-${index}`,
      source: source.id,
      sourceName: source.name,
      sourceColor: source.color,
      title: cleanText(title),
      description: cleanText(description),
      link,
      thumbnail,
      pubDate: pubDate || new Date().toISOString(),
    });

    index++;
  }

  return items;
}

function extractTag(xml, tag) {
  // Try CDATA first
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Try normal tag
  const normalRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const normalMatch = xml.match(normalRegex);
  if (normalMatch) return normalMatch[1].trim();

  return '';
}

function cleanText(text) {
  return text
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}
