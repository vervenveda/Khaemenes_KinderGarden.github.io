(()=>{
"use strict";
if(window.KhaemenesKinderSTOSBridge)return;

const VERSION="1.0.0";
const ENDPOINTS=Object.freeze({
  academyHome:"/stos/khaemenes/",
  kinderHome:"/stos/khaemenes/kindergarten/",
  bootstrap:"/stos/kindergarten/v1/bootstrap",
  sync:"/stos/kindergarten/v1/sync",
  mentor:"/stos/mentor/v1/request",
  beta:"/stos/beta/v1/report",
  betaPage:"/stos/beta/",
  family:"/stos/khaemenes/family/",
  enroll:"/stos/khaemenes/family/enroll/",
  student:"/stos/khaemenes/student/",
  teacher:"/stos/khaemenes/teacher-admin/",
  weather:"/stos/kindergarten/v1/weather",
  geocode:"/stos/kindergarten/v1/weather/geocode",
  reverseGeocode:"/stos/kindergarten/v1/weather/reverse",
  astronomy:"/stos/kindergarten/v1/astronomy"
});

const QUEUE_KEY="khaemenes.kinder.stos.queue.v1";
const MAX_QUEUE=50;
const DEFAULT_TIMEOUT=6000;
let bootstrapState=null, flushing=false;

function now(){return new Date().toISOString()}
function requestId(prefix="req"){
  try{
    if(globalThis.crypto?.randomUUID)return `${prefix}-${crypto.randomUUID()}`;
    const a=new Uint32Array(4);crypto.getRandomValues(a);
    return `${prefix}-${Array.from(a,x=>x.toString(16).padStart(8,"0")).join("")}`;
  }catch{return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,10)}`}
}
function clean(v,max=4000){return String(v??"").replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,max)}
function safe(v){try{return JSON.parse(JSON.stringify(v))}catch{return null}}
function queueRead(){try{const q=JSON.parse(localStorage.getItem(QUEUE_KEY)||"[]");return Array.isArray(q)?q:[]}catch{return []}}
function queueWrite(q){try{localStorage.setItem(QUEUE_KEY,JSON.stringify(q.slice(-MAX_QUEUE)));return true}catch{return false}}
function enqueue(kind,payload){
  const q=queueRead();q.push({id:requestId("queued"),kind,payload:safe(payload),queuedAt:now()});queueWrite(q);
  dispatchEvent(new CustomEvent("khaemenes:kinder-queue",{detail:{count:q.length}}));
}
function sameOrigin(path){
  const u=new URL(path,location.origin);
  if(u.origin!==location.origin)throw new Error("Cross-origin STOS request refused.");
  return u.pathname+u.search;
}
async function send(path,{method="POST",body=null,timeout=DEFAULT_TIMEOUT}={}){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{
    const r=await fetch(sameOrigin(path),{
      method,credentials:"same-origin",cache:"no-store",
      headers:{"Accept":"application/json",...(body!==null?{"Content-Type":"application/json"}:{})},
      body:body===null?undefined:JSON.stringify(body),signal:controller.signal
    });
    let data=null;try{data=await r.json()}catch{}
    if(!r.ok)throw new Error(data?.message||`STOS service returned ${r.status}`);
    return data||{ok:true};
  }finally{clearTimeout(timer)}
}
function pageContext(){
  const path=location.pathname;
  const um=path.match(/unit-(\d{1,2})/i);
  return {surface:"khaemenes-kindergarten",page:path,stage:"kindergarten",week:um?Number(um[1]):null};
}
function learner(){
  if(bootstrapState?.learner)return bootstrapState.learner;
  try{return window.KhaemenesKinderContinuity?.getLearnerSummary?.()||null}catch{return null}
}
function envelope(kind,payload){
  return {schema:"khaemenes-kindergarten-stos-envelope",version:1,requestId:requestId(kind),
    createdAt:now(),kind,context:pageContext(),learner:learner(),payload:safe(payload)};
}
async function bootstrap(){
  try{
    bootstrapState=await send(ENDPOINTS.bootstrap,{method:"GET"});
    dispatchEvent(new CustomEvent("khaemenes:kinder-bootstrap",{detail:bootstrapState}));
    void flushQueue();return bootstrapState;
  }catch(error){
    dispatchEvent(new CustomEvent("khaemenes:kinder-offline",{detail:{message:error.message}}));
    return null;
  }
}
async function sync(kind,payload,{queueOnFailure=true}={}){
  const msg=envelope(kind,payload);
  try{
    const res=await send(ENDPOINTS.sync,{body:msg});
    dispatchEvent(new CustomEvent("khaemenes:kinder-sync-success",{detail:{kind,response:res}}));
    return res;
  }catch(error){
    if(queueOnFailure)enqueue(kind,payload);
    return {ok:false,queued:queueOnFailure,message:error.message};
  }
}
async function mentorRequest(req={}){
  const msg=envelope("mentor-request",{
    mentorId:"archaemenes",
    expression:"wise-owl",
    routingAuthority:"NAIB",
    requestedSpecialist:req.requestedSpecialist||null,
    message:clean(req.message),
    mentorContext:req.context||pageContext()
  });
  try{
    const res=await send(ENDPOINTS.mentor,{body:msg});
    dispatchEvent(new CustomEvent("khaemenes:mentor-response",{detail:res}));
    return res;
  }catch(error){
    enqueue("mentor-request",msg.payload);
    return {queued:true,message:"Wise Owl request queued safely for the Academy mentor service."};
  }
}
async function betaReport(report={}){
  const msg=envelope("beta-report",{category:clean(report.category||"experience",80),description:clean(report.description),source:pageContext()});
  try{return await send(ENDPOINTS.beta,{body:msg})}
  catch(error){enqueue("beta-report",msg.payload);return {queued:true,message:error.message}}
}
async function geocode(query){
  const q=clean(query,120);if(!q)throw new Error("Enter a location.");
  return send(`${ENDPOINTS.geocode}?q=${encodeURIComponent(q)}`,{method:"GET"});
}
async function weather(lat,lon,label,units="imperial"){
  const qs=new URLSearchParams({lat:String(lat),lon:String(lon),label:clean(label,160),units:units==="metric"?"metric":"imperial"});
  return send(`${ENDPOINTS.weather}?${qs}`,{method:"GET"});
}
async function reverseGeocode(lat,lon){
  const qs=new URLSearchParams({lat:String(lat),lon:String(lon)});
  return send(`${ENDPOINTS.reverseGeocode}?${qs}`,{method:"GET"});
}
async function astronomy(lat,lon){
  const qs=new URLSearchParams({lat:String(lat),lon:String(lon)});
  return send(`${ENDPOINTS.astronomy}?${qs}`,{method:"GET"});
}
async function flushQueue(){
  if(flushing)return;flushing=true;
  try{
    const snapshot=queueRead();
    const delivered=new Set();
    for(const item of snapshot){
      if(!item||typeof item.id!=="string")continue;
      const msg={...envelope(item.kind,item.payload),requestId:item.id,createdAt:item.queuedAt||now()};
      try{
        if(item.kind==="mentor-request")await send(ENDPOINTS.mentor,{body:msg});
        else if(item.kind==="beta-report")await send(ENDPOINTS.beta,{body:msg});
        else await send(ENDPOINTS.sync,{body:msg});
        delivered.add(item.id);
      }catch{/* Retain original event with its stable ID for retry. */}
    }
    // Re-read after network awaits: new events may have arrived during the flush.
    const latest=queueRead();
    const remaining=latest.filter(item=>!delivered.has(item?.id));
    queueWrite(remaining);
    dispatchEvent(new CustomEvent("khaemenes:kinder-queue",{detail:{count:remaining.length}}));
  }finally{flushing=false}
}

addEventListener("khaemenes-kinder-course-sync-request",e=>{void sync(e.detail?.kind||"course-state",e.detail)});
addEventListener("khaemenes-kinder-assessment-sync-request",e=>{void sync("assessment-state",e.detail)});
addEventListener("online",()=>{void flushQueue()});

Object.defineProperty(window,"KhaemenesKinderSTOSBridge",{value:Object.freeze({
  version:VERSION,endpoints:ENDPOINTS,bootstrap,sync,mentorRequest,betaReport,geocode,weather,reverseGeocode,astronomy,flushQueue,
  queuedCount:()=>queueRead().length
}),configurable:true});

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>void bootstrap(),{once:true});
else void bootstrap();
})();