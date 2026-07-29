# Seraph 開發指南

## 1. 開發環境

目前已確認的環境需求：

- Node.js
- npm
- Git
- Hexo 8（由專案 dependencies 安裝）

GitHub Actions 使用 Node.js 20，因此本機優先使用 Node.js 20，以減少本機與 CI 的版本差異。

## 2. 本機安裝

Clone repository 後，在專案根目錄安裝 dependencies：

```bash
npm install
```

專案目前包含 `package-lock.json`。是否將 GitHub Actions 與日常本機安裝統一改為 `npm ci` 屬於「待確認」；在正式調整 workflow 前，沿用既有方式。

安裝後不應提交：

- `node_modules/`
- `public/`
- Hexo cache
- log
- deploy 暫存目錄

這些項目已列入 `.gitignore`。

## 3. 啟動本機網站

啟動 Hexo server：

```bash
npm run server
```

依 Hexo 預設行為，終端機會顯示本機預覽網址。實際 host 與 port 以當次命令輸出為準。

若遇到舊產物或 cache 影響，可先執行：

```bash
npm run clean
npm run server
```

只產生靜態網站、不啟動 server：

```bash
npm run build
```

## 4. 修改位置指南

### 4.1 修改文章

主要位置：

```text
source/_posts/
```

同一文章通常有三語版本：

```text
article.en.md
article.md
article.ja.md
```

修改前檢查：

- `title`
- `date`、`updated`
- `site_lang`
- `translation_key`
- `categories`
- `tags`
- `cover`
- `permalink`
- `description`
- `canonical_url`

已發布文章的 `permalink` 不應隨意更改。

### 4.2 修改 Project

Project landing page 的內容與清單目前部分位於：

```text
themes/landscape/layout/_partial/i18n-page.ejs
```

Project detail 內容位於：

```text
source/projects/<slug>/index.md
source/zh/projects/<slug>/index.md
source/ja/projects/<slug>/index.md
```

新增 Project 時需同時確認：

- 三語 detail 是否都已建立。
- `i18n-page.ejs` 的 Project 清單是否需要新增項目。
- Header 使用的 Projects 路徑是否與預期一致。
- SEO `hreflang` 的 detail path 清單是否需要更新。

### 4.3 修改 Lab

一般 Lab landing 與清單主要涉及：

```text
themes/landscape/layout/_partial/i18n-page.ejs
source/labs/
source/zh/labs/
source/ja/labs/
```

Lab detail：

```text
source/labs/<slug>/index.md
source/zh/labs/<slug>/index.md
source/ja/labs/<slug>/index.md
```

另外還有獨立的 `/lab/` 特殊頁：

```text
source/lab/index.md
themes/landscape/layout/lab.ejs
source/css/lab.css
source/js/lab.js
```

修改前應先判斷需求是 `/labs/` 內容系統，還是 `/lab/` 特殊展示頁。

### 4.4 修改 Experience

Experience landing 的結構化三語資料：

```text
source/_data/experience.json
```

Experience landing 呈現：

```text
themes/landscape/layout/_partial/experience-page.ejs
```

Experience detail 呈現：

```text
themes/landscape/layout/_partial/experience-detail.ejs
```

各分類內容：

```text
source/experience/<category>/index.md
source/zh/experience/<category>/index.md
source/ja/experience/<category>/index.md
```

英文 Experience landing 另位於：

```text
source/en/experience/index.md
```

Experience 有歷史性路由例外。修改任何 Experience URL 或導覽前，先閱讀 `docs/architecture.md` 的路由章節。

### 4.5 修改導覽列

主要檔案：

```text
themes/landscape/layout/_partial/header.ejs
```

修改導覽項目時必須同步檢查：

- English、Traditional Chinese、Japanese labels。
- Desktop navigation。
- Mobile navigation。
- Active section 判斷。
- 語言切換後的目標路徑。
- 實際 `source/` 頁面是否存在。
- `head.ejs` 的 `hreflang` 對應。

### 4.6 修改 SEO

全站 metadata 與語言 alternate：

```text
themes/landscape/layout/_partial/head.ejs
```

網站基本資料：

```text
_config.yml
```

其他 SEO 相關檔案：

```text
sitemap_template.xml
source/robots.txt
source/favicon.svg
source/images/seraph-og.png
```

文章層 SEO 通常由 front matter 控制：

```yaml
description:
cover:
canonical_url:
```

修改時檢查：

- `<title>`
- meta description
- canonical
- Open Graph
- Twitter Card
- `hreflang`
- 分享圖片是否存在

### 4.7 修改 CSS

全站主要樣式：

```text
source/css/custom.css
```

特殊 Lab 樣式：

```text
source/css/lab.css
```

`custom.css` 目前很大，且包含多代後置 override。修改 CSS 前：

1. 搜尋目標 class 或 selector 的所有出現位置。
2. 確認後方是否有更高 specificity 或相同 selector。
3. 同時測試 light mode 與 dark mode。
4. 測試 desktop、tablet、mobile。
5. 避免以新的全域 `!important` 疊加未理解的舊規則。
6. 不要在一般內容變更中順便大量整理 CSS。

## 5. 三語同步檢查清單

### 內容

- [ ] English 版本已更新
- [ ] Traditional Chinese 版本已更新
- [ ] Japanese 版本已更新
- [ ] 三語標題與摘要語意一致
- [ ] 圖片、連結、code block 在三語版本都有效

### Front matter

- [ ] `site_lang` 各自正確
- [ ] `translation_key` 三語一致
- [ ] `date` 對應正確
- [ ] `updated` 已視需要更新
- [ ] `categories`、`tags` 符合各語言既有慣例
- [ ] `cover` 指向存在的檔案

### URL 與 SEO

- [ ] English `permalink` 使用根路徑
- [ ] Traditional Chinese `permalink` 使用 `/zh/`
- [ ] Japanese `permalink` 使用 `/ja/`
- [ ] `canonical_url` 與 `permalink` 一致
- [ ] 語言切換會前往存在的頁面
- [ ] `hreflang` 包含正確的三語網址
- [ ] 沒有意外建立重複路徑

### UI

- [ ] Desktop header 正常
- [ ] Mobile menu 正常
- [ ] 長英文標題不溢出
- [ ] 中文與日文字型、換行正常
- [ ] Light mode 與 dark mode 可讀

## 6. 本地驗證流程

### 步驟一：確認變更範圍

```bash
git status --short
git diff --stat
git diff
```

確認沒有混入不屬於本次工作的檔案。

### 步驟二：清理與建置

```bash
npm run clean
npm run build
```

確認 Hexo 沒有 template error、YAML error 或 renderer error。

### 步驟三：搜尋必要產物

建置後應至少確認：

- `public/index.html`
- 三語主要頁面
- 本次修改的 detail pages
- 文章 permalink 對應的 HTML
- Sitemap
- Feed

搜尋頁需要的 `public/search.json` 是否實際產生，目前為「待確認」。

### 步驟四：本機預覽

```bash
npm run server
```

手動檢查：

- 首頁。
- 本次修改頁面。
- 三語切換。
- Header 與 mobile menu。
- 內部連結。
- 圖片。
- canonical 與 `hreflang`。
- Desktop 與 mobile viewport。

### 步驟五：Git 檢查

```bash
git diff --check
git status --short
```

`git diff --check` 不應出現 trailing whitespace 或 whitespace error。

## 7. Git 工作流程

建議流程：

1. 確認目前 branch 與工作目錄狀態。
2. 建立範圍單一的變更。
3. 執行本地建置與必要的三語檢查。
4. 閱讀完整 diff。
5. 執行 `git diff --check`。
6. 只 stage 本次變更。
7. 使用清楚的 commit message。
8. 推送前再次確認不包含 `public/`、`node_modules/` 或無關檔案。
9. 合併或推送至 `main` 後，由 GitHub Actions 部署。

若工作目錄已有他人或前一項工作的變更，不應覆蓋、還原或一起提交；先辨識變更所有權與範圍。

## 8. Commit message 範例

文件：

```text
docs: add project architecture guide
docs: document multilingual content workflow
```

文章：

```text
content: add medical cybersecurity field note
content: update translations for robotics article
```

Project 或 Lab：

```text
content: update NIHS control team case study
content: add ROS2 communication lab notes
```

Theme：

```text
theme: improve mobile navigation behavior
theme: update article metadata rendering
```

樣式：

```text
style: refine project detail spacing
style: fix Japanese title wrapping
```

修正：

```text
fix: correct Chinese article permalink
fix: restore language switcher target
```

Commit message 應描述實際變更，不應使用無法辨識內容的訊息，例如 `update`、`fix stuff` 或 `changes`。

## 9. 禁止與高風險操作

禁止使用：

```bash
git reset --hard
git clean -fd
git push --force
```

也禁止：

- 未確認前大量刪除檔案。
- 為了清理工作目錄而覆蓋他人的未提交變更。
- 未檢查 diff 就大量 stage。
- 將 `node_modules/` 或 `public/` 加入 commit。
- 未驗證三語路徑就修改 permalink。
- 未確認 Pages 部署來源就修改 workflow 或 branch。

若確實需要進行刪除、歷史改寫或其他破壞性操作，必須先說明精確目標、影響與復原方式，取得明確確認後才能進行。

## 10. 部署規則

日常開發不要直接執行：

```bash
npm run deploy
```

正常部署方式：

1. 完成本地驗證。
2. Commit 經確認的變更。
3. Push 至 `main`。
4. 由 `.github/workflows/pages.yml` 建置。
5. GitHub Actions 將 `public/` artifact 部署至 GitHub Pages。

如果 GitHub Actions 失敗，應先查看該次 workflow log，不應立即改用 `npm run deploy` 繞過問題。
