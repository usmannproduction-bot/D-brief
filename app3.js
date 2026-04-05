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
