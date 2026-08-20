---
title: 研究方向
description: Seraph 目前正在研究的問題。
site_lang: zh-TW
layout: page
type: ia
comments: true
---

<section class="ia-page ia-page--research" lang="zh-Hant">
  <header class="ia-hero">
    <div class="ia-hero__copy">
      <p class="ia-eyebrow">RESEARCH / CURRENT</p>
      <h1>Medical IoT Trust</h1>
      <p>這裡放的是我目前正在研究的問題，不是 project list。現在的主要研究是 Medical IoT Trust：裝置資料可信、訊息驗證、Replay Protection，以及可以再次驗證的 Evidence Integrity。</p>
    </div>
    <dl class="ia-hero-meta">
      <div><dt>主要方向</dt><dd>Medical IoT Security</dd></div>
      <div><dt>相關系統</dt><dd>MedTrust</dd></div>
      <div><dt>狀態</dt><dd>CURRENT</dd></div>
    </dl>
  </header>

  <article class="ia-record ia-record--primary">
    <aside>
      <span>R-001</span>
      <strong>CURRENT PRIMARY</strong>
    </aside>
    <div>
      <h2>Medical IoT Trust</h2>
      <p class="ia-lead">Gateway 收到資料，不代表資料本身值得信任。</p>

      <div class="ia-grid ia-grid--two">
        <section class="ia-panel">
          <p class="ia-tech-label">研究問題</p>
          <h3>Gateway 收到資料之後，究竟能相信什麼？</h3>
          <p>醫療 IoT 裝置送出的資料，如何在 Gateway 端被確認是來自已知裝置、沒有被 Replay，並且能留下可再次驗證的實驗證據？</p>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">問題</p>
          <h3>Gateway 是 trust boundary。</h3>
          <p>它必須拒絕偽造訊息、Replay message、未知裝置、錯誤 key、被修改的 message body，以及 Evidence export 後的變動。</p>
        </section>
      </div>

      <div class="ia-grid ia-grid--three">
        <section class="ia-panel">
          <p class="ia-tech-label">目前研究</p>
          <ul>
            <li>Device identity 與 key_id validation</li>
            <li>Canonical JSON</li>
            <li>HMAC-SHA256</li>
            <li>timestamp / sequence number / nonce</li>
            <li>Replay Protection</li>
            <li>Attack ESP32</li>
            <li>Experiment Batch</li>
            <li>SHA-256 Evidence Hashing</li>
          </ul>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">假設</p>
          <ul>
            <li>實驗前已完成 device secret provisioning。</li>
            <li>Gateway 可以保存 replay check 需要的裝置狀態。</li>
            <li>Evidence Integrity 目前只代表 integrity consistency，不代表 identity proof。</li>
          </ul>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">威脅</p>
          <ul>
            <li>未知裝置送資料到 Gateway。</li>
            <li>有效 payload 被重新送出。</li>
            <li>message body 在簽章後被修改。</li>
            <li>Evidence export 後檔案被改動。</li>
          </ul>
        </section>
      </div>

      <section class="ia-panel">
        <p class="ia-tech-label">驗證方向</p>
        <p>驗證會以可重複的實驗為主：valid message、attack message、Replay attempt、package integrity check、Tamper Detection，以及 Offline Verifier 的輸出。</p>
        <p class="ia-related"><a href="/systems/medtrust/">相關系統：MedTrust</a> <a href="/journal/series/medtrust/">相關紀錄：MedTrust Series</a></p>
      </section>
    </div>
  </article>

  <section class="ia-grid ia-grid--two" aria-label="次要研究方向">
    <article class="ia-record ia-record--compact">
      <aside>
        <span>R-002</span>
        <strong>CURRENT</strong>
      </aside>
      <div>
        <h2>Embedded Security</h2>
        <p class="ia-lead">小型裝置常常先產生資料，卻沒有先定義清楚的 trust model。</p>
        <ul class="ia-inline-list">
          <li>Constrained message format</li>
          <li>Firmware counters</li>
          <li>Nonce behavior</li>
          <li>Attack-device validation</li>
        </ul>
      </div>
    </article>

    <article class="ia-record ia-record--compact">
      <aside>
        <span>R-003</span>
        <strong>CURRENT</strong>
      </aside>
      <div>
        <h2>Infrastructure / Home Lab Trust Boundary</h2>
        <p class="ia-lead">自架環境如果沒有明確記錄服務暴露、復原方式與網路邊界，就很難長期維護。</p>
        <ul class="ia-inline-list">
          <li>Linux services</li>
          <li>Docker</li>
          <li>Tailscale</li>
          <li>OpenWrt</li>
          <li>MQTT / Node-RED</li>
        </ul>
        <p class="ia-related"><a href="/systems/home-lab/">相關系統：Home Lab</a></p>
      </div>
    </article>
  </section>
</section>
