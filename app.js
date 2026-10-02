let DATA=[],ci=0,mi=0,li=0,si=0,deferredPrompt;const $=id=>document.getElementById(id);function opt(sel,arr,label){sel.innerHTML='';arr.forEach((x,i)=>{let o=document.createElement('option');o.value=i;o.textContent=label(x,i);sel.appendChild(o)})}function save(){localStorage.setItem('tib-mobile',JSON.stringify({ci,mi,li,si}))}function loadCourse(){let c=DATA[ci];opt($('module'),c.modules,(m)=>`${m.number}. ${m.name}`);mi=Math.min(mi,c.modules.length-1);$('module').value=mi;loadModule()}function loadModule(){let m=DATA[ci].modules[mi];opt($('lab'),m.labs,l=>l.lab);li=Math.min(li,m.labs.length-1);$('lab').value=li;si=0;render()}function render(){let c=DATA[ci],m=c.modules[mi],l=m.labs[li],s=l.steps[si]||{};$('labtitle').textContent=l.lab;$('objective').textContent=l.objective||'';$('steptitle').textContent=s.title||`Step ${si+1}`;$('action').textContent=s.action||'';$('confirm').textContent=s.confirm||l.expected_result||'';$('progress').textContent=`${c.name} • ${m.name} • Step ${si+1} of ${l.steps.length}`;$('showbox').hidden=true;$('prev').disabled=si===0;$('next').textContent=si===l.steps.length-1?'Complete Lab ✓':'Confirm & Next →';save()}let currentUtterance=null;
function resetAudioUI(){
  $('audioControls').hidden=true;
  $('pause').disabled=false;
  $('resume').disabled=true;
  $('listen').textContent='🔊 LISTEN';
}
function stopSpeech(){
  if('speechSynthesis' in window){
    speechSynthesis.cancel();
  }
  currentUtterance=null;
  resetAudioUI();
}
function pauseSpeech(){
  if('speechSynthesis' in window && speechSynthesis.speaking && !speechSynthesis.paused){
    speechSynthesis.pause();
    $('pause').disabled=true;
    $('resume').disabled=false;
  }
}
function resumeSpeech(){
  if('speechSynthesis' in window && speechSynthesis.paused){
    speechSynthesis.resume();
    $('pause').disabled=false;
    $('resume').disabled=true;
  }
}
function speak(){
  stopSpeech();
  let l=DATA[ci].modules[mi].labs[li],s=l.steps[si],
      t=s.narration||`${s.title||''}. ${s.action||''}. ${s.confirm||''}`;
  let u=new SpeechSynthesisUtterance(t);
  currentUtterance=u;
  u.rate=.92;
  u.onstart=()=>{
    $('audioControls').hidden=false;
    $('listen').textContent='🔊 RESTART';
  };
  u.onend=()=>{ if(currentUtterance===u){ currentUtterance=null; resetAudioUI(); } };
  u.onerror=()=>{ if(currentUtterance===u){ currentUtterance=null; resetAudioUI(); } };
  speechSynthesis.speak(u);
}
function show(){let l=DATA[ci].modules[mi].labs[li],s=l.steps[si],t=(s.action||'').replace(/\s+(then|→)\s+/gi,' > ');let parts=t.split(/\s*>\s*|;\s*/).filter(Boolean);$('showbox').innerHTML='<b>SHOW ME — Navigation Guide</b>'+parts.map((p,i)=>`<div class="crumb">${i+1}. ${p}</div>`).join('')+(l.navigation?.length?'<hr><small>'+l.navigation.join('<br>')+'</small>':'');$('showbox').hidden=false}$('listen').onclick=speak;$('pause').onclick=pauseSpeech;$('resume').onclick=resumeSpeech;$('stop').onclick=stopSpeech;$('show').onclick=show;$('prev').onclick=()=>{stopSpeech();if(si>0){si--;render()}};$('next').onclick=()=>{stopSpeech();let l=DATA[ci].modules[mi].labs[li];if(si<l.steps.length-1){si++;render()}else alert('Lab complete. Select another lab or continue as directed by your instructor.')};$('course').onchange=e=>{stopSpeech();ci=+e.target.value;mi=li=si=0;loadCourse()};$('module').onchange=e=>{stopSpeech();mi=+e.target.value;li=si=0;loadModule()};$('lab').onchange=e=>{stopSpeech();li=+e.target.value;si=0;render()};window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('install').hidden=false});$('install').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null;$('install').hidden=true}};fetch('courses.json').then(r=>r.json()).then(d=>{DATA=d;let p=JSON.parse(localStorage.getItem('tib-mobile')||'{}');ci=p.ci||0;mi=p.mi||0;li=p.li||0;si=p.si||0;opt($('course'),DATA,c=>c.name);$('course').value=ci;loadCourse();si=Math.min(p.si||0,DATA[ci].modules[mi].labs[li].steps.length-1);render();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js')});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech();});window.addEventListener('pagehide',stopSpeech);


// ---- TIB Mobile v1.0.2: Installation Experience ----
let deferredInstallPrompt = null;

function isIOSDevice(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isStandaloneMode(){
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}
function updateInstallUI(){
  const btn = document.getElementById('installApp');
  const ios = document.getElementById('iosInstall');
  const done = document.getElementById('installedStatus');
  if(!btn || !ios || !done) return;

  btn.hidden = true;
  ios.hidden = true;
  done.hidden = true;

  if(isStandaloneMode()){
    done.hidden = false;
    return;
  }
  if(isIOSDevice()){
    ios.hidden = false;
    return;
  }
  if(deferredInstallPrompt){
    btn.hidden = false;
  }
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  updateInstallUI();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  updateInstallUI();
});

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('installApp');
  if(btn){
    btn.addEventListener('click', async () => {
      if(!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      try {
        await deferredInstallPrompt.userChoice;
      } finally {
        deferredInstallPrompt = null;
        updateInstallUI();
      }
    });
  }
  updateInstallUI();
});

