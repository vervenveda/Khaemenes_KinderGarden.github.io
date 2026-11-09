/* Kindergarten Family Learning: read-only profile overview, no mastery writes.
 * Browser-local reading records are indications of activity, not official credit.
 */
(function(global){
"use strict";
if(global.KhaemenesKinderFamilyOverview)return;
const COURSE="khaemenes-kindergarten-formal-path";
const PREFIX="khaemenes_kindergarten_monthly_books_v1:";
const WEEKLY=["khaemenes_kindergarten_weekly_read_v1:","khaemenes_kindergarten_weekly_companion_read_v1:"];
const $=id=>document.getElementById(id);
function child(){
 const R=global.KhaemenesFamilyRegistry,ids=R?.activeIds?.()||{};
 const learner=R?.getLearner?.(ids.learnerId),family=R?.getFamily?.(ids.familyId);
 return learner&&family&&learner.learnerId===ids.learnerId&&learner.familyId===family.familyId&&
  learner.stage==="kindergarten"&&learner.grade==="k"&&learner.selfDirectedAdult!==true&&
  family.learnerIds?.includes(learner.learnerId)?learner:null;
}
function localMonth(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")}
function read(key){try{return JSON.parse(global.localStorage.getItem(key)||"null")}catch{return null}}
function reading(learnerId){
 const ids=new Set();
 const month=localMonth(), monthly=read(PREFIX+encodeURIComponent(learnerId)+":"+month);
 if(Array.isArray(monthly))for(const entry of monthly.slice(0,150)){
  const title=String(entry?.title||"").trim().slice(0,140).toLowerCase();
  if(title)ids.add(title);
 }
 for(let w=1;w<=36;w++)for(const prefix of WEEKLY){
  const receipt=read(prefix+encodeURIComponent(learnerId)+":"+w);
  if(receipt?.complete!==true||typeof receipt.completedAt!=="string"||
    receipt.completedAt.slice(0,7)!==month)continue;
  const title=String(receipt.title||"").trim().slice(0,140).toLowerCase();
  if(title)ids.add(title);
 }
 const coupons=read("khaemenes_kindergarten_reading_coupons_v1:"+encodeURIComponent(learnerId)+":"+month);
 return Object.freeze({month,books:ids.size,rewardsChosen:Array.isArray(coupons)?coupons.length:0});
}
function overview(){
 const learner=child();
 if(!learner)return Object.freeze({kind:"select"});
 const C=global.KhaemenesLearningContinuation;
 const snapshot=C?.readCourse?.(learner.learnerId,COURSE);
 const valid=snapshot?.learnerId===learner.learnerId&&snapshot.courseId===COURSE&&
  snapshot.stage==="kindergarten"&&snapshot.grade==="K";
 const report=valid?{
  status:snapshot.status||"continue",
  completed:Number.isFinite(snapshot.progress?.completed)?snapshot.progress.completed:null,
  total:Number.isFinite(snapshot.progress?.total)?snapshot.progress.total:null,
  next:String(snapshot.nextTitle||"Open Kindergarten").slice(0,160),
  stale:snapshot.stale===true,
  familyAttention:snapshot.family?.needsAction===true
 }:null;
 return Object.freeze({kind:"ready",learnerId:learner.learnerId,report,reading:reading(learner.learnerId)});
}
function render(){
 const box=$("kinderFamilyOverviewStatus"),readingBox=$("kinderReadingOverviewStatus");
 if(!box||!readingBox)return;
 const data=overview();
 if(data.kind!=="ready"){
  box.textContent="Select a registered Kindergarten learner from this family.";
  readingBox.textContent="No child's reading records are displayed in guest mode.";
  return;
 }
 if(!data.report){
  box.textContent="No linked Kindergarten progress summary has been published on this browser. Existing mastery records remain with the course.";
 }else{
  const r=data.report;
  box.textContent=(r.completed!==null&&r.total!==null?r.completed+" of "+r.total+" learning units reported. ":"")+
    "Next step: "+r.next+". "+(r.familyAttention?"Family review requested. ":"")+
    (r.stale?"Course report may need refreshing.":"");
 }
 readingBox.textContent=data.reading.books+" different books recorded this month · "+data.reading.rewardsChosen+
   " reading reward selections recorded. These are browser-local reading activities, not academic grades.";
}
function init(){render()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
for(const event of ["pageshow","khaemenes-family-changed","khaemenes-learning-continuation-changed",
 "khaemenes-kindergarten-mastery-changed"])global.addEventListener(event,render);
global.addEventListener("storage",event=>{
 if(event.key==="khaemenes_family_registry_v1"||event.key==="khaemenes_active_learner_v1"||
  event.key===global.KhaemenesLearningContinuation?.storageKey||
  /^khaemenes_kindergarten_(monthly_books|weekly_read|weekly_companion_read|reading_coupons)_v1:/.test(event.key||""))render();
});
global.KhaemenesKinderFamilyOverview=Object.freeze({version:"1.0.0",overview,render});
})(window);
