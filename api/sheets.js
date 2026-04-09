// api/sheets.js
// Vercel Serverless Function — 代理 Google Apps Script，解決 CORS 問題
 
const GS_URL = "https://script.google.com/macros/s/AKfycbyxh1ZZhMratAZoUojK9BHWcX5YRsotzAErHLA0zJ7NCE8uGrOI9xVSMtqAqPvbt0vusQ/exec";
 
module.exports = async function handler(req, res) {
  // 允許跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
 
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
 
  try {
    if (req.method === "GET") {
      const sheet = req.query.sheet || "Wisdom_DB";
      const gsRes = await fetch(`${GS_URL}?sheet=${encodeURIComponent(sheet)}`);
      const text = await gsRes.text();
      const data = JSON.parse(text);
      return res.status(200).json(data);
 
    } else if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const gsRes = await fetch(GS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        redirect: "follow",
      });
      const text = await gsRes.text();
      try {
        return res.status(200).json(JSON.parse(text));
      } catch {
        return res.status(200).json({ success: true });
      }
    }
 
    return res.status(405).json({ error: "Method not allowed" });
 
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
