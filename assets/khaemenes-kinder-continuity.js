/*
 * Khaemenes Kinder Garden Continuity Bridge v4.0.0
 * -------------------------------------------------
 * Formal Kinder Garden identity comes from the Academy Family Registry.
 * Archaemenes is the single Academy Mentor. Older Pip / Miri / Nova / Sage
 * choices are preserved only as communication-style preferences.
 * Legacy local profiles remain compatibility/migration data, not a second account.
 */
(function attachKinderContinuity(global){
  "use strict";

  const VERSION="4.0.0";
  const KEYS=Object.freeze({
    legacyProfile:"khaemenes_preschool_profile_v1",
    legacyKindergarten:"khaemenes_kindergarten_36_aplus_v1",
    kindergartenByLearner:"khaemenes_kindergarten_records_by_learner_v1",
    activeKindergartenLearner:"khaemenes_kindergarten_active_learner_v1"
  });

  const ARCHAEMENES=Object.freeze({
    id:"archaemenes",
    name:"Archaemenes",
    avatar:"🦉",
    expression:"Wise Owl",
    title:"Scholar and Educational Mentor of Khaemenes Academy"
  });

  const COMMUNICATION_STYLES=Object.freeze({
    playful:Object.freeze({legacyMentorId:"pip",label:"Playful and social",colors:["#ef6a66","#f6bf3a"],traits:["playful","social","encouraging"]}),
    curious:Object.freeze({legacyMentorId:"miri",label:"Quiet and curious",colors:["#2398d5","#42c7dc"],traits:["quiet","curious","patient"]}),
    imaginative:Object.freeze({legacyMentorId:"nova",label:"Imaginative and expressive",colors:["#7254d8","#e95ca8"],traits:["imaginative","expressive","adventurous"]}),
    steady:Object.freeze({legacyMentorId:"sage",label:"Steady and determined",colors:["#23a67c","#8ccf54"],traits:["steady","patient","determined"]})
  });

  function readJSON(key,fallback=null){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  function remove(key){try{localStorage.removeItem(key);return true}catch{return false}}

  function activeRegistryLearner(){return global.KhaemenesFamilyRegistry?.getLearner?.()||null}
  function legacyProfile(){return readJSON(KEYS.legacyProfile,null)}

  function styleFromMentorId(mentorId){
    const id=String(mentorId||"").toLowerCase();
    return Object.entries(COMMUNICATION_STYLES).find(([,style])=>style.legacyMentorId===id)?.[0]||null;
  }

  function normalizeStyle(value){
    const style=String(value||"").toLowerCase();
    return Object.prototype.hasOwnProperty.call(COMMUNICATION_STYLES,style)?style:"playful";
  }

  function canonicalMentorIdentity({style="playful",priorIdentity=null,priorMentorId=null}={}){
    const baseStyle=normalizeStyle(style);
    const prior=priorIdentity&&typeof priorIdentity==="object"?priorIdentity:{};
    const presentationPreference={};

    if(prior.mode==="custom"){
      if(prior.name)presentationPreference.legacyCustomName=String(prior.name).slice(0,40);
      if(prior.avatar)presentationPreference.legacyAvatar=String(prior.avatar).slice(0,12);
      if(Array.isArray(prior.colors)&&prior.colors.length===2)presentationPreference.legacyColors=[...prior.colors];
    }

    const legacyId=priorMentorId&&String(priorMentorId).toLowerCase()!==ARCHAEMENES.id?String(priorMentorId):null;
    return {
      ...prior,
      mode:"archaemenes",
      mentorId:ARCHAEMENES.id,
      expression:"wise-owl",
      baseStyle,
      communicationStyle:baseStyle,
      ...(Object.keys(presentationPreference).length?{presentationPreference}:{}),
      ...(legacyId?{legacyMentorId:legacyId}:{})
    };
  }

  function profile(){
    const learner=activeRegistryLearner();
    if(!learner)return null;
    if(String(learner.stage||"").toLowerCase()!=="kindergarten")return null;

    const legacy=legacyProfile();
    const sameLegacy=legacy?.learnerId===learner.learnerId?legacy:null;
    const priorIdentity=learner.mentorIdentity&&typeof learner.mentorIdentity==="object"?learner.mentorIdentity:null;
    const style=normalizeStyle(
      priorIdentity?.communicationStyle ||
      priorIdentity?.baseStyle ||
      styleFromMentorId(learner.mentorId) ||
      sameLegacy?.personality ||
      styleFromMentorId(sameLegacy?.mentorId) ||
      "playful"
    );
    const mentorIdentity=canonicalMentorIdentity({style,priorIdentity,priorMentorId:learner.mentorId||sameLegacy?.mentorId});

    return {
      learnerId:learner.learnerId,
      familyId:learner.familyId||null,
      nickname:learner.nickname||"Learner",
      ageBand:learner.ageBand||"5-6",
      pathway:"kindergarten",
      stage:"kindergarten",
      interests:Array.isArray(learner.interests)?[...learner.interests]:[],
      personality:style,
      pace:sameLegacy?.pace||"balanced",
      mentorId:ARCHAEMENES.id,
      mentorIdentity,
      guardianRelease:learner.guardianRelease||null,
      familyManaged:true
    };
  }

  function archaemenesFor(p){
    const styleKey=normalizeStyle(p?.mentorIdentity?.communicationStyle||p?.mentorIdentity?.baseStyle||p?.personality);
    const style=COMMUNICATION_STYLES[styleKey];
    return {
      id:ARCHAEMENES.id,
      name:ARCHAEMENES.name,
      avatar:ARCHAEMENES.avatar,
      expression:ARCHAEMENES.expression,
      title:ARCHAEMENES.title,
      colors:[...style.colors],
      traits:[...style.traits],
      communicationStyle:styleKey,
      communicationStyleLabel:style.label,
      baseName:ARCHAEMENES.name,
      custom:false,
      singleAcademyMentor:true
    };
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
      mentorId:ARCHAEMENES.id,mentor:archaemenesFor(p),guardianAuthorized:guardianAuthorized(p),
      guardianReleaseVersion:p.guardianRelease?.version||null,
      interests:[...p.interests],pace:p.pace,familyManaged:true,
      mentorAuthority:"academy-archaemenes",
      mentorExpression:"wise-owl"
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
      mentorId:ARCHAEMENES.id,
      linkedAt:state.linkedAt||null,
      updatedAt:state.updatedAt||null,
      recordVersion:"4.0"
    };
  }

  function allLearnerRecords(){const value=readJSON(KEYS.kindergartenByLearner,{});return value&&typeof value==="object"?value:{}}

  function copyLegacyIntoLearner(id,records){
    if(!id||records[id])return records;
    const legacyRaw=readJSON(KEYS.legacyKindergarten,null);
    if(!legacyRaw)return records;
    const legacy=normalizeState(legacyRaw);
    records[id]={...legacy,learnerId:id,mentorId:ARCHAEMENES.id,linkedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),migration:{source:KEYS.legacyKindergarten,mode:"non-destructive-copy",migratedAt:new Date().toISOString()}};
    writeJSON(KEYS.kindergartenByLearner,records);
    return records;
  }

  function loadCurriculumState(defaultState=null){
    const fallback=normalizeState(defaultState||{});
    const p=profile();
    if(!p?.learnerId)return fallback;

    const records=copyLegacyIntoLearner(p.learnerId,allLearnerRecords());
    const prior=records[p.learnerId];
    const state=prior?normalizeState(prior):{...fallback,learnerId:p.learnerId,mentorId:ARCHAEMENES.id,linkedAt:new Date().toISOString()};
    state.student=p.nickname||state.student;
    state.learnerId=p.learnerId;
    state.mentorId=ARCHAEMENES.id;
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
    state.learnerId=p.learnerId;
    state.student=p.nickname||state.student;
    state.mentorId=ARCHAEMENES.id;
    state.updatedAt=new Date().toISOString();
    const records=allLearnerRecords();
    records[p.learnerId]=state;
    writeJSON(KEYS.kindergartenByLearner,records);
    writeJSON(KEYS.legacyKindergarten,state);
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
    version:VERSION,
    keys:KEYS,
    mentor:ARCHAEMENES,
    mentors:Object.freeze({archaemenes:ARCHAEMENES}),
    communicationStyles:COMMUNICATION_STYLES,
    getProfile:profile,
    getLearnerSummary:learnerSummary,
    getMentor:()=>learnerSummary().mentor,
    guardianAuthorized,
    loadCurriculumState,
    saveCurriculumState,
    clearActiveCurriculumRecord,
    curriculumSummary,
    nextUnit,
    subscribe
  });
})(window);
