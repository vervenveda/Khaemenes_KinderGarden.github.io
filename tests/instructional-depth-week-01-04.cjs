"use strict";
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const lessonRoot=path.resolve(__dirname,"../curriculum/lessons");
const checks=[];
function test(name,fn){fn();checks.push(name);console.log("PASS "+name);}
for(let week=1;week<=4;week++){
  const id=String(week).padStart(2,"0");
  const html=fs.readFileSync(path.join(lessonRoot,"unit-"+id,"formal-content.html"),"utf8");
  const articles=[...html.matchAll(/<article class="(?:kg-lesson|lesson)"[^>]*>[\s\S]*?<\/article>/g)].map(m=>m[0]);
  test("Week "+id+": retains five original interactive daily lessons",()=>{
    assert.equal(articles.length,5,"Week "+id+" must retain five daily lessons");
    if(week===2){
      assert.ok(html.includes('data-kg-complete="${idx}"'),"Week 02 must retain its dynamically generated day-completion controls");
      assert.equal((html.match(/data-kg-day="/g)||[]).length,5,"Week 02 must retain five day tabs");
    }else{
      assert.equal((html.match(/data-kg-complete=/g)||[]).length,5,"Week "+id+" must retain the original five day-completion controls");
    }
  });
  test("Week "+id+": one explicit instructional scaffold per day",()=>{
    for(const article of articles){
      assert.equal((article.match(/class="kg-instructional-scaffold"/g)||[]).length,1,"Each Week "+id+" day must have one teaching scaffold");
      for(const label of ["Recall &amp; key words:","Guided practice — three examples","Show it independently","Feedback and evidence","Accessible ways to participate"])assert.ok(article.includes(label),"Week "+id+" daily scaffold missing "+label);
    }
  });
  test("Week "+id+": scaffold does not replace original activities",()=>{
    if(week===2){
      assert.equal((html.match(/<strong>Workshop:<\/strong>/g)||[]).length,5,"Week 02 workshop learning activities should remain");
      assert.equal((html.match(/<strong>Centers:<\/strong>/g)||[]).length,5,"Week 02 center recommendations should remain");
    }else{
      const activityCount=(html.match(/<div class="kg-activity">/g)||[]).length;
      assert.ok(activityCount>=5,"Week "+id+" original interactive activities should remain");
    }
    assert.ok(html.includes("80%")||week===1,"Week "+id+" course must retain formal mastery messaging when present");
  });
  const packet=fs.readFileSync(path.resolve(__dirname,"../curriculum/printables/unit-"+id+"-packet.html"),"utf8");
  test("Week "+id+": printable identity and five daily worksheets",()=>{
    assert.ok(packet.includes("Khaemenes Academy"),"Week "+id+" Academy heading missing");
    assert.ok((packet.match(/Grade: Kindergarten/g)||[]).length>=6,"Week "+id+" cover and daily pages need grade metadata");
    assert.ok((packet.match(/Student:/g)||[]).length>=5,"Week "+id+" needs student fields");
    assert.ok((packet.match(/Date:/g)||[]).length>=5,"Week "+id+" needs date fields");
    assert.equal((packet.match(/<section class="print-page">/g)||[]).length,6,"Week "+id+" should have one cover and five day sheets");
  });
}
const rubrics=fs.readFileSync(path.resolve(__dirname,"../curriculum/data/a-plus-mastery.js"),"utf8");
test("Weeks 01–04 week-specific formal mastery rubrics remain present",()=>{
  for(let week=1;week<=4;week++)assert.match(rubrics,new RegExp("\\n\\s*"+week+":\\s*\\["));
});
console.log("\nInstructional depth Weeks 01–04: "+checks.length+" checks passed.");
