# Seraph Visual Baseline

## 文件目的

本文件定義 Seraph 在 Phase 2B CSS 重構前後必須執行的人工視覺回歸檢查。它是測試規格與紀錄模板，不代表基準截圖已經完成。

後續開始搬移 CSS 前，應先依本文件：

1. 在目前未重構版本完成所有必測頁面截圖。
2. 記錄瀏覽器、viewport、theme 與語言。
3. 將重構後畫面與同一組基準逐項比較。
4. 發現非預期差異時停止，不以追加 override 掩蓋問題。

---

# 1. 測試頁面清單

## 1.1 核心頁面

| Page | English | 繁體中文 | 日本語 | 備註 |
| --- | --- | --- | --- | --- |
| Home | `/` | `/zh/` | `/ja/` | Home 與 Dashboard 目前共用部分呈現邏輯，Dashboard 另列補充測試 |
| About | `/about/` | `/zh/about/` | `/ja/about/` | Markdown 結構與 `.about-page` selector 高度相關 |
| Projects | `/projects/` | `/zh/projects/` | `/ja/projects/` | 與 Header 的 `experience/projects` 導覽路徑不同 |
| Experience | `/en/experience/` | `/experience/`、`/zh/experience/` | `/ja/experience/` | 包含歷史性路由例外；兩個中文入口都要記錄 |
| Labs | `/labs/` | `/zh/labs/` | `/ja/labs/` | 另有 `/lab/` 特殊頁，列入補充測試 |
| Writing | `/writing/` | `/zh/writing/` | `/ja/writing/` | 文章清單頁 |
| Archive | `/archives/` | `/zh/archives/` | `/ja/archives/` | Field Notes archive；不可與 Writing 視為相同畫面 |
| Search | `/search/` | 共用 | 共用 | 搜尋索引是否可載入仍為「待確認」 |
| 404 | `/404.html` | 共用 | 共用 | 另需測試 GitHub Pages 未知路徑的實際行為，待確認 |
| Engineering Projects detail | `/experience/projects/` | `/zh/experience/projects/` | `/ja/experience/projects/` | Phase 2B 第一個 CSS 重構目標 |

## 1.2 文章基準

選用同一篇文章的三語版本，讓結構、圖片與內容長度差異較容易比較：

| Language | Article | Route |
| --- | --- | --- |
| English | `2026-security-conference.en.md` | `/2026/05/09/2026-security-conference/` |
| 繁體中文 | `2026-security-conference.md` | `/zh/2026/05/09/2026-security-conference/` |
| 日本語 | `2026-security-conference.ja.md` | `/ja/2026/05/09/2026-security-conference/` |

文章基準需檢查：

- 長標題換行。
- Date 與 reading time。
- Headings 與 heading anchor。
- Paragraph、list、blockquote。
- Link、tag 與 category。
- 圖片及 caption；實際是否存在依文章內容記錄。
- Code block；若此文章沒有 code block，需另選一篇含 code block 的文章補測，文章為「待確認」。
- Reading progress。
- Back-to-top。

## 1.3 補充頁面

下列不是最低測試清單，但會受到共用 CSS 影響，修改相關 selector 時必須加入：

| Page | Routes | 加入條件 |
| --- | --- | --- |
| Dashboard | `/dashboard/`、`/zh/dashboard/`、`/ja/dashboard/` | 修改 Home、Hero、section rhythm |
| Special Lab | `/lab/` | 修改全域 layout、Header、Footer 或 Lab CSS |
| Project detail | 三語 `projects/<slug>/` | 修改 `.project-page-*`、Markdown page 或全域 content |
| Lab detail | 三語 `labs/<slug>/` | 修改 `.page-content`、`.lab-*` 或全域 content |
| Experience detail | 三語 `experience/<category>/` | 修改 Experience、article/card、timeline |
| Tags | `/tags/` 及 tag detail，實際產出待確認 | 修改 tag、button、card、link |

## 1.4 固定測試環境

為了讓截圖可比較，每次應使用相同環境：

| 項目 | 建議基準 |
| --- | --- |
| Browser | Chromium 系瀏覽器；實際名稱與版本需記錄 |
| Desktop viewport | `1440 × 900` |
| Mobile viewport | `390 × 844` |
| Device scale factor | `1`，若工具允許設定 |
| Zoom | `100%` |
| Font loading | 等待字型與圖片完成後再截圖 |
| Animation | 等待完成；必要時使用 `prefers-reduced-motion: reduce` 另做確認 |
| Cache | 每組測試使用一致策略 |
| Theme | Light、Dark 各一組 |
| Server URL | 以 `npm run server` 當次輸出為準，不假設 port |

建議截圖命名：

```text
<page>--<lang>--<viewport>--<theme>--<position>.png
```

例如：

```text
engineering-projects--zh--mobile--dark--full.png
home--en--desktop--light--header.png
article-cybersec-2026--ja--desktop--dark--code.png
```

---

# 2. 驗證矩陣

符號：

- `✓`：必須人工確認。
- `—`：沒有獨立語言版本或不適用。
- `補`：依本次 selector 影響範圍補測。

| Page | Desktop | Mobile | Light | Dark | EN | ZH | JA |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| About | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Projects index | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Experience landing | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Labs index | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Writing index | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Archive / Field Notes index | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Search | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| 404 | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Engineering Projects detail | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| English article | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Chinese article | ✓ | ✓ | ✓ | ✓ | — | ✓ | — |
| Japanese article | ✓ | ✓ | ✓ | ✓ | — | — | ✓ |
| Dashboard | 補 | 補 | 補 | 補 | 補 | 補 | 補 |
| Special `/lab/` | 補 | 補 | 補 | 補 | ✓ | — | — |
| General Project detail | 補 | 補 | 補 | 補 | 補 | 補 | 補 |
| General Lab detail | 補 | 補 | 補 | 補 | 補 | 補 | 補 |
| Other Experience detail | 補 | 補 | 補 | 補 | 補 | 補 | 補 |

## 2.1 最低截圖組合

每個 `✓` 頁面至少保存：

1. Desktop Light。
2. Desktop Dark。
3. Mobile Light。
4. Mobile Dark。

有三語版本的頁面，四組截圖需在 EN、ZH、JA 各執行一次。若畫面過長，至少保存：

- Top：Header、Hero、第一個內容區。
- Middle：主要 cards、timeline、article body。
- Bottom：最後一個內容區、CTA、Footer。
- Full page：若瀏覽器工具可穩定產生。

## 2.2 結果紀錄

每一組檢查應記錄：

| 欄位 | 內容 |
| --- | --- |
| Commit | 被測 commit hash |
| Browser | 名稱與版本 |
| Viewport | Width、height、device scale factor |
| Theme | Light 或 Dark |
| Language | EN、ZH、JA |
| Route | 完整 path |
| Result | Pass、Fail、待確認 |
| Difference | 無，或差異描述 |
| Screenshot | 檔名或保存位置 |
| Reviewer | 人工確認者 |

---

# 3. CSS 驗證重點

## 3.1 Header

- **驗證方式**
  - 比較 Header 高度、背景、邊界、品牌圖、標題與 controls 的位置。
  - 在頁面頂端與捲動後各看一次。
  - 三語長度都需確認。
- **常見失敗現象**
  - Header 高度跳動。
  - Logo 或 title 垂直偏移。
  - 背景變透明或出現舊色塊。
  - Header 蓋住內容。
- **建議截圖位置**
  - 頁面最頂端，包含 Header 與第一段內容。

## 3.2 Navigation

- **驗證方式**
  - 檢查主導覽、active state、hover、focus-visible 和 link spacing。
  - 點擊 Projects、Experience、Articles，確認視覺狀態與目標 URL。
- **常見失敗現象**
  - Active underline 消失或出現在錯誤項目。
  - 導覽換行、重疊。
  - Projects 跳到不同的平行路由。
  - Focus ring 被裁切。
- **建議截圖位置**
  - Desktop Header 全寬；另存 active、hover 或 keyboard focus 狀態。

## 3.3 Hero

- **驗證方式**
  - 比較 top spacing、標題尺寸、subtitle、summary、CTA 與背景是否連續。
  - Home、Project、Experience 的 Hero 分開確認。
- **常見失敗現象**
  - Light mode 出現舊 card background。
  - First fold 多出空白。
  - 標題超出 viewport。
  - CTA 排列錯誤。
- **建議截圖位置**
  - Header 下方至第一個 section 完整範圍。

## 3.4 Footer

- **驗證方式**
  - 比較 footer background、border、標題、note、copyright 與 link。
  - 確認內容短的頁面仍位於合理位置。
- **常見失敗現象**
  - Footer 套用舊 theme 色彩。
  - 與正文間距消失。
  - 文字對比不足。
- **建議截圖位置**
  - 頁面底部，包含前一個 section 的結尾。

## 3.5 Typography

- **驗證方式**
  - 比較 `h1`–`h3`、paragraph、list、blockquote、metadata、code。
  - 三語各用長標題與長段落確認換行。
- **常見失敗現象**
  - Font fallback 改變。
  - Line-height、字重或字距變化。
  - 中日文斷行異常。
  - Light/dark 對比不足。
- **建議截圖位置**
  - Article body 或 About 中同時包含 heading、paragraph、list 的區域。

## 3.6 Card

- **驗證方式**
  - 比較 card background、border、radius、padding、hover、focus 與內容高度。
  - 確認全域 `article:hover` 沒有覆蓋頁面專屬 card。
- **常見失敗現象**
  - Hover 變成舊白色 card。
  - Text color 被反轉。
  - Grid item 高度不一致。
  - Clickable area 或 z-index 失效。
- **建議截圖位置**
  - 同一畫面包含至少兩張 cards，另存 hover/focus 狀態。

## 3.7 Button

- **驗證方式**
  - 檢查 primary、secondary、CTA、code copy、back-to-top。
  - 比較 default、hover、focus、disabled 或 hidden 狀態；沒有的狀態記為不適用。
- **常見失敗現象**
  - 文字與背景同色。
  - Border 或 focus ring 消失。
  - Button 高度與文字基線不一致。
- **建議截圖位置**
  - Hero CTA、page CTA 與文章 code block controls。

## 3.8 Theme Toggle

- **驗證方式**
  - 切換 Light/Dark，重新整理後確認狀態是否保留。
  - Desktop 與 mobile 各操作一次。
- **常見失敗現象**
  - Icon 不可見。
  - Toggle 被舊 selector 隱藏。
  - 只有部分頁面換 theme。
  - Theme 切換後 card、Header 或 Footer 保留另一 theme。
- **建議截圖位置**
  - Header controls；Light、Dark 各一張。

## 3.9 Mobile Menu

- **驗證方式**
  - 在 mobile viewport 開啟與關閉 menu。
  - 檢查 Navigation、Language、Appearance 三區。
  - 用 keyboard 或等價 accessibility 操作確認 focus。
- **常見失敗現象**
  - `[hidden]` 狀態失效。
  - Menu 超出 viewport。
  - Link 重疊。
  - Theme toggle 或 language switcher 不可操作。
  - 關閉後 focus 位置錯誤。
- **建議截圖位置**
  - Menu 關閉與完整開啟各一張。

## 3.10 Code Block

- **驗證方式**
  - 比較背景、syntax color、overflow、padding 與 copy button。
  - Mobile 檢查水平捲動。
- **常見失敗現象**
  - Code 被截斷。
  - Copy button 擋住內容。
  - Light/dark syntax 對比不足。
  - 全域 `pre` 規則產生雙層背景。
- **建議截圖位置**
  - 包含完整 code block、copy button 與前後正文。

## 3.11 Table

- **驗證方式**
  - 檢查 header、cell padding、border、文字換行與 mobile overflow。
  - 若必測頁面沒有 table，另找一頁補測；頁面待確認。
- **常見失敗現象**
  - Table 超出 viewport。
  - Border 消失。
  - Dark mode cell background 不一致。
- **建議截圖位置**
  - 完整 table；mobile 另存最寬欄位狀態。

## 3.12 Responsive Layout

- **驗證方式**
  - 固定檢查 `1440px` 與 `390px`。
  - 針對 `760px`、`768px` 等密集 breakpoint，再用 `759px`、`760px`、`767px`、`768px`、`769px` 抽查。
- **常見失敗現象**
  - Grid 在臨界寬度跳成錯誤欄數。
  - 元件重疊或產生水平捲軸。
  - 同一元件在 `760px` 與 `768px` 間反覆切換。
- **建議截圖位置**
  - Full page；另存出現 breakpoint 變化的 section。

## 3.13 Experience Timeline

- **驗證方式**
  - 比較年份、marker、line、card、metadata 與 filter controls。
  - 三語與長文字都要確認。
- **常見失敗現象**
  - Timeline line 偏離 marker。
  - Cards 被全域 article hover 反白。
  - Filter control 溢出。
  - Mobile 年份與內容重疊。
- **建議截圖位置**
  - Filter 區與前兩筆 timeline；mobile 另存長內容項目。

## 3.14 Project Card

- **驗證方式**
  - Projects index 與 Engineering Projects detail 分開檢查。
  - 比較 title、description、status、tags、link 與 hover。
- **常見失敗現象**
  - `.featured-project-*` 舊規則污染 `.case-study-*`。
  - Card link layer 蓋住文字或失效。
  - Tags 斷行異常。
- **建議截圖位置**
  - 一組 Project cards；另存 hover/focus。

## 3.15 Lab Page

- **驗證方式**
  - 分別檢查 `/labs/`、Lab detail 與特殊 `/lab/`。
  - 驗證 reveal 前後狀態，避免截到尚未顯示的內容。
- **常見失敗現象**
  - `/lab/` 的 `lab.css` 與全域 CSS 互相污染。
  - Reveal item 保持透明。
  - Lab cards 被全域 article hover 改色。
- **建議截圖位置**
  - Labs index cards、Lab detail body、特殊 Lab hero。

---

# 4. Engineering Projects detail page

## 4.1 必測路由

```text
/experience/projects/
/zh/experience/projects/
/ja/experience/projects/
```

由於這是 Phase 2B 第一個 CSS extraction 候選，每個路由必須完成：

- Desktop Light。
- Desktop Dark。
- Mobile Light。
- Mobile Dark。

最低共 12 組頁面狀態；若每組保存 Top、Middle、Bottom，最低為 36 張區域截圖。

## 4.2 專屬檢查清單

### Header

- [ ] 高度與 padding 和其他 Experience detail 一致。
- [ ] Brand、Navigation、Language、Theme controls 正常。
- [ ] Active state 符合目前既有行為。
- [ ] Mobile Header 不重疊。

### Breadcrumb

- [ ] Breadcrumb 順序與文字正確。
- [ ] Link 可辨識且可操作。
- [ ] Separator、hover、focus 正常。
- [ ] Mobile 可換行，不產生水平捲軸。

### Hero

- [ ] Hero title、summary 與 spacing 正常。
- [ ] 三語長標題沒有裁切。
- [ ] Light/Dark background 與文字對比正確。
- [ ] Hero 沒有繼承舊 card surface。

### Metadata

- [ ] Date、role、organization、result 等實際存在欄位正常排列。
- [ ] 不存在的欄位不留下空白容器。
- [ ] Desktop grid 與 mobile stack 正常。
- [ ] Label 與 value 的層級清楚。

### Tags

- [ ] Tag spacing、border、background、文字對比正常。
- [ ] 長 tag 可換行。
- [ ] Light/Dark 都可讀。
- [ ] Mobile 不溢出。

### Markdown

- [ ] `h1`–`h3`、paragraph、list、blockquote 正常。
- [ ] Link hover/focus 正常。
- [ ] Horizontal rule 與 section spacing 正常。
- [ ] 三語 line-height 與斷行正常。

### Code Block

- [ ] 若頁面存在 code block，檢查 syntax、overflow、copy button。
- [ ] 若目前不存在，將狀態記錄為 N/A，不虛構基準。
- [ ] 必要時以另一個確實含 code block 的頁面補充全域測試，頁面待確認。

### Images

- [ ] 若頁面存在圖片，確認尺寸、比例、alt 與 mobile。
- [ ] 圖片 loading 後再截圖。
- [ ] 若目前不存在，記錄為 N/A。

### Footer

- [ ] Footer background、border、文字與 spacing 正常。
- [ ] Footer 不受 Engineering Projects scoped selector 影響。
- [ ] Mobile Footer 不被內容蓋住。

### Mobile

- [ ] `390 × 844` 無水平捲軸。
- [ ] Cards 改為合理單欄。
- [ ] Breadcrumb、metadata、tags 正常換行。
- [ ] Tap target 尺寸合理。
- [ ] Mobile menu 可開關。

### Dark Mode

- [ ] Page surface、card、metadata、tags、links 對比正常。
- [ ] 沒有 white card washout。
- [ ] Theme 切換後所有區塊同步更新。
- [ ] Reload 後 theme 狀態符合目前既有行為。

## 4.3 建議截圖位置

每個語言、viewport、theme 至少：

```text
top: Header + Breadcrumb + Hero
middle: Metadata + 第一組 Project cards
bottom: 最後一個 section + Footer
full: Full-page screenshot
```

## 4.4 Phase 2B 前後比較規則

允許差異：

- 只有因截圖時間造成的 cursor、animation frame 或載入時間差異。
- 必須在紀錄中說明。

不允許差異：

- Layout、spacing、color、font、border、radius、shadow 改變。
- Link target 或文字改變。
- DOM content 改變。
- Light/Dark 任一狀態改變。
- EN/ZH/JA 任一版本不同步。
- 新增 `!important` 才能維持原畫面。

---

# 5. 回歸測試流程

每一個 CSS commit 後固定執行以下流程。一次只驗證一個小範圍 commit，不累積多個未驗證的 extraction。

## Step 1：啟動本機網站

```bash
npm run server
```

使用終端機實際輸出的 URL。若啟動失敗，停止 CSS 工作，不以修改 CSS 解決 server 問題。

## Step 2：Desktop 檢查

使用固定 `1440 × 900`：

1. 檢查本次目標頁。
2. 檢查一個共享相同 layout 的頁面。
3. 檢查一個不相關頁面作為 negative control。
4. 比較 baseline screenshot。

## Step 3：Mobile 檢查

使用固定 `390 × 844`：

1. 檢查水平捲動。
2. 開關 mobile menu。
3. 檢查 cards、metadata、tags、buttons。
4. 比較 baseline screenshot。

## Step 4：Light/Dark 檢查

每個必測 viewport：

1. Light 截圖。
2. Dark 截圖。
3. 切換 theme。
4. Reload。
5. 確認 page、Header、Footer、cards 同步。

## Step 5：EN/ZH/JA 檢查

1. 從目前頁面依序切換 EN、ZH、JA。
2. 確認 route 與頁面存在。
3. 比較 layout、長標題、斷行與 controls。
4. Engineering Projects detail 必須使用三個指定路由直接開啟再測一次。

## Step 6：Git diff 確認

```bash
git status --short
git diff --stat
git diff
git diff --check
```

確認：

- 只有預期 CSS extraction 與必要 stylesheet reference。
- 沒有內容、路由、EJS 邏輯或設定變動。
- 沒有產生的 `public/`、screenshots 或 cache 被意外納入。

## Step 7：決定是否進入下一步

只有以下條件全部符合才進下一步：

- [ ] 本次目標頁全部 Pass。
- [ ] Negative control 無差異。
- [ ] Desktop、Mobile Pass。
- [ ] Light、Dark Pass。
- [ ] EN、ZH、JA Pass。
- [ ] 沒有意外水平捲動。
- [ ] 沒有新增 override 補丁。
- [ ] `git diff --check` 通過。
- [ ] Diff 範圍單一且可獨立 revert。

任一條件失敗：

1. 停止下一個 extraction。
2. 記錄失敗頁面與 screenshot。
3. 找出最小差異。
4. 若不能證明等價，回退該 CSS commit。

---

# 6. Baseline 完成條件

這份文件建立後，只代表「測試規格完成」。開始 Phase 2B 第一個 CSS extraction 前，仍必須完成：

- [ ] 目前 HEAD 的本機網站可啟動。
- [ ] Engineering Projects 三語 12 組必要狀態已人工確認。
- [ ] 必要截圖已保存並可追溯到 commit hash。
- [ ] Header、Footer 與一個 negative control 已建立基準。
- [ ] 截圖的 browser、viewport、theme 已記錄。
- [ ] 已確認 Engineering Projects 區段中的 selector scope。
- [ ] 已確認拆分後 stylesheet 的載入順序可保持 cascade。

在上述條件完成前，結論應是：

> Visual baseline 規格已具備，但實際基準尚未完成，不應立即開始搬移 CSS。
