import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root=process.cwd();
const academy=path.join(root,"shared-academy");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".png":"image/png"};
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1024,height:860},acceptDownloads:true,reducedMotion:"reduce"});
const page=await context.newPage();
const errors=[];
page.on("pageerror",err=>errors.push(err.message));
await page.route("https://vervenveda.com/**",async route=>{
 const pathname=new URL(route.request().url()).pathname;
 let home=root,local=pathname;
 if(pathname.startsWith("/Khaemenes_KinderGarden.github.io/"))local=pathname.slice("/Khaemenes_KinderGarden.github.io".length);
 else if(pathname.startsWith("/Khaemenes_Academy.github.io/")){home=academy;local=pathname.slice("/Khaemenes_Academy.github.io".length)}
 else return route.fulfill({status:404,body:"Unavailable in isolated smoke test"});
 let filename=path.resolve(home,"."+local);
 if(!filename.startsWith(home+path.sep)&&filename!==home)return route.fulfill({status:403,body:"Forbidden"});
 try{
  if(fs.statSync(filename).isDirectory())filename=path.join(filename,"index.html");
  const data=fs.readFileSync(filename);
  await route.fulfill({status:200,body:data,contentType:mime[path.extname(filename)]||"application/octet-stream"});
 }catch{await route.fulfill({status:404,body:"Not found"})}
});
const url="https://vervenveda.com/Khaemenes_KinderGarden.github.io/student-profile/";
try{
 await page.goto(url,{waitUntil:"domcontentloaded"});
 await page.waitForTimeout(100);
 assert.equal(await page.locator("#profileStudio").isVisible(),false,"no fabricated learner in guest mode");
 assert.match(await page.locator("#accountNote").innerText(),/No active Kindergarten/);
 console.log("PASS guest boundary: no automatic account or phantom studio");
 const first=await page.evaluate(()=>{
  const R=window.KhaemenesFamilyRegistry;
  if(!R)throw new Error("Academy family registry should load");
  const fam=R.createFamily({displayName:"Browser QA",adultName:"QA Parent"});
  const a=R.registerLearner({familyId:fam.familyId,nickname:"QA Sunshine",stage:"kindergarten",grade:"k"});
  const b=R.registerLearner({familyId:fam.familyId,nickname:"QA Moonbeam",stage:"kindergarten",grade:"k"});
  R.setActive({familyId:fam.familyId,learnerId:a.learnerId});
  return {a:a.learnerId,b:b.learnerId};
 });
 assert.equal(await page.locator("#childTitle").innerText(),"QA Sunshine");
 assert.equal(await page.locator("#learnerSelect option").count(),2);
 assert.equal(await page.locator("#profileStudio").isVisible(),true);
 await page.locator("#adultConfirm").check();
 await page.locator("#backgroundChoices button[data-theme='forest']").click();
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"forest");
 await page.reload({waitUntil:"domcontentloaded"});
 await page.waitForTimeout(80);
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"forest");
 assert.equal(await page.locator("#childTitle").innerText(),"QA Sunshine");
 console.log("PASS profile appearance persists on reload");
 await page.locator("#adultConfirm").check();
 await page.locator("#pinKinderCourse").click();
 assert.match(await page.locator("#pinnedActivities").innerText(),/My Kindergarten Class/);
 await page.locator("#appSelect").selectOption("abc-curriculum");
 await page.locator("#pinSelectedApp").click();
 assert.match(await page.locator("#pinnedActivities").innerText(),/ABC Curriculum/);
 console.log("PASS formal class and learning-game pinning");

 await page.locator("#adultConfirm").check();
 await page.locator("#avatarChoices button[data-avatar='🦋']").click();
 assert.equal((await page.locator("#photoPreview").innerText()).trim(),"🦋");
 const tinyPng=Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9pXmKr8AAAAASUVORK5CYII=","base64");
 await page.locator("#childPhoto").setInputFiles({name:"qa.png",mimeType:"image/png",buffer:tinyPng});
 await page.locator("#photoPreview img").waitFor({state:"attached",timeout:3000});
 assert.match(await page.locator("#photoPreview img").getAttribute("src"),/^data:image\/jpeg;base64,/);
 console.log("PASS photo upload converts to browser-local JPEG preview");
 await page.locator("#pv2Goal").fill("Sing the ABC song");
 await page.locator("#pv2SaveCompass").click();
 await page.locator("#learnerSelect").selectOption(first.b);
 assert.doesNotMatch(await page.locator("#pinnedActivities").innerText(),/ABC Curriculum/);
 assert.doesNotMatch(await page.locator("#pinnedActivities").innerText(),/My Kindergarten Class/);
 assert.equal(await page.locator("#childTitle").innerText(),"QA Moonbeam");
 assert.equal(await page.locator("#photoPreview img").count(),0);
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"sky");
 assert.notEqual(await page.locator("#pv2Goal").inputValue(),"Sing the ABC song");
 await page.locator("#adultConfirm").check();
 await page.locator("#backgroundChoices button[data-theme='ocean']").click();
 await page.locator("#learnerSelect").selectOption(first.a);
 assert.match(await page.locator("#pinnedActivities").innerText(),/ABC Curriculum/);
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"forest");
 assert.equal(await page.locator("#photoPreview img").count(),1);
 assert.equal(await page.locator("#pv2Goal").inputValue(),"Sing the ABC song");
 console.log("PASS same-family learner switch isolates photos, themes, and Academy goals");
 const download=page.waitForEvent("download");
 await page.locator("#exportLook").click();
 const exported=await download;
 assert.match(exported.suggestedFilename(),/^khaemenes-kindergarten-visual-.*\.json$/);
 console.log("PASS visual bundle export");

 // Explicit Pre-K to Kindergarten visual handoff: same stable learner only.
 await page.evaluate(id=>{
   window.localStorage.setItem("khaemenes_preschool_visual_profile_v1:"+encodeURIComponent(id),JSON.stringify({
     schema:"khaemenes.prek-visual.v1",learnerId:id,theme:"sunset",avatar:"🌈",photo:""
   }));
 },first.a);
 await page.locator("#usePreschoolPhoto").click();
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"sunset");
 const prev=await page.evaluate(id=>JSON.parse(localStorage.getItem("khaemenes_preschool_visual_profile_v1:"+encodeURIComponent(id))),first.a);
 assert.equal(prev.theme,"sunset","source Pre-K preference must remain unchanged");
 console.log("PASS guardian-assisted Pre-K visual carryover leaves original record untouched");
 const wrongBackup={schema:"khaemenes.kindergarten-visual.v1",learnerId:first.b,theme:"night",avatar:"🦉",photo:""};
 await page.locator("#importLook").setInputFiles({name:"other-learner.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(wrongBackup))});
 assert.equal(await page.locator("body").getAttribute("data-prek-background"),"sunset","cross-learner import must not overwrite selected learner");
 assert.match(await page.locator("#lookStatus").innerText(),/belongs to another learner|wrong format/i);
 console.log("PASS wrong-learner visual bundle restore denied");
 await page.setViewportSize({width:390,height:844});
 const mobile=await page.evaluate(()=>({viewport:window.innerWidth,html:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert.ok(mobile.html<=mobile.viewport+5,"Kindergarten mobile profile has horizontal overflow: "+JSON.stringify(mobile));
 assert.ok(await page.locator("#firstStepLink").isVisible(),"first-step action must be accessible on mobile");
 console.log("PASS small-screen profile layout");

 assert.deepEqual(errors,[],"uncaught JavaScript errors: "+JSON.stringify(errors));
 console.log("PASS complete Kindergarten profile browser smoke");
}finally{await context.close();await browser.close()}
