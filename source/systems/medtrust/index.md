---
title: MedTrust
description: MedTrust 是用來測試 Medical IoT 信任與證據處理的系統。
site_lang: zh-TW
layout: page
type: ia
comments: true
---

<section class="ia-page ia-page--system-detail" lang="zh-Hant">
  <header class="ia-hero">
    <div class="ia-hero__copy">
      <p class="ia-eyebrow">系統／目前</p>
      <h1>MedTrust</h1>
      <p>Medical IoT Trust &amp; Evidence System。MedTrust 驗證醫療 IoT message、記錄 Attack Validation、封裝實驗證據，並檢查 Evidence Integrity 的一致性。</p>
    </div>
    <dl class="ia-hero-meta">
      <div><dt>領域</dt><dd>Medical IoT 信任</dd></div>
      <div><dt>狀態</dt><dd>目前</dd></div>
      <div><dt>範圍</dt><dd>完整性一致性</dd></div>
    </dl>
  </header>

  <article class="ia-record ia-record--primary">
    <aside>
      <span>概覽</span>
      <strong>目前</strong>
    </aside>
    <div>
      <h2>系統概覽</h2>
      <p class="ia-lead">Gateway 是 trust boundary。收到資料不夠；message 本身與 export 後的 Evidence Package 都需要被驗證。</p>
      <dl class="ia-definition-list">
        <div><dt>系統</dt><dd>Medical IoT 信任與證據系統</dd></div>
        <div><dt>不是</dt><dd>醫院平台 / 護理工作平台</dd></div>
        <div><dt>目前主張</dt><dd>Integrity consistency，不宣稱 Digital Signature、Identity Proof 或 Non-repudiation</dd></div>
      </dl>
    </div>
  </article>

  <article class="ia-record">
    <aside><span>01</span><strong>架構</strong></aside>
    <div>
      <h2>系統架構</h2>
      <div class="ia-flow" aria-label="MedTrust architecture">
        <span>ESP32-S3</span>
        <span>Attack ESP32</span>
        <span>FastAPI Gateway</span>
        <span>SQLite</span>
        <span>React Dashboard</span>
        <span>Evidence Package</span>
        <span>Offline Verifier</span>
      </div>
      <div class="ia-grid ia-grid--three">
        <section class="ia-panel">
          <p class="ia-tech-label">裝置層</p>
          <h3>ESP32-S3 / Attack ESP32</h3>
          <p>有效裝置與攻擊情境分開產生，讓驗證不只測成功路徑，也測惡意或錯誤路徑。</p>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">Gateway 層</p>
          <h3>FastAPI + SQLite</h3>
          <p>Gateway 檢查 device identity、key_id、HMAC-SHA256、timestamp、sequence number、nonce 與 replay state，再記錄 experiment result。</p>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">證據層</p>
          <h3>Package + Verifier</h3>
          <p>Evidence Package 保存 file hash、package digest、manifest data 與 Offline Verification 結果，用來偵測 tamper。</p>
        </section>
      </div>
    </div>
  </article>

  <article class="ia-record">
    <aside><span>02</span><strong>流程</strong></aside>
    <div>
      <h2>驗證流程</h2>
      <div class="ia-flow ia-flow--pipeline" aria-label="Verification pipeline">
        <span>Canonical JSON</span>
        <span>device_id / key_id</span>
        <span>HMAC-SHA256</span>
        <span>timestamp</span>
        <span>sequence / nonce</span>
        <span>experiment result</span>
      </div>
      <ul class="ia-check-list">
        <li>Valid message</li>
        <li>Invalid signature</li>
        <li>Unknown device</li>
        <li>Wrong key</li>
        <li>Replay attempt</li>
      </ul>
    </div>
  </article>

  <article class="ia-record">
    <aside><span>03</span><strong>驗證</strong></aside>
    <div>
      <h2>攻擊驗證</h2>
      <div class="ia-grid ia-grid--two">
        <section class="ia-panel">
          <p class="ia-tech-label">攻擊裝置</p>
          <h3>Attack ESP32</h3>
          <p>Attack scenarios 用來確認 Gateway 會擋下 invalid 或 replayed message。系統會保留 attack outcome，而不是只展示成功訊息。</p>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">Gateway 回應</p>
          <h3>Reject and record</h3>
          <p>Invalid signature、replay、unknown device、wrong-key 會被分類，讓 experiment result 可以被保存與回頭檢查。</p>
        </section>
      </div>
    </div>
  </article>

  <article class="ia-record">
    <aside><span>04</span><strong>實驗</strong></aside>
    <div>
      <h2>實驗系統</h2>
      <div class="ia-grid ia-grid--three">
        <section class="ia-panel">
          <p class="ia-tech-label">BATCH</p>
          <h3>Experiment Batch</h3>
          <p>把 valid case 與 attack case 放進可重複檢查的 evidence unit。</p>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">DASHBOARD</p>
          <h3>React status surface</h3>
          <p>顯示 message validation 與 evidence integrity state，但不把測試結果包裝成 KPI。</p>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">API</p>
          <h3>Integrity API</h3>
          <p>提供 package verification state，讓 Dashboard 與 report generation 可以使用。</p>
        </section>
      </div>
    </div>
  </article>

  <article class="ia-record">
    <aside><span>05</span><strong>證據</strong></aside>
    <div>
      <h2>Evidence Package</h2>
      <ul class="ia-inline-list">
        <li>Report Package</li>
        <li>integrity-manifest.json</li>
        <li>SHA-256 file hashes</li>
        <li>deterministic package digest</li>
        <li>print/PDF report provenance</li>
      </ul>
    </div>
  </article>

  <article class="ia-record">
    <aside><span>06</span><strong>完整性</strong></aside>
    <div>
      <h2>Integrity Verification</h2>
      <p class="ia-lead">Evidence Integrity 目前指的是 integrity consistency。</p>
      <div class="ia-grid ia-grid--two">
        <section class="ia-panel">
          <p class="ia-tech-label">離線驗證工具</p>
          <h3>Recompute and compare</h3>
          <p>Export 後的檔案可以重新 hash，package digest 可以重算，Offline Verifier 可以偵測 tamper。</p>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">範圍限制</p>
          <h3>No identity proof claim</h3>
          <p>目前範圍不宣稱 Digital Signature、Identity Proof 或 Non-repudiation。</p>
        </section>
      </div>
    </div>
  </article>

  <article class="ia-record">
    <aside><span>07</span><strong>測試</strong></aside>
    <div>
      <h2>測試與驗證</h2>
      <div class="ia-metric-row">
        <div class="ia-metric"><span>pytest</span><strong>76 passed</strong></div>
        <div class="ia-metric"><span>npm run build</span><strong>success</strong></div>
        <div class="ia-metric"><span>pio run</span><strong>success</strong></div>
      </div>
      <p class="ia-related"><a href="/archive/">結案階段：Evidence Integrity</a> <a href="/journal/series/medtrust/">MedTrust Series</a></p>
    </div>
  </article>
</section>
