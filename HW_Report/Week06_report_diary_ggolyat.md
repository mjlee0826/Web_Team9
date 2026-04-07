
## 練習了哪些當週上課的主題

- 使用 React Context 管理驗證狀態，並與 Logto SDK 整合以取得與保護 Access Token。
- 深入應用 React Hooks（useEffect、useState、useCallback）處理非同步資料載入與表單提交鎖（isSubmitting）。
- 前端與後端的 RESTful API 串接實作（fetch + Bearer token），並在 UI 加入載入/錯誤提示以改善使用者體驗。
- 採用 SCR（Service-Controller-Route）模式設計後端，將邏輯拆分為 route、controller、service 以維持可維護性。

## 額外找了與當週上課的主題相關的程式技術

- Logto OIDC 的實作細節：如何設定 `redirect_uri`、進行 discovery 與交換授權碼，以及在前端用 SDK 取得 Access Token。
- JWT 驗證技術（使用 `jose` 套件）：動態取得 JWKS、驗證 issuer/audience，並將使用者資訊注入 `req.user`。
- 模擬資料庫 vs 持久化：目前採 in-memory 存放日記，建議可移轉至 SQLite 或 MongoDB 以避免重啟遺失資料。
- 前端環境變數管理（Vite 的 `VITE_` 前綴）與開發時的除錯手法（在 `main.jsx` 暫時輸出 env 以確認值）。

## prompts
使用 codex 協助開發
```
/init only the "diary" function of the project
```
```
請幫 diary 功能補上後端，讓日記可以真的被記錄下來，不會重新整理就不見。
前端也要做對應的修改。
請先規劃有哪些檔案要修改，然後逐一執行。
```