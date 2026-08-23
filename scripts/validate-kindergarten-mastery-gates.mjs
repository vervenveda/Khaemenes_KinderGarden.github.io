import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const exists=p=>fs.existsSync(path.join(ROOT,p));
const gate=read("assets/khaemenes-kinder-mastery-gates.js");
const app=read("curriculum/assets/app.js");
const index=read("curriculum/index.html");
const mastery=read("curriculum/mastery/index.html");
const TAG="data-khaemenes-kindergarten-formal-gate";

const UPGRADED=[
  {
    unit:5,
    versionLabel:"Week 5",
    days:["Monday · Nature Detectives","Tuesday · Pattern Garden","Wednesday · Season Scientists","Thursday · Leaf Studio","Friday · Remember, Explain & Reflect"],
    must:["Week 4 developed the five senses","No single-season stereotype","Any home language may be used","The learning goal is reasoning—not access to a particular material"],
    forbidden:"Children participate in a joyful, developmentally appropriate lesson about seasons, trees, and leaves through language, math, inquiry, movement, and creation.",
    mastery:["Mathematics / pattern","Distinguishes an observation from a guess"]
  },
  {
    unit:6,
    versionLabel:"Week 6",
    days:["Monday · Sky Watchers","Tuesday · Weather Data Garden","Wednesday · Sunlight & Shade Lab","Thursday · Weather-Ready Designers","Friday · Weather Reporter"],
    must:["Last week children practiced noticing evidence before guessing","Never look directly at the Sun","Never send a child outdoors to observe lightning","Choose the word that matches your place—not someone else's climate","any home language","A particular climate, outdoor space, or material is never required","A forecast is not a promise"],
    forbidden:"Children participate in a joyful, developmentally appropriate lesson about weather, sun, and sky through language, math, inquiry, movement, and creation.",
    mastery:["Weather communication","Weather data","Sunlight / shade inquiry","Sun and severe-weather safety"]
  },
  {
    unit:7,
    versionLabel:"Week 7",
    days:["Monday · Shape Detectives","Tuesday · Compose & Locate","Wednesday · Attribute & Color Lab","Thursday · Shape City Engineers","Friday · Design Tour"],
    must:["From weather symbols to geometry","color is never the only cue","Fine-motor or color-vision differences do not reduce the geometry goal","Turning the square changes its position, not its properties","different attributes","a design change is evidence of thinking—not failure"],
    forbidden:"Children participate in a joyful, developmentally appropriate lesson about shapes, colors, and design through language, math, inquiry, movement, and creation.",
    mastery:["Shape properties","Spatial language","Shape composition","Design reasoning and revision"]
  },
  {
    unit:8,
    versionLabel:"Week 8",
    days:["Monday · Pattern Pulse Detectives","Tuesday · Rhythm & Word Lab","Wednesday · Translate the Pattern","Thursday · Performance Designers","Friday · Pattern Conductor"],
    must:["Week 5 introduced repeating patterns, and Week 7 used shapes as design parts","No instrument, recorded music, standing movement, hearing, speech, color vision, or fine-motor skill is required","Hearing or producing sound is never required","Do not force English pronunciation or treat one language's rhyme system as universal","avoid copying sacred/restricted practices","performance quality is not judged by loudness, singing, dance technique"],
    forbidden:"Children participate in a joyful, developmentally appropriate lesson about patterns, music, and movement through language, math, inquiry, movement, and creation.",
    mastery:["Repeating pattern rule","Beat and rhythm","Syllable and rhyme","Pattern translation","Self-regulation and safety"]
  }
];

function assertInlineScriptsParse(label,html){
  const scripts=[...html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(s=>s.trim());
  assert.ok(scripts.length>0,`${label} must contain at least one inline behavior script`);
  for(const [i,script] of scripts.entries()){
    try{new Function(script)}catch(error){throw new Error(`${label} inline script ${i+1} has invalid JavaScript: ${error.message}`)}
  }
}

assert.ok(gate.includes('const VERSION="1.2.3"'),"daily-evidence mastery engine must remain on the Week 8 rollout contract or later");
assert.ok(gate.includes('const PASS=80'),"formal mastery threshold must remain 80%");
assert.ok(gate.includes('const TOTAL_WEEKS=36'),"formal curriculum must remain 36 weeks");
assert.ok(gate.includes('const DAYS_PER_WEEK=5'),"formal upgraded weeks must retain five daily experiences");
assert.ok(gate.includes('const DAILY_SEQUENCE_UNITS=new Set([5,6,7,8])'),"Weeks 5-8 must remain in the staged A++++ daily-sequence rollout");
assert.ok(gate.includes('reviewedUnlocks:false'),"reviewed must not unlock curriculum");
assert.ok(gate.includes('legacyScoresUnlock:false'),"legacy typed scores must not unlock curriculum");
assert.ok(gate.includes('directUrlUnlocks:false'),"direct canonical URLs must not unlock curriculum");
assert.ok(gate.includes('bestMasteryPreserved:true'),"best demonstrated mastery must be preserved");
assert.ok(gate.includes('dailyEvidenceIsMastery:false'),"daily completion evidence must never be confused with mastery");
assert.ok(gate.includes('const best=Math.max(old.bestPercent,percent)'),"later lower attempts must not erase best demonstrated evidence");
assert.ok(gate.includes('const bestQualified=Math.max(old.bestQualifiedPercent,essential?percent:0)'),"qualified mastery must preserve the best essential-criteria attempt");
assert.ok(gate.includes('adultAffirmed!==true'),"formal weekly/milestone evidence must require adult affirmation");
assert.ok(gate.includes('if(n>=19&&!milestoneMastery("midterm").mastered)return false'),"Week 19+ must require midyear mastery");
assert.ok(gate.includes('for(let i=1;i<=18;i++)if(!weekMastery(i).mastered)return false'),"midyear must require Weeks 1-18 mastery");
assert.ok(gate.includes('for(let i=1;i<=TOTAL_WEEKS;i++)if(!weekMastery(i).mastered)return false'),"final must require all 36 weeks mastery");
assert.ok(gate.includes('week-assessment'),"legacy unit assessment URLs must be recognized");
assert.ok(gate.includes('midterm\\.html'),"legacy midterm URL must be recognized");
assert.ok(gate.includes('final-exam\\.html'),"legacy final URL must be recognized");
assert.ok(gate.includes('formal-content\\.html'),"preserved formal lesson URLs must be recognized for direct-access protection");
assert.ok(gate.includes('redirectLegacyAssessment'),"eligible legacy assessment URLs must route to current mastery evidence");
assert.ok(gate.includes('clearActiveMasteryRecord'),"record reset must be explicit and separate from later practice");
assert.ok(gate.includes('recordDayEvidence'),"upgraded weeks must record learner-scoped daily evidence");
assert.ok(gate.includes('canOpenDay'),"upgraded weeks must enforce day-to-day prerequisites");
assert.ok(gate.includes('allDaysComplete'),"upgraded weeks must know whether all five daily experiences are complete");
assert.ok(gate.includes('return canOpenWeek(n)&&allDaysComplete(n)'),"upgraded-week mastery must remain locked until the daily sequence is complete");
assert.ok(gate.includes('essentialSatisfied=true'),"weekly evidence API must support required core criteria");

assert.ok(app.includes('const GATES=window.KhaemenesKinderMasteryGates'),"curriculum dashboard must consume the mastery gate engine");
assert.ok(app.includes('GATES.weekMastery'),"dashboard must read learner mastery receipts");
assert.ok(app.includes('GATES?.milestoneMastery'),"dashboard must read milestone receipts");
assert.ok(!app.includes('[data-score]'),"manual weekly score inputs must not return");
assert.ok(!app.includes('state.weekly[input.dataset.score]'),"typed weekly percentages must not mutate progression");
assert.ok(!index.includes('id="midtermScore"'),"manual midyear score input must not return");
assert.ok(!index.includes('id="finalScore"'),"manual final score input must not return");
assert.ok(index.includes('id="portfolioAffirm"'),"portfolio completion must require adult affirmation");
assert.ok(index.includes('khaemenes-kinder-mastery-gates.js'),"curriculum dashboard must load the canonical mastery engine");

assert.ok(mastery.includes('weeklyCriteria'),"weekly mastery must use observable criteria");
assert.ok(mastery.includes('milestoneRounds'),"midyear/final must use observable demonstration criteria");
assert.ok(mastery.includes('recordWeekEvidence'),"weekly mastery page must record computed evidence");
assert.ok(mastery.includes('recordMilestoneEvidence'),"milestone page must record computed evidence");
assert.ok(mastery.includes('Passing: <strong>80%</strong>'),"mastery surface must display the 80% threshold");
assert.ok(mastery.includes('Authorized adult affirmation'),"mastery evidence must visibly require adult affirmation");
assert.ok(mastery.includes('REQUIRED CORE'),"upgraded-week mastery must visibly identify essential criteria");
assert.ok(mastery.includes('essentialSatisfied:s.essentialSatisfied'),"required-core result must be passed to mastery authority");
assert.ok(mastery.includes('all five daily learning experiences are complete'),"upgraded-week mastery surface must explain the daily prerequisite");
for(const cfg of UPGRADED)for(const marker of cfg.mastery)assert.ok(mastery.includes(marker),`${cfg.versionLabel} mastery must preserve essential criterion: ${marker}`);
assertInlineScriptsParse("Mastery surface",mastery);

for(const cfg of UPGRADED){
  const n=String(cfg.unit).padStart(2,"0");
  const html=read(`curriculum/lessons/unit-${n}/formal-content.html`);
  for(const marker of cfg.days)assert.ok(html.includes(marker),`${cfg.versionLabel} must preserve distinct daily lesson: ${marker}`);
  for(let d=1;d<=5;d++)assert.ok(html.includes(`class="action gold save-day" data-day="${d}"`),`${cfg.versionLabel} day ${d} must have an evidence-save checkpoint`);
  for(const marker of cfg.must)assert.ok(html.includes(marker),`${cfg.versionLabel} must preserve continuity/access/quality marker: ${marker}`);
  assert.ok(!html.includes(cfg.forbidden),`${cfg.versionLabel} must not regress to the generic repeated daily objective`);
  assert.ok(html.includes(TAG),`${cfg.versionLabel} preserved formal content must self-load the direct-access gate`);
  assert.ok(html.indexOf(TAG)<html.toLowerCase().indexOf("</head>"),`${cfg.versionLabel} preserved-content guard must load in the head`);
  assert.ok(html.includes("G.recordDayEvidence"),`${cfg.versionLabel} daily checkpoints must write through the Academy mastery authority`);
  assert.ok(html.includes('G.allDaysComplete(UNIT)'),`${cfg.versionLabel} mastery-ready state must come from the authority record`);
  assert.ok(html.includes("it does not award mastery")||html.includes("does not award mastery"),`${cfg.versionLabel} must explicitly separate daily evidence from mastery`);
  assertInlineScriptsParse(cfg.versionLabel,html);
}

const lessonRoot=path.join(ROOT,"curriculum","lessons");
const lessonDirs=fs.readdirSync(lessonRoot,{withFileTypes:true}).filter(e=>e.isDirectory()&&/^unit-\d{2}$/.test(e.name)).map(e=>e.name).sort();
assert.equal(lessonDirs.length,36,"all 36 formal Kindergarten lesson directories must exist");
for(const dir of lessonDirs){
  const canonical=`curriculum/lessons/${dir}/index.html`;
  const preserved=`curriculum/lessons/${dir}/formal-content.html`;
  assert.ok(exists(canonical),`${canonical} must exist`);
  assert.ok(exists(preserved),`${preserved} must preserve the lesson body`);
  const html=read(canonical);
  assert.ok(html.includes(TAG),`${canonical} must load the fail-closed formal gate`);
  assert.ok(html.indexOf(TAG)<html.toLowerCase().indexOf("</head>"),`${canonical} gate must load in the head`);
  assert.ok(html.includes('fetch("formal-content.html"'),`${canonical} may hydrate preserved content only after the gate opens`);
}

const assessmentRoot=path.join(ROOT,"curriculum","assessments");
const assessmentNames=fs.readdirSync(assessmentRoot,{withFileTypes:true}).filter(e=>e.isFile()&&(/^unit-\d{2}-assessment\.html$/.test(e.name)||["midterm.html","final-exam.html","weekly-assessments.html"].includes(e.name))).map(e=>e.name).sort();
assert.equal(assessmentNames.length,39,"36 unit assessments plus weekly index, midterm, and final must be accounted for");
for(const name of assessmentNames){
  const canonical=`curriculum/assessments/${name}`;
  const preserved=`curriculum/assessments/published-self-check-${name}`;
  const html=read(canonical);
  assert.ok(html.includes(TAG),`${canonical} must load the formal gate`);
  assert.ok(html.indexOf(TAG)<html.toLowerCase().indexOf("</head>"),`${canonical} gate must load in the head`);
  assert.ok(exists(preserved),`${preserved} must preserve the already-published self-check artifact`);
}

const workflow=read(".github/workflows/kindergarten-formal-gate-rollout.yml");
assert.ok(workflow.includes("contents: read"),"permanent Kindergarten validation workflow must be read-only");
assert.ok(!workflow.includes("git push"),"permanent validation workflow must never push generated changes");
assert.ok(!workflow.includes("contents: write"),"permanent validation workflow must not request write permission");

console.log("Kindergarten Academy Mastery + A++++ Daily Continuity Contract: PASS");
console.log("- 36 canonical lesson routes remain fail-closed");
console.log("- 39 canonical legacy assessment routes remain intercepted");
console.log(`- A++++ daily sequence active for Weeks ${UPGRADED.map(x=>x.unit).join(", ")}`);
console.log("- upgraded weeks require five daily learning-evidence receipts before mastery");
console.log("- daily evidence itself is never mastery");
console.log("- upgraded mastery requires >=80% plus week-specific essential criteria");
console.log("- upgraded preserved content self-loads the formal gate for ordinary direct-browser access");
console.log("- multilingual, no-cost, accessible, globally relevant demonstration options are preserved");
console.log("- upgraded child-facing inline JavaScript parses successfully");
console.log("- validation workflow remains read-only");
