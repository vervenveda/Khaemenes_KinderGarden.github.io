(() => {
  "use strict";

  const IDS = Object.freeze({
    button:"vnvEcosystemMenuButton",
    overlay:"vnvEcosystemMenuOverlay",
    drawer:"vnvEcosystemMenuDrawer",
    search:"vnvEcosystemMenuSearch",
    content:"vnvEcosystemMenuContent",
    status:"vnvEcosystemMenuStatus",
    style:"vnvEcosystemMenuStyles"
  });
  const publicHost=/^(?:www\.)?vervenveda\.com$|^vervenveda\.github\.io$/i.test(location.hostname||"");
  const PUBLIC_ROOT=publicHost ? location.origin+"/" : "https://vervenveda.com/";
  const REGISTRY=PUBLIC_ROOT+"ecosystem/master-ecosystem-directory.json";
  const HOME=PUBLIC_ROOT;
  const CATEGORY_ORDER=["education","research","news","weather","creative","professional","games","health","finance","civic","environmental","communication","gateway"];
  const CATEGORY_LABELS={
    education:"Education",research:"Research & Discovery",news:"News & Verification",
    weather:"Weather & Space",creative:"Art, Music & Creativity",professional:"Professional Tools",
    games:"Games & Play",health:"Health & Wellness",finance:"Finance",civic:"Civic & Community",
    environmental:"Earth & Environment",communication:"Communication",gateway:"Main Gateways"
  };

  if(document.getElementById(IDS.button) || document.getElementById(IDS.overlay)) return;
  if(document.getElementById("menuOverlay") && document.getElementById("menuButton") && /public gateway/i.test(document.title||"")) return;

  let entries=[];
  let catalogParts=[];
  let catalogPages=[];
  let catalogLoaded=false;
  let catalogLoading=null;
  let ecosystemCounts={repositories:0,pages:0};
  let lastFocus=null;
  let previousBodyOverflow=null;

  const esc=(value)=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const safeUrl=(value)=>{
    try{
      const url=new URL(value,location.href);
      if(url.protocol!=="https:") return null;
      const allowed=["vervenveda.com","www.vervenveda.com","vervenveda.github.io","artist1970.github.io","jenniferpearl2028.github.io"];
      if(!allowed.includes(url.hostname)) return null;
      return url.href;
    }catch{return null}
  };

  function installStyle(){
    /* Presentation lives in /assets/vnv-ecosystem-menu.css.
       Keep this function as a compatibility seam for older boot paths. */
  }

  function mountButton(){
    const button=document.createElement("button");
    button.id=IDS.button;
    button.type="button";
    button.setAttribute("aria-expanded","false");
    button.setAttribute("aria-controls",IDS.overlay);
    button.setAttribute("aria-label","Open Verve N Veda ecosystem directory");
    const ecosystemSlot=document.querySelector("[data-vnv-ecosystem-slot]");
    const nativeMenu=document.querySelector('#menuButton, .menu-button[aria-controls], .hamburger[aria-controls], [data-menu-toggle]');
    if(ecosystemSlot){
      button.innerHTML='<span class="vnv-eco-lines" aria-hidden="true"><span></span></span>';
      button.classList.add("vnv-eco-icon-only");
      button.title="Ecosystem Directory";
    }else{
      button.innerHTML=nativeMenu
        ? '<span class="vnv-eco-label">Ecosystem Directory</span>'
        : '<span class="vnv-eco-lines" aria-hidden="true"><span></span></span><span class="vnv-eco-label">Ecosystem</span>';
      if(nativeMenu)button.classList.add("vnv-eco-text-only");
    }

    const target=
      ecosystemSlot ||
      document.querySelector("[data-vnv-global-tools]") ||
      document.querySelector(".header-actions") ||
      document.querySelector(".nav-utilities") ||
      document.querySelector(".topbar-inner") ||
      document.querySelector(".site-header .nav") ||
      document.querySelector(".site-header .header-inner") ||
      document.querySelector("header nav");

    if(target) target.append(button);
    else {button.classList.add("vnv-eco-fixed");document.body.append(button);}
    return button;
  }

  function mountDrawer(){
    const overlay=document.createElement("div");
    overlay.id=IDS.overlay;
    overlay.dataset.open="false";
    overlay.setAttribute("aria-hidden","true");
    overlay.innerHTML=`
      <aside id="${IDS.drawer}" role="dialog" aria-modal="true" aria-labelledby="vnvEcosystemMenuTitle">
        <div class="vnv-eco-top">
          <div><p class="vnv-eco-kicker">One Connected Public Campus</p><h2 id="vnvEcosystemMenuTitle">Ecosystem Directory</h2></div>
          <button class="vnv-eco-close" type="button" aria-label="Close ecosystem directory">×</button>
        </div>
        <p class="vnv-eco-intro">Browse curated doorways or search every synchronized public page across Verve N Veda.</p>
        <div class="vnv-eco-home"><a href="${HOME}">Verve N Veda Home</a></div>
        <label style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)" for="${IDS.search}">Search the ecosystem</label>
        <input id="${IDS.search}" type="search" autocomplete="off" placeholder="Search education, art, news, tools…">
        <p id="${IDS.status}" role="status" aria-live="polite">Loading public directory…</p>
        <div id="${IDS.content}"></div>
      </aside>`;
    document.body.append(overlay);
    return overlay;
  }

  function render(query=""){
    const box=document.getElementById(IDS.content);
    const status=document.getElementById(IDS.status);
    if(!box)return;
    const q=String(query||"").trim().toLowerCase();

    if(q.length>=2 && !catalogLoaded){
      status.textContent="Searching the synchronized public page catalog…";
      ensureCatalog().then(()=>render(query)).catch(()=>render(query));
      return;
    }

    if(q.length>=2 && catalogLoaded){
      const matches=catalogPages.filter(page=>
        [page.title,page.category,page.repo,page.path,page.source]
          .join(" ").toLowerCase().includes(q)
      ).slice(0,60);
      box.innerHTML=matches.length
        ? '<section><h3 class="vnv-eco-group">Complete Public Index</h3><div class="vnv-eco-list">'+matches.map(page=>
            '<a class="vnv-eco-link" href="'+esc(page.url)+'"><span><strong>'+esc(page.title||page.path)+'</strong><small>'+esc((page.source||page.repo||"Verve N Veda")+' · '+(page.path||""))+'</small></span><span class="vnv-eco-arrow" aria-hidden="true">↗</span></a>'
          ).join("")+'</div></section>'
        : '<p class="vnv-eco-intro">No synchronized public page matches this search.</p>';
      status.textContent=matches.length
        ? "Showing "+matches.length+" of "+ecosystemCounts.pages.toLocaleString()+" synchronized public pages."
        : "No match across "+ecosystemCounts.pages.toLocaleString()+" synchronized public pages.";
      return;
    }

    const filtered=entries.filter(e=>!q || [e.title,e.category,e.type,e.description].join(" ").toLowerCase().includes(q));
    const groups=new Map();
    filtered.forEach(e=>{
      const key=e.category||"gateway";
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(e);
    });
    const order=[...CATEGORY_ORDER,...[...groups.keys()].filter(k=>!CATEGORY_ORDER.includes(k))];
    box.innerHTML=order.filter(k=>groups.has(k)).map(k=>{
      const list=groups.get(k).sort((a,b)=>a.title.localeCompare(b.title));
      return '<section><h3 class="vnv-eco-group">'+esc(CATEGORY_LABELS[k]||k)+'</h3><div class="vnv-eco-list">'+list.map(e=>
        '<a class="vnv-eco-link" href="'+esc(e.url)+'"><span><strong>'+esc(e.title)+'</strong><small>'+esc(e.type||"public doorway")+'</small></span><span class="vnv-eco-arrow" aria-hidden="true">↗</span></a>'
      ).join("")+'</div></section>';
    }).join("");
    const repoText=ecosystemCounts.repositories ? " · "+ecosystemCounts.repositories+" repositories" : "";
    const pageText=ecosystemCounts.pages ? " · "+ecosystemCounts.pages.toLocaleString()+" searchable pages" : "";
    status.textContent=filtered.length+" curated "+(filtered.length===1?"doorway":"doorways")+repoText+pageText+".";
  }

  async function ensureCatalog(){
    if(catalogLoaded)return catalogPages;
    if(catalogLoading)return catalogLoading;
    catalogLoading=(async()=>{
      const parts=catalogParts.length ? catalogParts : [
        "/registry/ecosystem-pages-a.json",
        "/registry/ecosystem-pages-b.json"
      ];
      const settled=await Promise.allSettled(parts.map(async part=>{
        const url=new URL(part,PUBLIC_ROOT).href;
        const response=await fetch(url,{cache:"no-store",credentials:"same-origin"});
        if(!response.ok)throw new Error("HTTP "+response.status);
        const data=await response.json();
        return Array.isArray(data?.pages)?data.pages:[];
      }));
      const seen=new Set();
      catalogPages=settled
        .filter(result=>result.status==="fulfilled")
        .flatMap(result=>result.value)
        .filter(page=>{
          const url=safeUrl(page?.url);
          if(!url)return false;
          const key=String(page.repo||"").toLowerCase()+"|"+String(page.path||"").toLowerCase();
          if(seen.has(key))return false;
          seen.add(key);
          page.url=url;
          return true;
        });
      if(!catalogPages.length)throw new Error("catalog unavailable");
      catalogLoaded=true;
      return catalogPages;
    })().finally(()=>{catalogLoading=null});
    return catalogLoading;
  }

  async function load(){
    const status=document.getElementById(IDS.status);
    try{
      const response=await fetch(REGISTRY,{cache:"no-store",credentials:"same-origin"});
      if(!response.ok)throw new Error("HTTP "+response.status);
      const data=await response.json();
      if(!Array.isArray(data?.entries))throw new Error("entries missing");
      catalogParts=Array.isArray(data?.pageCatalog?.parts)
        ? data.pageCatalog.parts.filter(part=>/^\/registry\/[A-Za-z0-9._/-]+\.json$/i.test(String(part||"")))
        : [];
      ecosystemCounts={
        repositories:Number(data?.pageCatalog?.repositoryCount)||0,
        pages:Number(data?.pageCatalog?.publicPageCount)||0
      };
      entries=data.entries.filter(e=>{
        if(!e||e.directoryVisible!==true||e.access!=="free-public"||e.status!=="active"||!e.title)return false;
        const url=safeUrl(e.url);
        if(!url)return false;
        e.url=url;
        return true;
      });
      render("");
    }catch(err){
      entries=[
        {title:"Khaemenes Academy",url:"/Khaemenes_Academy.github.io/",category:"education",type:"gateway"},
        {title:"PLERA Search",url:"/PLERASearch.github.io/",category:"research",type:"gateway"},
        {title:"The Verifier",url:"/theverifier.github.io/",category:"news",type:"gateway"},
        {title:"Bazaar Art",url:"/bazaarart.github.io/",category:"creative",type:"gateway"},
        {title:"Aurora",url:"/aurora.github.io/",category:"health",type:"gateway"},
        {title:"333 Network",url:"/333.github.io/",category:"communication",type:"network"}
      ].map(e=>({...e,url:new URL(e.url,location.origin).href}));
      render("");
      if(status)status.textContent="Core ecosystem gateways available; full directory is temporarily unavailable.";
    }
  }

  function open(){
    lastFocus=document.activeElement;
    const overlay=document.getElementById(IDS.overlay);
    const button=document.getElementById(IDS.button);
    overlay.dataset.open="true";
    overlay.setAttribute("aria-hidden","false");
    button.setAttribute("aria-expanded","true");
    previousBodyOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    setTimeout(()=>document.getElementById(IDS.search)?.focus(),0);
  }
  function close(){
    const overlay=document.getElementById(IDS.overlay);
    const button=document.getElementById(IDS.button);
    overlay.dataset.open="false";
    overlay.setAttribute("aria-hidden","true");
    button.setAttribute("aria-expanded","false");
    if(previousBodyOverflow!==null)document.body.style.overflow=previousBodyOverflow;
    previousBodyOverflow=null;
    if(lastFocus?.focus)lastFocus.focus();
  }
  function bind(){
    const button=document.getElementById(IDS.button);
    const overlay=document.getElementById(IDS.overlay);
    const closeButton=overlay.querySelector(".vnv-eco-close");
    button.addEventListener("click",open);
    closeButton.addEventListener("click",close);
    overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
    document.getElementById(IDS.search).addEventListener("input",e=>render(e.target.value));
    document.addEventListener("keydown",e=>{
      if(e.key==="Escape"&&overlay.dataset.open==="true")close();
      if(e.key==="Tab"&&overlay.dataset.open==="true"){
        const focusable=[...overlay.querySelectorAll('a[href],button,input,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled);
        if(!focusable.length)return;
        const first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
  }

  function start(){
    if(!document.body)return;
    if(document.getElementById(IDS.button) || document.getElementById(IDS.overlay)) return;
    if(document.getElementById("menuOverlay") && document.getElementById("menuButton") && /public gateway/i.test(document.title||"")) return;
    if(window.__VNV_ECOSYSTEM_MENU_MOUNTING__) return;
    window.__VNV_ECOSYSTEM_MENU_MOUNTING__=true;
    try{
      installStyle();
      mountButton();
      mountDrawer();
      bind();
      load();
    }finally{
      window.__VNV_ECOSYSTEM_MENU_MOUNTING__=false;
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();

  window.VNVEcosystemMenu=Object.freeze({version:"1.2.0",open,close});
})();