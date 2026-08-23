/*
 * Khaemenes Kinder Garden · Legacy Assessment Gate v1.0.0
 * --------------------------------------------------------
 * Previously published assessment HTML remains public/self-check material.
 * This guard prevents those legacy pages from acting as formal progression
 * surfaces. Eligible learners are routed to the current adult-observed mastery
 * rubric; ineligible or future assessment URLs fail closed.
 */
(function attachKhaemenesKinderAssessmentGate(global){
  "use strict";

  const VERSION="1.0.0";
  const PASS=80;
  const CURRICULUM_HOME="https://vervenveda.com/Khaemenes_KinderGarden.github.io/curriculum/";
  const MASTERY_HOME=CURRICULUM_HOME+"mastery/";
  const FAMILY_HOME="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  const FAMILY_SCRIPT="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js";
  const CONTINUITY_SCRIPT="https://vervenveda.com/Khaemenes_KinderGarden.github.io/assets/khaemenes-kinder-continuity.js";
  const MASTERY_SCRIPT="https://vervenveda.com/Khaemenes_KinderGarden.github.io/assets/khaemenes-kinder-mastery-gates.js";

  function targetFromPath(pathname){
    const p=String(pathname||"");
    const unit=p.match(/\/curriculum\/assessments\/unit-(\d{2})-assessment\.html$/i);
    if(unit)return Object.freeze({type:"week",unit:Number(unit[1])});
    if(/\/curriculum\/assessments\/midterm\.html$/i.test(p))return Object.freeze({type:"midterm"});
    if(/\/curriculum\/assessments\/final-exam\.html$/i.test(p))return Object.freeze({type:"final"});
    if(/\/curriculum\/assessments\/weekly-assessments\.html$/i.test(p))return Object.freeze({type:"index"});
    return null;
  }

  const target=targetFromPath(global.location?.pathname||"");
  if(!target)return;

  function hidePending(){
    if(!global.document)return;
    global.document.documentElement.setAttribute("data-khaemenes-kindergarten-assessment-gate-pending","1");
    if(global.document.getElementById("khaemenesKinderAssessmentGatePendingStyle"))return;
    const style=global.document.createElement("style");
    style.id="khaemenesKinderAssessmentGatePendingStyle";
    style.textContent='html[data-khaemenes-kindergarten-assessment-gate-pending="1"] body{visibility:hidden!important}';
    (global.document.head||global.document.documentElement).appendChild(style);
  }

  function ensureScript(src,marker){
    if(!global.document)return;
    if(global.document.querySelector(`script[data-${marker}],script[src="${src}"]`))return;
    const s=global.document.createElement("script");
    s.src=src;s.async=false;s.setAttribute(`data-${marker}`,"1");
    (global.document.head||global.document.documentElement).appendChild(s);
  }

  function ensureDependencies(){
    if(!global.KhaemenesFamilyRegistry)ensureScript(FAMILY_SCRIPT,"khaemenes-family-registry");
    if(!global.KhaemenesKinderContinuity)ensureScript(CONTINUITY_SCRIPT,"khaemenes-kinder-continuity");
    if(!global.KhaemenesKinderMasteryGates)ensureScript(MASTERY_SCRIPT,"khaemenes-kinder-mastery-gates");
  }

  function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

  function lock(message){
    if(!global.document)return;
    const learner=global.KhaemenesKinderContinuity?.getLearnerSummary?.();
    global.document.documentElement.removeAttribute("data-khaemenes-kindergarten-assessment-gate-pending");
    global.document.body.innerHTML=`<main style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#f4fff1;color:#263a31;font:16px/1.6 'Avenir Next','Segoe UI',Arial,sans-serif;text-align:center"><section style="width:min(100%,640px);padding:28px;border:1px solid rgba(45,93,61,.18);border-top:5px solid #3f9d59;border-radius:18px;background:#fff;box-shadow:0 18px 45px rgba(54,95,72,.12)"><div style="font-size:42px" aria-hidden="true">🔒</div><h1 style="margin:10px 0;color:#22543a;font:700 32px Georgia,serif">Formal mastery gate</h1><p>${esc(message)}</p><p style="color:#66756f;font-size:13px">This older public assessment is retained only as published self-check material. It cannot create formal mastery or unlock future curriculum. Formal advancement requires current learner-scoped evidence at ${PASS}% or higher.</p><p><a href="${CURRICULUM_HOME}" style="display:inline-block;margin:6px;padding:10px 14px;border-radius:8px;background:#22543a;color:#fff;text-decoration:none;font-weight:700">Return to Curriculum</a><a href="${FAMILY_HOME}" style="display:inline-block;margin:6px;padding:10px 14px;border:1px solid #22543a;border-radius:8px;color:#22543a;text-decoration:none;font-weight:700">Family Profile</a></p>${learner?.nickname?`<small>Active learner: ${esc(learner.nickname)}</small>`:""}</section></main>`;
    global.document.title="Formal Mastery Gate · Khaemenes Kinder Garden";
  }

  function route(){
    const G=global.KhaemenesKinderMasteryGates;
    if(!G)return false;
    if(target.type==="index"){
      global.location.replace(CURRICULUM_HOME);
      return true;
    }
    if(!G.formalAccess()){
      lock("A free active Kindergarten learner with grown-up authorization is required before formal mastery evidence can be recorded.");
      return true;
    }
    if(target.type==="week"){
      if(!G.canAssessWeek(target.unit)){
        lock("This week's formal mastery evidence is locked until all required prior mastery is complete.");
        return true;
      }
      global.location.replace(`${MASTERY_HOME}?unit=${encodeURIComponent(target.unit)}`);
      return true;
    }
    if(target.type==="midterm"||target.type==="final"){
      if(!G.canAssessMilestone(target.type)){
        lock(`The ${target.type} demonstration is locked until its required prerequisite mastery is complete.`);
        return true;
      }
      global.location.replace(`${MASTERY_HOME}?milestone=${encodeURIComponent(target.type)}`);
      return true;
    }
    return false;
  }

  hidePending();
  ensureDependencies();
  let tries=0;
  const check=()=>{
    tries++;
    if(route())return;
    if(tries<160){global.setTimeout(check,50);return}
    lock("The formal mastery gate could not initialize safely. Return to the curriculum and try again.");
  };
  check();

  global.KhaemenesKinderAssessmentGate=Object.freeze({version:VERSION,passingScore:PASS,targetFromPath});
})(window);
