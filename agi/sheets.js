// api/sheets.js
// Vercel Serverless Function — 代理 Google Apps Script，解決 CORS 問題

const GS_URL = "https://script.google.com/macros/s/AKfycbyxh1ZZhMratAZoUojK9BHWcX5YRsotzAErHLA0zJ7NCE8uGrOI9xVSMtqAqPvbt0vusQ/exec";

export default async function handler(req, res) {
  // 允許跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      // 讀取 Google Sheets 資料
      const sheet = req.query.sheet || "Wisdom_DB";
      const gsRes = await fetch(`${GS_URL}?sheet=${sheet}`);
      const data = await gsRes.json();
      return res.status(200).json(data);

    } else if (req.method === "POST") {
      // 寫入 Google Sheets
      const body = req.body;
      const gsRes = await fetch(GS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await gsRes.json();
      return res.status(200).json(data);
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
