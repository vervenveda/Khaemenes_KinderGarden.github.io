(()=>{
"use strict";
if(window.KhaemenesKinderLesson)return;
const KEY="khaemenes.kinder.lesson-resilience.v1";
function read(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}
function write(v){try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch{return false}}
const API=Object.freeze({
  save(unit,day,evidence={}){
    const state=read(),u=String(unit),d=String(day);
    state[u]=state[u]||{};
    state[u][d]={...evidence,updatedAt:new Date().toISOString()};
    write(state);
    window.dispatchEvent(new CustomEvent("khaemenes-kinder-course-sync-request",{detail:{kind:"daily-evidence",unit:Number(unit),day:Number(day),evidence}}));
    return true;
  },
  read(unit,day){return read()?.[String(unit)]?.[String(day)]||null}
});
Object.defineProperty(window,"KhaemenesKinderLesson",{value:API,configurable:true});
function openRequestedDay(){
  const raw=Number(new URLSearchParams(location.search).get("day"));
  if(!Number.isInteger(raw)||raw<1||raw>5)return;
  const index=raw-1,tab=document.querySelector('.kg-day-tab[data-kg-day="'+index+'"]'),panels=[...document.querySelectorAll("[data-kg-panel]")];
  if(!tab||!panels.length)return;
  document.querySelectorAll(".kg-day-tab").forEach(x=>x.classList.toggle("active",x===tab));
  panels.forEach(x=>{const on=Number(x.dataset.kgPanel)===index;x.classList.toggle("active",on);x.hidden=!on});
  tab.scrollIntoView({block:"center",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  const lesson=window.KINDER_GARDEN_LESSON||{},title=lesson.dayTitles?.[index]||("Day "+raw);
  window.dispatchEvent(new CustomEvent("khaemenes-kinder-daily-context",{detail:{unit:Number(lesson.unit)||null,day:raw,title,source:"profile-today-first-step"}}));
  window.KhaemenesKinderNAIBAdapter?.request?.("Guide me through today's Kindergarten lesson.",{mentorId:"archaemenes",stage:"kindergarten",unit:Number(lesson.unit)||null,day:raw,lessonTitle:title,source:"profile-today-first-step"});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(openRequestedDay,0),{once:true});else setTimeout(openRequestedDay,0);
})();