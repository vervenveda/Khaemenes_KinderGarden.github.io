import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const ROOT=process.cwd();
const rel=p=>path.relative(ROOT,p).split(path.sep).join("/");
const excluded=new Set([".git","node_modules","historical","history","archive","archives","backup","backups"]);
function walk(dir,out=[]){
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    if(ent.isDirectory()&&excluded.has(ent.name.toLowerCase()))continue;
    const full=path.join(dir,ent.name);
    if(ent.isDirectory())walk(full,out);
    else if(ent.isFile()&&/\.(?:html|js|css)$/i.test(ent.name))out.push(full);
  }
  return out;
}
const files=walk(ROOT).filter(p=>!rel(p).startsWith("scripts/")||rel(p)==="scripts/validate-dependency-boundary.mjs");
const errors=[];
const approvedOwnedRuntimeUrls=new Set([
  "https://vervenveda.com/Khaemenes_KinderGarden.github.io/assets/khaemenes-kinder-mastery-gates.js",
  "https://vervenveda.com/assets/vnv-beta-link.js",
  "https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js",
  "https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-learning-continuation.js"
]);
let approvedOwnedRuntimeCount=0;
const remoteRuntimeTag=/<(?:script|link|iframe|audio|source|img|video|track)\b[^>]*(?:src|href|poster)=["']\s*https?:\/\/[^"']+["'][^>]*>/gi;
const externalFetch=/\bfetch\s*\(\s*["'`]\s*https?:\/\//i;
const externalImport=/\bimport\s*\(\s*["'`]\s*https?:\/\//i;
const externalXhr=/\.open\s*\(\s*["'][A-Z]+["']\s*,\s*["'`]\s*https?:\/\//i;
const remoteCssImport=/@import\s+(?:url\()?\s*["']?https?:\/\//i;
const remoteFont=/fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net/i;
const unsafeBlank=/<a\b[^>]*target=["']_blank["'][^>]*>/gi;

for(const full of files){
  const p=rel(full),text=fs.readFileSync(full,"utf8");
  for(const m of text.matchAll(remoteRuntimeTag)){
    const resource=m[0].match(/(?:src|href|poster)=["'](https?:\/\/[^"']+)["']/i)?.[1];
    if(resource&&approvedOwnedRuntimeUrls.has(resource)){
      approvedOwnedRuntimeCount++;
    }else{
      errors.push(p+": unapproved remote runtime resource tag: "+m[0].replace(/\s+/g," ").slice(0,180));
    }
  }
  if((/\.(?:js|html)$/i).test(p)){
    if(externalFetch.test(text))errors.push(p+": direct fetch() to a literal third-party URL");
    if(externalImport.test(text))errors.push(p+": dynamic import() from a literal third-party URL");
    if(externalXhr.test(text))errors.push(p+": XMLHttpRequest.open() to a literal third-party URL");
  }
  if(/\.(?:css|html)$/i.test(p)&&remoteCssImport.test(text))errors.push(p+": remote CSS @import");
  if(remoteFont.test(text))errors.push(p+": remote font-provider reference");
  for(const m of text.matchAll(unsafeBlank)){
    const tag=m[0];
    if(/href=["']\s*https?:\/\//i.test(tag)&&!/\brel=["'][^"']*\bnoopener\b/i.test(tag))
      errors.push(p+": external target=_blank link missing rel=noopener: "+tag.replace(/\s+/g," ").slice(0,180));
  }
}
const workflow=fs.readFileSync(path.join(ROOT,".github/workflows/kindergarten-formal-gate-rollout.yml"),"utf8");
assert.match(workflow,/uses:\s+actions\/checkout@[0-9a-f]{40}/,"checkout must be pinned to a full commit SHA");
assert.match(workflow,/uses:\s+actions\/setup-node@[0-9a-f]{40}/,"setup-node must be pinned to a full commit SHA");
assert.match(workflow,/persist-credentials:\s*false/,"checkout credentials must not persist");
assert.match(workflow,/permissions:\s*\n\s+contents:\s+read/,"CI must remain read-only");
assert.ok(!workflow.includes("contents: write")&&!workflow.includes("git push"),"CI must not gain write authority");
if(errors.length){
  console.error("Dependency boundary: FAIL");
  console.error(errors.join("\n"));
  process.exitCode=1;
}else{
  console.log("Dependency boundary: PASS");
  console.log("- no unapproved remote runtime resources; approved owned-ecosystem runtime tags: "+approvedOwnedRuntimeCount);
  console.log("- no remote font providers");
  console.log("- no literal third-party fetch/import/XHR calls");
  console.log("- no remote CSS imports");
  console.log("- external new-tab links use noopener");
  console.log("- CI actions immutable-pinned, least-privilege, and credential-clean");
  console.log("Scanned "+files.length+" HTML/JS/CSS source files.");
}
