/* SPLASH INTRO */
setTimeout(function(){
try{
var intro=document.getElementById(‘splash-intro’);
if(intro){intro.classList.remove(‘on’);intro.style.display=‘none’}
var sp=document.getElementById(‘splash’);
if(sp){sp.classList.add(‘on’);sp.style.display=‘flex’}
}catch(e){}
},2000);

/* STATE */
var me={name:’’,email:’’,wins:0,losses:0,points:0,cabinetId:’’,cabinetName:’’,cabinetCode:’’,isCreator:false,isPro:false};
var myUid=‘u’+Math.random().toString(36).substr(2,9);
var myRole=’’;var curCase=’’;var currentRoom=null;
var prepI;
var _listeners={verdicts:false,profil:false};
var CASES={};
var activeCaseKeys=[];

function setUid(email){myUid=email.replace(/[^a-zA-Z0-9]/g,’_’)}
function go(id){document.querySelectorAll(’.P’).forEach(function(p){p.classList.remove(‘on’)});document.getElementById(id).classList.add(‘on’)}

var switchTab=function(id){
go(id);
if(id===‘profil’&&!_listeners.profil){_listeners.profil=true;loadProfile()}
if(id===‘verdicts’&&!_listeners.verdicts){_listeners.verdicts=true;loadPublicDuels()}
};

function saveSession(){
try{localStorage.setItem(‘dbrief_user’,JSON.stringify({name:me.name,email:me.email,wins:me.wins,points:me.points,uid:myUid,cabinetId:me.cabinetId||’’,cabinetCode:me.cabinetCode||’’}))}catch(e){}
}

/* SESSION RESTORE */
setTimeout(function(){
try{
var saved=localStorage.getItem(‘dbrief_user’);
if(saved){
var u=JSON.parse(saved);
if(u&&u.name){
me.name=u.name;me.email=u.email||’’;me.wins=u.wins||0;me.points=u.points||0;
if(u.uid)myUid=u.uid;
me.cabinetId=u.cabinetId||’’;me.cabinetCode=u.cabinetCode||’’;
try{document.getElementById(‘p-name’).textContent=me.name}catch(e){}
try{document.getElementById(‘p-avatar’).textContent=(me.name||’?’).substring(0,2).toUpperCase()}catch(e){}
try{document.getElementById(‘home-avatar’).textContent=(me.name||’?’).substring(0,2).toUpperCase()}catch(e){}
try{buildHome();go(‘home’)}catch(e){go(‘splash’)}
setTimeout(function(){
try{
if(window.db&&!_listeners.verdicts){_listeners.verdicts=true;loadPublicDuels()}
if(window.db&&!_listeners.profil){_listeners.profil=true;loadProfile()}
try{loadVerdictFeed()}catch(e){}
}catch(e){}
},3000);
return;
}
}
}catch(e){}
go(‘splash’);
},2500);

/* SECURITY */
function hashPwd(s){var h=0;for(var i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h=h&h}return ‘h’+Math.abs(h).toString(36)}

var BLOCKED=[‘putain’,‘merde’,‘connard’,‘connasse’,‘salope’,‘nique’,‘pute’,‘fuck’,‘shit’,‘bitch’,‘asshole’];
function cleanMsg(t){
if(!t)return’’;
var c=String(t).replace(/<[^>]*>/g,’’).replace(/[<>]/g,’’);
var low=c.toLowerCase();
for(var i=0;i<BLOCKED.length;i++){if(low.indexOf(BLOCKED[i])!==-1)return’[filtré]’}
return c.length>300?c.substring(0,300):c;
}

/* ALL CASES */
var ALL_CASES={
ghost1:{pt:180,wt:360,vd:10800000,n:‘Ghost vs Tommy’,t:‘Power’,q:‘Tommy accuse Ghost d'avoir trahi la rue pour jouer au politicien en costume’,dos:‘Tommy Egan accuse Ghost d'avoir renié tout ce qu'ils ont construit ensemble pour se créer une image respectable. “Tu veux être maire mais t'as du sang sur les mains.” Ghost répond que grandir c'est pas trahir, et que Tommy refuse d'évoluer.’},
ghost2:{pt:300,wt:900,vd:21600000,n:‘Ghost vs Nietzsche’,t:‘Power’,q:‘Nietzsche accuse Ghost d'être un surhomme raté qui n'assume pas sa volonté de puissance’,dos:‘Le philosophe accuse James St. Patrick de vouloir le pouvoir sans en assumer le prix moral. “Tu veux être au-dessus des lois mais tu supplies qu'on t'aime.” Ghost répond qu'on peut vouloir le pouvoir ET la rédemption.’},
tommy1:{pt:180,wt:360,vd:10800000,n:‘Tommy vs Arthur’,t:‘Peaky Blinders’,q:‘Arthur accuse Tommy d'avoir sacrifié sa propre famille sur l'autel de son ambition’,dos:‘Arthur hurle que Tommy les utilise tous comme des pions. John est mort. Michael est en prison. Lui-même est brisé. Tommy répond froidement : “Chaque décision que j'ai prise, c'était pour que les Shelby survivent. Pas pour qu'ils soient heureux.”’},
tommy2:{pt:300,wt:900,vd:21600000,n:‘Tommy vs Socrate’,t:‘Peaky Blinders’,q:‘Socrate accuse Tommy Shelby de vivre une vie non examinée malgré son intelligence’,dos:‘Socrate interpelle Tommy : “Tu connais le prix de tout mais la valeur de rien. Pourquoi accumules-tu du pouvoir si tu ne sais même pas ce qui te rend heureux ?” Tommy répond : “Le bonheur c'est un luxe pour ceux qui n'ont pas grandi dans la boue.”’},
dushane1:{pt:180,wt:360,vd:10800000,n:‘Dushane vs Sully’,t:‘Top Boy’,q:‘Sully accuse Dushane d'avoir choisi l'argent plutôt que la loyauté’,dos:‘Sully accuse Dushane de l'avoir laissé pourrir en prison pendant qu'il comptait ses billets. “La loyauté c'est pas un mot que tu mets dans ta bouche quand ça t'arrange.” Dushane répond que Sully confond loyauté et dépendance.’},
dushane2:{pt:180,wt:360,vd:10800000,n:‘Dushane vs Jaq’,t:‘Top Boy’,q:‘Jaq accuse Dushane d'avoir détruit toute une génération de jeunes à Summerhouse’,dos:‘Jaq accuse Dushane d'être responsable de chaque jeune qui a fini en prison ou au cimetière. Dushane répond que le système les avait condamnés avant lui et qu'il a donné du travail à ceux que personne ne voulait.’},
annalise1:{pt:180,wt:360,vd:10800000,n:‘Annalise vs Michaela’,t:‘Murder’,q:‘Michaela accuse Annalise d'être une manipulatrice narcissique qui détruit ses élèves’,dos:‘Michaela affirme qu'Annalise crée volontairement des situations de dépendance pour contrôler ses étudiants. Annalise rétorque : “Tu veux un bouc émissaire pour tes propres choix. Personne ne t'a forcée à rester.”’},
annalise2:{pt:300,wt:900,vd:21600000,n:‘Annalise vs Kant’,t:‘Murder’,q:‘Kant accuse Annalise de traiter les êtres humains comme des moyens et jamais comme des fins’,dos:‘Le philosophe accuse Annalise de violer l'impératif catégorique en instrumentalisant chaque personne autour d'elle. Annalise répond : “Votre morale universelle ne survit pas cinq minutes dans un tribunal. La vraie justice est sale.”’},
emily1:{pt:120,wt:240,vd:3600000,n:‘Emily vs Camille’,t:‘Emily in Paris’,q:‘Camille accuse Emily d'être une colonisatrice culturelle qui vole les copains ET les promotions’,dos:‘Camille explose : “Tu débarques à Paris, tu ne parles pas français, tu séduis mon copain, tu prends mon travail, et tu appelles ça de l'ambition ?” Emily répond que l'amour ne connaît pas les frontières et que son talent parle pour elle.’},
penelope1:{pt:120,wt:240,vd:3600000,n:‘Penelope vs Eloise’,t:‘Bridgerton’,q:‘Eloise accuse sa meilleure amie d'avoir ruiné des vies entières avec une plume anonyme’,dos:‘Eloise est dévastée : “Tu as détruit ma réputation, celle de ma famille, et tu me regardais pleurer en silence.” Penelope répond que Lady Whistledown a donné une voix aux femmes dans un monde qui les réduisait au silence.’},
olivia1:{pt:180,wt:360,vd:10800000,n:‘Olivia vs Fitz’,t:‘Scandal’,q:‘Fitz accuse Olivia d'avoir truqué l'élection puis de lui faire la morale sur l'éthique’,dos:‘Le président explose : “Tu as volé la démocratie pour me mettre au pouvoir et maintenant tu me donnes des leçons ?” Olivia répond froidement : “Sans moi tu serais gouverneur d'un État que personne ne trouve sur une carte.”’},
walter1:{pt:180,wt:360,vd:10800000,n:‘Walter vs Jesse’,t:‘Breaking Bad’,q:‘Jesse accuse Walter d'avoir empoisonné un enfant et de l'appeler “dommage collatéral”’,dos:‘Jesse tremble de rage : “Tu as empoisonné Brock. Un enfant. Pour me manipuler.” Walter répond avec son calme terrifiant : “J'ai fait ce qu'il fallait pour nous garder en vie. Toi compris.”’},
walter2:{pt:300,wt:900,vd:21600000,n:‘Walter vs Aristote’,t:‘Breaking Bad’,q:‘Aristote accuse Walter White d'avoir confondu excellence et hubris’,dos:‘Aristote accuse Walter : “Tu avais le génie mais tu as choisi la démesure. L'excellence sans vertu n'est que destruction.” Walter répond : “J'ai vécu plus intensément en deux ans qu'en vingt ans d'enseignement. C'est ça l'excellence.”’},
lupin1:{pt:180,wt:360,vd:10800000,n:‘Assane vs Hubert’,t:‘Lupin’,q:‘Hubert accuse Assane d'être un criminel qui se cache derrière la mémoire de son père’,dos:‘Hubert Pellegrini contre-attaque : “Vous vous prenez pour Robin des Bois mais vous êtes juste un voleur avec une histoire triste.” Assane répond : “Vous avez fait accuser un innocent pour protéger votre fortune. Qui est le vrai criminel ?”’},
squid1:{pt:180,wt:360,vd:10800000,n:‘Gi-hun vs Il-nam’,t:‘Squid Game’,q:‘Gi-hun accuse le vieil homme d'avoir inventé un massacre pour combattre son ennui de milliardaire’,dos:‘Gi-hun hurle : “456 personnes sont mortes pour votre divertissement.” Il-nam sourit : “Chacun a choisi d'entrer. Le vrai coupable c'est la société qui les a endettés. Moi j'ai juste allumé la lumière sur ce qui existait déjà.”’},
prof1:{pt:180,wt:360,vd:10800000,n:‘Le Professeur vs Berlin’,t:‘La Casa de Papel’,q:‘Berlin accuse le Professeur d'être un lâche qui envoie les autres mourir à sa place’,dos:‘Berlin explose : “Tu restes derrière ton écran pendant qu'on risque nos vies. C'est facile d'être un génie quand tu ne prends aucun risque.” Le Professeur répond : “Si je meurs, le plan meurt. C'est de la logique, pas de la lâcheté.”’},
blood1:{pt:180,wt:360,vd:10800000,n:‘Sarah vs Kemi’,t:‘Blood Sisters’,q:‘Kemi accuse Sarah d'avoir caché un meurtre et entraîné sa meilleure amie dans sa chute’,dos:‘Kemi confronte Sarah : “Tu as tué Kola et tu m'as forcée à fuir avec toi. Ma vie est détruite à cause de tes secrets.” Sarah répond : “C'était de la légitime défense. Il allait me tuer. Tu aurais préféré que je meure en silence ?”’},
shanty1:{pt:180,wt:360,vd:10800000,n:‘Inem vs Scar’,t:‘Shanty Town’,q:‘Inem accuse Scar de traiter les femmes comme du bétail au nom du business’,dos:‘Inem accuse Scar d'exploiter les femmes de Shanty Town : “Tu nous vends comme des marchandises et tu appelles ça de la protection.” Scar répond que sans lui elles seraient à la rue et que le monde ne leur a jamais rien donné gratuitement.’},
sakho1:{pt:180,wt:360,vd:10800000,n:‘Sakho vs Mangane’,t:‘Sakho & Mangane’,q:‘Mangane accuse Sakho d'être un flic corrompu qui choisit ses lois comme on choisit un menu’,dos:‘Mangane confronte son partenaire : “Tu contournes la loi quand ça t'arrange et tu l'appliques quand ça te sert.” Sakho répond : “La loi parfaite n'existe pas. Moi je choisis la justice, pas le code pénal.”’},
dial1:{pt:120,wt:240,vd:3600000,n:‘Dial vs Sa Belle-mère’,t:‘Dial Diali’,q:‘La belle-mère accuse Dial d'avoir ensorcelé son fils pour détruire la famille’,dos:‘La belle-mère est catégorique : “Depuis que tu es entrée dans cette maison, mon fils ne me regarde plus.” Dial répond : “Votre fils est un adulte. L'amour d'une femme ne détruit pas celui d'une mère, sauf si la mère le décide.”’},
maitresse1:{pt:180,wt:360,vd:10800000,n:‘Marème vs Dialika’,t:‘Maîtresse d'un homme marié’,q:‘Dialika accuse Marème d'avoir volé son mari en toute connaissance de cause’,dos:‘Dialika est brisée : “Tu savais qu'il était marié. Tu as choisi de détruire ma famille.” Marème répond : “Ton mari est venu me chercher. Je n'ai pas volé ce qui ne t'appartenait déjà plus.”’},
pod1:{pt:120,wt:240,vd:3600000,n:‘Pod vs Marichou’,t:‘Pod et Marichou’,q:‘Marichou accuse Pod d'être un éternel indécis qui joue avec les sentiments de tout le monde’,dos:‘Marichou explose : “Tu dis que tu m'aimes mais tu disparais dès que ça devient sérieux. Tu collectionnes les femmes comme des trophées.” Pod répond : “L'amour c'est compliqué. Je cherche juste à comprendre ce que je veux vraiment.”’},
cara1:{pt:120,wt:240,vd:3600000,n:‘Le Héros vs Son Maître’,t:‘Caratécas’,q:‘Le maître accuse son élève d'utiliser le karaté pour la violence au lieu de la discipline’,dos:‘Le maître est déçu : “Je t'ai enseigné l'art du combat pour te construire, pas pour que tu détruises.” L'élève répond : “Vous m'avez appris à me défendre. C'est exactement ce que je fais. Le monde dehors n'est pas un dojo.”’},
heritage1:{pt:180,wt:360,vd:10800000,n:‘Le Fils vs L'Oncle’,t:‘Héritage’,q:‘Le fils accuse l'oncle d'avoir détourné l'héritage familial pendant que son père mourait’,dos:‘Le fils est hors de lui : “Mon père n'était pas encore enterré que tu avais déjà les clés de la maison et les papiers du terrain.” L'oncle répond : “En Afrique, c'est le frère aîné qui gère. Ton père le savait. Toi tu étais à l'étranger.”’},
winx1:{pt:120,wt:240,vd:3600000,n:‘Bloom vs Stella’,t:‘Les Winx’,q:‘Stella accuse Bloom de monopoliser la lumière et de traiter les Winx comme ses faire-valoir’,dos:‘Stella est blessée : “C'est toujours toi l'héroïne, toi qui sauve tout le monde, et nous on est juste le décor.” Bloom répond : “J'ai jamais demandé à être choisie. Mais quand le Dragon de Feu brûle, c'est pas toi qui l'éteins.”’},
foot1:{pt:120,wt:240,vd:3600000,n:‘Tag vs Éric’,t:‘Foot 2 Rue’,q:‘Éric accuse Tag de ne jouer que pour lui-même et de se prendre pour Zidane’,dos:‘Éric confronte Tag : “Tu dribbles tout le monde, tu ne fais jamais la passe, et quand on perd c'est jamais ta faute.” Tag répond : “Le foot c'est de l'art. Tu veux que je fasse des passes à des gens qui ne savent pas les recevoir ?”’},
naruto1:{pt:180,wt:360,vd:10800000,n:‘Naruto vs Sasuke’,t:‘Naruto’,q:‘Sasuke accuse Naruto d'être naïf au point de mettre en danger tout le village par amitié aveugle’,dos:‘Sasuke est cinglant : “Tu as risqué Konoha entier pour me ramener. Des gens sont morts parce que tu refuses d'accepter qu'on puisse ne pas vouloir être sauvé.” Naruto répond : “Abandonner un ami c'est pire que perdre une guerre.”’},
scofield1:{pt:120,wt:240,vd:3600000,n:‘Michael vs Lincoln’,t:‘Prison Break’,q:‘Lincoln accuse Michael d'avoir joué avec la vie de tout le monde pour un plan que personne ne lui avait demandé’,dos:‘Lincoln accuse son frère Michael Scofield d'avoir mis en danger des dizaines de personnes — détenus, gardiens, innocents — pour un plan d'évasion que lui seul avait décidé. Michael répond qu'il a fait ce que la justice n'a pas fait : sauver un innocent du couloir de la mort.’},
valide1:{pt:180,wt:360,vd:10800000,n:‘Apash vs William’,t:‘Validé’,q:‘William accuse Apash d'avoir vendu son âme au rap game en oubliant d'où il vient’,dos:‘William confronte Apash : “Tu rappais pour le quartier. Maintenant tu rappes pour les streams. T'as changé de public et t'appelles ça évoluer.” Apash répond : “Le quartier m'a rien donné. Le rap m'a tout donné. Si évoluer c'est trahir, alors oui j'ai trahi.”’},
soeurs1:{pt:180,wt:360,vd:10800000,n:‘Karen vs Terrence’,t:‘7 Sœurs’,q:‘Karen accuse Terrence d'avoir sacrifié l'enfance de ses filles pour protéger un secret qu'il n'avait pas le droit de garder’,dos:‘Karen est brisée : “Tu nous as enfermées. Tu nous as donné des noms de jours. Tu nous as volé notre identité pour nous sauver. Mais qui t'a demandé de choisir entre notre vie et notre liberté ?” Terrence répond : “Le monde vous aurait tuées. Moi je vous ai cachées. C'est pas pareil.”’},
eki1:{jm:true,pt:180,wt:360,vd:10800000,n:‘Eki vs Sa Mère’,t:‘Eki’,q:‘Eki accuse sa mère d'avoir choisi la tradition plutôt que le bonheur de sa propre fille’,dos:‘Eki explose : “Tu savais ce que ce mariage me ferait. Tu savais et tu as regardé. Parce que la tradition compte plus que ta fille.” Sa mère répond : “Je t'ai protégée à ma manière. Tu ne connais pas le prix que j'ai payé pour que tu sois en vie.”’},
desrances1:{jm:true,pt:180,wt:360,vd:10800000,n:‘Le Fils vs Le Père’,t:‘Desrances’,q:‘Le fils accuse son père d'avoir bâti sa fortune sur le sang des innocents et d'appeler ça un héritage’,dos:‘Le fils est dégoûté : “Ton argent pue la mort. Chaque billet que tu me donnes est taché. Et tu veux que je dise merci ?” Le père répond froidement : “Ce pays ne donne rien aux gentils. J'ai fait ce qu'il fallait pour que tu ne manques de rien. Tu me jugeras quand tu auras faim.”’},
nuitdesrois1:{jm:true,pt:300,wt:600,vd:21600000,n:‘Roman vs Barbe Noire’,t:‘La Nuit des Rois’,q:‘Roman accuse Barbe Noire d'avoir instauré un système de terreur déguisé en tradition dans la MACA’,dos:‘Roman est nouveau dans la MACA. Il confronte Barbe Noire : “Tu appelles ça la tradition. C'est de l'esclavage. Le conteur raconte ou il meurt. C'est pas de la culture, c'est de la barbarie.” Barbe Noire répond : “Sans la tradition, cette prison s'effondre. Le chaos tue plus vite que moi.”’},
light1:{pt:180,wt:360,vd:10800000,n:‘Light vs L’,t:‘Death Note’,q:‘L accuse Light Yagami d'être un meurtrier de masse qui se prend pour Dieu’,dos:‘L est méthodique : “Tu as tué des milliers de personnes avec un cahier et tu appelles ça la justice. Tu n'es pas un dieu, tu es un étudiant avec un complexe de supériorité.” Light répond : “Le monde est pourri. Quelqu'un devait agir. Vous, vous observez. Moi, j'ai agi.”’}
};
var caseKeys=Object.keys(ALL_CASES);
activeCaseKeys=caseKeys.slice(0,30);
activeCaseKeys.forEach(function(k){CASES[k]=ALL_CASES[k]});
