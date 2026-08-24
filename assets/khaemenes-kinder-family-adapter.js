/*
 * Khaemenes Kinder Garden · Family Adapter v3.0.0
 * ------------------------------------------------
 * Family Registry is authoritative for formal Kinder Garden access.
 * Archaemenes is the single Academy Mentor. Older Kinder mentor names are
 * retained only as communication-style / legacy presentation preferences.
 * This bridge NEVER creates a family and NEVER auto-upgrades a child.
 */
(function attachKinderFamilyAdapter(global){
  "use strict";

  const VERSION="3.0.0";
  const ARCHAEMENES_ID="archaemenes";
  const MENTOR_URL="https://vervenveda.com/Khaemenes_Academy.github.io/mentor/";
  const FAMILY_URL="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  const LEGACY_MENTOR_STYLE=Object.freeze({pip:"playful",miri:"curious",nova:"imaginative",sage:"steady"});
  const VALID_STYLES=new Set(["playful","curious","imaginative","steady"]);

  function writeJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  function readJSON(key,fallback=null){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function normalizeStyle(value){const style=String(value||"").toLowerCase();return VALID_STYLES.has(style)?style:"playful"}

  function styleFor(learner,legacy={}){
    const identity=learner?.mentorIdentity&&typeof learner.mentorIdentity==="object"?learner.mentorIdentity:{};
    return normalizeStyle(
      identity.communicationStyle ||
      identity.baseStyle ||
      LEGACY_MENTOR_STYLE[String(learner?.mentorId||"").toLowerCase()] ||
      legacy.personality ||
      LEGACY_MENTOR_STYLE[String(legacy.mentorId||"").toLowerCase()] ||
      "playful"
    );
  }

  function canonicalMentorIdentity(learner,legacy={}){
    const prior=learner?.mentorIdentity&&typeof learner.mentorIdentity==="object"?learner.mentorIdentity:{};
    const baseStyle=styleFor(learner,legacy);
    const next={
      ...prior,
      mode:"archaemenes",
      mentorId:ARCHAEMENES_ID,
      expression:"wise-owl",
      baseStyle,
      communicationStyle:baseStyle
    };

    const priorId=String(learner?.mentorId||legacy?.mentorId||"").trim();
    if(priorId&&priorId.toLowerCase()!==ARCHAEMENES_ID)next.legacyMentorId=priorId;

    if(prior.mode==="custom"){
      next.presentationPreference={
        ...(next.presentationPreference&&typeof next.presentationPreference==="object"?next.presentationPreference:{}),
        ...(prior.name?{legacyCustomName:String(prior.name).slice(0,40)}:{}),
        ...(prior.avatar?{legacyAvatar:String(prior.avatar).slice(0,12)}:{}),
        ...(Array.isArray(prior.colors)&&prior.colors.length===2?{legacyColors:[...prior.colors]}:{})
      };
    }
    return next;
  }

  function migrateActiveKindergartenMentor(){
    const family=global.KhaemenesFamilyRegistry;
    const learner=family?.getLearner?.();
    if(!family||!learner||String(learner.stage||"").toLowerCase()!=="kindergarten")return learner||null;
    if(typeof family.load!=="function"||typeof family.save!=="function")return learner;

    const registry=family.load();
    const record=registry?.learners?.[learner.learnerId];
    if(!record)return learner;

    const legacy=readJSON("khaemenes_preschool_profile_v1",{})||{};
    const nextIdentity=canonicalMentorIdentity(record,legacy);
    const currentIdentity=record.mentorIdentity&&typeof record.mentorIdentity==="object"?record.mentorIdentity:{};
    const changed=record.mentorId!==ARCHAEMENES_ID ||
      currentIdentity.mode!=="archaemenes" ||
      currentIdentity.expression!=="wise-owl" ||
      currentIdentity.communicationStyle!==nextIdentity.communicationStyle;

    if(changed){
      record.mentorId=ARCHAEMENES_ID;
      record.mentorIdentity=nextIdentity;
      record.updatedAt=new Date().toISOString();
      family.save(registry);
    }
    return family.getLearner?.(learner.learnerId)||record;
  }

  function syncCompatibility(learner){
    if(!learner||String(learner.stage||"").toLowerCase()!=="kindergarten")return false;

    const legacy=readJSON("khaemenes_preschool_profile_v1",{})||{};
    const style=styleFor(learner,legacy);
    const mentorIdentity=canonicalMentorIdentity(learner,legacy);
    const merged={
      ...legacy,
      learnerId:learner.learnerId,
      nickname:learner.nickname||legacy.nickname||"Learner",
      pathway:"kindergarten",
      ageBand:learner.ageBand||legacy.ageBand||"5-6",
      interests:Array.isArray(learner.interests)?learner.interests:(legacy.interests||[]),
      personality:style,
      mentorId:ARCHAEMENES_ID,
      mentorIdentity,
      guardianRelease:learner.guardianRelease||legacy.guardianRelease||null,
      familyManaged:true,
      updatedAt:new Date().toISOString()
    };
    writeJSON("khaemenes_preschool_profile_v1",merged);
    return true;
  }

  function mentorDestination(){
    const family=global.KhaemenesFamilyRegistry;
    if(!family)return FAMILY_URL;
    const activeFamily=family.getFamily?.()||null;
    const adult=family.getAdult?.()||null;
    const learner=family.getLearner?.()||null;
    return activeFamily&&(adult||learner)?MENTOR_URL:FAMILY_URL;
  }

  function navigateMentor(){
    const url=mentorDestination();
    try{global.location.assign(url)}catch{global.location.href=url}
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

  function rewriteMentorLinks(){
    if(!global.document)return;
    const selectors=[
      'a[href="#mentor"]',
      'a[href="../#mentor"]',
      'a[href="./#mentor"]',
      'a[href="https://vervenveda.com/Khaemenes_Preschool.github.io/mentor/"]',
      'a[href="https://vervenveda.com/Khaemenes_Academy.github.io/mentor/"]'
    ].join(",");
    global.document.querySelectorAll(selectors).forEach(link=>{
      link.href=MENTOR_URL;
      link.dataset.khaemenesMentor="archaemenes";
      const text=(link.textContent||"").trim();
      if(/set up kinder learner.*mentor/i.test(text)||/open preschool mentor/i.test(text))link.textContent="Open Archaemenes Mentor";
    });
  }

  function retireLegacySetupOverlay(){
    const overlay=global.document?.getElementById("kinderSetupOverlay");
    if(overlay){
      overlay.hidden=true;
      overlay.setAttribute("aria-hidden","true");
      if("inert" in overlay)overlay.inert=true;
    }
    const save=global.document?.getElementById("saveKinderSetup");
    if(save){save.disabled=true;save.setAttribute("aria-disabled","true")}
  }

  function clarifyMentorCopy(){
    if(!global.document)return;
    const section=global.document.getElementById("mentor");
    if(section){
      const eyebrow=section.querySelector(".section-heading .eyebrow");
      const heading=section.querySelector(".section-heading h2");
      const intro=section.querySelector(".section-heading p");
      if(eyebrow)eyebrow.textContent="Archaemenes · Wise Owl";
      if(heading)heading.textContent="One Academy Mentor, growing with the learner.";
      if(intro)intro.textContent="Kinder Garden uses Archaemenes, the single Khaemenes Academy Mentor. At this stage he appears as the Wise Owl: bounded, child-safe, family-linked, and focused on clues, encouragement, learning navigation, and healthy breaks.";

      section.querySelectorAll(".mentor-principles li").forEach(item=>{
        const text=item.textContent||"";
        if(/Mentor Core:/i.test(text))item.innerHTML="<strong>Mentor Core:</strong> Archaemenes is the single Academy Mentor. Older Pip, Miri, Nova, Sage, or custom choices are retained only as legacy communication-style preferences; they are not separate mentor identities.";
        if(/NAIB academic guidance:/i.test(text))item.innerHTML="<strong>NAIB routing:</strong> NAIB helps identify academic position, matched practice, and the appropriate next doorway. NAIB does not become a second Mentor and does not replace Archaemenes, the parent, guardian, educator, or course authority.";
      });
    }

    const name=global.document.getElementById("kinderMentorName");
    if(name&&/Your Kinder Garden Mentor|Meet Your Kinder Garden Mentor/i.test(name.textContent||""))name.textContent="Archaemenes · Wise Owl";

    const heroLead=global.document.querySelector(".hero .lead");
    if(heroLead&&/personalized Khaemenes Mentor/i.test(heroLead.textContent||"")){
      heroLead.textContent=(heroLead.textContent||"").replace(/a personalized Khaemenes Mentor/gi,"Archaemenes, the Academy Mentor");
    }
  }

  function canonicalizeMentorSurface(){
    rewriteMentorLinks();
    retireLegacySetupOverlay();
    clarifyMentorCopy();
  }

  function refresh(){
    const family=global.KhaemenesFamilyRegistry;
    canonicalizeMentorSurface();
    if(!family){
      global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{detail:{connected:false,reason:"registry-unavailable",mentorAuthority:"academy-archaemenes"}}));
      return;
    }

    let learner=family.getLearner?.();
    if(!learner){
      global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{detail:{connected:true,learnerId:null,reason:"no-active-learner",mentorAuthority:"academy-archaemenes"}}));
      return;
    }

    const stage=String(learner.stage||"").toLowerCase();
    if(stage!=="kindergarten"){
      global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{
        detail:{connected:true,learnerId:learner.learnerId,stage,eligible:false,reason:"stage-mismatch",mentorAuthority:"academy-archaemenes"}
      }));
      return;
    }

    learner=migrateActiveKindergartenMentor()||learner;
    syncCompatibility(learner);
    global.dispatchEvent(new CustomEvent("khaemenes-kinder-family-ready",{
      detail:{connected:true,learnerId:learner.learnerId,familyId:learner.familyId,stage,eligible:true,mentorId:ARCHAEMENES_ID,mentorAuthority:"academy-archaemenes",mentorExpression:"wise-owl"}
    }));
  }

  function wait(attempt=0){
    if(global.KhaemenesFamilyRegistry){refresh();return}
    if(attempt<80)setTimeout(()=>wait(attempt+1),50);
    else refresh();
  }

  global.document?.addEventListener("click",event=>{
    const origin=event.target;
    if(!origin?.closest)return;
    const mentorLink=origin.closest("[data-khaemenes-mentor]");
    const prompt=origin.closest("[data-kinder-mentor]");
    if(prompt&&prompt.dataset.kinderMentor!=="read"){
      event.preventDefault();
      event.stopImmediatePropagation();
      navigateMentor();
      return;
    }
    if(mentorLink){
      event.preventDefault();
      event.stopImmediatePropagation();
      navigateMentor();
    }
  },true);

  global.addEventListener("khaemenes-family-changed",refresh);
  global.addEventListener("storage",event=>{
    if(["khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(event.key))refresh();
  });

  global.KhaemenesKinderFamilyAdapter=Object.freeze({
    version:VERSION,
    mentorAuthority:"academy-archaemenes",
    mentorUrl:MENTOR_URL,
    familyUrl:FAMILY_URL,
    mentorDestination,
    refresh,
    syncCompatibility,
    migrateActiveKindergartenMentor,
    canonicalizeMentorSurface,
    ensureBetaProgramLink
  });

  if(global.document?.readyState==="loading"){
    global.document.addEventListener("DOMContentLoaded",()=>{ensureBetaProgramLink();canonicalizeMentorSurface()},{once:true});
  }else{
    ensureBetaProgramLink();
    canonicalizeMentorSurface();
  }
  wait();
})(window);
