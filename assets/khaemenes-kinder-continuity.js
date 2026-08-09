/*
 * Khaemenes Kinder Garden Continuity Bridge v3.0.0
 * -------------------------------------------------
 * Formal Kinder Garden identity comes from Academy Family Registry.
 * Legacy local profiles are compatibility/migration data, not a second account.
 */
(function attachKinderContinuity(global){
  "use strict";

  const KEYS=Object.freeze({
    legacyProfile:"khaemenes_preschool_profile_v1",
    legacyKindergarten:"khaemenes_kindergarten_36_aplus_v1",
    kindergartenByLearner:"khaemenes_kindergarten_records_by_learner_v1",
    activeKindergartenLearner:"khaemenes_kindergarten_active_learner_v1"
  });

  const MENTORS=Object.freeze({
    playful:{id:"pip",name:"Pip",avatar:"🌞",colors:["#ef6a66","#f6bf3a"],traits:["playful","social","encouraging"]},
    curious:{id:"miri",name:"Miri",avatar:"🦉",colors:["#2398d5","#42c7dc"],traits:["quiet","curious","patient"]},
    imaginative:{id:"nova",name:"Nova",avatar:"🚀",colors:["#7254d8","#e95ca8"],traits:["imaginative","expressive","adventurous"]},
    steady:{id:"sage",name:"Sage",avatar:"🌿",colors:["#23a67c","#8ccf54"],traits:["steady","patient","determined"]}
  });

  function readJSON(key,fallback=null){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  function remove(key){try{localStorage.removeItem(key);return true}catch{return false}}

  function activeRegistryLearner(){
    const learner=global.KhaemenesFamilyRegistry?.getLearner?.();
    return learner||null;
  }

  function legacyProfile(){return readJSON(KEYS.legacyProfile,null)}

  function profile(){
    const learner=activeRegistryLearner();
    if(!learner)return null;
    if(String(learner.stage||"").toLowerCase()!=="kindergarten")return null;

    const legacy=legacyProfile();
    const style=learner?.mentorIdentity?.baseStyle || (legacy?.learnerId===learner.learnerId?legacy?.personality:null) || "playful";
    return {
      learnerId:learner.learnerId,
      familyId:learner.familyId||null,
      nickname:learner.nickname||"Learner",
      ageBand:learner.ageBand||"5-6",
      pathway:"kindergarten",
      stage:"kindergarten",
      interests:Array.isArray(learner.interests)?[...learner.interests]:[],
      personality:style,
      pace:legacy?.learnerId===learner.learnerId?(legacy?.pace||"balanced"):"balanced",
      mentorId:learner.mentorId||null,
      mentorIdentity:learner.mentorIdentity||{mode:"embedded",baseStyle:style},
      guardianRelease:learner.guardianRelease||null,
      familyManaged:true
    };
  }

  function embeddedMentorFor(p){
    const base=MENTORS[p?.personality] || Object.values(MENTORS).find(x=>x.id===p?.mentorId) || MENTORS.playful;
    const identity=p?.mentorIdentity&&typeof p.mentorIdentity==="object"?p.mentorIdentity:{mode:"embedded",baseStyle:p?.personality||"playful"};
    if(identity.mode==="custom"){
      return {
        ...base,
        name:String(identity.name||"My Mentor").slice(0,18),
        avatar:identity.avatar||"🦊",
        colors:Array.isArray(identity.colors)&&identity.colors.length===2?[...identity.colors]:[...base.colors],
        baseName:base.name,custom:true
      };
    }
    return {...base,colors:[...base.colors],baseName:base.name,custom:false};
  }

  function guardianAuthorized(p=profile()){
    const r=p?.guardianRelease;
    return Boolean(r?.accepted && r?.learnerId===p?.learnerId);
  }

  function learnerSummary(){
    const raw=activeRegistryLearner();
    const p=profile();
    if(!raw){
      return {hasProfile:false,hasLinkedLearner:false,stageEligible:false,learnerId:null,nickname:null,pathway:null,mentor:null,guardianAuthorized:false};
    }
    if(!p){
      return {
        hasProfile:false,hasLinkedLearner:true,stageEligible:false,
        learnerId:raw.learnerId||null,nickname:raw.nickname||null,pathway:raw.stage||null,
        mentor:null,guardianAuthorized:false,stage:raw.stage||null
      };
    }
    return {
      hasProfile:true,hasLinkedLearner:true,stageEligible:true,
      learnerId:p.learnerId,nickname:p.nickname,ageBand:p.ageBand,pathway:"kindergarten",stage:"kindergarten",
      mentorId:p.mentorId,mentor:embeddedMentorFor(p),guardianAuthorized:guardianAuthorized(p),
      guardianReleaseVersion:p.guardianRelease?.version||null,
      interests:[...p.interests],pace:p.pace,familyManaged:true
    };
  }

  function normalizeState(value={}){
    const state=value&&typeof value==="object"?value:{};
    return {
      student:String(state.student||"Kindergarten Scholar").slice(0,80),
      weekly:state.weekly&&typeof state.weekly==="object"?{...state.weekly}:{},
      midterm:Math.max(0,Math.min(100,Number(state.midterm||0))),
      final:Math.max(0,Math.min(100,Number(state.final||0))),
      portfolio:Boolean(state.portfolio),
      learnerId:state.learnerId||null,
      mentorId:state.mentorId||null,
      linkedAt:state.linkedAt||null,
      updatedAt:state.updatedAt||null,
      recordVersion:"3.0"
    };
  }

  function allLearnerRecords(){const value=readJSON(KEYS.kindergartenByLearner,{});return value&&typeof value==="object"?value:{}}

  function copyLegacyIntoLearner(id,records){
    if(!id||records[id])return records;
    const legacyRaw=readJSON(KEYS.legacyKindergarten,null);
    if(!legacyRaw)return records;
    const legacy=normalizeState(legacyRaw);
    records[id]={...legacy,learnerId:id,mentorId:profile()?.mentorId||legacy.mentorId||null,linkedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),migration:{source:KEYS.legacyKindergarten,mode:"non-destructive-copy",migratedAt:new Date().toISOString()}};
    writeJSON(KEYS.kindergartenByLearner,records);
    return records;
  }

  function loadCurriculumState(defaultState=null){
    const fallback=normalizeState(defaultState||{});
    const p=profile();
    if(!p?.learnerId)return fallback;

    let records=copyLegacyIntoLearner(p.learnerId,allLearnerRecords());
    const prior=records[p.learnerId];
    const state=prior?normalizeState(prior):{...fallback,learnerId:p.learnerId,mentorId:p.mentorId||null,linkedAt:new Date().toISOString()};
    state.student=p.nickname||state.student;
    state.learnerId=p.learnerId;
    state.mentorId=p.mentorId||state.mentorId||null;
    records[p.learnerId]=state;
    writeJSON(KEYS.kindergartenByLearner,records);
    writeJSON(KEYS.activeKindergartenLearner,{learnerId:p.learnerId,nickname:p.nickname,activatedAt:new Date().toISOString()});
    writeJSON(KEYS.legacyKindergarten,state);
    return normalizeState(state);
  }

  function saveCurriculumState(value){
    const p=profile();
    if(!p?.learnerId)return normalizeState(value);
    const state=normalizeState(value);
    state.learnerId=p.learnerId;state.student=p.nickname||state.student;state.mentorId=p.mentorId||state.mentorId||null;state.updatedAt=new Date().toISOString();
    const records=allLearnerRecords();records[p.learnerId]=state;
    writeJSON(KEYS.kindergartenByLearner,records);writeJSON(KEYS.legacyKindergarten,state);
    return normalizeState(state);
  }

  function clearActiveCurriculumRecord(){
    const p=profile();if(!p?.learnerId)return false;
    const records=allLearnerRecords();delete records[p.learnerId];writeJSON(KEYS.kindergartenByLearner,records);
    remove(KEYS.legacyKindergarten);remove(KEYS.activeKindergartenLearner);return true;
  }

  function curriculumSummary(passingScore=80,totalUnits=36){
    const state=loadCurriculumState();
    const values=Object.values(state.weekly||{}).map(Number).filter(v=>Number.isFinite(v)&&v>0);
    const average=values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0;
    const completed=Object.values(state.weekly||{}).filter(v=>Number(v)>=passingScore).length;
    return {
      state,completedUnits:Math.min(totalUnits,completed),weeklyAverage:average,
      midterm:Number(state.midterm||0),final:Number(state.final||0),portfolio:Boolean(state.portfolio),
      certificationReady:completed>=totalUnits&&Number(state.midterm||0)>=passingScore&&Number(state.final||0)>=passingScore&&Boolean(state.portfolio)
    };
  }

  function nextUnit(totalUnits=36,passingScore=80){
    const state=loadCurriculumState();
    for(let n=1;n<=totalUnits;n++)if(Number(state.weekly?.[n]||0)<passingScore)return n;
    return totalUnits;
  }

  function subscribe(listener){
    if(typeof listener!=="function")throw new TypeError("A listener function is required.");
    const handler=event=>{
      if([KEYS.kindergartenByLearner,KEYS.legacyKindergarten,"khaemenes_family_registry_v1","khaemenes_active_learner_v1"].includes(event.key)){
        listener({learner:learnerSummary(),curriculum:curriculumSummary()},event);
      }
    };
    global.addEventListener("storage",handler);
    const familyHandler=()=>listener({learner:learnerSummary(),curriculum:curriculumSummary()},null);
    global.addEventListener("khaemenes-family-changed",familyHandler);
    return ()=>{global.removeEventListener("storage",handler);global.removeEventListener("khaemenes-family-changed",familyHandler)};
  }

  global.KhaemenesKinderContinuity=Object.freeze({
    version:"3.0.0",keys:KEYS,mentors:MENTORS,
    getProfile:profile,getLearnerSummary:learnerSummary,getMentor:()=>learnerSummary().mentor,
    guardianAuthorized,loadCurriculumState,saveCurriculumState,clearActiveCurriculumRecord,
    curriculumSummary,nextUnit,subscribe
  });
})(window);
