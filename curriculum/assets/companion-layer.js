/*
 * Kinder Garden curriculum companion decorator v2.0.0
 * Skill-matched from actual week data. New registered resources are
 * automatically eligible without a manual week-map edit.
 */
(() => {
  "use strict";
  const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const localKinderHref=path=>"../"+String(path||"").replace(/^\/+/,"");

  function decorate(){
    const grid=document.getElementById("unitGrid");
    const C=window.KhaemenesKinderCompanions;
    if(!grid||!C)return;

    [...grid.querySelectorAll("[data-week-card]")].forEach(card=>{
      const n=Number(card.dataset.weekCard);
      let block=card.querySelector(".companion-block");
      const match=C.forUnit(n,window.KhaemenesPreschoolCatalog,{courseData:window.KHAE_KINDERGARTEN_DATA});
      if(!block){block=document.createElement("div");block.className="companion-block";card.appendChild(block)}
      const kinder=match?.kinder||[],creche=match?.creche||[];
      block.innerHTML=`
        <strong>NAIB skill-matched practice</strong>
        <small>${esc(match?.reason||"Optional practice connected to this week's lesson skills.")}</small>
        <div class="companion-actions">
          ${kinder.slice(0,2).map(r=>`<a href="${localKinderHref(r.path)}">${esc(r.icon||"✨")} ${esc(r.title)}</a>`).join("")}
          ${creche.slice(0,1).map(r=>`<a class="creche" href="${r.url}">${esc(r.icon||"🌈")} Crechè · ${esc(r.title)}</a>`).join("")}
        </div>`;
    });
  }

  document.addEventListener("DOMContentLoaded",()=>{
    decorate();
    const grid=document.getElementById("unitGrid");
    if(!grid)return;
    let queued=false;
    new MutationObserver(()=>{
      if(queued)return;queued=true;
      requestAnimationFrame(()=>{queued=false;decorate()});
    }).observe(grid,{childList:true,subtree:false});
  });

  window.addEventListener("khaemenes-kinder-resources-changed",decorate);
})();
