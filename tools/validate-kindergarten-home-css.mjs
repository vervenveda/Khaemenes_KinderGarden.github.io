#!/usr/bin/env node
import fs from "node:fs";
const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("assets/kindergarten-home-fresh-v1.css","utf8");
const problems=[];

if((html.match(/<style\b/gi)||[]).length) problems.push("inline <style> blocks returned");
const local=[...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)]
  .map(m=>m[1]).filter(h=>!/^https?:/i.test(h));
if(!local.includes("assets/kindergarten-home-fresh-v1.css")) problems.push("fresh Kindergarten stylesheet missing");
if(!html.includes('data-kindergarten-visual-standard="kindergarten-home-fresh-v1"')) problems.push("fresh visual marker missing");
const mounts=(html.match(/VNV_HEADER\.mount\(/g)||[]).length;
if(mounts!==1) problems.push("expected one VNV_HEADER.mount; found "+mounts);
if(!/VNV_HEADER\.mount\(\{[^;]*"actions":\[\]\}\);/s.test(html)) problems.push("Kindergarten header must be hamburger-only");
if(css.includes("kinder-playful-landing-20261027")||css.includes("kinder-final-four-color-pass-20261027")) problems.push("retired patch CSS returned");
if(!css.includes("KINDERGARTEN HOME · FRESH SINGLE-OWNER AUTHORITY")) problems.push("fresh authority marker missing");
if(!css.includes("font-size:18px!important")) problems.push("18px readable floor missing");
if(!css.includes("--kg-shell:1080px")) problems.push("1080px shared width missing");
if(!css.includes("background:var(--kg-sky)!important")) problems.push("calm sky hero missing");
const accordions=[...html.matchAll(/<details class="kinder-feature-accordion"[^>]*data-kinder-feature="([^"]+)"[^>]*>/g)];
if(accordions.length!==11) problems.push("expected 11 Kindergarten accordions; found "+accordions.length);
if(accordions.some(m=>/\bopen\b/.test(m[0]))) problems.push("Kindergarten feature accordions must be collapsed by default");
for(const feature of ["welcome","tray","life","curriculum","library","apps","creche","mentor","garden","today","promise"]){
  if(!html.includes('data-kinder-feature="'+feature+'"')) problems.push("missing Kindergarten accordion: "+feature);
}
if(!css.includes("--kg-accordion:960px")) problems.push("960px accordion width missing");
if(!html.includes("openForTarget(target)")) problems.push("accordion-aware hash navigation missing");
if(!html.includes('<div class="shell hero-logo-stage">')) problems.push("simplified logo hero stage missing");
const shelf=(html.match(/<div class="kinder-quick-links"[\\s\\S]*?<\\/div>/)||[])[0]||"";
const shelfControls=(shelf.match(/<(?:a|button)\\b/g)||[]).length;
if(shelfControls!==8) problems.push("expected 8 hero shelf controls; found "+shelfControls);
if(html.includes('<article class="hero-copy">')) problems.push("old open hero information card returned");
if(problems.length){console.error(JSON.stringify({status:"FAIL",problems},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",inlineStyles:0,headerMounts:mounts,cssBytes:css.length,fontFloor:"18px",shell:"1080px"},null,2));
