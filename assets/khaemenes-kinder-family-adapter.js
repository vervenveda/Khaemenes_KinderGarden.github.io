/*
 * Khaemenes Kinder Garden · Family Adapter v2.1.0
 * ------------------------------------------------
 * Family Registry is authoritative for formal Kinder Garden access.
 * This bridge NEVER creates a family and NEVER auto-upgrades a child.
 */
(function attachKinderFamilyAdapter(global){
  "use strict";

  function writeJSON(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}
  }

  function ensureBetaProgramLink(){
    if(!global.document)return;
    if(global.document.querySelector('script[data-vnv-beta-link],script[src="https://vervenveda.com/assets/vnv-beta-link.js"]'))return;
    const script=global.document.createElement("script");
    script.src="https://vervenveda.com/assets/vnv-beta-link.js";
    script.defer=true;
    script.dataset.vnvBetaLink="kindergarten";
    global.document.head.appendChild(script);
  }

  function syncCompatibility(learner){
    if(!learner||String(learner.stage||"").toLowerCase()!=="kindergarten")return false;

    let legacy={};
    try{legacy=JSON.parse(localStorage.getItem("khaemenes_preschool_profile_v1")||"{}")||{}}catch{}

    const style=learner?.mentorIdentity?.baseStyle || legacy.personality || "playful";
    const merged={
      ...legacy,
      learnerId:learner.learnerId,
      nickname:learner.nickname||legacy.nickname||"Learner",
      pathway:"kindergarten",
      ageBand:learner.ageBand||legacy.ageBand||"5-6",
      interests:Array.isArray(learner.interests)?learner.interests:(legacy.interests||[]),
      personality:style,
      mentorId:learner.mentorId||legacy.mentorId||null,
      mentorIdentity:learner.mentorIdentity||legacy.mentorIdentity||{mode:"embedded",baseStyle:style},
      guardianRelease:learner.guardianRelease||legacy.guardianRelease||null,
      familyManaged:true,
      updatedAt:new Date().toISOString()
    };
    writeJSON("khaemenes_preschool_profile_v1",merged);
    return true;
  }

  function refresh(){
    const family=global.KhaemenesFamilyRegistry;
    if(!family){
      global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{detail:{connected:false,reason:"registry-unavailable"}}));
      return;
    }

    const learner=family.getLearner?.();
    if(!learner){
      global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{detail:{connected:true,learnerId:null,reason:"no-active-learner"}}));
      return;
    }

    const stage=String(learner.stage||"").toLowerCase();
    if(stage!=="kindergarten"){
      global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{
        detail:{connected:true,learnerId:learner.learnerId,stage,eligible:false,reason:"stage-mismatch"}
      }));
      return;
    }

    syncCompatibility(learner);
    global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{
      detail:{connected:true,learnerId:learner.learnerId,familyId:learner.familyId,stage,eligible:true}
    }));
  }

  function wait(attempt=0){
    if(global.KhaemenesFamilyRegistry){refresh();return}
    if(attempt<80)setTimeout(()=>wait(attempt+1),50);
    else refresh();
  }

  global.addEventListener("khaemenes-family-changed",refresh);
  global.addEventListener("storage",event=>{
    if(["khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(event.key))refresh();
  });

  global.KhaemenesKinderFamilyAdapter=Object.freeze({version:"2.1.0",refresh,syncCompatibility,ensureBetaProgramLink});
  if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",ensureBetaProgramLink,{once:true});else ensureBetaProgramLink();
  wait();
})(window);
