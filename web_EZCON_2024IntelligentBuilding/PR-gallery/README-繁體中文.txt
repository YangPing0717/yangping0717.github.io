本資料夾為可直接以本機伺服器瀏覽的完整网站副本。

執行：bash start-preview.command
需要 Python 3.7 或以上；啟動後自動開啟瀏覽器，Control + C 停止。

若由既有專案伺服器預覽，開啟該伺服器網址下的 /PR-gallery/。
請透過 HTTP 網址瀏覽，不要直接雙擊 index.html。

10 個活動、77 張照片，照片與背景影片均在本地資料夾內。
source/ 保留可編修的原始碼；一般瀏覽不需要安裝 Node.js 或 npm 套件。
編修時進入 source/ 執行 npm ci，修改後執行 npm run build。
建置輸出會更新本資料夾的 index.html、assets/ 和 schneider-2026/。

來源：已發布第 17 版；詳細來源與驗證結果見 EXPORT-INFO.json。
