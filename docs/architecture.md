# Seraph 專案架構

## 1. 架構概覽

Seraph 是以 Hexo 8 產生的靜態網站。Repository 內的原始內容、結構化資料、客製主題與靜態資源會在建置階段組合，輸出至 `public/`，再由 GitHub Actions 部署到 GitHub Pages。

```text
Markdown 內容 ─────────┐
結構化資料 ────────────┼─> Hexo 8 + themes/landscape ─> public/ ─> GitHub Pages
EJS layouts/partials ──┤
CSS / JavaScript / 圖片 ┘
```

目前架構可分為以下層次：

1. 內容層：文章與一般頁面的 Markdown。
2. 資料層：可供 EJS 使用的結構化資料。
3. 主題層：EJS layout、partial、helper 與呈現邏輯。
4. 靜態資源：CSS、JavaScript、圖片、favicon、robots.txt。
5. 部署層：GitHub Actions 與 GitHub Pages。

## 2. 內容層

內容層主要位於 `source/`。

### 文章

`source/_posts/` 保存文章。文章經 `hexo-renderer-marked` 轉換為 HTML，再交由 `themes/landscape/layout/post.ejs` 包裝。

文章 front matter 可能包含：

```yaml
title:
date:
updated:
site_lang:
translation_key:
categories:
tags:
cover:
slug:
permalink:
description:
canonical_url:
toc:
```

並非每篇文章都必須包含所有欄位；新增或翻譯文章時應以同系列既有文章為基準，不應自行建立未使用的欄位。

### 一般頁面

一般頁面通常放在：

```text
source/<route>/index.md
source/zh/<route>/index.md
source/ja/<route>/index.md
```

部分頁面由 Markdown 正文提供內容，例如 About、Project detail、Lab detail。另一些頁面只有 front matter，主要內容由主題的 `i18n-page.ejs` 或 Experience partial 產生。

因此，不應只根據 Markdown 正文是否為空判斷頁面是否有內容。

## 3. 主題層

目前 `_config.yml` 指定：

```yaml
theme: landscape
```

實際使用的是 repository 內的 `themes/landscape/`。這份主題已高度客製化，不能視為標準 Hexo Landscape。

主要責任如下：

| 檔案 | 責任 |
| --- | --- |
| `layout/layout.ejs` | 全站 HTML 外框 |
| `layout/index.ejs` | 首頁 layout 入口 |
| `layout/page.ejs` | 一般頁面與特殊頁面的分流 |
| `layout/post.ejs` | 文章頁、閱讀時間與文章輔助功能 |
| `layout/archive.ejs` | 依語言篩選的文章歸檔 |
| `layout/tag.ejs` | 單一 tag 頁 |
| `layout/tags.ejs` | tags 清單 |
| `layout/lab.ejs` | `/lab/` 的特殊展示頁 |
| `layout/_partial/head.ejs` | SEO、canonical、Open Graph、Twitter Card、`hreflang` |
| `layout/_partial/header.ejs` | 全站導覽、語言切換、手機選單與外觀控制 |
| `layout/_partial/footer.ejs` | Footer |
| `layout/_partial/i18n-page.ejs` | 三語首頁與多個主要 section 的內容及呈現 |
| `layout/_partial/experience-page.ejs` | Experience landing page |
| `layout/_partial/experience-detail.ejs` | Experience detail page |
| `layout/_partial/os-post-tools.ejs` | 閱讀進度、heading anchor、code copy、回頂端 |
| `scripts/post-language.js` | 文章語言正規化與判斷 helper |

## 4. 資料層

資料層位於 `source/_data/`。Hexo 會將這些資料提供給主題，通常透過 `site.data` 讀取。

目前已確認的重要資料：

- `source/_data/experience.json`：Experience landing page 使用的三語結構化資料。
- `source/_data/avatar/avatar.png`：位於 `_data` 下的圖片；其實際引用方式如需調整，應先確認建置輸出。

Experience 詳細頁並非只由 `experience.json` 控制，也會使用各語言 Experience Markdown 的 front matter 與正文。

## 5. 靜態資源

會隨網站發布的資源主要位於 `source/`：

| 路徑 | 用途 |
| --- | --- |
| `source/css/custom.css` | 全站主要樣式與歷史覆寫 |
| `source/css/lab.css` | 特殊 Lab 頁樣式 |
| `source/js/lab.js` | Lab 頁 reveal 行為 |
| `source/images/` | 圖片與分享預覽圖 |
| `source/favicon.svg` | Favicon |
| `source/robots.txt` | Crawler 規則 |

`source/css/custom.css` 目前包含多代設計與大量後置 override。修改時必須檢查同一 selector 在檔案後方是否再次出現。

## 6. `source/` 與 `themes/landscape/` 的責任界線

### `source/` 應負責

- 文章正文與 front matter。
- Project、Lab、Experience 等內容資料。
- 各語言的一般頁面內容。
- 圖片、CSS、前端 JavaScript 等公開資源。
- `robots.txt`、favicon 等直接發布資源。

### `themes/landscape/` 應負責

- HTML layout 與共用 partial。
- 頁面類型的呈現邏輯。
- Header、Footer、SEO metadata。
- 語言偵測、語言切換及路由組合邏輯。
- 將 `site.data`、文章集合與頁面內容轉換成最終 HTML。

### 修改判斷原則

- 文字或資料內容改變：優先修改 `source/`。
- 多頁共用的 HTML 結構改變：修改 theme partial。
- 全站路由或語言行為改變：檢查 theme helper、Header、Head 與相關頁面。
- 單純外觀改變：修改 `source/css/`，並先確認既有 override。

目前 `i18n-page.ejs` 也保存大量三語文案與資料，因此責任界線尚未完全分離。這是已知技術債，不應在一般內容更新時順便大規模重構。

## 7. 三語文章規則

### 檔名

目前文章通常使用：

```text
<article>.en.md
<article>.md
<article>.ja.md
```

既有慣例中，沒有語言後綴的版本通常是繁體中文；仍應以 front matter 的 `site_lang` 為準。

### `site_lang`

建議沿用既有值：

```yaml
site_lang: en
site_lang: zh-TW
site_lang: ja
```

`themes/landscape/scripts/post-language.js` 會正規化語言值，也會在缺少明確欄位時參考路徑與檔名。新增內容時仍應明確填寫 `site_lang`，不要只依賴自動判斷。

### `translation_key`

同一篇文章的三語版本應使用相同的 `translation_key`：

```yaml
translation_key: 2026-security-conference
```

它用來表達翻譯關係。修改任一語言版本時，應檢查其他語言檔案是否仍使用相同值。

### `permalink`

目前文章路徑慣例：

```yaml
# English
permalink: 2026/05/09/article-slug/

# Traditional Chinese
permalink: zh/2026/05/09/article-slug/

# Japanese
permalink: ja/2026/05/09/article-slug/
```

若文章已發布，不應隨意修改 `permalink`，以免造成既有連結失效。若必須改動，redirect 處理方式目前為「待確認」。

### `canonical_url`

文章若有 `canonical_url`，應與該語言版本的正式網址一致：

```text
https://seraphforge.github.io/<permalink>
```

修改 `permalink` 時必須同步檢查 `canonical_url`、語言切換與 `hreflang`。

## 8. 主要路由

一般語言規則：

| Section | English | 繁體中文 | 日本語 |
| --- | --- | --- | --- |
| Home | `/` | `/zh/` | `/ja/` |
| About | `/about/` | `/zh/about/` | `/ja/about/` |
| Projects | `/projects/` | `/zh/projects/` | `/ja/projects/` |
| Labs | `/labs/` | `/zh/labs/` | `/ja/labs/` |
| Writing | `/writing/` | `/zh/writing/` | `/ja/writing/` |
| Archives | `/archives/` | `/zh/archives/` | `/ja/archives/` |
| Timeline | `/timeline/` | `/zh/timeline/` | `/ja/timeline/` |
| Dashboard | `/dashboard/` | `/zh/dashboard/` | `/ja/dashboard/` |

Project 與 Lab detail 通常延續相同前綴：

```text
/projects/<slug>/
/zh/projects/<slug>/
/ja/projects/<slug>/

/labs/<slug>/
/zh/labs/<slug>/
/ja/labs/<slug>/
```

## 9. 歷史性路由例外

目前已確認的例外或平行路徑如下：

1. Experience landing page 並未完全遵循英文根路徑規則：
   - English：`/en/experience/`
   - 繁體中文：`/experience/`
   - 日本語：`/ja/experience/`
2. Repository 同時存在 `/zh/experience/` 對應頁面。
3. Header 中的 Projects 導覽目前使用 `experience/projects` 類型路徑，但同時存在獨立的 `/projects/`、`/zh/projects/`、`/ja/projects/`。
4. `works`、`writing`、`archives` 在部分 layout 邏輯中具有相互映射或相近用途。
5. Experience 內存在 `leadership` 頁面，但 Experience detail 的主要排序清單未包含 `leadership`；預期呈現與導覽行為為「待確認」。

修改上述路由前，必須一起檢查：

- `source/` 內實際頁面。
- `themes/landscape/layout/page.ejs`。
- `themes/landscape/layout/_partial/header.ejs`。
- `themes/landscape/layout/_partial/head.ejs`。
- `themes/landscape/layout/_partial/i18n-page.ejs`。
- canonical 與 `hreflang`。

## 10. GitHub Actions 部署流程

部署 workflow 位於 `.github/workflows/pages.yml`。

觸發條件：

- Push 至 `main`。
- 手動執行 `workflow_dispatch`。

流程：

```text
Checkout
  ↓
Setup Node.js 20
  ↓
npm install
  ↓
npx hexo clean && npx hexo generate
  ↓
Upload ./public as Pages artifact
  ↓
actions/deploy-pages
  ↓
GitHub Pages
```

Workflow 使用：

- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/upload-pages-artifact@v3`
- `actions/deploy-pages@v4`

部署 job 需要 `pages: write` 與 `id-token: write` 權限。

`_config.yml` 另有 `hexo-deployer-git` 的 `gh-pages` 設定，但日常部署以 GitHub Actions 為主，不應直接執行 `npm run deploy`。

## 11. 已知技術債

### `custom.css` 過大

`source/css/custom.css` 約 12,500 行，包含多代設計、重複 selector 與多個檔尾 override。後續需要規劃拆分與清理，但不可在沒有視覺回歸驗證的情況下直接刪除舊規則。

### `i18n-page.ejs` 過大

`themes/landscape/layout/_partial/i18n-page.ejs` 同時承擔：

- 三語文案。
- 首頁內容。
- Projects、Labs、Writing、Timeline 等 section。
- 部分資料集合。
- 呈現與互動邏輯。

後續可評估拆分 partial 或移動內容到 `_data`，實際方案為「待確認」。

### 部分平行／舊路由

Experience、Projects、Works、Writing、Archives 之間存在歷史性或平行路徑。清理前需要確認外部連結、canonical、`hreflang` 與 GitHub Pages 上的既有 URL。

### 根設定與主題設定有重複值

`_config.yml` 與 `themes/landscape/_config.yml` 同時包含：

- Site metadata。
- Language。
- URL。
- Permalink。
- Theme。
- Deploy。

部分值不完全一致。哪些欄位應保留在哪一層需要後續整理；在確認 Hexo 實際設定合併行為與建置結果前，不應直接刪除。

### `search.json` 輸出設定需要後續確認

搜尋頁會請求 `/search.json`，但目前主設定未明確看到對應的 `hexo-generator-searchdb` JSON 輸出設定。

需要後續確認：

- 實際建置是否產生 `public/search.json`。
- `hexo-generator-searchdb` 目前版本的有效設定。
- 搜尋頁在正式站是否正常載入索引。

在完成確認前，不應假設搜尋功能一定正常，也不應直接修改輸出格式。
