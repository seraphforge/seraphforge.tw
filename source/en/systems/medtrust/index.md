---
title: MedTrust
description: MedTrust is my system for testing trust and evidence handling in Medical IoT.
site_lang: en
layout: page
type: ia
comments: true
---

<section class="ia-page ia-page--system-detail" lang="en">
  <header class="ia-hero">
    <div class="ia-hero__copy">
      <p class="ia-eyebrow">SYSTEM / CURRENT</p>
      <h1>MedTrust</h1>
      <p>MedTrust is my Medical IoT Trust &amp; Evidence System. It verifies Medical IoT messages, records Attack Validation, packages experiment evidence, and checks Evidence Integrity.</p>
    </div>
    <dl class="ia-hero-meta">
      <div><dt>Domain</dt><dd>Medical IoT Trust</dd></div>
      <div><dt>Status</dt><dd>CURRENT</dd></div>
      <div><dt>Scope</dt><dd>Integrity Consistency</dd></div>
    </dl>
  </header>
  <article class="ia-record ia-record--primary"><aside><span>Overview</span><strong>CURRENT</strong></aside><div><h2>System Overview</h2><p class="ia-lead">The Gateway is the trust boundary. Receiving data is not enough; messages and exported Evidence Packages must be verified.</p></div></article>
  <article class="ia-record"><aside><span>01</span><strong>Architecture</strong></aside><div><h2>Architecture</h2><div class="ia-flow"><span>ESP32-S3</span><span>Attack ESP32</span><span>FastAPI Gateway</span><span>SQLite</span><span>React Dashboard</span><span>Evidence Package</span><span>Offline Verifier</span></div></div></article>
  <article class="ia-record"><aside><span>02</span><strong>Pipeline</strong></aside><div><h2>Verification Pipeline</h2><div class="ia-flow ia-flow--pipeline"><span>Canonical JSON</span><span>device_id / key_id</span><span>HMAC-SHA256</span><span>timestamp</span><span>sequence / nonce</span><span>experiment result</span></div></div></article>
  <article class="ia-record"><aside><span>03</span><strong>Tests</strong></aside><div><h2>Tests / Validation</h2><div class="ia-metric-row"><div class="ia-metric"><span>pytest</span><strong>76 passed</strong></div><div class="ia-metric"><span>npm run build</span><strong>success</strong></div><div class="ia-metric"><span>pio run</span><strong>success</strong></div></div></div></article>
</section>
