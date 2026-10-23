(()=>{"use strict";
const C=window.KHAEMENES_KINDERGARTEN_SOCIAL_STUDIES,M=C.metadata,$=s=>document.querySelector(s),SUB=window.KhaemenesKindergartenSubjectContext||null,LEGACY=M.storageKey;
let db=read(),activeWeek=1,view="week",form=null;
function key(){return SUB?.scopedKey?.()||LEGACY}
function read(){try{return JSON.parse(localStorage.getItem(key()))||{students:[],activeId:null}}catch{return{students:[],activeId:null}}}
function save(){localStorage.setItem(key(),JSON.stringify(db))}
function id(){return"kss_"+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function student(){return db.students.find(s=>s.id===db.activeId)||null}
function ensure(s){s.weeks||={};s.exams||={};s.localization||={statePack:"generic",stateLabel:"",updatedAt:null};for(const k of ["midterm","final"]){s.exams[k]||={best:0,attempts:[]};s.exams[k].attempts||=[];s.exams[k].best=s.exams[k].best||0;s.exams[k].reviewStatus??="observed"}for(let w=1;w<=36;w++){s.weeks[w]||={best:0,attempts:[],artifact:"",reflection:"",correction:"",lessonDone:{}};s.weeks[w].attempts||=[];s.weeks[w].lessonDone||={};s.weeks[w].localizationEvidence??="";s.weeks[w].reviewStatus??="observed";s.weeks[w].constructedResponse??="";s.weeks[w].evidenceMode??="tell"}}
function syncAcademyLearner(){const a=SUB?.status?.("social-studies");if(a?.status!=="ready")return false;const aid=a.learner.learnerId;let x=db.students.find(s=>s.academyLearnerId===aid||s.id==="academy_"+aid),changed=false;if(!x){x={id:"academy_"+aid,name:a.learner.nickname,academyLearnerId:aid,weeks:{},exams:{},localization:{statePack:"generic",stateLabel:"",updatedAt:null}};ensure(x);db.students.push(x);changed=true}else{ensure(x);if(x.academyLearnerId!==aid){x.academyLearnerId=aid;changed=true}if(x.id!=="academy_"+aid){x.id="academy_"+aid;changed=true}}if(x.name!==a.learner.nickname){x.name=a.learner.nickname;changed=true}if(db.activeId!==x.id){db.activeId=x.id;changed=true}if(changed)save();return true}
function unlocked(s,w){if(w===1)return true;if(!s)return false;ensure(s);if(w===19&&(s.exams.midterm.best||0)<M.masteryThreshold)return false;return(s.weeks[w-1]?.best||0)>=M.masteryThreshold}
function highestOpen(s){let n=1;for(let w=2;w<=36;w++){if(unlocked(s,w))n=w;else break}return n}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function recentIds(record,depth=M.antiRepeatDepth||2){return new Set((record?.attempts||[]).slice(-depth).flatMap(a=>a.questionIds||[]))}function decorate(q){const order=shuffle(q.choices.map((_,i)=>i));return{...q,display:order.map(i=>q.choices[i]),answer:order.indexOf(q.answer)}}function draw(bank,count,record){const avoid=recentIds(record),fresh=shuffle(bank.filter(q=>!avoid.has(q.id))),seen=shuffle(bank.filter(q=>avoid.has(q.id)));return[...fresh,...seen].slice(0,count).map(decorate)}function drawStratified(kind,count,record){const end=kind==="midterm"?18:36,groups=[...C.weeks.slice(0,end).reduce((m,w)=>{const k=w.unit||("Unit "+Math.ceil(w.week/4));if(!m.has(k))m.set(k,[]);m.get(k).push(...(w.currentQuestions||w.questions));return m},new Map()).values()],avoid=recentIds(record),picked=[],selected=new Set();let guard=0;while(picked.length<count&&guard++<count*20){for(const group of shuffle(groups)){if(picked.length>=count)break;const fresh=group.filter(q=>!selected.has(q.id)&&!avoid.has(q.id)),repeat=group.filter(q=>!selected.has(q.id));const pool=fresh.length?fresh:repeat;if(pool.length){const q=shuffle(pool)[0];picked.push(q);selected.add(q.id)}}}if(picked.length<count){const rest=cumulative(kind).filter(q=>!selected.has(q.id));picked.push(...shuffle(rest).slice(0,count-picked.length))}return picked.slice(0,count).map(decorate)}function localizationHtml(s,r,w,week){if(!M.localizationCheckpoints?.includes(week))return"";const pack=s.localization?.statePack||"generic",label=s.localization?.stateLabel||(pack==="florida"?"Florida":"My state / community"),task=C.localizationTasks?.[week]?.[pack==="florida"?"florida":"generic"]||M.localizationPolicy;return `<article class="card"><div class="pills"><span class="pill">My state / community</span></div><h2>Local Learning Evidence</h2><p><strong>Context:</strong> ${esc(label)}</p><p>${esc(task)}</p><label>Teacher / learner evidence note<textarea id="localizationEvidence">${esc(r.localizationEvidence||"")}</textarea></label><p class="small">This observation record is separate from the 80% mastery score.</p></article>`}
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
 syncAcademyLearner();
 installControls();
 const s=student();if(s)ensure(s);
 const a=SUB?.status?.();
 $("#academyContext").textContent=a?.status==="ready"?`Academy learner: ${a.learner.nickname} · learner-scoped Social Studies record active.`:a?.status==="placement-mismatch"?"Active Academy learner is not placed in Kindergarten; preview/local mode only.":"No active Academy Kindergarten learner; local browser subject record.";
 $("#studentSelect").innerHTML=db.students.length?db.students.map(x=>`<option value="${x.id}" ${x.id===db.activeId?"selected":""}>${esc(x.name)}</option>`).join(""):'<option value="">No learner yet</option>';const academyReady=a?.status==="ready";$("#studentSelect").disabled=academyReady;$("#studentName").disabled=academyReady;$("#addStudent").disabled=academyReady;
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
function renderSourceStudio(w){
 const studio=w.sourceStudio;if(!studio)return "";
 const source=s=>{const rows=(s.rows||[]).length?`<table><tbody>${s.rows.map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</tbody></table>`:"";const findings=(s.findings||[]).length?`<ul>${s.findings.map(f=>`<li><strong>${esc(f.question)}</strong> ${esc(f.finding)}</li>`).join("")}</ul>`:"";return `<section class="lesson"><h3>Source ${esc(s.id)} · ${esc(s.type)}</h3><p class="small"><strong>Creator:</strong> ${esc(s.creator)} · <strong>Date:</strong> ${esc(s.date)} · <strong>Context:</strong> ${esc(s.context)}</p>${s.content?`<p>${esc(s.content)}</p>`:""}${rows}${findings}<p class="small"><strong>Accessible description:</strong> ${esc(s.accessibleDescription)}<br><strong>Citation:</strong> ${esc(s.citation)}</p></section>`};
 return `<article class="card"><div class="pills"><span class="pill">Source Studio</span><span class="pill">Student-facing evidence</span></div><h2>${esc(studio.title)}</h2><p><strong>Inquiry:</strong> ${esc(studio.inquiry)}</p>${studio.sources.map(source).join("")}<p><strong>Look closely:</strong> ${studio.prompts.map(esc).join(" · ")}</p><p class="small">${esc(studio.accessibility)}</p></article>`;
}
function renderEvidenceResponse(w,r){
 const e=w.evidenceResponse;if(!e)return "";
 return `<article class="card"><div class="pills"><span class="pill">Evidence Ladder · Kindergarten</span></div><h2>Point · Draw · Tell</h2><p>${esc(e.prompt)}</p><p class="small">${esc(e.requirement)}</p><label>How did the learner respond? <select id="evidenceMode"><option value="point" ${r.evidenceMode==="point"?"selected":""}>Point / select</option><option value="draw" ${r.evidenceMode==="draw"?"selected":""}>Draw</option><option value="tell" ${r.evidenceMode==="tell"?"selected":""}>Tell / oral</option><option value="dictate" ${r.evidenceMode==="dictate"?"selected":""}>Dictate</option></select></label><label>Adult transcription / evidence note<textarea id="constructedResponse" placeholder="Record the learner's exact words or describe the clue they pointed to/drew.">${esc(r.constructedResponse||"")}</textarea></label></article>`;
}
function renderWeek(s){
 const w=C.weeks[activeWeek-1];
 if(!s){$("#content").innerHTML='<div class="card lockedbox"><h2>Welcome, scholar.</h2><p>Add a learner name to begin the official 36-week pathway.</p></div>';return}
 if(!unlocked(s,activeWeek)){$("#content").innerHTML='<div class="card lockedbox"><h2>Week locked</h2><p>Master the previous weekly check at 80% or higher first.</p></div>';return}
 const r=s.weeks[activeWeek];
 $("#content").innerHTML=`<article class="card"><div class="pills"><span class="pill">Week ${activeWeek}</span><span class="pill">${esc(w.unit)}</span><span class="pill">80% mastery gate</span></div><h2>${esc(w.title)}</h2><p><strong>Essential question:</strong> ${esc(w.essentialQuestion)}</p><p>${esc(w.keyIdea)}</p><p class="small"><strong>Vocabulary:</strong> ${w.vocabulary.map(esc).join(" · ")}</p></article>${localizationHtml(s,r,w,activeWeek)}${renderSourceStudio(w)}${renderEvidenceResponse(w,r)}<article class="card"><h2>Monday–Friday Learning Path</h2>${w.lessons.map((l,i)=>`<section class="lesson"><label><input type="checkbox" data-lesson="${i}" ${r.lessonDone[i]?"checked":""}> completed with learner evidence</label><h3>${esc(l.day)} · ${esc(l.title)}</h3><p><strong>Objective:</strong> ${esc(l.objective)}</p><p>${esc(l.activity)}</p><p class="small"><strong>Evidence:</strong> ${esc(l.evidence)}</p></section>`).join("")}</article>
 <article class="card"><h2>Weekly Mastery Check</h2><p>Open-book and teacher read-aloud support are allowed. Five randomized questions are drawn from this week’s source-linked bank. Recent forms are de-prioritized across the last two attempts when the bank permits.</p><div class="notice ${r.best>=80?"good":r.best?"bad":""}"><strong>Best score: ${r.best||"—"}${r.best?"%":""}</strong> · ${r.attempts.length} attempt(s)</div><div id="quizArea"></div><div class="actions noPrint"><button class="primary" id="startQuiz">${r.attempts.length?"Start Fresh Retake":"Start Mastery Check"}</button><a class="button" href="printable.html?week=${activeWeek}" target="_blank">Printable</a></div><label>Correction note<textarea id="correction" placeholder="What changed after review?">${esc(r.correction||"")}</textarea></label></article>
 <article class="card"><h2>Portfolio Evidence</h2><label>Artifact / evidence note<textarea id="artifact">${esc(r.artifact||"")}</textarea></label><label>Reflection<textarea id="reflection">${esc(r.reflection||"")}</textarea></label><div class="actions noPrint"><button id="savePortfolio">Save Evidence</button><button onclick="window.print()">Print Week</button></div></article>`;
 document.querySelectorAll("[data-lesson]").forEach(z=>z.onchange=e=>{r.lessonDone[e.target.dataset.lesson]=e.target.checked;save()});
 $("#startQuiz").onclick=()=>{const avoid=r.attempts.at(-1)?.questionIds||[];form={kind:"weekly",questions:draw(w.questions,M.weeklyDraw||M.assessmentDraw,r)};showForm(r)};
 $("#savePortfolio").onclick=()=>{r.correction=$("#correction").value;r.artifact=$("#artifact").value;r.reflection=$("#reflection").value;if($("#constructedResponse"))r.constructedResponse=$("#constructedResponse").value;if($("#evidenceMode"))r.evidenceMode=$("#evidenceMode").value;if($("#localizationEvidence"))r.localizationEvidence=$("#localizationEvidence").value;save();alert("Evidence saved.")};
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
 $("#startExam").onclick=()=>{form={kind,questions:drawStratified(kind,count,rec)};showForm(rec)};
}
$("#addStudent").onclick=()=>{const name=$("#studentName").value.trim();if(!name)return;const x={id:id(),name,weeks:{},exams:{midterm:{best:0,attempts:[]},final:{best:0,attempts:[]}}};ensure(x);db.students.push(x);db.activeId=x.id;$("#studentName").value="";save();activeWeek=1;view="week";render()};
$("#studentSelect").onchange=e=>{db.activeId=e.target.value;save();activeWeek=highestOpen(student());view="week";render()};
window.addEventListener("khaemenes-family-changed",()=>{db=read();render()});
render();
})();