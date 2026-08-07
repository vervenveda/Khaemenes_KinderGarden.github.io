(() => {
  "use strict";
  const KEY = "khaemenes_kindergarten_36_aplus_v1";
  let state = {};
  try{ state = JSON.parse(localStorage.getItem(KEY)) || {}; }catch{ state = {}; }
  const weekly = state.weekly || {};
  const scores = Object.values(weekly).map(Number).filter(Boolean);
  const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
  const done = Object.values(weekly).filter(v => Number(v) >= 80).length;
  const ready = avg >= 80 && Number(state.midterm || 0) >= 80 && Number(state.final || 0) >= 80 && !!state.portfolio;
  const name = state.student || "Kindergarten Scholar";
  document.getElementById("out").innerHTML = ready ? `
    <section class="print-page" style="text-align:center;max-width:1000px;border:12px double #c59b49">
      <p style="letter-spacing:.16em;text-transform:uppercase">Khaemenes Academy</p>
      <h1>Certificate of Kindergarten Completion</h1>
      <p>This certifies that</p>
      <h2>${name.replace(/[<>&]/g,"")}</h2>
      <p>has completed the Khaemenes Academy Kindergarten 36 Unit A+ Curriculum.</p>
      <p><strong>Weekly Average:</strong> ${avg}% · <strong>Units at 80%+:</strong> ${done}/36 · <strong>Midterm:</strong> ${state.midterm}% · <strong>Final:</strong> ${state.final}%</p>
      <p>The learner completed daily lessons, activities, workshops, printables, weekly assessments, portfolio evidence, midyear review, final readiness demonstration, and adult mentor review.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:70px">
        <div class="print-line">Adult Mentor / Teacher</div>
        <div class="print-line">Date</div>
      </div>
      <p style="margin-top:50px">Jennifer Kay Pearl · Khaemenes Academy · 2026</p>
      <button class="button no-print" onclick="window.print()">Print Certificate</button>
    </section>` : `
    <section class="print-page" style="text-align:center">
      <h1>Certificate Locked</h1>
      <p>The certificate opens when weekly average, midterm, final, and portfolio approval all meet the 80% completion rule.</p>
      <p><strong>Weekly Average:</strong> ${avg}% · <strong>Midterm:</strong> ${state.midterm || 0}% · <strong>Final:</strong> ${state.final || 0}% · <strong>Portfolio:</strong> ${state.portfolio ? "Approved" : "Pending"}</p>
      <a class="button" href="../index.html">Return to Portal</a>
    </section>`;
})();
