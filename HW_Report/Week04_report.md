# Week 04 Report

## 網頁入口
- 在瀏覽器中打開 `HW_Report/index.html`

## 練習了哪些當週上課的主題

本週專案的核心目標是將靜態網頁「動態化」，我們移除了上週過度依賴 CSS 的控制邏輯，全面導入 JavaScript 來處理使用者互動與資料流，主要運用了以下課堂主題：
1. **DOM 元素選取與操作**：
   * 大量使用 `document.getElementById` 與 `document.querySelector` 來獲取畫面上的元素。
   * 透過 `classList.add()` 與 `classList.remove()` 來動態切換元素的樣式（例如主頁面切換 `.active` 狀態來顯示/隱藏 iframe、Todo 頁面的 Modal 彈出視窗）。
2. **事件監聽 (Event Listeners) 的應用**：
   * 替按鈕與導覽列綁定 `click` 事件來觸發對應的邏輯（如：切換分頁、儲存日記、勾選代辦事項）。
   * 處理表單的事件，例如在新增任務或日記時，攔截空白輸入並給予提示。
3. **動態生成 HTML 結構**：
   * 放棄寫死的 HTML，改用 JS 動態生成。例如在 Todo 頁面中使用 `document.createElement()` 結合 `appendChild()` 來逐一渲染任務卡片。
   * 在日記頁面中，運用了「模板字面值 (Template Literals, `` ` ``)」搭配 `innerHTML` 與 `prepend()`，將新撰寫的日記卡片直接安插到畫面的最前面。
4. **基礎的資料狀態管理 (State Management)**：
   * 在 Todo 頁面中，我們宣告了陣列（Array）與物件（Object）來儲存任務清單（`tasks`），並根據這些資料狀態來重新渲染 (`render()`) 畫面，實現了資料與畫面的同步。

## 額外找了與當週上課的主題相關的程式技術

為了讓網頁的互動更接近現代化的應用程式，我們在基礎語法之外，額外研究並實作了以下技術：
1. **自訂資料屬性 (Data Attributes) 路由控制**：
   * 在主頁面 (`index.html`) 中，我們在標籤上設定了 `data-target="page-a"`，並在 JS 中透過 `getAttribute("data-target")` 精準抓取對應的容器 ID，這讓頁面切換的邏輯變得非常乾淨且易於擴充。
2. **事件代理 (Event Delegation)**：
   * 在日記頁面與 Todo 頁面中，由於許多卡片是「後來才動態生成」的，我們將點擊事件綁定在父層容器上，再利用 `e.target.closest()` 或檢查 `classList` 來判斷點擊目標（例如點擊「閱讀全文」按鈕彈出視窗），避免了重複綁定監聽器的效能問題。
3. **JavaScript 日期與時間處理 (Date Object)**：
   * 在 Todo 頁面中，運用 `new Date()` 抓取當前時間，並與任務的截止日期進行數學運算（計算毫秒差），自動判斷並渲染出「今天到期」、「逾期 X 天」的動態標籤。
   * 日記頁面也使用日期物件自動抓取當下時間作為日記建立的預設日期。
4. **鍵盤事件攔截 (Keyboard Event Handling)**：
   * 為了提升使用者體驗 (UX)，我們監聽了 `keydown` 事件。使用者現在可以按下 `Escape` 鍵快速關閉 Modal，或者在輸入框內按下 `Enter` 鍵直接送出任務或標籤，不需一定要用滑鼠點擊。

## 組員分工情況 (共 100%)

**組別：9**

- **李諺傑 (25%)**：負責主頁面、login_page、report
- **林冠妤 (25%)**：負責todo_page
- **蔡雅安 (25%)**：負責Habits
- **張珮芸 (25%)**：負責diary_page