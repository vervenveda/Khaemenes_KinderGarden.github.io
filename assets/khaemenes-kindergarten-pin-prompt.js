/* Khaemenes Kinder Garden · profile pin prompt. Presentation only; never alters curriculum records. */
(function(g){
"use strict";
const PIN_KEY="khaemenes_course_pins_v1",SEEN_KEY="khaemenes_kindergarten_pin_prompt_seen_v1";
const KINDER_URL="https://vervenveda.com/Khaemenes_KinderGarden.github.io/",FAMILY_URL="https://vervenveda.com/Khaemenes_Academy.github.io/family/",STUDENT_URL="https://vervenveda.com/Khaemenes_Academy.github.io/student/";
const COURSE={id:"khaemenes-kindergarten",courseId:"khaemenes-kindergarten",title:"Khaemenes Kinder Garden",subtitle:"Kindergarten · 36-week formal curriculum",href:KINDER_URL,source:"khaemenes-kindergarten"};
const $=id=>g.document.getElementById(id);
function read(key,fallback){try{const raw=g.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
function write(key,value){try{g.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
function learner(){
 const s=g.KhaemenesKinderContinuity&&g.KhaemenesKinderContinuity.getLearnerSummary?g.KhaemenesKinderContinuity.getLearnerSummary():null;
 const r=g.KhaemenesFamilyRegistry&&g.KhaemenesFamilyRegistry.getLearner?g.KhaemenesFamilyRegistry.getLearner():null;
 const id=s&&s.learnerId||r&&r.learnerId;if(!id)return null;
 const stage=String(s&& (s.stage||s.pathway)||r&&r.stage||"").toLowerCase();
 return {learnerId:String(id),nickname:s&&s.nickname||r&&r.nickname||"Learner",eligible:stage==="kindergarten"||stage==="k",hasProfile:Boolean(s&&s.hasProfile&&s.hasLinkedLearner)};
}
function store(){const x=read(PIN_KEY,null);return x&&x.version===1&&x.learners&&typeof x.learners==="object"?x:{version:1,learners:{},updatedAt:null}}
function pins(id){const a=store().learners[id];return Array.isArray(a)?a.filter(x=>x&&typeof x==="object"):[]}
function hasPin(id){return pins(id).some(p=>String(p.id||"")===COURSE.id||String(p.courseId||"")===COURSE.courseId||p.href===KINDER_URL)}
function addPin(id){
 const current=learner();if(!current||current.learnerId!==String(id)||!current.eligible||!current.hasProfile)return {ok:false};
 const x=store(),a=pins(id);if(a.some(p=>String(p.id||"")===COURSE.id||String(p.courseId||"")===COURSE.courseId||p.href===KINDER_URL))return {ok:true,already:true};
 x.learners[id]=a.concat([Object.assign({},COURSE,{pinnedAt:new Date().toISOString()})]).slice(-24);x.updatedAt=new Date().toISOString();
 if(!write(PIN_KEY,x))return {ok:false};
 g.dispatchEvent(new CustomEvent("khaemenes-course-pins-changed",{detail:{learnerId:id,courseId:COURSE.courseId}}));return {ok:true,already:false};
}
function seen(id){const x=read(SEEN_KEY,{});return Boolean(x&&x[id])}
function markSeen(id){const x=read(SEEN_KEY,{});x[id]=new Date().toISOString();write(SEEN_KEY,x)}
function css(){
 if($("kinderPinPromptStyle"))return;
 const s=g.document.createElement("style");s.id="kinderPinPromptStyle";
 s.textContent='#kinderPinPrompt{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;background:rgba(22,35,43,.58);backdrop-filter:blur(7px)}#kinderPinPrompt[hidden]{display:none!important}#kinderPinPrompt .kp-card{width:min(520px,100%);max-height:calc(100dvh - 32px);overflow:auto;padding:clamp(20px,5vw,30px);border:3px solid #fff;border-radius:25px;background:linear-gradient(145deg,#fffdf4,#fff0f8 65%,#e7fbf6);box-shadow:0 25px 75px #172b3540;color:#294a3d;font:400 16px/1.5 "Avenir Next","Trebuchet MS",system-ui,sans-serif}#kinderPinPrompt .kp-mark{font-size:2.6rem;text-align:center}#kinderPinPrompt h2{margin:7px 0;color:#365f48;text-align:center;font:800 clamp(1.6rem,5vw,2.15rem)/1.08 Georgia,serif}#kinderPinPrompt p{color:#586b67}#kinderPinPrompt .kp-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}#kinderPinPrompt .kp-actions button,#kinderPinPrompt .kp-actions a{min-width:0;min-height:46px;display:flex;align-items:center;justify-content:center;padding:10px 12px;border:0;border-radius:12px;text-align:center;text-decoration:none;font-weight:700;font-size:14px;line-height:1.25;cursor:pointer}#kinderPinPrompt .kp-save{background:#2c6e4c;color:#fff}#kinderPinPrompt .kp-later{border:1px solid #d6e2d8!important;background:#fff;color:#435c50}#kinderPinPrompt .kp-profile{grid-column:1/-1;background:#f5e6a9;color:#4f5037}#kinderPinPrompt .kp-status{min-height:1.2em;margin:12px 0 0;text-align:center;font-size:.88rem;font-weight:700;color:#326c52}#kinderPinPrompt .kp-adult-note{margin-top:10px;font-size:.82rem;color:#6f7b75}@media(max-width:390px){#kinderPinPrompt .kp-actions{grid-template-columns:1fr}#kinderPinPrompt .kp-profile{grid-column:auto}}@media(prefers-reduced-motion:reduce){#kinderPinPrompt *{animation:none!important;transition:none!important}}';
 g.document.head.appendChild(s);
}
function build(){
 let root=$("kinderPinPrompt");if(root)return root;css();
 root=g.document.createElement("div");root.id="kinderPinPrompt";root.hidden=true;
 root.innerHTML='<section class="kp-card" role="dialog" aria-modal="true" aria-labelledby="kpTitle" aria-describedby="kpDescription"><div class="kp-mark" aria-hidden="true">🌻📌</div><h2 id="kpTitle">Save Kinder Garden to your profile?</h2><p id="kpDescription">Would you like a grown-up or learner to pin Khaemenes Kinder Garden to the Academy Student Profile? A pin makes the class easier to find next time. It does not enroll you again or change lessons, grades, or mastery.</p><p id="kpStatus" class="kp-status" aria-live="polite"></p><p class="kp-adult-note">A parent or caregiver can save the class for the selected learner. Each learner keeps their own pins.</p><div class="kp-actions"><button class="kp-save" id="kpSave" type="button">📌 Pin to My Profile</button><button class="kp-later" id="kpLater" type="button">Not now</button><a class="kp-profile" id="kpFamily" href="'+FAMILY_URL+'">Parent / Family Profile</a></div></section>';
 g.document.body.appendChild(root);
 root.addEventListener("click",e=>{if(e.target===root)close("later")});
 g.document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!root.hidden)close("later")});
 $("kpLater").addEventListener("click",()=>close("later"));
 $("kpSave").addEventListener("click",()=>{
  const l=learner();
  if(!l||!l.hasProfile||!l.eligible){$("kpStatus").textContent="Please ask a grown-up to select the Kindergarten learner in the Family Profile first. Nothing has been pinned.";return}
  const result=addPin(l.learnerId);
  if(!result.ok){$("kpStatus").textContent="We couldn't save the pin in this browser. The class is still available; please try again after opening the correct learner profile.";return}
  markSeen(l.learnerId);
  $("kpTitle").textContent=result.already?"Kinder Garden is already pinned!":"Kinder Garden is pinned!";
  $("kpDescription").textContent=result.already?"This class is already saved in the selected learner's Academy Student Profile.":"Khaemenes Kinder Garden is now saved in this learner's Academy Student Profile.";
  $("kpStatus").textContent=result.already?"No duplicate pin was added.":"Saved for "+l.nickname+".";
  $("kpSave").textContent="Open Student Profile →";$("kpSave").onclick=()=>g.location.href=STUDENT_URL;$("kpLater").textContent="Close";$("kpFamily").textContent="Open Family Profile";
 });
 return root;
}
function open(){
 const root=build(),l=learner(),q=new URLSearchParams(g.location.search),forced=q.get("pinClass")==="kindergarten"||q.get("from")==="preschool-graduation",id=l&&l.learnerId||"guest";
 if(!forced){if(l&&l.eligible&&hasPin(id))return;if(seen(id))return;if(!l||!l.eligible)return}
 if(l&&l.eligible&&hasPin(id)){
  $("kpTitle").textContent="Kinder Garden is already pinned!";$("kpDescription").textContent="This class is already saved in your selected Academy learner profile.";$("kpStatus").textContent="Your pin is ready to use.";$("kpSave").textContent="Open Student Profile →";$("kpSave").onclick=()=>g.location.href=STUDENT_URL;
 }else if(!l||!l.eligible||!l.hasProfile){
  $("kpTitle").textContent="Ready to save your new class?";$("kpDescription").textContent="A parent or caregiver can select or create the correct Kindergarten learner profile first. Then return here to pin Kinder Garden to that learner. We will not create a duplicate profile or guess which child is active.";$("kpStatus").textContent="Profile selection is needed before saving.";$("kpSave").textContent="Open Family Profile →";$("kpSave").onclick=()=>g.location.href=FAMILY_URL;
 }else{
  $("kpTitle").textContent="Save Kinder Garden to your profile?";$("kpDescription").textContent="Would you like a grown-up or learner to pin Khaemenes Kinder Garden to the Academy Student Profile? A pin makes the class easier to find next time. It does not enroll you again or change lessons, grades, or mastery.";$("kpStatus").textContent="";$("kpSave").textContent="📌 Pin to My Profile";$("kpSave").onclick=null;
 }
 root.hidden=false;$("kpSave").focus();
}
function close(reason){const root=$("kinderPinPrompt");if(!root)return;markSeen(learner()&&learner().learnerId||"guest");root.hidden=true}
function init(){try{open()}catch(e){console.warn("Kindergarten pin prompt could not open safely",e)}}
if(g.document.readyState==="loading")g.document.addEventListener("DOMContentLoaded",init,{once:true});else init();
g.KhaemenesKindergartenPinPrompt=Object.freeze({open,close,hasPin,addPin,coursePin:COURSE});
})(window);