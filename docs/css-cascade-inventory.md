# Seraph CSS Cascade Inventory

## 文件目的與分析限制

本文件針對 `source/css/custom.css` 建立唯讀 cascade inventory，供後續 Phase 2B 小範圍拆分與回歸驗證使用。

本次沒有修改或格式化 `custom.css`，也沒有修改 EJS、路由、設定或網站內容。

統計方式以實際檔案文字、註解邊界、selector 與 `@media` 掃描為基礎。CSS 沒有經過完整 AST parser，以下數字適合用來辨識規模與重複熱點，但不能單獨作為刪除 selector 的依據。無法只從 CSS 靜態確認的用途均標記為「待確認」。

---

## 1. 基本統計

### 1.1 檔案規模

| 項目 | 結果 |
| --- | ---: |
| 總行數 | 12,504 |
| 未命名基礎區 | 1 個，約第 1–668 行 |
| 具名註解區段 | 57 個 |
| `!important` | 3,014 次 |
| `@media` | 88 次 |
| `@keyframes` | 7 次 |
| `[data-theme...]` selector | 約 239 次 |
| `:has(...)` | 5 次 |
| Selector 出現次數 | 約 3,252 次 |
| 唯一 selector | 約 1,568 個 |
| 重複 selector | 約 605 個唯一 selector 重複出現 |

「重複 selector」是正規化空白後的估計值。逗號 selector、巢狀 `@media` 與複雜多行 selector 可能造成少量統計誤差。

### 1.2 主要 breakpoint

| Media condition | 次數 |
| --- | ---: |
| `max-width: 768px` | 17 |
| `max-width: 760px` | 16 |
| `max-width: 640px` | 7 |
| `prefers-reduced-motion: reduce` | 7 |
| `max-width: 420px` | 6 |
| `max-width: 900px` | 5 |
| `max-width: 820px` | 4 |
| `max-width: 980px` | 4 |
| `max-width: 460px` | 3 |
| `max-width: 860px` | 3 |
| `max-width: 1023px` | 2 |
| `max-width: 560px` | 2 |
| `max-width: 767px` | 2 |
| `min-width: 1024px` | 2 |
| `max-width: 1060px` | 1 |
| `max-width: 1100px` | 1 |
| `max-width: 1120px` | 1 |
| `max-width: 360px` | 1 |
| `max-width: 480px` | 1 |
| `max-width: 720px` | 1 |
| `max-width: 880px` | 1 |
| `max-width:768px` | 1 |

`max-width:768px` 與 `max-width: 768px` 只有格式不同，但目前仍是兩種文字形式。`760px`、`767px`、`768px` 同時存在，顯示 breakpoint 是分階段加入，而非由單一 token 管理。

在完成 viewport baseline 前，不應先合併這些 breakpoint。

### 1.3 `keep at EOF` 與類似限制

明確含有位置限制語意的區段：

| 行號 | 註解 |
| ---: | --- |
| 669 | `Final dark home override: keep this at EOF.` |
| 3025 | `Final dark home override: keep this at EOF.` |
| 3442 | `Final hero surface correction: keep at absolute EOF.` |
| 4356 | `V2.0 release header RWD fix. Keep at EOF.` |
| 5583 | `Cyber Lab / Digital Notebook final system. Keep at EOF.` |
| 7537 | `About compact personal brand page. Keep after earlier About styles.` |
| 7889 | `Project Polaris homepage Hero. Keep after older Hero experiments.` |
| 9005 | `Home V1 compact spacing: keep notebook rhythm with less vertical drift.` |
| 10718 | `Research final override: keep research items from inheriting global article hover washout.` |
| 10892 | `Field Notes Index final link fix: keep archive titles clickable above item hover layers.` |
| 11164 | `Project Polaris homepage hero final override: keep the first fold visually continuous.` |
| 11189 | `Home shell final override: remove any remaining light-mode card block around the hero.` |
| 11765 | `Experience final scope: keep global article card rules from changing this page.` |

此外，多個註解雖未使用 `keep`，但包含 `final`、`override` 或 `correction`，同樣代表其效果可能依賴檔案順序。這些區段在 Phase 2B 前不得先搬動。

---

## 2. 區段清單

### 2.1 未命名基礎區

| 行號 | 主要 selector | 元件／頁面 | `!important` | 覆寫可能 | Keep | 風險 | 建議 |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| 1–668 | `:root`、`body`、`.site-header`、`.site-title`、`.site-nav`、`.post-*`、`.home-*`、`.project-card`、`.stats-grid` | 全站基礎、Header、文章、Home、cards | 57 | 後方幾乎確定大量覆寫 | 否 | 高 | 保留；先建立 selector ownership，暫不移動 |

### 2.2 57 個具名註解區段

表格中的 `!important` 是該註解起始行至下一註解前一行的次數。「覆寫」是根據 selector 重複、區段名稱與檔案順序判斷的可能性，不代表每一條 declaration 都覆寫成功。

| # | 區段與行號 | 主要 selector | 對應頁面／元件 | `!important` | 覆寫 | Keep | 風險 | 後續建議 |
| ---: | --- | --- | --- | ---: | --- | --- | --- | --- |
| 1 | `Final dark home override` 669–1098 | `:root`、`html`、`body`、`.main-container`、`.site-title`、`.post-*`、`.home-*` | 全站 dark 與早期 Home | 97 | 是，覆寫未命名區 | 明確 | 高 | 保留，待確認實際殘留用途 |
| 2 | `Interactive Linux Desktop Portfolio v3` 1099–1541 | `:root`、`body`、`.main-container`、`.site-header`、`.interactive-terminal-hero`、`.terminal-*` | 舊 Home terminal | 100 | 是 | 否 | 高 | 待確認是否仍有產出節點；不先刪除 |
| 3 | `Security Lab Terminal Hero refresh` 1542–2022 | `:root`、`.site-header`、`.home-hero.terminal-hero`、`.wolf-*`、`.terminal-*` | 舊 Home hero refresh | 85 | 是，覆寫 #2 | 否 | 高 | 待確認；與舊 terminal 結構一併盤點 |
| 4 | `Interactive Linux Terminal Portfolio v2` 2023–2306 | `.interactive-terminal-hero`、`.terminal-card`、`.terminal-titlebar`、`.terminal-screen` | 舊 Home terminal | 24 | 是，名稱版本較舊但位置較後 | 否 | 高 | 保留；版本名稱不能用來推斷優先級 |
| 5 | `Final light-theme override for GitHub Pages cache and legacy theme styles` 2307–3024 | `html`、`body`、`.site-header`、`.page-content`、`.post-content`、`article`、cards、Home hero | 全站 light mode 與 legacy 修正 | 52 | 是，大範圍全域覆寫 | 類似 | 高 | 絕對不先搬動 |
| 6 | `Final dark home override` 3025–3441 | `:root`、`html`、`body`、`.main-container`、Home、post、cards | 全站 dark 與 Home | 91 | 是，覆寫 #1 與 #5 | 明確 | 高 | 絕對不先搬動 |
| 7 | `Final hero surface correction` 3442–3456 | `.i18n-page-home > .interactive-terminal-hero`、`.home-hero.terminal-hero`、`#terminal-hero` | 舊 Home hero surface | 6 | 是 | `absolute EOF` | 高 | 原位保留 |
| 8 | `Final mobile and home shell correction` 3457–3504 | `.home-page.i18n-page`、`.brand-row`、`.brand-content`、`.site-title`、`.mobile-menu-button`、`.mobile-nav` | Home shell、Header mobile | 22 | 是 | 類似 | 高 | 原位保留 |
| 9 | `Final mobile terminal command wrapping` 3505–3519 | `.terminal-help-grid` | 舊 terminal mobile | 4 | 是 | 類似 | 中 | 待確認 terminal 是否仍輸出 |
| 10 | `Theme toggle and polished controls` 3520–3729 | `[data-theme]`、`.theme-toggle-button`、`.mobile-menu-button`、`.code-copy-button` | Theme controls、buttons | 26 | 是 | 否 | 高 | 與後方 Header controls 一起保留 |
| 11 | `Seraph blog OS V2.0 design system` 3730–4355 | `:root`、`[data-theme]`、`body`、`.site-wrapper`、`.main-container`、Header、content、buttons | 全站 V2 design system | 72 | 是，大型基礎層 | 否 | 高 | 保留；未來才可拆 tokens/base |
| 12 | `V2.0 release header RWD fix` 4356–4553 | `.site-header`、`.brand-*`、`.site-title`、`.site-nav`、`.header-controls` | Header、responsive | 76 | 是，覆寫 #11 | 明確 | 高 | 絕對不先搬動 |
| 13 | `V2.0 release header title/nav final correction` 4554–4602 | `.site-title a span`、`.brand-content`、`.site-nav`、`.theme-toggle-button` | Header title/nav | 14 | 是，覆寫 #12 | 類似 | 高 | 與 Header 群組原位保留 |
| 14 | `Writing index: full article list` 4603–4714 | `.writing-index-section`、`.writing-all-list`、`.writing-all-card`、`.writing-all-*` | Writing index | 10 | 可能，被後方全域 card 規則影響 | 否 | 中 | 可拆候選，但需先處理後方 hover overrides |
| 15 | `Release 1.0 final polish` 4715–5183 | selection、`html`、`body`、全域 focus、light/dark、content、cards | 全站 visual/readability | 91 | 是，大範圍覆寫 | 類似 | 高 | 絕對不先搬動 |
| 16 | `Release 1.0 light general page readability correction` 5184–5243 | `html[data-theme="light"]`、`.main-container`、`.page-content`、`.page-body` | 一般頁 light mode | 8 | 是，補正 #15 | 類似 | 高 | 與 dark/page wrapper 一起保留 |
| 17 | `Homepage positioning refresh` 5244–5353 | `.home-positioning-hero`、`.home-positioning-copy`、`.home-primary-actions` | 現行 Home hero 的早期規則 | 32 | 是，後方 Project Polaris 再覆寫 | 否 | 高 | 不先移動 |
| 18 | `Archives hub: article entry point` 5354–5582 | `.archive-hub`、`.archive-topic-*`、`.archive-post-*` | 舊或平行 Archives hub | 63 | 可能 | 否 | 中至高 | 實際 markup 使用情況待確認 |
| 19 | `Cyber Lab / Digital Notebook final system` 5583–6285 | `:root`、`[data-theme]`、`html`、`body`、`a`、Header、cards、pages | 全站大型 theme layer | 189 | 是，廣泛覆寫 | 明確 | 高 | 絕對不先搬動 |
| 20 | `Post/Page readability correction` 6286–6441 | `.post-content`、`.page-content`、`.notebook-page`、`.lab-note`、`.article-entry`、`.post-body`、`.page-body` | Posts、Pages、Lab note | 29 | 是，補正 #19 | 類似 | 高 | 原位保留 |
| 21 | `Final page wrapper correction` 6442–6531 | `html[data-theme="dark"]` 下的 page/post/article wrappers | Dark mode pages/posts | 13 | 是，補正 #20 | 類似 | 高 | 絕對不先搬動 |
| 22 | `Light Lab / Anonymous Builder final theme` 6532–6903 | `:root`、`[data-theme]`、`html`、`body`、Header、content | 全站另一層 theme | 67 | 是，覆寫前方 theme | 類似 | 高 | 絕對不先搬動 |
| 23 | `About: anonymous builder notebook profile` 6904–7052 | `.about-lab-profile` | 早期 About 自訂結構 | 23 | 後方 About 覆寫或取代 | 否 | 中至高 | Markup 是否存在待確認 |
| 24 | `About Seraph: Personal Cyber Lab profile page` 7053–7295 | `.about-seraph`、`.about-seraph-*` | 另一版 About | 36 | 後方 About 覆寫或取代 | 否 | 中至高 | Markup 是否存在待確認 |
| 25 | `About page rendered from Markdown` 7296–7536 | `.about-page`、`.page-body > h1`、`p:nth-of-type(...)` | 現行 Markdown About 候選 | 41 | 是 | 否 | 高 | 依賴 DOM 順序，不先搬動 |
| 26 | `About compact personal brand page` 7537–7752 | `.about-page`、`.page-body > h1`、`p:nth-of-type(...)` | 現行 About 後置版本 | 56 | 是，明確覆寫 #25 | 明確在 #25 後 | 高 | 絕對不先搬動 |
| 27 | `Homepage site guide` 7753–7888 | `.site-space-guide`、`.site-space-guide-*` | Home/Dashboard guide | 27 | 被 #35、#37 後續調整 | 否 | 中 | 可拆候選，但不是第一批 |
| 28 | `Project Polaris homepage Hero` 7889–8052 | `.i18n-page-home > .home-positioning-hero`、Dashboard 同類 selector | Home/Dashboard hero | 47 | 是，覆寫 #17 | 明確 | 高 | 絕對不先搬動 |
| 29 | `Project Polaris preface` 8053–8152 | `.why-seraph-exists`、`.why-seraph-*` | Home/Dashboard Why Seraph | 24 | 被 #35、#37 調整 | 否 | 中 | 待 Home baseline 後再拆 |
| 30 | `Project Polaris exploration areas` 8153–8288 | `.exploration-areas`、`.exploration-area-*` | Home/Dashboard exploration | 41 | 被 #35、#37、hover fixes 調整 | 否 | 高 | 不先搬動 |
| 31 | `Project Polaris selected works` 8289–8429 | `.selected-works`、`.selected-work-*` | Home/Dashboard selected works | 42 | 被 #35–#38、#49 調整 | 否 | 高 | 不先搬動 |
| 32 | `Project Polaris latest field notes` 8430–8583 | `.latest-field-notes`、`.latest-field-note-*` | Home/Dashboard notes | 45 | 被 #35、#37–#38、#49 調整 | 否 | 高 | 不先搬動 |
| 33 | `Project Polaris current exploration list` 8584–8704 | `.currently-exploring`、`.currently-exploring-*` | Home/Dashboard current work | 40 | 被 #35、#37–#38、#49 調整 | 否 | 高 | 不先搬動 |
| 34 | `Project Polaris epilogue` 8705–8783 | `.home-epilogue`、`.home-epilogue-*` | Home/Dashboard epilogue | 24 | 被 #35 調整 | 類似 | 中 | 待 Home baseline 後再拆 |
| 35 | `Home V1 polish` 8784–8947 | Home/Dashboard 下的 guide、why、exploration、works、notes、current、epilogue | Home/Dashboard 全 section rhythm | 15 | 是，統整 #27–#34 | 否 | 高 | 絕對不先搬動 |
| 36 | `Selected Works fix` 8948–9004 | `.selected-work-item` 及 hover/focus/text | Home selected works | 12 | 是，防止全域 article hover | 類似 | 高 | 原位保留 |
| 37 | `Home V1 compact spacing` 9005–9124 | Home/Dashboard section wrappers 與 items | Home/Dashboard spacing | 15 | 是，覆寫 #35 | 類似 | 高 | 原位保留 |
| 38 | `Final homepage item hover override` 9125–9216 | Home exploration、selected works、field notes、current items | Home/Dashboard hover | 13 | 是，覆寫全域 article/card | 類似 | 高 | 原位保留 |
| 39 | `About V1` 9217–9375 | `.about-page`、`.about-v1-*` | About 現行或後期結構 | 62 | 是，覆寫 #25–#26 | 否 | 高 | 三語 About baseline 前不動 |
| 40 | `Field Notes V1` 9376–9633 | `.field-note-page`、`.field-note-header`、`.post-*` | 單篇文章 | 107 | 是，補正全域 post | 否 | 高 | 可拆但非第一批 |
| 41 | `Field Notes Index V1` 9634–9810 | `.field-notes-index`、`.field-notes-index-*` | Archives index | 77 | 是，後方 #49–#50 再修正 | 否 | 高 | #50 未整合前不動 |
| 42 | `Projects V1` 9811–9962 | `.case-study-index`、`.case-study-index-*`、`.case-study-item` | 三語 Projects index | 90 | 是，後方 #49 hover 修正 | 否 | 中至高 | 可拆候選；先納入 #49 依賴 |
| 43 | `Labs V1` 9963–10110 | `.lab-studio-index`、`.lab-experiment-*` | 三語 Labs index | 87 | 是，後方 #49 hover 修正 | 否 | 中至高 | 可拆候選；先納入 #49 依賴 |
| 44 | `Research V1` 10111–10263 | `.research-v1-page`、`.research-direction-*` | Experience Research detail | 92 | 是，後方 #48–#49 修正 | 否 | 高 | #48、#49 未整合前不動 |
| 45 | `Navbar V2` 10264–10476 | `.site-header`、`.brand-*`、`.site-nav`、`.mobile-*`、theme controls | Header、Navigation | 128 | 是，覆寫早期 Header | 否 | 高 | 絕對不先搬動 |
| 46 | `Project Polaris mobile menu IA` 10477–10643 | `.mobile-nav-section`、`.mobile-nav-label`、`.mobile-nav-links`、`.mobile-language-switcher` | Mobile menu | 80 | 是，覆寫 #45 與早期 mobile | 否 | 高 | 絕對不先搬動 |
| 47 | `Project Polaris footer` 10644–10717 | `.site-footer.polaris-footer` | Footer | 42 | 是，覆寫舊 footer | 否 | 中 | scope 清楚，但非第一批 |
| 48 | `Research final override` 10718–10791 | `.research-v1-page`、`.experience-detail-page` hover/focus | Research、Experience detail | 13 | 是，修正 #44 與全域 article hover | 明確 | 高 | 原位保留 |
| 49 | `Project Polaris V1 final hover override` 10792–10891 | Home、Projects、Labs、Archives、Posts、Research 的 article/item hover | 多頁共用 hover 防護 | 9 | 是，跨頁最終覆寫 | 明確 | 高 | 絕對不先搬動 |
| 50 | `Field Notes Index final link fix` 10892–11163 | `.archive-page.field-notes-index ...`、link、CTA、hover | Archives index | 139 | 是，修正 #41 與 #49 | 明確 | 高 | 原位保留 |
| 51 | `Project Polaris homepage hero final override` 11164–11188 | `.home-positioning-hero`、`.home-positioning-copy` | Home/Dashboard first fold | 16 | 是，修正 #28 | 明確 | 高 | 原位保留 |
| 52 | `Home shell final override` 11189–11208 | light mode Home wrappers、`:has(.i18n-page-*)` | Home/Dashboard light shell | 5 | 是，修正全域 light cards | 明確 | 高 | 原位保留 |
| 53 | `Header controls` 11209–11431 | `.header-controls`、`.language-switcher`、`.mobile-language-switcher`、theme toggle | Header language/theme controls | 126 | 是，覆寫 #10、#12、#13、#45–#46 | 類似 | 高 | 絕對不先搬動 |
| 54 | `Experience landing page` 11432–11764 | `.experience-page`、`.experience-hero`、cards、stats、sections | 三語 Experience landing | 6 | 可能被 #55–#56 覆寫 | 否 | 中 | 可拆候選，但需連同後置規則盤點 |
| 55 | `Experience final scope` 11765–11831 | `.experience-page article`、cards、stats hover | Experience landing | 21 | 是，防止全域 article/card | 明確 | 高 | 原位保留 |
| 56 | `Minimal portfolio header and Experience layout` 11832–12169 | `.site-header .site-nav:not(...)`、mobile links、`.experience-page` | Header navigation + Experience | 164 | 是，跨兩種責任 | 否 | 高 | 先分 inventory，不可整段搬移 |
| 57 | `Engineering Projects detail page` 12170–12504 | `.engineering-projects-page`、breadcrumbs、header、intro、section、project cards | Experience Projects detail collection | 21 | 位於檔尾，可能覆寫全域 article/card | 否 | 中 | 第一批拆分候選，但先確認完整 selector scope |

---

## 3. 高風險 cascade

## 3.1 Header

主要重複 selector：

- `.site-header`：約 14 次。
- `.site-header .site-title a`：約 13 次。
- `.site-title a`：約 13 次。
- `.brand-avatar`：約 8 次。
- `.site-kicker`：約 8 次。
- `.site-mantra`：約 10 次。
- `.main-container`：約 17 次，會間接影響 Header 後的內容位置。

主要覆寫鏈：

```text
未命名基礎區
→ Final dark/light overrides
→ Seraph blog OS V2.0
→ V2.0 Header RWD fix
→ Header title/nav final correction
→ Cyber Lab / Digital Notebook
→ Light Lab / Anonymous Builder
→ Navbar V2
→ Header controls
→ Minimal portfolio header
```

判斷：

- Header 並非由單一區段負責。
- `!important` 很可能用來壓過前一代 theme selector與高 specificity selector。
- 具體每一條 `!important` 是否必要，必須由 computed style 判斷，僅靠 CSS 無法確認。

**禁止先搬動：** #5、#6、#11–#13、#19、#22、#45、#53、#56 中所有 Header 規則。

## 3.2 Navigation

主要重複 selector：

- `.site-nav a`：約 12 次。
- `.site-nav a:hover`：約 10 次。
- `.mobile-nav`：約 10 次。
- `.mobile-nav a`：約 11 次。
- `.mobile-nav a:hover`：約 9 次。
- `.tag-cloud-link`：約 15 次，但屬於內容 navigation/control，不是 Header nav。

後方覆寫關係：

- #12–#13 修正 V2 Header nav。
- #45 重新定義 Navbar V2。
- #46 重新分組 mobile Navigation、Language、Appearance。
- #53 再調整 language switcher 與 theme control。
- #56 再調整非 language switcher 的主 nav。

`!important` 原因只能部分判斷：註解明確表示多次「final correction」，但哪些 declaration 是為 cache、legacy theme 或 specificity 所需仍為「待確認」。

**禁止先搬動：** Desktop navigation、mobile nav、active state、language switcher 的所有後置規則。

## 3.3 Theme controls

主要 selector：

- `.theme-toggle-button`
- `.theme-toggle-icon`
- `.theme-toggle-label`
- `.mobile-nav .theme-toggle-button`
- `.mobile-nav-section-appearance .theme-toggle-button-mobile`
- `html[data-theme="light"]`
- `html[data-theme="dark"]`

已確認約 239 次 `[data-theme...]` selector，分散於全檔。

可能覆寫鏈：

```text
Theme toggle and polished controls
→ Seraph blog OS V2.0
→ Release 1.0 polish
→ Cyber Lab / Digital Notebook
→ Light Lab / Anonymous Builder
→ Navbar V2
→ Mobile menu IA
→ Header controls
```

`!important` 很可能同時處理 theme specificity 與歷史規則，但無法逐條靜態確認。

**禁止先搬動：** `:root` tokens、全部 `[data-theme]` 共用規則、theme toggle、light/dark page wrapper corrections。

## 3.4 Homepage

主要重複 selector：

- `.home-page`：約 7 次。
- `.home-positioning-hero`：多區段重複。
- `.interactive-terminal-hero`：約 7 次。
- `.interactive-terminal-hero .terminal-card`：約 8 次。
- `.interactive-terminal-hero .terminal-screen`：約 14 次。
- `.terminal-stats-grid`：約 17 次。
- `.selected-work-item`：本體與多組 hover override。
- `.latest-field-note-item`：本體與多組 hover override。
- `.currently-exploring-item`：本體與多組 hover override。

覆寫關係：

- #1–#9 包含多代 terminal Home。
- #17 建立 `home-positioning-hero`。
- #27–#34 建立 Project Polaris sections。
- #35、#37 調整整體節奏與 spacing。
- #36、#38、#49 修正全域 article/card hover 污染。
- #51、#52 修正 hero first fold 與 light shell。

`!important` 的整體目的可判斷為壓過舊 Home、全域 card 與 theme 規則；每條必要性仍待 computed style 確認。

**禁止先搬動：** 所有 Home hero、Home shell、Home hover final override、#35–#38、#49、#51–#52。

## 3.5 Experience

主要 selector：

- `.experience-page`
- `.experience-card`
- `.experience-stat-card`
- `.experience-placeholder-card`
- `.experience-muted-card`
- `.experience-tags`
- `.experience-detail-page`

覆寫關係：

- #54 建立 landing page。
- #55 防止全域 `article` 與 card 規則改變 Experience。
- #56 同時包含 Header 與 Experience layout，並再覆寫 #54–#55 的部分 selector。
- #48 另會影響 Experience detail Research hover。

`!important` 在 #55 的目的可由註解部分判斷為隔離全域 card hover；#56 的大量 `!important` 同時包含 Header，不能視為單純 Experience 需求。

**禁止先搬動：** #55、#56 整段；若要拆 Experience，必須先逐條分離 #56 的 Header 與 Experience selector。

## 3.6 Projects

目前至少有兩種 CSS scope：

- `.case-study-index`：三語 Projects index。
- `.engineering-projects-page`：Experience Projects detail collection。

此外還有舊的：

- `.project-card`
- `.featured-projects`
- `.featured-project-card`
- `.project-page-hero`

高重複 selector：

- `.featured-projects`：約 17 次。
- `.featured-project-card`：約 11 次。
- `.featured-project-grid`：約 11 次。
- `.project-card`：約 10 次。

覆寫關係：

- #42 的 `.case-study-*` 受 #49 最終 hover override 保護。
- #57 的 `.engineering-projects-*` 位於檔尾，可能壓過前方全域 article/card。
- 舊 `.featured-project-*` 分散於多個 design system，不能和 `.case-study-*` 因名稱相近就合併。

**禁止先搬動：** 全域 `.project-card`、`.featured-project-*`。
**可優先確認：** #57 的 `.engineering-projects-*`，因 EJS 中可找到實際 root class。

## 3.7 Posts

高重複 selector：

- `.post-content`：約 19 次。
- `.post-body`：約 12 次。
- `.post-title`：約 11 次。
- `.article`：約 10 次。
- `.article-entry`：約 9 次。
- `.highlight`：約 9 次。
- `pre`、`code`：約 9–10 次。

覆寫關係：

- 全域基礎與多代 theme 先定義 post/article。
- #20–#21 修正 page/post wrappers。
- #40 定義 `.field-note-page`。
- #49 防止全域 hover 污染。

`!important` 的用途可部分判斷為移除舊 card chrome、保護文章閱讀樣式與 dark wrapper；逐條原因待確認。

**禁止先搬動：** `.post-content`、`.post-body`、`.article*`、`.page-content` 等全域 selector。只可在保留 #49 依賴的前提下考慮 `.field-note-page` scoped 規則。

## 3.8 Responsive overrides

目前有 88 個 media query，且：

- `760px` 與 `768px` 各自大量存在。
- `767px`、`768px`、`820px`、`860px`、`900px` 等門檻並存。
- 多個區段自行保存 responsive 規則。
- Header 至少在 #12、#13、#45、#46、#53、#56 有不同 breakpoint 修正。

後續不能先建立單一 `responsive.css` 並改變規則相對順序。即使 media condition 相同，把規則集中到檔尾也會改變 cascade。

**禁止先搬動：** 所有 Header、Home、theme wrapper 的 media query，以及任何標記 final/keep 的 responsive block。

## 3.9 Dark mode

主要形式：

- `:root`
- `html[data-theme="dark"]`
- `html[data-theme="light"]`
- `html, body`
- Theme-specific page wrapper selector

覆寫鏈跨越 #1、#5–#6、#10–#11、#15–#16、#19–#22、#52 等區段。

`!important` 很可能用來保證 theme surface、text 與 card background，但存在大量跨層修正。沒有 computed style 與 light/dark screenshot baseline 前，無法安全判斷可移除項目。

**禁止先搬動：** 全部 theme tokens、page wrapper correction、Home light shell、dark article/page background。

## 3.10 Mobile menu

主要 selector：

- `.mobile-menu-button`
- `.mobile-menu-icon`
- `.mobile-nav`
- `.mobile-nav-section`
- `.mobile-nav-label`
- `.mobile-nav-links`
- `.mobile-language-switcher`
- `.theme-toggle-button-mobile`

重複情況：

- `.mobile-menu-button` 約 18 次。
- `.mobile-nav` 約 10 次。
- `.mobile-nav a` 約 11 次。

覆寫鏈跨越未命名區、#8、#10–#13、#19、#22、#45–#46、#53、#56。

`!important` 目的可部分判斷為壓過 desktop nav 與 legacy mobile styles，但 accessibility state、`hidden`、active state 與 breakpoint 的實際必要性待確認。

**禁止先搬動：** mobile menu 全部規則，直到完成 keyboard、screen width、theme 與 language switch baseline。

---

## 4. 第一批可安全整理候選

本節只提出候選，不代表已授權修改 CSS。

## 候選 A：Engineering Projects detail

- **Selector／區段**
  - `Engineering Projects detail page`
  - `.engineering-projects-page`
  - `.engineering-projects-breadcrumbs`
  - `.engineering-projects-header`
  - 其內部 section、card 與 responsive selector
- **行號**
  - 約 12170–12504。
- **頁面影響**
  - `themes/landscape/layout/_partial/experience-detail.ejs` 中使用 `.engineering-projects-page` 的 Experience Projects collection。
  - 三語 Experience Projects 頁面。
- **低風險理由**
  - 位於 `custom.css` 最後一個具名區段，不需穿越後方規則。
  - Root class `.engineering-projects-page` 可在 EJS 找到實際使用點。
  - 多數 selector 具有明確 page scope。
  - 區段只有 1 個 media query、21 次 `!important`，規模相對可控。
- **待確認**
  - 區段是否混入未以 `.engineering-projects-page` 開頭的全域 selector。
  - `experience-detail.ejs` 哪些 slug 會進入此 root class。
  - 新 stylesheet 的載入位置能否保持在 `custom.css` 之後。
- **後續驗證方式**
  - 拆分前後比較 `/experience/projects/`、`/zh/experience/projects/`、`/ja/experience/projects/`。
  - 比較完整 HTML、computed style 與 screenshots。
  - 檢查 breadcrumbs、cards、related links、dark/light、mobile。
  - 另檢查一般 Experience detail，確保沒有受到影響。
- **回退方式**
  - 一個 commit 只搬移此區段並新增 stylesheet link。
  - 發生任何差異時 revert 該 commit，恢復原始檔尾區段與載入設定。

## 候選 B：Project Polaris Footer

- **Selector／區段**
  - `Project Polaris footer`
  - `.site-footer.polaris-footer`
- **行號**
  - 約 10644–10717。
- **頁面影響**
  - 全站 Footer。
- **低風險理由**
  - Root selector specificity 高且 scope 清楚。
  - 未與 Header 或 Home selector混在同一具名區段。
- **風險修正**
  - 雖然 scope 清楚，但 Footer 是全站共用，因此整體風險仍為中，不應優先於候選 A。
  - 後方是否還有相同 footer selector需要再次搜尋。
- **後續驗證方式**
  - 三語 Home、文章、Project、Lab、Experience、404。
  - Desktop/mobile、light/dark。
  - 比較 footer typography、spacing 與 links。
- **回退方式**
  - Footer 獨立 commit，revert 即恢復。

## 候選 C：Writing index scoped rules

- **Selector／區段**
  - `Writing index: full article list`
  - `.writing-index-section`
  - `.writing-all-*`
- **行號**
  - 約 4603–4714。
- **頁面影響**
  - 三語 Writing index。
- **低風險理由**
  - Selector 命名集中，對應 `i18n-page.ejs` 的 Writing markup。
  - 區段只有 1 個 media query。
- **待確認**
  - 後方全域 card、link、hover 與 theme rules是否仍覆寫 `.writing-all-card`。
  - 因區段位於檔案中段，直接抽到檔尾會改變 cascade；需要保持等價載入順序或連同後置依賴處理。
- **後續驗證方式**
  - `/writing/`、`/zh/writing/`、`/ja/writing/`。
  - Article title、date、tags、hover、focus、empty state。
  - Light/dark、mobile。
- **回退方式**
  - Writing-only commit；HTML 或 computed style 不同即 revert。

## 候選 D：Project index 與 Lab index，分開處理

- **Selector／區段**
  - #42 `.case-study-*`
  - #43 `.lab-studio-*`、`.lab-experiment-*`
- **行號**
  - Projects：約 9811–9962。
  - Labs：約 9963–10110。
- **頁面影響**
  - 三語 Projects index。
  - 三語 Labs index。
- **低風險理由**
  - 各自具有清楚 root class。
  - EJS 中可找到相符 markup。
- **待確認**
  - #49 同時保護 `.case-study-item` 與 `.lab-experiment-item` hover；因此不能只移動 #42 或 #43 就宣稱完整。
- **後續驗證方式**
  - 每一頁面族群分開 commit。
  - 三語、dark/light、mobile、hover/focus。
  - 檢查 #49 前後 computed style。
- **回退方式**
  - Projects 與 Labs 各自獨立 revert。

### 第一順位

Phase 2B 最適合先實作的是 **候選 A：Engineering Projects detail（約 12170–12504）**。

它不是零風險，但相較其他區段：

- 位於檔尾。
- 有清楚 root class。
- EJS 有實際使用點。
- 頁面集合有限。
- 可用單一 commit 搬移與回退。

真正執行前仍必須先逐條確認區段內沒有 unscoped selector，並建立三語、light/dark、desktop/mobile baseline。

---

## 5. 暫時禁止修改區域

Phase 2B 第一個 scoped extraction 完成並通過驗證前，禁止碰以下區域：

| 區域 | 行號／區段 | 原因 |
| --- | --- | --- |
| 未命名基礎層 | 1–668 | 全站 base，後方依賴它形成 cascade |
| 早期與最終 dark/light overrides | #1、#5–#7、#15–#16、#19–#22 | 大量全域 selector、theme wrapper 與 `!important` |
| 所有 `keep at EOF`／`final override` | 見 1.3 | 位置本身是行為的一部分 |
| Header | #11–#13、#45、#53、#56 及前方同 selector | 多代覆寫、全站影響 |
| Navigation | #12–#13、#45–#46、#53、#56 | Desktop/mobile/language/active state 交錯 |
| Theme controls | #10、#11、#45–#46、#53 | 與 `[data-theme]`、mobile menu、accessibility control 耦合 |
| Mobile menu | #8、#10–#13、#45–#46、#53、#56 | 約 18 次 button、10 次 menu、11 次 link 重複 |
| Home hero 與 Home shell | #17、#28、#35–#38、#49、#51–#52 | 多代 hero、spacing、hover 與 theme surface 修正 |
| 舊 terminal Home | #2–#4、#7、#9 | 是否仍輸出待確認，不能因名稱帶版本就刪除 |
| About | #23–#26、#39 | 多版 markup 與 `nth-of-type` DOM 依賴 |
| Posts/Page wrappers | #20–#21、#40、#49 | 全域 article/page 與 Field Notes 交錯 |
| Field Notes Index | #41、#49–#50 | Link clickability、z-index、hover protection 的後置修正 |
| Research | #44、#48–#49 | 依賴跨頁 hover override |
| Experience final scope | #55–#56 | #56 混合 Header 與 Experience，不能整段搬移 |
| 全域 card selector | `.article`、`.post`、`.featured-project-*`、`.project-card`、`.home-card` | 被多頁最終 hover fixes 壓制 |
| Responsive 集中整理 | 全檔 88 個 media query | 搬到統一檔案會改變相對 cascade |
| `:root` 與 theme tokens | 多個區段 | 同名 token 多次覆寫，實際最終值需 computed style 確認 |

### Phase 2B 前置條件

在移動第一條 CSS 前，至少需要：

- [ ] 確認目標區段內每個 selector 的 page scope。
- [ ] 記錄目標頁面三語 route。
- [ ] 建立 desktop、tablet、mobile screenshots。
- [ ] 建立 light/dark screenshots。
- [ ] 記錄關鍵節點 computed style。
- [ ] 確認 stylesheet 載入順序。
- [ ] 每個 extraction 僅一個 commit。
- [ ] 發生非預期 HTML 或視覺差異時立即停止並回退。
