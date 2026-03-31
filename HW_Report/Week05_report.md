# Week 05 Report

## 網頁入口
- 請在 web_project/ 終端機執行 `npm install` 安裝相依套件，接著執行 `npm run dev`，並在瀏覽器中打開對應的 Local URL (預設通常為 http://localhost:5173 ) 即可瀏覽。

## 練習了哪些當週上課的主題

本週專案的核心目標是建立一個現代化的單頁應用程式 (SPA)，我們全面導入 React 框架與 React Router 來處理使用者互動與網頁路由，主要運用了以下主題：
1. **React Functional Components 與 Hooks 的應用**：
   * 大量使用 `useState` 來管理元件的內部狀態。例如在 LoginPage 管理帳號、密碼輸入與錯誤訊息提示；在 DiaryPage 管理日記的標題、內容與歷史紀錄陣列。
   * 使用 `useEffect` 來處理副作用，例如在 DiaryPage 載入時自動抓取並格式化當下日期，並顯示於畫面上。

2. **React Router DOM 路由管理**：
   * 在 App.jsx 中設定了路由環境，並利用 `Routes` 與 `Route` 定義各個頁面的路徑 (如 /login, /todo, /diary 等)。
   * 使用 `Outlet` 實作嵌套路由 (Nested Routes)，讓 Layout 元件可以作為共用的外框 (包含頂部導覽列)，並根據當下網址動態抽換內部的子頁面內容。
   * 透過 `Maps` 元件處理預設路徑的重定向 (例如將根目錄 / 自動導向 /login)。

3. **表單處理與受控元件 (Controlled Components)**：
   * 在 LoginPage 與 DiaryPage 中，將 input 與 textarea 的 value 綁定到 state，並透過 `onChange` 事件即時更新狀態。
   * 在表單提交時使用 `e.preventDefault()` 攔截預設的網頁重載行為，並進行前端的資料驗證 (如密碼長度檢查)，再透過程式邏輯決定下一步的畫面跳轉或資料儲存。

4. **動態渲染與陣列操作**：
   * 放棄寫死的 HTML，改用 JSX 動態生成畫面。在 DiaryPage 中，使用陣列的 `map()` 方法將過往的日記紀錄逐一渲染成卡片元件。
   * 在新增日記時，利用展開運算子 (...) 將新撰寫的物件與舊有的陣列合併 (`setHistory(prev => [newEntry, ...prev])`)，實現資料與畫面的即時同步更新。

## 額外找了與當週上課的主題相關的程式技術

為了讓網頁的互動更接近現代化的應用程式並提升開發效率，我們額外研究並實作了以下技術：
1. **Tailwind CSS 實用工具優先的樣式框架**：
   * 在專案中導入 Tailwind CSS，直接在 className 中撰寫 utility classes (如 flex, justify-center, bg-gray-100 等)，快速刻劃出響應式且現代化的 UI，大幅減少手寫傳統 CSS 的負擔 (如 LoginPage、Layout 以及各頁面的標題設計)。

2. **程式化導航 (Programmatic Navigation) 與路由歷史控制**：
   * 在 LoginPage 登入成功後，使用 React Router 的 `useNavigate` Hook 搭配 `{ replace: true }` 參數將使用者導向首頁。這會覆蓋瀏覽器的歷史紀錄，防止使用者點擊「上一頁」又錯誤地退回登入畫面。

3. **NavLink 動態樣式判斷**：
   * 在 Layout 導覽列中使用 React Router 提供的 `NavLink` 元件，並傳入帶有 `isActive` 參數的函式，藉此動態判斷當前所在的網頁路徑，自動為作用中的標籤加上專屬的高亮樣式 (如藍色字體與底線)，無需手動編寫複雜的狀態切換邏輯。

4. **Lucide React 向量圖示庫**：
   * 為了提升視覺體驗，我們引入了 lucide-react 套件，在導覽列中動態渲染 SVG 圖示 (ListTodo, Target, BookText, CalendarDays)，並透過 props 輕鬆調整圖示的大小與線條粗細，讓介面更加直覺美觀。

## 組員分工情況 (共 100%)

**組別：9**

- **李諺傑 (25%)**：負責主頁面、login_page、framwork、report
- **林冠妤 (25%)**：負責todo_page
- **蔡雅安 (25%)**：負責Habits
- **張珮芸 (25%)**：負責diary_page