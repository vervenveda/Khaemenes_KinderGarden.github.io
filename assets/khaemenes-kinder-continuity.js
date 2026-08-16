/*
 * Khaemenes Kinder Garden Continuity Bridge v4.0.0
 * -------------------------------------------------
 * Formal Kinder Garden identity comes from Academy Family Registry.
 * Mentor identity comes from the Academy NAIB mentor-routing contract.
 * Archaemenes is the current Kindergarten mentor.
 * Legacy local profiles remain compatibility/migration data only.
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

  const ARCHAEMENES_FALLBACK=Object.freeze({
    id:"archaemenes",
    name:"Archaemenes",
    title:"Scholar Owl",
    avatar:"🦉",
    colors:Object.freeze(["#5f7fd6","#6bd8e7"]),
    intro:"I am Archaemenes. I can help with clues, questions, stories, practice, and one clear step at a time.",
    presentationMode:"early-scholar-fallback",
    specialistDomain:"learning-mentor",
    principles:Object.freeze([
      "clue-first",
      "age-adaptive",
      "encourage-effort",
      "do-not-award-mastery",
      "bounded-young-learner-interaction"
    ]),
    assignedBy:"NAIB"
  });

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

  function readJSON(key,fallback=null){
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

  function remove(key){
    try{global.localStorage.removeItem(key);return true}catch{return false}
  }

  function activeRegistryLearner(){
    return global.KhaemenesFamilyRegistry?.getLearner?.()||null;
  }

  function legacyProfile(){
    return readJSON(KEYS.legacyProfile,null);
  }

  function profile(){
    const learner=activeRegistryLearner();
    if(!learner)return null;
    if(clean(learner.stage,40).toLowerCase()!=="kindergarten")return null;

    const legacy=legacyProfile();
    const matchingLegacy=legacy?.learnerId===learner.learnerId?legacy:null;

    return Object.freeze({
      learnerId:clean(learner.learnerId,160),
      familyId:clean(learner.familyId,160)||null,
      nickname:clean(learner.nickname||"Learner",60),
      ageBand:clean(learner.ageBand||"5-6",30),
      pathway:"kindergarten",
      stage:"kindergarten",
      interests:Object.freeze(cleanList(learner.interests)),
      pace:clean(matchingLegacy?.pace||"balanced",30),
      mentorId:"archaemenes",
      guardianRelease:learner.guardianRelease||null,
      familyManaged:true
    });
  }

  function mentorAssignmentFor(p=profile()){
    if(!p)return null;
    const naib=global.KhaemenesNAIB||null;
    const assignment=naib?.assignMentor?.({
      stage:"kindergarten",
      ageBand:p.ageBand,
      interests:[...p.interests],
      surface:"khaemenes-kindergarden",
      intent:"learning-mentor"
    })||null;

    if(assignment?.status==="assigned"&&assignment?.mentor?.id==="archaemenes"){
      return assignment;
    }
    return null;
  }

  function mentorFor(p=profile()){
    if(!p)return null;
    const assignment=mentorAssignmentFor(p);
    if(assignment?.mentor){
      return Object.freeze({
        ...assignment.mentor,
        colors:Object.freeze([...(assignment.mentor.colors||ARCHAEMENES_FALLBACK.colors)]),
        principles:Object.freeze([...(assignment.mentor.principles||ARCHAEMENES_FALLBACK.principles)]),
        assignmentId:assignment.assignmentId||null,
        assignmentMode:assignment.assignmentMode||null,
        assignedBy:"NAIB"
      });
    }
    return ARCHAEMENES_FALLBACK;
  }

  function guardianAuthorized(p=profile()){
    const release=p?.guardianRelease;
    return Boolean(release?.accepted&&release?.learnerId===p?.learnerId);
  }

  function learnerSummary(){
    const raw=activeRegistryLearner();
    const p=profile();

    if(!raw){
      return Object.freeze({
        hasProfile:false,hasLinkedLearner:false,stageEligible:false,
        learnerId:null,nickname:null,pathway:null,mentor:null,
        mentorId:null,guardianAuthorized:false
      });
    }

    if(!p){
      return Object.freeze({
        hasProfile:false,hasLinkedLearner:true,stageEligible:false,
        learnerId:clean(raw.learnerId,160)||null,
        nickname:clean(raw.nickname,60)||null,
        pathway:clean(raw.stage,40)||null,
        stage:clean(raw.stage,40)||null,
        mentor:null,mentorId:null,guardianAuthorized:false
      });
    }

    return Object.freeze({
      hasProfile:true,hasLinkedLearner:true,stageEligible:true,
      learnerId:p.learnerId,nickname:p.nickname,ageBand:p.ageBand,
      pathway:"kindergarten",stage:"kindergarten",
      mentorId:"archaemenes",mentor:mentorFor(p),
      guardianAuthorized:guardianAuthorized(p),
      guardianReleaseVersion:p.guardianRelease?.version||null,
      interests:Object.freeze([...p.interests]),pace:p.pace,familyManaged:true
    });
  }

  function normalizeState(value={}){
    const state=value&&typeof value==="object"?value:{};
    return {
      student:clean(state.student||"Kindergarten Scholar",80),
      weekly:state.weekly&&typeof state.weekly==="object"?{...state.weekly}:{},
      midterm:Math.max(0,Math.min(100,Number(state.midterm||0))),
      final:Math.max(0,Math.min(100,Number(state.final||0))),
      portfolio:Boolean(state.portfolio),
      learnerId:clean(state.learnerId,160)||null,
      mentorId:"archaemenes",
      linkedAt:state.linkedAt||null,
      updatedAt:state.updatedAt||null,
      recordVersion:"4.0"
    };
  }

  function allLearnerRecords(){
    const value=readJSON(KEYS.kindergartenByLearner,{});
    return value&&typeof value==="object"?value:{};
  }

  function copyLegacyIntoLearner(id,records){
    if(!id||records[id])return records;
    const legacyRaw=readJSON(KEYS.legacyKindergarten,null);
    if(!legacyRaw)return records;
    const legacy=normalizeState(legacyRaw);
    records[id]={
      ...legacy,
      learnerId:id,
      mentorId:"archaemenes",
      linkedAt:new Date().toISOString(),
      updatedAt:new Date().toISOString(),
      migration:{
        source:KEYS.legacyKindergarten,
        mode:"non-destructive-copy",
        migratedAt:new Date().toISOString()
      }
    };
    writeJSON(KEYS.kindergartenByLearner,records);
    return records;
  }

  function loadCurriculumState(defaultState=null){
    const fallback=normalizeState(defaultState||{});
    const p=profile();
    if(!p?.learnerId)return fallback;

    const records=copyLegacyIntoLearner(p.learnerId,allLearnerRecords());
    const prior=records[p.learnerId];
    const state=prior?normalizeState(prior):{
      ...fallback,
      learnerId:p.learnerId,
      mentorId:"archaemenes",
      linkedAt:new Date().toISOString()
    };

    state.student=p.nickname||state.student;
    state.learnerId=p.learnerId;
    state.mentorId="archaemenes";
    records[p.learnerId]=state;

    writeJSON(KEYS.kindergartenByLearner,records);
    writeJSON(KEYS.activeKindergartenLearner,{
      learnerId:p.learnerId,
      nickname:p.nickname,
      activatedAt:new Date().toISOString()
    });
    writeJSON(KEYS.legacyKindergarten,state);
    return normalizeState(state);
  }

  function saveCurriculumState(value){
    const p=profile();
    if(!p?.learnerId)return normalizeState(value);
    const state=normalizeState(value);
    state.learnerId=p.learnerId;
    state.student=p.nickname||state.student;
    state.mentorId="archaemenes";
    state.updatedAt=new Date().toISOString();
    const records=allLearnerRecords();
    records[p.learnerId]=state;
    writeJSON(KEYS.kindergartenByLearner,records);
    writeJSON(KEYS.legacyKindergarten,state);
    return normalizeState(state);
  }

  function clearActiveCurriculumRecord(){
    const p=profile();
    if(!p?.learnerId)return false;
    const records=allLearnerRecords();
    delete records[p.learnerId];
    writeJSON(KEYS.kindergartenByLearner,records);
    remove(KEYS.legacyKindergarten);
    remove(KEYS.activeKindergartenLearner);
    return true;
  }

  function curriculumSummary(passingScore=80,totalUnits=36){
    const state=loadCurriculumState();
    const values=Object.values(state.weekly||{}).map(Number).filter(v=>Number.isFinite(v)&&v>0);
    const average=values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0;
    const completed=Object.values(state.weekly||{}).filter(v=>Number(v)>=passingScore).length;
    return {
      state,
      completedUnits:Math.min(totalUnits,completed),
      weeklyAverage:average,
      midterm:Number(state.midterm||0),
      final:Number(state.final||0),
      portfolio:Boolean(state.portfolio),
      certificationReady:
        completed>=totalUnits&&
        Number(state.midterm||0)>=passingScore&&
        Number(state.final||0)>=passingScore&&
        Boolean(state.portfolio)
    };
  }

  function nextUnit(totalUnits=36,passingScore=80){
    const state=loadCurriculumState();
    for(let n=1;n<=totalUnits;n++){
      if(Number(state.weekly?.[n]||0)<passingScore)return n;
    }
    return totalUnits;
  }

  function subscribe(listener){
    if(typeof listener!=="function")throw new TypeError("A listener function is required.");
    const handler=event=>{
      if([
        KEYS.kindergartenByLearner,
        KEYS.legacyKindergarten,
        "khaemenes_family_registry_v1",
        "khaemenes_active_learner_v1"
      ].includes(event.key)){
        listener({learner:learnerSummary(),curriculum:curriculumSummary()},event);
      }
    };
    global.addEventListener("storage",handler);
    const familyHandler=()=>listener({learner:learnerSummary(),curriculum:curriculumSummary()},null);
    const mentorHandler=()=>listener({learner:learnerSummary(),curriculum:curriculumSummary()},null);
    global.addEventListener("khaemenes-family-changed",familyHandler);
    global.addEventListener("khaemenes-naib-ready",mentorHandler);
    return ()=>{
      global.removeEventListener("storage",handler);
      global.removeEventListener("khaemenes-family-changed",familyHandler);
      global.removeEventListener("khaemenes-naib-ready",mentorHandler);
    };
  }

  global.KhaemenesKinderContinuity=Object.freeze({
    version:VERSION,
    keys:KEYS,
    mentor:ARCHAEMENES_FALLBACK,
    getProfile:profile,
    getLearnerSummary:learnerSummary,
    getMentor:()=>learnerSummary().mentor,
    getMentorAssignment:()=>mentorAssignmentFor(profile()),
    guardianAuthorized,
    loadCurriculumState,
    saveCurriculumState,
    clearActiveCurriculumRecord,
    curriculumSummary,
    nextUnit,
    subscribe
  });
})(window);
