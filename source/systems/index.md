---
title: 工程系統
description: Seraph 目前實際做出來、正在維護的系統。
site_lang: zh-TW
layout: page
type: ia
comments: true
---

<section class="ia-page ia-page--systems" lang="zh-Hant">
  <header class="ia-hero">
    <div class="ia-hero__copy">
      <p class="ia-eyebrow">SYSTEMS / CURRENT</p>
      <h1>目前系統</h1>
      <p>這裡放的是我實際做出來、正在維護的系統。Systems 呈現目前版本；舊架構與歷史改動會放在 Journal 或 Archive。</p>
    </div>
    <dl class="ia-hero-meta">
      <div><dt>主要系統</dt><dd>MedTrust</dd></div>
      <div><dt>基礎設施</dt><dd>Home Lab</dd></div>
      <div><dt>演進脈絡</dt><dd>SecureCare</dd></div>
    </dl>
  </header>

  <article class="ia-record ia-record--primary">
    <aside>
      <span>SYS-001</span>
      <strong>CURRENT PRIMARY</strong>
    </aside>
    <div>
      <h2><a href="/systems/medtrust/">MedTrust</a></h2>
      <p class="ia-lead">Medical IoT Trust &amp; Evidence System。</p>
      <p>目前 MedTrust 已包含 ESP32-S3、Attack ESP32、FastAPI Gateway、SQLite、React Dashboard、HMAC-SHA256、Replay Protection、Device / Key Validation、Experiment Batch、Evidence Package、SHA-256 Integrity、Offline Verification 與 Tamper Detection。</p>
      <ul class="ia-inline-list">
        <li>Architecture</li>
        <li>Verification Pipeline</li>
        <li>Attack Validation</li>
        <li>Experiment System</li>
        <li>Evidence Package</li>
        <li>Integrity Verification</li>
        <li>Tests / Validation</li>
      </ul>
      <p class="ia-related"><a href="/systems/medtrust/">開啟系統</a> <a href="/archive/">Evidence Integrity Phase</a> <a href="/journal/series/medtrust/">MedTrust Series</a></p>
    </div>
  </article>

  <article class="ia-record">
    <aside>
      <span>SYS-002</span>
      <strong>CURRENT</strong>
    </aside>
    <div>
      <h2><a href="/systems/home-lab/">Home Lab</a></h2>
      <p class="ia-lead">Self-hosted Infrastructure / Personal Infrastructure。</p>
      <p>我用來跑 Ubuntu Server、Docker、Tailscale、OpenWrt、MQTT、Node-RED 與其他自架服務的基礎設施環境。Home Lab 和 MedTrust 是不同系統。</p>
      <ul class="ia-inline-list">
        <li>Ubuntu Server</li>
        <li>Docker</li>
        <li>Tailscale</li>
        <li>OpenWrt</li>
        <li>MQTT</li>
        <li>Node-RED</li>
      </ul>
      <p class="ia-related"><a href="/systems/home-lab/">開啟系統</a></p>
    </div>
  </article>

  <article class="ia-record ia-record--muted">
    <aside>
      <span>EARLY</span>
      <strong>HISTORY</strong>
    </aside>
    <div>
      <h2>SecureCare</h2>
      <p>SecureCare 是早期醫療資安方向。目前它已經不是主要系統，相關技術演進後來進入 MedTrust。</p>
      <p class="ia-related"><a href="/systems/securecare/">相容說明</a></p>
    </div>
  </article>
</section>
