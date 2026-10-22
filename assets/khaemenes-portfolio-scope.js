/* Khaemenes Kinder Garden Portfolio scope guard v1.0.0
 * Never infer data ownership from a child's display name. */
(function attachKhaemenesPortfolioScope(global){
  "use strict";
  const LEGACY_KEY="khaemenes_kindergarten_portfolio_builder_v1";
  const ACTIVE_KEYS=[
    "khaemenes_kindergarten_active_learner_v1",
    "khaemenes_active_learner_v1"
  ];
  function parse(value){
    if(value&&typeof value==="object")return value;
    if(typeof value!=="string"||!value.trim())return null;
    try{return JSON.parse(value)}catch{return null}
  }
  function cleanId(value){
    const id=String(value??"").trim();
    return id&&id.length<=200&&!/[\u0000-\u001f\u007f]/.test(id)?id:null;
  }
  function read(storage,key){
    try{return parse(storage?.getItem(key))}catch{return null}
  }
  function normalizeLearner(value){
    if(!value||typeof value!=="object")return null;
    const learnerId=cleanId(value.learnerId);
    if(!learnerId)return null;
    if(value.stage&&String(value.stage).toLowerCase()!=="kindergarten")return null;
    return {learnerId,nickname:String(value.nickname||value.name||"").slice(0,80),stage:String(value.stage||"kindergarten").toLowerCase()};
  }
  function detectActiveLearner(storage=global.localStorage){
    try{
      const registry=global.KhaemenesFamilyRegistry?.getLearner?.();
      const learner=normalizeLearner(registry);
      if(learner)return learner;
    }catch{}
    try{
      const continuity=global.KhaemenesKinderContinuity?.getProfile?.();
      const learner=normalizeLearner(continuity);
      if(learner)return learner;
    }catch{}
    for(const key of ACTIVE_KEYS){
      const value=read(storage,key);
      const learner=normalizeLearner(value);
      if(learner)return learner;
    }
    const registry=read(storage,"khaemenes_family_registry_v1");
    const candidates=[
      registry?.activeLearner,
      registry?.active,
      registry?.learner,
      registry?.state?.activeLearner,
      registry?.state?.active
    ];
    for(const candidate of candidates){
      const learner=normalizeLearner(candidate);
      if(learner)return learner;
    }
    const activeId=cleanId(registry?.activeLearnerId||registry?.active?.learnerId||registry?.state?.activeLearnerId);
    if(activeId)return {learnerId:activeId,nickname:"",stage:"kindergarten"};
    return null;
  }
  function storageKey(learnerId){
    const id=cleanId(learnerId);
    return id?LEGACY_KEY+"::learner:"+encodeURIComponent(id):LEGACY_KEY+"::unlinked";
  }
  function ownerOf(value){
    const obj=parse(value);
    if(!obj||typeof obj!=="object")return null;
    const candidates=[
      obj.learnerId,
      obj.activeLearnerId,
      obj.learner?.learnerId,
      obj.profile?.learnerId,
      obj.state?.learnerId,
      obj.state?.profile?.learnerId,
      obj.portfolio?.learnerId,
      obj.payload?.learnerId
    ];
    for(const value of candidates){
      const id=cleanId(value);
      if(id)return id;
    }
    return null;
  }
  function assessImport(value,activeLearnerId,{explicitAdultConfirmation=false}={}){
    const active=cleanId(activeLearnerId);
    const owner=ownerOf(value);
    // An unlinked workspace may inspect/import a file without attaching its owner to a child.
    if(!active)return {allowed:true,reason:"unlinked-import",owner,activeLearnerId:null};
    if(owner&&owner!==active)return {allowed:false,reason:"different-learner",owner,activeLearnerId:active};
    if(active&&!owner&&!explicitAdultConfirmation)return {allowed:false,reason:"adult-confirmation-required",owner:null,activeLearnerId:active};
    return {allowed:true,reason:owner?"identity-match":(active?"adult-confirmed-unverified-owner":"unlinked-import"),owner,activeLearnerId:active};
  }
  global.KhaemenesPortfolioScope=Object.freeze({
    version:"1.0.0",
    legacyKey:LEGACY_KEY,
    activeKeys:Object.freeze([...ACTIVE_KEYS]),
    detectActiveLearner,
    storageKey,
    ownerOf,
    assessImport
  });
})(window);
