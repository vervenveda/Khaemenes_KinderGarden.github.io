import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const routerPath = path.join(ROOT, "assets/khaemenes-kinder-mastery-gates.js");
const router = fs.readFileSync(routerPath, "utf8");
new vm.Script(router, { filename: routerPath });

const exists = relative => fs.existsSync(path.join(ROOT, relative));
const failures = [];
const pass = message => console.log("PASS " + message);
const verify = (condition, message) => {
  if (!condition) failures.push(message);
  else pass(message);
};

verify(
  router.includes(String.raw`/\/lessons\/unit-(\d{2})\/index\.html$/i`) &&
  router.includes("global.location.replace(nextUrl.href)"),
  "legacy lesson aliases redirect to the canonical route before hydration"
);
verify(
  router.includes(String.raw`/\/assessments\/unit-(\d{2})-assessment\.html$/i`),
  "legacy unit-assessment aliases enter the learner-scoped mastery gate"
);
verify(
  router.includes(String.raw`/\/assessments\/midterm\.html$/i`) &&
  router.includes(String.raw`/\/assessments\/final-exam\.html$/i`) &&
  router.includes(String.raw`/\/assessments\/weekly-assessments\.html$/i`),
  "legacy midterm, final, and weekly-hub aliases are recognized"
);

for (let unit = 1; unit <= 36; unit++) {
  const n = String(unit).padStart(2, "0");
  const legacyLessonPath = `lessons/unit-${n}/index.html`;
  const legacyLessonContent = exists(legacyLessonPath) ? fs.readFileSync(path.join(ROOT, legacyLessonPath), "utf8") : "";
  const canonicalLessonTarget = `../../curriculum/lessons/unit-${n}/index.html`;
  verify(exists(legacyLessonPath), `legacy lesson alias exists for Unit ${n}`);
  verify(exists(`curriculum/lessons/unit-${n}/index.html`), `canonical lesson exists for Unit ${n}`);
  verify(legacyLessonContent.includes("khaemenes-legacy-route-redirect"), `legacy lesson Unit ${n} has self-contained redirect fallback`);
  verify(legacyLessonContent.includes(`content="0;url=${canonicalLessonTarget}"`), `legacy lesson Unit ${n} targets its canonical route`);
  verify(legacyLessonContent.includes("target.search=location.search;target.hash=location.hash;location.replace(target.href)"), `legacy lesson Unit ${n} preserves query and fragment`);
  verify(exists(`assessments/unit-${n}-assessment.html`), `legacy assessment alias exists for Unit ${n}`);
  verify(exists(`curriculum/assessments/unit-${n}-assessment.html`), `canonical assessment exists for Unit ${n}`);
}

const special = [
  ["assessments/weekly-assessments.html", "curriculum/assessments/weekly-assessments.html", "weekly hub"],
  ["assessments/midterm.html", "curriculum/assessments/midterm.html", "midterm"],
  ["assessments/final-exam.html", "curriculum/assessments/final-exam.html", "final"]
];
for (const [legacy, canonical, label] of special) {
  verify(exists(legacy), `legacy ${label} route exists`);
  verify(exists(canonical), `canonical ${label} route exists`);
}

function routeMatches(pattern, pathname) {
  const match = pathname.match(pattern);
  return match;
}
const lessonAlias = /\/lessons\/unit-(\d{2})\/index\.html$/i;
const assessmentAlias = /\/assessments\/unit-(\d{2})-assessment\.html$/i;
verify(routeMatches(lessonAlias, "/lessons/unit-01/index.html")?.[1] === "01",
  "root lesson alias matches Unit 01");
verify(routeMatches(lessonAlias, "/Khaemenes_KinderGarden.github.io/lessons/unit-36/index.html")?.[1] === "36",
  "repository-prefixed lesson alias matches Unit 36");
verify(routeMatches(assessmentAlias, "/assessments/unit-01-assessment.html")?.[1] === "01",
  "root assessment alias matches Unit 01");
verify(routeMatches(assessmentAlias, "/Khaemenes_KinderGarden.github.io/assessments/unit-36-assessment.html")?.[1] === "36",
  "repository-prefixed assessment alias matches Unit 36");

if (failures.length) {
  console.error(`\\nFAIL: ${failures.length} legacy route check(s)`);
  failures.forEach(message => console.error(" - " + message));
  process.exit(1);
}
console.log(`\\nPASS: legacy formal route coverage complete ( ${36 * 7 + 3 * 2 + 7} checks )`);
