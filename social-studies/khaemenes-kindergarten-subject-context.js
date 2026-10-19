(function attachKhaemenesKindergartenSubjectContext(global){
"use strict";
const VERSION="1.0.0";
function registry(){return global.KhaemenesFamilyRegistry||null}
function learner(){return registry()?.getLearner?.()||null}
function ng(v){return registry()?.normalizeGrade?.(v)||String(v||"").trim().toLowerCase()}
function ns(v){return registry()?.normalizeStage?.(v)||String(v||"").trim().toLowerCase()}
function status(){
  const l=learner();
  if(!l)return Object.freeze({version:VERSION,status:"no-active-learner",placementMatch:false,learner:null});
  const ok=ng(l.grade)==="k"&&ns(l.stage)==="kindergarten";
  return Object.freeze({version:VERSION,status:ok?"ready":"placement-mismatch",placementMatch:ok,learner:Object.freeze({learnerId:l.learnerId,nickname:l.nickname,grade:l.grade||null,stage:l.stage||null}),authority:Object.freeze({changesPlacement:false,changesIdentity:false,awardsMastery:false})});
}
function scopedKey(){const s=status();return s.status==="ready"?`khaemenes.course:${s.learner.learnerId}:kindergarten-social-studies`:null}
function publish(){const s=status();global.dispatchEvent(new CustomEvent("khaemenes-kindergarten-social-studies-context",{detail:s}));return s}
global.KhaemenesKindergartenSubjectContext=Object.freeze({version:VERSION,status,scopedKey,publish});
})(window);