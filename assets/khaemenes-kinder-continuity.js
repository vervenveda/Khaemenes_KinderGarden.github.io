/*
  Khaemenes Kinder Garden Continuity Bridge v2
  ---------------------------------------------------------
  Purpose:
  - Recognize the active Crechè / Preschool learner profile.
  - Preserve the same mentor identity in Kinder Garden.
  - Attach Kindergarten curriculum records to stable learnerId.
  - Mirror the active learner's record to the legacy curriculum key
    so existing assessment/certificate pages continue to work.
  - Keep all data local to the browser.

  This script does not create accounts, transmit learner records,
  infer ability, or replace guardian authorization.
*/
(function attachKinderContinuity(global){
  "use strict";

  const KEYS = Object.freeze({
    preschoolProfile:"khaemenes_preschool_profile_v1",
    continuity:"khaemenes_learning_continuity_v1",
    legacyKindergarten:"khaemenes_kindergarten_36_aplus_v1",
    kindergartenByLearner:"khaemenes_kindergarten_records_by_learner_v1",
    activeKindergartenLearner:"khaemenes_kindergarten_active_learner_v1"
  });

  const MENTORS = Object.freeze({
    playful:{
      id:"pip",name:"Pip",avatar:"🌞",
      colors:["#ef6a66","#f6bf3a"],
      traits:["playful","social","encouraging"],
      intro:"I love learning with a little laughter and movement. We can try, wiggle, wonder, and try again."
    },
    curious:{
      id:"miri",name:"Miri",avatar:"🦉",
      colors:["#2398d5","#42c7dc"],
      traits:["quiet","curious","patient"],
      intro:"I like looking closely and asking gentle questions. We never have to rush a good idea."
    },
    imaginative:{
      id:"nova",name:"Nova",avatar:"🚀",
      colors:["#7254d8","#e95ca8"],
      traits:["imaginative","expressive","adventurous"],
      intro:"I turn learning into stories, pictures, and little worlds. Your ideas will help guide our adventures."
    },
    steady:{
      id:"sage",name:"Sage",avatar:"🌿",
      colors:["#23a67c","#8ccf54"],
      traits:["steady","patient","determined"],
      intro:"I like clear steps and calm practice. We will notice every bit of progress and keep going together."
    }
  });

  function readJSON(key,fallback=null){
    try{
      const raw=global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch{
      return fallback;
    }
  }

  function writeJSON(key,value){
    try{
      global.localStorage.setItem(key,JSON.stringify(value));
      return true;
    }catch{
      return false;
    }
  }

  function remove(key){
    try{ global.localStorage.removeItem(key); return true; }
    catch{ return false; }
  }

  function profile(){
    const shared=global.KhaemenesLearnerProfile?.getProfile?.();
    return shared || readJSON(KEYS.preschoolProfile,null);
  }

  function normalizeState(value={}){
    const state=value && typeof value==="object" ? value : {};
    return {
      student:String(state.student || "Kindergarten Scholar").slice(0,80),
      weekly:state.weekly && typeof state.weekly==="object" ? {...state.weekly} : {},
      midterm:Math.max(0,Math.min(100,Number(state.midterm || 0))),
      final:Math.max(0,Math.min(100,Number(state.final || 0))),
      portfolio:Boolean(state.portfolio),
      learnerId:state.learnerId || null,
      mentorId:state.mentorId || null,
      linkedAt:state.linkedAt || null,
      updatedAt:state.updatedAt || null,
      recordVersion:"2.0"
    };
  }

  function embeddedMentorFor(p){
    const base=MENTORS[p?.personality] || Object.values(MENTORS).find(x=>x.id===p?.mentorId) || MENTORS.playful;
    const identity=p?.mentorIdentity && typeof p.mentorIdentity==="object" ? p.mentorIdentity : {mode:"embedded"};

    if(identity.mode==="custom"){
      return {
        id:base.id,
        name:String(identity.name || "My Mentor").slice(0,14),
        avatar:identity.avatar || "🦊",
        colors:Array.isArray(identity.colors) && identity.colors.length===2 ? [...identity.colors] : [...base.colors],
        traits:[...base.traits],
        intro:base.intro,
        baseName:base.name,
        custom:true
      };
    }

    return {
      ...base,
      colors:[...base.colors],
      traits:[...base.traits],
      baseName:base.name,
      custom:false
    };
  }

  function guardianAuthorized(p=profile()){
    const r=p?.guardianRelease;
    return Boolean(r?.accepted && r?.learnerId===p?.learnerId);
  }

  function learnerSummary(){
    const p=profile();
    if(!p) return {
      hasProfile:false,
      learnerId:null,
      nickname:null,
      ageBand:null,
      pathway:null,
      mentor:null,
      guardianAuthorized:false
    };

    return {
      hasProfile:true,
      learnerId:p.learnerId || null,
      nickname:p.nickname || null,
      ageBand:p.ageBand || null,
      pathway:p.pathway || "preschool",
      mentorId:p.mentorId || null,
      mentor:embeddedMentorFor(p),
      guardianAuthorized:guardianAuthorized(p),
      guardianReleaseVersion:p.guardianRelease?.version || null,
      interests:Array.isArray(p.interests) ? [...p.interests] : [],
      pace:p.pace || "balanced",
      updatedAt:p.updatedAt || null
    };
  }

  function allLearnerRecords(){
    const value=readJSON(KEYS.kindergartenByLearner,{});
    return value && typeof value==="object" ? value : {};
  }

  function safeLearnerId(){
    return profile()?.learnerId || null;
  }

  function copyLegacyIntoLearner(id,records){
    if(!id || records[id]) return records;
    const legacyRaw=readJSON(KEYS.legacyKindergarten,null);
    if(!legacyRaw) return records;

    const legacy=normalizeState(legacyRaw);
    records[id]={
      ...legacy,
      learnerId:id,
      mentorId:profile()?.mentorId || legacy.mentorId || null,
      linkedAt:new Date().toISOString(),
      updatedAt:new Date().toISOString(),
      migration:{
        source:"khaemenes_kindergarten_36_aplus_v1",
        mode:"non-destructive-copy",
        migratedAt:new Date().toISOString()
      }
    };
    writeJSON(KEYS.kindergartenByLearner,records);
    return records;
  }

  function loadCurriculumState(defaultState=null){
    const fallback=normalizeState(defaultState || {});
    const p=profile();
    const id=p?.learnerId || null;

    if(!id){
      return normalizeState(readJSON(KEYS.legacyKindergarten,fallback));
    }

    let records=allLearnerRecords();
    records=copyLegacyIntoLearner(id,records);

    let state=records[id] ? normalizeState(records[id]) : {
      ...fallback,
      learnerId:id,
      mentorId:p.mentorId || null,
      linkedAt:new Date().toISOString()
    };

    if((!state.student || state.student==="Kindergarten Scholar") && p.nickname){
      state.student=String(p.nickname).slice(0,80);
    }

    state.learnerId=id;
    state.mentorId=p.mentorId || state.mentorId || null;
    state.updatedAt=state.updatedAt || new Date().toISOString();

    records[id]=state;
    writeJSON(KEYS.kindergartenByLearner,records);
    writeJSON(KEYS.activeKindergartenLearner,{
      learnerId:id,
      nickname:p.nickname || null,
      activatedAt:new Date().toISOString()
    });

    // Compatibility mirror: existing certificate/assessment pages still
    // expect the legacy key. Keep it synchronized with the active learner.
    writeJSON(KEYS.legacyKindergarten,state);
    return normalizeState(state);
  }

  function saveCurriculumState(value){
    const state=normalizeState(value);
    const p=profile();
    const id=p?.learnerId || state.learnerId || null;

    state.updatedAt=new Date().toISOString();

    if(id){
      state.learnerId=id;
      state.mentorId=p?.mentorId || state.mentorId || null;
      const records=allLearnerRecords();
      records[id]=state;
      writeJSON(KEYS.kindergartenByLearner,records);
      writeJSON(KEYS.activeKindergartenLearner,{
        learnerId:id,
        nickname:p?.nickname || state.student || null,
        activatedAt:new Date().toISOString()
      });
    }

    writeJSON(KEYS.legacyKindergarten,state);
    return normalizeState(state);
  }

  function clearActiveCurriculumRecord(){
    const p=profile();
    const id=p?.learnerId || null;

    if(id){
      const records=allLearnerRecords();
      delete records[id];
      writeJSON(KEYS.kindergartenByLearner,records);
      remove(KEYS.legacyKindergarten);
      remove(KEYS.activeKindergartenLearner);
      return true;
    }

    remove(KEYS.legacyKindergarten);
    return true;
  }

  function curriculumStateForLearner(id){
    if(!id) return null;
    const records=allLearnerRecords();
    return records[id] ? normalizeState(records[id]) : null;
  }

  function curriculumSummary(passingScore=80,totalUnits=36){
    const state=loadCurriculumState();
    const values=Object.values(state.weekly || {}).map(Number).filter(v=>Number.isFinite(v) && v>0);
    const average=values.length ? Math.round(values.reduce((a,b)=>a+b,0)/values.length) : 0;
    const completed=Object.values(state.weekly || {}).filter(v=>Number(v)>=passingScore).length;
    return {
      state,
      completedUnits:Math.min(totalUnits,completed),
      weeklyAverage:average,
      midterm:Number(state.midterm || 0),
      final:Number(state.final || 0),
      portfolio:Boolean(state.portfolio),
      certificationReady:
        average>=passingScore &&
        Number(state.midterm||0)>=passingScore &&
        Number(state.final||0)>=passingScore &&
        Boolean(state.portfolio)
    };
  }

  function nextUnit(totalUnits=36,passingScore=80){
    const state=loadCurriculumState();
    for(let n=1;n<=totalUnits;n++){
      if(Number(state.weekly?.[n] || 0)<passingScore) return n;
    }
    return totalUnits;
  }

  function subscribe(listener){
    if(typeof listener!=="function") throw new TypeError("A listener function is required.");
    const watched=new Set(Object.values(KEYS));
    const handler=event=>{
      if(watched.has(event.key)) listener({
        learner:learnerSummary(),
        curriculum:curriculumSummary()
      },event);
    };
    global.addEventListener("storage",handler);
    return ()=>global.removeEventListener("storage",handler);
  }

  global.KhaemenesKinderContinuity=Object.freeze({
    version:"2.0.0",
    keys:KEYS,
    mentors:MENTORS,
    getProfile:profile,
    getLearnerSummary:learnerSummary,
    getMentor:()=>learnerSummary().mentor,
    guardianAuthorized,
    loadCurriculumState,
    saveCurriculumState,
    clearActiveCurriculumRecord,
    curriculumStateForLearner,
    curriculumSummary,
    nextUnit,
    subscribe
  });
})(window);
