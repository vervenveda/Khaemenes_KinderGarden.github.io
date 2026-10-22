const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "assets/khaemenes-kinder-continuity.js");
const KEY = {
  legacy: "khaemenes_kindergarten_36_aplus_v1",
  scoped: "khaemenes_kindergarten_records_by_learner_v1",
  active: "khaemenes_kindergarten_active_learner_v1"
};
const checks = [];
function test(name, fn) {
  fn();
  checks.push(name);
  console.log("PASS " + name);
}
function createHarness({ learnerId = "learner-a", legacy = null, scoped = {} } = {}) {
  const data = new Map();
  if (legacy !== null) data.set(KEY.legacy, JSON.stringify(legacy));
  data.set(KEY.scoped, JSON.stringify(scoped));
  const localStorage = {
    getItem(key) { return data.has(String(key)) ? data.get(String(key)) : null; },
    setItem(key, value) { data.set(String(key), String(value)); },
    removeItem(key) { data.delete(String(key)); },
    clear() { data.clear(); },
    raw(key) { return data.get(key) ?? null; }
  };
  const events = [];
  const window = {
    localStorage,
    KhaemenesFamilyRegistry: {
      getLearner() {
        return {
          learnerId,
          familyId: "family-test",
          nickname: learnerId,
          stage: "kindergarten",
          guardianRelease: { accepted: true, learnerId, version: "test" }
        };
      }
    },
    dispatchEvent(event) { events.push(event); return true; },
    addEventListener() {},
    removeEventListener() {},
    CustomEvent: class CustomEvent {
      constructor(type, init = {}) { this.type = type; this.detail = init.detail; }
    }
  };
  class CustomEvent {
    constructor(type, init = {}) { this.type = type; this.detail = init.detail; }
  }
  const context = { window, localStorage, CustomEvent, Date, Map, Object, Array, String, Number, Boolean, Math, JSON, console };
  vm.runInNewContext(fs.readFileSync(SOURCE, "utf8"), context, { filename: SOURCE, timeout: 3000 });
  return {
    api: window.KhaemenesKinderContinuity,
    localStorage,
    events,
    read(key) { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
  };
}

test("mismatched legacy record is not copied into a different learner", () => {
  const legacy = { learnerId: "learner-a", student: "Learner A", weekly: { "1": 95 }, midterm: 90, final: 0, portfolio: false };
  const h = createHarness({ learnerId: "learner-b", legacy });
  const state = h.api.loadCurriculumState();
  assert.equal(state.learnerId, "learner-b");
  assert.deepEqual(Object.keys(state.weekly), []);
  assert.deepEqual(h.read(KEY.legacy), legacy, "legacy owner's record must remain unchanged");
  const scoped = h.read(KEY.scoped);
  assert.equal(scoped["learner-b"].weekly["1"], undefined);
  assert.equal(scoped["learner-a"], undefined);
});

test("unowned legacy record is preserved and requires explicit adult-confirmed import", () => {
  const legacy = { student: "Older Kindergarten Record", weekly: { "2": 88 }, midterm: 0, final: 0, portfolio: false };
  const h = createHarness({ learnerId: "learner-b", legacy });
  h.api.loadCurriculumState();
  assert.equal(JSON.stringify(h.api.legacyMigrationStatus()), JSON.stringify({
    available: true,
    status: "identity-unverified",
    activeLearnerId: "learner-b",
    legacyLearnerId: null,
    requiresAdultConfirmation: true
  }));
  assert.equal(h.api.importLegacyCurriculumState({ learnerId: "learner-b" }).reason, "adult-confirmation-required");
  const result = h.api.importLegacyCurriculumState({ learnerId: "learner-b", adultConfirmed: true });
  assert.equal(result.ok, true);
  assert.equal(result.state.weekly["2"], 88);
  assert.equal(h.read(KEY.scoped)["learner-b"].migration.mode, "adult-confirmed-import");
  assert.deepEqual(h.read(KEY.legacy), legacy, "import must preserve the source record");
});

test("existing scoped progress cannot be overwritten by legacy import", () => {
  const legacy = { student: "Unowned Record", weekly: { "1": 81 } };
  const scoped = { "learner-b": { learnerId: "learner-b", student: "Learner B", weekly: { "3": 93 }, midterm: 0, final: 0, portfolio: false } };
  const h = createHarness({ learnerId: "learner-b", legacy, scoped });
  const result = h.api.importLegacyCurriculumState({ learnerId: "learner-b", adultConfirmed: true });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "existing-learner-progress-preserved");
  assert.equal(h.read(KEY.scoped)["learner-b"].weekly["3"], 93);
  assert.equal(h.read(KEY.legacy).weekly["1"], 81);
});

test("legacy record with matching learner ID is copied safely", () => {
  const legacy = { learnerId: "learner-a", student: "Learner A", weekly: { "1": 91 }, midterm: 0, final: 0, portfolio: false };
  const h = createHarness({ learnerId: "learner-a", legacy });
  const state = h.api.loadCurriculumState();
  assert.equal(state.weekly["1"], 91);
  assert.equal(h.read(KEY.scoped)["learner-a"].migration.mode, "identity-matched-copy");
  assert.equal(h.api.legacyMigrationStatus().status, "identity-match");
});

test("clearing one learner does not remove another learner's legacy record", () => {
  const legacy = { learnerId: "learner-a", student: "Learner A", weekly: { "1": 95 } };
  const scoped = { "learner-b": { learnerId: "learner-b", student: "Learner B", weekly: { "2": 86 }, midterm: 0, final: 0, portfolio: false } };
  const h = createHarness({ learnerId: "learner-b", legacy, scoped });
  assert.equal(h.api.clearActiveCurriculumRecord(), true);
  assert.deepEqual(h.read(KEY.legacy), legacy);
  assert.equal(h.read(KEY.scoped)["learner-b"], undefined);
});

console.log("\nContinuity migration regression: " + checks.length + " checks passed.");
