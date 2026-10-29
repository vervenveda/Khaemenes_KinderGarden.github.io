import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

// Bubble 2 certification only. This test must not modify or restyle the Kindergarten home page.
const root=process.cwd();
const academy=path.join(root,"shared-academy");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".svg":"image/svg+xml",".png":"image/png"};
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:255,height:700},reducedMotion:"reduce"});
const page=await context.newPage();
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
await page.route("https://vervenveda.com/**",async route=>{
 const pathname=new URL(route.request().url()).pathname;
 let home=root,local=pathname;
 if(pathname.startsWith("/Khaemenes_KinderGarden.github.io/"))local=pathname.slice("/Khaemenes_KinderGarden.github.io".length);
 else if(pathname.startsWith("/Khaemenes_Academy.github.io/")){home=academy;local=pathname.slice("/Khaemenes_Academy.github.io".length)}
 else return route.fulfill({status:404,body:"Unavailable in isolated Bubble 2 test"});
 let f=path.resolve(home,"."+local);
 if(!f.startsWith(home+path.sep)&&f!==home)return route.fulfill({status:403});
 try{if(fs.statSync(f).isDirectory())f=path.join(f,"index.html");return route.fulfill({status:200,body:fs.readFileSync(f),contentType:mime[path.extname(f)]||"application/octet-stream"});}
 catch{return route.fulfill({status:404,body:"Missing repository file: "+local})}
});
const base="https://vervenveda.com/Khaemenes_KinderGarden.github.io/";
try{
 // 255px certification checks layout only; no home-page design mutation is made.
 await page.goto(base+"student-profile/",{waitUntil:"domcontentloaded"});
 const ids=await page.evaluate(()=>{
   const R=window.KhaemenesFamilyRegistry;
   const f=R.createFamily({displayName:"255 QA",adultName:"Guardian QA"});
   const a=R.registerLearner({familyId:f.familyId,nickname:"Narrow Learner",stage:"kindergarten",grade:"k"});
   const b=R.registerLearner({familyId:f.familyId,nickname:"Keyboard Sibling",stage:"kindergarten",grade:"k"});
   R.setActive({familyId:f.familyId,adultId:f.adultId,learnerId:a.learnerId});
   return {a:a.learnerId,b:b.learnerId};
 });
 await page.waitForTimeout(80);
 const narrow=await page.evaluate(()=>({inner:innerWidth,html:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert.ok(narrow.html<=narrow.inner+5,"255px profile horizontal overflow: "+JSON.stringify(narrow));
 assert.ok(narrow.body<=narrow.inner+5,"255px profile body overflow: "+JSON.stringify(narrow));
 assert.ok(await page.locator("#firstStepLink").isVisible(),"first-step action must remain visible at 255px");
 console.log("PASS 255px profile layout without horizontal overflow");

 // Keyboard-only learner switch: native select must be reachable and usable without pointer input.
 let reached=false;
 for(let i=0;i<80;i++){
   await page.keyboard.press("Tab");
   const id=await page.evaluate(()=>document.activeElement?.id||"");
   if(id==="learnerSelect"){reached=true;break;}
 }
 assert.equal(reached,true,"learner selector must be keyboard reachable");
 await page.locator("#learnerSelect").selectOption(ids.b);
 assert.equal(await page.locator("#childTitle").innerText(),"Keyboard Sibling");
 assert.equal(await page.locator("#adultConfirm").isChecked(),false,"learner switch must reset adult confirmation");
 console.log("PASS keyboard-reachable learner selector and isolated learner switch");

 // Core formal lesson at 255px: verify readable viewport and keyboard-reachable interactive control.
 await page.evaluate(ids=>{
   const R=window.KhaemenesFamilyRegistry;
   R.setActive({learnerId:ids.a});
   R.registerLearner({familyId:R.getFamily().familyId,nickname:R.getLearner(ids.a).nickname,stage:"kindergarten",grade:"k",existingLearnerId:ids.a,guardianRelease:{accepted:true,learnerId:ids.a,version:"kindergarten-guardian-release-v1.0",adultId:R.getFamily().activeAdultId}});
 },ids);
 await page.goto(base+"curriculum/lessons/unit-01/index.html",{waitUntil:"domcontentloaded"});
 await page.locator('[data-kg-complete="0"]').waitFor({state:"visible",timeout:10000});
 const lessonNarrow=await page.evaluate(()=>({inner:innerWidth,html:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert.ok(lessonNarrow.html<=lessonNarrow.inner+5,"255px lesson horizontal overflow: "+JSON.stringify(lessonNarrow));
 let lessonControl=false;
 for(let i=0;i<120;i++){
   await page.keyboard.press("Tab");
   if(await page.evaluate(()=>document.activeElement?.matches?.('[data-kg-complete="0"]')||false)){lessonControl=true;break;}
 }
 assert.equal(lessonControl,true,"Week 1 completion control must be keyboard reachable");
 await page.keyboard.press("Enter");
 assert.match(await page.locator("#kgProgressLabel").innerText(),/1 of 5 days complete/);
 console.log("PASS 255px formal lesson and keyboard activation");

 assert.deepEqual(errors.filter(e=>!/404|ResourceNotFound/.test(e)),[],"uncaught page errors: "+JSON.stringify(errors));
 console.log("PASS Bubble 2 narrow-screen and keyboard certification");
}finally{await context.close();await browser.close()}
