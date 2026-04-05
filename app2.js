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

function shareVerdict(){
var c=CASES[curCase]||ALL_CASES[curCase];if(!c)return;
var charName=c.n.split(’ vs ‘)[0]||’’;
var role=myRole===‘defense’?‘défendu’:‘accusé’;
var msg=“J’ai “+role+” “+charName+” sur D’brief. Tu fais mieux ?\nhttps://usmannproduction-bot.github.io/Guette/\n#dbrief #”+c.t.replace(/[\s’]/g,’’);
if(navigator.share)navigator.share({title:“D’brief”,text:msg}).catch(function(){});
else{try{navigator.clipboard.writeText(msg);alert(‘Copié !’)}catch(e){alert(msg)}}
}

function leaveDuel(){clearInterval(prepI);go(‘home’)}

/* VOTE FROM VERDICTS */
function judgeCase(duelId,side){
if(!window.db)return;
var ta=document.getElementById(‘jt-’+duelId);
var mot=ta?ta.value.trim():’’;
if(mot.length<20){alert(‘Minimum 20 caractères.’);return}
window.db.ref(‘public-duels/’+duelId+’/judgment’).once(‘value’,function(snap){
if(snap.val()){alert(‘Déjà jugée.’);return}
var label=side===‘defense’?‘NON COUPABLE’:‘COUPABLE’;
window.db.ref(‘public-duels/’+duelId+’/judgment’).set({decision:side,label:label,motivation:mot,judgeUid:myUid,judgeName:me.name||‘Juge’,judgedAt:Date.now()});
window.db.ref(‘public-duels/’+duelId+’/result’).set({decision:label,defense:side===‘defense’?100:0,accusation:side===‘accusation’?100:0});
alert(’Verdict : ’+label);
});
}

function reactArg(duelId,side,type){
if(!window.db)return;
window.db.ref(‘public-duels/’+duelId+’/reactions/’+side+’/voters/’+myUid).once(‘value’,function(snap){
if(snap.val())return;
window.db.ref(‘public-duels/’+duelId+’/reactions/’+side+’/voters/’+myUid).set(type);
window.db.ref(‘public-duels/’+duelId+’/reactions/’+side+’/’+type).transaction(function(val){return(val||0)+1});
});
}

function votePublic(duelId,side){
if(!window.db)return;
window.db.ref(‘public-duels/’+duelId+’/votes/’+myUid).set({side:side,ts:Date.now()});
setTimeout(function(){recalcVerdict(duelId)},1000);
alert(‘Vote enregistré !’);
}

/* VERDICTS PAGE */
function switchVerdictTab(tab){
document.getElementById(‘vd-encours-list’).style.display=tab===‘encours’?’’:‘none’;
document.getElementById(‘vd-termines-list’).style.display=tab===‘termines’?’’:‘none’;
document.getElementById(‘vd-tab-encours’).className=tab===‘encours’?‘ti on’:‘ti’;
document.getElementById(‘vd-tab-termines’).className=tab===‘termines’?‘ti on’:‘ti’;
}

function loadPublicDuels(){
if(!window.db)return;
window.db.ref(‘public-duels’).orderByChild(‘publishedAt’).limitToLast(30).on(‘value’,function(snap){
var duels=snap.val();
var encoursEl=document.getElementById(‘vd-encours-list’);
var terminesEl=document.getElementById(‘vd-termines-list’);
encoursEl.innerHTML=’’;terminesEl.innerHTML=’’;
if(!duels)return;
var keys=Object.keys(duels).reverse();
keys.forEach(function(k){
var d=duels[k];
var hasResult=d.result;
var card=document.createElement(‘div’);card.className=‘card’;
card.innerHTML=’<div style="font-size:10px;font-weight:700;color:#FF7A2E;letter-spacing:1px;margin-bottom:4px">’+(d.caseType||’’).toUpperCase()+’</div><div style="font-size:16px;font-weight:900;margin-bottom:6px">’+(d.caseName||’’)+’</div>’;
card.innerHTML+=’<div style="display:flex;gap:8px;margin-bottom:10px"><div style="flex:1;padding:10px;background:rgba(78,203,113,.04);border-radius:10px;border-left:3px solid #4ECB71"><div style="font-size:9px;font-weight:700;color:#4ECB71;margin-bottom:4px">’+(d.defense?d.defense.name:’’)+’</div><div style="font-size:12px;color:var(--text2);line-height:1.4">’+(d.defense?d.defense.text:’’)+’</div></div><div style="flex:1;padding:10px;background:rgba(255,71,87,.04);border-radius:10px;border-left:3px solid #FF4757"><div style="font-size:9px;font-weight:700;color:#FF4757;margin-bottom:4px">’+(d.accusation?d.accusation.name:’’)+’</div><div style="font-size:12px;color:var(--text2);line-height:1.4">’+(d.accusation?d.accusation.text:’’)+’</div></div></div>’;
if(hasResult){
var decColor=hasResult.decision===‘COUPABLE’?’#FF4757’:’#4ECB71’;
card.innerHTML+=’<div style="text-align:center;padding:12px;background:var(--bg2);border-radius:12px"><div style="font-family:Inter,sans-serif;font-size:22px;font-weight:900;color:'+decColor+'">’+hasResult.decision+’</div></div>’;
if(d.judgment&&d.judgment.motivation){card.innerHTML+=’<div style="margin-top:8px;padding:10px;background:rgba(255,210,63,.03);border:1px solid rgba(255,210,63,.06);border-radius:10px"><div style="font-size:8px;font-weight:700;color:#FFD23F;margin-bottom:4px">DÉCISION MOTIVÉE</div><div style="font-size:11px;color:var(--text2);line-height:1.5">’+d.judgment.motivation+’</div></div>’}
terminesEl.appendChild(card);
}else{
var votesCount=d.votes?Object.keys(d.votes).length:0;
card.innerHTML+=’<div style="text-align:center;font-size:10px;color:var(--text3);margin-bottom:6px">’+votesCount+’ vote’+(votesCount!==1?‘s’:’’)+’</div>’;
if(d.judgeMode&&!d.judgment){
card.innerHTML+=’<div style="text-align:center;padding:6px;background:rgba(255,210,63,.04);border:1px solid rgba(255,210,63,.1);border-radius:8px;margin-bottom:8px"><div style="font-size:9px;font-weight:700;color:#FFD23F">⚖ MODE JUGE</div></div><textarea id="jt-'+k+'" maxlength="600" placeholder="Décision motivée (600 car.)..." style="width:100%;height:70px;padding:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:10px;color:var(--text);font-size:12px;font-family:inherit;resize:none;margin-bottom:8px"></textarea><div style="display:flex;gap:8px"><button style="flex:1;padding:12px;background:rgba(78,203,113,.06);border:1.5px solid #4ECB71;border-radius:12px;color:#4ECB71;font-size:13px;font-weight:800;cursor:pointer" onclick="judgeCase(\''+k+'\',\'defense\')">Non coupable</button><button style="flex:1;padding:12px;background:rgba(255,71,87,.06);border:1.5px solid #FF4757;border-radius:12px;color:#FF4757;font-size:13px;font-weight:800;cursor:pointer" onclick="judgeCase(\''+k+'\',\'accusation\')">Coupable</button></div>’;
}else{
card.innerHTML+=’<div style="display:flex;gap:8px"><button style="flex:1;padding:12px;background:rgba(78,203,113,.06);border:1.5px solid #4ECB71;border-radius:12px;color:#4ECB71;font-size:14px;font-weight:800;cursor:pointer" onclick="votePublic(\''+k+'\',\'defense\')">Défense</button><button style="flex:1;padding:12px;background:rgba(255,71,87,.06);border:1.5px solid #FF4757;border-radius:12px;color:#FF4757;font-size:14px;font-weight:800;cursor:pointer" onclick="votePublic(\''+k+'\',\'accusation\')">Accusation</button></div>’;
}
encoursEl.appendChild(card);
}
});
});
}

/* PROFILE */
function loadProfile(){
if(!window.db)return;
window.db.ref(‘users/’+myUid).on(‘value’,function(snap){
var d=snap.val();if(!d)return;
me.wins=d.wins||0;me.cabinetId=d.cabinetId||’’;
var pw=document.getElementById(‘p-w’);if(pw)pw.textContent=me.wins;
if(me.cabinetId)loadCabinet();
});
window.db.ref(‘public-duels’).orderByChild(‘publishedAt’).limitToLast(20).on(‘value’,function(snap){
var duels=snap.val();if(!duels)return;
var histEl=document.getElementById(‘p-history’);histEl.innerHTML=’’;
var myDuels=0;var keys=Object.keys(duels).reverse();
keys.forEach(function(k){
var d=duels[k];
var isDef=d.defense&&d.defense.uid===myUid;
var isAcc=d.accusation&&d.accusation.uid===myUid;
if(!isDef&&!isAcc)return;
myDuels++;
var role=isDef?‘Défense’:‘Accusation’;
var roleColor=isDef?’#4ECB71’:’#FF4757’;
var result=d.result?d.result.decision:‘En cours…’;
var resColor=result===‘NON COUPABLE’?’#4ECB71’:result===‘COUPABLE’?’#FF4757’:’#FFD23F’;
var item=document.createElement(‘div’);
item.style.cssText=‘padding:10px 12px;border-left:3px solid ‘+roleColor+’;background:rgba(255,255,255,.02);border-radius:0 10px 10px 0;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center’;
item.innerHTML=’<div><div style="font-size:12px;font-weight:700;color:#fff">’+(d.caseName||’’)+’</div><div style="font-size:10px;color:var(--text3)">’+role+’</div></div><div style="font-size:10px;font-weight:700;color:'+resColor+'">’+result+’</div>’;
histEl.appendChild(item);
});
document.getElementById(‘p-d’).textContent=myDuels;
if(myDuels>0&&me.wins>0)document.getElementById(‘p-r’).textContent=Math.round(me.wins/myDuels*100)+’%’;
});
}

/* VERDICT FEED */
function loadVerdictFeed(){
if(!window.db)return;
window.db.ref(‘public-duels’).orderByChild(‘publishedAt’).limitToLast(10).on(‘value’,function(snap){
var duels=snap.val();
var feed=document.getElementById(‘verdict-feed-inner’);
var feedWrap=document.getElementById(‘verdict-feed’);
if(!feed||!duels)return;
feed.innerHTML=’’;var items=[];
var keys=Object.keys(duels).reverse();
keys.forEach(function(k){
var d=duels[k];
if(!d.result&&!d.judgment)return;
var decision=d.result?d.result.decision:(d.judgment?d.judgment.label:’’);
if(!decision)return;
var color=decision===‘COUPABLE’?’#FF4757’:’#4ECB71’;
var ts=d.judgment?d.judgment.judgedAt:d.publishedAt||0;
var elapsed=Date.now()-ts;
var timeAgo=elapsed<60000?‘maintenant’:elapsed<3600000?Math.floor(elapsed/60000)+‘min’:elapsed<86400000?Math.floor(elapsed/3600000)+‘h’:Math.floor(elapsed/86400000)+‘j’;
items.push({name:d.caseName||’’,decision:decision,color:color,timeAgo:timeAgo});
});
if(items.length===0){feedWrap.style.display=‘none’;return}
feedWrap.style.display=‘block’;
items.slice(0,8).forEach(function(item){
var pill=document.createElement(‘div’);
pill.style.cssText=‘flex-shrink:0;padding:8px 12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);border-radius:12px;cursor:pointer;display:flex;align-items:center;gap:6px’;
pill.innerHTML=’<div style="width:6px;height:6px;border-radius:50%;background:'+item.color+'"></div><div style="white-space:nowrap"><div style="font-size:11px;font-weight:700;color:var(--text)">’+item.name+’</div><div style="font-size:9px;color:'+item.color+';font-weight:700">’+item.decision+’ · ‘+item.timeAgo+’</div></div>’;
pill.onclick=function(){switchTab(‘verdicts’)};
feed.appendChild(pill);
});
});
}

/* FIREBASE */
(function(){
try{
var s1=document.createElement(‘script’);
s1.src=‘https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js’;
s1.onload=function(){
var s2=document.createElement(‘script’);
s2.src=‘https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js’;
s2.onload=function(){
try{
firebase.initializeApp({apiKey:‘AIzaSyCAsL1P1YDGWfZMBzQdZdp4xd6zjgoGK9g’,databaseURL:‘https://guette-a9b5d-default-rtdb.europe-west1.firebasedatabase.app’,projectId:‘guette-a9b5d’});
window.db=firebase.database();
}catch(e){}
};s2.onerror=function(){};document.head.appendChild(s2);
};s1.onerror=function(){};document.head.appendChild(s1);
}catch(e){}
})();
