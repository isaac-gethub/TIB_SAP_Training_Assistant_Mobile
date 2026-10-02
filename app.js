let DATA=[],ci=0,mi=0,li=0,si=0,deferredPrompt,currentUtterance=null;
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
function evidenceForStep(l,s){
  const text=[s.title||'',s.action||'',s.confirm||''].join(' ');
  const required=/evidence|screenshot|screen shot|capture|export|save|workpaper|document|file name|filename/i.test(text);
  if(!required) return '';
  return 'Evidence/documentation is part of this step. Follow the ACTION exactly as written; do not skip its capture, export, save, screenshot, filename, or workpaper direction.';
}
function render(){
  let c=DATA[ci],m=c.modules[mi],l=lab(),s=l.steps[si]||{};
  $('labtitle').textContent=l.lab;$('objective').textContent=l.objective||'';
  $('steptitle').textContent=s.title||`Step ${si+1}`;$('action').textContent=s.action||'';
  $('confirm').textContent=s.confirm||l.expected_result||'';
  const ev=evidenceForStep(l,s); $('evidenceBlock').hidden=!ev; $('evidenceText').textContent=ev;
  $('progress').textContent=`${c.name} • ${m.name} • Step ${si+1} of ${l.steps.length}`;
  $('showbox').hidden=true;$('prev').disabled=si===0;
  $('next').textContent=si===l.steps.length-1?'Complete Lab ✓':'Confirm & Next →';save()
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
  let l=lab(),s=l.steps[si],t=(s.action||'').replace(/\s+(then|→)\s+/gi,' > ');
  let parts=t.split(/\s*>\s*|;\s*/).filter(Boolean);
  $('showbox').innerHTML='<b>SHOW ME — SAP Navigation Guide</b>'+parts.map((p,i)=>`<div class="crumb">${i+1}. ${p}</div>`).join('')+(l.navigation?.length?'<hr><small>'+l.navigation.join('<br>')+'</small>':'');
  $('showbox').hidden=false
}
$('walkthrough').onclick=playWalkthrough;$('pause').onclick=pauseSpeech;$('resume').onclick=resumeSpeech;$('stop').onclick=stopSpeech;
$('startLab').onclick=startLab;$('show').onclick=show;
$('prev').onclick=()=>{stopSpeech();if(si>0){si--;render()}else showPreLab()};
$('next').onclick=()=>{stopSpeech();let l=lab();if(si<l.steps.length-1){si++;render()}else{alert('Lab complete. Select another lab or continue as directed by your instructor.');showPreLab()}};
$('course').onchange=e=>{stopSpeech();ci=+e.target.value;mi=li=si=0;loadCourse()};
$('module').onchange=e=>{stopSpeech();mi=+e.target.value;li=si=0;loadModule()};
$('lab').onchange=e=>{stopSpeech();li=+e.target.value;si=0;showPreLab()};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('install').hidden=false});
$('install').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;$('install').hidden=true}};
fetch('courses.json').then(r=>r.json()).then(d=>{DATA=d;let p=JSON.parse(localStorage.getItem('tib-mobile')||'{}');ci=p.ci||0;mi=p.mi||0;li=p.li||0;si=0;opt($('course'),DATA,c=>c.name);$('course').value=ci;loadCourse();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js')});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech()});window.addEventListener('pagehide',stopSpeech);
function tibIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent)}
function tibStandalone(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
function tibIOSGuide(){const el=$('iosInstallGuide');if(el)el.hidden=!(tibIOS()&&!tibStandalone())}
window.addEventListener('DOMContentLoaded',tibIOSGuide);window.addEventListener('pageshow',tibIOSGuide);
