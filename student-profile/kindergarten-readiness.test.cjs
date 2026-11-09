"use strict";
// node student-profile/kindergarten-readiness.test.cjs
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"index.html"),"utf8");
const markup=html.slice(0,html.indexOf("<script>"));
const after=html.slice(html.indexOf("<script>"));
const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const required=["kinderLegacyPhotoControls","kinderHeroPictureEditor","kinderToolbarPictureEditor","colorStudio","photoPreview","adultConfirm","childPhoto","kinderYearbookPicture","openYearbookFromProfile","kinderFrameChoices","learnerSelect","todayCard","favorites","garden","stickerCard","grownups","profileStudio","importLook","lookStatus"];
for(const id of required)assert.equal(ids.filter(x=>x===id).length,1,"unique existing owner: "+id);
assert.ok(!markup.includes('id="pictureStudio"'),"Large photo editor card removed");
assert.ok(markup.indexOf('id="kinderLegacyPhotoControls"')<markup.indexOf('id="todayCard"'),"Legacy learner photo and backup controls preserved without visible card");
assert.ok(markup.indexOf('id="colorStudio"')<markup.indexOf('id="todayCard"'),"Garden controls remain near top");
assert.ok(markup.indexOf('id="stickerCard"')>markup.indexOf('id="garden"'),"Mastery and reward sections retained");
assert.ok(markup.includes('id="kinderHeroPictureEditor"')&&markup.includes('id="kinderToolbarPictureEditor"'),"Both hero picture buttons open shared dialog");
assert.ok(markup.includes('href="#grownups"'),"Family tools shortcut");
assert.ok(markup.includes('class="kinder-ready"'),"Scoped Academy design system");
assert.ok(markup.includes("body.kinder-ready .hero-grid"),"Responsive hero design");
assert.ok(markup.includes("body.kinder-ready .shell{width:min(94%,1240px)"),"Desktop width");
assert.ok(markup.includes("body.kinder-ready[data-palette=\"calm\"] .bubble-ocean"),"Working alternate calm palette");
assert.ok(markup.includes("font:400 16px/1.4 Nunito"),"Accessible toolbar label sizes");
assert.ok(html.includes("khaemenes-yearbook-profile-images.js"),"Yearbook bridge still loaded");
assert.ok(html.includes("khaemenes-universal-profile-look-editor.js"),"Shared photo pop-up loaded");
assert.ok(html.includes("khaemenes-kindergarten-universal-look-adapter.js"),"Existing Kindergarten record has an adapter");
assert.ok(html.includes("window.KhaemenesKindergartenLookBridge"),"Canonical learner look bridge retained");
for(const name of ["kinderDailyAdventure","kinderAdventureStars","kinderAdventureActivities","kinderAdventureProgress","kinderAdventureStatus","kinderAdventureLesson"]){
 assert.equal(ids.filter(x=>x===name).length,1,"daily adventure element: "+name);
}
assert.ok(markup.indexOf('id="kinderDailyAdventure"')<markup.indexOf('id="todayCard"'),"Daily adventure is visible before ordinary daily cards");
assert.ok(markup.includes('href="#kinderDailyAdventure"'),"Daily adventures navigation is available");
assert.ok(markup.includes('family/#khaeKinderFamilyDailyPanel'),"Parent plan doorway retained");
assert.ok(html.indexOf('khaemenes-kindergarten-family-daily-plan.js')<html.indexOf('khaemenes-kinder-daily-adventure.js'),"Plan contract loads before student view");

assert.ok(html.includes("khaemenes.kindergarten-visual.v1"),"Original learner appearance schema unchanged");
assert.ok(html.includes("khaemenes-kindergarten-mastery-changed"),"Mastery update listener retained");
assert.ok(html.includes("v?.learnerId!==target"),"Backup learner validation retained");
assert.ok(!html.includes('</div>\\n<a class="skip"'),"Skip link no longer preceded by escaped newline");
let inline=0;
for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
 if(!match[1].trim())continue;inline++;new vm.Script(match[1],{filename:"kindergarten-profile-inline-"+inline+".js"});
}
assert.ok(inline>=3);
console.log("PASS Kindergarten modal photo editor: visible card removed, legacy record retained, shared dialog wired, Yearbook and Daily Adventure intact");
