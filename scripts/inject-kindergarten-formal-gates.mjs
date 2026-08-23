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

const targets=[...lessonTargets(),...assessmentTargets()];
if(targets.length<41)throw new Error(`Expected at least 41 formal Kindergarten surfaces; found ${targets.length}`);

const missing=[];
let changed=0;
for(const file of targets){
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
  console.error("Missing Kindergarten formal gate injection:");
  missing.forEach(x=>console.error(`- ${x}`));
  process.exit(1);
}

console.log(checkOnly?`Kindergarten formal gate coverage: PASS (${targets.length} surfaces)`:`Injected Kindergarten formal gate into ${changed} of ${targets.length} surfaces.`);
