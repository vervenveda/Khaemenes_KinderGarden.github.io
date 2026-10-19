(()=>{"use strict";
const out=document.getElementById("out");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function render(){
 const G=window.KhaemenesKinderMasteryGates,C=window.KhaemenesKinderContinuity;
 if(!G||!C){out.innerHTML='<section class="print-page"><h1>Khaemenes Academy</h1><h2>Certificate unavailable</h2><p>Canonical learner verification is unavailable. The certificate remains locked; please open your Family Profile and try again.</p></section>';return;}
 const profile=C.getLearnerSummary?.()||{};
 const eligible=G.formalAccess() && G.certificationReady() && G.completedWeeks()===36 &&
 G.milestoneMastery("midterm").mastered && G.milestoneMastery("final").mastered &&
 G.learnerRecord().portfolio===true;
 const name=esc(profile.nickname||"Kindergarten Scholar");
 const met=G.completedWeeks();const mid=G.milestoneMastery("midterm").bestPercent||0,fin=G.milestoneMastery("final").bestPercent||0;
 out.innerHTML=eligible?`<section class="print-page" style="margin:auto;max-width:850px;text-align:center;padding:45px 30px;border:8px double #a48a51;background:#fff;color:#25362c"><h1>Khaemenes Academy</h1><h2>Certificate of Kindergarten Completion</h2><p>This certifies that</p><h2>${name}</h2><p>has satisfied the Kindergarten curriculum completion requirements.</p><p><strong>Mastered weeks:</strong> ${met}/36 · <strong>Midterm:</strong> ${mid}% · <strong>Final:</strong> ${fin}% · <strong>Portfolio:</strong> Approved</p><p style="font-size:12px">Local learner-scoped evidence; independent Academy server verification must be completed before official credential issuance.</p><div style="display:flex;gap:40px;justify-content:space-around;margin-top:65px"><span>____________________<br>Teacher / guardian</span><span>____________________<br>Date</span></div><button type="button" class="button no-print" onclick="window.print()">Print provisional record</button></section>`:
 `<section class="print-page" style="margin:auto;max-width:800px;text-align:center;padding:35px"><h1>Khaemenes Academy</h1><h2>Certificate Locked</h2><p>The certificate requires an authorized learner, all 36 individually mastered weeks, midyear and final mastery at 80% or higher with required essential criteria, and portfolio approval.</p><p>Current learner-scoped results: ${met}/36 weeks · midterm ${mid}% · final ${fin}% · portfolio ${G.learnerRecord().portfolio?"approved":"pending"}.</p><p>Legacy averages cannot authorize a certificate.</p><a href="../index.html">Return to Curriculum</a></section>`;
}
render();
window.addEventListener("khaemenes-kindergarten-mastery-changed",render);
window.addEventListener("khaemenes-kindergarten-assessment-sync",render);
})();