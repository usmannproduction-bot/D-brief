/* HOME */
function buildHome(){
var list=document.getElementById(‘cases-list’);
if(!list)return;
list.innerHTML=’’;
var hero=document.getElementById(‘hero-wrap’);
if(hero)hero.innerHTML=’’;
var first=activeCaseKeys[0];
if(first&&CASES[first]){
var c=CASES[first];
if(hero)hero.innerHTML=’<div style="padding:16px;background:linear-gradient(135deg,#1A0E3A,#2D1B69);border-radius:16px;cursor:pointer" onclick="joinDuel(\''+first+'\')"><div style="font-size:9px;font-weight:700;color:#FF7A2E;letter-spacing:1.5px;margin-bottom:6px">AFFAIRE DU JOUR</div><div style="font-size:18px;font-weight:900;color:#fff;margin-bottom:4px">’+c.n+’</div><div style="font-size:12px;color:rgba(255,255,255,.35);line-height:1.4">’+c.q+’</div></div>’;
}
activeCaseKeys.forEach(function(k){
var c=CASES[k];if(!c)return;
var colors={Power:’#4ECB71’,‘Top Boy’:’#FF7A2E’,Suits:’#A78BFA’,‘Peaky Blinders’:’#FF4757’,‘Breaking Bad’:’#FF4757’,Murder:’#A78BFA’,‘Emily in Paris’:’#FF69B4’,Bridgerton:’#A78BFA’,Scandal:’#FFD23F’,You:’#FF4757’,Lupin:’#4ECB71’,‘Squid Game’:’#FF4757’,‘La Casa de Papel’:’#FF4757’,‘Blood Sisters’:’#FF4757’,‘Shanty Town’:’#FF7A2E’,‘Sakho & Mangane’:’#4ECB71’,‘Dial Diali’:’#FFD23F’,‘Pod et Marichou’:’#A78BFA’,Caratécas:’#FF7A2E’,Héritage:’#FFD23F’,‘Ma Famille’:’#4ECB71’,‘Les Winx’:’#FF69B4’,‘Foot 2 Rue’:’#4ECB71’,Naruto:’#FF7A2E’,‘Death Note’:’#FF4757’,‘Prison Break’:’#4ECB71’};
var col=colors[c.t]||’#A78BFA’;
var diff=c.pt>=300?‘Complexe’:c.pt>=180?‘Moyen’:‘Simple’;
var dur=Math.ceil((c.pt+c.wt)/60);
var card=document.createElement(‘div’);
card.className=‘card’;
card.style.cursor=‘pointer’;
card.onclick=function(){joinDuel(k)};
card.innerHTML=’<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><div style="height:3px;flex:1;border-radius:99px;background:'+col+'"></div><div style="font-size:9px;font-weight:700;color:'+col+';letter-spacing:1px">’+c.t.toUpperCase()+’</div></div><div style="font-size:15px;font-weight:800;color:#fff;margin-bottom:3px">’+c.n+’</div><div style="font-size:11px;color:var(--text3)">’+dur+’ min · ‘+diff+’</div>’;
list.appendChild(card);
});
try{document.getElementById(‘home-avatar’).textContent=(me.name||’?’).substring(0,2).toUpperCase()}catch(e){}
}

function filterCases(){
var q=document.getElementById(‘search-input’).value.toLowerCase();
var cards=document.getElementById(‘cases-list’).children;
for(var i=0;i<cards.length;i++){
var name=cards[i].textContent.toLowerCase();
cards[i].style.display=name.indexOf(q)!==-1?’’:‘none’;
}
}

/* AUTH */
function doSignup(){
var n=document.getElementById(‘su-n’).value.trim();
var e=document.getElementById(‘su-e’).value.trim();
var p=document.getElementById(‘su-p’).value;
var err=document.getElementById(‘su-err’);
if(!n||!e||p.length<6){err.style.display=‘block’;err.textContent=‘Remplissez tous les champs (mdp 6 car. min)’;err.style.color=’#FF4757’;return}
if(n.length>30){err.style.display=‘block’;err.textContent=‘Nom trop long (max 30 car.)’;err.style.color=’#FF4757’;return}
setUid(e);
me.name=n;me.email=e;me.wins=0;me.points=0;
document.getElementById(‘p-name’).textContent=cleanMsg(n);
document.getElementById(‘p-avatar’).textContent=n.substring(0,2).toUpperCase();
var cabInput=document.getElementById(‘su-cab’).value.trim()||(‘Cabinet ‘+n);
if(window.db){
window.db.ref(‘users/’+myUid).once(‘value’,function(snap){
if(snap.val()&&snap.val().email){err.style.display=‘block’;err.textContent=‘Ce mail est déjà utilisé.’;err.style.color=’#FF4757’;return}
window.db.ref(‘users/’+myUid).set({name:n,email:e,password:hashPwd(p),wins:0,points:0,joined:Date.now()});
if(cabInput.match(/^CAB-[A-Z0-9]{4}$/i)){joinCabinetByCode(cabInput)}else{createCabinet(cabInput)}
err.style.display=‘none’;buildHome();go(‘onboarding’);
});
}else{
me.cabinetId=‘cab_’+myUid;me.cabinetName=cabInput;
me.cabinetCode=‘CAB-’+Math.random().toString(36).substr(2,4).toUpperCase();
me.isCreator=true;
err.style.display=‘none’;buildHome();saveSession();go(‘onboarding’);
}
}

function doLogin(){
var e=document.getElementById(‘li-e’).value.trim();
var p=document.getElementById(‘li-p’).value;
var err=document.getElementById(‘li-err’);
if(!e||p.length<6){err.style.display=‘block’;err.textContent=‘Remplissez tous les champs’;err.style.color=’#FF4757’;return}
setUid(e);
if(!window.db){
var saved=localStorage.getItem(‘dbrief_user’);
if(saved){var u=JSON.parse(saved);if(u.email===e){me.name=u.name;me.email=e;me.wins=u.wins||0;me.cabinetId=u.cabinetId||’’;document.getElementById(‘p-name’).textContent=me.name;document.getElementById(‘p-avatar’).textContent=(me.name||’?’).substring(0,2).toUpperCase();err.style.display=‘none’;buildHome();go(‘home’);return}}
err.style.display=‘block’;err.textContent=‘Connexion impossible sans réseau.’;err.style.color=’#FF4757’;return;
}
err.style.display=‘block’;err.textContent=‘Connexion…’;err.style.color=’#FFD23F’;
var _r=0;var _c=setInterval(function(){_r++;
if(window.db){clearInterval(_c);
window.db.ref(‘users/’+myUid).once(‘value’,function(snap){
var d=snap.val();
if(d&&d.email){
if(d.password&&d.password!==hashPwd(p)){err.style.display=‘block’;err.textContent=‘Mot de passe incorrect.’;err.style.color=’#FF4757’;return}
me.name=d.name||’’;me.email=d.email;me.wins=d.wins||0;me.points=d.points||0;me.cabinetId=d.cabinetId||’’;
document.getElementById(‘p-name’).textContent=me.name;
document.getElementById(‘p-avatar’).textContent=(me.name||’?’).substring(0,2).toUpperCase();
err.style.display=‘none’;buildHome();saveSession();go(‘home’);
}else{err.style.display=‘block’;err.textContent=‘Compte introuvable.’;err.style.color=’#FF4757’}
});
}else if(_r>10){clearInterval(_c);err.textContent=‘Erreur réseau.’;err.style.color=’#FF4757’}
},1000);
}

function logout(){try{localStorage.removeItem(‘dbrief_user’)}catch(e){}location.reload()}

/* ONBOARDING */
function pickFirstSeries(caseKey){
if(!CASES[caseKey]&&ALL_CASES[caseKey])CASES[caseKey]=ALL_CASES[caseKey];
buildHome();joinDuel(caseKey);
}

/* CABINET */
function genCabCode(){var c=‘ABCDEFGHJKLMNPQRSTUVWXYZ23456789’;var code=‘CAB-’;for(var i=0;i<4;i++)code+=c.charAt(Math.floor(Math.random()*c.length));return code}

function createCabinet(name){
if(!window.db)return;
var cabId=‘cab_’+myUid;var code=genCabCode();
window.db.ref(‘cabinets/’+cabId).set({name:name,creator:myUid,creatorName:me.name||’’,code:code,members:{[myUid]:{name:me.name||’’,joined:Date.now()}},created:Date.now()});
window.db.ref(‘cabinet-codes/’+code).set(cabId);
me.cabinetId=cabId;me.cabinetName=name;me.cabinetCode=code;me.isCreator=true;
window.db.ref(‘users/’+myUid+’/cabinetId’).set(cabId);
saveSession();loadCabinet();
}

function joinCabinetByCode(code){
if(!window.db)return;
code=code.toUpperCase().trim();
window.db.ref(‘cabinet-codes/’+code).once(‘value’,function(snap){
var cabId=snap.val();
if(!cabId){alert(‘Code invalide.’);return}
window.db.ref(‘cabinets/’+cabId+’/members’).once(‘value’,function(ms){
var members=ms.val()||{};
if(Object.keys(members).length>=5){alert(‘Cabinet complet (5/5)’);return}
window.db.ref(‘cabinets/’+cabId+’/members/’+myUid).set({name:me.name||’’,joined:Date.now()});
window.db.ref(‘cabinets/’+cabId).once(‘value’,function(cs){
var cab=cs.val();
me.cabinetId=cabId;me.cabinetName=cab?cab.name:’’;me.cabinetCode=cab?cab.code||code:code;me.isCreator=false;
window.db.ref(‘users/’+myUid+’/cabinetId’).set(cabId);
saveSession();loadCabinet();
});
});
});
}

function loadCabinet(){
if(!window.db||!me.cabinetId)return;
window.db.ref(‘cabinets/’+me.cabinetId).on(‘value’,function(snap){
var cab=snap.val();if(!cab)return;
me.cabinetName=cab.name||’’;
document.getElementById(‘pc-cabinet-name’).textContent=cab.name||‘Mon Cabinet’;
var el=document.getElementById(‘pc-members’);el.innerHTML=’’;
var members=cab.members||{};var keys=Object.keys(members);var totalWins=0;var loaded=0;
keys.forEach(function(uid){
var m=members[uid];
var d=document.createElement(‘div’);
d.style.cssText=‘display:flex;flex-direction:column;align-items:center;gap:3px’;
d.innerHTML=’<div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,rgba(167,139,250,.2),rgba(255,122,46,.2));border:2px solid rgba(167,139,250,.3);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#A78BFA">’+(m.name||’?’).substring(0,2).toUpperCase()+’</div><div style="font-size:9px;color:#8888A0;max-width:50px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">’+(m.name||’’)+’</div>’;
el.appendChild(d);
window.db.ref(‘users/’+uid+’/wins’).once(‘value’,function(ws){totalWins+=(ws.val()||0);loaded++;if(loaded===keys.length)document.getElementById(‘pc-score’).textContent=totalWins});
});
for(var i=keys.length;i<5;i++){var empty=document.createElement(‘div’);empty.style.cssText=‘width:38px;height:38px;border-radius:50%;border:2px dashed rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center’;empty.innerHTML=’<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,.3)" stroke-width="2"><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>’;el.appendChild(empty)}
if(cab.code){document.getElementById(‘pc-code’).textContent=cab.code;document.getElementById(‘pc-code-wrap’).style.display=‘flex’;me.cabinetCode=cab.code}
if(cab.creator===myUid&&keys.length<5)document.getElementById(‘pc-invite-wrap’).style.display=‘block’;
me.isCreator=(cab.creator===myUid);
});
}

function shareCabCode(){
var msg=‘Rejoins mon cabinet sur D'brief ! Code : ‘+me.cabinetCode+’\nhttps://usmannproduction-bot.github.io/Guette/’;
if(navigator.share)navigator.share({title:‘D'brief’,text:msg}).catch(function(){});
else{try{navigator.clipboard.writeText(msg);alert(‘Copié !’)}catch(e){alert(msg)}}
}
function inviteCabinet(){shareCabCode()}
function joinCabinetFromLink(){}

/* DUEL */
function joinDuel(id){
curCase=id;var c=CASES[id];if(!c)return;
currentRoom=id;
document.getElementById(‘ds-arg’).value=’’;
document.getElementById(‘ds-count’).textContent=‘0 / 300’;
document.getElementById(‘dw-name’).textContent=c.n;
document.getElementById(‘dw-q’).textContent=c.q;
document.getElementById(‘dw-type’).textContent=c.t.toUpperCase();
go(‘duel-wait’);
if(!window.db)return;
setTimeout(function(){
var roleEl=document.getElementById(‘dw-myrole’);
if(roleEl&&myRole){
var labels={defense:‘Vous êtes la DÉFENSE’,accusation:‘Vous êtes l'ACCUSATION’,spectateur:‘Vous êtes SPECTATEUR’};
var colors={defense:’#4ECB71’,accusation:’#FF4757’,spectateur:’#8888A0’};
roleEl.textContent=labels[myRole]||’’;roleEl.style.color=colors[myRole]||’#8888A0’;roleEl.style.display=‘block’;
}
},1500);
window.db.ref(‘rooms/’+id+’/roles/defense’).once(‘value’,function(sd){
if(!sd.val()){myRole=‘defense’;window.db.ref(‘rooms/’+id+’/roles/defense’).set({uid:myUid,name:me.name||’’});window.db.ref(‘rooms/’+id+’/roles/defense’).onDisconnect().remove()}
else if(sd.val().uid===myUid){myRole=‘defense’}
else{window.db.ref(‘rooms/’+id+’/roles/accusation’).once(‘value’,function(sa){
if(!sa.val()){myRole=‘accusation’;window.db.ref(‘rooms/’+id+’/roles/accusation’).set({uid:myUid,name:me.name||’’});window.db.ref(‘rooms/’+id+’/roles/accusation’).onDisconnect().remove()}
else if(sa.val().uid===myUid){myRole=‘accusation’}
else{myRole=‘spectateur’}
})}
});
window.db.ref(‘rooms/’+id+’/players/’+myUid).set({name:me.name||’’,joined:Date.now()});
window.db.ref(‘rooms/’+id+’/players/’+myUid).onDisconnect().remove();
window.db.ref(‘rooms/’+id+’/roles’).on(‘value’,function(snap){
var r=snap.val()||{};
if(r.defense){document.getElementById(‘dw-def’).textContent=(r.defense.name||’?’).substring(0,2).toUpperCase();document.getElementById(‘dw-def-name’).textContent=r.defense.name||‘Joueur 1’}
if(r.accusation){document.getElementById(‘dw-acc’).textContent=(r.accusation.name||’?’).substring(0,2).toUpperCase();document.getElementById(‘dw-acc-name’).textContent=r.accusation.name||‘Joueur 2’}
if(r.defense&&r.accusation){document.getElementById(‘dw-status’).textContent=‘Duel prêt !’;setTimeout(function(){startDuel()},2000)}
});
window.db.ref(‘rooms/’+id+’/players’).on(‘value’,function(snap){document.getElementById(‘dw-spectators’).textContent=snap.numChildren()+’ personne(s)’});
}

function startDuel(){
var c=CASES[curCase];if(!c)return;
if(myRole===‘spectateur’){document.getElementById(‘dv-name’).textContent=c.n;document.getElementById(‘dv-q’).textContent=c.q;go(‘duel-vote’);listenArguments();return}
document.getElementById(‘dd-name’).textContent=c.n;
document.getElementById(‘dd-type’).textContent=c.t;
document.getElementById(‘dd-dos’).textContent=c.dos;
var caseNames=c.n.split(’ vs ‘);var defendedChar=caseNames[0]||’’;
document.getElementById(‘dd-role’).textContent=myRole===‘defense’?‘DÉFENSE — Vous défendez ‘+defendedChar:‘ACCUSATION — Vous accusez ‘+defendedChar;
document.getElementById(‘dd-role’).style.color=myRole===‘defense’?’#4ECB71’:’#FF4757’;
document.getElementById(‘dd-role-dot’).style.background=myRole===‘defense’?’#4ECB71’:’#FF4757’;
document.getElementById(‘dd-role-wrap’).style.background=myRole===‘defense’?‘rgba(78,203,113,.1)’:‘rgba(255,71,87,.1)’;
go(‘duel-dossier’);
var pt=ALL_CASES[curCase]?ALL_CASES[curCase].pt||180:180;
var left=pt;
clearInterval(prepI);
prepI=setInterval(function(){
left–;if(left<=0){clearInterval(prepI);left=0;goToSubmit();return}
document.getElementById(‘dd-timer’).textContent=String(Math.floor(left/60)).padStart(2,‘0’)+’:’+String(left%60).padStart(2,‘0’);
var pct=left/pt;document.getElementById(‘dd-circle’).style.strokeDashoffset=276.5*(1-pct);
},1000);
document.getElementById(‘dd-timer’).textContent=String(Math.floor(pt/60)).padStart(2,‘0’)+’:’+String(pt%60).padStart(2,‘0’);
}

function goToSubmit(){
clearInterval(prepI);
var c=CASES[curCase];
document.getElementById(‘ds-arg’).value=’’;
document.getElementById(‘ds-count’).textContent=‘0 / 300’;
var subNames=(CASES[curCase]||ALL_CASES[curCase]||{n:’’}).n.split(’ vs ‘);
var subChar=subNames[0]||’’;
document.getElementById(‘ds-role2’).textContent=myRole===‘defense’?‘DÉFENSE — ‘+subChar:‘ACCUSATION — ‘+subChar;
document.getElementById(‘ds-role2’).style.color=myRole===‘defense’?’#4ECB71’:’#FF4757’;
document.getElementById(‘ds-name2’).textContent=c.n;
go(‘duel-submit’);
var wt=ALL_CASES[curCase]?ALL_CASES[curCase].wt||360:360;
var left=wt;
clearInterval(prepI);
prepI=setInterval(function(){
left–;if(left<=0){clearInterval(prepI);left=0;submitArgument()}
document.getElementById(‘ds-timer’).textContent=String(Math.floor(left/60)).padStart(2,‘0’)+’:’+String(left%60).padStart(2,‘0’);
var pct=left/wt;document.getElementById(‘ds-circle’).style.strokeDashoffset=213.6*(1-pct);
},1000);
document.getElementById(‘ds-timer’).textContent=String(Math.floor(wt/60)).padStart(2,‘0’)+’:’+String(wt%60).padStart(2,‘0’);
listenArguments();
}

function submitArgument(){
clearInterval(prepI);
var text=document.getElementById(‘ds-arg’).value.trim();
if(!text)text=’(Pas d'argument soumis)’;
text=cleanMsg(text);
if(!window.db)return;
window.db.ref(‘rooms/’+currentRoom+’/arguments/’+myRole).set({text:text,uid:myUid,name:me.name||’’,submittedAt:Date.now()});
document.getElementById(‘dv-name’).textContent=CASES[curCase]?CASES[curCase].n:’’;
document.getElementById(‘dv-q’).textContent=CASES[curCase]?CASES[curCase].q:’’;
go(‘duel-vote’);
checkPublish();
}

function listenArguments(){
if(!window.db)return;
window.db.ref(‘rooms/’+currentRoom+’/arguments’).on(‘value’,function(snap){
var a=snap.val()||{};
if(a.defense){document.getElementById(‘dv-def-arg’).textContent=a.defense.text;document.getElementById(‘dv-def-name’).textContent=a.defense.name||’’}
if(a.accusation){document.getElementById(‘dv-acc-arg’).textContent=a.accusation.text;document.getElementById(‘dv-acc-name’).textContent=a.accusation.name||’’}
if(a.defense&&a.accusation&&(a.defense.uid===myUid||a.accusation.uid===myUid)){checkPublish()}
});
}

function checkPublish(){
if(!window.db)return;
window.db.ref(‘rooms/’+currentRoom+’/arguments’).once(‘value’,function(snap){
var a=snap.val();
if(!a||!a.defense||!a.accusation)return;
var c=CASES[curCase]||ALL_CASES[curCase];
var cd=ALL_CASES[curCase]||{};
window.db.ref(‘public-duels/’+currentRoom).set({
judgeMode:cd.jm||false,
caseName:c?c.n:’’,caseType:c?c.t:’’,question:c?c.q:’’,
defense:{name:a.defense.name,text:a.defense.text,uid:a.defense.uid},
accusation:{name:a.accusation.name,text:a.accusation.text,uid:a.accusation.uid},
publishedAt:Date.now(),
voteEnds:Date.now()+(ALL_CASES[curCase]?ALL_CASES[curCase].vd||10800000:10800000)
});
});
}

function vote(side){
if(!window.db)return;
window.db.ref(‘public-duels/’+currentRoom+’/votes/’+myUid).set({side:side,ts:Date.now()});
document.getElementById(‘dv-buttons’).style.display=‘none’;
document.getElementById(‘dv-voted’).style.display=‘block’;
setTimeout(checkVerdict,2000);
}

function checkVerdict(){if(!window.db||!currentRoom)return;recalcVerdict(currentRoom)}

function recalcVerdict(duelId){
if(!window.db)return;
var ref=window.db.ref(‘public-duels/’+duelId+’/votes’);
ref.once(‘value’,function(snap){
var votes=snap.val();if(!votes)return;
var def=0,acc=0;
Object.keys(votes).forEach(function(k){if(votes[k].side===‘defense’)def++;else acc++});
var total=def+acc;if(total<3)return;
var pctDef=Math.round(def/total*100);var pctAcc=100-pctDef;
var decision=pctDef>=50?‘NON COUPABLE’:‘COUPABLE’;
window.db.ref(‘public-duels/’+duelId+’/result’).set({decision:decision,pctDef:pctDef,pctAcc:pctAcc,total:total});
if(duelId===currentRoom){
window.db.ref(‘rooms/’+currentRoom+’/arguments’).once(‘value’,function(as){
var a=as.val()||{};
var winSide=pctDef>pctAcc?‘defense’:‘accusation’;
if(a[winSide]&&a[winSide].uid){
window.db.ref(‘users/’+a[winSide].uid+’/wins’).once(‘value’,function(s){
window.db.ref(‘users/’+a[winSide].uid+’/wins’).set((s.val()||0)+1);
});
}
});
}
});
}
