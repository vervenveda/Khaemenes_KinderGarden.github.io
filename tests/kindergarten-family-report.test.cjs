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
