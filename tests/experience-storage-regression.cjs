const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const ROOT = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(ROOT, "assets/khaemenes-kinder-experience.js"), "utf8");
const checks = [];
function test(name, fn) {
  fn();
  checks.push(name);
  console.log("PASS " + name);
}
function extractBetween(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, "could not extract source block: " + startMarker);
  return source.slice(start, end).trim();
}
const writerSource = extractBetween("  function writeJSON(key,value){", "\n\n  function learner()");
const saveSource = extractBetween("  function saveObservation(level){", "\n\n  function allActivityRecords()");
function makeSaveHarness({ failWrites = false } = {}) {
  const data = new Map();
  const storage = {
    getItem(key) { return data.has(String(key)) ? data.get(String(key)) : null; },
    setItem(key, value) {
      if (failWrites) throw new Error("storage unavailable");
      data.set(String(key), String(value));
    }
  };
  const global = { localStorage: storage };
  const writeJSON = new Function("global", writerSource + "\nreturn writeJSON;")(global);
  let contextSyncs = 0, renders = 0;
  const KEY_A = { observations: "khaemenes_kindergarten_observations_v1" };
  const api = new Function(
    "KEYS", "learnerId", "position", "lessonMatch", "observationGuide",
    "allObservationRecords", "writeJSON", "syncContext", "renderFamilySnapshot",
    saveSource + "\nreturn saveObservation;"
  )(
    KEY_A,
    () => "child-A",
    () => ({ type: "lesson", week: 3, lesson: 2, title: "Plant needs" }),
    () => null,
    () => ({ domain: "science", prompt: "What did the learner notice?" }),
    () => {
      const raw = storage.getItem(KEY_A.observations);
      return raw ? JSON.parse(raw) : {};
    },
    writeJSON,
    () => { contextSyncs++; },
    () => { renders++; }
  );
  return { api, storage, data, get contextSyncs(){return contextSyncs;}, get renders(){return renders;}, key:KEY_A.observations };
}

test("missing localStorage is reported as a failed JSON write", () => {
  const global = {};
  const writeJSON = new Function("global", writerSource + "\nreturn writeJSON;")(global);
  assert.equal(writeJSON("note", { saved: true }), false);
});

test("observation save propagates a storage failure without success side effects", () => {
  const h = makeSaveHarness({ failWrites: true });
  assert.equal(h.api("growing"), false);
  assert.equal(h.storage.getItem(h.key), null);
  assert.equal(h.contextSyncs, 0, "failed save must not sync a successful-looking context");
  assert.equal(h.renders, 0, "failed save must not render a saved observation");
});

test("successful observation save persists before reporting success", () => {
  const h = makeSaveHarness();
  assert.equal(h.api("explaining"), true);
  const saved = JSON.parse(h.storage.getItem(h.key));
  assert.equal(saved["child-A"].length, 1);
  assert.equal(saved["child-A"][0].level, "explaining");
  assert.equal(h.contextSyncs, 1);
  assert.equal(h.renders, 1);
});

test("family UI visibly distinguishes failed observation save", () => {
  assert.ok(source.includes('button.textContent="Not saved — retry"'));
  assert.ok(source.includes('button.setAttribute("aria-label","Observation not saved. Try again.")'));
  assert.ok(source.includes('if(!writeJSON(KEYS.observations,records))return false;'));
});

console.log("\nExperience storage regression: " + checks.length + " checks passed.");
