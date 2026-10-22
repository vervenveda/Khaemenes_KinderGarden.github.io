const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const ROOT = path.resolve(__dirname, "..");
const HELPER = path.join(ROOT, "assets/khaemenes-portfolio-scope.js");
const PORTFOLIO = path.join(ROOT, "portfolio-builder/index.html");
function harness({ active = null, registry = null } = {}) {
  const data = new Map();
  if (active) data.set("khaemenes_kindergarten_active_learner_v1", JSON.stringify(active));
  if (registry) data.set("khaemenes_family_registry_v1", JSON.stringify(registry));
  const localStorage = {
    getItem(key) { return data.has(String(key)) ? data.get(String(key)) : null; },
    setItem(key, value) { data.set(String(key), String(value)); },
    removeItem(key) { data.delete(String(key)); }
  };
  const window = { localStorage, KhaemenesFamilyRegistry: null, KhaemenesKinderContinuity: null };
  vm.runInNewContext(fs.readFileSync(HELPER, "utf8"), { window, localStorage, URL, encodeURIComponent, String, Object, Array, RegExp }, { filename: HELPER });
  return { api: window.KhaemenesPortfolioScope, localStorage };
}
const checks = [];
function test(name, fn) {
  fn();
  checks.push(name);
  console.log("PASS " + name);
}

test("active Kindergarten learner ID is detected from the canonical continuity key", () => {
  const h = harness({ active: { learnerId: "child-a", nickname: "A", stage: "kindergarten" } });
  assert.equal(h.api.detectActiveLearner(h.localStorage).learnerId, "child-a");
});

test("portfolio storage keys are partitioned and legacy key is not reused", () => {
  const h = harness();
  assert.equal(h.api.storageKey("child-a"), h.api.legacyKey + "::learner:child-a");
  assert.notEqual(h.api.storageKey("child-a"), h.api.storageKey("child-b"));
  assert.notEqual(h.api.storageKey(null), h.api.legacyKey);
  assert.equal(h.api.storageKey(null), h.api.legacyKey + "::unlinked");
});

test("ownership inspection accepts canonical learner IDs from supported export envelopes", () => {
  const h = harness();
  assert.equal(h.api.ownerOf({ learnerId: "child-a" }), "child-a");
  assert.equal(h.api.ownerOf({ state: { learnerId: "child-b" } }), "child-b");
  assert.equal(h.api.ownerOf({ profile: { learnerId: "child-c" } }), "child-c");
  assert.equal(h.api.ownerOf({ profile: { child: "A name only" } }), null);
});

test("cross-learner imports are blocked even if adult confirmation is supplied", () => {
  const h = harness();
  assert.deepEqual(
    JSON.parse(JSON.stringify(h.api.assessImport({ learnerId: "child-a" }, "child-b", { explicitAdultConfirmation: true }))),
    { allowed: false, reason: "different-learner", owner: "child-a", activeLearnerId: "child-b" }
  );
});

test("unowned import requires explicit adult confirmation for an active learner", () => {
  const h = harness();
  assert.equal(h.api.assessImport({ profile: { child: "Old name" } }, "child-a").reason, "adult-confirmation-required");
  assert.equal(h.api.assessImport({ profile: { child: "Old name" } }, "child-a", { explicitAdultConfirmation: true }).allowed, true);
});

test("unlinked workspace may import a file without attaching it to a child", () => {
  const h = harness();
  const result = h.api.assessImport({ learnerId: "child-a", profile: { child: "A" } }, null);
  assert.equal(result.allowed, true);
  assert.equal(result.reason, "unlinked-import");
});

test("portfolio page uses learner-scoped key and explicit ownership checks", () => {
  const html = fs.readFileSync(PORTFOLIO, "utf8");
  assert.ok(html.includes('src="../assets/khaemenes-portfolio-scope.js"'));
  assert.ok(html.includes("const KEY=SCOPE.storageKey(ACTIVE_LEARNER_ID)"));
  assert.ok(html.includes("SCOPE.assessImport(obj,ACTIVE_LEARNER_ID)"));
  assert.ok(html.includes("owner!==ACTIVE_LEARNER_ID"));
  assert.ok(html.includes("function importLegacyPortfolio()"));
  assert.ok(html.includes('mode:"adult-confirmed-import"'));
  assert.ok(html.includes("portfolioScopeChanged"));
  assert.ok(html.includes("learnerId:ACTIVE_LEARNER_ID,exportedAt"));
  assert.ok(html.includes('id="legacyPortfolioPanel"'));
});

console.log("\nPortfolio scope regression: " + checks.length + " checks passed.");
