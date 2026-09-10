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
})();