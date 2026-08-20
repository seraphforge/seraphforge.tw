---
title: Research
description: Current research questions behind Seraph technical work.
site_lang: en
layout: page
type: ia
comments: true
---

<section class="ia-page ia-page--research" lang="en">
  <header class="ia-hero">
    <div class="ia-hero__copy">
      <p class="ia-eyebrow">RESEARCH / CURRENT</p>
      <h1>Medical IoT Trust</h1>
      <p>Research is where I define the problem before treating an implementation as proof. The current primary research area is Medical IoT Trust: device identity, message authentication, Replay Protection, and verifiable Evidence Integrity.</p>
    </div>
    <dl class="ia-hero-meta">
      <div><dt>Primary</dt><dd>Medical IoT Security</dd></div>
      <div><dt>System</dt><dd>MedTrust</dd></div>
      <div><dt>Status</dt><dd>CURRENT</dd></div>
    </dl>
  </header>

  <article class="ia-record ia-record--primary">
    <aside><span>R-001</span><strong>CURRENT PRIMARY</strong></aside>
    <div>
      <h2>Medical IoT Trust</h2>
      <p class="ia-lead">A Gateway receiving data does not mean the data itself is trustworthy.</p>
      <div class="ia-grid ia-grid--two">
        <section class="ia-panel"><p class="ia-tech-label">RESEARCH QUESTION</p><h3>What can the Gateway trust?</h3><p>How can medical IoT data be verified as coming from a known device, not replayed, and preserved as evidence that can be checked again?</p></section>
        <section class="ia-panel"><p class="ia-tech-label">PROBLEM</p><h3>The Gateway is a trust boundary.</h3><p>It must reject forged messages, Replay message, unknown devices, wrong keys, modified message body, and changes after Evidence export.</p></section>
      </div>
      <p class="ia-related"><a href="/en/systems/medtrust/">Related System: MedTrust</a> <a href="/en/journal/">Related Journal</a></p>
    </div>
  </article>
</section>
