(function(global){
"use strict";
/*
 Khaemenes Kindergarten Voice Profiles
 Sovereign browser-speech contract. No network dependency.
 Voice availability varies by device/browser, so profiles select by locale,
 name hints and voice metadata rather than requiring one vendor voice.
*/
const VERSION="2026-10-28";
const PROFILES=Object.freeze({
  archaemenes:Object.freeze({
    id:"archaemenes",name:"Archaemenes",role:"Academy guide",
    locale:"en-GB",genderPreference:"male",tone:"gentle, warm, clear English",
    rate:0.88,pitch:0.92,volume:1,
    preferredNameHints:["Google UK English Male","Microsoft Ryan","Daniel","Arthur","Oliver","British","English Male"],
    uses:Object.freeze(["welcome","directions","encouragement","transitions","mentor guidance"])
  }),
  eiren:Object.freeze({
    id:"eiren",name:"Eiren",role:"Language Arts mentor and read-along narrator",
    locale:"en-GB",fallbackLocales:Object.freeze(["en-US","en"]),
    genderPreference:"female",tone:"soft, warm, expressive, unhurried",
    rate:0.84,pitch:1.04,volume:1,
    preferredNameHints:["Google UK English Female","Microsoft Sonia","Serena","Kate","Samantha","English Female"],
    uses:Object.freeze(["read-along","public-domain narration","vocabulary","poetry and rhyme","comprehension prompts"])
  })
});
function voices(){return typeof speechSynthesis==="undefined"?[]:speechSynthesis.getVoices()||[]}
function score(v,p){
  const name=String(v.name||"").toLowerCase(),lang=String(v.lang||"").toLowerCase(),locale=p.locale.toLowerCase();
  let n=0;if(lang===locale)n+=100;else if(lang.startsWith(locale.split("-")[0]))n+=45;
  for(const hint of p.preferredNameHints)if(name.includes(hint.toLowerCase()))n+=80;
  if(v.localService)n+=8;if(v.default)n+=3;return n
}
function select(id){
  const p=PROFILES[id]||PROFILES.eiren,vs=voices();if(!vs.length)return null;
  return vs.slice().sort((a,b)=>score(b,p)-score(a,p))[0]||null
}
function speak(text,id="eiren",options={}){
  if(!text||typeof SpeechSynthesisUtterance==="undefined"||typeof speechSynthesis==="undefined")return false;
  const p=PROFILES[id]||PROFILES.eiren,u=new SpeechSynthesisUtterance(String(text)),v=select(id);
  u.lang=v?.lang||p.locale;u.voice=v||null;u.rate=Number(options.rate??p.rate);u.pitch=Number(options.pitch??p.pitch);u.volume=Number(options.volume??p.volume);
  if(options.interrupt!==false)speechSynthesis.cancel();speechSynthesis.speak(u);return true
}
function stop(){if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel()}
global.KhaemenesKinderVoices=Object.freeze({version:VERSION,profiles:PROFILES,voices,select,speak,stop});
})(window);
