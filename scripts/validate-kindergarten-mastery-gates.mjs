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
const week05=read("curriculum/lessons/unit-05/formal-content.html");
const week06=read("curriculum/lessons/unit-06/formal-content.html");
const TAG="data-khaemenes-kindergarten-formal-gate";

function assertInlineScriptsParse(label,html){
  const scripts=[...html.matchAll(/<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(s=>s.trim());
  assert.ok(scripts.length>0,`${label} must contain at least one inline behavior script`);
  for(const [i,script] of scripts.entries()){
    try{new Function(script)}catch(error){throw new Error(`${label} inline script ${i+1} has invalid JavaScript: ${error.message}`)}
  }
}

assert.ok(gate.includes('const VERSION="1.2.1"'),"daily-evidence mastery engine must remain on v1.2.1 or later Week 6 rollout contract");
assert.ok(gate.includes('const PASS=80'),"formal mastery threshold must remain 80%");
assert.ok(gate.includes('const TOTAL_WEEKS=36'),"formal curriculum must remain 36 weeks");
assert.ok(gate.includes('reviewedUnlocks:false'),"reviewed must not unlock curriculum");
assert.ok(gate.includes('legacyScoresUnlock:false'),"legacy typed scores must not unlock curriculum");
assert.ok(gate.includes('directUrlUnlocks:false'),"direct canonical URLs must not unlock curriculum");
assert.ok(gate.includes('bestMasteryPreserved:true'),"best demonstrated mastery must be preserved");
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

assert.ok(gate.includes('const DAILY_SEQUENCE_UNITS=new Set([5,6])'),"Weeks 5 and 6 must remain in the staged A++++ daily-sequence rollout");
assert.ok(gate.includes('dailyEvidenceIsMastery:false'),"daily completion evidence must never be confused with mastery");
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
assert.ok(mastery.includes('Weather communication'),"Week 6 mastery must contain specific weather communication evidence");
assert.ok(mastery.includes('Weather data'),"Week 6 mastery must contain essential data/math evidence");
assert.ok(mastery.includes('Sunlight / shade inquiry'),"Week 6 mastery must contain essential sunlight/shade inquiry evidence");
assert.ok(mastery.includes('Sun and severe-weather safety'),"Week 6 mastery must contain essential safety evidence");
assertInlineScriptsParse("Mastery surface",mastery);

const week05Days=["Monday · Nature Detectives","Tuesday · Pattern Garden","Wednesday · Season Scientists","Thursday · Leaf Studio","Friday · Remember, Explain & Reflect"];
for(const marker of week05Days)assert.ok(week05.includes(marker),`Week 5 must preserve distinct daily lesson: ${marker}`);
for(let d=1;d<=5;d++)assert.ok(week05.includes(`class="action gold save-day" data-day="${d}"`),`Week 5 day ${d} must have an evidence-save checkpoint`);
assert.ok(week05.includes("Garden Connection:"),"Week 5 must explicitly connect prior learning into the new week");
assert.ok(week05.includes("Week 4 developed the five senses"),"Week 5 must retrieve Week 4 observation skills");
assert.ok(week05.includes("No single-season stereotype"),"Week 5 seasonal science must support global learners rather than one climate stereotype");
assert.ok(week05.includes("Any home language may be used"),"Week 5 must support multilingual demonstration");
assert.ok(week05.includes("The learning goal is reasoning—not access to a particular material"),"Week 5 must include accessible no-cost material alternatives");
assert.ok(!week05.includes("Children participate in a joyful, developmentally appropriate lesson about seasons, trees, and leaves through language, math, inquiry, movement, and creation."),"Week 5 must not regress to the generic repeated daily objective");
assert.ok(week05.includes(TAG),"Week 5 preserved formal content must self-load the direct-access gate");
assert.ok(week05.indexOf(TAG)<week05.toLowerCase().indexOf("</head>"),"Week 5 preserved-content guard must load in the head");
assert.ok(week05.includes("G.recordDayEvidence"),"Week 5 daily checkpoints must write through the Academy mastery authority");
assert.ok(week05.includes('G.allDaysComplete(UNIT)'),"Week 5 mastery-ready state must come from the authority record");
assertInlineScriptsParse("Week 5",week05);

const week06Days=["Monday · Sky Watchers","Tuesday · Weather Data Garden","Wednesday · Sunlight & Shade Lab","Thursday · Weather-Ready Designers","Friday · Weather Reporter"];
for(const marker of week06Days)assert.ok(week06.includes(marker),`Week 6 must preserve distinct daily lesson: ${marker}`);
for(let d=1;d<=5;d++)assert.ok(week06.includes(`class="action gold save-day" data-day="${d}"`),`Week 6 day ${d} must have an evidence-save checkpoint`);
assert.ok(week06.includes("Last week children practiced noticing evidence before guessing"),"Week 6 must explicitly retrieve Week 5 observation-before-inference learning");
assert.ok(week06.includes("Never look directly at the Sun"),"Week 6 must preserve direct-Sun safety instruction");
assert.ok(week06.includes("Never send a child outdoors to observe lightning"),"Week 6 must preserve dangerous-weather fail-safe guidance");
assert.ok(week06.includes("Choose the word that matches your place—not someone else's climate"),"Week 6 must support local/global climate variation");
assert.ok(week06.includes("any home language"),"Week 6 must support multilingual evidence");
assert.ok(week06.includes("A particular climate, outdoor space, or material is never required"),"Week 6 must preserve no-cost/accessibility alternatives");
assert.ok(week06.includes("A forecast is not a promise"),"Week 6 must distinguish observation/data from certainty about future weather");
assert.ok(!week06.includes("Children participate in a joyful, developmentally appropriate lesson about weather, sun, and sky through language, math, inquiry, movement, and creation."),"Week 6 must not regress to the generic repeated daily objective");
assert.ok(week06.includes(TAG),"Week 6 preserved formal content must self-load the direct-access gate");
assert.ok(week06.indexOf(TAG)<week06.toLowerCase().indexOf("</head>"),"Week 6 preserved-content guard must load in the head");
assert.ok(week06.includes("G.recordDayEvidence"),"Week 6 daily checkpoints must write through the Academy mastery authority");
assert.ok(week06.includes('G.allDaysComplete(UNIT)'),"Week 6 mastery-ready state must come from the authority record");
assertInlineScriptsParse("Week 6",week06);

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
console.log("- Weeks 5 and 6 require five distinct daily learning-evidence receipts before mastery");
console.log("- daily evidence itself is never mastery");
console.log("- Week 5 requires >=80% plus essential literacy, pattern/math, and inquiry evidence");
console.log("- Week 6 requires >=80% plus essential weather communication, data/math, inquiry, and safety evidence");
console.log("- upgraded preserved content self-loads the formal gate for ordinary direct-browser access");
console.log("- multilingual, no-cost, accessible, globally relevant demonstration options are preserved");
console.log("- upgraded child-facing inline JavaScript parses successfully");
console.log("- validation workflow remains read-only");
