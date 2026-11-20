#!/usr/bin/env node
import fs from "node:fs";

const required=[
 "vnv-header-autopopulate.js",
 "kindergarten-local-menu-adapter.js",
 "kindergarten-language-loader.js",
 "kindergarten-local-toolbar.js",
 "kindergarten-contained-shell.css"
];
const core=[
 "index.html","student-profile/index.html","today/index.html","reading/index.html","graduation/index.html",
 "curriculum/index.html","portfolio-builder/index.html","social-studies/index.html","inquiry-companion.html",
 "curriculum/kinder_garden_phonic_awareness_index.html"
];
const apps=[
 "ABC_curriculum_index.html","ABC_letter-lab.index.html","ABC_spelling_soup_index.html","ABC_story-sing-along.html",
 "Breath_index.html","History_curriculum_index.html","Math_curriculum_index.html","Math_kinder_index.html",
 "Math_space_index.html_index.html","Numbers_&_quiz_index.html","Numbers_1-12_index.html","PE_curriculum_index.html",
 "Spelling_safari_index.html","Weather_compass_index.html","Weather_planetarium_index.html","Weather_wizard_index.html",
 "breathing-bubble_index.html","kindergarten_math_cloud_index.html","math-garden_index.html","sink-or-float_index.html","weather-match_index.html"
].map(x=>"apps/"+x);
const lessonGates=Array.from({length:36},(_,i)=>`curriculum/lessons/unit-${String(i+1).padStart(2,"0")}/index.html`);
const lessons=Array.from({length:36},(_,i)=>`curriculum/lessons/unit-${String(i+1).padStart(2,"0")}/formal-content.html`);
const assessments=[
 ...Array.from({length:36},(_,i)=>`curriculum/assessments/unit-${String(i+1).padStart(2,"0")}-assessment.html`),
 "curriculum/assessments/weekly-assessments.html","curriculum/assessments/midterm.html","curriculum/assessments/final-exam.html"
];
const targets=[...core,...apps,...lessonGates,...lessons,...assessments];
const problems=[];
for(const file of targets){
 if(!fs.existsSync(file)){problems.push(file+": missing");continue}
 const src=fs.readFileSync(file,"utf8");
 const auto=(src.match(/vnv-ticker-autopopulate\.js/g)||[]).length;
 if(auto!==1)problems.push(file+": expected exactly one auto ticker loader, found "+auto);
 if(/vnv-333-ticker\.js/.test(src))problems.push(file+": 333 ticker forbidden in contained child experience");
 if(/vnv-ecosystem-toolbar\.js|khaemenes-landing-toolbar\.js/.test(src))problems.push(file+": general ecosystem toolbar forbidden in contained child experience");
 for(const token of required)if(!src.includes(token))problems.push(file+": missing "+token);
}
const regulator="assets/kindergarten-global-standard-v1.js";
if(!fs.existsSync(regulator)||!fs.readFileSync(regulator,"utf8").includes('khaemenesPageRegulator="retired"')){
 problems.push("retired Kindergarten regulator contract changed");
}
if(problems.length){console.error(JSON.stringify({status:"FAIL",checked:targets.length,problems},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",checked:targets.length,policy:"contained Kindergarten child experience; no general ecosystem exits"},null,2));
