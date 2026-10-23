"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const root=path.resolve(__dirname,"../curriculum/lessons");
const checks=[];
// Scope structural checks to the five visible lesson articles, not repeated teacher-facing reference text.
function test(name,fn){fn();checks.push(name);console.log("PASS "+name);}
for(let week=31;week<=36;week++){
  const id=String(week).padStart(2,"0");
  const html=fs.readFileSync(path.join(root,"unit-"+id,"formal-content.html"),"utf8");
  const dayBlocks=[...html.matchAll(/<article class="lesson"[^>]*>[\s\S]*?<\/article>/g)].map(match=>match[0]);
  const daily=dayBlocks.join("\n");
  test("Week "+id+": five daily targets and recall/vocabulary prompts",()=>{
    assert.equal(dayBlocks.length,5,"Week "+id+" should expose five daily lesson articles");
    assert.equal((daily.match(/Daily learning target:/g)||[]).length,5,"Week "+id+" must have five visible daily targets");
    assert.equal((daily.match(/class="prior-knowledge-retrieval"/g)||[]).length,5,"Week "+id+" must have one recall/vocabulary prompt per day");
  });
  test("Week "+id+": daily modeling, guided examples, and fresh transfer",()=>{
    assert.equal((daily.match(/Adult modeling:/g)||[]).length,5,"Week "+id+" needs five adult modeling examples");
    assert.equal((daily.match(/Guided practice \(three (?:varied|different) examples\)/gi)||[]).length,5,"Week "+id+" needs three guided examples every day");
    assert.equal((daily.match(/Fresh independent transfer:/g)||[]).length,5,"Week "+id+" needs a fresh independent transfer task every day");
    assert.equal((daily.match(/Corrective feedback:/g)||[]).length,5,"Week "+id+" needs explicit corrective feedback every day");
  });
  test("Week "+id+": learner evidence and differentiation remain present",()=>{
    assert.ok((daily.match(/Teacher evidence:/g)||[]).length>=5,"Week "+id+" needs teacher-observable evidence");
    assert.ok((daily.match(/(?:Practice evidence|Accessible evidence|Document what the learner actually|Record what the child actually)/gi)||[]).length>=5,"Week "+id+" needs a practice/evidence boundary");
    assert.ok((daily.match(/(?:Support with|Accept speech|Accept verbal|accessible communication|AAC|Accessible evidence:)/gi)||[]).length>=5,"Week "+id+" needs accessible differentiation options");
  });
  const packet=fs.readFileSync(path.resolve(__dirname,"../curriculum/printables/unit-"+id+"-packet.html"),"utf8");
  test("Week "+id+": printable has five learner pages and grade identity",()=>{
    assert.ok(packet.includes("Khaemenes Academy"),"Week "+id+" academy heading missing");
    assert.ok((packet.match(/Student(?: name)?:/gi)||[]).length>=5,"Week "+id+" needs learner identity on each page");
    assert.ok((packet.match(/Date:/g)||[]).length>=5,"Week "+id+" needs dates on each page");
    assert.ok((packet.match(/Grade: Kindergarten/g)||[]).length>=5,"Week "+id+" needs grade identity on each page");
    const count=(packet.match(/<section class="lesson">/g)||[]).length||Math.max(0,(packet.match(/<section class="print-page">/g)||[]).length-1);
    assert.equal(count,5,"Week "+id+" should provide five daily printable sheets");
  });
}
const packet34=fs.readFileSync(path.resolve(__dirname,"../curriculum/printables/unit-34-packet.html"),"utf8");
test("Week 34 printable aligns its five activities to tool, algorithm, grid, revision, and privacy lessons",()=>{
  for(const term of ["First, Next, Last","Paper Robot","Make Instructions Clear","Stop, Check, Ask","home address","Print / Save PDF"])assert.ok(packet34.includes(term),"Week 34 is missing "+term);
  assert.ok((packet34.match(/Grade: Kindergarten/g)||[]).length>=6,"Week 34 cover and daily pages need grade identity");
});
console.log("\nInstructional depth Weeks 31–36: "+checks.length+" checks passed.");
