/*
 * Khaemenes Kinder Garden · Curriculum Companion Map v1.0.0
 * ----------------------------------------------------------
 * Curriculum-first bridge between:
 *   - the 36 Kinder Garden curriculum units,
 *   - Kinder Garden's own local learning applications, and
 *   - age-appropriate Crechè mentor activities.
 *
 * This file performs no network requests and stores no learner data.
 * Consumers may pass the already-loaded Crechè catalog into forUnit().
 */
(function attachKinderCompanions(global){
  "use strict";

  const KINDER_APPS = Object.freeze([
    {id:"abc-curriculum",title:"ABC Curriculum",icon:"🔤",group:"literacy",path:"apps/ABC_curriculum_index.html",desc:"Letters, sounds, print awareness, and early reading."},
    {id:"spelling-soup",title:"ABC Spelling Soup",icon:"🥣",group:"literacy",path:"apps/ABC_spelling_soup_index.html",desc:"Play with letters, sounds, and beginning spelling."},
    {id:"abc-story",title:"ABC Story",icon:"📖",group:"literacy",path:"apps/ABC_story_index.html",desc:"Storytelling, listening, sequence, and letter recognition."},
    {id:"phonic-garden",title:"Phonic Awareness Garden",icon:"👂",group:"literacy",path:"apps/kinder_garden_phonic_awareness_index.html",desc:"Hear, compare, and practice sounds inside words."},
    {id:"spelling-safari",title:"Spelling Safari",icon:"🦒",group:"literacy",path:"apps/Spelling_safari_index.html",desc:"Playful spelling and word-recognition practice."},
    {id:"math-curriculum",title:"Math Curriculum",icon:"🔢",group:"math",path:"apps/Math_curriculum_index.html",desc:"Structured early mathematics and number reasoning."},
    {id:"kinder-math",title:"Kinder Math",icon:"🧮",group:"math",path:"apps/Math_kinder_index.html",desc:"Kindergarten-sized number practice and problem solving."},
    {id:"numbers-1-12",title:"Numbers 1–12",icon:"1️⃣",group:"math",path:"apps/Numbers_1-12_index.html",desc:"Counting and number recognition from one through twelve."},
    {id:"numbers-quiz",title:"Numbers & Quiz",icon:"✅",group:"math",path:"apps/Numbers_&_quiz_index.html",desc:"Quick number practice and check-for-understanding."},
    {id:"math-cloud",title:"Kindergarten Math Cloud",icon:"☁️",group:"math",path:"apps/kindergarten_math_cloud_index.html",desc:"Colorful interactive kindergarten mathematics practice."},
    {id:"math-garden",title:"Math Garden",icon:"🌼",group:"math",path:"apps/math-garden_index.html",desc:"Early mathematics inside a garden-themed activity."},
    {id:"sink-float",title:"Sink or Float",icon:"🛶",group:"science",path:"apps/sink-or-float_index.html",desc:"Predict, observe, and explore material properties."},
    {id:"weather-compass",title:"Weather Compass",icon:"🧭",group:"science",path:"apps/Weather_compass_index.html",desc:"Observe weather and build Earth-science vocabulary."},
    {id:"weather-planetarium",title:"Weather Planetarium",icon:"🪐",group:"science",path:"apps/Weather_planetarium_index.html",desc:"Explore sky, weather, space, and observation."},
    {id:"weather-wizard",title:"Weather Wizard",icon:"🪄",group:"science",path:"apps/Weather_wizard_index.html",desc:"Playful weather recognition and science practice."},
    {id:"weather-match",title:"Weather Match",icon:"🌦️",group:"science",path:"apps/weather-match_index.html",desc:"Match weather ideas, symbols, and conditions."},
    {id:"history-curriculum",title:"History Curriculum",icon:"🏺",group:"community",path:"apps/History_curriculum_index.html",desc:"Early history, community, culture, sequence, and belonging."},
    {id:"pe-curriculum",title:"PE Curriculum",icon:"🦘",group:"movement",path:"apps/PE_curriculum_index.html",desc:"Movement, balance, coordination, and active learning."},
    {id:"breath-calm",title:"Breath & Calm",icon:"🌬️",group:"wellness",path:"apps/Breath_index.html",desc:"Breathing, regulation, and gentle focus."},
    {id:"breathing-bubble",title:"Breathing Bubble",icon:"🫧",group:"wellness",path:"apps/breathing-bubble_index.html",desc:"A simple visual breathing reset."}
  ]);

  const MAP = Object.freeze({
    1:{kinder:["breath-calm","abc-story"],creche:["feelings","life"],reason:"Belonging, routines, names, and a calm start."},
    2:{kinder:["abc-curriculum","phonic-garden"],creche:["letters","words"],reason:"Letters, names, sounds, and stories."},
    3:{kinder:["breath-calm","abc-story"],creche:["feelings","words"],reason:"Feelings, friendship language, and personal voice."},
    4:{kinder:["sink-float","weather-compass"],creche:["wonder","life"],reason:"Observe carefully with the senses."},
    5:{kinder:["weather-compass","weather-match"],creche:["wonder"],reason:"Seasons, trees, leaves, and patterns in nature."},
    6:{kinder:["weather-wizard","weather-compass"],creche:["wonder"],reason:"Weather, sunlight, clouds, and the sky."},
    7:{kinder:["math-garden","numbers-1-12"],creche:["numbers","art"],reason:"Shapes, colors, spatial language, and design."},
    8:{kinder:["pe-curriculum","math-garden"],creche:["music","movement","numbers"],reason:"Patterns through rhythm, counting, and movement."},
    9:{kinder:["history-curriculum","abc-story"],creche:["life","words"],reason:"Families, homes, traditions, and stories."},
    10:{kinder:["history-curriculum","kinder-math"],creche:["life","wonder"],reason:"Maps, places, position, and community."},
    11:{kinder:["sink-float","weather-compass"],creche:["wonder","life"],reason:"Plants, gardens, needs, and observation."},
    12:{kinder:["sink-float","abc-story"],creche:["wonder","words"],reason:"Animals, habitats, needs, and descriptive language."},
    13:{kinder:["abc-story","breath-calm"],creche:["words","feelings"],reason:"Gratitude, giving, kindness, and storytelling."},
    14:{kinder:["phonic-garden","spelling-soup"],creche:["letters","words"],reason:"Rhymes, sounds, syllables, and playful word work."},
    15:{kinder:["math-curriculum","kinder-math"],creche:["numbers"],reason:"Measure, compare, estimate, and build."},
    16:{kinder:["kinder-math","history-curriculum"],creche:["life","numbers"],reason:"Needs, wants, choices, counting, and simple money ideas."},
    17:{kinder:["weather-planetarium","weather-compass"],creche:["wonder"],reason:"Winter, light, shadows, and observation."},
    18:{kinder:["breathing-bubble","abc-story"],creche:["feelings","words"],reason:"Review, reflect, celebrate, and reset."},
    19:{kinder:["breath-calm","abc-curriculum"],creche:["feelings","life"],reason:"Goals, persistence, routines, and growth mindset."},
    20:{kinder:["abc-story","history-curriculum"],creche:["words","letters"],reason:"Stories, language, culture, and the wider world."},
    21:{kinder:["sink-float","weather-compass"],creche:["wonder"],reason:"Living and nonliving things through observation."},
    22:{kinder:["sink-float","weather-wizard"],creche:["wonder"],reason:"Water, ice, states, and weather change."},
    23:{kinder:["history-curriculum","weather-compass"],creche:["life","wonder"],reason:"Stewardship, shared places, and Earth care."},
    24:{kinder:["kinder-math","sink-float"],creche:["life","wonder","numbers"],reason:"Transportation, motion, design, and engineering."},
    25:{kinder:["history-curriculum","abc-story"],creche:["life","words"],reason:"Jobs, tools, helpers, and community roles."},
    26:{kinder:["history-curriculum","abc-curriculum"],creche:["words","life"],reason:"Symbols, flags, belonging, and civic language."},
    27:{kinder:["math-curriculum","numbers-quiz"],creche:["numbers","life"],reason:"Markets, counting, number stories, and choices."},
    28:{kinder:["breath-calm","pe-curriculum"],creche:["life","movement"],reason:"Food, health routines, and caring for growing bodies."},
    29:{kinder:["pe-curriculum","breathing-bubble"],creche:["movement"],reason:"Movement, balance, coordination, and body awareness."},
    30:{kinder:["math-garden","abc-story"],creche:["art","music","numbers"],reason:"Patterns become visual art, rhythm, and music."},
    31:{kinder:["sink-float","weather-compass"],creche:["wonder"],reason:"Bugs, gardens, habitats, and tiny-world observation."},
    32:{kinder:["sink-float","weather-compass"],creche:["wonder"],reason:"Pond, river, ocean, and water habitats."},
    33:{kinder:["weather-planetarium","weather-wizard"],creche:["wonder"],reason:"Moon, space, day/night, and sky patterns."},
    34:{kinder:["abc-curriculum","history-curriculum"],creche:["wonder","life"],reason:"Tools, technology, safe choices, and digital citizenship."},
    35:{kinder:["abc-story","phonic-garden"],creche:["wonder","words"],reason:"Questions, research language, curiosity, and capstone expression."},
    36:{kinder:["breath-calm","abc-story"],creche:["feelings","words"],reason:"Review, readiness, celebration, and reflection."}
  });

  const byId = id => KINDER_APPS.find(app=>app.id===id) || null;
  const encodePath = value => String(value||"").split("/").map(encodeURIComponent).join("/");
  const crecheUrl = file => `https://vervenveda.com/Khaemenes_Preschool.github.io/apps/${encodePath(file)}`;

  function eligibleCreche(catalog){
    if(!catalog || typeof catalog.mentorActivities!=="function") return [];
    return catalog.mentorActivities().filter(item=>{
      const ages=item?.mentor?.ages || [];
      return ages.includes("4-5") || ages.includes("5-6");
    });
  }

  function forUnit(unitNumber,catalog){
    const n=Math.max(1,Math.min(36,Number(unitNumber)||1));
    const plan=MAP[n] || MAP[1];
    const kinder=plan.kinder.map(byId).filter(Boolean);
    const pool=eligibleCreche(catalog).filter(item=>plan.creche.includes(item.category));
    const creche=pool.length ? pool[(n-1)%pool.length] : eligibleCreche(catalog)[(n-1)%Math.max(1,eligibleCreche(catalog).length)] || null;
    return {
      unit:n,
      reason:plan.reason,
      kinder,
      creche:creche ? {...creche,url:crecheUrl(creche.file)} : null
    };
  }

  global.KhaemenesKinderCompanions=Object.freeze({
    version:"1.0.0",
    apps:KINDER_APPS,
    map:MAP,
    byId,
    forUnit,
    crecheUrl
  });
})(window);
