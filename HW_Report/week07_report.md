這是幫你整合好的 **Week 07 完整版 Report**。

這份報告融合了你們團隊練習的核心技術（Docker、Prisma 7.0、Multi-file Schema），並且將你剛才負責的 **Todo 功能深度實作細節**，以及**其他組員的分工狀態**完美對齊。

你可以直接複製以下 Markdown 內容貼上：

***

# Week 07 Report

## 網頁入口
- [Project Setup & document](https://hackmd.io/@dBuOoPBJTu6Y7sr27fX95w/B1SH1k-3bx/edit)

## 練習了哪些當週上課的主題

本週專案的核心目標是將後端的暫存記憶體假資料 (Mock Data) 徹底汰換，全面升級為真實的關聯式資料庫系統。我們實作了以下主題：

1. **關聯式資料庫部署與容器化 (PostgreSQL & Docker)**：
    * 練習使用 Docker Compose 建立 PostgreSQL 16 的伺服器環境。
    * 配置環境變數 (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB) 與掛載 Volume 以確保資料的持久化。
    * 撰寫 healthcheck 腳本 (pg_isready) 確保資料庫容器的穩定運行。

2. **ORM 工具整合與資料庫操作 (Prisma Client)**：
    * 導入 Prisma 作為 Node.js 後端的 ORM (Object-Relational Mapping) 工具，取代手寫 SQL 語法。
    * 實作資料庫的 CRUD 操作，例如使用 `prisma.todo.findMany` 進行查詢與排序，以及 `deleteMany` 確保安全刪除特定使用者的資料。
    * 將原有的 SCR (Service-Controller-Route) 架構中的 Service 層全面改寫，無縫接軌 Prisma Client，且完全不影響 Controller 與前端的程式碼。

3. **資料庫 Schema 設計與索引最佳化**：
    * 學習使用 Prisma Schema Definition Language (SDL) 定義資料表模型。
    * 實作自動生成 UUID 主鍵 (`@id @default(uuid())`)、預設時間戳記 (`@default(now())`)。
    * 針對高頻率的查詢欄位建立複合索引 (`@@index([userId])`)，以提升從資料庫撈取特定使用者資料的效能。
    * 實作 PostgreSQL 特有的字串陣列型別 (`String[]`) 來儲存資料標籤。

## 額外找了與當週上課的主題相關的程式技術

為了解決 4 人團隊協作時容易發生的 Git 衝突，以及適應最新版套件的架構，我們額外研究並實作了以下技術：

1. **多檔案 Schema 架構 (Multi-file Schema) 與防衝突機制**：
    * 傳統 Prisma 將所有 Table 寫在單一 `schema.prisma` 中，極易造成團隊 Merge 衝突。我們研究並啟用了 Prisma 的 `prismaSchemaFolder` 預覽功能。
    * 建立 `prisma/schema/` 目錄，將核心連線設定寫在 `main.prisma`，並讓每位組員擁有各自的 Schema 檔案 (如 `calendar.prisma`, `todo.prisma`)。編譯時 Prisma 會自動合併，完美解決多人開發的 Git Conflict 問題。

2. **Prisma 7.0 重大更新適配與環境變數管理 (dotenv)**：
    * 遇到 Prisma 7 取消在 Schema 檔案中直接讀取 `url` 的重大更新 (Breaking Change)。
    * 學習將連線設定抽離至 `prisma.config.ts`，並在專案中導入 `dotenv` 套件。
    * 落實 `.env` 與 `.env.example` 的版控安全觀念，確保資料庫連線字串等機密資訊不會外洩到 GitHub。
    * 實作在執行期 (Runtime) 明確傳遞連線字串的作法：

```typescript
    import "dotenv/config";
    import { PrismaPg } from "@prisma/adapter-pg";
    import { PrismaClient } from "../generated/prisma/client.js";

    const connectionString = `${process.env.DATABASE_URL}`;

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    export default prisma;
```

3. **運用 Prisma CLI 加速敏捷開發流程**：
    * 在開發階段捨棄傳統的 `migrate dev`，改用 `npx prisma db push` 直接將 Schema 強制同步至 PostgreSQL，加速原型的迭代。
    * 確立了團隊的資料庫同步規範：開發時使用 `db push` 各自測試，待合併至 `main` 分支後再由專人統一產生正式的 Migration 紀錄檔，維持資料庫版控的純潔性。

## 組員分工情況 (共 100%)

**組別：9**

- **李諺傑 (25%)**：負責基礎建設與 Calendar 功能。建立 PostgreSQL Docker 容器化環境，配置資料庫持久化與 Healthcheck；導入 Prisma 7.0 並整合 `dotenv` 解決套件重大變更；設計 Prisma 多檔案架構 (Multi-file Schema) 以避免 Git 衝突；並完成 Calendar 功能的 `calendar.prisma` 設計與 Service 層資料庫串接。
- **林冠妤 (25%)**：負責 Todo 功能的全面資料庫化與前後端串接。包含 Schema 設計 (`todo.prisma` 實作 UUID、陣列標籤與效能索引)、Service 層 CRUD 改寫 (加入權限防護確保資料隔離)，以及前端 Todo 頁面 API 的 Logto 驗證與整合重構。
- **蔡雅安 (25%)**：負責 Habit 功能的全面資料庫化與前後端串接。包含 Schema 設計 (`habit.prisma` 規劃習慣追蹤紀錄與打卡關聯)、Service 層 CRUD 改寫 (加入權限防護確保資料隔離)，以及對應之後端 Controller API 驗證整合重構。
- **張珮芸 (25%)**：負責 Diary 功能的全面資料庫化與前後端串接。包含 Schema 設計 (`diary.prisma` 規劃日期、心情標籤與文字欄位結構)、Service 層 CRUD 改寫 (加入權限防護確保資料隔離)，以及對應之後端 Controller API 驗證整合重構。