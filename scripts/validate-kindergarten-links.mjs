import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const ROOT = process.cwd();
const SKIP_DIRS = new Set([".git", "node_modules", ".next", "dist", "build"]);
const EXTERNAL_SCHEMES = /^(?:https?:|mailto:|tel:|data:|javascript:|blob:|\/\/)/i;
const htmlFiles = [];
const externalMounts = new Set();
const missing = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name));
    } else if (entry.isFile() && /\.html?$/i.test(entry.name)) {
      htmlFiles.push(path.join(dir, entry.name));
    }
  }
}
function normalizeUrl(raw) {
  let value = raw.trim();
  try { value = decodeURIComponent(value); } catch {}
  return value;
}
function resolveLocal(fromFile, raw) {
  const withoutQueryOrHash = raw.split("#")[0].split("?")[0];
  if (!withoutQueryOrHash) return { target: fromFile, fragmentOnly: true };
  const target = withoutQueryOrHash.startsWith("/")
    ? path.join(ROOT, withoutQueryOrHash.replace(/^\/+/, ""))
    : path.resolve(path.dirname(fromFile), withoutQueryOrHash);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    const index = path.join(target, "index.html");
    if (fs.existsSync(index)) return { target: index, fragmentOnly: false };
  }
  return { target, fragmentOnly: false };
}
walk(ROOT);
for (const file of htmlFiles) {
  const source = fs.readFileSync(file, "utf8");
  const refs = /\b(?:href|src|action|poster|data-src)\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = refs.exec(source))) {
    const raw = normalizeUrl(match[2]);
    if (!raw || raw.startsWith("#") || EXTERNAL_SCHEMES.test(raw) || raw.includes("$" + "{")) continue;
    // These paths are intentional cross-mount integrations, not files in this repository.
    // They are reported as deployment dependencies for separate live-host verification.
    if (raw.startsWith("/stos/")) {
      externalMounts.add(raw);
      continue;
    }
    const { target } = resolveLocal(file, raw);
    if (!fs.existsSync(target)) {
      missing.push({
        from: path.relative(ROOT, file).replaceAll(path.sep, "/"),
        reference: raw,
        target: path.relative(ROOT, target).replaceAll(path.sep, "/")
      });
    }
  }
}

console.log("Kindergarten HTML link and asset audit");
console.log("- HTML files scanned: " + htmlFiles.length);
console.log("- Distinct /stos/ cross-mount references to verify separately: " + externalMounts.size);
if (externalMounts.size) {
  for (const item of [...externalMounts].sort()) console.log("  EXTERNAL-MOUNT " + item);
}
if (missing.length) {
  console.error("- Missing local targets: " + missing.length);
  for (const item of missing) {
    console.error("  " + item.from + " -> " + item.reference + " (resolves to " + item.target + ")");
  }
}
assert.equal(missing.length, 0, "HTML contains broken local links or assets");
console.log("Khaemenes Kinder Garden local link audit: PASS");
