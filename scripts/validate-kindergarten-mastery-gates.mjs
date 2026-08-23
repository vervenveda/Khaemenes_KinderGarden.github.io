import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const ROOT=process.cwd();
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const gate=read("assets/khaemenes-kinder-mastery-gates.js");
const app=read("curriculum/assets/app.js");
const index=read("curriculum/index.html");
const mastery=read("curriculum/mastery/index.html");
const TAG="data-khaemenes-kindergarten-formal-gate";

assert.ok(gate.includes('const PASS=80'),"formal mastery threshold must remain 80%");
assert.ok(gate.includes('const TOTAL_WEEKS=36'),"formal curriculum must remain 36 weeks");
assert.ok(gate.includes('reviewedUnlocks:false'),"reviewed must not unlock curriculum");
assert.ok(gate.includes('legacyScoresUnlock:false'),"legacy typed scores must not unlock curriculum");
assert.ok(gate.includes('directUrlUnlocks:false'),"direct URLs must not unlock curriculum");
assert.ok(gate.includes('bestMasteryPreserved:true'),"best demonstrated mastery must be preserved");
assert.ok(gate.includes('const best=Math.max(old.bestPercent,percent)'),"later lower attempts must not erase best mastery");
assert.ok(gate.includes('adultAffirmed!==true'),"formal evidence must require adult affirmation");
assert.ok(gate.includes('if(n>=19&&!milestoneMastery("midterm").mastered)return false'),"Week 19+ must require midyear mastery");
assert.ok(gate.includes('for(let i=1;i<=18;i++)if(!weekMastery(i).mastered)return false'),"midyear must require Weeks 1-18 mastery");
assert.ok(gate.includes('for(let i=1;i<=TOTAL_WEEKS;i++)if(!weekMastery(i).mastered)return false'),"final must require all 36 weeks mastery");
assert.ok(gate.includes('week-assessment'),"legacy unit assessments must be recognized by the gate");
assert.ok(gate.includes('midterm.html'),"legacy midterm URL must be recognized by the gate");
assert.ok(gate.includes('final-exam.html'),"legacy final URL must be recognized by the gate");
assert.ok(gate.includes('redirectLegacyAssessment'),"eligible legacy assessments must route to current mastery evidence");
assert.ok(gate.includes('clearActiveMasteryRecord'),"record reset must be explicit and separate from later practice");

assert.ok(app.includes('const GATES=window.KhaemenesKinderMasteryGates'),"curriculum dashboard must consume the mastery gate engine");
assert.ok(app.includes('GATES.weekMastery'),"dashboard must read learner mastery receipts");
assert.ok(app.includes('GATES?.milestoneMastery'),"dashboard must read midyear/final receipts");
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
const lessons=fs.readdirSync(lessonRoot,{withFileTypes:true})
  .filter(e=>e.isDirectory()&&/^unit-\d{2}$/.test(e.name))
  .map(e=>path.join("curriculum","lessons",e.name,"index.html"))
  .filter(p=>fs.existsSync(path.join(ROOT,p)))
  .sort();
assert.equal(lessons.length,36,"all 36 formal Kindergarten lesson pages must exist");

const assessmentRoot=path.join(ROOT,"curriculum","assessments");
const assessments=fs.readdirSync(assessmentRoot,{withFileTypes:true})
  .filter(e=>e.isFile()&&(/^unit-\d{2}-assessment\.html$/.test(e.name)||["midterm.html","final-exam.html","weekly-assessments.html"].includes(e.name)))
  .map(e=>path.join("curriculum","assessments",e.name))
  .sort();
assert.equal(assessments.length,39,"36 unit assessments plus weekly index, midterm, and final must be accounted for");

for(const file of [...lessons,...assessments]){
  const html=read(file);
  assert.ok(html.includes(TAG),`${file} must load the fail-closed formal gate`);
  assert.ok(html.indexOf(TAG)<html.toLowerCase().indexOf("</head>"),`${file} gate must load in the head before learner content renders`);
}

console.log(`Kindergarten Academy Mastery Contract: PASS`);
console.log(`- 36 formal lesson surfaces fail closed`);
console.log(`- 39 legacy assessment surfaces are intercepted`);
console.log(`- 75 total guarded formal surfaces`);
console.log(`- lesson, midyear, final, and portfolio progression cannot be created by typed percentages`);
console.log(`- 80% minimum, sequential prerequisites, best mastery preservation, and deliberate reset are enforced`);
