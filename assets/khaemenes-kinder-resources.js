/*
 * Khaemenes Kinder Garden · Living Learning Resource Registry v1.0.0
 * Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda
 *
 * PURPOSE
 * -------
 * One resource catalog for Kinder Garden games / apps / learning tools.
 * NAIB and the Mentor match resources to actual curriculum skills.
 *
 * ADDING A NEW SPECIALIZED GAME
 * -----------------------------
 * Add ONE object to RESOURCE_DEFINITIONS below.
 * You do NOT need to manually wire it to Week 03, Week 14, Week 27, etc.
 * The companion engine scores its skill tags against the current lesson.
 */
(function attachKinderResources(global){
  "use strict";

  const RESOURCE_DEFINITIONS = [
    {
      id:"abc-curriculum",title:"ABC Curriculum",icon:"🔤",group:"literacy",
      path:"apps/ABC_curriculum_index.html",
      desc:"Letters, sounds, print awareness, and early reading.",
      domains:["literacy"],skills:["alphabet","letter-recognition","letter-sounds","print-awareness","phonics","early-reading","names"],
      modes:["learn","practice"],ageBands:["4-5","5-6"]
    },
    {
      id:"spelling-soup",title:"ABC Spelling Soup",icon:"🥣",group:"literacy",
      path:"apps/ABC_spelling_soup_index.html",
      desc:"Play with letters, sounds, and beginning spelling.",
      domains:["literacy"],skills:["letter-sounds","beginning-sounds","phonics","spelling","word-building"],
      modes:["practice","play"],ageBands:["4-5","5-6"]
    },
    {
      id:"abc-story",title:"ABC Story",icon:"📖",group:"literacy",
      path:"apps/ABC_story_index.html",
      desc:"Storytelling, listening, sequence, and letter recognition.",
      domains:["literacy","sel"],skills:["storytelling","oral-language","listening","sequence","letter-recognition","comprehension"],
      modes:["learn","explore","create"],ageBands:["4-5","5-6"]
    },
    {
      id:"phonic-garden",title:"Phonic Awareness Garden",icon:"👂",group:"literacy",
      path:"apps/kinder_garden_phonic_awareness_index.html",
      desc:"Hear, compare, and practice the sounds inside words.",
      domains:["literacy"],skills:["phonological-awareness","rhyme","syllables","onset-rime","beginning-sounds","sound-counting"],
      modes:["practice","play"],ageBands:["4-5","5-6"]
    },
    {
      id:"spelling-safari",title:"Spelling Safari",icon:"🦒",group:"literacy",
      path:"apps/Spelling_safari_index.html",
      desc:"A playful spelling and word-recognition adventure.",
      domains:["literacy"],skills:["spelling","word-recognition","sight-words","phonics","word-building"],
      modes:["practice","play"],ageBands:["5-6"]
    },
    {
      id:"math-curriculum",title:"Math Curriculum",icon:"🔢",group:"math",
      path:"apps/Math_curriculum_index.html",
      desc:"Structured early mathematics and number reasoning.",
      domains:["math"],skills:["counting","cardinality","compare","compose-decompose","addition-within-10","subtraction-within-10","measurement","geometry","patterns","data"],
      modes:["learn","practice"],ageBands:["4-5","5-6"]
    },
    {
      id:"kinder-math",title:"Kinder Math",icon:"🧮",group:"math",
      path:"apps/Math_kinder_index.html",
      desc:"Kindergarten-sized number practice and problem solving.",
      domains:["math"],skills:["number-sense","counting","problem-solving","compose-decompose","addition-within-10","subtraction-within-10","number-stories"],
      modes:["practice","play"],ageBands:["5-6"]
    },
    {
      id:"numbers-1-12",title:"Numbers 1–12",icon:"1️⃣",group:"math",
      path:"apps/Numbers_1-12_index.html",
      desc:"Counting and number recognition from one through twelve.",
      domains:["math"],skills:["counting","numeral-recognition","cardinality","one-to-one"],
      modes:["practice","play"],ageBands:["4-5","5-6"]
    },
    {
      id:"numbers-quiz",title:"Numbers & Quiz",icon:"✅",group:"math",
      path:"apps/Numbers_&_quiz_index.html",
      desc:"A quick number practice and check-for-understanding activity.",
      domains:["math"],skills:["counting","numeral-recognition","number-sense","review"],
      modes:["practice","review"],ageBands:["5-6"]
    },
    {
      id:"math-cloud",title:"Kindergarten Math Cloud",icon:"☁️",group:"math",
      path:"apps/kindergarten_math_cloud_index.html",
      desc:"Colorful interactive kindergarten mathematics practice.",
      domains:["math"],skills:["number-sense","counting","patterns","compare","problem-solving"],
      modes:["practice","play"],ageBands:["5-6"]
    },
    {
      id:"math-garden",title:"Math Garden",icon:"🌼",group:"math",
      path:"apps/math-garden_index.html",
      desc:"Practice early mathematics inside a garden-themed activity.",
      domains:["math"],skills:["counting","patterns","shapes","geometry","number-sense","compare"],
      modes:["practice","play"],ageBands:["4-5","5-6"]
    },
    {
      id:"sink-float",title:"Sink or Float",icon:"🛶",group:"science",
      path:"apps/sink-or-float_index.html",
      desc:"Make predictions, observe results, and explore material properties.",
      domains:["science","inquiry"],skills:["prediction","observation","properties","classification","fair-test","evidence"],
      modes:["explore","practice"],ageBands:["4-5","5-6"]
    },
    {
      id:"weather-compass",title:"Weather Compass",icon:"🧭",group:"science",
      path:"apps/Weather_compass_index.html",
      desc:"Observe weather and build early Earth-science vocabulary.",
      domains:["science","inquiry"],skills:["weather","seasons","observation","sky","vocabulary","data"],
      modes:["explore","practice"],ageBands:["4-5","5-6"]
    },
    {
      id:"weather-planetarium",title:"Weather Planetarium",icon:"🪐",group:"science",
      path:"apps/Weather_planetarium_index.html",
      desc:"Explore sky, weather, space, and observation.",
      domains:["science","inquiry"],skills:["space","moon","day-night","sky-patterns","weather","observation"],
      modes:["explore"],ageBands:["4-5","5-6"]
    },
    {
      id:"weather-wizard",title:"Weather Wizard",icon:"🪄",group:"science",
      path:"apps/Weather_wizard_index.html",
      desc:"Playful weather recognition and science practice.",
      domains:["science"],skills:["weather","weather-vocabulary","matching","seasons"],
      modes:["practice","play"],ageBands:["4-5","5-6"]
    },
    {
      id:"weather-match",title:"Weather Match",icon:"🌦️",group:"science",
      path:"apps/weather-match_index.html",
      desc:"Match weather ideas, symbols, and conditions.",
      domains:["science"],skills:["weather","matching","weather-vocabulary","classification"],
      modes:["practice","play"],ageBands:["4-5","5-6"]
    },
    {
      id:"history-curriculum",title:"History Curriculum",icon:"🏺",group:"community",
      path:"apps/History_curriculum_index.html",
      desc:"Early history, community, culture, sequence, and belonging.",
      domains:["community","civics","social-studies"],skills:["family","community","traditions","maps","places","jobs","helpers","symbols","belonging","needs-wants","civic-language","sequence"],
      modes:["learn","explore","practice"],ageBands:["5-6"]
    },
    {
      id:"pe-curriculum",title:"PE Curriculum",icon:"🦘",group:"movement",
      path:"apps/PE_curriculum_index.html",
      desc:"Movement, balance, coordination, and active learning.",
      domains:["movement","health"],skills:["gross-motor","balance","coordination","movement","rhythm","body-awareness","spatial-awareness"],
      modes:["practice","play","reset"],ageBands:["4-5","5-6"]
    },
    {
      id:"breath-calm",title:"Breath & Calm",icon:"🌬️",group:"wellness",
      path:"apps/Breath_index.html",
      desc:"A calm space for breathing, regulation, and gentle focus.",
      domains:["sel","wellness"],skills:["self-regulation","breathing","feelings","focus","calm","frustration"],
      modes:["reset","practice"],ageBands:["4-5","5-6"]
    },
    {
      id:"breathing-bubble",title:"Breathing Bubble",icon:"🫧",group:"wellness",
      path:"apps/breathing-bubble_index.html",
      desc:"A simple visual breathing activity for quiet reset moments.",
      domains:["sel","wellness"],skills:["breathing","self-regulation","calm","transition","frustration"],
      modes:["reset"],ageBands:["4-5","5-6"]
    }
  ];

  const registry=new Map();

  const clean=(value,max=160)=>String(value??"").trim().slice(0,max);
  const slug=value=>clean(value).toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const arr=(value)=>Array.isArray(value)?[...new Set(value.map(v=>slug(v)).filter(Boolean))]:[];
  const words=value=>new Set(slug(value).split("-").filter(w=>w.length>2));

  function infer(resource){
    const text=`${resource.title||""} ${resource.desc||""} ${resource.group||""}`.toLowerCase();
    const skills=new Set(arr(resource.skills));
    const add=(test,...items)=>{if(test)items.forEach(item=>skills.add(slug(item)))};
    add(/letter|abc|alphabet/.test(text),"alphabet","letter-recognition");
    add(/phonic|sound/.test(text),"letter-sounds","phonological-awareness");
    add(/rhyme/.test(text),"rhyme");
    add(/spell|word/.test(text),"spelling","word-recognition");
    add(/story|read/.test(text),"storytelling","oral-language","comprehension");
    add(/number|math|count/.test(text),"counting","number-sense");
    add(/shape|geometry/.test(text),"shapes","geometry");
    add(/pattern/.test(text),"patterns");
    add(/weather/.test(text),"weather");
    add(/space|planet|moon/.test(text),"space","moon","sky-patterns");
    add(/history|community/.test(text),"community","civic-language");
    add(/move|pe|balance/.test(text),"movement","gross-motor");
    add(/breath|calm/.test(text),"breathing","self-regulation","calm");
    return [...skills];
  }

  function normalize(input={}){
    const title=clean(input.title||"Learning Tool",100);
    const path=clean(input.path||input.url||"",240);
    const id=slug(input.id||title||path)||`resource-${registry.size+1}`;
    const group=slug(input.group||input.domain||"general")||"general";
    return Object.freeze({
      id,title,
      icon:clean(input.icon||"✨",8),
      group,
      path,
      url:path,
      desc:clean(input.desc||input.description||"",240),
      domains:arr(input.domains?.length?input.domains:[group]),
      skills:infer(input),
      modes:arr(input.modes?.length?input.modes:["practice"]),
      ageBands:Array.isArray(input.ageBands)&&input.ageBands.length?[...new Set(input.ageBands.map(v=>clean(v,12)))]:["5-6"],
      keywords:arr(input.keywords),
      public:input.public!==false,
      mentorEligible:input.mentorEligible!==false,
      source:clean(input.source||"kinder",30)
    });
  }

  function register(input){
    const value=normalize(input);
    const prior=registry.get(value.id);
    registry.set(value.id,Object.freeze({
      ...(prior||{}),
      ...value,
      skills:[...new Set([...(prior?.skills||[]),...value.skills])],
      domains:[...new Set([...(prior?.domains||[]),...value.domains])],
      modes:[...new Set([...(prior?.modes||[]),...value.modes])]
    }));
    return registry.get(value.id);
  }

  function registerMany(values=[]){return values.map(register)}
  function all(){return [...registry.values()]}
  function byId(id){return registry.get(slug(id))||null}

  /* Backward compatibility: if a future app is added to the old APPS array
     but has not yet been added here, NAIB can still infer a useful first-pass
     skill profile from its title / description / group. */
  function ingestLegacy(values=[]){
    for(const value of values){
      if(!value)continue;
      register({
        ...value,
        id:value.id||slug(value.title||value.url),
        path:value.path||value.url,
        source:value.source||"legacy-app-list"
      });
    }
    return all();
  }

  function validate(){
    const values=all(),issues=[];
    const paths=new Map();
    for(const r of values){
      if(!r.path)issues.push(`${r.id}: missing path`);
      if(!r.skills.length)issues.push(`${r.id}: no skills`);
      if(paths.has(r.path))issues.push(`${r.id}: duplicate path with ${paths.get(r.path)}`);
      paths.set(r.path,r.id);
    }
    return {valid:!issues.length,count:values.length,issues};
  }

  registerMany(RESOURCE_DEFINITIONS);

  global.KhaemenesKinderResources=Object.freeze({
    version:"1.0.0",
    register,registerMany,ingestLegacy,all,byId,validate,
    definitions:RESOURCE_DEFINITIONS
  });
})(window);
