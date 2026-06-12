// ======================
// DONNÉES GLOBALES
// ======================
var me = { name: '', email: '', wins: 0, duels: 0, cabId: '', cabName: '', cabCode: '', favSeries: [], onboarded: false };
var myUid = 'u' + Math.random().toString(36).substr(2, 9);
var myRole = '';
var curCase = '';
var currentRoom = null;
var prepI;
var botTimer;
var judgeI;
var CASES = {};
var RC = 276.46;
var judgeChoice = '';
var urlRoom = (new URLSearchParams(window.location.search)).get('room');
var duelDuJour = 'who2'; // Mis à jour manuellement chaque matin dans Firebase

// ======================
// CLIENT ATTITRÉ (personnages des affaires)
// ======================
var CLIENTS = [
  {id:'ghost',name:'Ghost',serie:'Power',sig:'ghost_power',c1:'#2A1660',c2:'#5B2D9A'},
  {id:'assane',name:'Assane',serie:'Lupin',sig:'lupin1',c1:'#0F2A52',c2:'#1B4A8C'},
  {id:'annalise',name:'Annalise',serie:'Murder',sig:'annalise1',c1:'#4A1020',c2:'#8B1C3A'},
  {id:'sully',name:'Sully',serie:'Top Boy',sig:'topboy1',c1:'#0C2818',c2:'#1A5C32'},
  {id:'tommy',name:'Tommy',serie:'Peaky Blinders',sig:'tommy1',c1:'#1C1C24',c2:'#3A3A48'},
  {id:'walter',name:'Walter',serie:'Breaking Bad',sig:'walter1',c1:'#0C3818',c2:'#1A6C32'},
  {id:'apash',name:'Apash',serie:'Validé',sig:'valide1',c1:'#3A1A08',c2:'#7A3510'},
  {id:'sakho',name:'Sakho',serie:'Sakho & Mangane',sig:'sakho1',c1:'#08303A',c2:'#10606C'},
  {id:'wilson',name:'Wilson',serie:'WHO',sig:'who2',c1:'#2A2008',c2:'#5A4510'},
  {id:'ebony',name:'Ebony',serie:'Nemesis',sig:'nemesis1',c1:'#2A0818',c2:'#5A1038'}
];
var selectedClient = '';






// ======================
// CASES (AFFAIRES)
// ======================
function K(x, n, t, q, dos, bd, ba, j) {
  var p = x == 2 ? [120, 240, 3600000] : x == 3 ? [300, 900, 21600000] : x == 4 ? [300, 600, 21600000] : [180, 360, 10800000];
  return {
    pt: 120, wt: 120, vd: p[2], n: n, t: t, q: q,
    dos: dos || q,
    bd: bd || "L'accusé a agi selon ses convictions. Chaque décision était un choix de survie, pas de trahison.",
    ba: ba || "Les faits sont accablants. Aucune excuse ne peut justifier les dommages causés aux victimes.",
    jm: j || false
  };
}



var ADMIN_DATA = {"cases":{},"disabled":[]};

var ALL_CASES = {
  snowfall1: K(1, 'Franklin vs South Central', 'Snowfall', "Franklin a bâti son empire sur la ruine de son propre quartier. Survivant lucide d'un système truqué, ou homme qui a fait de l'ambition sa seule loyauté ?", "Los Angeles, années 1980. Franklin Saint, jeune homme brillant et ambitieux de South Central, comprend avant tout le monde le potentiel d'une nouvelle drogue : le crack. Méthodique, calme, il bâtit en quelques années un empire qui le rend riche et puissant. Mais cette fortune a un prix : le crack ravage les rues qui l'ont vu grandir, détruit des familles entières, et transforme son quartier en zone sinistrée. Franklin jure qu'il n'a fait que saisir la seule opportunité qu'un système raciste lui laissait. Autour de lui, la communauté s'effondre.", "Franklin n'a pas créé le système qui l'a piégé. Né noir et pauvre dans une Amérique qui lui fermait toutes les portes, il a transformé la seule ouverture qu'on lui laissait en empire. Le crack est arrivé par des forces bien plus grandes que lui : il n'a fait que survivre et s'élever là où on voulait le voir échouer.", "Franklin savait exactement ce que le crack ferait aux siens, et il l'a vendu quand même. Aucun système ne l'a forcé à empoisonner son propre quartier, à détruire les familles de ses voisins pour son profit. Il n'est pas une victime : il est celui qui a sacrifié sa communauté sur l'autel de son ambition."),
  leconkr1: K(1, 'Na Hwa-jin vs Les parents', 'Que ça vous serve de leçon', "Na Hwa-jin frappe pour protéger les plus faibles. Dernier rempart face à la violence, ou homme devenu le bourreau qu'il prétend combattre ?", "Corée du Sud. Face à une violence scolaire incontrôlable et à des enseignants qui ne peuvent plus faire respecter leur autorité, l'État crée une agence spéciale chargée de reprendre la main sur les établissements en crise. Na Hwa-jin, ancien membre des forces spéciales, est envoyé sur le terrain avec une autorisation officielle d'employer des méthodes physiques et psychologiques contre les élèves violents. Là où le système a échoué, il rétablit l'ordre par la force. Mais ses cibles sont des adolescents, et certains crient à l'abus de pouvoir.", "Na Hwa-jin agit là où tout le monde a abandonné. Quand le harcèlement pousse des élèves au désespoir et que les professeurs sont impuissants, l'inaction tue. Il protège la majorité silencieuse et rend leur sécurité à ceux que la violence terrorisait. Parfois, seule la fermeté arrête un bourreau.", "Na Hwa-jin emploie la brutalité de l'État contre des mineurs et devient exactement la violence qu'il prétend combattre. Frapper et humilier des adolescents n'est pas de la justice : c'est un abus de pouvoir institutionnalisé. Aucune fin ne justifie qu'un adulte mandaté par l'État lève la main sur des enfants."),
  nemesis1: K(1, 'Ebony vs Candice', 'Nemesis', "Ebony savait qui était vraiment son mari et s'est tue. Femme loyale piégée par l'amour, ou complice qui a choisi de fermer les yeux ?", "Los Angeles. Isaiah Stiles traque depuis des mois une équipe de braqueurs. Sa femme Candice, elle, s'est liée d'amitié avec Ebony Wilder — sans savoir que le mari d'Ebony est précisément le criminel qu'Isaiah pourchasse. Quand la vérité éclate, la question devient : Ebony savait-elle ? Et si oui, depuis quand ?", "Ebony n'était pas complice. Elle était une femme qui protégeait sa famille dans un monde où personne ne lui laissait le choix. Candice confond loyauté conjugale et trahison délibérée.", "Ebony a regardé Candice lui parler de son mari brisé par cette enquête, et elle a souri. Elle savait. Elle a choisi de se taire. Ce silence a un nom : complicité."),
  blood1: K(1, 'Sarah vs Kemi', 'Blood Sisters', "Sarah a dissimulé un mort et entraîné son amie dans le mensonge. Femme qui s'est défendue d'un homme violent, ou amie qui a sacrifié l'innocence de Kemi ?", "Lagos, Nigeria. Le soir du mariage de Kemi, Kola, son fiancé violent et possessif, est mort. Sarah a dissimulé les faits, pris des décisions à la place de Kemi, et l'a engagée dans une spirale de mensonges et de danger mortel.", "Kola était un homme violent qui aurait tué Kemi. Sarah a agi dans l'urgence pour sauver sa meilleure amie.", "Sarah a menti à Kemi pendant des semaines. Elle l'a transformée en fugitive, en complice d'un crime qu'elle n'a pas commis."),
  tommy1: K(1, 'Tommy vs Arthur', 'Peaky Blinders', "Tommy a mené les Shelby au sommet en les exposant à tous les dangers. Chef qui sacrifie tout pour élever sa famille, ou homme qui la broie pour son pouvoir ?", "Birmingham, Small Heath, après la Première Guerre mondiale. Tommy Shelby a transformé le chaos en empire. Il a utilisé la douleur de ses frères, leur loyauté aveugle, leur incapacité à refuser une mission comme matière première de son ascension.", "Sans Tommy, les Shelby seraient restés des petits criminels de banlieue. Tommy a donné à sa famille une puissance qu'ils n'auraient jamais atteinte seuls.", "Tommy a regardé Arthur se noyer dans la violence et la drogue, et il a continué à lui donner des missions parce qu'Arthur était utile."),
  lupin1: K(1, 'Assane vs Hubert', 'Lupin', "Assane vole et manipule au nom d'une injustice subie. Justicier qui répare ce que la loi a laissé faire, ou homme qui se sert de sa blessure pour tout justifier ?", "Paris. Babakar Diop, père d'Assane, a été accusé à tort du vol d'un collier par Hubert Pellegrini. Il est mort en prison. Assane a consacré sa vie à la vengeance, mettant en danger sa femme et son fils.", "Assane n'avait pas accès aux voies normales de la justice. Face à une injustice systémique, seule une réponse hors système pouvait fonctionner.", "Assane a mis sa femme en danger, séparé son fils de ses parents. La mémoire de son père est devenue un alibi pour un mode de vie criminel."),
  valide1: K(1, 'Apash vs William', 'Validé', "Pour rester au sommet, Apash a piétiné ceux qui l'ont fait. Faim de celui qui refuse de retomber, ou froideur d'un ambitieux ?", "Paris. Après des débuts galère, Apash est devenu une star du rap français : streams, concerts, reconnaissance. Mais plus il monte, plus il s'éloigne de ceux qui l'ont lancé : son mentor William, son entourage du début, ses valeurs d'origine. Pour rester au sommet dans un milieu impitoyable, il prend des décisions de plus en plus dures, quitte à piétiner les liens et les promesses du début. Apash assure que c'est le prix à payer pour réussir. Ceux qui l'ont soutenu, eux, se sentent trahis.", "Apash a fait ce que le milieu exige de quiconque veut survivre tout en haut. Personne ne reste au sommet du rap par sentimentalisme. Il s'est battu pour sortir de la galère et offrir mieux aux siens : lui reprocher son ascension, c'est lui reprocher d'avoir refusé de rester à terre.", "Apash a renié tout ce qui l'a fait. Derrière le discours de la réussite, il y a un homme qui a trahi son mentor, lâché les siens et sacrifié ses valeurs pour des streams. Ce n'est pas le milieu qui l'a changé : c'est lui qui a choisi son ego avant sa parole."),
  ghost_power: K(1, 'Le choix de Ghost', 'Power', "Ghost jure que tout est pour sa famille. Père prêt à tout pour les sauver, ou homme dont l'orgueil a tué tout ce qu'il touchait ?", "New York. James St. Patrick — Ghost — règne sur le trafic de la ville tout en dirigeant Truth, sa boîte de nuit : sa vitrine légale, son rêve de respectabilité. Tiraillé entre deux mondes, il ne veut qu'une chose : décrocher, sortir du game, devenir un homme d'affaires propre. Mais chaque pas vers la lumière exige un sacrifice dans l'ombre — un associé éliminé, un ami trahi, une famille mise en danger. Ghost jure que tout est pour les siens. Autour de lui, pourtant, les proches tombent un à un.", "Ghost n'a jamais eu le luxe du choix. Né dans un système qui ne laisse aucune porte de sortie aux siens, il a transformé le seul terrain qu'on lui concédait en tremplin. Tout ce qu'il a fait, il l'a fait pour arracher sa famille à la rue et lui offrir la vie légale qu'on lui refusait. Le juger, c'est juger un homme coupable d'avoir voulu s'élever.", "Ghost n'a sauvé que lui-même. Derrière le discours sur la famille, il y a un homme qui a sacrifié sa femme, ses amis, ses fidèles, au nom de son ambition. Chaque mort autour de lui porte sa signature. Ce n'est pas un prisonnier du système : c'est un homme qui a choisi son empire avant les siens."),
  walter1: K(1, 'Walter vs Jesse', 'Breaking Bad', "Walter dit avoir tout fait pour sa famille. Père acculé qui a basculé pour les protéger, ou homme qui a goûté au pouvoir et y a pris goût ?", "Albuquerque. Jesse a découvert que c'est Walter qui avait empoisonné Brock, délibérément, pour manipuler Jesse et le retourner contre Gus. Walter avait calculé la dose pour que l'enfant survive.", "Walter n'a pas voulu tuer Brock. Il a calculé une dose qui ne mettait pas sa vie en danger. L'objectif était d'éliminer Gus Fring qui voulait les tuer tous les deux.", "Walter White a empoisonné un enfant de 8 ans en secret. Il a regardé Jesse s'effondrer d'inquiétude tout en sachant qu'il en était responsable."),
  maitresse1: K(1, 'Marème vs Dialika', "Maîtresse d'un homme marié", "Marème aime un homme marié et refuse d'y renoncer. Femme qui assume un amour sincère, ou femme qui détruit le foyer d'une autre sans remords ?", "Dakar. Dialika est mariée à Baye Fall depuis des années. Marème est entrée dans cette équation en sachant pertinemment qu'il était marié.", "Marème n'a pas trahi Dialika. Elle ne lui a fait aucune promesse. C'est Baye Fall qui a fait des vœux et qui les a brisés.", "Marème savait. Elle a quand même choisi de continuer. La liberté individuelle s'arrête là où elle détruit délibérément la vie d'une autre personne."),
  heritage1: K(1, "Le Fils vs L'Oncle", 'Héritage', "L'oncle a capté l'héritage destiné au fils. Gardien qui a protégé le patrimoine d'un héritier incapable, ou homme qui a dépouillé un endeuillé ?", "Côte d'Ivoire. Le père est mort, laissant derrière lui une propriété et une famille fracturée. L'oncle s'est positionné comme gestionnaire naturel pendant le deuil.", "L'oncle a géré l'héritage parce que le fils était incapable de le faire dans l'immédiat du deuil.", "L'oncle a attendu que son frère soit dans la terre pour mettre la main sur ce qu'il n'avait pas réussi à obtenir de son vivant."),
  tag1: K(2, 'Tag vs Éric', 'Foot 2 Rue', "Tag fait passer son show personnel avant le collectif. Génie qui transcende le jeu, ou égoïste qui sacrifie son équipe à son ego ?", "Paris, terrain de foot 2 rue. Tag est le joueur le plus talentueux de l'équipe — tout le monde le sait, lui le premier. Éric lui reproche de traiter chaque match comme un show personnel.", "Tag marque les buts qui gagnent les matchs. Sans son talent, l'équipe n'existerait même pas.", "Tag préfère rater un dribble incroyable que réussir une passe simple. Il confond le talent avec le droit d'ignorer les autres."),
  nuitdesrois1: K(4, 'Roman vs Barbe Noire', 'La Nuit des Rois', "Barbe Noire règne sur la MACA par la peur, au nom de la tradition. Gardien d'un ordre qui évite le chaos, ou tyran qui maquille sa cruauté en coutume ?", "Abidjan, prison de la MACA. Barbe Noire est le chef incontesté de la prison. Son pouvoir repose sur une tradition : chaque nuit, le Roman doit raconter une histoire jusqu'à l'aube. S'il s'arrête, il meurt.", "Barbe Noire a transformé un espace de violence brute en un espace où la parole a une valeur.", "Barbe Noire a inventé une tradition pour justifier son pouvoir de vie et de mort."),
  topboy1: K(1, 'Sully vs Aaron', 'Top Boy', "Sully a tué un proche au nom du code de la rue. Homme fidèle à des règles qui le dépassent, ou meurtrier qui se cache derrière un code ?", "Summerhouse, Est de Londres. Jamie Tovell avait tout fait pour sortir ses frères Aaron et Stefan de la rue. Quand Dushane a ordonné la mort de Jamie, c'est Sully qui a appuyé sur la gâchette.", "Sully n'a pas assassiné Jamie. Il a exécuté une décision qui dépassait les deux hommes.", "Sully a regardé Jamie dans les yeux et a tiré. Par choix. Jamie essayait de s'en sortir. Aaron n'a plus de frère."),
  dinercon1: K(1, 'Pignon vs Brochant', 'Le Dîner de Cons', "Pignon, plein de bonnes intentions, a transformé la vie de Brochant en désastre. Innocent qu'on ne peut blâmer, ou homme dont la bêtise fait autant de dégâts qu'une méchanceté ?", "Paris. Brochant a invité Pignon, comptable passionné de maquettes d'allumettes, à son dîner. En quelques heures, Pignon a provoqué la fuite de sa femme, alerté le fisc, révélé une relation extraconjugale et déclenché une série de catastrophes en chaîne.", "Pignon n'a rien fait de mal intentionnellement. C'est Brochant qui a créé ce jeu cruel et méprisable.", "La bonne intention ne suffit pas. Pignon a détruit le mariage de Brochant, alerté le fisc, fait fuir sa maîtresse."),
  sakho1: K(1, 'Sakho vs Mangane', 'Sakho & Mangane', "Sakho s'affranchit des règles pour résoudre ses enquêtes. Flic qui sert la vérité quand la procédure protège les coupables, ou homme qui se croit au-dessus de la loi ?", "Dakar, Sénégal. Sakho a l'habitude de contourner les règles quand il estime que le résultat est juste. Il s'introduit illégalement, il intimide des témoins, il manipule les procédures.", "Sakho attrape les coupables que la procédure laisserait filer. Dans un système judiciaire imparfait, un flic qui joue selon les mêmes règles que les criminels est parfois le seul qui peut gagner.", "Si chaque flic décide seul quelles lois il respecte, le droit n'existe plus."),
  annalise1: K(1, 'Annalise vs Michaela', 'Murder', "Annalise se sert de ses étudiants pour survivre. Femme brisée qui fait ce qu'il faut pour ne pas sombrer, ou manipulatrice qui sacrifie les plus jeunes ?", "Philadelphie, faculté de droit. Annalise Keating a sélectionné Michaela et quatre autres étudiants pour travailler sur ses affaires réelles. Ce qu'ils ne savaient pas : ils allaient devenir des complices.", "Annalise a donné à ses étudiants ce qu'aucune école de droit ne leur aurait donné : une formation dans le feu, une compréhension de la justice dans sa réalité brutale.", "Annalise a recruté des étudiants vulnérables, elle les a rendus complices de ses propres crimes, et elle a utilisé leur loyauté comme bouclier."),
  bloom1: K(1, 'Bloom vs Icy', 'Les Winx', "Bloom doit ses pouvoirs à son sang, pas à son mérite. Élue légitime qui assume son destin, ou héroïne qui se pare d'une grandeur qu'elle n'a pas gagnée ?", "Alfea, école des fées. Bloom a grandi en pensant être une humaine ordinaire avant de découvrir qu'elle est la princesse de la planète Domino et porteuse du Feu du Destin. Icy lui reproche de se poser en héroïne alors que tout ce qu'elle a, elle le doit à sa naissance et au hasard, pas à son travail ou son mérite.", "Bloom n'a pas choisi ses origines, mais elle a choisi d'assumer la responsabilité qui venait avec. Elle aurait pu fuir. Elle s'est battue.", "Bloom arrive à Alfea sans formation, sans effort préalable, et s'impose comme la plus puissante grâce à des pouvoirs innés. Elle représente exactement ce que le mérite devrait combattre : le privilège de naissance déguisé en destin."),
  who2: K(1, 'Wilson vs Le Groupe', 'WHO', "Wilson sait des choses qu'il ne devrait pas savoir. Esprit visionnaire qui voit avant les autres, ou homme qui cache la source de son avance ?", "Personne ne le suspecte. Il est discret, posé, toujours à sa place. C'est exactement ce qui pose problème.", "Être intelligent dans un groupe ce n'est pas une preuve de trahison. C'est une qualité qu'on lui reproche parce qu'on n'en a pas.", "Il anticipe tout. Il sait avant les autres. Il ne pose jamais les mauvaises questions — parce qu'il connaît déjà les réponses."),
};

var CHARGES = {
  snowfall1: {acc:"La communauté de South Central", def:"Franklin", re:"Franklin aurait préféré prospérer sur la destruction des siens plutôt que de sauver son quartier — un esprit brillant pour qui réussir comptait plus qu'appartenir."},
  leconkr1: {acc:"Les parents d'élèves", def:"Na Hwa-jin", re:"Na Hwa-jin imposerait l'ordre par la peur et la force, convaincu que protéger les innocents autorise tout — quitte à devenir lui-même la violence qu'il traque."},
  nemesis1: {acc:"Candice", def:"Ebony", re:"Ebony aurait préféré son couple à la vérité — une femme qui, par amour ou par confort, a couvert les crimes de son mari et laissé faire."},
  blood1: {acc:"Kemi", def:"Sarah", re:"Sarah aurait fait porter le poids de son acte à une autre — une femme qui, pour échapper aux conséquences, a enchaîné son amie à un secret capable de la détruire."},
  tommy1: {acc:"Arthur", def:"Tommy", re:"Tommy exigerait des siens qu'ils saignent pour ses guerres — un stratège génial persuadé que les mener au sommet vaut bien quelques vies sacrifiées."},
  lupin1: {acc:"Hubert", def:"Assane", re:"Assane se croirait au-dessus des règles parce qu'il a souffert — un homme brillant qui maquille en quête de justice une vie de vols, au risque d'y entraîner ses proches."},
  valide1: {acc:"William", def:"Apash", re:"Apash aurait renié son mentor et les siens pour ne pas quitter le sommet — un homme persuadé qu'arrivé là-haut, la loyauté devient un luxe qu'on ne peut plus s'offrir."},
  ghost_power: {acc:"Le ministère public", def:"Ghost", re:"Ghost se servirait de l'amour des siens comme d'une excuse — un homme dont la soif de respectabilité a sacrifié, un à un, ceux qu'il jurait protéger."},
  walter1: {acc:"Jesse", def:"Walter", re:"Walter aurait masqué sa soif de pouvoir derrière sa famille — un homme humilié qui a empoisonné un enfant et tout détruit parce qu'au fond, il aimait ça."},
  maitresse1: {acc:"Dialika", def:"Marème", re:"Marème ferait passer son désir avant la vie d'une famille — une femme qui, au nom de l'amour, s'installe dans le foyer d'une autre et refuse d'en mesurer le prix."},
  heritage1: {acc:"Le fils", def:"L'oncle", re:"L'oncle aurait profité du deuil pour s'emparer de ce qui revenait au fils — un homme qui justifie sa mainmise par la prudence quand d'autres y voient une trahison."},
  tag1: {acc:"Éric", def:"Tag", re:"Tag ferait passer son talent avant les siens — un joueur d'exception persuadé que son génie l'autorise à jouer pour lui plutôt que pour l'équipe."},
  nuitdesrois1: {acc:"Roman", def:"Barbe Noire", re:"Barbe Noire aurait fait de la tradition l'instrument de sa domination — un homme qui impose la terreur en prétendant servir un ordre plus grand que lui."},
  topboy1: {acc:"Aaron", def:"Sully", re:"Sully aurait placé la loyauté à la rue au-dessus de toute morale — un homme capable de tuer les siens en se persuadant que le code l'exigeait."},
  dinercon1: {acc:"Brochant", def:"Pignon", re:"Pignon se réfugierait derrière sa bonne foi — un homme persuadé de bien faire qui détruit tout sur son passage sans jamais en répondre."},
  sakho1: {acc:"Mangane", def:"Sakho", re:"Sakho déciderait seul de ce qui est juste — un policier convaincu que sa quête de vérité l'autorise à piétiner les règles qu'il est censé incarner."},
  annalise1: {acc:"Michaela", def:"Annalise", re:"Annalise transformerait ceux qu'elle devrait protéger en boucliers — une femme d'un talent rare qui, pour sauver sa peau, expose ses étudiants sans jamais l'assumer."},
  bloom1: {acc:"Icy", def:"Bloom", re:"Bloom fonderait sa légitimité sur un héritage — une héroïne qui se réclame d'une grandeur reçue à la naissance plutôt que conquise par ses actes."},
  who2: {acc:"Le groupe", def:"Wilson", re:"Wilson dissimulerait l'origine de ce qu'il sait — un homme qui prend l'ascendant sur le groupe grâce à un savoir qu'il refuse d'expliquer."},
};

var caseKeys = Object.keys(ALL_CASES);
caseKeys.forEach(function(k) { CASES[k] = ALL_CASES[k]; if (CHARGES[k]) { CASES[k].re = CHARGES[k].re; CASES[k].acc = CHARGES[k].acc; CASES[k].def = CHARGES[k].def; } });
applyAdminCases();
caseKeys = Object.keys(CASES);
var allSeries = [];
caseKeys.forEach(function(k) {
  var t = CASES[k].t;
  if (allSeries.indexOf(t) === -1) allSeries.push(t);
});

// ======================
// FONCTIONS UTILITAIRES
// ======================
// Pages légales
function openLegal(page, from) { window.legalReturn = from || 'profil'; go(page); }
function closeLegal() {
  var r = window.legalReturn || 'profil';
  if (r === 'profil') { switchTab('profil'); } else { go(r); }
}

function go(id) {
  document.querySelectorAll('.P').forEach(function(p) { p.classList.remove('on'); });
  var el = document.getElementById(id);
  if (!el) { id = 'splash'; el = document.getElementById('splash'); }
  if (el) el.classList.add('on');
  if (id === 'client-select') {
    try {
      var cards = document.getElementById('client-cards');
      if (cards && cards.children.length === 0 && typeof buildClientSelect === 'function') buildClientSelect();
    } catch(e) {}
  }
}

function switchTab(id) {
  if (currentRoom && id !== 'home' && id !== 'verdicts' && id !== 'profil') { leaveDuel(); }
  go(id);
  if (id === 'profil') { buildProfile(); loadProfile(); }
  if (id === 'verdicts') loadPublicDuels();
  if (id === 'home') loadFeed();
}

function setUid(e) { myUid = e.replace(/[^a-zA-Z0-9]/g, '_'); }

function saveSession() {
  try { localStorage.setItem('dbrief_user', JSON.stringify(Object.assign({ uid: myUid }, me))); } catch(e) {}
}

function hashPwd(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h; }
  return 'h' + Math.abs(h).toString(36);
}

function cleanMsg(t) {
  if (!t) return '';
  return String(t).replace(/<[^>]*>/g, '').substring(0, 300);
}

function uR(id, f) {
  var el = document.getElementById(id);
  if (el) el.setAttribute('stroke-dashoffset', String(RC * (1 - f)));
}

function fT(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function genCode() { return 'CAB-' + Math.random().toString(36).substr(2, 4).toUpperCase(); }

function waitDb(cb) {
  if (window.db) { cb(); return; }
  var r = 0;
  var w = setInterval(function() {
    r++;
    if (window.db) { clearInterval(w); cb(); }
    else if (r > 20) { clearInterval(w); }
  }, 500);
}

// ======================
// DUEL DU JOUR — charger depuis Firebase
// ======================
function loadDuelDuJour(cb) {
  if (window.db) {
    window.db.ref('duel_du_jour').once('value', function(snap) {
      var val = snap.val();
      if (val && CASES[val]) { duelDuJour = val; }
      cb();
    });
  } else {
    cb();
  }
}

// ======================
// BUILD HOME — Duel du Jour en premier, puis favoris, puis reste
// ======================
function buildHome() {
  var fav = me.favSeries || [];
  var cl = CLIENTS.filter(function(c){ return c.id === me.clientId; })[0];
  var clientSerie = cl ? cl.serie : '';

  // Ordre : affaires du client en premier, puis séries favorites, puis le reste
  var clientKeys = [];
  var favKeys = [];
  var restKeys = [];
  caseKeys.forEach(function(k) {
    var t = CASES[k].t;
    if (clientSerie && t === clientSerie) clientKeys.push(k);
    else if (fav.length > 0 && fav.indexOf(t) > -1) favKeys.push(k);
    else restKeys.push(k);
  });
  var sorted = clientKeys.concat(favKeys).concat(restKeys);

  var ci = document.getElementById('cards-inner');
  if (!ci) return;
  ci.innerHTML = '';

  sorted.forEach(function(k, idx) {
    var c = CASES[k];
    var card = document.createElement('div');
    card.style.cssText = 'height:100dvh;scroll-snap-align:start;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:0 28px 80px;background:#0a0a12;';

    var badge = c.jm ? '<span style="font-size:10px;padding:3px 10px;background:rgba(255,210,63,.1);border:1px solid rgba(255,210,63,.2);border-radius:10px;color:#FFD23F;margin-left:8px">JUGE</span>' : '';

    card.innerHTML =
      '<div style="position:absolute;top:30%;left:50%;transform:translateX(-50%);width:280px;height:280px;background:radial-gradient(circle,rgba(167,139,250,.1),transparent 70%);pointer-events:none"></div>' +
      '<div style="position:absolute;bottom:25%;right:-30px;width:180px;height:180px;background:radial-gradient(circle,rgba(255,122,46,.07),transparent 70%);pointer-events:none"></div>' +
      '<div style="position:absolute;top:0;left:0;right:0;padding:56px 24px 0;display:flex;justify-content:space-between;align-items:center">' +
        '<div style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#FF7A2E,#e8a0b0,#A78BFA);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">D\'brief</div>' +
        '<div onclick="switchTab(\'profil\')" style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#c7a0d0,#FF7A2E);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;cursor:pointer">' + (me.name || '?').substring(0, 2).toUpperCase() + '</div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;position:relative;flex-wrap:wrap;">' +
        '<div style="display:inline-block;padding:5px 14px;border-radius:20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);font-size:11px;font-weight:800;color:rgba(255,255,255,.4);letter-spacing:2px;">' + c.t.toUpperCase() + badge + '</div>' +
      '</div>' +
      '<div style="font-size:36px;font-weight:900;color:#fff;line-height:1.1;margin-bottom:14px;position:relative">' + c.n + '</div>' +
      '<div style="font-size:15px;color:rgba(255,255,255,.35);line-height:1.6;margin-bottom:32px;position:relative">' + c.q + '</div>' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;position:relative">' +
        '<div style="flex:1;height:1px;background:rgba(255,255,255,.06)"></div>' +
        '<div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.12);letter-spacing:3px">' + (c.jm ? 'RENDRE UN VERDICT' : 'CHOISIS TON CAMP') + '</div>' +
        '<div style="flex:1;height:1px;background:rgba(255,255,255,.06)"></div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;position:relative">' +
        (c.jm ?
          '<button style="width:100%;padding:16px;border-radius:16px;border:2px solid rgba(255,210,63,.3);background:rgba(255,210,63,.06);color:#FFD23F;font-size:15px;font-weight:800;cursor:pointer;font-family:\'Outfit\',sans-serif" onclick="joinDuel(\'' + k + '\')">⚖️ Juger cette affaire</button>' :
          '<button style="flex:1;padding:16px;border-radius:16px;border:2px solid rgba(78,203,113,.3);background:rgba(78,203,113,.06);color:#4ECB71;font-size:15px;font-weight:800;cursor:pointer;font-family:\'Outfit\',sans-serif" onclick="joinDuelAs(\'' + k + '\',\'defense\')">Je défends</button>' +
          '<button style="flex:1;padding:16px;border-radius:16px;border:2px solid rgba(255,71,87,.3);background:rgba(255,71,87,.06);color:#FF4757;font-size:15px;font-weight:800;cursor:pointer;font-family:\'Outfit\',sans-serif" onclick="joinDuelAs(\'' + k + '\',\'accusation\')">J\'accuse</button>') +
      '</div>';

    ci.appendChild(card);
  });
}

// ======================
// FONCTION POUR DÉMARRER LE PREMIER DUEL
// ======================
function startFirstDuel() {
  var randomCaseKey = caseKeys[Math.floor(Math.random() * caseKeys.length)];
  curCase = randomCaseKey;
  var c = CASES[randomCaseKey];
  currentRoom = 'onboarding_' + Date.now().toString(36);
  myRole = 'defense';
  document.getElementById('dd-name').textContent = c.n;
  document.getElementById('dd-dos').textContent = c.dos || c.q;
  var _re = document.getElementById('dd-reproche'); if (_re) _re.textContent = c.re || c.q; var _pa = document.getElementById('dd-parties'); if (_pa) _pa.innerHTML = '<b>' + (c.acc || 'La partie plaignante') + '</b> <span style="color:rgba(255,255,255,.4);font-weight:400;">accuse</span> <b>' + (c.def || '') + '</b>';
  document.getElementById('dd-series-tag').textContent = c.t;
  var cn = c.n.split(' vs ');
  document.getElementById('dd-role').textContent = 'DÉFENSE — Vous défendez ' + cn[1];
  document.getElementById('dd-role').style.color = '#4ECB71';
  go('duel-dossier');
  var tot = c.pt || 120, left = tot;
  clearInterval(prepI);
  uR('dd-ring', 1);
  document.getElementById('dd-timer').textContent = fT(left);
  prepI = setInterval(function() {
    left--;
    if (left <= 0) { clearInterval(prepI); goToSubmitOnboarding(); return; }
    document.getElementById('dd-timer').textContent = fT(left);
    uR('dd-ring', left / tot);
  }, 1000);
  setTimeout(function() {
    document.getElementById('dw-av-acc').textContent = 'B';
    document.getElementById('dw-av-acc').style.borderStyle = 'solid';
    document.getElementById('dw-av-acc').style.borderColor = '#FF4757';
    document.getElementById('dw-av-acc').style.color = '#FF4757';
    document.getElementById('dw-name-acc').textContent = "Avocat du barreau";
    document.getElementById('dw-status').textContent = 'Adversaire trouvé !';
    setTimeout(function() {
      if (window.db) {
        window.db.ref('rooms/' + currentRoom + '/arguments/accusation').set({
          text: c.ba || "Argument par défaut de l'accusation.", uid: 'bot', name: "Avocat du barreau", ts: Date.now()
        });
      }
    }, 2000);
  }, 5000);
}

function goToSubmitOnboarding() {
  clearInterval(prepI);
  var c = CASES[curCase];
  document.getElementById('ds-arg').value = '';
  document.getElementById('ds-count').textContent = '0 / 300';
  var cn = c.n.split(' vs ');
  document.getElementById('ds-role2').textContent = 'DÉFENSE — Vous défendez ' + cn[1];
  document.getElementById('ds-role2').style.color = '#4ECB71';
  document.getElementById('ds-case-name').textContent = c.n;
  document.getElementById('ds-opp-status').style.display = 'none';
  go('duel-submit');
  var tot = c.wt || 240, left = tot;
  clearInterval(prepI);
  uR('ds-ring', 1);
  document.getElementById('ds-timer').textContent = fT(left);
  prepI = setInterval(function() {
    left--;
    if (left <= 0) { clearInterval(prepI); submitOnboarding(); return; }
    document.getElementById('ds-timer').textContent = fT(left);
    uR('ds-ring', left / tot);
  }, 1000);
}

function submitOnboarding() {
  clearInterval(prepI);
  var t = cleanMsg(document.getElementById('ds-arg').value.trim() || '(vide)');
  me.duels = 1;
  saveSession();
  document.getElementById('dv-name').textContent = CASES[curCase].n;
  document.getElementById('dv-def-arg').textContent = t;
  document.getElementById('dv-def-name').textContent = me.name || 'Vous';
  document.getElementById('dv-acc-arg').textContent = CASES[curCase].ba;
  document.getElementById('dv-acc-name').textContent = "Avocat du barreau";
  go('duel-vote');
  updateDuelVoteActions();
  if(typeof showGuestBanner==='function') showGuestBanner();
  if (window.db) {
    window.db.ref('rooms/' + currentRoom + '/arguments/defense').set({ text: t, uid: myUid, name: me.name || '', ts: Date.now() });
  }
}

function buildSeriesGrid() {
  var g = document.getElementById('series-grid');
  g.innerHTML = '';
  allSeries.forEach(function(s) {
    var c = document.createElement('div');
    c.className = 'series-chip';
    c.textContent = s;
    c.onclick = function() { c.classList.toggle('sel'); };
    g.appendChild(c);
  });
}

function finishSeriesSelect() {
  var sel = [];
  document.querySelectorAll('.series-chip.sel').forEach(function(c) { sel.push(c.textContent); });
  if (sel.length < 3) { alert('Choisissez au moins 3 séries'); return; }
  me.favSeries = sel;
  saveSession();
  buildClientSelect();
  go('client-select');
}

// ======================
// CLIENT SELECT
// ======================
function buildClientSelect() {
  var wrap = document.getElementById('client-cards');
  if (!wrap) return;
  wrap.innerHTML = '';
  var fav = me.favSeries || [];
  var sorted = CLIENTS.slice();
  if (fav.length > 0) {
    sorted.sort(function(a, b) {
      var am = fav.indexOf(a.serie) > -1 ? 0 : 1;
      var bm = fav.indexOf(b.serie) > -1 ? 0 : 1;
      return am - bm;
    });
  }
  sorted.forEach(function(cl) {
    var card = document.createElement('div');
    card.className = 'client-card';
    card.id = 'clc-' + cl.id;
    card.onclick = function() { pickClient(cl.id); };
    card.innerHTML =
      '<div class="client-blk" style="background:linear-gradient(135deg,' + cl.c1 + ',' + cl.c2 + ');">' +
        '<div class="client-chk" id="clchk-' + cl.id + '"><svg class="client-chk-svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '<div class="client-pre">Défendre</div>' +
        '<div class="client-nm">' + cl.name + '</div>' +
        '<div class="client-sr">' + cl.serie + '</div>' +
      '</div>';
    wrap.appendChild(card);
  });
}

function pickClient(id) {
  CLIENTS.forEach(function(c) { var e = document.getElementById('clc-' + c.id); if (e) e.classList.remove('sel'); });
  selectedClient = id;
  var el = document.getElementById('clc-' + id);
  if (el) el.classList.add('sel');
  var cl = CLIENTS.filter(function(c) { return c.id === id; })[0];
  var btn = document.getElementById('client-confirm-btn');
  if (btn && cl) { btn.style.opacity = '1'; btn.style.pointerEvents = 'all'; btn.textContent = 'Devenir avocat de ' + cl.name; }
}

function confirmClient() {
  if (!selectedClient) return;
  var cl = CLIENTS.filter(function(c) { return c.id === selectedClient; })[0];
  if (!cl) return;
  me.clientId = cl.id;
  me.clientName = cl.name;
  me.clients = [cl.id];
  me.onboarded = true;
  saveSession();
  if (window.db && me.email) {
    window.db.ref('users/' + myUid + '/clientId').set(cl.id);
    window.db.ref('users/' + myUid + '/clientName').set(cl.name);
  }
  buildProfile();
  buildHome();
  go('home');
}

// Affaire suivante (chaînage compte : fin d'affaire -> suivante)
function nextCase() {
  var keys = caseKeys.slice();
  var i = keys.indexOf(curCase);
  var nk = keys[(i + 1) % keys.length];
  if (nk === curCase && keys.length > 1) nk = keys[(i + 2) % keys.length];
  clearInterval(prepI); clearTimeout(botTimer); clearInterval(judgeI);
  currentRoom = null; myRole = '';
  joinDuelAs(nk, 'defense');
}

// Boutons de fin d'affaire (verdict) selon invité / compte
function updateDuelVoteActions() {
  // Compte : marquer l'affaire signature comme faite -> déverrouille le prétoire
  var nextBtn = document.getElementById('dv-next');
  var acctBtn = document.getElementById('dv-account');
  if (me.email) {
    if (nextBtn) nextBtn.style.display = 'block';
    if (acctBtn) acctBtn.style.display = 'none';
  } else {
    if (nextBtn) nextBtn.style.display = 'none';
    if (acctBtn) acctBtn.style.display = 'block';
  }
}

function leaveDuel() {
  clearInterval(prepI);
  clearTimeout(botTimer);
  clearInterval(judgeI);
  currentRoom = null;
  curCase = '';
  myRole = '';
  if (!me.onboarded) { buildSeriesGrid(); go('series-select'); return; }
  if (!me.email) { go('account-wall'); return; }
  buildHome(); go('home');
}

function joinDuelAs(id, role) { myRole = role; joinDuel(id); }

function joinDuel(id) {
  curCase = id;
  var c = CASES[id];
  if (!c) return;
  var chosenRole = myRole || 'defense';


  if (c.jm) {
    var judgedKey = 'judged_' + id;
    var judged = localStorage.getItem(judgedKey);
    if (judged) { alert('Vous avez déjà rendu votre verdict sur cette affaire.'); return; }
    go('judge-mode');
    document.getElementById('jm-name').textContent = c.n;
    document.getElementById('jm-question').textContent = c.q;
    document.getElementById('jm-def').textContent = c.bd || "Argument de la défense...";
    document.getElementById('jm-acc').textContent = c.ba || "Argument de l'accusation...";
    document.getElementById('jm-motiv').value = '';
    document.getElementById('jm-count').textContent = '0/600';
    var jTot = 600, jLeft = jTot;
    clearInterval(judgeI);
    uR('jm-ring', 1);
    document.getElementById('jm-timer').textContent = fT(jLeft);
    judgeI = setInterval(function() {
      jLeft--;
      if (jLeft <= 0) { clearInterval(judgeI); if (!judgeChoice) judgeChoice = 'COUPABLE'; judgeDecision(); return; }
      document.getElementById('jm-timer').textContent = fT(jLeft);
      uR('jm-ring', jLeft / jTot);
    }, 1000);
    return;
  }

  currentRoom = null;
  document.getElementById('ds-arg').value = '';
  document.getElementById('ds-count').textContent = '0 / 300';
  document.getElementById('ds-opp-status').style.display = 'none';
  document.getElementById('dw-series').textContent = c.t.toUpperCase();
  document.getElementById('dw-name').textContent = c.n;
  document.getElementById('dw-q').textContent = c.q;
  document.getElementById('dw-av-def').textContent = '?';
  document.getElementById('dw-av-def').style.borderStyle = 'dashed';
  document.getElementById('dw-av-acc').textContent = '?';
  document.getElementById('dw-av-acc').style.borderStyle = 'dashed';
  document.getElementById('dw-av-acc').style.borderColor = 'rgba(255,255,255,.12)';
  document.getElementById('dw-av-acc').style.color = 'rgba(255,255,255,.12)';
  document.getElementById('dw-name-def').textContent = 'En attente…';
  document.getElementById('dw-name-acc').textContent = 'En attente…';
  document.getElementById('dw-status').textContent = "Recherche d'un adversaire…";
  document.getElementById('dw-myrole').style.display = 'none';
  go('duel-wait');

  if (!window.db) return;

  window.db.ref('matchmaking/' + id).once('value', function(snap) {
    var mk = snap.val();
    if (mk && mk.uid !== myUid && mk.status === 'waiting' && mk.role !== chosenRole) {
      currentRoom = mk.roomId;
      myRole = chosenRole;
      window.db.ref('rooms/' + currentRoom + '/roles/' + chosenRole).set({ uid: myUid, name: me.name || '' });
      window.db.ref('matchmaking/' + id).remove();
      if (chosenRole === 'defense') { updateVs(); } else { updateVsAcc(); }
    } else {
      currentRoom = id + '_' + Date.now().toString(36);
      myRole = chosenRole;
      window.db.ref('rooms/' + currentRoom + '/roles/' + chosenRole).set({ uid: myUid, name: me.name || '' });
      window.db.ref('rooms/' + currentRoom + '/caseId').set(id);
      window.db.ref('matchmaking/' + id).set({ uid: myUid, roomId: currentRoom, role: chosenRole, status: 'waiting', ts: Date.now() });
      if (chosenRole === 'defense') { updateVs(); } else { updateVsAcc(); }
      clearTimeout(botTimer);
      botTimer = setTimeout(function() {
        var oppRole2 = chosenRole === 'defense' ? 'accusation' : 'defense';
        window.db.ref('rooms/' + currentRoom + '/roles/' + oppRole2).once('value', function(s) {
          if (!s.val()) {
            window.db.ref('matchmaking/' + id).remove();
            window.db.ref('rooms/' + currentRoom + '/roles/' + oppRole2).set({ uid: 'bot', name: "Avocat du barreau" });
            setTimeout(function() {
              var c2 = CASES[curCase];
              var botArg = chosenRole === 'defense' ? c2.ba : c2.bd;
              window.db.ref('rooms/' + currentRoom + '/arguments/' + oppRole2).set({ text: botArg, uid: 'bot', name: "Avocat du barreau", ts: Date.now() });
            }, 3000);
          }
        });
      }, 10000);
    }

    window.db.ref('rooms/' + currentRoom + '/roles').on('value', function(snap2) {
      var r = snap2.val() || {};
      if (r.defense) {
        document.getElementById('dw-av-def').textContent = (r.defense.name || '?').substring(0, 2).toUpperCase();
        document.getElementById('dw-av-def').style.borderStyle = 'solid';
        document.getElementById('dw-name-def').textContent = r.defense.name || '';
      }
      if (r.accusation) {
        document.getElementById('dw-av-acc').textContent = (r.accusation.name || '?').substring(0, 2).toUpperCase();
        document.getElementById('dw-av-acc').style.borderStyle = 'solid';
        document.getElementById('dw-av-acc').style.borderColor = '#FF4757';
        document.getElementById('dw-av-acc').style.color = '#FF4757';
        document.getElementById('dw-name-acc').textContent = r.accusation.name || '';
      }
      document.getElementById('dw-count').textContent = ((r.defense ? 1 : 0) + (r.accusation ? 1 : 0)) + ' personne(s)';
      if (r.defense && r.accusation) {
        clearTimeout(botTimer);
        window.db.ref('matchmaking/' + curCase).remove();
        document.getElementById('dw-status').textContent = 'Duel prêt!';
        setTimeout(startDuel, 2000);
      }
    });
  });
}

function updateVs() {
  document.getElementById('dw-av-def').textContent = (me.name || '?').substring(0, 2).toUpperCase();
  document.getElementById('dw-av-def').style.borderStyle = 'solid';
  document.getElementById('dw-name-def').textContent = me.name;
  document.getElementById('dw-myrole').textContent = 'Vous êtes la DÉFENSE';
  document.getElementById('dw-myrole').style.display = 'block';
  document.getElementById('dw-myrole').style.color = '#4ECB71';
}

function updateVsAcc() {
  document.getElementById('dw-av-acc').textContent = (me.name || '?').substring(0, 2).toUpperCase();
  document.getElementById('dw-av-acc').style.borderStyle = 'solid';
  document.getElementById('dw-av-acc').style.borderColor = '#FF4757';
  document.getElementById('dw-av-acc').style.color = '#FF4757';
  document.getElementById('dw-name-acc').textContent = me.name;
  document.getElementById('dw-myrole').textContent = "Vous êtes l'ACCUSATION";
  document.getElementById('dw-myrole').style.display = 'block';
  document.getElementById('dw-myrole').style.color = '#FF4757';
}

function startDuel() {
  var c = CASES[curCase];
  if (!c) return;
  document.getElementById('dd-name').textContent = c.n;
  document.getElementById('dd-dos').textContent = c.dos || c.q;
  var _re = document.getElementById('dd-reproche'); if (_re) _re.textContent = c.re || c.q; var _pa = document.getElementById('dd-parties'); if (_pa) _pa.innerHTML = '<b>' + (c.acc || 'La partie plaignante') + '</b> <span style="color:rgba(255,255,255,.4);font-weight:400;">accuse</span> <b>' + (c.def || '') + '</b>';
  document.getElementById('dd-series-tag').textContent = c.t;
  var cn = c.n.split(' vs ');
  document.getElementById('dd-role').textContent = myRole === 'defense' ? 'DÉFENSE — Vous défendez ' + cn[0] : 'ACCUSATION — Vous accusez ' + cn[0];
  document.getElementById('dd-role').style.color = myRole === 'defense' ? '#4ECB71' : '#FF4757';
  go('duel-dossier');
  var tot = c.pt || 120, left = tot;
  clearInterval(prepI);
  uR('dd-ring', 1);
  document.getElementById('dd-timer').textContent = fT(left);
  prepI = setInterval(function() {
    left--;
    if (left <= 0) { clearInterval(prepI); goToSubmit(); return; }
    document.getElementById('dd-timer').textContent = fT(left);
    uR('dd-ring', left / tot);
  }, 1000);
}

function goToSubmit() {
  clearInterval(prepI);
  var c = CASES[curCase];
  var cn = c.n.split(' vs ');
  document.getElementById('ds-arg').value = '';
  document.getElementById('ds-count').textContent = '0 / 300';
  document.getElementById('ds-role2').textContent = myRole === 'defense' ? 'DÉFENSE — Vous défendez ' + cn[0] : 'ACCUSATION — Vous accusez ' + cn[0];
  document.getElementById('ds-role2').style.color = myRole === 'defense' ? '#4ECB71' : '#FF4757';
  document.getElementById('ds-case-name').textContent = c.n;
  go('duel-submit');
  var tot = (c || {}).wt || 120, left = tot;
  clearInterval(prepI);
  uR('ds-ring', 1);
  document.getElementById('ds-timer').textContent = fT(left);
  prepI = setInterval(function() {
    left--;
    if (left <= 0) { clearInterval(prepI); submitArgument(); }
    document.getElementById('ds-timer').textContent = fT(left);
    uR('ds-ring', left / tot);
  }, 1000);
  if (window.db) {
    window.db.ref('rooms/' + currentRoom + '/arguments').on('value', function(s) {
      var a = s.val() || {};
      var opp = myRole === 'defense' ? 'accusation' : 'defense';
      if (a[opp]) { var st = document.getElementById('ds-opp-status'); st.style.display = 'block'; st.textContent = '● Adversaire a soumis !'; }
      if (a.defense) { document.getElementById('dv-def-arg').textContent = a.defense.text; document.getElementById('dv-def-name').textContent = a.defense.name || 'Défense'; }
      if (a.accusation) { document.getElementById('dv-acc-arg').textContent = a.accusation.text; document.getElementById('dv-acc-name').textContent = a.accusation.name || 'Accusation'; }
    });
  }
}

function submitArgument() {
  if (!me.onboarded) { submitOnboarding(); return; }
  clearInterval(prepI);
  var t = cleanMsg(document.getElementById('ds-arg').value.trim() || '(vide)');
  me.duels = (me.duels || 0) + 1;
  saveSession();
  if (window.db) {
    window.db.ref('rooms/' + currentRoom + '/arguments/' + myRole).set({ text: t, uid: myUid, name: me.name || '', ts: Date.now() });
    window.db.ref('users/' + myUid + '/duels').set(me.duels);
    window.db.ref('rooms/' + currentRoom + '/arguments').once('value', function(s) {
      var a = s.val();
      if (a && a.defense && a.accusation) {
        var c = CASES[curCase] || {};
        window.db.ref('public-duels/' + currentRoom).set({ caseName: c.n || '', caseType: c.t || '', question: c.q || '', defense: a.defense, accusation: a.accusation, publishedAt: Date.now(), voteEnds: Date.now() + (c.vd || 10800000) });
      }
    });
  }
  document.getElementById('dv-name').textContent = (CASES[curCase] || {}).n || '';
  go('duel-vote');
  updateDuelVoteActions();
  if(typeof showGuestBanner==='function') showGuestBanner();
}

function vote(side) {
  if (!window.db) return;
  window.db.ref('public-duels/' + currentRoom + '/votes/' + myUid).set({ side: side });
  document.getElementById('dv-buttons').style.display = 'none';
  document.getElementById('dv-voted').style.display = 'block';
}

function selectJudgeVerdict(v) {
  judgeChoice = v;
  document.getElementById('jm-btn-nc').style.borderColor = v === 'NON COUPABLE' ? '#4ECB71' : 'rgba(78, 203, 113, 0.2)';
  document.getElementById('jm-btn-nc').style.background = v === 'NON COUPABLE' ? 'rgba(78, 203, 113, 0.1)' : 'transparent';
  document.getElementById('jm-btn-c').style.borderColor = v === 'COUPABLE' ? '#FF4757' : 'rgba(255, 71, 87, 0.2)';
  document.getElementById('jm-btn-c').style.background = v === 'COUPABLE' ? 'rgba(255, 71, 87, 0.1)' : 'transparent';
}

function judgeDecision() {
  clearInterval(judgeI);
  if (!judgeChoice) { alert('Choisissez Coupable ou Non coupable'); return; }
  var motiv = document.getElementById('jm-motiv').value.trim();
  if (!motiv || motiv.length < 20) { alert('Motivation trop courte (20 car. min)'); return; }
  var c = CASES[curCase];
  waitDb(function() {
    window.db.ref('public-duels/' + curCase + '_judge_' + myUid).set({
      caseName: c.n, caseType: c.t, question: c.q,
      defense: { text: c.bd || '', name: 'Défense', uid: 'sys' },
      accusation: { text: c.ba || '', name: 'Accusation', uid: 'sys' },
      result: { decision: judgeChoice, motivation: motiv, judge: me.name, judgedAt: Date.now() },
      publishedAt: Date.now()
    });
  });
  me.duels = (me.duels || 0) + 1;
  localStorage.setItem('judged_' + curCase, '1');
  saveSession();
  judgeChoice = '';
  go('home');
  buildHome();
}

function doSignup() {
  var n = document.getElementById('su-n').value.trim();
  var e = document.getElementById('su-e').value.trim();
  var p = document.getElementById('su-p').value;
  var cab = document.getElementById('su-cab').value.trim();
  var code = document.getElementById('su-cabcode').value.trim().toUpperCase();
  var err = document.getElementById('su-err');
  if (!n || !e || p.length < 6) { err.style.display = 'block'; err.textContent = 'Remplissez tout (mdp 6 car.)'; err.style.color = '#FF4757'; return; }
  setUid(e);
  me.name = n; me.email = e; me.wins = 0; me.duels = 0;
  if (code) {
    err.style.display = 'block'; err.textContent = 'Recherche du cabinet...'; err.style.color = '#FFD23F';
    waitDb(function() {
      window.db.ref('cabinets').orderByChild('code').equalTo(code).once('value', function(snap) {
        var cabs = snap.val();
        if (!cabs) { err.textContent = 'Code introuvable'; err.style.color = '#FF4757'; return; }
        var cid = Object.keys(cabs)[0];
        var cb = cabs[cid];
        if (cb.members && Object.keys(cb.members).length >= 5) { err.textContent = 'Cabinet complet (max 5)'; err.style.color = '#FF4757'; return; }
        me.cabId = cid; me.cabName = cb.name; me.cabCode = cb.code;
        window.db.ref('cabinets/' + cid + '/members/' + myUid).set({ name: n, joined: Date.now() });
        window.db.ref('users/' + myUid).set({ name: n, email: e, password: hashPwd(p), wins: 0, duels: 0, cabId: cid, cabName: cb.name, cabCode: cb.code, joined: Date.now() });
        err.style.display = 'none'; saveSession(); afterSignup();
      });
    });
    return;
  }
  var cc = genCode();
  var cn = cab || n + ' & associé';
  me.cabCode = cc; me.cabName = cn; me.cabId = myUid;
  saveSession();
  waitDb(function() {
    var mbrs = {}; mbrs[myUid] = { name: n, joined: Date.now() };
    window.db.ref('cabinets/' + myUid).set({ name: cn, code: cc, owner: myUid, members: mbrs });
    window.db.ref('users/' + myUid).set({ name: n, email: e, password: hashPwd(p), wins: 0, duels: 0, cabId: myUid, cabName: cn, cabCode: cc, joined: Date.now() });
  });
  err.style.display = 'none';
  afterSignup();
}


// Après inscription : conversion invité -> home direct, sinon onboarding
function afterSignup() {
  if (window.convertingGuest) {
    window.convertingGuest = false;
    me.onboarded = true;
    saveSession();
    if (window.db) {
      if (me.clientId) window.db.ref('users/' + myUid + '/clientId').set(me.clientId);
      if (me.clientName) window.db.ref('users/' + myUid + '/clientName').set(me.clientName);
    }
    buildHome(); buildProfile();
    go('home');
  } else {
    go('onboarding');
  }
}

function doLogin() {
  var e = document.getElementById('li-e').value.trim();
  var p = document.getElementById('li-p').value;
  var err = document.getElementById('li-err');
  if (!e || p.length < 6) { err.style.display = 'block'; err.textContent = 'Remplissez tout'; err.style.color = '#FF4757'; return; }
  setUid(e);
  var ls = localStorage.getItem('dbrief_user');
  if (ls) {
    try {
      var u = JSON.parse(ls);
      if (u.email === e) { Object.assign(me, u); if (u.uid) myUid = u.uid; buildHome(); buildProfile(); saveSession(); if (urlRoom) handleUrlRoom(); else go('home'); return; }
    } catch(ex) {}
  }
  if (!window.db) {
    err.style.display = 'block'; err.textContent = 'Chargement...'; err.style.color = '#FFD23F';
    var retries = 0;
    var waitDbI = setInterval(function() {
      retries++;
      if (window.db) { clearInterval(waitDbI); tryFirebaseLogin(e, p, err); }
      else if (retries > 30) { clearInterval(waitDbI); err.textContent = 'Réseau indisponible'; err.style.color = '#FF4757'; }
    }, 500);
    return;
  }
  tryFirebaseLogin(e, p, err);
}

function tryFirebaseLogin(e, p, err) {
  err.style.display = 'block'; err.textContent = 'Connexion...'; err.style.color = '#FFD23F';
  window.db.ref('users/' + myUid).once('value', function(snap) {
    var d = snap.val();
    if (d && d.email) {
      if (d.password && d.password !== hashPwd(p)) { err.textContent = 'Mot de passe incorrect'; err.style.color = '#FF4757'; return; }
      me.name = d.name || ''; me.email = d.email; me.wins = d.wins || 0; me.duels = d.duels || 0;
      me.cabId = d.cabId || ''; me.cabName = d.cabName || ''; me.cabCode = d.cabCode || '';
      me.favSeries = d.favSeries || []; me.onboarded = true;
      err.style.display = 'none'; buildHome(); buildProfile(); saveSession();
      if (urlRoom) handleUrlRoom(); else go('home');
    } else {
      window.db.ref('users').orderByChild('email').equalTo(e).once('value', function(snap2) {
        var all = snap2.val();
        if (all) {
          var uid2 = Object.keys(all)[0]; var d2 = all[uid2];
          if (d2.password && d2.password !== hashPwd(p)) { err.textContent = 'Mot de passe incorrect'; err.style.color = '#FF4757'; return; }
          myUid = uid2; me.name = d2.name || ''; me.email = d2.email; me.wins = d2.wins || 0; me.duels = d2.duels || 0;
          me.cabId = d2.cabId || ''; me.cabName = d2.cabName || ''; me.cabCode = d2.cabCode || '';
          me.favSeries = d2.favSeries || []; me.onboarded = true;
          err.style.display = 'none'; buildHome(); buildProfile(); saveSession();
          if (urlRoom) handleUrlRoom(); else go('home');
        } else { err.textContent = 'Compte introuvable'; err.style.color = '#FF4757'; }
      });
    }
  });
}



function syncUnlocks() {
  if (!me.clientId) { if (!me.clients) me.clients = []; return; }
  if (!me.clients || !me.clients.length) { me.clients = [me.clientId]; }
  if (me.clients.indexOf(me.clientId) === -1) { me.clients.unshift(me.clientId); }
  var duels = me.duels || 0;
  var target = Math.min(CLIENTS.length, 1 + Math.floor(duels / 3));
  for (var i = 0; i < CLIENTS.length && me.clients.length < target; i++) {
    if (me.clients.indexOf(CLIENTS[i].id) === -1) { me.clients.push(CLIENTS[i].id); }
  }
  saveSession();
}

function buildClientCollection() {
  syncUnlocks();
  var duels = me.duels || 0;
  var unlockedCount = (me.clients || []).length;
  var grid = document.getElementById('p-clients-grid');
  if (grid) {
    grid.innerHTML = '';
    CLIENTS.forEach(function(c) {
      var unlocked = (me.clients || []).indexOf(c.id) > -1;
      var active = (c.id === me.clientId);
      var el = document.createElement('div');
      el.style.cssText = 'width:56px;text-align:center;cursor:' + (unlocked ? 'pointer' : 'default') + ';opacity:' + (unlocked ? '1' : '.35') + ';';
      if (unlocked) { el.onclick = (function(id){ return function(){ setClient(id); }; })(c.id); }
      var ring = active ? 'box-shadow:0 0 0 2px #FF7A2E;' : '';
      el.innerHTML =
        '<div style="width:48px;height:48px;border-radius:50%;margin:0 auto 5px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#fff;background:linear-gradient(135deg,' + c.c1 + ',' + c.c2 + ');' + ring + '">' + (unlocked ? c.name.substring(0, 2).toUpperCase() : '\uD83D\uDD12') + '</div>' +
        '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,' + (active ? '.8' : '.45') + ');">' + (unlocked ? c.name : '???') + '</div>';
      grid.appendChild(el);
    });
  }
  var dc = document.getElementById('p-duels-count');
  if (dc) dc.textContent = duels;
  var nb = document.getElementById('p-next-bar');
  var nt = document.getElementById('p-next-text');
  if (unlockedCount >= CLIENTS.length) {
    if (nb) nb.style.width = '100%';
    if (nt) nt.textContent = 'Tous vos clients sont débloqués';
  } else {
    var into = duels % 3;
    if (nb) nb.style.width = Math.round(into / 3 * 100) + '%';
    var rem = 3 - into;
    if (nt) nt.textContent = 'Prochain client dans ' + rem + ' affaire' + (rem > 1 ? 's' : '');
  }
}

function setClient(id) {
  if (!me.clients || me.clients.indexOf(id) === -1) return;
  var c = CLIENTS.filter(function(x){ return x.id === id; })[0];
  if (!c) return;
  me.clientId = c.id;
  me.clientName = c.name;
  saveSession();
  if (window.db && me.email) {
    window.db.ref('users/' + myUid + '/clientId').set(c.id);
    window.db.ref('users/' + myUid + '/clientName').set(c.name);
  }
  buildHome();
  buildProfile();
}

function buildProfile() {
  document.getElementById('p-name').textContent = me.name;
  document.getElementById('p-avatar').textContent = (me.name || '?').substring(0, 2).toUpperCase();
  var clEl = document.getElementById('p-client');
  if (clEl) clEl.textContent = me.clientName ? 'Avocat de ' + me.clientName : '';
  buildClientCollection();
  document.getElementById('p-w').textContent = me.wins || 0;
  document.getElementById('p-d').textContent = me.duels || 0;
  document.getElementById('p-r').textContent = me.duels > 0 ? Math.round(me.wins / me.duels * 100) + '%' : '—';
  var ph = document.getElementById('p-history');
  ph.innerHTML = '';
  if (window.db) {
    window.db.ref('rooms').orderByChild('roles/defense/uid').equalTo(myUid).limitToLast(10).once('value', function(s) {
      var d = s.val();
      if (!d) return;
      Object.keys(d).reverse().forEach(function(k) {
        var r = d[k];
        if (!r.roles) return;
        var role = r.roles.defense && r.roles.defense.uid === myUid ? 'Défense' : 'Accusation';
        var cKey = k.split('_')[0];
        var cName = CASES[cKey] ? CASES[cKey].n : k;
        var hi = document.createElement('div');
        hi.style.cssText = 'padding:14px 16px 14px 20px;position:relative;display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:14px;margin-bottom:8px';
        hi.innerHTML = '<div style="position:absolute;left:0;top:10px;bottom:10px;width:3.5px;border-radius:2px;background:' + (role === 'Défense' ? '#4ECB71' : '#FF4757') + '"></div><div><div style="font-size:15px;font-weight:800;color:#F0F0F5">' + cName + '</div><div style="font-size:11px;color:rgba(255,255,255,.25);margin-top:2px">' + role + '</div></div><div style="font-size:12px;font-weight:700;color:#FF7A2E">En cours…</div>';
        ph.appendChild(hi);
      });
    });
  }
}

function loadProfile() {
  if (!window.db) return;
  window.db.ref('users/' + myUid).once('value', function(s) {
    var d = s.val();
    if (d) { me.wins = d.wins || 0; me.duels = d.duels || 0; me.cabName = d.cabName || me.cabName; me.cabCode = d.cabCode || me.cabCode; me.cabId = d.cabId || me.cabId; buildProfile(); }
  });
}

function logout() {
  localStorage.removeItem('dbrief_user');
  me = { name:'', email:'', wins:0, duels:0, cabId:'', cabName:'', cabCode:'', favSeries:[], onboarded:false };
  myUid = 'u' + Math.random().toString(36).substr(2, 9);
  go('splash');
}

function loadPublicDuels() {
  if (!window.db) return;
  window.db.ref('public-duels').orderByChild('publishedAt').limitToLast(30).on('value', function(s) {
    var d = s.val(), feed = document.getElementById('vd-feed');
    feed.innerHTML = '';
    if (!d) { feed.innerHTML = '<div style="text-align:center;padding:60px 24px;color:rgba(255,255,255,.15);font-size:14px">Aucun verdict pour l\'instant.<br>Lance un duel !</div>'; return; }
    Object.keys(d).reverse().forEach(function(k) {
      var v = d[k];
      var cKey = k.split('_')[0];
      var validCase = false;
      for (var ck in CASES) { if (v.caseName === CASES[ck].n || ck === cKey) { validCase = true; break; } }
      if (!validCase) return;
      var votes = v.votes ? Object.keys(v.votes).length : 0;
      var rem = v.voteEnds ? v.voteEnds - Date.now() : 0;
      var isLive = rem > 0;
      var ago = Math.floor((Date.now() - (v.publishedAt || 0)) / 60000);
      var timeStr = ago < 60 ? ago + 'min' : Math.floor(ago / 60) + 'h';
      var defVotes = 0, accVotes = 0;
      if (v.votes) { Object.keys(v.votes).forEach(function(uid) { if (v.votes[uid].side === 'defense') defVotes++; else accVotes++; }); }
      var total = defVotes + accVotes || 1;
      var defPct = Math.round(defVotes / total * 100);
      var accPct = 100 - defPct;
      var card = document.createElement('div');
      card.style.cssText = 'padding:20px;border-bottom:1px solid rgba(255,255,255,.04);position:relative';
      var html = '';
      if (isLive) html += '<div style="position:absolute;top:20px;right:20px;padding:4px 10px;border-radius:10px;background:rgba(255,122,46,.08);border:1px solid rgba(255,122,46,.15);font-size:10px;font-weight:700;color:#FF7A2E">EN COURS</div>';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="font-size:11px;font-weight:800;color:#FF7A2E;letter-spacing:2px">' + (v.caseType || '').toUpperCase() + '</span><span style="font-size:11px;color:rgba(255,255,255,.2)">' + timeStr + '</span></div>';
      html += '<div style="font-size:22px;font-weight:900;color:#fff;margin-bottom:14px;line-height:1.1">' + (v.caseName || '') + '</div>';
      html += '<div style="display:flex;gap:8px;margin-bottom:12px"><div style="flex:1;padding:12px;background:rgba(78,203,113,.04);border:1px solid rgba(78,203,113,.1);border-radius:12px"><div style="font-size:9px;font-weight:800;color:#4ECB71;letter-spacing:2px;margin-bottom:5px">DÉFENSE · ' + (v.defense ? v.defense.name : '—') + '</div><div style="font-size:13px;color:rgba(255,255,255,.4);line-height:1.5">' + (v.defense ? v.defense.text : '...') + '</div></div><div style="flex:1;padding:12px;background:rgba(255,71,87,.04);border:1px solid rgba(255,71,87,.1);border-radius:12px"><div style="font-size:9px;font-weight:800;color:#FF4757;letter-spacing:2px;margin-bottom:5px">ACCUSATION · ' + (v.accusation ? v.accusation.name : '—') + '</div><div style="font-size:13px;color:rgba(255,255,255,.4);line-height:1.5">' + (v.accusation ? v.accusation.text : '...') + '</div></div></div>';
      if (votes > 0) html += '<div style="display:flex;height:4px;border-radius:2px;overflow:hidden;margin-bottom:10px"><div style="width:' + defPct + '%;background:#4ECB71"></div><div style="width:' + accPct + '%;background:#FF4757"></div></div>';
      if (v.result && v.result.decision) { html += '<div style="font-size:22px;font-weight:900;color:' + (v.result.decision === 'COUPABLE' ? '#FF4757' : '#4ECB71') + ';letter-spacing:2px">' + v.result.decision + '</div>'; }
      else if (isLive) { html += '<div style="font-size:13px;color:rgba(255,255,255,.2)">' + defPct + '% Défense · ' + accPct + '% Accusation · ' + votes + ' vote' + (votes > 1 ? 's' : '') + '</div>'; }
      card.innerHTML = html;
      feed.appendChild(card);
    });
  });
}

function loadFeed() {
  if (!window.db) return;
  var fb = document.getElementById('feed-banner');
  if (!fb) return;
  window.db.ref('public-duels').orderByChild('publishedAt').limitToLast(10).once('value', function(s) {
    var d = s.val();
    fb.innerHTML = '';
    if (!d) return;
    Object.keys(d).reverse().forEach(function(k) {
      var v = d[k];
      if (!v.result) return;
      var fi = document.createElement('div');
      fi.className = 'feed-item';
      fi.onclick = function() { switchTab('verdicts'); };
      var ago = Math.floor((Date.now() - (v.publishedAt || 0)) / 60000);
      var timeStr = ago < 60 ? ago + 'min' : Math.floor(ago / 60) + 'h';
      fi.innerHTML = '<div style="font-size:12px;font-weight:800">' + (v.caseName || '') + '</div><div style="font-size:14px;font-weight:900;color:' + (v.result.decision === 'COUPABLE' ? '#FF4757' : '#4ECB71') + '">' + v.result.decision + '</div><div style="font-size:10px;color:#555">il y a ' + timeStr + '</div>';
      fb.appendChild(fi);
    });
  });
}

function initMainApp() {
  try {
    var s = localStorage.getItem('dbrief_user');
    if (s) {
      try {
        var u = JSON.parse(s);
        if (u && u.name && u.email) {
          Object.assign(me, u);
          if (u.uid) myUid = u.uid;
          if (window.firebaseLoaded) {
            loadDuelDuJour(function() {
              buildHome(); buildProfile();
              if (urlRoom) handleUrlRoom(); else go('home');
            });
          } else { go('splash'); }
          return;
        }
      } catch(e) { console.log('Erreur de session :', e); }
    }
    go('splash');
  } catch(e) { console.log('Erreur init :', e); go('splash'); }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(function(err) { console.log('ServiceWorker registration failed: ', err); });
  }
}


// ====================== ESPACE ADMIN ======================
var ADMIN_HASH = "hbr2ezs";
var adminAuthed = false;

function getAdminState() {
  var cases = {}, disabled = [];
  try {
    var ad = ADMIN_DATA || {};
    var adc = ad.cases || {};
    Object.keys(adc).forEach(function(k){ cases[k] = adc[k]; });
    (ad.disabled || []).forEach(function(k){ if (disabled.indexOf(k) < 0) disabled.push(k); });
  } catch(e) {}
  try {
    var lc = JSON.parse(localStorage.getItem('dbrief_admin_cases') || '{}');
    Object.keys(lc).forEach(function(k){ cases[k] = lc[k]; });
    var ld = JSON.parse(localStorage.getItem('dbrief_admin_disabled') || '[]');
    ld.forEach(function(k){ if (disabled.indexOf(k) < 0) disabled.push(k); });
  } catch(e) {}
  return { cases: cases, disabled: disabled };
}

function applyAdminCases() {
  var st = getAdminState();
  Object.keys(st.cases).forEach(function(k){
    var x = st.cases[k];
    CASES[k] = { pt:120, wt:120, vd:10800000, n:x.n, t:x.t, q:(x.q||x.re||x.n), dos:(x.dos||x.q||x.re||''), bd:(x.bd||''), ba:(x.ba||''), jm:!!x.jm, re:(x.re||x.q||''), acc:(x.acc||''), def:(x.def||'') };
  });
  st.disabled.forEach(function(k){ if (CASES[k]) delete CASES[k]; });
}

function rebuildCases() {
  CASES = {};
  Object.keys(ALL_CASES).forEach(function(k){
    CASES[k] = ALL_CASES[k];
    if (CHARGES[k]) { CASES[k].re = CHARGES[k].re; CASES[k].acc = CHARGES[k].acc; CASES[k].def = CHARGES[k].def; }
  });
  applyAdminCases();
  caseKeys = Object.keys(CASES);
  allSeries = [];
  caseKeys.forEach(function(k){ var t = CASES[k].t; if (allSeries.indexOf(t) === -1) allSeries.push(t); });
  try { if (me && me.email) { buildHome(); } } catch(e) {}
}

function openAdminGate() {
  var i = document.getElementById('admin-code-input'); if (i) i.value = '';
  var e = document.getElementById('admin-gate-err'); if (e) e.textContent = '';
  if (adminAuthed) { adminRender(); go('admin'); } else { go('admin-gate'); }
}

function adminCurrentHash() {
  try { var h = localStorage.getItem('dbrief_admin_hash'); if (h) return h; } catch(e) {}
  return ADMIN_HASH;
}

function adminLogin() {
  var v = (document.getElementById('admin-code-input').value || '');
  if (hashPwd(v) === adminCurrentHash()) {
    adminAuthed = true;
    adminRender();
    go('admin');
  } else {
    var e = document.getElementById('admin-gate-err');
    if (e) e.textContent = 'Code incorrect.';
  }
}

function adminExit() {
  try { window.location.hash = ''; } catch(e) {}
  window.location.reload();
}

function adminChangeCode() {
  var n = prompt('Nouveau code d\'acces (stocke sur cet appareil) :');
  if (n && n.length >= 3) {
    try { localStorage.setItem('dbrief_admin_hash', hashPwd(n)); alert('Code mis a jour sur cet appareil.'); } catch(e) {}
  }
}

function setVal(id, v){ var e = document.getElementById(id); if (e) e.value = (v == null ? '' : v); }
function getVal(id){ var e = document.getElementById(id); return e ? (e.value || '') : ''; }

function adminRender() {
  var st = getAdminState();
  var list = document.getElementById('admin-list');
  if (!list) return;
  var union = {};
  Object.keys(ALL_CASES).forEach(function(k){ union[k] = 1; });
  Object.keys(st.cases).forEach(function(k){ union[k] = 1; });
  var h = '';
  Object.keys(union).forEach(function(k){
    var isCustom = !!st.cases[k];
    var isOff = st.disabled.indexOf(k) > -1;
    var c = CASES[k] || ALL_CASES[k] || st.cases[k] || {};
    var ch = CHARGES[k] || {};
    var name = c.n || k;
    var serie = c.t || '';
    var acc = c.acc || ch.acc || '';
    var def = c.def || ch.def || '';
    h += '<div class="adm-row' + (isOff ? ' adm-off' : '') + '">';
    h += '<div style="flex:1;min-width:0;">';
    h += '<div class="adm-tag">' + serie + (isCustom ? ' \u2022 perso' : '') + (isOff ? ' \u2022 masquee' : '') + '</div>';
    h += '<div class="adm-name">' + name + '</div>';
    if (acc || def) h += '<div class="adm-sub">' + acc + ' accuse ' + def + '</div>';
    h += '</div>';
    h += '<div class="adm-btns">';
    h += '<button class="adm-b" onclick="adminEditCase(\'' + k + '\')">Modifier</button>';
    h += '<button class="adm-b" onclick="adminToggleDisable(\'' + k + '\')">' + (isOff ? 'Afficher' : 'Masquer') + '</button>';
    if (isCustom) h += '<button class="adm-b adm-bd" onclick="adminDeleteCase(\'' + k + '\')">Suppr</button>';
    h += '</div></div>';
  });
  list.innerHTML = h;
  var f = document.getElementById('admin-form'); if (f) f.style.display = 'none';
  var x = document.getElementById('admin-export'); if (x) x.style.display = 'none';
}

function adminNewCase() {
  setVal('af-key',''); setVal('af-name',''); setVal('af-serie',''); setVal('af-acc',''); setVal('af-def','');
  setVal('af-q',''); setVal('af-re',''); setVal('af-dos',''); setVal('af-bd',''); setVal('af-ba','');
  var jm = document.getElementById('af-jm'); if (jm) jm.checked = false;
  var t = document.getElementById('admin-form-title'); if (t) t.textContent = 'Nouvelle affaire';
  document.getElementById('admin-form').style.display = 'block';
  document.getElementById('admin-export').style.display = 'none';
  document.getElementById('admin-form').scrollIntoView();
}

function adminEditCase(key) {
  var st = getAdminState();
  var c = st.cases[key] || CASES[key] || ALL_CASES[key] || {};
  var ch = CHARGES[key] || {};
  setVal('af-key', key);
  setVal('af-name', c.n || '');
  setVal('af-serie', c.t || '');
  setVal('af-acc', c.acc || ch.acc || '');
  setVal('af-def', c.def || ch.def || '');
  setVal('af-q', c.q || '');
  setVal('af-re', c.re || ch.re || '');
  setVal('af-dos', c.dos || '');
  setVal('af-bd', c.bd || '');
  setVal('af-ba', c.ba || '');
  var jm = document.getElementById('af-jm'); if (jm) jm.checked = !!c.jm;
  var t = document.getElementById('admin-form-title'); if (t) t.textContent = 'Modifier : ' + (c.n || key);
  document.getElementById('admin-form').style.display = 'block';
  document.getElementById('admin-export').style.display = 'none';
  document.getElementById('admin-form').scrollIntoView();
}

function adminSaveCase() {
  var key = (getVal('af-key') || '').trim().replace(/[^a-zA-Z0-9_]/g, '');
  if (!key) { key = 'perso_' + Date.now().toString(36); }
  var obj = {
    n: getVal('af-name').trim(), t: getVal('af-serie').trim(),
    acc: getVal('af-acc').trim(), def: getVal('af-def').trim(),
    q: getVal('af-q').trim(), re: getVal('af-re').trim(), dos: getVal('af-dos').trim(),
    bd: getVal('af-bd').trim(), ba: getVal('af-ba').trim(),
    jm: document.getElementById('af-jm').checked
  };
  if (!obj.n || !obj.t || !obj.re) { alert('Le nom, la serie et les faits reproches sont obligatoires.'); return; }
  var lc = {}; try { lc = JSON.parse(localStorage.getItem('dbrief_admin_cases') || '{}'); } catch(e) {}
  lc[key] = obj;
  try { localStorage.setItem('dbrief_admin_cases', JSON.stringify(lc)); } catch(e) { alert('Erreur de sauvegarde.'); return; }
  rebuildCases();
  adminRender();
  alert('Affaire enregistree. Apercu actif sur cet appareil.');
}

function adminDeleteCase(key) {
  if (!confirm('Supprimer cette affaire personnalisee ?')) return;
  var lc = {}; try { lc = JSON.parse(localStorage.getItem('dbrief_admin_cases') || '{}'); } catch(e) {}
  if (lc[key]) { delete lc[key]; try { localStorage.setItem('dbrief_admin_cases', JSON.stringify(lc)); } catch(e) {} }
  rebuildCases();
  adminRender();
}

function adminToggleDisable(key) {
  var ld = []; try { ld = JSON.parse(localStorage.getItem('dbrief_admin_disabled') || '[]'); } catch(e) {}
  var i = ld.indexOf(key);
  if (i > -1) { ld.splice(i, 1); } else { ld.push(key); }
  try { localStorage.setItem('dbrief_admin_disabled', JSON.stringify(ld)); } catch(e) {}
  rebuildCases();
  adminRender();
}

function adminExport() {
  var st = getAdminState();
  var code = 'var ADMIN_DATA = ' + JSON.stringify({ cases: st.cases, disabled: st.disabled }) + ';';
  var ta = document.getElementById('admin-export-text'); if (ta) ta.value = code;
  document.getElementById('admin-export').style.display = 'block';
  document.getElementById('admin-form').style.display = 'none';
  document.getElementById('admin-export').scrollIntoView();
}

