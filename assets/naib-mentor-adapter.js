(()=>{
"use strict";
if(window.KhaemenesKinderNAIBAdapter)return;
const API=Object.freeze({
  request(message,context={}){
    if(window.KhaemenesKinderSTOSBridge?.mentorRequest){
      return window.KhaemenesKinderSTOSBridge.mentorRequest({message,context});
    }
    window.dispatchEvent(new CustomEvent("khaemenes-kinder-mentor-request",{detail:{message:String(message||""),context}}));
    return Promise.resolve({queued:true});
  }
});
Object.defineProperty(window,"KhaemenesKinderNAIBAdapter",{value:API,configurable:true});
})();