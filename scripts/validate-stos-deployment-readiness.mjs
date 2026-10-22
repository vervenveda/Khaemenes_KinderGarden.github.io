#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_PATH = path.join(ROOT, "contracts/STOS_DEPLOYMENT_REQUIREMENTS_v1.json");
const REQUIRE_LIVE = process.argv.includes("--require-live");
const contract = JSON.parse(fs.readFileSync(CONTRACT_PATH, "utf8"));
const excluded = new Set([".git", "node_modules", ".next", "dist", "build", "historical", "history", "archive", "archives", "backup", "backups"]);
const sourceFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!excluded.has(entry.name.toLowerCase())) walk(path.join(dir, entry.name));
    } else if (entry.isFile() && /\.(?:html?|js|css)$/i.test(entry.name)) {
      sourceFiles.push(path.join(dir, entry.name));
    }
  }
}
function relative(file) {
  return path.relative(ROOT, file).split(path.sep).join("/");
}
function normalRoute(value) {
  const raw = String(value || "").trim();
  const route = raw.split(/[?#]/, 1)[0];
  return route.startsWith("/stos/") ? route : null;
}
function classify(route) {
  const requiredExact = contract.required.find(item => item.path === route);
  if (requiredExact) return { status: "required", item: requiredExact };
  const optionalExact = contract.optionalExact.find(item => item.path === route);
  if (optionalExact) return { status: "optional", item: optionalExact };
  const prefixes = [
    ...contract.required.filter(item => item.prefix === true),
    ...contract.optionalPrefixes.map(item => ({ ...item, classification: "optional" }))
  ].filter(item => route.startsWith(item.path)).sort((a, b) => b.path.length - a.path.length);
  if (!prefixes.length) return null;
  const item = prefixes[0];
  return { status: item.classification || "optional", item };
}

walk(ROOT);
const references = new Map();
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  // HTML attributes and quoted route constants in JS/HTML/CSS. Match both
  // quote styles plus escaped-backtick template strings without evaluating code.
  const patterns = [
    /\b(?:href|src|action|poster|data-src)\s*=\s*(["'])(\/stos\/[^"']+)\1/gi,
    /(["'\x60])(\/stos\/[^"'\x60\s]+)\1/g
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const route = normalRoute(match[2] || match[3]);
      if (!route) continue;
      if (!references.has(route)) references.set(route, new Set());
      references.get(route).add(relative(file));
    }
  }
}

const unknown = [...references.entries()].filter(([route]) => !classify(route));
if (unknown.length) {
  console.error("STOS deployment contract: FAIL — unclassified mount reference(s)");
  for (const [route, from] of unknown) {
    console.error("  " + route + " referenced by " + [...from].slice(0, 4).join(", "));
  }
  process.exit(1);
}

const counts = { required: 0, optional: 0 };
for (const [route] of references) counts[classify(route).status]++;
console.log("STOS deployment contract: STATIC PASS");
console.log("- unique literal /stos/ routes classified: " + references.size);
console.log("- required references: " + counts.required);
console.log("- optional references: " + counts.optional);
console.log("- local-link validation does not certify a remote STOS mount");

const rawBase = String(process.env.STOS_DEPLOYMENT_BASE_URL || "").trim();
if (!rawBase) {
  console.log("LIVE STOS readiness: NOT CHECKED — STOS_DEPLOYMENT_BASE_URL is not configured.");
  console.log("The system remains a STOS-wired candidate; do not claim the mount is commissioned.");
  if (REQUIRE_LIVE) {
    console.error("BLOCKED: live readiness requires STOS_DEPLOYMENT_BASE_URL and successful required-route probes.");
    process.exit(1);
  }
  process.exit(0);
}

let base;
try {
  base = new URL(rawBase);
  assert.ok(base.protocol === "https:" || ["localhost", "127.0.0.1", "::1"].includes(base.hostname),
    "STOS deployment base must use HTTPS outside localhost");
  assert.ok(base.pathname === "/" && !base.search && !base.hash,
    "STOS_DEPLOYMENT_BASE_URL must be an origin only (for example https://stos.example.org)");
} catch (error) {
  console.error("STOS deployment readiness: invalid base URL — " + error.message);
  process.exit(1);
}

async function probe(item) {
  const url = new URL(item.path, base);
  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(12000),
      headers: { Accept: item.kind === "javascript" ? "text/javascript, application/javascript, */*" : "text/html, application/json, */*" }
    });
  } catch (error) {
    return { path: item.path, ok: false, detail: "request failed: " + (error?.message || error) };
  }
  const status = response.status;
  if (item.kind === "javascript") {
    if (status !== 200) return { path: item.path, ok: false, status, detail: "required asset must return HTTP 200" };
    const body = await response.text();
    if (item.contentMarker && !body.includes(item.contentMarker)) {
      return { path: item.path, ok: false, status, detail: "HTTP 200 response lacks expected asset marker " + item.contentMarker };
    }
    const type = response.headers.get("content-type") || "";
    if (type && !/(?:javascript|ecmascript|text\/plain)/i.test(type)) {
      return { path: item.path, ok: false, status, detail: "unexpected asset content type " + type };
    }
    return { path: item.path, ok: true, status, detail: "asset marker and response type verified" };
  }
  if (status < 200 || status >= 400) {
    return { path: item.path, ok: false, status, detail: "required page returned a non-success status" };
  }
  return { path: item.path, ok: true, status, detail: status >= 300 ? "route redirects; reachability verified" : "route responds" };
}

let liveFailures = 0;
for (const item of contract.required) {
  const result = await probe(item);
  console.log((result.ok ? "PASS " : "FAIL ") + result.path + " — HTTP " + (result.status ?? "no response") + " — " + result.detail);
  if (!result.ok) liveFailures++;
}
for (const item of contract.optionalExact) {
  const result = await probe({ ...item, kind: "javascript" });
  console.log((result.ok ? "INFO " : "WARN ") + result.path + " — " + result.detail);
}

if (liveFailures) {
  console.error("STOS deployment readiness: FAIL — " + liveFailures + " required probe(s) failed.");
  process.exit(1);
}
console.log("STOS deployment readiness: LIVE PASS — all required route probes succeeded.");
