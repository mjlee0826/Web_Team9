# Week 06 Report

## 網頁入口
- [Project Setup & document](https://hackmd.io/@dBuOoPBJTu6Y7sr27fX95w/B1SH1k-3bx/edit)

## 練習了哪些當週上課的主題

本週專案進度從單純的前端 UI 轉向全端架構整合，並深入研究了 React 狀態管理與後端 API 的協作，主要運用了以下主題：

1. **React Context API 與全域狀態管理**：
    * 實作了 AuthContext 來管理全域的身分驗證狀態。透過 Provider 封裝 Logto SDK 的原始狀態，將使用者的登入資訊、讀取狀態與登出邏輯整合，確保在 App 的任何角落都能輕鬆取得 user 資料。
    * 解決了複雜的「狀態震盪」問題，透過監聽 isInitialized 這種里程碑型狀態而非 isLoading 這種跳動型狀態，成功消除了 Token 刷新時產生的無限重新渲染 (Infinite Re-render) 陷阱。

2. **進階 React Hooks 應用與效能優化**：
    * 大量運用 useCallback 來穩定函式參考 (Function Reference)，防止子元件因為父元件重新渲染而產生不必要的效能損耗，特別是在 AuthProvider 的登出與 Token 獲取函式中。
    * 深入實作 useEffect 的依賴項管理，學會如何區分「觸發型依賴」與「靜態狀態」，並使用 useRef 來實作執行鎖 (Execution Lock)，確保初始化邏輯在生命週期內僅執行一次。

3. **全端 RESTful API 串接與非同步處理**：
    * 實作了完整的 CalendarPage CRUD 功能。前端透過 async/await 與 fetch API 跟後端進行通訊，並在請求標頭 (Headers) 中正確帶入 Bearer Token。
    * 在前端實作了「提交鎖 (isSubmitting)」機制，有效防止使用者因連點按鈕而發送重複的 POST 請求，並結合自製的 LoadingPage 提升使用者體驗。

4. **後端 Express 路由與中間件設計**：
    * 實作了後端中間件 (Middleware) 機制，利用 requireAuth 函式作為 API 的門禁，在進入 Controller 前先行驗證 JWT 的合法性，落實了權限控管 (Authorization) 的概念。

## 額外找了與當週上課的主題相關的程式技術

為了達成更專業的系統架構與安全性，我們在本週額外研究並實作了以下技術：

1. **Logto OIDC 身份驗證整合**：
    * 導入 Logto 作為身份驗證中心 (IdP)，實作了 OpenID Connect (OIDC) 標準流程。包括 /callback 頁面的授權碼交換、自動登入檢測機制 (Proactive Token Validation)，以及與前端 AuthContext 的深度同步。

2. **後端模組化架構設計 (SCR Pattern)**：
    * 捨棄了將所有邏輯塞在單一檔案的做法，導入了業界常見的 Service-Controller-Route (SCR) 三層架構。
        * Route：負責定義 API 路徑與指派中間件。
        * Controller：負責解析 HTTP 請求 (req) 並決定回應 (res) 狀態碼。
        * Service：負責核心商業邏輯與模擬資料庫 (Mock Database) 操作。

3. **JWT 安全驗證 (jose Library)**：
    * 研究並使用 jose 套件在後端實作非對稱加密驗證。透過 createRemoteJWKSet 動態獲取 Logto 的公鑰，並驗證 Access Token 的發行者 (Issuer) 與受眾 (Audience)，確保後端 API 的絕對安全。

## 組員分工情況 (共 100%)

**組別：9**

- **李諺傑 (25%)**：負責 calendar_page 全端開發
- **林冠妤 (25%)**：負責 todo_page 全端開發
- **蔡雅安 (25%)**：負責 habit_apge 全端開發
- **張珮芸 (25%)**：負責 diary_page 全端開發