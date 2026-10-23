"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"../curriculum/printables");let passed=0;
for(let week=1;week<=36;week++){
 const id=String(week).padStart(2,"0");
 const html=fs.readFileSync(path.join(root,`unit-${id}-packet.html`),"utf8");
 const days=(html.match(/<section class="lesson">/g)||[]).length||Math.max(0,(html.match(/<section class="print-page">/g)||[]).length-1);
 assert.equal(days,5,`Week ${id} must have five activities`);
 assert.match(html,/Khaemenes Academy/,`Week ${id} Academy heading`);
 assert.match(html,/Student(?: name)?:/,`Week ${id} student name line`);
 assert.match(html,/Date:/,`Week ${id} date line`);
 assert.match(html,/break-before:page!important/,`Week ${id} print pagination`);
 assert.ok((html.match(/Student(?: name)?:/g)||[]).length>=5,`Week ${id} every day has name line`);
 assert.ok((html.match(/Date:/g)||[]).length>=5,`Week ${id} every day has date line`);
 if(week>=31){
   assert.ok((html.match(/Grade: Kindergarten/g)||[]).length>=5,`Week ${id} every day has explicit Kindergarten grade metadata`);
   assert.ok((html.match(new RegExp(`Week ${id}`,"g"))||[]).length>=5,`Week ${id} repeated pages identify the week`);
 }
 if(week===34){
   for(const label of ["Monday","Tuesday","Wednesday","Thursday","Friday"])assert.ok(html.includes(label),`Week 34 includes ${label}`);
   for(const term of ["First, Next, Last","Paper Robot","Make Instructions Clear","Stop, Check, Ask","home address","Print / Save PDF"])assert.ok(html.includes(term),`Week 34 printable aligns lesson target: ${term}`);
   assert.ok((html.match(/class="print-page"/g)||[]).length===6,"Week 34 includes a cover and five printable day pages");
 }
 passed++;
}
console.log(`PASS: ${passed}/36 printable source checks (rendered PDF inspection remains separate).`);
