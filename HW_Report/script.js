// 等待 HTML 文件載入完成後再執行
document.addEventListener("DOMContentLoaded", () => {
    // 取得所有的導覽列項目 (Tab) 與所有的頁面區塊 (Page)
    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");

    // 為每一個導覽列項目加上點擊事件監聽器
    navItems.forEach(item => {
        item.addEventListener("click", function() {
            // 1. 取得被點擊的 Tab 上設定的目標頁面 ID (例如 'page-a')
            const targetId = this.getAttribute("data-target");

            // 2. 移除所有 Tab 的 'active' 樣式
            navItems.forEach(nav => nav.classList.remove("active"));
            
            // 3. 為當前被點擊的 Tab 加上 'active' 樣式
            this.classList.add("active");

            // 4. 移除所有 Page 的 'active' 樣式 (隱藏它們)
            pages.forEach(page => page.classList.remove("active"));

            // 5. 找到目標頁面並加上 'active' 樣式 (顯示它)
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add("active");
            }
        });
    });
});