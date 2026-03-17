# Week 03 Report

## 網頁入口
- 在瀏覽器中打開HW_Report/index.html

## 練習了哪些當週上課的主題

在本週的專案實作中，我們充分運用了課堂上教授的 HTML 與 CSS 核心概念來建構多個頁面，包含：
1. **HTML 語意化標籤的應用**：在日記頁與代辦事項頁中，使用了 `<header>`, `<main>`, `<nav>`, `<section>`, `<article>` 等標籤，讓網頁結構更具可讀性。
2. **CSS Flexbox 與 Grid 排版**：
   * 大量使用 `display: flex;` 進行元件的水平、垂直對齊（例如登入頁面的置中、主頁的頂部導覽列）。
   * 在四象限任務板（Todo Page）中，使用了 `display: grid;` 來精確劃分四個象限區塊。
3. **CSS 變數 (Custom Properties)**：在 `todo_page.css` 與 `diary_page.css` 中，透過 `:root` 定義了全域的顏色、字體與圓角變數（如 `--primary-color`, `--bg`），提升了樣式的可維護性與一致性。
4. **表單與輸入框的設計**：實作了包含密碼自動屏蔽 (`type="password"`)、純文字輸入 (`type="text"`) 以及時間選擇 (`type="date"`) 的表單 UI 設計。

## 額外找了與當週上課的主題相關的程式技術

為了達成無 JavaScript 的切換效果以及更現代化的 UI 體驗，我們額外研究了以下前端技術：
1. **純 CSS 狀態控制 (Radio Button Hack)**：在主頁 (`index.html`) 中，利用隱藏的 `<input type="radio">` 搭配 CSS 偽類 `:checked` 以及兄弟選擇器 `~`，成功實作了完全不需要 JavaScript 的 Tab 頁面切換功能。
2. **微縮模型技巧 (Iframe Scaling)**：為了解決主頁 Tab 縮圖的問題，我們使用了 `<iframe>` 載入子頁面，並結合 `transform: scale(0.1)` 將網頁等比例縮小 10%，配合 `pointer-events: none;` 防止誤觸，做出了極具巧思的動態縮圖導覽列。
3. **CSS 轉場與動畫效果 (Transitions & Keyframes)**：研究了 `@keyframes` 來製作任務卡片載入時的滑動效果 (`slideIn`) 以及彈出視窗的縮放顯示 (`modalIn`)，並加上 `transition` 讓按鈕的懸停顏色變化更滑順。
4. **玻璃擬物化特效 (Glassmorphism)**：在 Modal 的背景遮罩中，額外使用了 `backdrop-filter: blur(3px);` 來製造背景模糊的現代感視覺效果。

## 組員分工情況 (共 100%)

**組別： 9**

- **李諺傑 (25%)**：負責主頁面、login_page、report
- **林冠妤 (25%)**：負責todo_page
- **蔡雅安 (25%)**：負責diary_page
- **張珮芸 (25%)**：