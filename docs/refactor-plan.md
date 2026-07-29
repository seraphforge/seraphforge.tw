# Seraph 唯讀重構盤點與執行計畫

## 文件目的

本文件記錄 Seraph 現有 CSS、EJS、多語路由、設定與搜尋功能的唯讀盤點結果，並提出可以分階段執行、每一步可獨立驗證與回退的重構計畫。

本次盤點沒有修改任何現有網站檔案、沒有安裝 dependencies、沒有執行 build，也沒有進行 Git 寫入或部署。

盤點基準：

- `source/css/custom.css`
- `themes/landscape/layout/_partial/i18n-page.ejs`
- `themes/landscape/layout/page.ejs`
- `themes/landscape/layout/_partial/header.ejs`
- `themes/landscape/layout/_partial/head.ejs`
- `_config.yml`
- `themes/landscape/_config.yml`
- `_config.reimu.yml`
- `source/search/index.md`
- `package.json`
- `package-lock.json`

CSS selector 數量來自唯讀的文字與規則掃描，不是完整 CSS AST 分析。遇到巢狀 `@media`、多行 selector 或複雜 selector 時可能存在統計誤差，因此數字用於辨識規模與熱點，不應作為刪除規則的唯一依據。

---

## 一、現況摘要

### 1. 主要技術債

| 項目 | 已確認現況 | 風險 |
| --- | --- | --- |
| `custom.css` 規模 | 12,504 行，包含 57 個區塊註解、88 個 `@media`、7 個 `@keyframes` | 高 |
| CSS 重複 selector | 約 3,252 次 selector 出現、1,568 個唯一 selector；其中約 605 個 selector 重複出現 | 高 |
| `!important` | 共 3,014 次 | 高 |
| Theme 相關樣式 | 約 239 次 `[data-theme...]` selector，light/dark 與後置 override 高度交錯 | 高 |
| `i18n-page.ejs` 規模 | 1,304 行，同時包含路由、三語 copy、資料、集合運算、HTML 與 inline JavaScript | 高 |
| 三語內容耦合 | 多組 `en`、`zh`、`ja` object 直接寫在同一 EJS | 中至高 |
| 路由來源分散 | `page.ejs`、`header.ejs`、`head.ejs`、`i18n-page.ejs` 各自保存部分路由規則 | 高 |
| Experience 歷史例外 | `/en/experience/`、`/experience/`、`/ja/experience/`，且另有 `/zh/experience/` 頁面 | 高 |
| Projects 平行路由 | Header 指向 `experience/projects`，同時存在獨立 `/projects/` 系列 | 高 |
| 設定重複 | 根設定與 theme 設定有重複且部分不一致的 metadata、language、deploy 等值 | 中 |
| Reimu 設定 | `_config.reimu.yml` 存在，但目前 theme 是 `landscape` | 低至中 |
| 搜尋索引 | 搜尋頁請求 `/search.json`，尚未看到明確的 searchdb JSON 輸出設定 | 中，待確認 |

### 2. 風險分級標準

#### 低風險

- 不改變產出內容的文件、inventory、註解與測試準備。
- 只搬移一個完整、頁面 scope 清楚、位於 cascade 尾端的 CSS 區塊。
- 只抽出不含路由判斷或資料運算的純呈現 partial。

#### 中風險

- 搬移共用元件 CSS。
- 抽出依賴多個 EJS local variable 的 partial。
- 將三語 copy 移到獨立資料檔。
- 合併重複設定但不改網址。
- 調整 searchdb 設定。

#### 高風險

- 重排 `custom.css` cascade。
- 刪除大量 `!important`。
- 合併或刪除歷史路由。
- 修改 Header 語言切換。
- 修改 canonical、`hreflang` 或既有文章 permalink。
- 一次拆分多個 EJS section。
- 在沒有輸出快照與瀏覽器回歸檢查時刪除「看起來未使用」的程式。

### 3. 最高風險區域

1. **CSS cascade 與 Header/theme controls**
   `site-header`、`site-nav`、mobile navigation、language switcher、theme toggle 在多個歷史區塊重複定義，並大量依賴 `!important`。移動順序本身就可能改變畫面。
2. **路由、語言切換與 SEO 的多點定義**
   Projects、Experience、Archives/Writing 的路徑分別存在於 `page.ejs`、`header.ejs`、`head.ejs` 與 `i18n-page.ejs`。單點修改可能讓畫面連結、canonical 與 `hreflang` 不一致。
3. **`i18n-page.ejs` 的內容與呈現耦合**
   同一檔案內同時修改三語文案、路由、文章集合、Project/Lab 資料和 HTML。局部修改很容易只更新一種語言，或破壞其他 section 使用的共用 local variable。

---

## 二、CSS 重構計畫

## 1. `custom.css` 實際結構

### 1.1 規模

- 總行數：12,504。
- 區塊註解：57。
- `!important`：3,014。
- `@media`：88。
- `@keyframes`：7。
- `[data-theme...]` selector：約 239 次。
- `:has(...)`：5 次。
- 約 605 個 selector 出現超過一次。

### 1.2 歷史版本與後置區塊

已確認的歷史或版本註解包括：

- `Final dark home override: keep this at EOF.`
- `Interactive Linux Desktop Portfolio v3.`
- `Security Lab Terminal Hero refresh.`
- `Interactive Linux Terminal Portfolio v2.`
- `Final light-theme override for GitHub Pages cache and legacy theme styles.`
- `Final hero surface correction: keep at absolute EOF.`
- `Final mobile and home shell correction.`
- `Seraph blog OS V2.0 design system.`
- `V2.0 release header RWD fix. Keep at EOF.`
- `Release 1.0 final polish: visual/readability only.`
- `Cyber Lab / Digital Notebook final system. Keep at EOF.`
- `Light Lab / Anonymous Builder final theme.`
- 多個 About 版本區塊。
- `Project Polaris` 系列首頁區塊。
- `Home V1` 系列區塊。
- `Navbar V2`。
- `Experience landing page.`
- `Experience final scope...`
- `Minimal portfolio header and Experience layout.`
- `Engineering Projects detail page.`

這些註解顯示目前 CSS 是透過不斷附加新版本與檔尾修正演進，而不是由單一設計系統組成。

### 1.3 高重複 selector

以下是出現次數較高的 selector；同名不代表每次宣告都完全相同，但代表高覆寫風險：

| Selector | 約略出現次數 |
| --- | ---: |
| `.post-content` | 19 |
| `.mobile-menu-button` | 18 |
| `.featured-projects` | 17 |
| `.main-container` | 17 |
| `.tag-cloud` | 17 |
| `.terminal-stats-grid` | 17 |
| `body` | 17 |
| `.tag-cloud-link` | 15 |
| `.site-header` | 14 |
| `.page-content` | 13 |
| `.site-header .site-title a` | 13 |
| `.site-title a` | 13 |
| `.site-nav a` | 12 |
| `.featured-project-card` | 11 |
| `.featured-project-grid` | 11 |
| `.mobile-nav a` | 11 |
| `.writing-item` | 11 |
| `.mobile-nav` | 10 |
| `.section-title` | 10 |
| `.site-footer` | 10 |
| `:root` | 10 |

### 1.4 `!important` 熱點

高密度區域包括：

- `.site-header .language-switcher a`
- `.site-header .mobile-language-switcher a`
- `.site-header .theme-toggle-button`
- `.site-header .site-nav:not(.language-switcher) a`
- `.site-header .mobile-nav`
- `.site-header .site-title a`
- `.field-notes-index-item`
- `.archive-page.field-notes-index ...`
- `.case-study-item`
- `.lab-experiment-item`
- `.research-direction-item`
- `.experience-page ...`
- `.site-footer.polaris-footer`
- 首頁 `.home-positioning-hero`

`!important` 目前是維持既有 cascade 的一部分，不能直接以「移除數量」作為重構目標。

### 1.5 可能互相覆寫的主要群組

#### Header 與 Navigation

相關 selector：

- `.site-header`
- `.brand-row`
- `.brand-avatar`
- `.brand-content`
- `.site-title a`
- `.site-nav a`
- `.mobile-menu-button`
- `.mobile-nav`
- `.language-switcher`
- `.theme-toggle-button`

這些 selector 橫跨基礎樣式、V2 設計、RWD 修正、Navbar V2、mobile menu IA 與最終 Header controls。屬於最高風險，不應率先搬移。

#### Home

相關版本：

- Interactive Linux Desktop Portfolio
- Security Lab Terminal Hero
- Interactive Linux Terminal Portfolio
- Homepage positioning refresh
- Project Polaris
- Home V1
- Homepage hero final override
- Home shell final override

可能互相覆寫的 selector：

- `.home-page`
- `.home-positioning-hero`
- `.interactive-terminal-hero`
- `.terminal-card`
- `.terminal-screen`
- `.selected-work-item`
- `.latest-field-note-item`
- `.currently-exploring-item`

首頁存在多代結構名稱與最終修正，暫時不應以主題名稱直接拆分。

#### Posts、Pages 與 Archives

可能互相覆寫的 selector：

- `.post-content`
- `.post-body`
- `.page-content`
- `.page-body`
- `.archive-page`
- `.field-notes-index`
- `.field-notes-index-item`

這些 selector 同時受全域 article/card hover 規則與後期 Field Notes 修正影響。可拆分，但必須先建立文章與 archive 視覺基準。

#### Projects、Labs、Research

較新且 scope 較清楚的 selector：

- `.case-study-index`
- `.case-study-item`
- `.lab-studio-index`
- `.lab-experiment-item`
- `.research-v1-page`
- `.research-direction-item`
- `.project-page-hero`

這些是較適合優先盤點與小範圍拆分的候選區域，但仍有全域 `article`、card hover 與 `!important` 交互影響。

#### Experience

相關 selector：

- `.experience-page`
- `.experience-card`
- `.experience-placeholder-card`
- `.experience-muted-card`
- `.experience-detail`
- `.experience-tags`

Experience 後方緊鄰 `Minimal portfolio header...` 區塊，包含不只 Experience 的 Header 規則。不可把整段註解區間直接視為 Experience 專屬 CSS。

## 2. 建議的拆分方向

不建議直接一次拆成通用 `base.css`、`layout.css`、`responsive.css`，因為目前 media queries、theme rules 與頁面規則分散在各版本區塊；重新排序會改變 cascade。

較安全的策略是先抽出「頁面 scope 清楚、原本位於檔案後方、可保持載入順序」的功能檔，再處理共用層。

### Step CSS-1：建立 CSS inventory，不搬移規則

- **涉及檔案**
  - 未來新增 `docs/css-inventory.md` 或等價文件。
  - 不修改 `custom.css`。
- **影響範圍**
  - 無 runtime 影響。
- **風險**
  - 低。
- **內容**
  - 記錄每個註解區塊的行號、主要 selector、對應頁面、theme 與 breakpoint。
  - 對高重複 selector 建立「最後生效位置」清單。
- **驗證方式**
  - 確認 inventory 行號與 selector 可由搜尋重現。
  - `git diff --check`。
- **回退方式**
  - Revert 單一文件 commit。

### Step CSS-2：抽出 Project detail 尾端區塊

- **候選檔名**
  - `source/css/project-detail.css`
- **涉及檔案**
  - `source/css/custom.css`
  - `source/css/project-detail.css`
  - `themes/landscape/layout/_partial/head.ejs` 或只在 Project detail 載入的等價位置，實際位置待確認。
- **影響範圍**
  - `Engineering Projects detail page` 註解之後的 Project detail 樣式。
  - Project detail 的 desktop、mobile、light/dark。
- **風險**
  - 低至中。
- **前提**
  - 先確認該尾端區塊沒有同時包含非 Project selector。
  - 新檔必須維持在 `custom.css` 之後載入，保存原 cascade 順序。
- **驗證方式**
  - 拆分前後保存三語三個 Project detail 的 computed style 與 screenshot。
  - `npm run clean && npm run build`。
  - 檢查三語 Project detail、Header、Footer、mobile。
  - 比較產出 CSS 順序。
- **回退方式**
  - Revert 該單一 commit，恢復原區塊與 stylesheet link。

### Step CSS-3：抽出 Field Notes post 與 archive

- **候選檔名**
  - `source/css/field-notes.css`
- **涉及檔案**
  - `source/css/custom.css`
  - `source/css/field-notes.css`
  - stylesheet 載入位置。
- **影響範圍**
  - `Field Notes V1`。
  - `Field Notes Index V1`。
  - 後方 Field Notes link fix。
- **風險**
  - 中。
- **前提**
  - 先找出所有 `.post-*`、`.archive-*`、`.field-notes-*` 後置 override。
  - 不把全域 `.post-content` 或 `article` 規則直接搬入，除非已確認其他頁面不使用。
- **驗證方式**
  - 各語言至少一篇文章。
  - `/archives/`、`/zh/archives/`、`/ja/archives/`。
  - Heading anchors、code copy、reading progress、back-to-top。
  - Long title、code block、blockquote、圖片與 mobile。
- **回退方式**
  - Revert 單一拆分 commit。

### Step CSS-4：分別抽出 Projects index、Labs index、Research

- **候選檔名**
  - `source/css/projects.css`
  - `source/css/labs.css`
  - `source/css/research.css`
- **涉及檔案**
  - `source/css/custom.css`
  - 上述新檔
  - stylesheet 載入位置。
- **影響範圍**
  - `.case-study-index`、`.case-study-item`
  - `.lab-studio-index`、`.lab-experiment-item`
  - `.research-v1-page`、`.research-direction-item`
- **風險**
  - 中。
- **拆分原則**
  - 三個頁面族群分三個 commit，不同時移動。
  - 保留原區塊內 media queries。
  - 保留原規則順序。
- **驗證方式**
  - 三語 Projects index。
  - 三語 Labs index 與所有 Lab detail。
  - Experience Research detail。
  - Hover、focus、dark/light、mobile。
- **回退方式**
  - 每一頁面族群獨立 revert。

### Step CSS-5：抽出 Experience

- **候選檔名**
  - `source/css/experience.css`
- **涉及檔案**
  - `source/css/custom.css`
  - `source/css/experience.css`
  - stylesheet 載入位置。
- **影響範圍**
  - Experience landing、cards、detail、filters、三語頁面。
- **風險**
  - 中至高。
- **前提**
  - 將 Experience selector 與同區段內的全域 Header selector逐條分離。
  - 不直接搬移整個 `Minimal portfolio header and Experience layout` 區塊。
- **驗證方式**
  - `/en/experience/`
  - `/experience/`
  - `/zh/experience/`
  - `/ja/experience/`
  - 所有 Experience detail category。
  - Filter、前後篇導覽、related cards、Schema markup。
- **回退方式**
  - Revert Experience 單一 commit。

### Step CSS-6：處理 About

- **候選檔名**
  - `source/css/about.css`
- **涉及檔案**
  - `source/css/custom.css`
  - `source/css/about.css`
- **影響範圍**
  - 英文、中文、日文 About。
- **風險**
  - 高。
- **原因**
  - About 至少存在四組不同時期的設計註解與針對 Markdown 結構的 `nth-of-type` selector。
- **驗證方式**
  - 三語 About 完整 screenshot。
  - 檢查 Markdown heading、blockquote、段落順序與所有 breakpoint。
- **回退方式**
  - Revert 單一 About commit。

### Step CSS-7：最後才處理 Base、Layout、Navigation、Home、Responsive

- **候選檔名**
  - `tokens.css`
  - `base.css`
  - `layout.css`
  - `navigation.css`
  - `home.css`
  - `responsive.css`
- **涉及檔案**
  - `source/css/custom.css`
  - 新增的共用 CSS。
- **影響範圍**
  - 全站。
- **風險**
  - 高。
- **執行條件**
  - 頁面專屬樣式已先拆分。
  - 已建立視覺 baseline。
  - 已確認所有 stylesheet 的固定載入順序。
- **驗證方式**
  - 全站三語路由矩陣。
  - Desktop、tablet、mobile。
  - Light/dark。
  - Keyboard focus。
  - Screenshot diff。
- **回退方式**
  - 每一類只做一個 commit。
  - 發現跨頁差異立即 revert，不在同一 commit 追加補丁。

## 3. 暫時不應移動的 CSS

- 所有帶有 `keep at EOF`、`absolute EOF`、`final override` 的規則。
- Header、language switcher、theme toggle、mobile navigation。
- `:root` 與 `[data-theme]` tokens。
- 全域 `body`、`html`、`article`、`.main-container`、`.page-content`、`.post-content`。
- Project Polaris 與 Home V1 互相覆寫的首頁區塊。
- About 的多版本與 `nth-of-type` 規則。
- 同時混有 Experience 與 Header selector 的後期區塊。
- 尚未確認實際使用頁面的舊 terminal hero styles。

---

## 三、EJS 重構計畫

## 1. `i18n-page.ejs` 現有責任

`themes/landscape/layout/_partial/i18n-page.ejs` 共 1,304 行，目前包含：

### 路由與語言判斷

- 從 `page.path` 判斷 `en`、`zh`、`ja`。
- 將 `works` 映射為 `projects`。
- 將 `archives` 映射為 `writing`。
- 保存三語 `paths` object。
- 透過 `withLang()`、`localHref()`、`detailHref()`、`projectHref()` 組合網址。

### 三語資料

- 全域 `copy`。
- `caseStudyCopy`。
- `labStudioCopy`。
- `labReadCopy`。
- `experienceCards`。
- `writingCopy`。
- `spaceGuideCopy`。
- `homeV1Copy`。
- `uiCopy`。

### 集合與衍生資料

- 從 `site.posts` 依語言產生 `recentPosts`、`allPosts`。
- 從文章 tags 產生 `tagMap` 與 tag cloud。
- 閱讀時間計算。
- 文章 category、tags、摘要。
- Homepage stats。
- Latest post 與 latest lab。

### 頁面呈現函式

- Home hero。
- Space guide。
- Why Seraph Exists。
- Exploration Areas。
- Selected Works。
- Latest Field Notes。
- Currently Exploring。
- Home Epilogue。
- Projects。
- Labs。
- Writing list。
- Tag cloud。
- Timeline。
- About。
- Experience cards。
- CTA、profile、stats 等候選舊函式。

### Inline JavaScript

- Experience 搜尋與 filters。

## 2. 三語分支方式

目前主要模式是：

```ejs
const copy = {
  en: { ... },
  zh: { ... },
  ja: { ... }
};

const t = copy[lang];
```

另有多組獨立 object 以相同方式分支，例如：

```ejs
const labStudioCopy = { en: ..., zh: ..., ja: ... }[lang];
```

也存在 inline ternary：

```ejs
lang === 'zh' ? ... : (lang === 'ja' ? ... : ...)
```

三語不同步的最高風險點：

- `copy` 主 object。
- `homeV1Copy`。
- `experienceCards`。
- `caseStudyCopy`。
- `labStudioCopy`。
- `uiCopy`。
- `t.nav` 的後置 `Object.assign`。
- `t.labsList.splice(...)` 的三語 inline 補項。

### 已確認的歷史殘留候選

1. `caseStudyCopy` 先建立一組三語資料，隨後立即被第二組 object 完整覆寫。第一組在目前檔內沒有機會被 render 使用。
2. `renderStats()` 有定義，但末端 section dispatch 沒有呼叫。
3. `renderProfilePanel()` 有定義，但末端 dispatch 沒有呼叫。
4. `renderRecentPosts()` 有定義，但末端 dispatch 沒有呼叫。
5. `renderCTA()` 有定義，但末端 dispatch 沒有呼叫。
6. About render branch 存在，但 `page.ejs` 的 `i18nPagePaths` 沒有列出 About 路徑；About 目前走一般 Markdown page。
7. Experience render branch 存在，但 `page.ejs` 會先將 Experience landing/detail 分流至專用 Experience partial。

以上只能視為「候選未使用程式」。刪除前必須比對建置輸出與所有路由，不可只靠文字搜尋直接刪除。

## 3. 可拆分的 partial

### Step EJS-1：建立 render contract inventory

- **涉及檔案**
  - 未來新增 EJS inventory 文件。
  - 不修改 EJS。
- **影響範圍**
  - 無 runtime 影響。
- **風險**
  - 低。
- **內容**
  - 為每個 render function 記錄輸入 locals、使用資料、輸出 class 與呼叫路徑。
- **驗證方式**
  - 搜尋函式定義與呼叫。
  - 對照 `page.ejs` 的分流。
- **回退方式**
  - Revert 文件 commit。

### Step EJS-2：先抽出純 Home section partial

建議每次只抽一個：

```text
themes/landscape/layout/_partial/home/hero.ejs
themes/landscape/layout/_partial/home/space-guide.ejs
themes/landscape/layout/_partial/home/why-seraph.ejs
themes/landscape/layout/_partial/home/exploration-areas.ejs
themes/landscape/layout/_partial/home/selected-works.ejs
themes/landscape/layout/_partial/home/latest-field-notes.ejs
themes/landscape/layout/_partial/home/currently-exploring.ejs
themes/landscape/layout/_partial/home/epilogue.ejs
```

- **涉及檔案**
  - `i18n-page.ejs`
  - 每次新增一個 partial。
- **影響範圍**
  - Home 與 Dashboard；目前兩者共用同一套 Home render sequence。
- **風險**
  - 低至中。
- **優先順序**
  - 優先抽純 HTML、只讀 `homeV1Copy` 與 `lang` 的 section。
  - `latest-field-notes` 依賴文章集合，應較後處理。
- **驗證方式**
  - 比較抽出前後 `/`、`/zh/`、`/ja/`、三語 dashboard 的 HTML。
  - 瀏覽器比較三語首頁。
- **回退方式**
  - 每個 partial 一個 commit，可單獨 revert。

### Step EJS-3：抽出頁面級 partial

候選：

```text
themes/landscape/layout/_partial/pages/projects.ejs
themes/landscape/layout/_partial/pages/labs.ejs
themes/landscape/layout/_partial/pages/writing.ejs
themes/landscape/layout/_partial/pages/timeline.ejs
```

- **涉及檔案**
  - `i18n-page.ejs`
  - 每次新增一個 page partial。
- **影響範圍**
  - 對應三語 section。
- **風險**
  - 中。
- **注意**
  - Projects 依賴 `caseStudyCopy`、`caseStudyLinks`。
  - Labs 依賴 `labStudioCopy`、`labExperimentLinks`。
  - Writing 依賴 `allPosts`、post helper functions、`tagList`。
  - Timeline 依賴 `t.timeline` 與 guide。
- **驗證方式**
  - 對應三語 route 的 HTML diff。
  - 空文章、無 tag 等 fallback 狀態待確認。
- **回退方式**
  - 每個 page partial 一個 commit。

### Step EJS-4：抽出共用 component partial

候選：

```text
themes/landscape/layout/_partial/components/page-hero.ejs
themes/landscape/layout/_partial/components/guide-links.ejs
themes/landscape/layout/_partial/components/tag-cloud.ejs
```

- **影響範圍**
  - 多個 section。
- **風險**
  - 中。
- **共用性**
  - `renderPageHero` 共用性高。
  - `renderGuide` 被多個頁面使用。
  - Tag cloud 可獨立，但依賴文章集合。
- **驗證方式**
  - 所有呼叫 component 的 section 都必須檢查。
  - 比較 attributes、ARIA labels、class 與連結完全相同。
- **回退方式**
  - 一個 component 一個 commit。

### Step EJS-5：將 Experience inline script 移出

- **候選檔案**
  - `source/js/experience-filters.js`
- **涉及檔案**
  - `i18n-page.ejs` 或實際使用 Experience filter 的 partial。
  - 新增 JavaScript。
- **影響範圍**
  - Experience 搜尋與 filters。
- **風險**
  - 中至高。
- **前提**
  - 先確認 `renderExperienceCards()` 在目前路由是否實際輸出。
  - 若目前未輸出，不應先以「重構」名義啟用它。
- **驗證方式**
  - Input、year、category、organization、skills filters。
  - 多個 filter 組合與清空。
  - 三語頁面。
- **回退方式**
  - Revert script extraction commit。

### Step EJS-6：三語 copy 移到資料層

- **候選結構**
  - `source/_data/i18n/home.json`
  - `source/_data/i18n/projects.json`
  - `source/_data/i18n/labs.json`
  - `source/_data/i18n/ui.json`
- **涉及檔案**
  - `i18n-page.ejs`
  - 新增 `_data` files。
- **影響範圍**
  - 三語文案與頁面資料。
- **風險**
  - 中至高。
- **原則**
  - 一次只搬一組 copy。
  - 保持 key、array order 與文字完全不變。
  - 不在搬移 commit 中改文案。
- **驗證方式**
  - 三語 HTML diff。
  - 檢查 YAML/JSON encoding。
  - 檢查缺 key 時的行為。
- **回退方式**
  - 每組 copy 一個 commit。

### Step EJS-7：最後清理候選未使用程式

- **候選**
  - 第一組被覆寫的 `caseStudyCopy`。
  - 未被末端 dispatch 呼叫的 render functions。
  - About 與 Experience 的疑似不可達 branch。
- **影響範圍**
  - 理論上不應改變輸出，但實際仍需確認。
- **風險**
  - 中。
- **停止條件**
  - 任一建置 HTML 發生差異，即停止刪除並回退。
- **驗證方式**
  - 全路由 build output diff。
  - 搜尋動態引用與 partial scope。
- **回退方式**
  - 一個候選項目一個 commit，逐一 revert。

## 4. 直接綁定路由的位置

`i18n-page.ejs` 內已確認：

- `paths` object 直接列出各語言主要 route。
- `withLang()` 假設英文無 prefix、中文與日文使用語言 prefix。
- `firstPart === 'works'` 映射 Projects。
- `firstPart === 'archives'` 映射 Writing。
- Experience cards 直接保存 `experience/<slug>`。
- Projects data 直接保存 `/projects/<slug>/`。
- Labs data 直接保存 `labs/<slug>`。
- `labExperimentLinks` 與 `caseStudyLinks` 依 array index 對應內容。

這類「資料 array 與 links array 依 index 對齊」的設計容易在新增項目時錯位。後續可改為每筆資料自帶 `href` 或 `slug`，但屬於中風險資料模型變更，不能和 partial extraction 同時進行。

---

## 四、路由與三語整理計畫

## 1. 目前應保持不動的路由

在沒有 redirect 策略、正式站流量資料與完整 link inventory 前，以下路由全部保持：

- 英文根路徑 `/`。
- 中文 `/zh/`。
- 日文 `/ja/`。
- `/en/experience/`。
- `/experience/`。
- `/zh/experience/`。
- `/ja/experience/`。
- `/experience/projects/` 及語言版本。
- `/projects/` 及語言版本。
- `/archives/`、`/writing/` 及語言版本。
- 現有文章 permalink。

## 2. 已確認的路由差異

### Projects

`i18n-page.ejs` 的主要 Projects route：

```text
/projects/
/zh/projects/
/ja/projects/
```

但 `header.ejs` 的 Projects navigation 使用：

```text
/experience/projects/
/zh/experience/projects/
/ja/experience/projects/
```

因此 Projects index 與 Experience Projects detail/section 目前是平行入口，不應假設兩者可直接合併。

### Experience

`header.ejs` 與 `head.ejs` 使用的主要 Experience 對應：

```text
English: /en/experience/
Chinese: /experience/
Japanese: /ja/experience/
```

但 `i18n-page.ejs` 的 `paths` object 使用：

```text
English: /experience/
Chinese: /zh/experience/
Japanese: /ja/experience/
```

這兩套 mapping 不一致，是高風險區域。

### Archives 與 Writing

`header.ejs` 將 Articles 指向 Archives：

```text
/archives/
/zh/archives/
/ja/archives/
```

`i18n-page.ejs` 則有 Writing pages，並把 `archives` section 映射成 `writing`。兩者呈現與用途相近，但不能在未確認輸出及內部連結前合併。

## 3. canonical、`hreflang` 與語言切換風險

### Canonical

`head.ejs` 優先使用 `page.canonical_url`，否則由 `config.url` 與 `page.path` 組合。

風險：

- 改 route 但未改 front matter 的 `canonical_url`。
- 保留舊頁但兩頁都 canonical 到自己，形成重複內容。
- 刪除舊頁後外部連結失效。

### `hreflang`

`head.ejs` 另有：

- `trilingualDetailPaths`
- `detailHreflangPaths`
- `postHreflangPaths`
- `sectionHreflangPaths`

風險：

- 新增 detail route 未加入 `trilingualDetailPaths`。
- 修改 Experience mapping，只改 Header 沒改 `head.ejs`。
- 某語言頁面不存在，但仍輸出 alternate link。

### 語言切換

`header.ejs` 會依：

- URL prefix。
- `canonical_url`。
- source path。
- `site_lang`、`lang`、`config.language`。
- 頁面是否存在。

決定目前語言與目標 route。

風險：

- 英文 Experience 的 `/en/` 例外與一般英文無 prefix 規則衝突。
- 文章翻譯不存在時回到 archives。
- Projects 平行 route 可能切換到另一種資訊架構。

## 4. 未來可執行的路由整理

### Route Step 1：建立 route matrix

- 列出所有 source pages、產出路徑、Header link、canonical、`hreflang` 與語言切換目標。
- 不修改任何 route。
- 風險：低。
- 回退：Revert inventory 文件。

### Route Step 2：選定 canonical route policy

需要明確決策：

- Experience 的 canonical landing 是否使用 `/experience/` 或 `/zh/experience/`。
- Projects navigation 應指向 Project index 還是 Experience Projects。
- Archives 與 Writing 是否是不同頁面。

決策前狀態為「待確認」。

### Route Step 3：先加 redirect，再改內部連結

若日後統一路由：

1. 先建立舊 URL 到新 URL 的 redirect 或保留頁。
2. 驗證 GitHub Pages 實際支援的 redirect 方案；目前為「待確認」。
3. 再修改 Header。
4. 再修改語言切換。
5. 再修改 canonical 與 `hreflang`。
6. 最後才考慮刪除舊 source page。

每一步獨立 commit，任一步驟不得同時大規模更改文章 permalink。

---

## 五、設定重複盤點

## 1. 根 `_config.yml`

### 目前有效

作為 Hexo site config，已確認包含：

- `title`
- `subtitle`
- `description`
- `keywords`
- `author`
- `language: en`
- `timezone`
- `url`
- `root`
- `theme: landscape`
- `deploy`
- `feed`
- `sitemap`

客製 theme 透過 `config.title`、`config.description`、`config.keywords`、`config.author`、`config.language`、`config.url`、`config.root` 讀取其中多個值。

## 2. `themes/landscape/_config.yml`

### 已確認存在

包含：

- Site metadata。
- `language: zh-TW`。
- URL 與 root。
- permalink。
- directory。
- writing。
- index generator。
- category/tag。
- metadata。
- date/time。
- pagination。
- theme。
- deploy。

### 判斷

- 此檔是目前本地 Landscape 的 theme config。
- 但其中許多欄位看起來屬於 Hexo site-level 設定，而不是客製 EJS 直接透過 `theme` object 使用。
- 在 `themes/landscape` 中未搜尋到 `theme.<key>` 的直接引用。
- Hexo 對 theme config 與 site config 的實際合併、覆蓋與 plugin 讀取行為，在本階段未 build，細節標記為「待確認」。
- 不能因為沒有直接 EJS 引用就判斷全部無效，plugins 或 Hexo core 的行為仍需驗證。

### 明顯不一致

- 根：`language: en`
- Theme：`language: zh-TW`
- subtitle、description、keywords 不一致。
- deploy 設定重複。

## 3. `_config.reimu.yml`

### 已確認

- 目前 `_config.yml` 指定 `theme: landscape`。
- Repository 內未找到 `_config.reimu.yml` 的其他引用。
- 檔案包含 Reimu menu、banner、dark mode、comments、search、injector 等設定。
- `generator_search.enable: false` 位於此檔。

### 判斷

- 對目前 Landscape theme 而言，這份檔案屬於歷史殘留或保留設定的可能性高。
- 是否仍被某個外部命令、未提交 workflow 或開發者手動 multi-config 流程使用，為「待確認」。
- 在未確認前只標記，不刪除。

## 4. 設定整理原則

1. 先記錄每個 key 的實際讀取者。
2. 先驗證 build config，不直接刪除重複 key。
3. metadata、language、URL、root 優先以根設定作為單一來源的候選。
4. theme config 只保留真正的 theme-specific key，實際清單待確認。
5. Reimu 設定是否歸檔或刪除必須另做決策。
6. Deploy 設定與 GitHub Actions 是兩條不同路徑；整理時不要誤觸正式部署。

---

## 六、搜尋功能判斷

## 1. 目前搜尋頁行為

`source/search/index.md` 建立 title 為 `Search` 的 page。

`themes/landscape/layout/page.ejs` 以：

```ejs
page.title === 'Search'
```

判斷是否輸出客製搜尋 UI，並在瀏覽器執行：

```js
fetch('/search.json')
```

實際 EJS 使用 `url_for('/search.json')` 產生 URL。

取得 JSON 後：

- 讀取 `title`、`content`、`date`、`url`。
- 將 HTML content 轉為純文字。
- 以 title 或 content 做 client-side substring filter。
- 顯示最多由目前完整 matched array 決定的結果；未看到分頁或數量限制。

`source/search/index.md` 自己還包含另一組 `#local-search-input` 與 `#local-search-result` markup，但 `page.ejs` 在 title 為 `Search` 時不輸出 `page.content`，因此這組 Markdown body 搜尋 markup 目前不會成為主要 UI。

## 2. Plugin 與設定

已確認：

- `package.json` 依賴 `hexo-generator-searchdb: ^1.5.0`。
- `package-lock.json` 鎖定 `hexo-generator-searchdb` 1.5.0。
- `_config.yml` 沒有 `search:` 設定。
- `themes/landscape/_config.yml` 沒有 `search:` 設定。
- `_config.reimu.yml` 有 `generator_search.enable: false`，但目前 Reimu 未啟用。
- Repository 內未找到其他 `search.json` 或 `search.xml` 設定。

## 3. 判斷

- 搜尋 UI 明確期待 `/search.json`。
- Plugin 已安裝於 dependency graph。
- 是否在無設定時預設輸出 `search.json`，本階段未讀取 plugin 原始碼或官方文件，也未 build，因此為「待確認」。
- 正式建置是否存在 `public/search.json`，本階段禁止 build，因此為「待確認」。
- 目前不能判定搜尋功能正常，也不能判定一定失效。
- Phase 2E 應先驗證輸出，再決定是否補設定；不能直接修正。

---

## 七、建議執行順序

## Phase 2A：低風險準備

### 具體修改內容

1. 新增 CSS inventory，記錄註解區段、selector scope 與 cascade 熱點。
2. 新增 EJS render contract inventory。
3. 建立完整 route matrix。
4. 建立三語頁面與 viewport 的視覺 baseline。
5. 記錄主要頁面的產出 HTML hash 或可比較 snapshot。
6. 不搬移 CSS、不拆 EJS、不改 route。

### 驗證指令

```bash
git diff --check
git status --short
```

建立 baseline 的實際執行階段可再使用：

```bash
npm run clean
npm run build
npm run server
```

### 瀏覽器手動檢查

- 三語 Home。
- 三語 Projects、Labs、Writing。
- 三語 Experience landing 與 detail。
- 三語文章與 Archives。
- About。
- Header、mobile menu、language switcher。
- Light/dark。
- Desktop、tablet、mobile。

### 建議 commit message

```text
docs: inventory css cascade and page ownership
docs: map ejs render contracts
docs: add multilingual route matrix
test: add visual regression baseline
```

### 停止條件

- 無法確定某區塊對應的實際頁面。
- Baseline build 已有錯誤。
- 正式站與本機輸出明顯不同。
- 工作目錄存在未辨識變更。

## Phase 2B：CSS 小範圍拆分

### 具體修改內容

建議順序：

1. Project detail 尾端 scoped CSS。
2. Field Notes。
3. Projects index。
4. Labs index。
5. Research。
6. Experience。
7. About。
8. 最後才處理 Header、Home、tokens、base、layout、responsive。

每次只拆一個頁面族群，保持原規則順序與 stylesheet 載入順序，不同時清理 `!important`。

### 驗證指令

```bash
npm run clean
npm run build
git diff --check
git status --short
```

若已有 screenshot 工具，再執行對應 visual regression；工具與命令目前為「待確認」。

### 瀏覽器手動檢查

- 本次拆分的三語頁面。
- Desktop、tablet、mobile。
- Light/dark。
- Hover、focus、active。
- Header 與 Footer 是否受到全域 selector 影響。
- 至少一個不相關頁面作為 negative control。

### 建議 commit message

```text
style: extract project detail styles
style: extract field notes styles
style: extract projects index styles
style: extract labs index styles
style: extract experience styles
```

### 停止條件

- Computed style 或 screenshot 出現非預期差異。
- 必須新增更多 `!important` 才能保持原畫面。
- 新檔無法保持原 cascade 順序。
- 一次修改開始影響兩個以上不相關頁面族群。
- 找到 selector 同時被未知頁面使用。

## Phase 2C：EJS 小範圍拆分

### 具體修改內容

1. 每次抽一個純 Home section partial。
2. 每次抽一個 page partial。
3. 再抽共用 page hero、guide、tag cloud。
4. 最後才搬移三語 copy。
5. 候選未使用程式逐項驗證、逐項刪除。
6. 不在 partial extraction commit 中修改文案、class、route 或資料格式。

### 驗證指令

```bash
npm run clean
npm run build
git diff --check
git status --short
```

若建立 HTML snapshot：

```text
實際 snapshot 比較命令：待確認
```

### 瀏覽器手動檢查

- 被拆 section 的三語頁面。
- Home 與 Dashboard，因目前共用 render sequence。
- Internal links。
- ARIA attributes。
- 文章列表排序、tags、摘要與閱讀時間。
- Empty state，測試方法待確認。

### 建議 commit message

```text
refactor: extract home hero partial
refactor: extract selected works partial
refactor: extract projects page partial
refactor: extract labs page partial
refactor: extract writing page partial
refactor: move home copy to data
```

### 停止條件

- 抽出前後產出 HTML 不同。
- Partial 需要隱含依賴過多 global locals。
- 三語任一版本缺 key。
- Route 或 link 發生變化。
- 為了完成抽出而必須同時修改 CSS。

## Phase 2D：路由與設定整理

### 具體修改內容

1. 完成 route matrix 與正式 canonical policy 決策。
2. 確認 redirect 方案。
3. 先保留舊路由，再更新內部連結。
4. 分開修改 Header、language switcher、canonical、`hreflang`。
5. 驗證後才考慮移除平行頁面。
6. 逐 key 整理 `_config.yml` 與 theme config。
7. 決定 `_config.reimu.yml` 是保留、歸檔或刪除；目前待確認。

### 驗證指令

```bash
npm run clean
npm run build
git diff --check
git status --short
```

另需執行 link、canonical、`hreflang` 檢查；現有自動化命令為「待確認」。

### 瀏覽器手動檢查

- 所有舊 URL。
- 所有新 canonical URL。
- Header desktop/mobile links。
- 三語切換。
- View source 中的 canonical。
- View source 中的 `hreflang` 與 `x-default`。
- 404。
- Sitemap。

### 建議 commit message

```text
docs: define canonical multilingual routes
fix: align project navigation routes
fix: align experience language routes
seo: update canonical and hreflang mappings
config: remove verified duplicate theme settings
```

### 停止條件

- 尚未確認 redirect 支援方式。
- 舊 URL 回傳 404。
- canonical 指向不存在頁面。
- `hreflang` 指向錯誤語言。
- 語言切換從 detail 跳到錯誤 section。
- Sitemap 同時輸出意外的重複 canonical 頁面。

## Phase 2E：搜尋功能驗證

### 具體修改內容

1. 先在不改設定的情況下建置。
2. 確認是否產生 `public/search.json`。
3. 檢查 JSON schema 是否包含 `title`、`content`、`date`、`url`。
4. 在本機 Search page 執行查詢。
5. 只有在確認輸出缺失或格式錯誤後，才研究並新增 `hexo-generator-searchdb` 的明確設定。
6. 搜尋設定修正與搜尋 UI 修改分成不同 commit。

### 驗證指令

```bash
npm run clean
npm run build
Test-Path public/search.json
npm run server
git diff --check
git status --short
```

若在非 PowerShell 環境，檔案存在檢查命令需改用對應 shell。

### 瀏覽器手動檢查

- `/search/` 載入時沒有 fetch error。
- 空字串顯示提示。
- 英文關鍵字。
- 中文關鍵字。
- 日文關鍵字。
- 特殊字元。
- 無結果狀態。
- 結果 URL 可開啟。
- 結果日期與摘要正常。

### 建議 commit message

```text
test: verify generated search index
config: define searchdb json output
fix: align search page with generated index
```

### 停止條件

- Plugin 預設行為尚未由實際產物或官方文件確認。
- JSON schema 與 UI 期待不同。
- 修正需要同時更換 plugin。
- 搜尋結果 URL 與三語 route 不一致。
- 正式站與本機結果不同。

---

## 八、建議最先執行的第一個小步驟

**先新增 CSS cascade inventory，不搬移任何 CSS。**

具體成果應是一份表格，逐一記錄 `custom.css` 的 57 個註解區段：

- 起訖行。
- 主要 selector。
- 對應頁面。
- theme scope。
- breakpoint。
- 是否含 `!important`。
- 是否被後方同 selector 覆寫。
- 是否標記 `keep at EOF`。
- 建議保留、可拆分或待確認。

這一步：

- 不改 runtime。
- 可單獨 commit。
- 可直接 revert。
- 能為後續每一次 CSS 搬移提供可驗證邊界。
- 可以避免把註解名稱誤當成真正的 selector scope。

建議 commit message：

```text
docs: inventory custom css cascade
```
