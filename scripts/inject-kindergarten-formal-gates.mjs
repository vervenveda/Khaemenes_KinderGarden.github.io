import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const TAG='<script src="https://vervenveda.com/Khaemenes_KinderGarden.github.io/assets/khaemenes-kinder-mastery-gates.js" data-khaemenes-kindergarten-formal-gate="1"></script>';
const checkOnly=process.argv.includes("--check");

function lessonTargets(){
  const root=path.join(ROOT,"curriculum","lessons");
  return fs.readdirSync(root,{withFileTypes:true})
    .filter(e=>e.isDirectory()&&/^unit-\d{2}$/.test(e.name))
    .map(e=>path.join(root,e.name,"index.html"))
    .filter(fs.existsSync)
    .sort();
}

function assessmentTargets(){
  const root=path.join(ROOT,"curriculum","assessments");
  return fs.readdirSync(root,{withFileTypes:true})
    .filter(e=>e.isFile()&&(
      /^unit-\d{2}-assessment\.html$/.test(e.name)||
      ["midterm.html","final-exam.html","weekly-assessments.html"].includes(e.name)
    ))
    .map(e=>path.join(root,e.name))
    .sort();
}

const lessons=lessonTargets();
const assessments=assessmentTargets();
if(lessons.length!==36)throw new Error(`Expected 36 formal Kindergarten lesson surfaces; found ${lessons.length}`);
if(assessments.length!==39)throw new Error(`Expected 39 legacy assessment surfaces; found ${assessments.length}`);

const missing=[];
let changed=0;
for(const file of [...lessons,...assessments]){
  let html=fs.readFileSync(file,"utf8");
  if(html.includes("data-khaemenes-kindergarten-formal-gate"))continue;
  missing.push(path.relative(ROOT,file));
  if(checkOnly)continue;
  if(!/<\/head>/i.test(html))throw new Error(`Cannot inject formal gate: ${path.relative(ROOT,file)} has no </head>`);
  html=html.replace(/<\/head>/i,`${TAG}\n</head>`);
  fs.writeFileSync(file,html);
  changed++;
}

if(checkOnly&&missing.length){
  console.error("Missing Kindergarten formal gate coverage:");
  missing.forEach(x=>console.error(`- ${x}`));
  process.exit(1);
}

const total=lessons.length+assessments.length;
console.log(checkOnly?`Kindergarten formal gate coverage: PASS (${lessons.length} lessons + ${assessments.length} legacy assessment surfaces = ${total})`:`Injected Kindergarten formal gate into ${changed} of ${total} surfaces.`);
