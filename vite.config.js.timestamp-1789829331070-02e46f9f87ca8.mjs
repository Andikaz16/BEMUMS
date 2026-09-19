// vite.config.js
import { defineConfig } from "file:///C:/Users/andik/OneDrive/Documents/TEKNIK%20INFORMATIKA/Project/WEB%20BEM/webBemUms-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/andik/OneDrive/Documents/TEKNIK%20INFORMATIKA/Project/WEB%20BEM/webBemUms-main/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///C:/Users/andik/OneDrive/Documents/TEKNIK%20INFORMATIKA/Project/WEB%20BEM/webBemUms-main/node_modules/@tailwindcss/vite/dist/index.mjs";

// api/news.js
async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  const RSS_SOURCES = [
    { id: "ums", name: "UMS News", color: "#002660", url: "https://news.ums.ac.id/id/feed/" },
    { id: "cnn", name: "CNN Indonesia", color: "#CC0000", url: "https://www.cnnindonesia.com/nasional/rss" },
    { id: "antara", name: "Antara", color: "#E8B500", url: "https://www.antaranews.com/rss/terkini" },
    { id: "tempo", name: "Tempo", color: "#1A56DB", url: "https://rss.tempo.co/nasional" },
    { id: "cnbc", name: "CNBC Indonesia", color: "#005596", url: "https://www.cnbcindonesia.com/news/rss" },
    { id: "kumparan", name: "Kumparan", color: "#00BFA5", url: "https://lapi.kumparan.com/v2.0/rss" },
    { id: "liputan6", name: "Liputan6", color: "#E65100", url: "https://feed.liputan6.com/rss/news" },
    { id: "okezone", name: "Okezone", color: "#1565C0", url: "https://sindikasi.okezone.com/index.php/rss/0/RSS2.0" },
    { id: "sindo", name: "SindoNews", color: "#7B1FA2", url: "https://sindonews.com/feed" }
  ];
  try {
    const allArticles = [];
    const fetchTasks = [
      ...RSS_SOURCES.map(async (source) => {
        try {
          const response = await fetch(source.url, {
            headers: { "User-Agent": "Mozilla/5.0 BEM-UMS-News-Aggregator/1.0" }
          });
          if (!response.ok) return [];
          const xmlText = await response.text();
          return parseRSS(xmlText, source);
        } catch (err) {
          console.error(`Failed to fetch ${source.name}:`, err.message);
          return [];
        }
      }),
      fetchLensaMu(),
      fetchSuaraMuhammadiyah()
    ];
    const results = await Promise.allSettled(fetchTasks);
    results.forEach((r) => {
      if (r.status === "fulfilled" && r.value) {
        allArticles.push(...r.value);
      }
    });
    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    return res.status(200).json({
      status: "ok",
      count: allArticles.length,
      articles: allArticles
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
}
async function fetchLensaMu() {
  const source = { id: "lensamu", name: "LensaMu", color: "#007A3D" };
  try {
    const response = await fetch("https://muhammadiyah.or.id/wp-json/wp/v2/posts?_embed&per_page=15", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!response.ok) return [];
    const posts = await response.json();
    return posts.map((post, idx) => {
      let thumbnail = null;
      const embedded = post._embedded || {};
      const media = embedded["wp:featuredmedia"] || [];
      if (media.length > 0) {
        const mediaObj = media[0];
        const sizes = mediaObj.media_details?.sizes || {};
        thumbnail = sizes.medium_large?.source_url || sizes.medium?.source_url || sizes.full?.source_url || mediaObj.source_url;
      }
      const rawExcerpt = post.excerpt?.rendered || post.content?.rendered || "";
      const description = cleanText(rawExcerpt).substring(0, 200);
      return {
        id: `${source.id}-${idx}`,
        source: source.id,
        sourceName: source.name,
        sourceColor: source.color,
        title: cleanText(post.title?.rendered || ""),
        description,
        link: post.link,
        thumbnail,
        pubDate: post.date ? new Date(post.date).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
      };
    });
  } catch (err) {
    console.error("Failed to fetch LensaMu:", err.message);
    return [];
  }
}
async function fetchSuaraMuhammadiyah() {
  const source = { id: "suara_muhammadiyah", name: "Suara Muhammadiyah", color: "#b90014" };
  try {
    const response = await fetch("https://suaramuhammadiyah.id/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!response.ok) return [];
    const html = await response.text();
    const regex = /<a href="(\/read\/[^"]+)"[^>]*class="[^"]*news-list-item[^"]*">([\s\S]*?)<\/a>/gi;
    let match;
    const items = [];
    let index = 0;
    while ((match = regex.exec(html)) !== null && index < 15) {
      const link = "https://suaramuhammadiyah.id" + match[1];
      const inner = match[2];
      const tMatch = inner.match(/<h6[^>]*class="news-list-title"[^>]*>([\s\S]*?)<\/h6>/i);
      const dMatch = inner.match(/<span[^>]*class="news-list-date"[^>]*>([\s\S]*?)<\/span>/i);
      const iMatch = inner.match(/<img[^>]+src="([^"]+)"/i);
      const title = tMatch ? tMatch[1].trim() : "";
      const dateRaw = dMatch ? dMatch[1].trim() : "";
      const thumbnail = iMatch ? iMatch[1] : null;
      let pubDate = (/* @__PURE__ */ new Date()).toISOString();
      if (dateRaw) {
        try {
          pubDate = new Date(dateRaw).toISOString();
        } catch (e) {
        }
      }
      items.push({
        id: `${source.id}-${index}`,
        source: source.id,
        sourceName: source.name,
        sourceColor: source.color,
        title: cleanText(title),
        description: "Membaca kajian Islami dan kabar terkini persyarikatan dari portal resmi Suara Muhammadiyah.",
        link,
        thumbnail,
        pubDate
      });
      index++;
    }
    return items;
  } catch (err) {
    console.error("Failed to fetch Suara Muhammadiyah:", err.message);
    return [];
  }
}
function parseRSS(xmlText, source) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  let index = 0;
  while ((match = itemRegex.exec(xmlText)) !== null && index < 15) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const pubDate = extractTag(itemXml, "pubDate");
    const descRaw = extractTag(itemXml, "description");
    const contentRaw = extractTag(itemXml, "content:encoded");
    const description = descRaw.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").substring(0, 200);
    let thumbnail = null;
    const imgTag = extractTag(itemXml, "img");
    if (imgTag && imgTag.startsWith("http")) {
      thumbnail = imgTag;
    }
    if (!thumbnail) {
      const encMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i);
      if (encMatch) thumbnail = encMatch[1];
    }
    if (!thumbnail) {
      const mediaThumbnail = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
      if (mediaThumbnail) thumbnail = mediaThumbnail[1];
    }
    if (!thumbnail) {
      const mediaContent = itemXml.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*type=["']image/i);
      if (mediaContent) thumbnail = mediaContent[1];
    }
    if (!thumbnail) {
      const imgMatch = descRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) thumbnail = imgMatch[1];
    }
    if (!thumbnail && contentRaw) {
      const imgMatch = contentRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
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
      pubDate: pubDate || (/* @__PURE__ */ new Date()).toISOString()
    });
    index++;
  }
  return items;
}
function extractTag(xml, tag) {
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();
  const normalRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const normalMatch = xml.match(normalRegex);
  if (normalMatch) return normalMatch[1].trim();
  return "";
}
function cleanText(text) {
  return text.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").trim();
}

// vite.config.js
var localApiProxy = () => ({
  name: "local-api-proxy",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === "/api/news" && req.method === "GET") {
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
          return res;
        };
        try {
          await handler(req, res);
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: "error", message: e.message }));
        }
        return;
      }
      if (req.url === "/api/upload" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => body += chunk.toString());
        req.on("end", async () => {
          try {
            const parsed = JSON.parse(body);
            const buffer = Buffer.from(parsed.image, "base64");
            const blob = new Blob([buffer], { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("reqtype", "fileupload");
            formData.append("fileToUpload", blob, "upload_" + Date.now() + ".jpg");
            const proxyRes = await fetch("https://catbox.moe/user/api.php", {
              method: "POST",
              body: formData
            });
            const resultText = await proxyRes.text();
            res.setHeader("Content-Type", "application/json");
            if (resultText.startsWith("https://")) {
              res.end(JSON.stringify({ success: true, url: resultText }));
            } else {
              res.end(JSON.stringify({ success: false, error: "Catbox upload failed" }));
            }
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});
var vite_config_default = defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), localApiProxy()],
  build: {
    chunkSizeWarningLimit: 1600
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiYXBpL25ld3MuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbmRpa1xcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcVEVLTklLIElORk9STUFUSUtBXFxcXFByb2plY3RcXFxcV0VCIEJFTVxcXFx3ZWJCZW1VbXMtbWFpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW5kaWtcXFxcT25lRHJpdmVcXFxcRG9jdW1lbnRzXFxcXFRFS05JSyBJTkZPUk1BVElLQVxcXFxQcm9qZWN0XFxcXFdFQiBCRU1cXFxcd2ViQmVtVW1zLW1haW5cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FuZGlrL09uZURyaXZlL0RvY3VtZW50cy9URUtOSUslMjBJTkZPUk1BVElLQS9Qcm9qZWN0L1dFQiUyMEJFTS93ZWJCZW1VbXMtbWFpbi92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnXG5cbmltcG9ydCBuZXdzSGFuZGxlciBmcm9tICcuL2FwaS9uZXdzLmpzJ1xuXG4vLyBWaXRlIHBsdWdpbiB0byBtb2NrIFZlcmNlbCBzZXJ2ZXJsZXNzIGZ1bmN0aW9uIC9hcGkvdXBsb2FkIGFuZCAvYXBpL25ld3MgZHVyaW5nIGxvY2FsIGRldmVsb3BtZW50XG5jb25zdCBsb2NhbEFwaVByb3h5ID0gKCkgPT4gKHtcbiAgbmFtZTogJ2xvY2FsLWFwaS1wcm94eScsXG4gIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgaWYgKHJlcS51cmwgPT09ICcvYXBpL25ld3MnICYmIHJlcS5tZXRob2QgPT09ICdHRVQnKSB7XG4gICAgICAgIHJlcy5zdGF0dXMgPSAoY29kZSkgPT4geyByZXMuc3RhdHVzQ29kZSA9IGNvZGU7IHJldHVybiByZXM7IH07XG4gICAgICAgIHJlcy5qc29uID0gKGRhdGEpID0+IHtcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgbmV3c0hhbmRsZXIocmVxLCByZXMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN0YXR1czogJ2Vycm9yJywgbWVzc2FnZTogZS5tZXNzYWdlIH0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXEudXJsID09PSAnL2FwaS91cGxvYWQnICYmIHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICByZXEub24oJ2RhdGEnLCBjaHVuayA9PiBib2R5ICs9IGNodW5rLnRvU3RyaW5nKCkpO1xuICAgICAgICByZXEub24oJ2VuZCcsIGFzeW5jICgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICAgIC8vIENhdGJveC5tb2UgcmVxdWlyZXMgbXVsdGlwYXJ0L2Zvcm0tZGF0YVxuICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20ocGFyc2VkLmltYWdlLCAnYmFzZTY0Jyk7XG4gICAgICAgICAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoW2J1ZmZlcl0sIHsgdHlwZTogJ2ltYWdlL2pwZWcnIH0pO1xuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCgncmVxdHlwZScsICdmaWxldXBsb2FkJyk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGVUb1VwbG9hZCcsIGJsb2IsICd1cGxvYWRfJyArIERhdGUubm93KCkgKyAnLmpwZycpO1xuXG4gICAgICAgICAgICBjb25zdCBwcm94eVJlcyA9IGF3YWl0IGZldGNoKCdodHRwczovL2NhdGJveC5tb2UvdXNlci9hcGkucGhwJywge1xuICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgYm9keTogZm9ybURhdGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCByZXN1bHRUZXh0ID0gYXdhaXQgcHJveHlSZXMudGV4dCgpO1xuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHJlc3VsdFRleHQuc3RhcnRzV2l0aCgnaHR0cHM6Ly8nKSkge1xuICAgICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogdHJ1ZSwgdXJsOiByZXN1bHRUZXh0IH0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdDYXRib3ggdXBsb2FkIGZhaWxlZCcgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXNDb2RlID0gNTAwO1xuICAgICAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogZS5tZXNzYWdlIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogJy4vJyxcbiAgcGx1Z2luczogW3JlYWN0KCksIHRhaWx3aW5kY3NzKCksIGxvY2FsQXBpUHJveHkoKV0sXG4gIGJ1aWxkOiB7XG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNjAwLFxuICB9XG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbmRpa1xcXFxPbmVEcml2ZVxcXFxEb2N1bWVudHNcXFxcVEVLTklLIElORk9STUFUSUtBXFxcXFByb2plY3RcXFxcV0VCIEJFTVxcXFx3ZWJCZW1VbXMtbWFpblxcXFxhcGlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFuZGlrXFxcXE9uZURyaXZlXFxcXERvY3VtZW50c1xcXFxURUtOSUsgSU5GT1JNQVRJS0FcXFxcUHJvamVjdFxcXFxXRUIgQkVNXFxcXHdlYkJlbVVtcy1tYWluXFxcXGFwaVxcXFxuZXdzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbmRpay9PbmVEcml2ZS9Eb2N1bWVudHMvVEVLTklLJTIwSU5GT1JNQVRJS0EvUHJvamVjdC9XRUIlMjBCRU0vd2ViQmVtVW1zLW1haW4vYXBpL25ld3MuanNcIjtleHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gIC8vIFNldCBDT1JTIGhlYWRlcnNcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKTtcbiAgcmVzLnNldEhlYWRlcignQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcycsICdHRVQnKTtcbiAgcmVzLnNldEhlYWRlcignQ2FjaGUtQ29udHJvbCcsICdzLW1heGFnZT0zMDAsIHN0YWxlLXdoaWxlLXJldmFsaWRhdGU9NjAwJyk7XG5cbiAgY29uc3QgUlNTX1NPVVJDRVMgPSBbXG4gICAgeyBpZDogJ3VtcycsIG5hbWU6ICdVTVMgTmV3cycsIGNvbG9yOiAnIzAwMjY2MCcsIHVybDogJ2h0dHBzOi8vbmV3cy51bXMuYWMuaWQvaWQvZmVlZC8nIH0sXG4gICAgeyBpZDogJ2NubicsIG5hbWU6ICdDTk4gSW5kb25lc2lhJywgY29sb3I6ICcjQ0MwMDAwJywgdXJsOiAnaHR0cHM6Ly93d3cuY25uaW5kb25lc2lhLmNvbS9uYXNpb25hbC9yc3MnIH0sXG4gICAgeyBpZDogJ2FudGFyYScsIG5hbWU6ICdBbnRhcmEnLCBjb2xvcjogJyNFOEI1MDAnLCB1cmw6ICdodHRwczovL3d3dy5hbnRhcmFuZXdzLmNvbS9yc3MvdGVya2luaScgfSxcbiAgICB7IGlkOiAndGVtcG8nLCBuYW1lOiAnVGVtcG8nLCBjb2xvcjogJyMxQTU2REInLCB1cmw6ICdodHRwczovL3Jzcy50ZW1wby5jby9uYXNpb25hbCcgfSxcbiAgICB7IGlkOiAnY25iYycsIG5hbWU6ICdDTkJDIEluZG9uZXNpYScsIGNvbG9yOiAnIzAwNTU5NicsIHVybDogJ2h0dHBzOi8vd3d3LmNuYmNpbmRvbmVzaWEuY29tL25ld3MvcnNzJyB9LFxuICAgIHsgaWQ6ICdrdW1wYXJhbicsIG5hbWU6ICdLdW1wYXJhbicsIGNvbG9yOiAnIzAwQkZBNScsIHVybDogJ2h0dHBzOi8vbGFwaS5rdW1wYXJhbi5jb20vdjIuMC9yc3MnIH0sXG4gICAgeyBpZDogJ2xpcHV0YW42JywgbmFtZTogJ0xpcHV0YW42JywgY29sb3I6ICcjRTY1MTAwJywgdXJsOiAnaHR0cHM6Ly9mZWVkLmxpcHV0YW42LmNvbS9yc3MvbmV3cycgfSxcbiAgICB7IGlkOiAnb2tlem9uZScsIG5hbWU6ICdPa2V6b25lJywgY29sb3I6ICcjMTU2NUMwJywgdXJsOiAnaHR0cHM6Ly9zaW5kaWthc2kub2tlem9uZS5jb20vaW5kZXgucGhwL3Jzcy8wL1JTUzIuMCcgfSxcbiAgICB7IGlkOiAnc2luZG8nLCBuYW1lOiAnU2luZG9OZXdzJywgY29sb3I6ICcjN0IxRkEyJywgdXJsOiAnaHR0cHM6Ly9zaW5kb25ld3MuY29tL2ZlZWQnIH0sXG4gIF07XG5cbiAgdHJ5IHtcbiAgICBjb25zdCBhbGxBcnRpY2xlcyA9IFtdO1xuXG4gICAgY29uc3QgZmV0Y2hUYXNrcyA9IFtcbiAgICAgIC4uLlJTU19TT1VSQ0VTLm1hcChhc3luYyAoc291cmNlKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChzb3VyY2UudXJsLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdVc2VyLUFnZW50JzogJ01vemlsbGEvNS4wIEJFTS1VTVMtTmV3cy1BZ2dyZWdhdG9yLzEuMCcgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHJldHVybiBbXTtcbiAgICAgICAgICBjb25zdCB4bWxUZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICAgIHJldHVybiBwYXJzZVJTUyh4bWxUZXh0LCBzb3VyY2UpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWQgdG8gZmV0Y2ggJHtzb3VyY2UubmFtZX06YCwgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBmZXRjaExlbnNhTXUoKSxcbiAgICAgIGZldGNoU3VhcmFNdWhhbW1hZGl5YWgoKVxuICAgIF07XG5cbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGxTZXR0bGVkKGZldGNoVGFza3MpO1xuXG4gICAgcmVzdWx0cy5mb3JFYWNoKHIgPT4ge1xuICAgICAgaWYgKHIuc3RhdHVzID09PSAnZnVsZmlsbGVkJyAmJiByLnZhbHVlKSB7XG4gICAgICAgIGFsbEFydGljbGVzLnB1c2goLi4uci52YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhbGxBcnRpY2xlcy5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShiLnB1YkRhdGUpIC0gbmV3IERhdGUoYS5wdWJEYXRlKSk7XG5cbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oeyBcbiAgICAgIHN0YXR1czogJ29rJywgXG4gICAgICBjb3VudDogYWxsQXJ0aWNsZXMubGVuZ3RoLCBcbiAgICAgIGFydGljbGVzOiBhbGxBcnRpY2xlcyBcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgc3RhdHVzOiAnZXJyb3InLCBtZXNzYWdlOiBlcnIubWVzc2FnZSB9KTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBmZXRjaExlbnNhTXUoKSB7XG4gIGNvbnN0IHNvdXJjZSA9IHsgaWQ6ICdsZW5zYW11JywgbmFtZTogJ0xlbnNhTXUnLCBjb2xvcjogJyMwMDdBM0QnIH07XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9tdWhhbW1hZGl5YWgub3IuaWQvd3AtanNvbi93cC92Mi9wb3N0cz9fZW1iZWQmcGVyX3BhZ2U9MTUnLCB7XG4gICAgICBoZWFkZXJzOiB7IFxuICAgICAgICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTIwLjAuMC4wIFNhZmFyaS81MzcuMzYnIFxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghcmVzcG9uc2Uub2spIHJldHVybiBbXTtcbiAgICBjb25zdCBwb3N0cyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIHJldHVybiBwb3N0cy5tYXAoKHBvc3QsIGlkeCkgPT4ge1xuICAgICAgbGV0IHRodW1ibmFpbCA9IG51bGw7XG4gICAgICBjb25zdCBlbWJlZGRlZCA9IHBvc3QuX2VtYmVkZGVkIHx8IHt9O1xuICAgICAgY29uc3QgbWVkaWEgPSBlbWJlZGRlZFsnd3A6ZmVhdHVyZWRtZWRpYSddIHx8IFtdO1xuICAgICAgaWYgKG1lZGlhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgbWVkaWFPYmogPSBtZWRpYVswXTtcbiAgICAgICAgY29uc3Qgc2l6ZXMgPSBtZWRpYU9iai5tZWRpYV9kZXRhaWxzPy5zaXplcyB8fCB7fTtcbiAgICAgICAgdGh1bWJuYWlsID0gc2l6ZXMubWVkaXVtX2xhcmdlPy5zb3VyY2VfdXJsIHx8IHNpemVzLm1lZGl1bT8uc291cmNlX3VybCB8fCBzaXplcy5mdWxsPy5zb3VyY2VfdXJsIHx8IG1lZGlhT2JqLnNvdXJjZV91cmw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJhd0V4Y2VycHQgPSBwb3N0LmV4Y2VycHQ/LnJlbmRlcmVkIHx8IHBvc3QuY29udGVudD8ucmVuZGVyZWQgfHwgJyc7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNsZWFuVGV4dChyYXdFeGNlcnB0KS5zdWJzdHJpbmcoMCwgMjAwKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGAke3NvdXJjZS5pZH0tJHtpZHh9YCxcbiAgICAgICAgc291cmNlOiBzb3VyY2UuaWQsXG4gICAgICAgIHNvdXJjZU5hbWU6IHNvdXJjZS5uYW1lLFxuICAgICAgICBzb3VyY2VDb2xvcjogc291cmNlLmNvbG9yLFxuICAgICAgICB0aXRsZTogY2xlYW5UZXh0KHBvc3QudGl0bGU/LnJlbmRlcmVkIHx8ICcnKSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIGxpbms6IHBvc3QubGluayxcbiAgICAgICAgdGh1bWJuYWlsLFxuICAgICAgICBwdWJEYXRlOiBwb3N0LmRhdGUgPyBuZXcgRGF0ZShwb3N0LmRhdGUpLnRvSVNPU3RyaW5nKCkgOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgICAgIH07XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCBMZW5zYU11OicsIGVyci5tZXNzYWdlKTtcbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hTdWFyYU11aGFtbWFkaXlhaCgpIHtcbiAgY29uc3Qgc291cmNlID0geyBpZDogJ3N1YXJhX211aGFtbWFkaXlhaCcsIG5hbWU6ICdTdWFyYSBNdWhhbW1hZGl5YWgnLCBjb2xvcjogJyNiOTAwMTQnIH07XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9zdWFyYW11aGFtbWFkaXlhaC5pZC8nLCB7XG4gICAgICBoZWFkZXJzOiB7IFxuICAgICAgICAnVXNlci1BZ2VudCc6ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTIwLjAuMC4wIFNhZmFyaS81MzcuMzYnIFxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghcmVzcG9uc2Uub2spIHJldHVybiBbXTtcbiAgICBjb25zdCBodG1sID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xuXG4gICAgY29uc3QgcmVnZXggPSAvPGEgaHJlZj1cIihcXC9yZWFkXFwvW15cIl0rKVwiW14+XSpjbGFzcz1cIlteXCJdKm5ld3MtbGlzdC1pdGVtW15cIl0qXCI+KFtcXHNcXFNdKj8pPFxcL2E+L2dpO1xuICAgIGxldCBtYXRjaDtcbiAgICBjb25zdCBpdGVtcyA9IFtdO1xuICAgIGxldCBpbmRleCA9IDA7XG5cbiAgICB3aGlsZSAoKG1hdGNoID0gcmVnZXguZXhlYyhodG1sKSkgIT09IG51bGwgJiYgaW5kZXggPCAxNSkge1xuICAgICAgY29uc3QgbGluayA9ICdodHRwczovL3N1YXJhbXVoYW1tYWRpeWFoLmlkJyArIG1hdGNoWzFdO1xuICAgICAgY29uc3QgaW5uZXIgPSBtYXRjaFsyXTtcbiAgICAgIFxuICAgICAgY29uc3QgdE1hdGNoID0gaW5uZXIubWF0Y2goLzxoNltePl0qY2xhc3M9XCJuZXdzLWxpc3QtdGl0bGVcIltePl0qPihbXFxzXFxTXSo/KTxcXC9oNj4vaSk7XG4gICAgICBjb25zdCBkTWF0Y2ggPSBpbm5lci5tYXRjaCgvPHNwYW5bXj5dKmNsYXNzPVwibmV3cy1saXN0LWRhdGVcIltePl0qPihbXFxzXFxTXSo/KTxcXC9zcGFuPi9pKTtcbiAgICAgIGNvbnN0IGlNYXRjaCA9IGlubmVyLm1hdGNoKC88aW1nW14+XStzcmM9XCIoW15cIl0rKVwiL2kpO1xuICAgICAgXG4gICAgICBjb25zdCB0aXRsZSA9IHRNYXRjaCA/IHRNYXRjaFsxXS50cmltKCkgOiAnJztcbiAgICAgIGNvbnN0IGRhdGVSYXcgPSBkTWF0Y2ggPyBkTWF0Y2hbMV0udHJpbSgpIDogJyc7XG4gICAgICBjb25zdCB0aHVtYm5haWwgPSBpTWF0Y2ggPyBpTWF0Y2hbMV0gOiBudWxsO1xuXG4gICAgICBsZXQgcHViRGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgIGlmIChkYXRlUmF3KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcHViRGF0ZSA9IG5ldyBEYXRlKGRhdGVSYXcpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG5cbiAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICBpZDogYCR7c291cmNlLmlkfS0ke2luZGV4fWAsXG4gICAgICAgIHNvdXJjZTogc291cmNlLmlkLFxuICAgICAgICBzb3VyY2VOYW1lOiBzb3VyY2UubmFtZSxcbiAgICAgICAgc291cmNlQ29sb3I6IHNvdXJjZS5jb2xvcixcbiAgICAgICAgdGl0bGU6IGNsZWFuVGV4dCh0aXRsZSksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnTWVtYmFjYSBrYWppYW4gSXNsYW1pIGRhbiBrYWJhciB0ZXJraW5pIHBlcnN5YXJpa2F0YW4gZGFyaSBwb3J0YWwgcmVzbWkgU3VhcmEgTXVoYW1tYWRpeWFoLicsXG4gICAgICAgIGxpbmssXG4gICAgICAgIHRodW1ibmFpbCxcbiAgICAgICAgcHViRGF0ZVxuICAgICAgfSk7XG5cbiAgICAgIGluZGV4Kys7XG4gICAgfVxuICAgIHJldHVybiBpdGVtcztcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGZldGNoIFN1YXJhIE11aGFtbWFkaXlhaDonLCBlcnIubWVzc2FnZSk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlUlNTKHhtbFRleHQsIHNvdXJjZSkge1xuICBjb25zdCBpdGVtcyA9IFtdO1xuICBjb25zdCBpdGVtUmVnZXggPSAvPGl0ZW0+KFtcXHNcXFNdKj8pPFxcL2l0ZW0+L2dpO1xuICBsZXQgbWF0Y2g7XG4gIGxldCBpbmRleCA9IDA7XG5cbiAgd2hpbGUgKChtYXRjaCA9IGl0ZW1SZWdleC5leGVjKHhtbFRleHQpKSAhPT0gbnVsbCAmJiBpbmRleCA8IDE1KSB7XG4gICAgY29uc3QgaXRlbVhtbCA9IG1hdGNoWzFdO1xuXG4gICAgY29uc3QgdGl0bGUgPSBleHRyYWN0VGFnKGl0ZW1YbWwsICd0aXRsZScpO1xuICAgIGNvbnN0IGxpbmsgPSBleHRyYWN0VGFnKGl0ZW1YbWwsICdsaW5rJyk7XG4gICAgY29uc3QgcHViRGF0ZSA9IGV4dHJhY3RUYWcoaXRlbVhtbCwgJ3B1YkRhdGUnKTtcbiAgICBjb25zdCBkZXNjUmF3ID0gZXh0cmFjdFRhZyhpdGVtWG1sLCAnZGVzY3JpcHRpb24nKTtcbiAgICBjb25zdCBjb250ZW50UmF3ID0gZXh0cmFjdFRhZyhpdGVtWG1sLCAnY29udGVudDplbmNvZGVkJyk7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBkZXNjUmF3LnJlcGxhY2UoLzxbXj5dKj4vZywgJycpLnJlcGxhY2UoLyZbYS16XSs7L2dpLCAnICcpLnN1YnN0cmluZygwLCAyMDApO1xuXG4gICAgLy8gRXh0cmFjdCB0aHVtYm5haWxcbiAgICBsZXQgdGh1bWJuYWlsID0gbnVsbDtcbiAgICBcbiAgICAvLyBUcnkgY3VzdG9tIDxpbWc+IHRhZyAoZS5nLiBUZW1wby5jbylcbiAgICBjb25zdCBpbWdUYWcgPSBleHRyYWN0VGFnKGl0ZW1YbWwsICdpbWcnKTtcbiAgICBpZiAoaW1nVGFnICYmIGltZ1RhZy5zdGFydHNXaXRoKCdodHRwJykpIHtcbiAgICAgIHRodW1ibmFpbCA9IGltZ1RhZztcbiAgICB9XG4gICAgXG4gICAgLy8gVHJ5IGVuY2xvc3VyZVxuICAgIGlmICghdGh1bWJuYWlsKSB7XG4gICAgICBjb25zdCBlbmNNYXRjaCA9IGl0ZW1YbWwubWF0Y2goLzxlbmNsb3N1cmVbXj5dK3VybD1bXCInXShbXlwiJ10rKVtcIiddW14+XSp0eXBlPVtcIiddaW1hZ2UvaSk7XG4gICAgICBpZiAoZW5jTWF0Y2gpIHRodW1ibmFpbCA9IGVuY01hdGNoWzFdO1xuICAgIH1cbiAgICBcbiAgICAvLyBUcnkgbWVkaWE6dGh1bWJuYWlsXG4gICAgaWYgKCF0aHVtYm5haWwpIHtcbiAgICAgIGNvbnN0IG1lZGlhVGh1bWJuYWlsID0gaXRlbVhtbC5tYXRjaCgvPG1lZGlhOnRodW1ibmFpbFtePl0rdXJsPVtcIiddKFteXCInXSspW1wiJ10vaSk7XG4gICAgICBpZiAobWVkaWFUaHVtYm5haWwpIHRodW1ibmFpbCA9IG1lZGlhVGh1bWJuYWlsWzFdO1xuICAgIH1cblxuICAgIC8vIFRyeSBtZWRpYTpjb250ZW50XG4gICAgaWYgKCF0aHVtYm5haWwpIHtcbiAgICAgIGNvbnN0IG1lZGlhQ29udGVudCA9IGl0ZW1YbWwubWF0Y2goLzxtZWRpYTpjb250ZW50W14+XSt1cmw9W1wiJ10oW15cIiddKylbXCInXVtePl0qdHlwZT1bXCInXWltYWdlL2kpO1xuICAgICAgaWYgKG1lZGlhQ29udGVudCkgdGh1bWJuYWlsID0gbWVkaWFDb250ZW50WzFdO1xuICAgIH1cblxuICAgIC8vIFRyeSBpbWcgaW4gZGVzY3JpcHRpb25cbiAgICBpZiAoIXRodW1ibmFpbCkge1xuICAgICAgY29uc3QgaW1nTWF0Y2ggPSBkZXNjUmF3Lm1hdGNoKC88aW1nW14+XStzcmM9W1wiJ10oW15cIiddKylbXCInXS9pKTtcbiAgICAgIGlmIChpbWdNYXRjaCkgdGh1bWJuYWlsID0gaW1nTWF0Y2hbMV07XG4gICAgfVxuICAgIFxuICAgIC8vIFRyeSBpbWcgaW4gY29udGVudDplbmNvZGVkXG4gICAgaWYgKCF0aHVtYm5haWwgJiYgY29udGVudFJhdykge1xuICAgICAgY29uc3QgaW1nTWF0Y2ggPSBjb250ZW50UmF3Lm1hdGNoKC88aW1nW14+XStzcmM9W1wiJ10oW15cIiddKylbXCInXS9pKTtcbiAgICAgIGlmIChpbWdNYXRjaCkgdGh1bWJuYWlsID0gaW1nTWF0Y2hbMV07XG4gICAgfVxuXG4gICAgaXRlbXMucHVzaCh7XG4gICAgICBpZDogYCR7c291cmNlLmlkfS0ke2luZGV4fWAsXG4gICAgICBzb3VyY2U6IHNvdXJjZS5pZCxcbiAgICAgIHNvdXJjZU5hbWU6IHNvdXJjZS5uYW1lLFxuICAgICAgc291cmNlQ29sb3I6IHNvdXJjZS5jb2xvcixcbiAgICAgIHRpdGxlOiBjbGVhblRleHQodGl0bGUpLFxuICAgICAgZGVzY3JpcHRpb246IGNsZWFuVGV4dChkZXNjcmlwdGlvbiksXG4gICAgICBsaW5rLFxuICAgICAgdGh1bWJuYWlsLFxuICAgICAgcHViRGF0ZTogcHViRGF0ZSB8fCBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgfSk7XG5cbiAgICBpbmRleCsrO1xuICB9XG5cbiAgcmV0dXJuIGl0ZW1zO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0VGFnKHhtbCwgdGFnKSB7XG4gIC8vIFRyeSBDREFUQSBmaXJzdFxuICBjb25zdCBjZGF0YVJlZ2V4ID0gbmV3IFJlZ0V4cChgPCR7dGFnfVtePl0qPlxcXFxzKjwhXFxcXFtDREFUQVxcXFxbKFtcXFxcc1xcXFxTXSo/KVxcXFxdXFxcXF0+XFxcXHMqPC8ke3RhZ30+YCwgJ2knKTtcbiAgY29uc3QgY2RhdGFNYXRjaCA9IHhtbC5tYXRjaChjZGF0YVJlZ2V4KTtcbiAgaWYgKGNkYXRhTWF0Y2gpIHJldHVybiBjZGF0YU1hdGNoWzFdLnRyaW0oKTtcblxuICAvLyBUcnkgbm9ybWFsIHRhZ1xuICBjb25zdCBub3JtYWxSZWdleCA9IG5ldyBSZWdFeHAoYDwke3RhZ31bXj5dKj4oW1xcXFxzXFxcXFNdKj8pPC8ke3RhZ30+YCwgJ2knKTtcbiAgY29uc3Qgbm9ybWFsTWF0Y2ggPSB4bWwubWF0Y2gobm9ybWFsUmVnZXgpO1xuICBpZiAobm9ybWFsTWF0Y2gpIHJldHVybiBub3JtYWxNYXRjaFsxXS50cmltKCk7XG5cbiAgcmV0dXJuICcnO1xufVxuXG5mdW5jdGlvbiBjbGVhblRleHQodGV4dCkge1xuICByZXR1cm4gdGV4dFxuICAgIC5yZXBsYWNlKC88IVxcW0NEQVRBXFxbL2csICcnKVxuICAgIC5yZXBsYWNlKC9cXF1cXF0+L2csICcnKVxuICAgIC5yZXBsYWNlKC88W14+XSo+L2csICcnKVxuICAgIC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpXG4gICAgLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgIC5yZXBsYWNlKC8mZ3Q7L2csICc+JylcbiAgICAucmVwbGFjZSgvJnF1b3Q7L2csICdcIicpXG4gICAgLnJlcGxhY2UoLyYjMzk7L2csIFwiJ1wiKVxuICAgIC5yZXBsYWNlKC8mbmJzcDsvZywgJyAnKVxuICAgIC50cmltKCk7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWljLFNBQVMsb0JBQW9CO0FBQzlkLE9BQU8sV0FB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
