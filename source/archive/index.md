---
title: 結案紀錄
description: 已完成並驗證的技術階段。
site_lang: zh-TW
layout: page
type: ia
comments: true
---

<section class="ia-page ia-page--archive" lang="zh-Hant">
  <header class="ia-hero">
    <div class="ia-hero__copy">
      <p class="ia-eyebrow">結案紀錄</p>
      <h1>已完成的技術階段</h1>
      <p>這裡記錄已完成並驗證的技術成果。專案可以繼續往下做，但完成一個階段就留下結案紀錄。</p>
    </div>
    <dl class="ia-hero-meta">
      <div><dt>模式</dt><dd>階段結案</dd></div>
      <div><dt>狀態</dt><dd>已結案紀錄</dd></div>
      <div><dt>目前專案</dt><dd>MedTrust</dd></div>
    </dl>
  </header>

  <article class="ia-milestone">
    <aside class="ia-milestone__stamp">
      <span>2026.08</span>
      <strong>已結案</strong>
      <span>MedTrust</span>
    </aside>
    <div>
      <h2>Evidence Integrity Phase</h2>
      <p class="ia-lead">MedTrust 的 Evidence Package integrity consistency 階段結案：file hashing、deterministic digest、API status、Dashboard visibility、Offline Verification 與 Tamper Detection。</p>

      <div class="ia-grid ia-grid--two">
        <section class="ia-panel">
          <p class="ia-tech-label">完成項目</p>
          <ul>
            <li>Integrity Manifest</li>
            <li>SHA-256 File Hashing</li>
            <li>Package Digest</li>
            <li>Integrity API</li>
            <li>Dashboard Integrity</li>
            <li>Offline Verifier</li>
            <li>Tamper Detection</li>
            <li>Report Provenance</li>
          </ul>
        </section>
        <section class="ia-panel">
          <p class="ia-tech-label">驗證結果</p>
          <div class="ia-metric-row">
            <div class="ia-metric"><span>pytest</span><strong>76 passed</strong></div>
            <div class="ia-metric"><span>npm build</span><strong>success</strong></div>
            <div class="ia-metric"><span>pio run</span><strong>success</strong></div>
          </div>
          <h3>範圍說明</h3>
          <p>這個 phase 描述的是 integrity consistency。不宣稱 Digital Signature、Identity Proof 或 Non-repudiation。</p>
        </section>
      </div>

      <p class="ia-related"><a href="/systems/medtrust/">相關系統</a> <a href="/journal/series/medtrust/">相關紀錄</a></p>
    </div>
  </article>

  <section class="ia-grid ia-grid--two" aria-label="過往工作分類">
    <article class="ia-panel"><p class="ia-tech-label">早期方向</p><h2>SecureCare</h2><p>MedTrust 之前的早期醫療資安探索。</p></article>
    <article class="ia-panel"><p class="ia-tech-label">競賽經歷</p><h2>競賽與團隊工程</h2><p>保留已公開的 CTF 與過往競賽紀錄，但不作為首頁主要內容。</p></article>
    <article class="ia-panel"><p class="ia-tech-label">過往系統</p><h2>過往專案</h2><p>已完成或不再是當前重點的工程系統，仍保留可追溯的設計與反思。</p><p class="ia-related"><a href="/projects/">查看舊專案</a></p></article>
    <article class="ia-panel"><p class="ia-tech-label">過往研究</p><h2>過往研究方向</h2><p>未繼續發展的假設與早期探索會留在這裡，讓技術決策的脈絡仍可被理解。</p><p class="ia-related"><a href="/experience/research/">查看研究經歷</a></p></article>
  </section>
</section>
