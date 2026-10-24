import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {chromium} from "playwright";
const root=process.cwd(),academy=path.join(root,"shared-academy");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8"};
const browser=await chromium.launch({headless:true}),context=await browser.newContext({viewport:{width:1024,height:860},acceptDownloads:true,reducedMotion:"reduce"});
const errors=[],page=await context.newPage();
page.on("pageerror",e=>errors.push(e.message));
const base="https://vervenveda.com/Khaemenes_KinderGarden.github.io/graduation/";
let readinessFixture=false;
await page.route("https://vervenveda.com/**",async route=>{
 const url=new URL(route.request().url()),p=url.pathname;
 let home=root,local=p;
 if(p.startsWith("/Khaemenes_KinderGarden.github.io/"))local=p.slice("/Khaemenes_KinderGarden.github.io".length);
 else if(p.startsWith("/Khaemenes_Academy.github.io/")){home=academy;local=p.slice("/Khaemenes_Academy.github.io".length)}
 else return route.fulfill({status:404,body:"Not available in isolated test"});
 if(readinessFixture&&p.endsWith("/assets/khaemenes-kinder-mastery-gates.js")){
   // Isolated UI fixture: not the actual mastery engine and never shipped to students.
   const stub='window.KhaemenesKinderMasteryGates={formalAccess:()=>true,certificationReady:()=>true,weekMastery:()=>({mastered:true}),milestoneMastery:()=>({mastered:true,bestPercent:95}),learnerRecord:()=>({portfolio:true})};';
   return route.fulfill({status:200,contentType:"text/javascript",body:stub});
 }
 let filename=path.resolve(home,"."+local);
 if(!filename.startsWith(home+path.sep)&&filename!==home)return route.fulfill({status:403});
 try{if(fs.statSync(filename).isDirectory())filename=path.join(filename,"index.html");const body=fs.readFileSync(filename);await route.fulfill({status:200,contentType:mime[path.extname(filename)]||"application/octet-stream",body})}
 catch{await route.fulfill({status:404,body:"Missing"})}
});
try{
 await page.goto(base,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#lanterns .lantern").count(),36);
 assert.equal(await page.locator("#celebrate").isDisabled(),true);
 assert.equal(await page.locator("#printKeepsake").isDisabled(),true);
 assert.equal(await page.locator("#pinGradeOne").isDisabled(),true);
 assert.equal(await page.locator("#certificate").isVisible(),false);
 console.log("PASS guest cannot receive or print graduation credential");
 const students=await page.evaluate(()=>{
   const R=window.KhaemenesFamilyRegistry,fam=R.createFamily({displayName:"Graduation QA",adultName:"QA Parent"});
   const a=R.registerLearner({familyId:fam.familyId,nickname:"Star Learner",stage:"kindergarten",grade:"k"});
   const b=R.registerLearner({familyId:fam.familyId,nickname:"Second Learner",stage:"kindergarten",grade:"k"});
   R.setActive({familyId:fam.familyId,learnerId:a.learnerId});
   return {a:a.learnerId,b:b.learnerId};
 });
 await page.reload({waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#celebrate").isDisabled(),true);
 assert.equal(await page.locator("#certificate").isVisible(),false);
 assert.match(await page.locator("#weekResult").innerText(),/0\/36/);
 console.log("PASS enrolled learner without mastered weeks remains locked");
 const initial=await page.evaluate(()=>localStorage.getItem("khaemenes_kindergarten_mastery_receipts_v1"));
 readinessFixture=true;
 await page.reload({waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#celebrate").isEnabled(),true);
 assert.equal(await page.locator("#pinGradeOne").isEnabled(),true);
 await page.locator("#pinGradeOne").click();
 assert.match(await page.locator("#pinStatus").innerText(),/authorized adult must confirm/i);
 const beforePin=await page.evaluate(()=>localStorage.getItem("khaemenes_course_pins_v1"));
 assert.equal(beforePin,null,"Grade 1 cannot pin without adult confirmation");
 await page.locator("#adultPinConfirm").check();
 await page.locator("#pinGradeOne").click();
 assert.match(await page.locator("#pinStatus").innerText(),/Grade 1 entrance saved/i);
 const pinned=await page.evaluate(()=>{
  const R=window.KhaemenesFamilyRegistry,l=R.getLearner(),store=JSON.parse(localStorage.getItem("khaemenes_course_pins_v1")||"{}");
  return {stage:l.stage,grade:l.grade,items:store.learners?.[l.learnerId]||[]};
 });
 assert.equal(pinned.stage,"kindergarten","pinning must not promote student");
 assert.equal(pinned.grade,"k");
 assert.equal(pinned.items.filter(p=>p.id==="khaemenes-grade-01").length,1);
 await page.locator("#pinGradeOne").click();
 const count=await page.evaluate(()=>{
  const id=window.KhaemenesFamilyRegistry.getLearner().learnerId;
  return JSON.parse(localStorage.getItem("khaemenes_course_pins_v1")).learners[id].filter(p=>p.id==="khaemenes-grade-01").length;
 });
 assert.equal(count,1,"repeated pin must be idempotent");
 console.log("PASS guardian-approved Grade 1 shortcut is learner-specific and never changes placement");

 assert.equal(await page.locator("#printKeepsake").isEnabled(),true);
 await page.locator("#celebrate").click();
 assert.equal(await page.locator("#certificate").isVisible(),true);
 assert.equal(await page.locator("#certName").innerText(),"Star Learner");
 assert.match(await page.locator("#certEvidence").innerText(),/36\/36/);
 assert.match(await page.locator("#certificate").innerText(),/provisional/i);
 const after=await page.evaluate(()=>localStorage.getItem("khaemenes_kindergarten_mastery_receipts_v1"));
 assert.equal(after,initial,"graduation UI must never write formal mastery storage");
 assert.equal(await page.evaluate(()=>window.KhaemenesFamilyRegistry.getLearner().stage),"kindergarten","ceremony must never promote learner");
 console.log("PASS full UI ceremony renders only after mocked official completion signal without writing grades or placement");
 await page.evaluate(id=>{
   const R=window.KhaemenesFamilyRegistry, familyId=R.getFamily().familyId;
   R.setActive({familyId,learnerId:id});
   window.dispatchEvent(new Event("khaemenes-family-changed"));
 },students.b);
 assert.equal(await page.locator("#certificate").isVisible(),false,"sibling must not inherit a displayed certificate");
 assert.equal(await page.locator("#adultPinConfirm").isChecked(),false,"adult consent must reset on sibling switch");
 assert.equal(await page.locator("#pinGradeOne").isEnabled(),true,"fixture permits eligible second learner");
 await page.locator("#pinGradeOne").click();
 assert.match(await page.locator("#pinStatus").innerText(),/authorized adult must confirm/i);
 await page.evaluate(id=>{
  const key="khaemenes_course_pins_v1",value=JSON.parse(localStorage.getItem(key));
  value.learners[id]="unrecognized-legacy-pin-list";
  localStorage.setItem(key,JSON.stringify(value));
 },students.b);
 await page.locator("#adultPinConfirm").check();
 await page.locator("#pinGradeOne").click();
 assert.match(await page.locator("#pinStatus").innerText(),/need review/i);
 assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem("khaemenes_course_pins_v1")).learners[id],students.b),"unrecognized-legacy-pin-list","unrecognized sibling pin data cannot be replaced");
 await page.evaluate(id=>{
  const R=window.KhaemenesFamilyRegistry, familyId=R.getFamily().familyId;
  R.setActive({familyId,learnerId:id});
  window.dispatchEvent(new Event("khaemenes-family-changed"));
 },students.a);
 assert.equal(await page.locator("#certificate").isVisible(),false);
 assert.equal(await page.locator("#adultPinConfirm").isChecked(),false);
 assert.equal(await page.locator("#certName").innerText(),"Star Learner");
 console.log("PASS sibling graduation switch resets ceremony and approval, unknown pins preserved");
 await page.evaluate(()=>window.KhaemenesFamilyRegistry.updateLearnerPlacement(window.KhaemenesFamilyRegistry.getLearner().learnerId,{stage:"elementary",grade:"01"}));
 await page.reload({waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#celebrate").isDisabled(),true);
 assert.equal(await page.locator("#certificate").isVisible(),false);
 console.log("PASS Elementary-placed learner does not receive fresh Kindergarten ceremony");
 await page.setViewportSize({width:390,height:844});
 const widths=await page.evaluate(()=>({view:innerWidth,scroll:document.documentElement.scrollWidth}));
 assert.ok(widths.scroll<=widths.view+5,"graduation portal mobile overflow: "+JSON.stringify(widths));
 assert.deepEqual(errors,[],"uncaught errors: "+JSON.stringify(errors));
 console.log("PASS Kindergarten Lantern Bridge browser smoke");
}finally{await context.close();await browser.close()}