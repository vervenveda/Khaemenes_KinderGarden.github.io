(() => {
  "use strict";

  const DATA=window.KHAE_KINDERGARTEN_DATA;
  const CONTINUITY=window.KhaemenesKinderContinuity||null;
  const GATES=window.KhaemenesKinderMasteryGates||null;
  const PASS=80;
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function learnerSummary(){
    return CONTINUITY?.getLearnerSummary?.()||{hasProfile:false,hasLinkedLearner:false,stageEligible:false,nickname:null,mentor:null,guardianAuthorized:false};
  }
  function formalAccess(){return Boolean(GATES?.formalAccess?.())}
  function familyUrl(){return "https://vervenveda.com/Khaemenes_Academy.github.io/family/"}
  function completedUnits(){return Number(GATES?.completedWeeks?.()||0)}
  function weeklyAverage(){
    if(!GATES)return 0;
    const values=[];
    for(let n=1;n<=36;n++){const v=Number(GATES.weekMastery(n)?.bestPercent||0);if(v>0)values.push(v)}
    return values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0;
  }
  function canOpenWeek(n){return Boolean(GATES?.canOpenWeek?.(n))}
  function weekStatus(n){
    if(GATES?.weekMastery?.(n)?.mastered)return "mastered";
    return canOpenWeek(n)?"current":"locked";
  }
  function certificationReady(){return Boolean(GATES?.certificationReady?.())}
  function nextWeek(){return Number(GATES?.nextWeek?.()||1)}
  function masteryHref(n){return `mastery/index.html?unit=${Number(n)}`}
  function milestoneHref(kind){return `mastery/index.html?milestone=${encodeURIComponent(kind)}`}

  function previewHtml(unit){
    const lessons=Array.isArray(unit.lessons)?unit.lessons:[];
    return `<details class="week-preview">
      <summary>👀 Preview this week’s 5 lessons</summary>
      <div class="week-preview-list">
        ${lessons.slice(0,5).map((lesson,index)=>`
          <div class="preview-day">
            <strong>${esc(lesson.day||["Monday","Tuesday","Wednesday","Thursday","Friday"][index])} · ${esc(lesson.title||`Lesson ${index+1}`)}</strong>
            <span>${esc(lesson.workshop||lesson.objective||"Integrated Kinder Garden learning block.")}</span>
          </div>`).join("")}
      </div>
    </details>`;
  }

  function injectStyles(){
    if(document.getElementById("kinderV12Styles"))return;
    const style=document.createElement("style");
    style.id="kinderV12Styles";
    style.textContent=`
      .week-card{position:relative;overflow:hidden}
      .week-card.current{border:2px solid #9a78e0;background:linear-gradient(145deg,#fff,#faf4ff)}
      .week-card.mastered{border:2px solid #79bd76;background:linear-gradient(145deg,#fff,#f3fff2)}
      .week-card.locked{background:linear-gradient(145deg,#fff,#f2f5f2)}
      .week-state{display:inline-flex;margin:.6rem auto;padding:.34rem .55rem;border-radius:999px;font-size:.68rem;font-weight:900}
      .week-state.current{background:#eee5ff;color:#60458e}.week-state.mastered{background:#e5f7e5;color:#29643a}.week-state.locked{background:#edf0ed;color:#68756d}
      .week-preview{width:100%;margin-top:.85rem;border:1px solid rgba(70,105,77,.14);border-radius:12px;background:#fff;text-align:left}
      .week-preview summary{cursor:pointer;padding:.7rem .8rem;color:#604b7e;font-size:.76rem;font-weight:900;text-align:center}
      .week-preview-list{display:grid;gap:.35rem;padding:.2rem .7rem .75rem}
      .preview-day{padding:.55rem .6rem;border-radius:9px;background:#f8fbf7}
      .preview-day strong{display:block;color:#385443;font-size:.72rem}.preview-day span{display:block;margin-top:.15rem;color:#68766d;font-size:.66rem;line-height:1.4}
      .access-note{width:min(840px,100%);margin:0 auto 1rem;padding:.85rem;border-radius:14px;background:#fff6cf;color:#675729;font-size:.78rem}
      .locked-button{opacity:.74}
      .evidence-score{margin:.7rem 0 0;color:#3c6f4a;font-size:.74rem;font-weight:900}
      .milestone-strip{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:14px}
      .milestone-chip{padding:7px 10px;border:1px solid rgba(45,93,61,.16);border-radius:999px;background:#fff;color:#496052;font-size:.72rem;font-weight:800}
    `;
    document.head.appendChild(style);
  }

  function renderLearnerLink(){
    const target=$("learnerLink");if(!target)return;
    const learner=learnerSummary();
    if(!learner.hasLinkedLearner){
      target.innerHTML=`<div class="profile-box"><h3>🌱 Curriculum preview is open</h3><p>Games and the 36-week preview are public. A free Khaemenes Family learner account is required to begin the formal curriculum and activate the personalized Mentor.</p><div class="actions"><a class="button gold" href="${familyUrl()}">Open Family / Learner Profile</a><a class="button light" href="../index.html#apps">Play Open Learning Games</a></div></div>`;
      return;
    }
    if(!learner.hasProfile){
      target.innerHTML=`<div class="profile-box"><h3>🌱 ${esc(learner.nickname||"This learner")} is linked at another school stage</h3><p>Open the Family Profile to move the learner into the Kindergarten stage before formal Kinder Garden curriculum begins.</p><div class="actions"><a class="button gold" href="${familyUrl()}">Open Family Profile</a></div></div>`;
      return;
    }
    const mentor=learner.mentor||{};
    target.innerHTML=`<div class="profile-box linked-learner">
      <div class="linked-mentor-avatar" style="--mentor-a:${esc(mentor.colors?.[0]||"#f6bf3a")};--mentor-b:${esc(mentor.colors?.[1]||"#ef6a66")}">${esc(mentor.avatar||"🌱")}</div>
      <div>
        <h3>${esc(learner.nickname||"Kinder Garden learner")} · A Kinder Place to Learn</h3>
        <p><strong>${esc(mentor.name||"Mentor")}</strong> is linked to the same learner identity. ${learner.guardianAuthorized?"Formal curriculum access is active.":"A grown-up still needs to complete learner authorization."}</p>
        <div class="actions"><a class="button" href="../index.html#mentor">Open My Mentor</a><a class="button light" href="${familyUrl()}">Parent / Family Profile</a></div>
      </div>
    </div>`;
  }

  function renderDashboard(){
    const done=completedUnits(),avg=weeklyAverage(),ready=certificationReady(),learner=learnerSummary();
    const mid=GATES?.milestoneMastery?.("midterm")||{bestPercent:0,mastered:false};
    const fin=GATES?.milestoneMastery?.("final")||{bestPercent:0,mastered:false};
    const record=GATES?.learnerRecord?.()||{portfolio:false};
    const summary=$("summary");if(!summary)return;
    let nextAction="";
    if(formalAccess()){
      if(done>=18&&!mid.mastered)nextAction=`<a class="button gold" href="${milestoneHref("midterm")}">Open Midyear Demonstration</a>`;
      else if(done===36&&!fin.mastered)nextAction=`<a class="button gold" href="${milestoneHref("final")}">Open Final Demonstration</a>`;
      else nextAction=`<a class="button gold" href="#units">Continue Curriculum</a>`;
    }else nextAction=`<a class="button gold" href="${familyUrl()}">Open Family Profile</a>`;
    summary.innerHTML=`
      <div class="grid cols-4">
        <article class="card stat"><strong>${done}/36</strong><span>Weeks mastered at 80%+</span></article>
        <article class="card stat"><strong>${avg}%</strong><span>Observed mastery average</span></article>
        <article class="card stat"><strong>${mid.bestPercent}%</strong><span>Midyear demonstration</span></article>
        <article class="card stat"><strong>${fin.bestPercent}%</strong><span>Final demonstration</span></article>
      </div>
      <div class="profile-box" style="margin-top:16px">
        <h3>${ready?"Certificate Ready":"Learning Garden in Progress"}</h3>
        <p>${formalAccess()?`Next formal week: ${String(nextWeek()).padStart(2,"0")}. Formal openings are created only by observed mastery receipts; old typed percentages do not unlock curriculum.`:"Preview mode is open. Formal progress starts after a Kindergarten learner is active and authorized in the Family Profile."}</p>
        <div class="milestone-strip"><span class="milestone-chip">Midyear: ${mid.mastered?"✓ Mastered":"Locked / pending"}</span><span class="milestone-chip">Final: ${fin.mastered?"✓ Mastered":"Locked / pending"}</span><span class="milestone-chip">Portfolio: ${record.portfolio?"✓ Complete":"Pending"}</span></div>
        <div class="actions">${nextAction}<a class="button light" href="../index.html#apps">Open Free Games</a></div>
      </div>`;
    renderLearnerLink();
    renderAdultRecord();
  }

  function renderUnits(){
    const grid=$("unitGrid");if(!grid)return;
    const access=formalAccess();
    grid.innerHTML=DATA.units.map(unit=>{
      const n=Number(unit.unit),status=weekStatus(n),mastery=GATES?.weekMastery?.(n)||{bestPercent:0,mastered:false};
      const label=status==="mastered"?"✓ Mastered — review anytime":status==="current"?"🌱 Current formal week":"🔒 Formal week locked";
      const formalButton=status==="locked"
        ?`<button class="button locked-button" type="button" data-locked-week="${n}">${access?"Complete prior mastery first":"Family learner required"}</button>`
        :`<a class="button" href="lessons/unit-${String(n).padStart(2,"0")}/index.html">${status==="mastered"?"Review Unit":"Open Formal Unit"}</a>`;
      const masteryButton=status==="locked"?"":`<a class="button light" href="${masteryHref(n)}">${status==="mastered"?"Review Mastery Evidence":"Record Mastery Evidence"}</a>`;
      return `<article class="card week-card ${status}" data-week-card="${n}">
        <div class="emblem">${String(n).padStart(2,"0")}</div>
        <h3>${esc(unit.title)}</h3>
        <p><strong>Question:</strong> ${esc(unit.essentialQuestion)}</p>
        <p>${esc(unit.theme||"")}</p>
        <span class="week-state ${status}">${label}</span>
        <div class="evidence-score">Best observed mastery: ${mastery.bestPercent}%</div>
        ${previewHtml(unit)}
        <div class="actions">${formalButton}${masteryButton}${access&&status!=="locked"?`<a class="button light" href="printables/unit-${String(n).padStart(2,"0")}-packet.html">Printable</a>`:""}</div>
      </article>`;
    }).join("");

    document.querySelectorAll("[data-locked-week]").forEach(button=>button.addEventListener("click",()=>{
      alert(formalAccess()?"This formal week opens only after all prior mastery evidence is recorded at 80% or higher.":"The week preview is visible now. A free Khaemenes Family learner account is required to enter formal curriculum lessons.");
    }));
  }

  function renderStandards(){
    const target=$("standardsGrid");if(!target)return;
    target.innerHTML=DATA.standardsFamilies.map(item=>`<article class="card"><div class="emblem">${esc(item.code.replace("KHAE-",""))}</div><h3>${esc(item.label)}</h3><p>${esc(item.description)}</p></article>`).join("");
  }

  function renderAdultRecord(){
    const learner=learnerSummary();
    const student=$("studentName"),mid=$("midtermStatus"),fin=$("finalStatus"),portfolio=$("portfolio"),saveBtn=$("saveProfile"),clearBtn=$("clearRecords");
    if(student){student.value=learner.nickname||"Kindergarten Scholar";student.readOnly=true}
    const m=GATES?.milestoneMastery?.("midterm")||{bestPercent:0,mastered:false},f=GATES?.milestoneMastery?.("final")||{bestPercent:0,mastered:false};
    if(mid)mid.textContent=`${m.bestPercent}% ${m.mastered?"· mastered":"· pending"}`;
    if(fin)fin.textContent=`${f.bestPercent}% ${f.mastered?"· mastered":"· pending"}`;
    if(portfolio)portfolio.checked=Boolean(GATES?.learnerRecord?.()?.portfolio);
    if(saveBtn)saveBtn.disabled=!formalAccess();
    if(clearBtn)clearBtn.disabled=!formalAccess();
  }

  function bindAdultRecord(){
    const saveBtn=$("saveProfile"),clearBtn=$("clearRecords");
    saveBtn?.addEventListener("click",()=>{
      if(!formalAccess()){location.href=familyUrl();return}
      if(!$("portfolioAffirm")?.checked){alert("Please confirm that the portfolio status was reviewed by the authorized adult.");return}
      try{GATES?.setPortfolioComplete?.(Boolean($("portfolio")?.checked),{adultAffirmed:true});renderDashboard()}catch(error){alert(error.message||error)}
    });
    clearBtn?.addEventListener("click",()=>{
      if(!formalAccess())return;
      const learner=learnerSummary();
      if(!confirm(`Reset ${learner.nickname||"this learner"}'s local Kindergarten formal mastery record on this device? This is a deliberate academic reset and cannot be undone.`))return;
      try{GATES?.clearActiveMasteryRecord?.({adultAffirmed:true});CONTINUITY?.clearActiveCurriculumRecord?.();renderDashboard();renderUnits()}catch(error){alert(error.message||error)}
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{
    injectStyles();
    $("year") && ($("year").textContent=new Date().getFullYear());
    renderDashboard();renderUnits();renderStandards();bindAdultRecord();
    CONTINUITY?.subscribe?.(()=>{renderDashboard();renderUnits()});
    window.addEventListener("khaemenes-kindergarten-mastery-changed",()=>{renderDashboard();renderUnits()});
  });
})();
