(()=>{"use strict";
const C=window.KHAEMENES_KINDERGARTEN_SOCIAL_STUDIES,M=C.metadata,$=s=>document.querySelector(s),SUB=window.KhaemenesKindergartenSubjectContext||null,LEGACY=M.storageKey;
let db=read(),activeWeek=1,view="week",form=null;
function key(){return SUB?.scopedKey?.()||LEGACY}
function read(){
 try{
   const k=key(),existing=localStorage.getItem(k);
   if(existing)return JSON.parse(existing);
   if(k!==LEGACY){
     const old=localStorage.getItem(LEGACY);
     if(old){localStorage.setItem(k,old);return JSON.parse(old)}
   }
 }catch{}
 return{students:[],activeId:null}
}
function save(){localStorage.setItem(key(),JSON.stringify(db))}
function id(){return"kss_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function student(){return db.students.find(s=>s.id===db.activeId)||null}
function ensure(s){
 s.weeks||={};s.exams||={midterm:{best:0,attempts:[]},final:{best:0,attempts:[]}};
 for(let w=1;w<=36;w++)s.weeks[w]||={best:0,attempts:[],artifact:"",reflection:"",correction:"",lessonDone:{}};
}
function unlocked(s,w){if(w===1)return true;if(!s)return false;ensure(s);if(w===19&&(s.exams.midterm.best||0)<M.masteryThreshold)return false;return(s.weeks[w-1]?.best||0)>=M.masteryThreshold}
function highestOpen(s){let n=1;for(let w=2;w<=36;w++){if(unlocked(s,w))n=w;else break}return n}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function draw(bank,count,avoid=[]){
 const seen=new Set(avoid||[]),fresh=shuffle(bank.filter(q=>!seen.has(q.id))),old=shuffle(bank.filter(q=>seen.has(q.id)));
 return [...fresh,...old].slice(0,count).map(q=>{const order=shuffle(q.choices.map((_,i)=>i));return{...q,display:order.map(i=>q.choices[i]),answer:order.indexOf(q.answer)}})
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function cumulative(kind){const end=kind==="midterm"?18:36;return C.weeks.slice(0,end).flatMap(w=>w.currentQuestions||w.questions)}
function installControls(){
 if(!$("#academyContext")){
   const p=document.createElement("p");p.id="academyContext";p.className="small";$("#studentSelect")?.parentElement?.insertBefore(p,$("#studentSelect"));
 }
 if(!$("#midtermBtn")){
   const box=document.createElement("div");box.className="actions";box.style.marginTop="10px";box.innerHTML='<button id="midtermBtn">Midyear Check</button><button id="finalBtn">Final Check</button>';
   $("#weekList")?.parentElement?.insertBefore(box,$("#weekList"));
   $("#midtermBtn").onclick=()=>{view="midterm";form=null;render()};
   $("#finalBtn").onclick=()=>{view="final";form=null;render()};
 }
}
function render(){
 installControls();
 const s=student();if(s)ensure(s);
 const a=SUB?.status?.();
 $("#academyContext").textContent=a?.status==="ready"?`Academy learner: ${a.learner.nickname} · learner-scoped Social Studies record active.`:a?.status==="placement-mismatch"?"Active Academy learner is not placed in Kindergarten; preview/local mode only.":"No active Academy Kindergarten learner; local browser subject record.";
 $("#studentSelect").innerHTML=db.students.length?db.students.map(x=>`<option value="${x.id}" ${x.id===db.activeId?"selected":""}>${esc(x.name)}</option>`).join(""):'<option value="">No learner yet</option>';
 renderWeeks(s);renderStatus(s);
 if(view==="week")renderWeek(s);else renderExam(s,view);
}
function renderWeeks(s){
 $("#weekList").innerHTML=C.weeks.map(w=>{const open=unlocked(s,w.week),best=s?.weeks?.[w.week]?.best||0;return`<button class="weekbtn ${w.week===activeWeek&&view==="week"?"active":""} ${open?"":"locked"}" data-week="${w.week}" ${open?"":"disabled"}><strong>${String(w.week).padStart(2,"0")}</strong> ${esc(w.title)}<br><span class="small">${best?best+"% mastery":open?"Open":"Locked"}</span></button>`}).join("");
 document.querySelectorAll("[data-week]").forEach(b=>b.onclick=()=>{activeWeek=+b.dataset.week;view="week";form=null;render()});
}
function renderStatus(s){
 if(!s){$("#statusTitle").textContent="Create or choose a learner to begin.";$("#statusText").textContent="Week 1 is open. Future weeks unlock after 80% mastery.";$("#bar").style.width="0%";return}
 const mastered=C.weeks.filter(w=>(s.weeks[w.week]?.best||0)>=80).length;
 $("#statusTitle").textContent=`${s.name}: ${mastered}/36 weeks mastered`;
 $("#statusText").textContent=`Midyear ${s.exams.midterm.best||"—"} · Final ${s.exams.final.best||"—"} · Current official pathway: Week ${highestOpen(s)}`;
 $("#bar").style.width=Math.round(mastered/36*100)+"%";
}
function renderWeek(s){
 const w=C.weeks[activeWeek-1];
 if(!s){$("#content").innerHTML='<div class="card lockedbox"><h2>Welcome, scholar.</h2><p>Add a learner name to begin the official 36-week pathway.</p></div>';return}
 if(!unlocked(s,activeWeek)){$("#content").innerHTML='<div class="card lockedbox"><h2>Week locked</h2><p>Master the previous weekly check at 80% or higher first.</p></div>';return}
 const r=s.weeks[activeWeek];
 $("#content").innerHTML=`<article class="card"><div class="pills"><span class="pill">Week ${activeWeek}</span><span class="pill">${esc(w.unit)}</span><span class="pill">80% mastery gate</span></div><h2>${esc(w.title)}</h2><p><strong>Essential question:</strong> ${esc(w.essentialQuestion)}</p><p>${esc(w.keyIdea)}</p><p class="small"><strong>Vocabulary:</strong> ${w.vocabulary.map(esc).join(" · ")}</p></article>
 <article class="card"><h2>Monday–Friday Learning Path</h2>${w.lessons.map((l,i)=>`<section class="lesson"><label><input type="checkbox" data-lesson="${i}" ${r.lessonDone[i]?"checked":""}> completed with learner evidence</label><h3>${esc(l.day)} · ${esc(l.title)}</h3><p><strong>Objective:</strong> ${esc(l.objective)}</p><p>${esc(l.activity)}</p><p class="small"><strong>Evidence:</strong> ${esc(l.evidence)}</p></section>`).join("")}</article>
 <article class="card"><h2>Weekly Mastery Check</h2><p>Open-book and teacher read-aloud support are allowed. Five randomized questions are drawn from an 8-question bank. Fresh retakes prioritize questions not seen on the immediately prior attempt.</p><div class="notice ${r.best>=80?"good":r.best?"bad":""}"><strong>Best score: ${r.best||"—"}${r.best?"%":""}</strong> · ${r.attempts.length} attempt(s)</div><div id="quizArea"></div><div class="actions noPrint"><button class="primary" id="startQuiz">${r.attempts.length?"Start Fresh Retake":"Start Mastery Check"}</button><a class="button" href="printable.html?week=${activeWeek}" target="_blank">Printable</a></div><label>Correction note<textarea id="correction" placeholder="What changed after review?">${esc(r.correction||"")}</textarea></label></article>
 <article class="card"><h2>Portfolio Evidence</h2><label>Artifact / evidence note<textarea id="artifact">${esc(r.artifact||"")}</textarea></label><label>Reflection<textarea id="reflection">${esc(r.reflection||"")}</textarea></label><div class="actions noPrint"><button id="savePortfolio">Save Evidence</button><button onclick="window.print()">Print Week</button></div></article>`;
 document.querySelectorAll("[data-lesson]").forEach(z=>z.onchange=e=>{r.lessonDone[e.target.dataset.lesson]=e.target.checked;save()});
 $("#startQuiz").onclick=()=>{const avoid=r.attempts.at(-1)?.questionIds||[];form={kind:"weekly",questions:draw(w.questions,M.assessmentDraw,avoid)};showForm(r)};
 $("#savePortfolio").onclick=()=>{r.correction=$("#correction").value;r.artifact=$("#artifact").value;r.reflection=$("#reflection").value;save();alert("Evidence saved.")};
}
function showForm(record){
 const box=$("#quizArea")||$("#examForm");
 box.innerHTML=`<form id="quizForm">${form.questions.map((q,i)=>`<div class="q"><p><strong>${i+1}. ${esc(q.prompt)}</strong></p>${q.display.map((ch,j)=>`<label class="choice"><input type="radio" name="q${i}" value="${j}"> ${esc(ch)}</label>`).join("")}</div>`).join("")}<button class="primary" type="submit">Submit</button></form>`;
 $("#quizForm").onsubmit=e=>{e.preventDefault();let correct=0;for(let i=0;i<form.questions.length;i++){const z=document.querySelector(`input[name="q${i}"]:checked`);if(!z)return alert("Please answer every question.");if(+z.value===form.questions[i].answer)correct++}
  const score=Math.round(correct/form.questions.length*100),kind=form.kind;
  record.attempts.push({date:new Date().toISOString(),score,questionIds:form.questions.map(q=>q.id)});record.best=Math.max(record.best||0,score);save();form=null;
  alert(score>=80?`${kind==="weekly"?"Weekly":"Cumulative"} mastery achieved: ${score}%.`:`Score: ${score}%. Review together, record corrections, and take a fresh form.`);
  if(score>=80&&kind==="weekly"){if(activeWeek===18&&(student().exams.midterm.best||0)<80)view="midterm";else if(activeWeek===36)view="final";else if(activeWeek<36)activeWeek++}
  if(score>=80&&kind==="midterm"){view="week";activeWeek=19}
  render();
 };
}
function renderExam(s,kind){
 if(!s){$("#content").innerHTML='<div class="card lockedbox"><h2>Add a learner first.</h2></div>';return}
 const mid=kind==="midterm",eligible=mid?(s.weeks[18].best||0)>=80:(s.weeks[36].best||0)>=80;
 if(!eligible){$("#content").innerHTML=`<div class="card lockedbox"><h2>${mid?"Midyear":"Final"} check locked</h2><p>Master Week ${mid?18:36} first.</p></div>`;return}
 const rec=s.exams[kind],count=mid?M.midtermDraw:M.finalDraw,bank=cumulative(kind),avoid=rec.attempts.at(-1)?.questionIds||[];
 $("#content").innerHTML=`<article class="card"><div class="notice"><strong>${mid?"Midyear cumulative check · Weeks 1–18":"Final cumulative check · Weeks 1–36"}</strong><p>Closed-resource, teacher-assisted/read-aloud. ${count} randomized questions from a ${bank.length}-item pool. 80% mastery required.</p></div><h2>${mid?"Kindergarten Social Studies Midyear Check":"Kindergarten Social Studies Final Check"}</h2><p>Best: <strong>${rec.best?rec.best+"%":"—"}</strong> · Attempts: ${rec.attempts.length}</p><div id="examForm"></div><button class="primary noPrint" id="startExam">Start Fresh Form</button></article>`;
 $("#startExam").onclick=()=>{form={kind,questions:draw(bank,count,avoid)};showForm(rec)};
}
$("#addStudent").onclick=()=>{const name=$("#studentName").value.trim();if(!name)return;const x={id:id(),name,weeks:{},exams:{midterm:{best:0,attempts:[]},final:{best:0,attempts:[]}}};ensure(x);db.students.push(x);db.activeId=x.id;$("#studentName").value="";save();activeWeek=1;view="week";render()};
$("#studentSelect").onchange=e=>{db.activeId=e.target.value;save();activeWeek=highestOpen(student());view="week";render()};
window.addEventListener("khaemenes-family-changed",()=>{db=read();render()});
render();
})();