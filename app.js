const SUPABASE_URL='https://blfgwysgekfqhcafofhe.supabase.co';
const SUPABASE_KEY='sb_publishable_ThLetpd4hj49fjce-kXoFA_v4ghwIqV';
const RESET_URL='https://tib-sap-training-assistant-mobile.vercel.app/reset.html';
let DATA=[],ALL_DATA=[],ci=0,mi=0,li=0,si=0,deferredPrompt,currentUtterance=null,accessToken=null,userEmail=null;
const $=id=>document.getElementById(id);
function opt(sel,arr,label){sel.innerHTML='';arr.forEach((x,i)=>{let o=document.createElement('option');o.value=i;o.textContent=label(x,i);sel.appendChild(o)})}
function save(){localStorage.setItem('tib-mobile',JSON.stringify({ci,mi,li,si}))}
function lab(){return DATA[ci].modules[mi].labs[li]}
function loadCourse(){let c=DATA[ci];opt($('module'),c.modules,m=>`${m.number}. ${m.name}`);mi=Math.min(mi,c.modules.length-1);$('module').value=mi;loadModule()}
function loadModule(){let m=DATA[ci].modules[mi];opt($('lab'),m.labs,l=>l.lab);li=Math.min(li,m.labs.length-1);$('lab').value=li;si=0;showPreLab()}
function narrationText(){
  let parts=(lab().steps||[]).map(s=>(s.narration||'').trim()).filter(Boolean);
  return parts.join('\n\n');
}
function showPreLab(){
  stopSpeech(); let l=lab(),c=DATA[ci],m=c.modules[mi];
  $('prelab').hidden=false;$('card').hidden=true;
  $('prelabtitle').textContent=l.lab;$('preobjective').textContent=l.objective||'';
  $('preprogress').textContent=`${c.name} • ${m.name} • Pre-SAP walkthrough`;
  let has=!!narrationText();
  $('walkthrough').disabled=!has;
  $('narrationStatus').textContent=has?'Listen first, then select START LAB when you are ready to work in SAP.':'Narrated walkthrough is not available for this lab. You may proceed to START LAB.';
  save();
}
function startLab(){stopSpeech();$('prelab').hidden=true;$('card').hidden=false;si=0;render()}
function currentSections(l){
  if(Array.isArray(l.navigation_sections)&&l.navigation_sections.length){
    return l.navigation_sections.map(String).filter(x=>x.trim());
  }
  const out=(l.steps||[]).map(s=>String(s.action||s.title||'').trim()).filter(Boolean);
  if(out.length) return out;
  const nav=Array.isArray(l.navigation)?l.navigation:[String(l.navigation||'')];
  return nav.filter(x=>x.trim());
}
function render(){
  let c=DATA[ci],m=c.modules[mi],l=lab(),sections=currentSections(l);
  if(si>=sections.length)si=Math.max(0,sections.length-1);
  $('labtitle').textContent=l.lab;$('objective').textContent=l.objective||'';
  $('sectiontext').textContent=sections[si]||'';
  const unit=(Array.isArray(l.navigation_sections)&&l.navigation_sections.length)?'Section':'Step';
  $('progress').textContent=`${c.name} • ${m.name} • ${unit} ${si+1} of ${Math.max(1,sections.length)}`;
  $('showbox').hidden=true;$('prev').disabled=si===0;
  $('next').textContent=si===sections.length-1?'Complete Lab ✓':'Complete & Next →';save()
}
function resetAudioUI(){
  $('audioControls').hidden=true;$('pause').disabled=false;$('resume').disabled=true;
  $('walkthrough').textContent='▶ PLAY WALKTHROUGH';
}
function stopSpeech(){if('speechSynthesis'in window)speechSynthesis.cancel();currentUtterance=null;resetAudioUI()}
function pauseSpeech(){if(speechSynthesis.speaking&&!speechSynthesis.paused){speechSynthesis.pause();$('pause').disabled=true;$('resume').disabled=false}}
function resumeSpeech(){if(speechSynthesis.paused){speechSynthesis.resume();$('pause').disabled=false;$('resume').disabled=true}}
function playWalkthrough(){
  stopSpeech();let t=narrationText();
  if(!t){alert('Narrated walkthrough is not available for this lab.');return}
  let u=new SpeechSynthesisUtterance(t);currentUtterance=u;u.rate=.92;
  u.onstart=()=>{$('audioControls').hidden=false;$('walkthrough').textContent='🔊 RESTART WALKTHROUGH'};
  u.onend=()=>{if(currentUtterance===u){currentUtterance=null;resetAudioUI()}};
  u.onerror=()=>{if(currentUtterance===u){currentUtterance=null;resetAudioUI()}};
  speechSynthesis.speak(u)
}
function show(){
  const l=lab();
  const text=String(l.show_all_navigation||currentSections(l).join('\n\n'));
  $('showbox').textContent=text;
  $('showbox').hidden=false;
  $('showbox').scrollTop=0;
}
$('walkthrough').onclick=playWalkthrough;$('pause').onclick=pauseSpeech;$('resume').onclick=resumeSpeech;$('stop').onclick=stopSpeech;
$('startLab').onclick=startLab;$('show').onclick=show;
$('prev').onclick=()=>{stopSpeech();if(si>0){si--;render()}else showPreLab()};
$('next').onclick=()=>{stopSpeech();let l=lab(),sections=currentSections(l);if(si<sections.length-1){si++;render()}else{alert('Lab complete. Select another lab or continue as directed by your instructor.');showPreLab()}};
$('course').onchange=e=>{stopSpeech();ci=+e.target.value;mi=li=si=0;loadCourse()};
$('module').onchange=e=>{stopSpeech();mi=+e.target.value;li=si=0;loadModule()};
$('lab').onchange=e=>{stopSpeech();li=+e.target.value;si=0;showPreLab()};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('install').hidden=false});
$('install').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;$('install').hidden=true}};
async function api(path,method='GET',body=null,token=null){
  const h={'apikey':SUPABASE_KEY,'Content-Type':'application/json'}; if(token)h.Authorization='Bearer '+token;
  const r=await fetch(SUPABASE_URL+path,{method,headers:h,body:body===null?undefined:JSON.stringify(body)});
  const t=await r.text(); let j={}; try{j=t?JSON.parse(t):{}}catch{j={message:t}}
  if(!r.ok)throw new Error(j.msg||j.message||j.error_description||j.error||('HTTP '+r.status)); return j;
}
async function signIn(){
  const email=$('loginEmail').value.trim().toLowerCase(),password=$('loginPassword').value;
  if(!email||!password){$('loginStatus').textContent='Enter your email and password.';return}
  $('loginStatus').textContent='Signing in and checking enrollment…';
  try{
    const a=await api('/auth/v1/token?grant_type=password','POST',{email,password}); accessToken=a.access_token; userEmail=email;
    const ent=await api('/rest/v1/rpc/get_my_training_assistant_courses','POST',{},accessToken);
    const allowed=new Set(ent.map(x=>x.app_course_id));
    if(!allowed.size)throw new Error('Your account is valid, but no active Training Assistant course enrollment was found.');
    if(!ALL_DATA.length){const r=await fetch('courses.json',{cache:'no-store'}); if(!r.ok)throw new Error('Could not load course catalog.'); ALL_DATA=await r.json()}
    DATA=ALL_DATA.filter(c=>allowed.has(c.id));
    if(!DATA.length)throw new Error('Your enrollment was found, but the assigned course content is not present in this mobile build.');
    ci=mi=li=si=0; opt($('course'),DATA,c=>c.name); $('course').value=0; loadCourse();
    $('loginPanel').hidden=true;$('appShell').hidden=false;$('logout').hidden=false;$('loginPassword').value='';$('loginStatus').textContent='';
  }catch(e){accessToken=null;$('loginStatus').textContent='Sign-in failed: '+e.message}
}
async function forgotPassword(){
  const email=$('loginEmail').value.trim().toLowerCase(); if(!email){$('loginStatus').textContent='Enter your registered email first.';return}
  try{await api('/auth/v1/recover?redirect_to='+encodeURIComponent(RESET_URL),'POST',{email});$('loginStatus').textContent='Password reset requested. Check your email.'}catch(e){$('loginStatus').textContent='Could not request reset: '+e.message}
}
function logout(){stopSpeech();accessToken=null;DATA=[];ci=mi=li=si=0;$('appShell').hidden=true;$('logout').hidden=true;$('loginPanel').hidden=false;$('loginStatus').textContent='Signed out.'}
$('signIn').onclick=signIn;$('forgotPassword').onclick=forgotPassword;$('logout').onclick=logout;$('loginPassword').addEventListener('keydown',e=>{if(e.key==='Enter')signIn()});
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech()});window.addEventListener('pagehide',stopSpeech);
function tibIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent)}
function tibStandalone(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
function tibIOSGuide(){const el=$('iosInstallGuide');if(el)el.hidden=!(tibIOS()&&!tibStandalone())}
window.addEventListener('DOMContentLoaded',tibIOSGuide);window.addEventListener('pageshow',tibIOSGuide);
