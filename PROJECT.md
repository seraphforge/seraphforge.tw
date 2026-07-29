# Seraph

## 專案定位

Seraph 是一個個人技術網站與長期數位檔案，用來持續整理技術研究、實作專案、學習歷程、公開筆記與個人反思。

網站目前以三語形式呈現，並透過 GitHub Pages 對外發布。

## 核心主題

- Cybersecurity
- Medical Cybersecurity
- Home Lab
- IoT
- Robotics
- HPC
- Projects
- Technical Writing

## 技術棧摘要

- Static site generator：Hexo 8
- Runtime：Node.js
- 內容格式：Markdown
- Theme rendering：EJS
- Markdown renderer：Marked
- 樣式：CSS、Stylus renderer
- 前端互動：原生 JavaScript
- Theme：repository 內高度客製化的 `themes/landscape`
- Deployment：GitHub Actions、GitHub Pages
- Package management：npm

雖然 `package.json` 同時包含 `hexo-theme-landscape` 與 `hexo-theme-reimu`，目前實際啟用的是 repository 內的 `themes/landscape`。`_config.reimu.yml` 目前不是網站的主要生效設定。

## 三語架構

目前網站支援英文、繁體中文與日文：

| 語言 | 一般路徑規則 | 範例 |
| --- | --- | --- |
| 英文 | 根路徑 | `/`、`/projects/`、`/writing/` |
| 繁體中文 | `/zh/` | `/zh/`、`/zh/projects/` |
| 日文 | `/ja/` | `/ja/`、`/ja/projects/` |

文章通常以三個 Markdown 檔案維護：

```text
article.en.md
article.md
article.ja.md
```

文章語言與翻譯關係主要由 `site_lang`、`translation_key`、`permalink` 及檔名後綴共同表達。部分既有路由具有歷史性例外，修改前應先閱讀 `docs/architecture.md`。

## 主要目錄

| 路徑 | 用途 |
| --- | --- |
| `source/` | Hexo 內容、頁面與會直接發布的靜態資源 |
| `source/_posts/` | 三語文章 |
| `source/_data/` | 結構化網站資料，例如 Experience 資料 |
| `source/images/` | 圖片與 Open Graph 圖片 |
| `source/css/` | 網站自訂 CSS |
| `source/js/` | 網站自訂 JavaScript |
| `source/projects/` | 英文 Project 頁面 |
| `source/labs/` | 英文 Lab 頁面 |
| `source/experience/` | Experience 首頁與詳細內容 |
| `source/zh/` | 中文頁面 |
| `source/ja/` | 日文頁面 |
| `themes/landscape/` | 目前實際使用的客製主題 |
| `themes/landscape/layout/` | EJS layout 與 partial |
| `themes/landscape/scripts/` | Hexo theme helpers 與 scripts |
| `scaffolds/` | Hexo 建立文章、頁面與草稿時使用的模板 |
| `.github/workflows/` | GitHub Actions workflows |
| `docs/` | 專案架構與開發規範 |
| `public/` | Hexo 產生的網站成品；不納入版本控制 |

## 常用開發指令

首次安裝 dependencies：

```bash
npm install
```

啟動本機預覽：

```bash
npm run server
```

產生靜態網站：

```bash
npm run build
```

清除 Hexo 產物與快取：

```bash
npm run clean
```

完整的本地驗證方式請參考 `docs/development-guide.md`。

## GitHub Pages 部署方式

日常部署由 GitHub Actions 負責：

1. 將已審查的變更推送至 `main`。
2. `.github/workflows/pages.yml` 啟動。
3. Workflow 使用 Node.js 20 安裝 dependencies。
4. 執行 `npx hexo clean && npx hexo generate`。
5. 將 `public/` 上傳為 GitHub Pages artifact。
6. 使用 `actions/deploy-pages` 發布至 GitHub Pages。

`npm run deploy` 會使用 `hexo-deployer-git` 與 `_config.yml` 的 `deploy` 設定，屬於另一條部署路徑。日常開發不要直接執行 `npm run deploy`，應以推送 `main` 後的 GitHub Actions 為主。

## 開發原則

1. 先理解內容層、資料層與主題層的責任，再決定修改位置。
2. 修改路由、語言切換或 SEO 時，必須同時檢查三語版本。
3. 優先修改資料或 Markdown；只有在呈現邏輯需要改變時才修改 EJS。
4. 不把產生的 `public/`、cache 或 dependencies 提交至 repository。
5. 每次變更保持範圍單一，避免在功能修改中混入大規模格式化。
6. 修改前先確認工作目錄狀態，保留不屬於本次工作的既有變更。
7. 無法由 repository 確認的行為應標記為「待確認」，不要自行假設。
8. 部署前應完成本地建置、頁面檢查與 Git diff 檢查。

## 禁止隨意修改的區域

下列區域牽涉全站行為或部署，修改前必須先釐清影響範圍：

- `_config.yml`
- `themes/landscape/_config.yml`
- `.github/workflows/pages.yml`
- `themes/landscape/layout/layout.ejs`
- `themes/landscape/layout/_partial/head.ejs`
- `themes/landscape/layout/_partial/header.ejs`
- `themes/landscape/layout/_partial/i18n-page.ejs`
- `themes/landscape/scripts/post-language.js`
- `source/css/custom.css`
- 既有文章的 `permalink`、`canonical_url`、`translation_key`
- 英文、中文、日文之間的路徑對應

禁止在未確認影響前大量刪除檔案，亦禁止使用破壞性 Git 指令覆蓋現有工作。

## 修改前應先檢查

- [ ] `git status --short` 是否乾淨，或既有變更是否已辨識
- [ ] 修改目標屬於內容、資料、主題、靜態資源或部署哪一層
- [ ] 是否有英文、中文、日文三個對應版本
- [ ] `site_lang` 是否正確
- [ ] `translation_key` 是否與其他語言版本一致
- [ ] `permalink` 與 `canonical_url` 是否符合既有規則
- [ ] 導覽列、語言切換與 `hreflang` 是否會受到影響
- [ ] 是否存在歷史性或平行路由
- [ ] CSS selector 是否已在 `custom.css` 後方被覆寫
- [ ] 是否會影響 GitHub Pages workflow
- [ ] 不確定的行為是否已標記為「待確認」

更多細節請閱讀：

- `docs/architecture.md`
- `docs/development-guide.md`
