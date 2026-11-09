/* My Daily Adventure: playful participation UI. Formal mastery remains separate. */
(function(g,d){"use strict";
 if(g.KhaemenesKinderDailyAdventure)return;
 const reg=()=>g.KhaemenesFamilyRegistry,plan=()=>g.KhaemenesKinderFamilyDailyPlan;
 const current=()=>{const l=reg()?.getLearner?.();return l?.stage==="kindergarten"?l:null};
 const $=id=>d.getElementById(id);
 function render(){
  const box=$("kinderDailyAdventure"),progress=$("kinderAdventureProgress"),status=$("kinderAdventureStatus");
  if(!box||!progress||!status)return false;
  const l=current(),today=l?plan()?.today?.(l.learnerId):null,grid=$("kinderAdventureActivities");
  grid.replaceChildren();
  if(!today){
   $("kinderAdventureStars").replaceChildren();
   const lesson=$("kinderAdventureLesson");lesson.href="https://vervenveda.com/Khaemenes_KinderGarden.github.io/today/";lesson.textContent="Explore Today's First Step";
   progress.textContent="Choose a Kindergarten learner to open today's adventures.";
   status.textContent="Guest preview · no activity check-ins saved.";
   return false;
  }
  const finished=today.activities.filter(a=>a.checked).length;
  const stars=$("kinderAdventureStars");stars.replaceChildren();
  for(let i=0;i<today.activities.length;i++){
   const star=d.createElement("span");star.textContent=i<finished?"⭐":"☆";
   star.setAttribute("aria-hidden","true");
   star.style.cssText="font-size:29px;line-height:1.3";
   stars.append(star);
  }
  progress.textContent=finished+" of "+today.activities.length+" little adventures enjoyed today";
  status.textContent=finished===today.activities.length?
   "Wonderful exploring! These stars celebrate effort, not grades or mastery.":
   "Tap an adventure when you have explored it. A grown-up chooses the activity plan.";
  for(const activity of today.activities){
   const button=d.createElement("button");button.type="button";
   button.className="kinder-adventure-tile";
   button.setAttribute("aria-pressed",String(activity.checked));
   const icon=d.createElement("span");icon.textContent=activity.icon;icon.setAttribute("aria-hidden","true");
   icon.style.cssText="font-size:30px;line-height:1.2";
   const title=d.createElement("span");title.textContent=activity.label;
   title.style.cssText="font:400 17px/1.3 Nunito,Arial,sans-serif";
   const state=d.createElement("span");state.textContent=activity.checked?"★ Enjoyed!":"Mark enjoyed";
   state.style.cssText="font:400 16px/1.2 Nunito,Arial,sans-serif";
   button.append(icon,title,state);
   button.onclick=()=>{
    const live=current();
    if(!live||live.learnerId!==today.learnerId){render();return}
    const success=plan()?.checkIn?.(today.learnerId,activity.id,!activity.checked)===true;
    if(!success)status.textContent="Could not save that check-in on this device.";
    render();
   };
   grid.append(button);
  }
  // Existing Kindergarten continuation is the sole authority for formal lesson links.
  try{
   const context=JSON.parse(g.localStorage.getItem("khaemenes_kindergarten_today_context_v1:"+encodeURIComponent(l.learnerId))||"null");
   const lesson=$("kinderAdventureLesson");
   const url=String(context?.href||"");
   const allowed=url.startsWith("https://vervenveda.com/Khaemenes_KinderGarden.github.io/curriculum/")&&context?.learnerId===l.learnerId;
   lesson.href=allowed?url:"https://vervenveda.com/Khaemenes_KinderGarden.github.io/today/";
   lesson.textContent=allowed?"Open My Next Lesson":"Open Today's First Step";
  }catch{}
  return true;
 }
 function mount(){
  if(!$("kinderDailyAdventure"))return false;
  g.addEventListener("khaemenes-family-changed",render);
  g.addEventListener("khaemenes-kinder-daily-plan-changed",render);
  g.addEventListener("storage",render);
  g.addEventListener("pageshow",render);
  render();return true;
 }
 g.KhaemenesKinderDailyAdventure=Object.freeze({render,mount});
 if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(window,document);
