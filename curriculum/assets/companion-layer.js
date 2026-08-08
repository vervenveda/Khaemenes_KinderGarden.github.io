/*
 * Kinder Garden curriculum companion decorator v1.0.0
 * Adds optional practice links to the unit cards produced by app.js.
 * It does not alter grades, completion gates, or learner records.
 */
(() => {
  "use strict";

  const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  function localKinderHref(path){
    return "../" + String(path||"").replace(/^\/+/,"");
  }

  function decorate(){
    const grid=document.getElementById("unitGrid");
    const C=window.KhaemenesKinderCompanions;
    if(!grid||!C)return;

    [...grid.querySelectorAll(".week-card")].forEach((card,index)=>{
      if(card.querySelector(".companion-block"))return;
      const n=index+1;
      const match=C.forUnit(n,window.KhaemenesPreschoolCatalog);
      const kinder=match?.kinder?.[0]||null;
      const creche=match?.creche||null;
      const block=document.createElement("div");
      block.className="companion-block";
      block.innerHTML=`
        <strong>Practice companions for this week</strong>
        <small>${esc(match?.reason||"Optional practice after the core lesson.")}</small>
        <div class="companion-actions">
          ${kinder?`<a href="${localKinderHref(kinder.path)}">${kinder.icon} ${esc(kinder.title)}</a>`:""}
          ${creche?`<a class="creche" href="${creche.url}">${esc(creche.icon||"🌈")} Crechè · ${esc(creche.title)}</a>`:""}
        </div>`;
      card.appendChild(block);
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{
    decorate();
    const grid=document.getElementById("unitGrid");
    if(!grid)return;
    let queued=false;
    new MutationObserver(()=>{
      if(queued)return;
      queued=true;
      requestAnimationFrame(()=>{queued=false;decorate();});
    }).observe(grid,{childList:true});
  });
})();
