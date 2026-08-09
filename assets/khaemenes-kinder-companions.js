/*
 * Khaemenes Kinder Garden · NAIB Lesson Companion Engine v2.0.0
 * --------------------------------------------------------------
 * Matches registered Kinder Garden resources and age-appropriate
 * Crechè activities to the ACTUAL lesson focus.
 *
 * Existing forUnit() callers remain supported.
 */
(function attachKinderCompanions(global){
  "use strict";

  const slug=value=>String(value??"").toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const tokens=value=>new Set(slug(value).split("-").filter(w=>w.length>2));
  const DAY_MODES={
    1:["learn","explore"],
    2:["practice","play"],
    3:["explore","practice"],
    4:["create","play"],
    5:["review","practice","reset"]
  };

  const SYNONYMS=Object.freeze({
    rhyme:["rhymes","rhyming"],
    syllables:["beats","syllable"],
    "beginning-sounds":["onset","initial-sounds","letter-sounds"],
    counting:["count","cardinality","number"],
    "compose-decompose":["compose","decompose","part-whole","number-stories"],
    "addition-within-10":["addition","add","number-stories"],
    "subtraction-within-10":["subtraction","subtract","take-away","number-stories"],
    shapes:["shape","geometry"],
    patterns:["pattern","rhythm"],
    weather:["clouds","sunlight","seasons","sky"],
    observation:["observe","notice","looking"],
    community:["families","homes","helpers","jobs","neighborhood"],
    maps:["map","places","position"],
    "self-regulation":["calm","feelings","frustration","breathing"],
    movement:["move","balance","coordination","body"],
    "sky-patterns":["moon","day-night","space"],
    storytelling:["stories","story","oral-language"]
  });

  function courseData(){return global.KHAE_KINDERGARTEN_DATA||null}
  function unitData(n,data=courseData()){return data?.units?.find?.(u=>Number(u.unit||u.week)===Number(n))||null}

  function lessonData(unit,lessonNumber=1){
    const list=Array.isArray(unit?.lessons)?unit.lessons:[];
    return list[Math.max(0,Math.min(list.length-1,Number(lessonNumber||1)-1))]||null;
  }

  function contextForLesson(unitNumber,lessonNumber=1,data=courseData()){
    const unit=unitData(unitNumber,data);
    if(!unit)return null;
    const lesson=lessonData(unit,lessonNumber);
    const day=Math.max(1,Math.min(5,Number(lessonNumber)||1));
    const focusParts=[
      unit.title,unit.theme,unit.essentialQuestion,
      day===1?`${unit.literacyFocus||""} ${unit.mathFocus||""}`:"",
      day===2?`${unit.literacyFocus||""} ${unit.mathFocus||""}`:"",
      day===3?`${unit.inquiryFocus||""} ${unit.selFocus||""}`:"",
      day===4?`${unit.makerProject||""} ${unit.theme||""}`:"",
      day===5?`${unit.literacyFocus||""} ${unit.mathFocus||""} ${unit.inquiryFocus||""} ${unit.selFocus||""}`:"",
      lesson?.title,lesson?.objective,lesson?.workshop,lesson?.morningCircle
    ].join(" ");
    const tokenSet=tokens(focusParts);
    const expanded=new Set(tokenSet);
    for(const [skill,values] of Object.entries(SYNONYMS)){
      const skillWords=tokens(skill);
      const hit=[...skillWords,...values.flatMap(v=>[...tokens(v)])].some(v=>tokenSet.has(v));
      if(hit){expanded.add(slug(skill));values.forEach(v=>expanded.add(slug(v)))}
    }
    return {
      week:Number(unitNumber),
      lesson:day,
      day:lesson?.day||["Monday","Tuesday","Wednesday","Thursday","Friday"][day-1],
      lessonTitle:lesson?.title||"",
      unit,
      lessonData:lesson,
      modes:DAY_MODES[day]||["practice"],
      text:focusParts,
      tokens:expanded
    };
  }

  function resourceScore(resource,context,interests=[]){
    if(!resource?.mentorEligible||!resource.public)return -999;
    let score=0;
    const ct=context.tokens;
    const resourceWords=new Set([
      ...resource.skills||[],
      ...resource.domains||[],
      ...resource.keywords||[],
      ...tokens(`${resource.title||""} ${resource.desc||""} ${resource.group||""}`)
    ].map(slug));

    for(const skill of resource.skills||[]){
      const s=slug(skill);
      if(ct.has(s))score+=12;
      const syn=SYNONYMS[s]||[];
      if(syn.some(v=>[...tokens(v)].some(w=>ct.has(w))))score+=6;
    }
    for(const word of resourceWords){
      if(ct.has(word))score+=3;
    }
    for(const mode of resource.modes||[]){
      if(context.modes.includes(slug(mode)))score+=5;
    }
    for(const interest of interests||[]){
      const s=slug(interest);
      if(resourceWords.has(s))score+=2;
    }

    if(resource.group==="wellness"&&context.lesson===5)score+=3;
    if(resource.group==="movement"&&/movement|rhythm|balance|body/i.test(context.text))score+=6;
    if(resource.group==="literacy"&&/letter|sound|rhyme|word|story|read|language/i.test(context.text))score+=5;
    if(resource.group==="math"&&/count|number|shape|measure|pattern|add|subtract|math/i.test(context.text))score+=5;
    if(resource.group==="science"&&/observe|weather|plant|animal|water|light|shadow|space|moon|living|motion/i.test(context.text))score+=5;
    if(resource.group==="community"&&/family|community|map|job|symbol|market|tradition|civic/i.test(context.text))score+=5;
    return score;
  }

  function kinderForLesson(unitNumber,lessonNumber=1,options={}){
    const R=global.KhaemenesKinderResources;
    const context=contextForLesson(unitNumber,lessonNumber,options.courseData||courseData());
    if(!R||!context)return [];
    const interests=options.interests||[];
    return R.all()
      .map(resource=>({resource,score:resourceScore(resource,context,interests)}))
      .filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score||a.resource.title.localeCompare(b.resource.title))
      .slice(0,Math.max(1,Number(options.limit)||3))
      .map(x=>({...x.resource,matchScore:x.score}));
  }

  function crecheScore(item,context){
    let score=0;
    const words=tokens(`${item?.title||""} ${item?.desc||""} ${item?.tags||""} ${item?.category||""} ${item?.mentor?.desc||""}`);
    for(const token of words)if(context.tokens.has(token))score+=3;
    const category=slug(item?.category||"");
    const categoryBoost={
      letters:/letter|sound|rhyme|word|read|language/i,
      words:/word|story|read|language|rhyme/i,
      numbers:/count|number|shape|measure|pattern|add|subtract|math/i,
      wonder:/observe|weather|plant|animal|water|light|shadow|space|moon|living|motion/i,
      feelings:/feeling|friend|kind|goal|frustrat|gratitude|self/i,
      movement:/movement|rhythm|balance|body|coordination/i,
      music:/music|rhythm|sound|beat/i,
      art:/art|color|design|make|create/i,
      life:/family|home|community|job|health|food|tool|routine/i
    };
    if(categoryBoost[category]?.test(context.text))score+=9;
    return score;
  }

  function eligibleCreche(catalog){
    if(!catalog||typeof catalog.mentorActivities!=="function")return [];
    return catalog.mentorActivities().filter(item=>{
      const ages=item?.mentor?.ages||[];
      return ages.includes("4-5")||ages.includes("5-6");
    });
  }

  const encodePath=value=>String(value||"").split("/").map(encodeURIComponent).join("/");
  const crecheUrl=file=>`https://vervenveda.com/Khaemenes_Preschool.github.io/apps/${encodePath(file)}`;

  function crecheForLesson(unitNumber,lessonNumber=1,catalog=global.KhaemenesPreschoolCatalog,options={}){
    const context=contextForLesson(unitNumber,lessonNumber,options.courseData||courseData());
    if(!context)return [];
    return eligibleCreche(catalog)
      .map(item=>({item,score:crecheScore(item,context)}))
      .filter(x=>x.score>0)
      .sort((a,b)=>b.score-a.score||String(a.item.title).localeCompare(String(b.item.title)))
      .slice(0,Math.max(1,Number(options.limit)||2))
      .map(x=>({...x.item,url:crecheUrl(x.item.file),matchScore:x.score}));
  }

  function why(context,kinder,creche){
    const unit=context?.unit;
    if(!unit)return "Optional skill practice connected to the current lesson.";
    const focus=context.lesson===2
      ? `${unit.literacyFocus||""} · ${unit.mathFocus||""}`
      : context.lesson===3
        ? `${unit.inquiryFocus||""} · ${unit.selFocus||""}`
        : context.lesson===4
          ? `${unit.makerProject||unit.theme||""}`
          : `${unit.theme||unit.title||""}`;
    return `Matched to ${context.day}: ${focus}`;
  }

  function forLesson(unitNumber,lessonNumber=1,catalog=global.KhaemenesPreschoolCatalog,options={}){
    const context=contextForLesson(unitNumber,lessonNumber,options.courseData||courseData());
    if(!context)return {unit:Number(unitNumber)||1,lesson:Number(lessonNumber)||1,reason:"Lesson data unavailable.",kinder:[],creche:[],context:null};
    const kinder=kinderForLesson(unitNumber,lessonNumber,options);
    const creche=crecheForLesson(unitNumber,lessonNumber,catalog,options);
    return {
      unit:Number(unitNumber),lesson:Number(lessonNumber),
      reason:why(context,kinder,creche),
      kinder,
      creche,
      context
    };
  }

  /* Backward-compatible week-level call.
     We intentionally combine suggestions across the five lesson days rather
     than hard-code a week-to-app pair. */
  function forUnit(unitNumber,catalog=global.KhaemenesPreschoolCatalog,options={}){
    const seen=new Map(),crecheSeen=new Map();
    const reasons=[];
    for(let day=1;day<=5;day++){
      const match=forLesson(unitNumber,day,catalog,{...options,limit:3});
      reasons.push(match.reason);
      match.kinder.forEach((r,index)=>{
        const prior=seen.get(r.id);
        const score=(r.matchScore||0)+(3-index);
        if(!prior||score>prior.score)seen.set(r.id,{resource:r,score});
      });
      match.creche.forEach((r,index)=>{
        const id=r.id||r.file||r.title;
        const prior=crecheSeen.get(id);
        const score=(r.matchScore||0)+(2-index);
        if(!prior||score>prior.score)crecheSeen.set(id,{resource:r,score});
      });
    }
    return {
      unit:Number(unitNumber),
      reason:`Skill-matched across this week's five lessons.`,
      kinder:[...seen.values()].sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.resource),
      creche:[...crecheSeen.values()].sort((a,b)=>b.score-a.score).slice(0,2).map(x=>x.resource)
    };
  }

  global.KhaemenesKinderCompanions=Object.freeze({
    version:"2.0.0",
    contextForLesson,
    forLesson,
    forUnit,
    kinderForLesson,
    crecheForLesson,
    get apps(){return global.KhaemenesKinderResources?.all?.()||[]}
  });
})(window);
