// Isolated Node regression of the actual browser mastery engine. No network or real records.
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const script=fs.readFileSync(path.resolve(__dirname,"../assets/khaemenes-kinder-mastery-gates.js"),"utf8");
const tests=[];function test(name,fn){tests.push([name,fn])}
function fixture(){
 const store=new Map();let person={hasProfile:true,stageEligible:true,learnerId:"fiction-A",guardianAuthorized:true};
 const storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
 const w={localStorage:storage,location:{pathname:"/qa/"},dispatchEvent:()=>{},KhaemenesKinderContinuity:{getLearnerSummary:()=>person},CustomEvent:class{constructor(t,o){this.type=t;this.detail=o?.detail}},console};
 w.window=w;vm.runInNewContext(script,{window:w,CustomEvent:w.CustomEvent,console}, {filename:"khaemenes-kinder-mastery-gates.js"});
 const g=w.KhaemenesKinderMasteryGates;assert.ok(g);
 const switchPerson=p=>{person={...person,...p}};
 const seed=mutate=>{const key=g.key,all=JSON.parse(storage.getItem(key)||"{}");const id=person.learnerId,record=all[id]||{learnerId:id,weeks:{},daily:{},portfolio:false};mutate(record);all[id]=record;storage.setItem(key,JSON.stringify(all))};
 const passWeeks=(start,end)=>seed(r=>{for(let i=start;i<=end;i++)r.weeks[i]={bestPercent:80,bestQualifiedPercent:80,mastered:true,attempts:[]}});
 const passDays=week=>seed(r=>{r.daily[week]=Object.fromEntries([1,2,3,4,5].map(i=>[i,{completed:true,adultAffirmed:true}]))});
 const passMidterm=()=>seed(r=>{r.midterm={bestPercent:80,bestQualifiedPercent:80,mastered:true,attempts:[]}});
 return {g,store,switchPerson,seed,passWeeks,passDays,passMidterm};
}
test("unlinked or unauthorized learner cannot open formal Week 1",()=>{const x=fixture();x.switchPerson({hasProfile:false});assert.equal(x.g.canOpenWeek(1),false);x.switchPerson({hasProfile:true,guardianAuthorized:false});assert.equal(x.g.canOpenWeek(1),false)});
test("sequenced day requires previous daily receipt",()=>{const x=fixture();x.passWeeks(1,4);assert.equal(x.g.canOpenDay(5,2),false);x.g.recordDayEvidence({unit:5,day:1});assert.equal(x.g.canOpenDay(5,2),true);assert.equal(x.g.canAssessWeek(5),false)});
test("79 percent and missing essential do not unlock",()=>{const x=fixture();x.passWeeks(1,4);x.passDays(5);x.g.recordWeekEvidence({unit:5,met:79,total:100,adultAffirmed:true});assert.equal(x.g.canOpenWeek(6),false);x.g.recordWeekEvidence({unit:5,met:80,total:100,adultAffirmed:true,essentialSatisfied:false});assert.equal(x.g.canOpenWeek(6),false)});
test("80 percent with essentials and adult affirmation unlocks",()=>{const x=fixture();x.passWeeks(1,4);x.passDays(5);assert.throws(()=>x.g.recordWeekEvidence({unit:5,met:8,total:10}),/adult-affirmation/);x.g.recordWeekEvidence({unit:5,met:8,total:10,adultAffirmed:true,essentialSatisfied:true});assert.equal(x.g.canOpenWeek(6),true)});
test("capstone daily activity requires adult affirmation",()=>{const x=fixture();x.passWeeks(1,30);x.passMidterm();assert.throws(()=>x.g.recordDayEvidence({unit:31,day:1}),/adult-affirmation/);x.g.recordDayEvidence({unit:31,day:1,adultAffirmed:true});assert.equal(x.g.dayEvidence(31,1).completed,true)});
test("learner evidence remains isolated on account switch",()=>{const x=fixture();x.passWeeks(1,3);assert.equal(x.g.completedWeeks(),3);x.switchPerson({learnerId:"fiction-B"});assert.equal(x.g.completedWeeks(),0);x.switchPerson({learnerId:"fiction-A"});assert.equal(x.g.completedWeeks(),3)});
test("Week 19 requires qualifying midyear mastery",()=>{const x=fixture();x.passWeeks(1,18);assert.equal(x.g.canOpenWeek(19),false);x.passMidterm();assert.equal(x.g.canOpenWeek(19),true)});
test("graduation requires all weeks, milestones and portfolio",()=>{const x=fixture();x.passWeeks(1,36);x.passMidterm();assert.equal(x.g.certificationReady(),false);x.seed(r=>{r.final={bestPercent:80,bestQualifiedPercent:80,mastered:true,attempts:[]}});assert.equal(x.g.certificationReady(),false);x.g.setPortfolioComplete(true,{adultAffirmed:true});assert.equal(x.g.certificationReady(),true)});
test("legacy average is not formal evidence",()=>{const x=fixture();x.store.set("khaemenes_kindergarten_36_aplus_v1",JSON.stringify({weekly:{1:100},midterm:100,final:100,portfolio:true}));assert.equal(x.g.canOpenWeek(2),false);assert.equal(x.g.certificationReady(),false)});
let fail=0;for(const [name,run] of tests){try{run();console.log("PASS",name)}catch(e){fail++;console.error("FAIL",name,e.stack||e)}}console.log(tests.length-fail+"/"+tests.length+" passed");if(fail)process.exitCode=1;
