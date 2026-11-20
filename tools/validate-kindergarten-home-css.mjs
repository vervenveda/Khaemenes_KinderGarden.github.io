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
if(problems.length){console.error(JSON.stringify({status:"FAIL",problems},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",inlineStyles:0,headerMounts:mounts,cssBytes:css.length,fontFloor:"18px",shell:"1080px"},null,2));
