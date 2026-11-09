/* Kindergarten Picture & Colors Studio adapter.
 * Existing learner-owned Kindergarten visual record remains canonical.
 * This adapter does not issue or authenticate parent credentials.
 */
(()=>{"use strict";
const g=window,core=g.KhaemenesUniversalProfileLookEditor,legacy=g.KhaemenesKindergartenLookBridge;
if(!core?.register||!legacy||g.KhaemenesKindergartenUniversalLookAdapter)return;
const BADGES=["★","✦","📚","🧭","⚛","🎨","🎵","🌿","🔬","🧪","🧬","🌌","🌙","☀️","🪐","🌎","⚙️","💻","✏️","🎭","📐","🏛️","🦋","🏆"];
const PHOTO=/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i;
const current=()=>legacy.identity();
const allowed=(id)=>Boolean(id&&current()?.id===id);
const adapter=Object.freeze({
 allowYearbook:true,
 showDisplayName:false,
 maxPhotoChars:180000,
 getIdentity:current,
 readLook(id){
  if(!allowed(id))return {};
  const v=legacy.read(id)||{};
  return {badge:BADGES.includes(v.avatar)?v.avatar:"★",
   frame:v.frame||"circle",background:"parchment",
   cardColor:v.cardColor||"",nameFont:v.nameFont||"academy",displayName:""};
 },
 readPhoto(id){return allowed(id)?legacy.read(id)?.photo||"":""},
 readHeroImage(id){return allowed(id)?legacy.read(id)?.heroImage||"":""},
 commit({id,look,photo,heroImage}){
  if(!allowed(id)||!look||!BADGES.includes(look.badge))return false;
  if(photo!==null&&!(photo===""||(typeof photo==="string"&&photo.length<180000&&PHOTO.test(photo))))return false;
  if(heroImage!==null&&!(heroImage===""||(typeof heroImage==="string"&&heroImage.length<180000&&PHOTO.test(heroImage))))return false;
  return legacy.commit(id,look,photo,heroImage)===true;
 },
 refresh(){legacy.refresh()}
});
if(!core.register(adapter))return;
g.KhaemenesKindergartenUniversalLookAdapter=adapter;
})();
