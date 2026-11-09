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
