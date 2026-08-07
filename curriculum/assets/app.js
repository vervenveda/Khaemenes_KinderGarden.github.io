(() => {
  "use strict";

  const DATA = window.KHAE_KINDERGARTEN_DATA;
  const KEY = "khaemenes_kindergarten_36_aplus_v1";

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));

  function readState(){
    try{
      return JSON.parse(localStorage.getItem(KEY)) || {student:"Kindergarten Scholar", weekly:{}, midterm:0, final:0, portfolio:false};
    }catch{
      return {student:"Kindergarten Scholar", weekly:{}, midterm:0, final:0, portfolio:false};
    }
  }

  let state = readState();

  function save(){
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function weeklyAverage(){
    const values = DATA.units.map(unit => Number(state.weekly[unit.unit] || 0)).filter(Boolean);
    if(!values.length) return 0;
    return Math.round(values.reduce((a,b) => a + b, 0) / values.length);
  }

  function completedUnits(){
    return DATA.units.filter(unit => Number(state.weekly[unit.unit] || 0) >= DATA.course.passingScore).length;
  }

  function certificationReady(){
    return weeklyAverage() >= 80 && Number(state.midterm || 0) >= 80 && Number(state.final || 0) >= 80 && !!state.portfolio;
  }

  function renderDashboard(){
    const avg = weeklyAverage();
    const done = completedUnits();
    const ready = certificationReady();
    $("studentName").value = state.student || "";
    $("midtermScore").value = state.midterm || "";
    $("finalScore").value = state.final || "";
    $("portfolio").checked = !!state.portfolio;
    $("summary").innerHTML = `
      <div class="grid cols-4">
        <article class="card stat"><strong>${done}/36</strong><span>Units at 80%+</span></article>
        <article class="card stat"><strong>${avg}%</strong><span>Weekly average</span></article>
        <article class="card stat"><strong>${state.midterm || 0}%</strong><span>Midterm</span></article>
        <article class="card stat"><strong>${state.final || 0}%</strong><span>Final</span></article>
      </div>
      <div class="profile-box" style="margin-top:16px">
        <h3>${ready ? "Certificate Ready" : "Certificate Locked"}</h3>
        <p>${ready ? "All 80% completion gates are met. The certificate page may be printed." : "Certificate requires weekly average 80%+, midterm 80%+, final 80%+, and adult portfolio approval."}</p>
        <div class="progress"><span style="width:${Math.min(100, Math.round((done/36)*100))}%"></span></div>
        <div class="actions">
          <a class="button ${ready ? "gold" : ""}" href="records/certificate.html">Open Certificate</a>
          <button type="button" class="button" id="exportBtn">Export Records</button>
        </div>
      </div>`;
    $("exportBtn").addEventListener("click", exportRecords);
  }

  function renderUnits(){
    $("unitGrid").innerHTML = DATA.units.map(unit => `
      <article class="card week-card">
        <div class="emblem">${String(unit.unit).padStart(2,"0")}</div>
        <h3>${esc(unit.title)}</h3>
        <p><strong>Question:</strong> ${esc(unit.essentialQuestion)}</p>
        <div class="badges">
          <span class="badge">5 lessons</span>
          <span class="badge">Printable</span>
          <span class="badge">Assessment</span>
        </div>
        <label>Weekly assessment score</label>
        <input type="number" min="0" max="100" value="${state.weekly[unit.unit] || ""}" data-score="${unit.unit}" placeholder="0–100">
        <div class="actions">
          <a class="button" href="lessons/unit-${String(unit.unit).padStart(2,"0")}/index.html">Open Unit</a>
          <a class="button light" href="printables/unit-${String(unit.unit).padStart(2,"0")}-packet.html">Printable</a>
        </div>
      </article>`).join("");
    document.querySelectorAll("[data-score]").forEach(input => {
      input.addEventListener("input", () => {
        const value = Math.max(0, Math.min(100, Number(input.value || 0)));
        state.weekly[input.dataset.score] = value;
        save();
        renderDashboard();
      });
    });
  }

  function bindProfile(){
    $("saveProfile").addEventListener("click", () => {
      state.student = $("studentName").value.trim() || "Kindergarten Scholar";
      state.midterm = Math.max(0, Math.min(100, Number($("midtermScore").value || 0)));
      state.final = Math.max(0, Math.min(100, Number($("finalScore").value || 0)));
      state.portfolio = $("portfolio").checked;
      save();
      renderDashboard();
      renderUnits();
    });
    $("clearRecords").addEventListener("click", () => {
      if(!confirm("Clear local kindergarten records on this device?")) return;
      localStorage.removeItem(KEY);
      state = readState();
      renderDashboard();
      renderUnits();
    });
  }

  function exportRecords(){
    const payload = {course:DATA.course.title, exported:new Date().toISOString(), state};
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "khaemenes-kindergarten-records.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function renderStandards(){
    const target = $("standardsGrid");
    if(!target) return;
    target.innerHTML = DATA.standardsFamilies.map(item => `
      <article class="card">
        <div class="emblem">${esc(item.code.replace("KHAE-",""))}</div>
        <h3>${esc(item.label)}</h3>
        <p>${esc(item.description)}</p>
      </article>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("year").textContent = new Date().getFullYear();
    bindProfile();
    renderDashboard();
    renderUnits();
    renderStandards();
  });
})();
