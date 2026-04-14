# Week 07 Report

1. **資料結構重構（Habit + HabitLog**
    * 將原本集中在 Habit 內的「每日狀態」拆分為獨立的 HabitLog：
        * Habit：儲存基本資訊（title、goal、streak 等）
        * HabitLog：以 dateStr (YYYY-MM-DD) 記錄每日進度與完成狀態
    * 此設計讓資料從「單一狀態」轉為「日誌式紀錄」，支援歷史回溯與未來統計分析。

2. **每日進度改為 Log 驅動（upsert**
    * 使用 prisma.habitLog.upsert 確保同一天資料唯一：
        * 有紀錄 → 更新
        * 無紀錄 → 新增
    * 並搭配 @@unique([habitId, dateStr]) 保證資料一致性。

3. **todayValue / completedToday 改為動態計算**
    * 不再存於 Habit 表中，而是從當日 HabitLog 即時取得並映射回前端欄位，避免資料冗餘與同步問題。

4. **streak 計算改為基於歷史 logs**
    * 新增 calculateStreak()，根據最近 log 記錄計算連續完成天數，使 streak 成為「由資料推導出的結果」，而非手動更新欄位。