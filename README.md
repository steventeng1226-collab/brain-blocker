# ⚡ 負面阻斷器 · Brain Blocker

> 智慧錦囊 · 重寫大腦神經路徑

## 專案結構

```
brain-blocker/
├── index.html          # 入口頁面
├── package.json        # 套件設定
├── vite.config.js      # 建置設定
├── netlify.toml        # Netlify 部署設定
├── public/
│   ├── manifest.json   # PWA 設定
│   └── icon.svg        # App 圖示
└── src/
    ├── main.jsx        # React 入口
    └── App.jsx         # 主程式（負面阻斷器全部功能）
```

## 本機開發

```bash
npm install
npm run dev
```

## 部署到 Netlify

1. 把這個資料夾推到 GitHub
2. Netlify 連接 GitHub repo
3. 自動部署完成

## 功能

- ⚡ 三層阻斷程序（身體 → 認知 → 錨定）
- 💡 200 條智慧錦囊（連接 Google Sheets）
- 🏆 成功資產庫
- 📊 數據分析（高速公路佔比）
- 🔄 Google Sheets 雙向同步
- 📱 PWA 全螢幕模式
