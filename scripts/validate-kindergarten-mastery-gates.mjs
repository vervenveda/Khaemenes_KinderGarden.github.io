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

assert.ok(gate.includes('const PASS=80'),"formal mastery threshold must remain 80%");
assert.ok(gate.includes('const TOTAL_WEEKS=36'),"formal curriculum must remain 36 weeks");
assert.ok(gate.includes('reviewedUnlocks:false'),"reviewed must not unlock curriculum");
assert.ok(gate.includes('legacyScoresUnlock:false'),"legacy typed scores must not unlock curriculum");
assert.ok(gate.includes('directUrlUnlocks:false'),"direct canonical URLs must not unlock curriculum");
assert.ok(gate.includes('bestMasteryPreserved:true'),"best demonstrated mastery must be preserved");
assert.ok(gate.includes('const best=Math.max(old.bestPercent,percent)'),"later lower attempts must not erase best mastery");
assert.ok(gate.includes('adultAffirmed!==true'),"formal evidence must require adult affirmation");
assert.ok(gate.includes('if(n>=19&&!milestoneMastery("midterm").mastered)return false'),"Week 19+ must require midyear mastery");
assert.ok(gate.includes('for(let i=1;i<=18;i++)if(!weekMastery(i).mastered)return false'),"midyear must require Weeks 1-18 mastery");
assert.ok(gate.includes('for(let i=1;i<=TOTAL_WEEKS;i++)if(!weekMastery(i).mastered)return false'),"final must require all 36 weeks mastery");
assert.ok(gate.includes('week-assessment'),"legacy unit assessment URLs must be recognized");
assert.ok(gate.includes('midterm\\.html'),"legacy midterm URL must be recognized");
assert.ok(gate.includes('final-exam\\.html'),"legacy final URL must be recognized");
assert.ok(gate.includes('redirectLegacyAssessment'),"eligible legacy assessment URLs must route to current mastery evidence");
assert.ok(gate.includes('clearActiveMasteryRecord'),"record reset must be explicit and separate from later practice");

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

const lessonRoot=path.join(ROOT,"curriculum","lessons");
const lessonDirs=fs.readdirSync(lessonRoot,{withFileTypes:true}).filter(e=>e.isDirectory()&&/^unit-\d{2}$/.test(e.name)).map(e=>e.name).sort();
assert.equal(lessonDirs.length,36,"all 36 formal Kindergarten lesson directories must exist");
for(const dir of lessonDirs){
  const canonical=`curriculum/lessons/${dir}/index.html`;
  const preserved=`curriculum/lessons/${dir}/formal-content.html`;
  assert.ok(exists(canonical),`${canonical} must exist`);
  assert.ok(exists(preserved),`${preserved} must preserve the original lesson body`);
  const html=read(canonical);
  assert.ok(html.includes(TAG),`${canonical} must load the fail-closed formal gate`);
  assert.ok(html.indexOf(TAG)<html.toLowerCase().indexOf("</head>"),`${canonical} gate must load in the head`);
  assert.ok(html.includes('fetch("formal-content.html"'),`${canonical} may hydrate preserved content only after the gate opens`);
}

const assessmentRoot=path.join(ROOT,"curriculum","assessments");
const assessmentNames=fs.readdirSync(assessmentRoot,{withFileTypes:true})
  .filter(e=>e.isFile()&&(/^unit-\d{2}-assessment\.html$/.test(e.name)||["midterm.html","final-exam.html","weekly-assessments.html"].includes(e.name)))
  .map(e=>e.name).sort();
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

console.log("Kindergarten Academy Mastery Contract: PASS");
console.log("- 36 canonical lesson routes fail closed and hydrate preserved lesson bodies only after eligibility");
console.log("- 39 canonical legacy assessment routes are intercepted");
console.log("- 75 total learner-facing formal routes are guarded");
console.log("- original lesson bodies and already-published self-check artifacts are preserved separately");
console.log("- typed percentages cannot create formal progression");
console.log("- 80% minimum, sequential prerequisites, best mastery preservation, adult affirmation, and deliberate reset are enforced");
console.log("- validation workflow is read-only");

// Human-authored CI retrigger; no validation semantics changed.
