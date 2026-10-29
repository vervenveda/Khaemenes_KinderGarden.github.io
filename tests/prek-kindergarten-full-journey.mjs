import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {chromium} from "playwright";

// One clean browser origin, three real repository surfaces, and a single stable learner ID.
// The only simulated authority is explicitly labeled: guardian assent and 36-week
// graduation readiness, which cannot be manufactured by this test.
const root=process.cwd(),academy=path.join(root,"shared-academy"),preschool=path.join(root,"shared-preschool");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png"};
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1120,height:860},reducedMotion:"reduce",acceptDownloads:true});
const page=await context.newPage();const errors=[];
page.on("pageerror",e=>errors.push(e.message));
const host="https://vervenveda.com",purl=host+"/Khaemenes_Preschool.github.io/graduation/",
enroll=host+"/Khaemenes_Academy.github.io/family/enroll/",
kurl=host+"/Khaemenes_KinderGarden.github.io/",
lesson=kurl+"curriculum/lessons/unit-01/index.html",
kgrad=kurl+"graduation/",guardian=kurl+"family/guardian-release/";
let certifyFixture=false;
await page.route("https://vervenveda.com/**",async route=>{
 const pathname=new URL(route.request().url()).pathname;
 let home=root,local=pathname;
 if(pathname.startsWith("/Khaemenes_KinderGarden.github.io/"))local=pathname.slice("/Khaemenes_KinderGarden.github.io".length);
 else if(pathname.startsWith("/Khaemenes_Academy.github.io/")){home=academy;local=pathname.slice("/Khaemenes_Academy.github.io".length)}
 else if(pathname.startsWith("/Khaemenes_Preschool.github.io/")){home=preschool;local=pathname.slice("/Khaemenes_Preschool.github.io".length)}
 else if(pathname.startsWith("/stos/khaemenes/kindergarten/"))local=pathname.slice("/stos/khaemenes/kindergarten".length);
 else if(pathname.startsWith("/stos/khaemenes/preschool/")){home=preschool;local=pathname.slice("/stos/khaemenes/preschool".length)}
 else if(pathname.startsWith("/stos/khaemenes/assets/")){home=academy;local="/assets/"+pathname.slice("/stos/khaemenes/assets/".length)}
 else if(pathname.startsWith("/stos/khaemenes/family/")){home=academy;local="/family/"+pathname.slice("/stos/khaemenes/family/".length)}
 else return route.fulfill({status:404,body:"Non-essential test asset unavailable"});
 if(certifyFixture&&pathname==="/Khaemenes_KinderGarden.github.io/assets/khaemenes-kinder-mastery-gates.js"&&route.request().resourceType()==="script"&&page.url().includes("/graduation/")){
   // Simulates a previously completed, independently verified formal record ONLY
   // to test visual behavior of the graduation page; never writes mastery evidence.
   return route.fulfill({status:200,contentType:"text/javascript",body:'window.KhaemenesKinderMasteryGates={formalAccess:()=>true,certificationReady:()=>true,weekMastery:()=>({mastered:true,bestPercent:95}),milestoneMastery:()=>({mastered:true,bestPercent:96}),learnerRecord:()=>({portfolio:true})};'});
 }
 let f=path.resolve(home,"."+local);
 if(!f.startsWith(home+path.sep)&&f!==home)return route.fulfill({status:403});
 try{if(fs.statSync(f).isDirectory())f=path.join(f,"index.html");return route.fulfill({status:200,body:fs.readFileSync(f),contentType:mime[path.extname(f)]||"application/octet-stream"});}
 catch{return route.fulfill({status:404,body:"Missing repository file: "+local})}
});
try{
 // Step 1: Real Pre-K mini-games and celebration certificate.
 await page.goto(purl,{waitUntil:"domcontentloaded"});
 const ids=await page.evaluate(()=>{
  const R=window.KhaemenesFamilyRegistry;
  if(!R)throw new Error("Academy family registry did not load at Preschool Graduation");
  const f=R.createFamily({displayName:"One Child Journey QA",adultName:"Guardian QA"});
  const a=R.registerLearner({familyId:f.familyId,nickname:"Lantern Learner",stage:"preschool",grade:"pre-k"});
  const b=R.registerLearner({familyId:f.familyId,nickname:"Sibling QA",stage:"preschool",grade:"pre-k"});
  R.registerLearner({familyId:f.familyId,nickname:a.nickname,stage:"preschool",grade:"pre-k",existingLearnerId:a.learnerId,guardianRelease:{accepted:true,learnerId:a.learnerId,version:"preschool-mentor-release-v1.0"}});
  R.grantAdultAccess({familyId:f.familyId,adultId:f.adultId,learnerId:a.learnerId,permissionPreset:"co-guardian"});
  R.grantAdultAccess({familyId:f.familyId,adultId:f.adultId,learnerId:b.learnerId,permissionPreset:"co-guardian"});
  R.setActive({familyId:f.familyId,adultId:f.adultId,learnerId:a.learnerId});
  return {familyId:f.familyId,adultId:f.adultId,learnerId:a.learnerId,siblingId:b.learnerId};
 });
 await page.reload({waitUntil:"domcontentloaded"});
 for(const item of ["book","water","crayons"])await page.locator('#backpackChoices [data-item="'+item+'"]').click();
 await page.locator("#checkBackpack").click();
 await page.locator('#patternChoices [data-answer="rainbow"]').click();
 await page.locator('#kindnessChoices [data-answer="hello"]').click();
 assert.equal(await page.locator("#makeCertificate").isEnabled(),true);
 await page.locator("#makeCertificate").click();
 assert.equal(await page.locator("#certificateOutput").evaluate(e=>e.classList.contains("show")),true);
 const ceremony=await page.evaluate(id=>JSON.parse(localStorage.getItem("creche-preschool-graduation-v1")).records[id],ids.learnerId);
 assert.equal(ceremony.certificateUnlocked,true);
 assert.match(await page.locator('#next-garden a[href*="/family/enroll/"]').innerText(),/existing learner/i);
 console.log("PASS Pre-K celebration games and certificate saved under original learner ID");

 // Step 2: Actual Enrollment & Placement UI, not re-registering the child.
 await page.goto(enroll,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#existing [data-edit]").count(),2);
 page.once("dialog",d=>d.accept("k"));
 await page.locator('#existing [data-edit="'+ids.learnerId+'"]').click();
 const releaseDoor=page.locator('#learnerPane a[href*="/family/guardian-release/"]');
 assert.equal(await releaseDoor.count(),1,"Parent placement flow must expose the real Kindergarten guardian-release entrance");
 const placement=await page.evaluate(id=>({learner:window.KhaemenesFamilyRegistry.getLearner(id),n:window.KhaemenesFamilyRegistry.getFamily().learners.length}),ids.learnerId);
 assert.equal(placement.learner.learnerId,ids.learnerId);
 assert.equal(placement.learner.stage,"kindergarten");assert.equal(placement.learner.grade,"k");
 assert.equal(placement.learner.guardianRelease,null,"existing Pre-K release must not carry into formal Kindergarten authorization");
 assert.equal(placement.learner.previousStageGuardianRelease?.version,"preschool-mentor-release-v1.0","prior Pre-K release should remain archived");
 assert.equal(placement.n,2,"placement change must not create a duplicate learner");
 const prior=await page.evaluate(id=>JSON.parse(localStorage.getItem("creche-preschool-graduation-v1")).records[id].certificateUnlocked,ids.learnerId);
 assert.equal(prior,true,"Pre-K history must survive placement");
 console.log("PASS existing learner upgraded through Enrollment & Placement without new ID");
 await page.goto(purl,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#progressCount").innerText(),"3 of 3 stars ⭐","historic Preschool stars must remain visible after Kindergarten placement");
 assert.equal(await page.locator("#certificateOutput").evaluate(el=>el.classList.contains("show")),true,"historical Pre-K keepsake must stay accessible for the same learner");
 console.log("PASS Pre-K graduation certificate remains accessible after enrolling the same child in Kindergarten");


 // Step 3: Kindergarten requires separate adult release; placement alone must not unlock.
 await page.goto(kgrad,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#celebrate").isDisabled(),true);
 await page.goto(lesson,{waitUntil:"domcontentloaded"});
 await page.waitForTimeout(150);
 assert.equal(await page.locator("[data-kg-complete]").count(),0,"unauthorized learner must not enter the full formal lesson");
 console.log("PASS Kindergarten curriculum and graduation stay gated after placement");
 // Step 3 continued: use the parent-facing form and actual registry contract.
 await page.goto(guardian,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#authorize").isEnabled(),true);
 assert.equal(await page.locator("#continueLesson").isVisible(),false);
 assert.match(await page.locator("#eligibility").innerText(),/Kindergarten release is still required/);
 const beforeRelease=await page.evaluate(id=>window.KhaemenesFamilyRegistry.getLearner(id).guardianRelease,ids.learnerId);
 assert.equal(beforeRelease,null,"Pre-K release must not authorize Kindergarten automatically");
 await page.locator("[data-krel='authority']").check();
 await page.locator("#authorize").click();
 assert.match(await page.locator("#result").innerText(),/all seven/i);
 assert.equal(await page.evaluate(id=>window.KhaemenesFamilyRegistry.getLearner(id).guardianRelease,ids.learnerId),null);
 // A second family adult with progress-only access may read but cannot activate.
 await page.evaluate(ids=>{
  const R=window.KhaemenesFamilyRegistry;
  const viewer=R.addAdultLocal({familyId:ids.familyId,displayName:"View-only adult",role:"caregiver",permissionPreset:"progress-viewer",learnerIds:[ids.learnerId]});
  R.setActive({adultId:viewer.adultId});
 },ids);
 assert.equal(await page.locator("#authorize").isDisabled(),true,"a viewer must not approve guardian release");
 assert.match(await page.locator("#eligibility").innerText(),/does not currently have.*permission/);
 await page.evaluate(ids=>window.KhaemenesFamilyRegistry.setActive({adultId:ids.adultId}),ids);
 await page.locator("[data-krel]").evaluateAll(boxes=>boxes.forEach(box=>{box.checked=true;box.dispatchEvent(new Event("change",{bubbles:true}))}));
 await page.locator("#authorize").click();
 assert.match(await page.locator("#result").innerText(),/Authorization completed/);
 assert.equal(await page.locator("#continueLesson").isVisible(),true);
 const authorized=await page.evaluate(id=>window.KhaemenesFamilyRegistry.getLearner(id),ids.learnerId);
 assert.equal(authorized.learnerId,ids.learnerId);
 assert.equal(authorized.guardianRelease.accepted,true);
 assert.equal(authorized.guardianRelease.version,"kindergarten-guardian-release-v1.0");
 assert.equal(authorized.guardianRelease.adultId,ids.adultId);
 assert.equal(await page.evaluate(()=>window.KhaemenesFamilyRegistry.getFamily().learners.length),2,"guardian release must not create a child");
 console.log("PASS real parent-facing guardian review, seven acknowledgments, adult access restrictions and stable learner identity");

 // Step 4: Open the REAL gated lesson shell; record one practice day; reload.
 await page.goto(lesson,{waitUntil:"domcontentloaded"});
 await page.locator('[data-kg-complete="0"]').waitFor({state:"visible",timeout:10000});
 await page.locator('[data-kg-complete="0"]').click();
 assert.match(await page.locator("#kgProgressLabel").innerText(),/1 of 5 days complete/);
 const key="kg_u01_interactive_v3:"+encodeURIComponent(ids.learnerId);
 const progress=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 assert.deepEqual(progress.completedDays,[0]);
 assert.equal(await page.evaluate(()=>localStorage.getItem("kg_u01_interactive_v2")),null,"legacy shared key must not be written");
 await page.reload({waitUntil:"domcontentloaded"});
 await page.locator("#kgProgressLabel").waitFor({state:"visible",timeout:10000});
 assert.match(await page.locator("#kgProgressLabel").innerText(),/1 of 5 days complete/);
 const formalStore=await page.evaluate(()=>localStorage.getItem("khaemenes_kindergarten_mastery_receipts_v1"));
 assert.equal(formalStore,null,"practice day must not forge formal mastery");
 console.log("PASS actual Week 1 lesson saves and reloads learner-scoped practice without awarding mastery");

 // Mixed-child regression: same tab must refuse writes after active learner switch.
 await page.evaluate(id=>window.KhaemenesFamilyRegistry.updateLearnerGrade(id,"k"),ids.siblingId);
 await page.evaluate(id=>window.KhaemenesFamilyRegistry.setActive({learnerId:id}),ids.siblingId);
 assert.equal(await page.locator('[data-kg-complete="1"]').isDisabled(),true,"same-tab learner switch must disable old learner's practice controls");
 await page.goto(guardian,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#continueLesson").isVisible(),false,"sibling must authorize separately");
 await page.locator("[data-krel]").evaluateAll(boxes=>boxes.forEach(box=>{box.checked=true;box.dispatchEvent(new Event("change",{bubbles:true}))}));
 await page.locator("#authorize").click();
 assert.match(await page.locator("#result").innerText(),/Authorization completed/);
 await page.goto(lesson,{waitUntil:"domcontentloaded"});
 await page.locator("#kgProgressLabel").waitFor({state:"visible",timeout:10000});
 assert.match(await page.locator("#kgProgressLabel").innerText(),/0 of 5 days complete/);
 const original=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).completedDays,key);
 assert.deepEqual(original,[0]);
 console.log("PASS first lesson sibling separation and same-tab editing guard");

 // Bubble 2 two-child isolation: authorize/practice for the sibling must never alter the first learner's record.
 const siblingKey="kg_u01_interactive_v3:"+encodeURIComponent(ids.siblingId);
 await page.locator('[data-kg-complete="0"]').click();
 assert.match(await page.locator("#kgProgressLabel").innerText(),/1 of 5 days complete/);
 assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).completedDays,siblingKey),[0]);
 assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).completedDays,key),[0],"sibling practice must not mutate first learner progress");
 await page.locator('[data-kg-complete="1"]').click();
 assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).completedDays,siblingKey),[0,1]);
 assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).completedDays,key),[0],"second sibling day must remain isolated");
 await page.evaluate(id=>window.KhaemenesFamilyRegistry.setActive({learnerId:id}),ids.learnerId);
 await page.reload({waitUntil:"domcontentloaded"});
 await page.locator("#kgProgressLabel").waitFor({state:"visible",timeout:10000});
 assert.match(await page.locator("#kgProgressLabel").innerText(),/1 of 5 days complete/);
 assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).completedDays,key),[0]);
 assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).completedDays,siblingKey),[0,1]);
 console.log("PASS two authorized siblings retain independent Week 1 practice records after learner switch and reload");

 // Step 5: Same learner reselected; incomplete Kindergarten graduation remains locked.
 await page.evaluate(id=>window.KhaemenesFamilyRegistry.setActive({learnerId:id}),ids.learnerId);
 await page.goto(kgrad,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#celebrate").isDisabled(),true);
 assert.equal(await page.locator("#printKeepsake").isDisabled(),true);
 assert.equal(await page.locator("#certificate").isVisible(),false);
 const beforeFormal=await page.evaluate(()=>localStorage.getItem("khaemenes_kindergarten_mastery_receipts_v1"));
 console.log("PASS no false graduation after a saved Week 1 practice activity");

 // Graduation visual can be tested separately using an explicitly simulated
 // completion authority; no local formal receipt or placement is manufactured.
 certifyFixture=true;
 await page.reload({waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#celebrate").isEnabled(),true);
 await page.locator("#celebrate").click();
 assert.equal(await page.locator("#certificate").isVisible(),true);
 const afterFormal=await page.evaluate(()=>localStorage.getItem("khaemenes_kindergarten_mastery_receipts_v1"));
 assert.equal(afterFormal,beforeFormal);
 assert.equal(await page.evaluate(()=>window.KhaemenesFamilyRegistry.getLearner().stage),"kindergarten");
 console.log("PASS graduation visual with explicit mock authority; no fake mastery or automatic promotion");
 // Revoke on the real parent-facing form; the existing saved practice must remain intact.
 certifyFixture=false;
 await page.goto(guardian,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("#revoke").isEnabled(),true);
 page.once("dialog",dialog=>dialog.accept());
 await page.locator("#revoke").click();
 assert.match(await page.locator("#result").innerText(),/revoked/);
 assert.equal(await page.locator("#continueLesson").isVisible(),false);
 await page.goto(lesson,{waitUntil:"domcontentloaded"});
 assert.equal(await page.locator("[data-kg-complete]").count(),0,"revoking guardian release must re-lock formal lessons");
 assert.deepEqual(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).completedDays,key),[0],"revoking consent must not erase learner work");
 console.log("PASS guardian release revocation blocks future formal access while preserving saved practice");
 const fatal=errors.filter(e=>!/404|ResourceNotFound/.test(e));
 assert.deepEqual(fatal,[],"uncaught page errors: "+JSON.stringify(fatal));
 console.log("PASS full Preschool → Kindergarten single-child forensic journey");
}finally{await context.close();await browser.close()}