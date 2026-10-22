/*
 * Khaemenes Kinder Garden · Mentor & Family Experience v1.0.0
 * -----------------------------------------------------------------
 * Adds a shared child/parent experience layer without changing:
 *   - Family Registry identity authority
 *   - Archaemenes Mentor authority
 *   - NAIB routing authority
 *   - formal 80% mastery gates
 *
 * Parent observations are complementary notes, never grades, diagnoses,
 * readiness labels, or progression evidence.
 */
(function attachKhaemenesKinderExperience(global){
  "use strict";

  const VERSION="1.0.0";
  const KEYS=Object.freeze({
    context:"khaemenes_kindergarten_mentor_context_v1",
    observations:"khaemenes_kindergarten_observations_v1",
    activity:"khaemenes_kindergarten_learning_log_v1"
  });
  const MENTOR_URL="/stos/mentor/";
  const FAMILY_URL="/stos/khaemenes/family/";
  const AURORA_URL="/stos/aurora/";
  const $=selector=>global.document?.querySelector?.(selector)||null;

  const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));

  function readJSON(key,fallback=null){
    try{
      const raw=global.localStorage?.getItem(key);
      return raw?JSON.parse(raw):fallback;
    }catch{return fallback}
  }

  function writeJSON(key,value){
    try{
      if(!global.localStorage||typeof global.localStorage.setItem!=="function")return false;
      global.localStorage.setItem(key,JSON.stringify(value));
      return true;
    }catch{return false}
  }

  function learner(){
    return global.KhaemenesKinderContinuity?.getLearnerSummary?.()||
      global.KhaemenesFamilyRegistry?.getLearner?.()||
      null;
  }

  function learnerId(){
    return learner()?.learnerId||null;
  }

  function formalAccess(){
    const value=learner();
    return Boolean(value?.learnerId&&value?.hasProfile!==false&&value?.stageEligible!==false&&value?.guardianAuthorized);
  }

  function summary(){
    return global.KhaemenesKinderContinuity?.curriculumSummary?.(80,36)||{
      completedUnits:0,weeklyAverage:0,midterm:0,final:0,portfolio:false,certificationReady:false
    };
  }

  function fallbackPosition(){
    const gates=global.KhaemenesKinderMasteryGates;
    const completed=Number(gates?.completedWeeks?.())||0;

    if(gates&&completed>=36){
      const final=gates.milestoneMastery?.("final");
      if(!final?.mastered){
        return {type:"final",week:36,lesson:null,title:"Final Readiness Demonstration",url:"curriculum/mastery/?milestone=final"};
      }
      if(!gates.learnerRecord?.().portfolio){
        return {type:"portfolio",week:36,lesson:null,title:"Portfolio Review",url:"curriculum/records/"};
      }
      return {type:"complete",week:36,lesson:null,title:"Kindergarten Complete",url:"curriculum/records/certificate.html"};
    }

    if(gates&&completed>=18&&!gates.milestoneMastery?.("midterm")?.mastered){
      return {type:"midterm",week:18,lesson:null,title:"Midyear Demonstration",url:"curriculum/mastery/?milestone=midterm"};
    }

    const week=Math.max(1,Math.min(36,Number(gates?.nextWeek?.())||Number(global.KhaemenesKinderContinuity?.nextUnit?.(36,80))||1));

    if(gates?.sequenceRequired?.(week)){
      for(let day=1;day<=5;day++){
        if(!gates.dayEvidence?.(week,day)?.completed){
          return {
            type:"lesson",
            week,
            lesson:day,
            title:"Kindergarten Week "+String(week).padStart(2,"0")+" · Day "+day,
            url:"curriculum/lessons/unit-"+String(week).padStart(2,"0")+"/"
          };
        }
      }
      if(!gates.weekMastery?.(week)?.mastered){
        return {
          type:"quiz",
          week,
          lesson:null,
          title:"Weekly Mastery Check",
          url:"curriculum/mastery/?unit="+week
        };
      }
    }

    return {
      type:"lesson",
      week,
      lesson:1,
      title:"Kindergarten Week "+String(week).padStart(2,"0"),
      url:"curriculum/lessons/unit-"+String(week).padStart(2,"0")+"/"
    };
  }

  function position(){
    try{
      return global.KhaemenesKinderProgression?.position?.()||fallbackPosition();
    }catch{
      return fallbackPosition();
    }
  }

  function positionLabel(pos=position()){
    if(pos?.type==="lesson")return "Week "+String(pos.week||1).padStart(2,"0")+" · Lesson "+String(pos.lesson||1);
    if(pos?.type==="quiz")return "Week "+String(pos.week||1).padStart(2,"0")+" · Weekly Mastery Check";
    if(pos?.type==="midterm")return "Midyear Demonstration";
    if(pos?.type==="final")return "Final Readiness Demonstration";
    if(pos?.type==="portfolio")return "Portfolio Review";
    if(pos?.type==="complete")return "Kindergarten Complete";
    return pos?.title||"Kindergarten learning";
  }

  function lessonMatch(pos=position()){
    const companions=global.KhaemenesKinderCompanions;
    if(!companions)return {kinder:[],creche:[],context:null,reason:"Practice matching is loading."};
    const week=Math.max(1,Math.min(36,Number(pos?.week)||Number(global.KhaemenesKinderContinuity?.nextUnit?.(36,80))||1));
    const lesson=Math.max(1,Math.min(5,Number(pos?.lesson)||1));
    const interests=learner()?.interests||[];
    if(pos?.type==="lesson"&&companions.forLesson){
      return companions.forLesson(week,lesson,global.KhaemenesPreschoolCatalog,{
        courseData:global.KHAE_KINDERGARTEN_DATA,
        interests
      })||{kinder:[],creche:[],context:null};
    }
    return companions.forUnit?.(week,global.KhaemenesPreschoolCatalog,{
      courseData:global.KHAE_KINDERGARTEN_DATA,
      interests
    })||{kinder:[],creche:[],context:null};
  }

  function weekTitle(week){
    const unit=global.KHAE_KINDERGARTEN_DATA?.units?.find?.(item=>Number(item.unit||item.week)===Number(week));
    return unit?.title||("Week "+String(week||1).padStart(2,"0"));
  }

  function observationGuide(pos=position(),match=lessonMatch(pos)){
    const context=match?.context||global.KhaemenesKinderCompanions?.contextForLesson?.(
      Math.max(1,Number(pos?.week)||1),
      Math.max(1,Number(pos?.lesson)||1),
      global.KHAE_KINDERGARTEN_DATA
    );
    const text=[
      context?.unit?.title,context?.unit?.theme,context?.unit?.literacyFocus,
      context?.unit?.mathFocus,context?.unit?.inquiryFocus,context?.unit?.selFocus,
      context?.unit?.makerProject,context?.lessonTitle,context?.lessonData?.objective
    ].filter(Boolean).join(" ").toLowerCase();

    if(/letter|sound|rhyme|word|story|read|write|language|phon/.test(text)){
      return {
        domain:"Literacy & language",
        prompt:"Can the learner explain a sound, letter, word, story detail, or idea in their own way?",
        next:"Invite the learner to show or tell one example without rushing."
      };
    }
    if(/number|count|shape|pattern|measure|math|compare|add|subtract|money/.test(text)){
      return {
        domain:"Mathematics & reasoning",
        prompt:"Can the learner show how they counted, compared, matched, patterned, measured, or reasoned?",
        next:"Ask the learner to show the idea with objects, a drawing, or a simple explanation."
      };
    }
    if(/weather|plant|animal|water|light|shadow|science|observe|living|space|moon|inquiry/.test(text)){
      return {
        domain:"Inquiry & science",
        prompt:"Can the learner make an observation, prediction, comparison, or evidence-based explanation?",
        next:"Ask what they noticed first, then what makes them think that."
      };
    }
    if(/feeling|friend|kind|family|community|tradition|civic|helper|belong|goal|gratitude/.test(text)){
      return {
        domain:"Community & self",
        prompt:"Can the learner explain a feeling, choice, relationship, community idea, or kind response?",
        next:"Invite one real-life example from home, school, or the community."
      };
    }
    if(/art|music|maker|build|movement|body|health|design|create|rhythm/.test(text)){
      return {
        domain:"Creative & physical learning",
        prompt:"Can the learner demonstrate or describe a creative, building, movement, or healthy-choice decision?",
        next:"Ask what they chose, what changed, and what they might try next."
      };
    }
    return {
      domain:"Integrated Kindergarten learning",
      prompt:"Can the learner explain one thing they noticed, tried, changed, or understood today?",
      next:"Celebrate the explanation, then ask one gentle follow-up question."
    };
  }

  function allObservationRecords(){
    const value=readJSON(KEYS.observations,{});
    return value&&typeof value==="object"&&!Array.isArray(value)?value:{};
  }

  function observations(id=learnerId()){
    const records=allObservationRecords();
    return id&&Array.isArray(records[id])?records[id]:[];
  }

  function saveObservation(level){
    const id=learnerId();
    if(!id)return false;
    const allowed=new Set(["support","growing","explaining"]);
    if(!allowed.has(level))return false;
    const pos=position();
    const match=lessonMatch(pos);
    const guide=observationGuide(pos,match);
    const records=allObservationRecords();
    const list=Array.isArray(records[id])?records[id]:[];
    list.push({
      level,
      at:new Date().toISOString(),
      position:{type:pos?.type||"lesson",week:Number(pos?.week)||1,lesson:Number(pos?.lesson)||null,title:pos?.title||null},
      domain:guide.domain
    });
    records[id]=list.slice(-120);
    if(!writeJSON(KEYS.observations,records))return false;
    syncContext();
    renderFamilySnapshot();
    return true;
  }

  function allActivityRecords(){
    const value=readJSON(KEYS.activity,{});
    return value&&typeof value==="object"&&!Array.isArray(value)?value:{};
  }

  function logActivity(kind,title,href){
    const id=learnerId();
    if(!id)return;
    const records=allActivityRecords();
    const list=Array.isArray(records[id])?records[id]:[];
    list.push({
      kind:String(kind||"learning").slice(0,40),
      title:String(title||"Learning activity").slice(0,120),
      href:String(href||"").slice(0,260),
      at:new Date().toISOString()
    });
    records[id]=list.slice(-200);
    writeJSON(KEYS.activity,records);
    syncContext();
  }

  function recentActivity(id=learnerId(),days=7){
    const cutoff=Date.now()-Math.max(1,days)*86400000;
    const records=allActivityRecords();
    return (id&&Array.isArray(records[id])?records[id]:[]).filter(item=>Date.parse(item?.at||"")>=cutoff);
  }

  function latestObservation(days=7){
    const cutoff=Date.now()-Math.max(1,days)*86400000;
    return observations().filter(item=>Date.parse(item?.at||"")>=cutoff).slice(-1)[0]||null;
  }

  function sanitizedResource(resource){
    if(!resource)return null;
    return {
      id:resource.id||null,
      title:String(resource.title||"Learning Tool").slice(0,120),
      icon:String(resource.icon||"🌱").slice(0,12),
      path:String(resource.path||resource.url||"").slice(0,260),
      group:resource.group||null,
      domains:Array.isArray(resource.domains)?resource.domains.slice(0,8):[],
      skills:Array.isArray(resource.skills)?resource.skills.slice(0,12):[]
    };
  }

  function contextRecord(){
    const value=learner();
    if(!value?.learnerId)return null;
    const pos=position(),match=lessonMatch(pos),guide=observationGuide(pos,match),progress=summary();
    return {
      version:1,
      source:"Khaemenes Kinder Garden",
      stage:"kindergarten",
      learnerId:value.learnerId,
      nickname:value.nickname||null,
      mentorId:"archaemenes",
      mentorExpression:"Wise Owl",
      communicationStyle:value.mentor?.communicationStyle||value.mentorIdentity?.communicationStyle||null,
      guardianAuthorized:Boolean(value.guardianAuthorized),
      academicPosition:{
        type:pos?.type||"lesson",
        label:positionLabel(pos),
        week:Number(pos?.week)||Number(global.KhaemenesKinderContinuity?.nextUnit?.(36,80))||1,
        lesson:Number(pos?.lesson)||null,
        title:pos?.title||null,
        href:pos?.url||null,
        bestScore:Number.isFinite(Number(pos?.bestScore))?Number(pos.bestScore):null
      },
      curriculum:{
        completedUnits:Number(progress.completedUnits)||0,
        weeklyAverage:Number(progress.weeklyAverage)||0,
        midterm:Number(progress.midterm)||0,
        final:Number(progress.final)||0,
        portfolio:Boolean(progress.portfolio),
        masteryThreshold:80
      },
      currentFocus:{
        domain:guide.domain,
        observationPrompt:guide.prompt,
        gentleNextStep:guide.next,
        reason:match?.reason||"Matched to the current Kindergarten learning step."
      },
      suggestedPractice:(match?.kinder||[]).slice(0,3).map(sanitizedResource).filter(Boolean),
      suggestedFoundation:(match?.creche||[]).slice(0,2).map(sanitizedResource).filter(Boolean),
      recentActivity:recentActivity(value.learnerId,7).slice(-12),
      recentObservations:observations(value.learnerId).slice(-12),
      updatedAt:new Date().toISOString()
    };
  }

  function syncContext(){
    const record=contextRecord();
    if(record)writeJSON(KEYS.context,record);
    return record;
  }

  function currentStations(){
    const pos=position(),match=lessonMatch(pos);
    const formal={
      kind:"formal",
      icon:"📘",
      label:"Learn",
      title:positionLabel(pos),
      desc:pos?.title||weekTitle(pos?.week),
      href:pos?.url||"curriculum/"
    };
    const practice=(match?.kinder||[])[0];
    const explore=(match?.kinder||[])[1]||(match?.creche||[])[0];
    const practiceCard=practice?{
      kind:"practice",icon:practice.icon||"🌱",label:"Practice",title:practice.title,
      desc:practice.desc||match?.reason||"Matched practice for the current lesson.",
      href:practice.path||practice.url||"#"
    }:null;
    const exploreCard=explore?{
      kind:"explore",icon:explore.icon||"🔎",label:"Explore",title:explore.title,
      desc:explore.desc||"Optional exploration connected to the current learning focus.",
      href:explore.path||explore.url||"#"
    }:null;
    const reset={
      kind:"reset",icon:"☼",label:"Reset",title:"Aurora · Gentle Break",
      desc:"Pause, breathe, move, or reset before returning to the formal path.",
      href:AURORA_URL
    };
    return [formal,practiceCard,exploreCard,reset].filter(Boolean);
  }

  function addStyle(){
    if($("#khaemenesKinderExperienceStyle"))return;
    const style=global.document.createElement("style");
    style.id="khaemenesKinderExperienceStyle";
    style.textContent=
      ".kinder-experience{margin:2rem 0 0;padding:1.45rem;border:1px solid rgba(48,80,69,.16);border-radius:21px;background:linear-gradient(145deg,#fffef8,#f1f9ef);box-shadow:0 12px 30px rgba(54,95,72,.10);text-align:left}"+
      ".kinder-experience-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap}"+
      ".kinder-experience-title{display:flex;align-items:center;gap:.8rem}.kinder-experience-owl{width:58px;height:58px;display:grid;place-items:center;border-radius:18px;background:linear-gradient(145deg,#fff0ad,#dff4d7);font-size:1.8rem}"+
      ".kinder-experience h3{margin:0;color:#315e40;font-family:Georgia,'Times New Roman',serif;font-size:1.6rem}.kinder-experience p{margin:.35rem 0 0;color:#65726b;font-size:.84rem}"+
      ".kinder-stations{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.7rem;margin-top:1rem}.kinder-station{min-height:150px;display:flex;flex-direction:column;padding:.9rem;border:1px solid rgba(48,80,69,.14);border-radius:15px;color:#33483d;background:#fff;text-decoration:none}.kinder-station:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(54,95,72,.09)}"+
      ".kinder-station i{font-style:normal;font-size:1.55rem}.kinder-station b{margin-top:.45rem;color:#2d5a3d}.kinder-station span{font-size:.65rem;color:#80629a;text-transform:uppercase;letter-spacing:.08em;font-weight:800}.kinder-station small{margin-top:.4rem;color:#6c776f;line-height:1.4}.kinder-station em{margin-top:auto;padding-top:.65rem;color:#466b51;font-size:.68rem;font-style:normal;font-weight:800}"+
      ".kinder-experience-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}.kinder-experience-actions a,.kinder-experience-actions button{min-height:42px;display:inline-flex;align-items:center;justify-content:center;padding:.6rem .78rem;border:1px solid rgba(48,80,69,.16);border-radius:9px;color:#315e40;background:#fff;text-decoration:none;font-weight:800;font-size:.75rem}.kinder-experience-actions .primary{color:#fff;background:#315e40;border-color:#315e40}"+
      ".kinder-snapshot{margin-top:1.2rem;padding:1.2rem;border:1px solid rgba(35,79,54,.14);border-radius:14px;background:#fff}.kinder-snapshot-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.65rem;margin-top:1rem}.kinder-snapshot-metric{padding:.8rem;border:1px solid rgba(35,79,54,.1);border-radius:11px;background:#f5f8f4}.kinder-snapshot-metric strong{display:block;color:#234f36;font-size:.92rem}.kinder-snapshot-metric span{display:block;margin-top:.25rem;color:#6c776f;font-size:.68rem}"+
      ".kinder-observation{margin-top:1rem;padding:1rem;border:1px solid rgba(123,101,144,.16);border-radius:12px;background:#faf7fd}.kinder-observation strong{display:block;color:#5e4c70}.kinder-observation p{margin:.35rem 0 .75rem;color:#6c6571}.kinder-observation-buttons{display:flex;flex-wrap:wrap;gap:.45rem}.kinder-observation-buttons button{min-height:40px;padding:.55rem .68rem;border:1px solid rgba(123,101,144,.2);border-radius:8px;color:#5e4c70;background:#fff;font-weight:750}"+
      "@media(max-width:900px){.kinder-stations,.kinder-snapshot-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.kinder-stations,.kinder-snapshot-grid{grid-template-columns:1fr}.kinder-experience-actions{display:grid}.kinder-experience-actions>*{width:100%}}";
    global.document.head.appendChild(style);
  }

  function rootMount(){
    const mentorSection=$("#mentor .shell");
    const wrap=$("#mentor .kinder-mentor-wrap");
    if(!mentorSection||!wrap||$("#kinderTodayWithArchaemenes"))return;
    const section=global.document.createElement("section");
    section.className="kinder-experience";
    section.id="kinderTodayWithArchaemenes";
    wrap.insertAdjacentElement("beforebegin",section);
    renderRootExperience();
  }

  function renderRootExperience(){
    const section=$("#kinderTodayWithArchaemenes");
    if(!section)return;
    const value=learner();
    if(!value?.learnerId){
      section.innerHTML=
        '<div class="kinder-experience-head"><div class="kinder-experience-title"><span class="kinder-experience-owl">🦉</span><div><h3>Today with Archaemenes</h3><p>Link the Kindergarten learner through the Academy Family Profile to build a lesson-aware Wise Owl path.</p></div></div></div>'+
        '<div class="kinder-experience-actions"><a class="primary" href="'+FAMILY_URL+'">Link Family Learner →</a></div>';
      return;
    }
    const stations=currentStations();
    section.innerHTML=
      '<div class="kinder-experience-head"><div class="kinder-experience-title"><span class="kinder-experience-owl">🦉</span><div><h3>Today with Archaemenes</h3><p>'+esc(value.nickname||"Learner")+' keeps the formal lesson first. Practice, exploration, and reset choices support the lesson without becoming mastery gates.</p></div></div></div>'+
      '<div class="kinder-stations">'+stations.map((item,index)=>
        '<a class="kinder-station" href="'+esc(item.href||"#")+'" data-kinder-experience-kind="'+esc(item.kind)+'" data-kinder-experience-title="'+esc(item.title)+'">'+
          '<span>'+esc(item.label)+'</span><i>'+esc(item.icon)+'</i><b>'+esc(item.title)+'</b><small>'+esc(item.desc||"")+'</small><em>'+(index===0?"Formal step":"Optional support")+' →</em></a>'
      ).join("")+'</div>'+
      '<div class="kinder-experience-actions">'+
        '<a class="primary" href="'+MENTOR_URL+'" data-kinder-experience-mentor>Open Archaemenes · Wise Owl →</a>'+
        '<a href="family/">Parent Weekly Snapshot</a>'+
        '<a href="'+AURORA_URL+'" data-kinder-break>I Need a Break</a>'+
      '</div>';
    section.querySelectorAll("[data-kinder-experience-kind]").forEach(link=>{
      link.addEventListener("click",()=>logActivity(link.dataset.kinderExperienceKind,link.dataset.kinderExperienceTitle,link.getAttribute("href")));
    });
    section.querySelector("[data-kinder-experience-mentor]")?.addEventListener("click",()=>syncContext());
    syncContext();
  }

  function familyMount(){
    const continueSection=$("#continue");
    if(!continueSection||$("#kinderFamilySnapshot"))return;
    const section=global.document.createElement("section");
    section.className="section";
    section.id="kinderFamilySnapshot";
    section.innerHTML=
      '<div class="shell"><div class="heading"><p class="kicker">Family Learning Snapshot</p><h2>This week with the learner.</h2><p>Formal mastery remains in the course engine. This snapshot adds family context and optional observations without changing a score or unlocking curriculum.</p></div><div class="kinder-experience"><div id="kinderFamilySnapshotBody"></div></div></div>';
    continueSection.insertAdjacentElement("afterend",section);
    renderFamilySnapshot();
  }

  function renderFamilySnapshot(){
    const target=$("#kinderFamilySnapshotBody");
    if(!target)return;
    const value=learner();
    if(!value?.learnerId){
      target.innerHTML='<div class="empty">Choose or link the Kindergarten learner to view the family learning snapshot.</div>';
      return;
    }
    const progress=summary(),pos=position(),match=lessonMatch(pos),guide=observationGuide(pos,match);
    const activity=recentActivity(value.learnerId,7);
    const latest=latestObservation(7);
    const labels={support:"Exploring with support",growing:"Growing independence",explaining:"Explaining confidently"};
    const suggestion=(match?.kinder||[])[0]||(match?.creche||[])[0]||null;
    target.innerHTML=
      '<div class="kinder-experience-head"><div class="kinder-experience-title"><span class="kinder-experience-owl">🦉</span><div><h3>'+esc(value.nickname||"Learner")+' · This Week</h3><p>Archaemenes remains the Mentor; NAIB and the course engine remain the academic authorities.</p></div></div></div>'+
      '<div class="kinder-snapshot-grid">'+
        '<div class="kinder-snapshot-metric"><strong>'+esc(String(progress.completedUnits||0))+' / 36</strong><span>Weeks at formal mastery</span></div>'+
        '<div class="kinder-snapshot-metric"><strong>'+esc(String(progress.weeklyAverage||0))+'%</strong><span>Recorded weekly average</span></div>'+
        '<div class="kinder-snapshot-metric"><strong>'+esc(positionLabel(pos))+'</strong><span>Current formal place</span></div>'+
        '<div class="kinder-snapshot-metric"><strong>'+esc(String(activity.length))+' support visit'+(activity.length===1?"":"s")+'</strong><span>Today-path activity in the last 7 days</span></div>'+
      '</div>'+
      '<div class="kinder-observation"><strong>Optional grown-up observation · '+esc(guide.domain)+'</strong><p>'+esc(guide.prompt)+'</p>'+
        '<div class="kinder-observation-buttons">'+
          '<button type="button" data-kinder-observation="support">Exploring with support</button>'+
          '<button type="button" data-kinder-observation="growing">Growing independence</button>'+
          '<button type="button" data-kinder-observation="explaining">Explaining confidently</button>'+
        '</div>'+
        '<p style="margin-top:.7rem"><strong>Latest:</strong> '+esc(latest?labels[latest.level]||"Observed":"No optional observation saved this week")+'.</p>'+
        '<p><strong>Gentle next step:</strong> '+esc(suggestion?("Try "+suggestion.title+" after the formal lesson when it helps."):guide.next)+'</p>'+
      '</div>'+
      '<div class="kinder-experience-actions">'+
        '<a class="primary" href="'+MENTOR_URL+'" data-kinder-experience-mentor>Ask Archaemenes about this week →</a>'+
        '<button type="button" data-kinder-snapshot-print>Print Snapshot</button>'+
      '</div>';
    target.querySelectorAll("[data-kinder-observation]").forEach(button=>{
      button.addEventListener("click",()=>{
        if(saveObservation(button.dataset.kinderObservation)){
          button.textContent="Saved ✓";
          setTimeout(renderFamilySnapshot,500);
        }else{
          button.textContent="Not saved — retry";
          button.setAttribute("aria-label","Observation not saved. Try again.");
        }
      });
    });
    target.querySelector("[data-kinder-snapshot-print]")?.addEventListener("click",()=>global.print());
    target.querySelector("[data-kinder-experience-mentor]")?.addEventListener("click",()=>syncContext());
    syncContext();
  }

  function refresh(){
    addStyle();
    rootMount();
    familyMount();
    renderRootExperience();
    renderFamilySnapshot();
    syncContext();
  }

  global.KhaemenesKinderExperience=Object.freeze({
    version:VERSION,
    keys:KEYS,
    syncContext,
    getContext:()=>readJSON(KEYS.context,null),
    observations:()=>observations(),
    saveObservation,
    recentActivity:()=>recentActivity(),
    position,
    lessonMatch,
    observationGuide,
    refresh
  });

  const schedule=()=>setTimeout(refresh,0);
  if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",schedule,{once:true});
  else schedule();

  global.addEventListener("khaemenes-family-changed",schedule);
  global.addEventListener("khaemenes-kinder-family-ready",schedule);
  global.addEventListener("khaemenes-kindergarten-progress-changed",schedule);
  global.addEventListener("khaemenes-kindergarten-mastery-changed",schedule);
  global.addEventListener("storage",event=>{
    if(String(event.key||"").startsWith("khaemenes_"))schedule();
  });
})(window);
