/* Khaemenes Kindergarten · contained local hamburger */
(()=>{"use strict";
if(window.VNV_ENRICHED_MENU?.kindergartenContained)return;
const ID="vnvEnrichedMenuOverlay",HOME="https://vervenveda.com/Khaemenes_KinderGarden.github.io/";
const links=[
 ["🏡 Kindergarten Home",HOME],
 ["☀️ Today",HOME+"today/"],
 ["🌱 36-Week Garden",HOME+"curriculum/"],
 ["📚 Reading Garden",HOME+"reading/"],
 ["😊 My Profile",HOME+"student-profile/"],
 ["🎓 Lantern Bridge",HOME+"graduation/"],
 ["🧑‍🧒 Grown-Up Corner",HOME+"family/"]
];
let prior=null;
function mount(){
 const trigger=document.querySelector("[data-vnv-enriched-trigger],.vnv-header-menu-button");
 if(trigger){trigger.setAttribute("aria-label","Open Kindergarten menu");trigger.setAttribute("aria-controls",ID)}
 if(document.getElementById(ID))return document.getElementById(ID);
 const o=document.createElement("div");o.id=ID;o.dataset.open="false";o.setAttribute("aria-hidden","true");
 o.innerHTML='<aside class="kg-local-menu-panel" role="dialog" aria-modal="true" aria-label="Kindergarten menu"><div class="kg-local-menu-top"><strong>Kindergarten Menu</strong><button type="button" class="kg-local-menu-close" aria-label="Close Kindergarten menu">×</button></div><nav class="kg-local-menu-list" aria-label="Kindergarten destinations"></nav></aside>';
 const nav=o.querySelector("nav");for(const [label,href] of links){const a=document.createElement("a");a.href=href;a.textContent=label;nav.append(a)}
 o.querySelector(".kg-local-menu-close").addEventListener("click",close);o.addEventListener("click",e=>{if(e.target===o)close()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&o.dataset.open==="true")close()});
 document.body.append(o);return o
}
function open(){const o=mount();prior=document.activeElement;o.dataset.open="true";o.setAttribute("aria-hidden","false");o.querySelector(".kg-local-menu-close")?.focus()}
function close(){const o=document.getElementById(ID);if(!o)return;o.dataset.open="false";o.setAttribute("aria-hidden","true");prior?.focus?.()}
window.VNV_ENRICHED_MENU=Object.freeze({kindergartenContained:true,mount,open,close});
})();