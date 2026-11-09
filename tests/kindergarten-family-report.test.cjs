"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const src=fs.readFileSync(path.resolve(__dirname,"../index.html"),"utf8");
test("Kinder course reports require matching learner family and grade",()=>{
 assert.match(src,/function publishKinderContinuation\(\)/);
 assert.match(src,/ids\.learnerId!==learner\.learnerId/);
 assert.match(src,/selected\.familyId!==linkedFamily\.familyId/);
 assert.match(src,/selected\.grade!=="k"/);
 assert.match(src,/linkedFamily\.learnerIds\?\.includes\(learner\.learnerId\)/);
 assert.match(src,/courseId:"khaemenes-kindergarten-formal-path"/);
 assert.match(src,/curriculumSummary\?\.\(80,36\)/);
 const blocks=[...src.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 blocks.forEach((s,i)=>new vm.Script(s,{filename:"kinder-inline-"+i+".js"}));
});

test("Kinder Garden student profile has learner-scoped progress and reading sections",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 const module=fs.readFileSync(path.resolve(__dirname,"../assets/khaemenes-kinder-family-overview.js"),"utf8");
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 scripts.forEach((code,i)=>new vm.Script(code,{filename:"kinder-profile-inline-"+i+".js"}));
 new vm.Script(module,{filename:"kinder-family-overview.js"});
 assert.match(html,/Kinder Garden Family Progress/);
 assert.match(html,/khaemenes-kinder-family-overview\.js/);
 assert.match(html,/id="kinderFamilyOverviewStatus"/);
 assert.match(html,/id="kinderReadingOverviewStatus"/);
 assert.match(module,/family\.learnerIds\?\.includes\(learner\.learnerId\)/);
 assert.match(module,/snapshot\?\.learnerId===learner\.learnerId/);
 assert.match(module,/khaemenes_kindergarten_monthly_books_v1:/);
 assert.doesNotMatch(module,/localStorage\.setItem\(/);
 assert.doesNotMatch(module,/C\.publish\(/);
});
test("Learner switching and asynchronous photo use the current eligible Kinder Garden learner",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 assert.match(html,/v\.learnerId===ids\.learnerId/);
 assert.match(html,/v\.familyId===family\.familyId/);
 assert.match(html,/v\.grade==="k"/);
 assert.match(html,/family\.learnerIds\?\.includes\(v\.learnerId\)/);
 assert.match(html,/priorId!==activeId&&\$\("adultConfirm"\)/);
 assert.match(html,/selectedId===activeId&&learner\(\)\?\.learnerId===selectedId/);
 assert.match(html,/if\(!saveLook\(\)\)look\.photo=previous/);
 assert.match(html,/renderLook\(\);return ok\}/);
});
test("Kinder Garden rejects a sibling's formal reporting snapshot",()=>{
 const code=fs.readFileSync(path.resolve(__dirname,"../assets/khaemenes-kinder-family-overview.js"),"utf8");
 const learner={learnerId:"child-a",familyId:"family-a",grade:"k",stage:"kindergarten"};
 const family={familyId:"family-a",learnerIds:["child-a"]};
 const w={
  KhaemenesFamilyRegistry:{
   activeIds:()=>({familyId:"family-a",learnerId:"child-a"}),
   getLearner:()=>learner,
   getFamily:()=>family
  },
  KhaemenesLearningContinuation:{readCourse:()=>({
   learnerId:"child-b",courseId:"khaemenes-kindergarten-formal-path",grade:"K",stage:"kindergarten"
  })},
  localStorage:{getItem:()=>null},
  addEventListener:()=>{}
 };
 w.window=w;
 vm.runInNewContext(code,{window:w,document:{readyState:"loading",addEventListener:()=>{}}},{timeout:2000});
 const result=w.KhaemenesKinderFamilyOverview.overview();
 assert.equal(result.kind,"ready");
 assert.equal(result.report,null);
});

test("Bubble 1: profile preferences are only marked saved when browser write is confirmed",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 assert.match(html,/const raw=JSON\.stringify\(v\);localStorage\.setItem\(k,raw\);return localStorage\.getItem\(k\)===raw/);
 assert.match(html,/const ok=write\(profileKey\(\),/);
});
test("Bubbles 2-3: visual backup restore and Pre-K handoff require matching learner ownership",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../student-profile/index.html"),"utf8");
 assert.match(html,/v\?\.learnerId===activeId&&v\.schema==="khaemenes\.prek-visual\.v1"/);
 assert.match(html,/selectedId!==activeId\|\|learner\(\)\?\.learnerId!==selectedId/);
 assert.match(html,/v\.learnerId!==selectedId/);
 assert.match(html,/v\?\.schema!=="khaemenes\.kindergarten-visual\.v1"/);
 assert.match(html,/if\(!saveLook\(\)\)\{look=previous;renderLook\(\)\}/);
});
test("Bubble 4: reading activity records require matching learner, grade, and family",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../reading/index.html"),"utf8");
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
 scripts.forEach((v,i)=>new vm.Script(v,{filename:"reading-inline-"+i+".js"}));
 assert.match(html,/l\.familyId===family\.familyId/);
 assert.match(html,/l\.grade==="k"/);
 assert.match(html,/family\.learnerIds\?\.includes\(l\.learnerId\)/);
 assert.match(html,/function currentReader\(\)\{return Boolean\(l&&learner\(\)\?\.learnerId===l\.learnerId\)\}/);
 assert.match(html,/if\(!currentReader\(\)\)\{saveStatus\(false\);return\}/);
});
test("Bubble 5: monthly books and reward choices verify writes before declaring success",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../reading/index.html"),"utf8");
 assert.match(html,/function verifiedReadingWrite\(key,value\)/);
 assert.match(html,/localStorage\.getItem\(key\)===raw/);
 assert.match(html,/verifiedReadingWrite\(monthKey,books\)/);
 assert.match(html,/verifiedReadingWrite\(rewardKey\(\),rec\)/);
 assert.match(html,/verifiedReadingWrite\(rewardKey\(\),next\)/);
});
test("Reading Garden write function rejects silent storage failures and changed learner",()=>{
 const html=fs.readFileSync(path.resolve(__dirname,"../reading/index.html"),"utf8");
 const portion=html.slice(html.indexOf("function learner(){"),html.indexOf("function mastered(){"));
 assert.ok(portion.includes("function verifiedReadingWrite"));
 const actual=portion+";({learner,currentReader,verifiedReadingWrite})";
 const mem=new Map(),family={familyId:"family-a",learnerIds:["a"]};
 let active="a",silent=false;
 const learner={learnerId:"a",familyId:"family-a",stage:"kindergarten",grade:"k"};
 const registry={activeIds:()=>({familyId:"family-a",learnerId:active}),
  getLearner:id=>id==="a"?learner:null,getFamily:()=>family};
 const storage={setItem:(k,v)=>{if(!silent)mem.set(k,v)},getItem:k=>mem.get(k)||null};
 const code="const R=window.KhaemenesFamilyRegistry;const l=learner();"+actual;
 const api=vm.runInNewContext(code,{window:{KhaemenesFamilyRegistry:registry},localStorage:storage,JSON,Boolean});
 assert.equal(api.verifiedReadingWrite("sample",{a:1}),true);
 silent=true;assert.equal(api.verifiedReadingWrite("other",{a:2}),false);
 active="b";assert.equal(api.currentReader(),false);
 assert.equal(api.verifiedReadingWrite("cross-child",{a:3}),false);
 assert.equal(mem.has("cross-child"),false);
});
