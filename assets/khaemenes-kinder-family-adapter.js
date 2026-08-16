/*
 * Khaemenes Kinder Garden · Family Adapter v3.1.0
 * ------------------------------------------------
 * Family Registry is authoritative for formal Kinder Garden access.
 * Mentor identity is not selected or authored by this compatibility bridge.
 * Archaemenes is assigned through the Academy NAIB mentor-routing contract.
 * This bridge NEVER creates a family and NEVER auto-upgrades a child.
 */
(function attachKinderFamilyAdapter(global){
  "use strict";

  const VERSION="3.1.0";
  const LEGACY_PROFILE_KEY="khaemenes_preschool_profile_v1";
  const NAIB_ROUTER_URL="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-naib-mentor-router.js";

  function clean(value,max=120){
    return String(value??"")
      .replace(/[\u0000-\u001F\u007F]/g,"")
      .trim()
      .slice(0,max);
  }

  function cleanList(value,max=12){
    return Array.isArray(value)
      ? value.slice(0,max).map(item=>clean(item,60)).filter(Boolean)
      : [];
  }

  function readJSON(key,fallback={}){
    try{
      const raw=global.localStorage.getItem(key);
      return raw?JSON.parse(raw):fallback;
    }catch{return fallback}
  }

  function writeJSON(key,value){
    try{
      global.localStorage.setItem(key,JSON.stringify(value));
      return true;
    }catch{return false}
  }

  function ensureMentorRouter(){
    if(global.KhaemenesNAIB)return Promise.resolve(global.KhaemenesNAIB);
    const existing=global.document?.querySelector?.(`script[src="${NAIB_ROUTER_URL}"]`);
    if(existing){
      return new Promise(resolve=>{
        if(global.KhaemenesNAIB){resolve(global.KhaemenesNAIB);return}
        global.addEventListener("khaemenes-naib-ready",()=>resolve(global.KhaemenesNAIB||null),{once:true});
        global.setTimeout(()=>resolve(global.KhaemenesNAIB||null),5000);
      });
    }

    return new Promise(resolve=>{
      const script=global.document?.createElement?.("script");
      if(!script){resolve(null);return}
      script.src=NAIB_ROUTER_URL;
      script.async=true;
      script.referrerPolicy="no-referrer";
      script.onload=()=>resolve(global.KhaemenesNAIB||null);
      script.onerror=()=>resolve(null);
      (global.document.head||global.document.documentElement).appendChild(script);
    });
  }

  function syncCompatibility(learner){
    if(!learner||clean(learner.stage,40).toLowerCase()!=="kindergarten")return false;

    const legacyRaw=readJSON(LEGACY_PROFILE_KEY,{})||{};

    /*
     * Strip retired local mentor-selection fields before writing the
     * compatibility record. They may still exist in old browser data, but
     * this adapter must not keep propagating them forward.
     */
    const {
      personality:_retiredPersonality,
      mentorIdentity:_retiredMentorIdentity,
      mentorId:_retiredMentorId,
      ...legacy
    }=legacyRaw;

    const merged={
      ...legacy,
      learnerId:clean(learner.learnerId,160),
      nickname:clean(learner.nickname||legacy.nickname||"Learner",60),
      pathway:"kindergarten",
      stage:"kindergarten",
      ageBand:clean(learner.ageBand||legacy.ageBand||"5-6",30),
      interests:cleanList(Array.isArray(learner.interests)?learner.interests:legacy.interests),
      mentorId:"archaemenes",
      guardianRelease:learner.guardianRelease||legacy.guardianRelease||null,
      familyManaged:true,
      mentorAssignmentAuthority:"NAIB",
      updatedAt:new Date().toISOString()
    };

    writeJSON(LEGACY_PROFILE_KEY,merged);
    return true;
  }

  function dispatch(detail){
    try{
      global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{detail}));
    }catch{}
  }

  function refresh(){
    const family=global.KhaemenesFamilyRegistry;
    if(!family){
      dispatch({connected:false,reason:"registry-unavailable"});
      return;
    }

    const learner=family.getLearner?.();
    if(!learner){
      dispatch({connected:true,learnerId:null,reason:"no-active-learner"});
      return;
    }

    const stage=clean(learner.stage,40).toLowerCase();
    if(stage!=="kindergarten"){
      dispatch({
        connected:true,
        learnerId:clean(learner.learnerId,160)||null,
        stage,
        eligible:false,
        reason:"stage-mismatch"
      });
      return;
    }

    syncCompatibility(learner);
    dispatch({
      connected:true,
      learnerId:clean(learner.learnerId,160)||null,
      familyId:clean(learner.familyId,160)||null,
      stage,
      eligible:true,
      mentorId:"archaemenes",
      mentorAssignmentAuthority:"NAIB",
      mentorRouterReady:Boolean(global.KhaemenesNAIB)
    });
  }

  function wait(attempt=0){
    if(global.KhaemenesFamilyRegistry){refresh();return}
    if(attempt<80){
      global.setTimeout(()=>wait(attempt+1),50);
      return;
    }
    refresh();
  }

  global.addEventListener("khaemenes-family-changed",refresh);
  global.addEventListener("khaemenes-naib-ready",refresh);
  global.addEventListener("storage",event=>{
    if([
      "khaemenes_family_registry_v1",
      "khaemenes_active_family_v1",
      "khaemenes_active_learner_v1"
    ].includes(event.key))refresh();
  });

  global.KhaemenesKinderFamilyAdapter=Object.freeze({
    version:VERSION,
    refresh,
    syncCompatibility,
    ensureMentorRouter
  });

  ensureMentorRouter().finally(refresh);
  wait();
})(window);
