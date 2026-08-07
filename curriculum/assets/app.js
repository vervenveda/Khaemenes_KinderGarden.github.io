(() => {
  "use strict";

  const DATA = window.KHAE_KINDERGARTEN_DATA;
  const LEGACY_KEY = "khaemenes_kindergarten_36_aplus_v1";
  const CONTINUITY = window.KhaemenesKinderContinuity || null;

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));

  function fallbackState(){
    return {
      student:"Kindergarten Scholar",
      weekly:{},
      midterm:0,
      final:0,
      portfolio:false
    };
  }

  function readLegacy(){
    try{
      return JSON.parse(localStorage.getItem(LEGACY_KEY)) || fallbackState();
    }catch{
      return fallbackState();
    }
  }

  function readState(){
    return CONTINUITY
      ? CONTINUITY.loadCurriculumState(fallbackState())
      : readLegacy();
  }

  let state = readState();

  function save(){
    if(CONTINUITY){
      state=CONTINUITY.saveCurriculumState(state);
    }else{
      localStorage.setItem(LEGACY_KEY,JSON.stringify(state));
    }
  }

  function learnerSummary(){
    return CONTINUITY?.getLearnerSummary?.() || {
      hasProfile:false,
      nickname:null,
      mentor:null,
      guardianAuthorized:false
    };
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
    return weeklyAverage() >= 80 &&
      Number(state.midterm || 0) >= 80 &&
      Number(state.final || 0) >= 80 &&
      !!state.portfolio;
  }

  function renderLearnerLink(){
    const target=$("learnerLink");
    if(!target) return;

    const learner=learnerSummary();
    if(!learner.hasProfile){
      target.innerHTML=`
        <div class="profile-box">
          <h3>Standalone curriculum record</h3>
          <p>No shared Khaemenes learner profile is active in this browser. The curriculum still works with the existing local record.</p>
          <div class="actions">
            <a class="button gold" href="../index.html#mentor">Set up learner & mentor</a>
          </div>
        </div>`;
      $("studentName").readOnly=false;
      return;
    }

    const mentor=learner.mentor || {};
    target.innerHTML=`
      <div class="profile-box linked-learner">
        <div class="linked-mentor-avatar" style="--mentor-a:${esc(mentor.colors?.[0] || "#f6bf3a")};--mentor-b:${esc(mentor.colors?.[1] || "#ef6a66")}">${esc(mentor.avatar || "🌱")}</div>
        <div>
          <h3>${esc(learner.nickname || "Kinder Garden learner")} · Linked Khaemenes Learner</h3>
          <p><strong>${esc(mentor.name || "Mentor")}</strong> continues as this learner's Kinder Garden mentor. Curriculum scores are attached to the stable learner ID and mirrored to the legacy record key for compatibility.</p>
          <div class="badges">
            <span class="badge">Learner ID linked</span>
            <span class="badge">${learner.guardianAuthorized ? "Guardian authorization active" : "Guardian review needed"}</span>
            <span class="badge">Local browser record</span>
          </div>
          <div class="actions">
            <a class="button" href="../index.html#mentor">Open My Mentor</a>
            <a class="button light" href="../index.html#mygarden">Open My Garden</a>
          </div>
        </div>
      </div>`;

    if(learner.nickname){
      state.student=learner.nickname;
      $("studentName").value=learner.nickname;
      $("studentName").readOnly=true;
      save();
    }
  }

  function renderDashboard(){
    const avg = weeklyAverage();
    const done = completedUnits();
    const ready = certificationReady();
    const learner=learnerSummary();

    if(learner.hasProfile && learner.nickname){
      state.student=learner.nickname;
    }

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
    renderLearnerLink();
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
      const learner=learnerSummary();
      state.student = learner.hasProfile && learner.nickname
        ? learner.nickname
        : ($("studentName").value.trim() || "Kindergarten Scholar");

      state.midterm = Math.max(0, Math.min(100, Number($("midtermScore").value || 0)));
      state.final = Math.max(0, Math.min(100, Number($("finalScore").value || 0)));
      state.portfolio = $("portfolio").checked;
      save();
      renderDashboard();
      renderUnits();
    });

    $("clearRecords").addEventListener("click", () => {
      const learner=learnerSummary();
      const wording=learner.hasProfile
        ? `Clear only ${learner.nickname || "this learner"}'s local Kindergarten curriculum record on this device? The learner profile, mentor, Crechè favorites, and Preschool history will remain.`
        : "Clear local kindergarten curriculum records on this device?";

      if(!confirm(wording)) return;

      if(CONTINUITY){
        CONTINUITY.clearActiveCurriculumRecord();
        state=CONTINUITY.loadCurriculumState(fallbackState());
      }else{
        localStorage.removeItem(LEGACY_KEY);
        state=readLegacy();
      }

      renderDashboard();
      renderUnits();
    });
  }

  function exportRecords(){
    const learner=learnerSummary();
    const payload = {
      course:DATA.course.title,
      exported:new Date().toISOString(),
      learner:learner.hasProfile ? {
        learnerId:learner.learnerId,
        nickname:learner.nickname,
        ageBand:learner.ageBand,
        pathway:learner.pathway,
        mentorId:learner.mentorId,
        mentorName:learner.mentor?.name || null,
        guardianAuthorized:learner.guardianAuthorized
      } : null,
      state,
      note:"Family-controlled local educational record. Curriculum scores are not diagnoses. Existing legacy curriculum compatibility is preserved."
    };
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug=(learner.nickname || state.student || "learner").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    a.download = `khaemenes-kindergarten-${slug || "learner"}-records.json`;
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
    state=readState();
    bindProfile();
    renderDashboard();
    renderUnits();
    renderStandards();

    if(CONTINUITY?.subscribe){
      CONTINUITY.subscribe(()=>{
        state=readState();
        renderDashboard();
        renderUnits();
      });
    }
  });
})();
