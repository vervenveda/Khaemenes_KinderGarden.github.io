(() => {
  "use strict";

  const DATA=window.KHAE_KINDERGARTEN_DATA;
  const LEGACY_KEY="khaemenes_kindergarten_36_aplus_v1";
  const CONTINUITY=window.KhaemenesKinderContinuity||null;
  const PASS=Number(DATA?.course?.passingScore||80);
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function fallbackState(){return {student:"Kindergarten Scholar",weekly:{},midterm:0,final:0,portfolio:false}}
  function readLegacy(){try{return JSON.parse(localStorage.getItem(LEGACY_KEY))||fallbackState()}catch{return fallbackState()}}
  function readState(){return CONTINUITY?CONTINUITY.loadCurriculumState(fallbackState()):readLegacy()}
  let state=readState();

  function learnerSummary(){
    return CONTINUITY?.getLearnerSummary?.()||{hasProfile:false,hasLinkedLearner:false,stageEligible:false,nickname:null,mentor:null,guardianAuthorized:false};
  }
  function formalAccess(){
    const learner=learnerSummary();
    return Boolean(learner.hasProfile&&learner.stageEligible!==false&&learner.guardianAuthorized);
  }
  function familyUrl(){return "https://vervenveda.com/Khaemenes_Academy.github.io/family/"}
  function save(){
    if(!formalAccess())return;
    state=CONTINUITY?CONTINUITY.saveCurriculumState(state):(localStorage.setItem(LEGACY_KEY,JSON.stringify(state)),state);
  }
  function completedUnits(){return DATA.units.filter(unit=>Number(state.weekly?.[unit.unit]||0)>=PASS).length}
  function weeklyAverage(){
    const values=DATA.units.map(unit=>Number(state.weekly?.[unit.unit]||0)).filter(v=>Number.isFinite(v)&&v>0);
    return values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0;
  }
  function allPriorMastered(n){
    for(let i=1;i<n;i++)if(Number(state.weekly?.[i]||0)<PASS)return false;
    return true;
  }
  function canOpenWeek(n){
    if(!formalAccess())return false;
    if(!allPriorMastered(n))return false;
    if(n>=19&&Number(state.midterm||0)<PASS)return false;
    return true;
  }
  function weekStatus(n){
    if(Number(state.weekly?.[n]||0)>=PASS)return "mastered";
    return canOpenWeek(n)?"current":"locked";
  }
  function certificationReady(){
    return completedUnits()===36&&Number(state.midterm||0)>=PASS&&Number(state.final||0)>=PASS&&!!state.portfolio;
  }
  function nextWeek(){
    for(let n=1;n<=36;n++)if(Number(state.weekly?.[n]||0)<PASS)return n;
    return 36;
  }
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
    if(document.getElementById("kinderV11Styles"))return;
    const style=document.createElement("style");
    style.id="kinderV11Styles";
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
    if(learner.hasProfile&&learner.nickname)state.student=learner.nickname;
    const summary=$("summary");if(!summary)return;
    summary.innerHTML=`
      <div class="grid cols-4">
        <article class="card stat"><strong>${done}/36</strong><span>Weeks at 80%+</span></article>
        <article class="card stat"><strong>${avg}%</strong><span>Weekly average</span></article>
        <article class="card stat"><strong>${Number(state.midterm||0)}%</strong><span>Midyear</span></article>
        <article class="card stat"><strong>${Number(state.final||0)}%</strong><span>Final</span></article>
      </div>
      <div class="profile-box" style="margin-top:16px">
        <h3>${ready?"Certificate Ready":"Learning Garden in Progress"}</h3>
        <p>${formalAccess()?`Next formal week: ${String(nextWeek()).padStart(2,"0")}. Future weeks stay visible as previews while formal openings follow mastery.`:"Preview mode is open. Formal progress starts after a Kindergarten learner is active in the Family Profile."}</p>
        <div class="actions"><a class="button gold" href="${formalAccess()?"#units":familyUrl()}">${formalAccess()?"Continue Curriculum":"Open Family Profile"}</a><a class="button light" href="../index.html#apps">Open Free Games</a></div>
      </div>`;
    renderLearnerLink();
  }

  function renderUnits(){
    const grid=$("unitGrid");if(!grid)return;
    const access=formalAccess();
    grid.innerHTML=DATA.units.map(unit=>{
      const n=Number(unit.unit),status=weekStatus(n),score=Number(state.weekly?.[n]||0);
      const label=status==="mastered"?"✓ Mastered — review anytime":status==="current"?"🌱 Current week":"🔒 Formal week locked";
      const formalButton=status==="locked"
        ?`<button class="button locked-button" type="button" data-locked-week="${n}">${access?"Complete prior mastery first":"Family learner required"}</button>`
        :`<a class="button" href="lessons/unit-${String(n).padStart(2,"0")}/index.html">${status==="mastered"?"Review Unit":"Open Formal Unit"}</a>`;
      return `<article class="card week-card ${status}" data-week-card="${n}">
        <div class="emblem">${String(n).padStart(2,"0")}</div>
        <h3>${esc(unit.title)}</h3>
        <p><strong>Question:</strong> ${esc(unit.essentialQuestion)}</p>
        <p>${esc(unit.theme||"")}</p>
        <span class="week-state ${status}">${label}</span>
        ${previewHtml(unit)}
        ${access?`<label style="margin-top:.8rem">Adult weekly mastery record</label><input type="number" min="0" max="100" value="${score||""}" data-score="${n}" placeholder="0–100">`:""}
        <div class="actions">${formalButton}${access?`<a class="button light" href="printables/unit-${String(n).padStart(2,"0")}-packet.html">Printable</a>`:""}</div>
      </article>`;
    }).join("");

    document.querySelectorAll("[data-score]").forEach(input=>{
      input.addEventListener("input",()=>{
        if(!formalAccess())return;
        state.weekly[input.dataset.score]=Math.max(0,Math.min(100,Number(input.value||0)));
        save();renderDashboard();renderUnits();
      });
    });
    document.querySelectorAll("[data-locked-week]").forEach(button=>button.addEventListener("click",()=>{
      alert(formalAccess()?"This formal week opens after all prior weekly mastery requirements are met.":"The week preview is visible now. A free Khaemenes Family learner account is required to enter formal curriculum lessons.");
    }));
  }

  function renderStandards(){
    const target=$("standardsGrid");if(!target)return;
    target.innerHTML=DATA.standardsFamilies.map(item=>`<article class="card"><div class="emblem">${esc(item.code.replace("KHAE-",""))}</div><h3>${esc(item.label)}</h3><p>${esc(item.description)}</p></article>`).join("");
  }

  function bindAdultRecord(){
    const saveBtn=$("saveProfile"),clearBtn=$("clearRecords");
    const learner=learnerSummary();
    if(saveBtn)saveBtn.disabled=!formalAccess();
    if(clearBtn)clearBtn.disabled=!formalAccess();

    saveBtn?.addEventListener("click",()=>{
      if(!formalAccess()){location.href=familyUrl();return}
      state.student=learner.nickname||$("studentName")?.value?.trim()||"Kindergarten Scholar";
      state.midterm=Math.max(0,Math.min(100,Number($("midtermScore")?.value||0)));
      state.final=Math.max(0,Math.min(100,Number($("finalScore")?.value||0)));
      state.portfolio=Boolean($("portfolio")?.checked);
      save();renderDashboard();renderUnits();
    });

    clearBtn?.addEventListener("click",()=>{
      if(!formalAccess())return;
      if(!confirm(`Clear only ${learner.nickname||"this learner"}'s local Kindergarten curriculum record on this device? The Family Profile and Mentor remain.`))return;
      CONTINUITY?.clearActiveCurriculumRecord?.();
      state=readState();renderDashboard();renderUnits();
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{
    injectStyles();
    $("year") && ($("year").textContent=new Date().getFullYear());
    state=readState();
    renderDashboard();renderUnits();renderStandards();bindAdultRecord();
    if(CONTINUITY?.subscribe)CONTINUITY.subscribe(()=>{state=readState();renderDashboard();renderUnits()});
  });
})();
