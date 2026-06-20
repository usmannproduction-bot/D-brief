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
  {id:'ebony',name:'Ebony',serie:'Nemesis',sig:'nemesis1',c1:'#2A0818',c2:'#5A1038'},
  {id:'franklin',name:'Franklin',serie:'Snowfall',sig:'snowfall1',c1:'#3A0F08',c2:'#9A2D14'},
  {id:'nahwajin',name:'Na Hwa-jin',serie:'Que ça vous serve de leçon',sig:'leconkr1',c1:'#18202E',c2:'#384E72'}
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
  return String(t).replace(/<[^>]*>/g, '').substring(0, 5000);
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
        '<div style="display:inline-block;padding:5px 14px;border-radius:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);font-size:11px;font-weight:800;color:rgba(255,255,255,.4);letter-spacing:2px;">' + c.t.toUpperCase() + badge + '</div>' +
      '</div>' +
      '<div style="font-size:36px;font-weight:900;color:#F0F0F5;line-height:1.1;margin-bottom:14px;position:relative">' + c.n + '</div>' +
      '<div style="font-size:15px;color:rgba(255,255,255,.35);line-height:1.6;margin-bottom:32px;position:relative">' + c.q + '</div>' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;position:relative">' +
        '<div style="flex:1;height:1px;background:rgba(255,255,255,0.07)"></div>' +
        '<div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.12);letter-spacing:3px">' + (c.jm ? 'RENDRE UN VERDICT' : 'CHOISIS TON CAMP') + '</div>' +
        '<div style="flex:1;height:1px;background:rgba(255,255,255,0.07)"></div>' +
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
  document.getElementById('ds-count').textContent = '0 caractères';
  var cn = c.n.split(' vs ');
  document.getElementById('ds-role2').textContent = 'DÉFENSE — Vous défendez ' + cn[1];
  document.getElementById('ds-role2').style.color = '#4ECB71';
  document.getElementById('ds-case-name').textContent = c.n;
  document.getElementById('ds-opp-status').style.display = 'none';
  go('duel-submit');
  renderArgPicker();
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
  listenVerdictGauge();
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
  var nextBtn = document.getElementById('dv-next');
  var acctBtn = document.getElementById('dv-account');
  if (nextBtn) nextBtn.style.display = 'block';
  if (acctBtn) acctBtn.style.display = 'none';
}

function leaveDuel() {
  clearInterval(prepI);
  clearTimeout(botTimer);
  clearInterval(judgeI);
  if (typeof ldTimer !== 'undefined' && ldTimer) { clearInterval(ldTimer); ldTimer = null; }
  if (window._ldRef) { try { window._ldRef.off(); } catch(e){} window._ldRef = null; }
  if (typeof hideLiveVerdict === 'function') hideLiveVerdict();
  if (window._vgRef) { try { window._vgRef.off(); } catch(e){} window._vgRef = null; }
  currentRoom = null;
  curCase = '';
  myRole = '';
  if (!me.onboarded) { buildSeriesGrid(); go('series-select'); return; }
  buildHome(); go('home');
}

function joinDuelAs(id, role) { myRole = role; joinDuel(id); }

// ===== Inviter un ami : partage du lien de la salle =====
function shareRoom() {
  var room = currentRoom, cs = curCase;
  if (!room || !cs) { alert("Le duel n'est pas encore prêt — patiente une seconde."); return; }
  var base = window.location.origin + window.location.pathname;
  var url = base + '?room=' + encodeURIComponent(room) + '&case=' + encodeURIComponent(cs);
  var cName = (CASES[cs] && CASES[cs].n) ? CASES[cs].n : '';
  var txt = "Affronte-moi en duel sur D'brief" + (cName ? ' \u2014 ' + cName : '') + ' !';
  if (navigator.share) {
    navigator.share({ title: "D'brief", text: txt, url: url }).catch(function(){});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function(){ alert('Lien copié ! Envoie-le à ton adversaire.'); }, function(){ window.prompt('Copie ce lien et envoie-le :', url); });
  } else {
    window.prompt('Copie ce lien et envoie-le :', url);
  }
}

// ===== Rejoindre une salle via le lien (?room=...&case=...) =====
function handleUrlRoom() {
  var qs = new URLSearchParams(window.location.search);
  var room = qs.get('room');
  var cs = qs.get('case');
  if (!room || !window.db) { go('home'); return; }
  currentRoom = room;
  window.db.ref('rooms/' + room).once('value', function(snap) {
    var rm = snap.val() || {};
    if (!cs) cs = rm.caseId || '';
    if (!cs || !CASES[cs]) { alert("Ce duel n'est plus disponible."); currentRoom = null; go('home'); return; }
    curCase = cs;
    var roles = rm.roles || {};
    var myR = roles.defense ? (roles.accusation ? null : 'accusation') : 'defense';
    if (!myR) { alert('Ce duel est déjà complet.'); currentRoom = null; go('home'); return; }
    myRole = myR;
    var c = CASES[cs];
    document.getElementById('dw-series').textContent = c.t.toUpperCase();
    document.getElementById('dw-name').textContent = c.n;
    document.getElementById('dw-q').textContent = c.q;
    document.getElementById('dw-av-def').textContent = '?';
    document.getElementById('dw-av-acc').textContent = '?';
    document.getElementById('dw-name-def').textContent = 'En attente\u2026';
    document.getElementById('dw-name-acc').textContent = 'En attente\u2026';
    document.getElementById('dw-status').textContent = 'Connexion au duel\u2026';
    document.getElementById('dw-myrole').style.display = 'none';
    go('duel-wait');
    window.db.ref('rooms/' + room + '/roles/' + myR).set({ uid: myUid, name: me.name || '' });
    window.db.ref('rooms/' + room + '/caseId').set(cs);
    if (myR === 'defense') { updateVs(); } else { updateVsAcc(); }
    window.db.ref('matchmaking/' + cs).remove();
    window.db.ref('rooms/' + room + '/roles').on('value', function(snap2) {
      var r = snap2.val() || {};
      if (r.defense) {
        document.getElementById('dw-av-def').textContent = (r.defense.name || '?').substring(0, 2).toUpperCase();
        document.getElementById('dw-av-def').style.borderStyle = 'solid';
        document.getElementById('dw-name-def').textContent = r.defense.name || '';
      }
      if (r.accusation) {
        var ae = document.getElementById('dw-av-acc');
        ae.textContent = (r.accusation.name || '?').substring(0, 2).toUpperCase();
        ae.style.borderStyle = 'solid'; ae.style.borderColor = '#FF4757'; ae.style.color = '#FF4757';
        document.getElementById('dw-name-acc').textContent = r.accusation.name || '';
      }
      document.getElementById('dw-count').textContent = ((r.defense ? 1 : 0) + (r.accusation ? 1 : 0)) + ' personne(s)';
      if (r.defense && r.accusation) {
        document.getElementById('dw-status').textContent = 'Duel prêt!';
        setTimeout(startDuel, 1500);
      }
    });
  });
}

// ===== Jauge de verdict en direct (style démo) =====
function listenVerdictGauge() {
  if (!window.db || !currentRoom) return;
  if (window._vgRef) { try { window._vgRef.off(); } catch(e){} }
  window._vgRef = window.db.ref('public-duels/' + currentRoom + '/votes');
  window._vgRef.on('value', function(s) {
    var v = s.val() || {}, ks = Object.keys(v), def = 0, acc = 0;
    for (var i = 0; i < ks.length; i++) { if (v[ks[i]] && v[ks[i]].side === 'defense') def++; else acc++; }
    var tot = def + acc, pct = tot ? Math.round(def / tot * 100) : 50;
    var fill = document.getElementById('dvg-fill'); if (fill) fill.style.width = pct + '%';
    var dd = document.getElementById('dvg-d'); if (dd) dd.textContent = pct + '%';
    var da = document.getElementById('dvg-a'); if (da) da.textContent = (100 - pct) + '%';
    var info = document.getElementById('dv-vote-info'); if (info) info.textContent = tot + ' vote' + (tot > 1 ? 's' : '');
  });
}

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
  document.getElementById('ds-count').textContent = '0 caractères';
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
  var tot = 60, left = tot;
  clearInterval(prepI);
  uR('dd-ring', 1);
  document.getElementById('dd-timer').textContent = fT(left);
  prepI = setInterval(function() {
    left--;
    if (left <= 0) { clearInterval(prepI); startLiveDuel(); return; }
    document.getElementById('dd-timer').textContent = fT(left);
    uR('dd-ring', left / tot);
  }, 1000);
}

var DA_E="#ff4e8a", DA_L="#5b8def", DA_A="#ff7a2e", DA_T="#a24bfa";
var DUEL_ARGS = {
  ghost_power:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Tout ce qu'il a bâti, il l'a bâti pour offrir aux siens la vie propre qu'on lui refusait. Le condamner, c'est condamner un homme d'avoir voulu sortir sa famille de la rue."},{lab:"La logique",c:DA_L,prev:"Pas un ordre signé, pas une arme à sa main. Vous le jugez sur ce qu'il représente, jamais sur ce qu'on peut prouver."},{lab:"La comparaison",c:DA_T,prev:"Montrez-moi, dans ce milieu, un seul homme aux mains plus propres. Vous n'en trouverez pas — et pourtant lui seul est au banc."}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"Comptez les corps autour de lui : un associé, une amie, presque sa propre femme. Chaque mort porte sa signature, toutes au nom du même trône."},{lab:"Le retournement",c:DA_T,prev:"Sa famille ? Il a fait de son propre fils un meurtrier. On ne protège pas les siens en les jetant dans le sang."},{lab:"La péroraison",c:DA_A,prev:"Tuer pour garder son empire, ce n'est pas aimer. C'est régner. Et un roi qui sacrifie ses sujets n'a jamais aimé personne."}]},
  walter1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Un homme condamné par le cancer, qui ne voulait qu'une chose : ne pas laisser les siens sans rien. La peur de mourir fait basculer même les justes."},{lab:"La comparaison",c:DA_T,prev:"La dose était calculée pour que l'enfant survive. Un monstre n'aurait jamais compté les milligrammes."},{lab:"Le doute",c:DA_L,prev:"Vous voyez Heisenberg. Moi je vous montre un prof de chimie humilié, terrifié, qui n'a jamais rien voulu de tout cela au départ."}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"Il a empoisonné un enfant de huit ans, puis regardé Jesse s'effondrer en sachant qu'il en était la cause. Aucune famille ne justifie cela."},{lab:"Le retournement",c:DA_T,prev:"Il l'a avoué lui-même, à la fin : il l'a fait parce qu'il aimait ça. La famille n'était qu'un alibi qu'il se racontait."},{lab:"L'attaque",c:DA_A,prev:"Il a regardé Jane mourir sans lever le petit doigt. Voilà l'homme qu'on nous demande d'excuser."}]},
  lupin1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Son père est mort en prison pour un vol qu'il n'avait pas commis. Assane ne fait que rendre à un innocent l'honneur que la justice lui a volé."},{lab:"La logique",c:DA_L,prev:"Pas une goutte de sang en toute une vie. Son seul crime, c'est d'être plus malin que ceux qui l'ont brisé."},{lab:"La comparaison",c:DA_T,prev:"Quand la justice protège le puissant et enterre le faible, qui blâmer celui qui rétablit l'équilibre à sa façon ?"}],acc:[{lab:"La logique",c:DA_L,reco:true,prev:"La douleur n'a jamais effacé un délit. Aussi belle soit l'histoire, un voleur reste un voleur devant la loi."},{lab:"L'attaque",c:DA_A,prev:"Sa vengeance, il l'a payée avec la sécurité de sa femme et de son fils. Les vrais innocents de cette affaire, ce sont eux."},{lab:"Le juré",c:DA_T,prev:"S'il suffit d'avoir souffert pour se placer au-dessus des lois, alors plus aucune loi ne tient. Où s'arrête-t-on ?"}]},
  topboy1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"La rue l'a élevé sans rien lui offrir qu'un seul code : tu obéis ou tu meurs. On ne juge pas un homme aux règles d'un monde qu'on ne lui a pas laissé choisir."},{lab:"La logique",c:DA_L,prev:"L'ordre venait d'au-dessus de lui. Refuser, c'était sa propre mort — et celle de bien d'autres."},{lab:"La comparaison",c:DA_T,prev:"Combien, nés dans ce béton, auraient survécu les mains pures ? Lui au moins n'a jamais menti sur ce qu'il était."}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"Il a regardé Jamie dans les yeux — un homme qui essayait juste de sauver ses frères — et il a tiré. Aaron n'a plus de frère à cause de ce code."},{lab:"La logique",c:DA_T,prev:"Le code de la rue n'est pas une loi. C'est l'excuse que se donnent ceux qui ont choisi de tuer."},{lab:"L'attaque",c:DA_A,prev:"Il a le choix. Il l'a toujours eu. Et chaque fois, il choisit la gâchette."}]},
  tommy1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Il a sorti les Shelby de la boue et les a hissés là où personne ne les croyait capables d'aller. Ce sang, c'était le prix d'une famille qui ne manquerait plus jamais."},{lab:"La logique",c:DA_L,prev:"Un survivant des tranchées joue les cartes qu'on lui a données. Reprochez la guerre à ceux qui l'ont déclenchée, pas à celui qui en est revenu."},{lab:"La comparaison",c:DA_T,prev:"Quel chef, à cette époque, dans ce monde, a gardé les mains propres ? Aucun. Lui au moins savait pourquoi il se battait."}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"Il a vu Arthur se noyer dans la drogue et la violence, et il a continué à lui confier les sales besognes — parce qu'Arthur était utile."},{lab:"L'attaque",c:DA_A,prev:"Chaque Shelby saigne pour SES guerres, SES ambitions. Une famille n'est pas un champ de bataille où l'on jette les siens."},{lab:"La péroraison",c:DA_T,prev:"Élever les siens, ce n'est pas les broyer un à un pour garder son trône. Cela porte un nom : la tyrannie."}]},
  snowfall1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Un gamin brillant à qui l'Amérique avait fermé toutes les portes. Il a saisi la seule ouverture qu'on lui laissait — celle qu'on avait déposée dans son quartier."},{lab:"La logique",c:DA_L,prev:"Le crack n'est pas venu de lui, mais de forces immenses qui le dépassaient. S'il avait refusé, un autre aurait vendu à sa place."},{lab:"Le doute",c:DA_T,prev:"Il n'a jamais haï South Central. Il a voulu en sortir, et en sortir les siens. Est-ce vraiment cela, trahir ?"}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"Il savait, mieux que quiconque, ce que le crack ferait aux familles de ses voisins. Il l'a vendu quand même, et s'est enrichi sur leurs ruines."},{lab:"La logique",c:DA_T,prev:"Il avait l'intelligence de réussir cent autres façons. Il a choisi celle qui détruisait les siens."},{lab:"La péroraison",c:DA_A,prev:"Bâtir son empire sur les cendres de son propre quartier, ce n'est pas survivre. C'est trahir tout ce qui vous a fait."}]},
  valide1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Sorti de la galère à la force du poignet, il s'est juré de ne jamais y retomber. Dans ce milieu, la moindre faiblesse et tu disparais."},{lab:"La logique",c:DA_L,prev:"Personne ne reste au sommet du rap par sentimentalisme. Il a fait ce que le jeu exige de quiconque veut y survivre."},{lab:"La comparaison",c:DA_T,prev:"Qui, arrivé tout en haut après être parti de rien, n'a jamais dû couper un lien pour ne pas tomber ?"}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"William l'a fait. Il l'a lancé, cru, porté. Et Apash l'a renié dès que sa lumière a commencé à gêner la sienne."},{lab:"La logique",c:DA_T,prev:"La gloire n'a jamais justifié la trahison. Un homme qui vend celui qui l'a fait peut vendre n'importe qui."},{lab:"La péroraison",c:DA_A,prev:"Ce n'est pas le milieu qui l'a changé. C'est lui qui a choisi son ego avant sa parole."}]},
  annalise1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Elle leur a offert ce qu'aucune fac ne donnera jamais : la vérité crue du droit, et sa protection, encore et encore, au péril de sa propre vie."},{lab:"La logique",c:DA_L,prev:"Ce sont eux qui ont agi, eux qui ont franchi la ligne. Elle n'a fait que tenter de limiter le désastre qu'ils avaient déclenché."},{lab:"Le doute",c:DA_T,prev:"Une femme brisée, qui sombre, et qui se relève malgré tout pour ne pas les abandonner. Est-ce vraiment cela, une manipulatrice ?"}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"Elle a recruté des étudiants vulnérables, les a rendus complices de meurtres, puis s'est servie de leur loyauté comme d'un bouclier."},{lab:"La logique",c:DA_T,prev:"Chaque fois que cela la menace, elle les expose pour se sauver, elle. Une mentor protège — elle, elle sacrifie."},{lab:"L'attaque",c:DA_A,prev:"Ceux qu'elle devait élever vers le droit, elle les a salis à jamais. On ne s'en relève pas."}]},
  sakho1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Il enfreint les règles pour sauver des vies que la procédure laisserait mourir. Face à des coupables que la loi protège, il est le dernier rempart."},{lab:"La logique",c:DA_L,prev:"Un système imparfait laisse filer les vrais criminels. Un flic qui joue selon leurs règles est parfois le seul qui puisse les arrêter."},{lab:"La comparaison",c:DA_T,prev:"Quel grand enquêteur n'a jamais contourné une règle pour atteindre la vérité ? Le résultat lui donne raison."}],acc:[{lab:"La logique",c:DA_L,reco:true,prev:"Le jour où chaque flic décide seul quelles lois il respecte, il n'y a plus de loi — il n'y a que des hommes armés qui se croient justes."},{lab:"L'attaque",c:DA_A,prev:"Il s'introduit, il intimide, il manipule. Et il entraîne dans ses transgressions ceux qui ont le malheur de le suivre."},{lab:"La péroraison",c:DA_T,prev:"La vérité n'a jamais autorisé le mépris du droit. Un policier au-dessus des lois n'est plus un policier."}]},
  nemesis1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Une femme qui découvre l'homme de sa vie sous un autre visage, et doit choisir entre le détruire ou protéger ce qui lui reste. Qui trancherait sans trembler ?"},{lab:"La logique",c:DA_L,prev:"Sans preuve, parler n'aurait rien sauvé — cela n'aurait fait que tout détruire, sa famille la première."},{lab:"Le doute",c:DA_T,prev:"Elle n'a pas couvert un crime. Elle a porté seule un secret qui la rongeait, parce qu'elle n'avait personne à qui le confier."}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"Elle a écouté Candice lui parler de son mari brisé par cette enquête — et elle a souri. Elle savait. Ce silence porte un nom."},{lab:"La logique",c:DA_T,prev:"Savoir et se taire, ce n'est pas de l'amour. C'est de la complicité, choisie en connaissance de cause."},{lab:"La péroraison",c:DA_A,prev:"Protéger un coupable par confort, c'est trahir chacune de ses victimes."}]},
  leconkr1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Quand le harcèlement pousse des enfants au désespoir et que les adultes sont impuissants, l'inaction tue. Lui agit, et rend leur sécurité à ceux que la terreur écrasait."},{lab:"La logique",c:DA_L,prev:"Face à des bourreaux que rien n'arrête, la douceur ne sauve personne. Parfois, seule la fermeté fait reculer la violence."},{lab:"Le doute",c:DA_T,prev:"Il n'aime pas la violence : il la retourne contre ceux qui en abusent. Devant un enfant tabassé, resteriez-vous les bras croisés ?"}],acc:[{lab:"La logique",c:DA_L,reco:true,prev:"Combattre la violence par la violence, c'est la nourrir. Qui affronte les monstres avec leurs armes finit toujours par leur ressembler."},{lab:"L'attaque",c:DA_A,prev:"Il frappe et humilie des adolescents avec le mandat de l'État. Ce n'est pas de la justice : c'est un abus de pouvoir institutionnalisé."},{lab:"La péroraison",c:DA_T,prev:"Aucune fin ne justifie qu'un adulte mandaté lève la main sur un enfant. La peur n'a jamais été la justice."}]},
  blood1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Kola était un homme violent qui aurait fini par tuer Kemi. Dans l'urgence et la terreur, Sarah n'a pensé qu'à une chose : sauver son amie."},{lab:"La logique",c:DA_L,prev:"C'était lui ou elle. La légitime défense n'est pas un crime — c'est le réflexe de qui veut vivre."},{lab:"Le doute",c:DA_T,prev:"Qui, terrifié, le corps encore tremblant, raisonnerait parfaitement dans l'instant ? Elle a paniqué, elle n'a pas calculé."}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"Elle a menti à Kemi pendant des semaines, l'a transformée en fugitive, en complice d'un crime qu'elle n'avait pas commis."},{lab:"La logique",c:DA_T,prev:"Pour échapper aux conséquences, elle a fait porter le poids de son acte à la seule personne qui lui faisait confiance."},{lab:"La péroraison",c:DA_A,prev:"Sauver sa peau en enchaînant son amie à un secret capable de la détruire — cela, c'est impardonnable."}]},
  maitresse1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Elle n'a fait aucune promesse, juré aucune fidélité. Elle a aimé un homme venu à elle. Le serment brisé, c'est lui qui l'avait fait."},{lab:"La logique",c:DA_L,prev:"Ce n'est pas elle qui devait loyauté à Dialika. On ne peut trahir un pacte qu'on n'a jamais signé."},{lab:"Le doute",c:DA_T,prev:"Choisit-on vraiment de qui l'on tombe amoureux ? Si le cœur obéissait à nos principes, il n'y aurait jamais de drame."}],acc:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Une épouse, des enfants, un foyer — et elle s'y est installée en sachant exactement ce qu'elle brisait."},{lab:"La logique",c:DA_L,prev:"Elle savait qu'il était marié. Elle a choisi de continuer. La liberté s'arrête où elle détruit sciemment la vie d'une autre."},{lab:"La péroraison",c:DA_A,prev:"Aimer n'a jamais autorisé à bâtir son bonheur sur les ruines d'une famille."}]},
  who2:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Il porte peut-être seul une vérité si lourde qu'il refuse de l'imposer aux autres. Se taire, parfois, c'est protéger plus que parler."},{lab:"La logique",c:DA_L,prev:"Révéler sa source mettrait le groupe entier en danger. Son silence n'est pas un calcul : c'est un bouclier."},{lab:"Le doute",c:DA_T,prev:"Être plus lucide que les autres, est-ce un crime ? On lui reproche une intelligence qu'on aimerait avoir."}],acc:[{lab:"La logique",c:DA_L,reco:true,prev:"Il sait toujours avant tout le monde, et ne dit jamais d'où cela vient. Diriger par le secret, ce n'est pas guider : c'est manipuler."},{lab:"L'attaque",c:DA_A,prev:"Ce savoir lui donne l'ascendant sur le groupe — et il garde jalousement la seule chose qui pourrait l'expliquer."},{lab:"La péroraison",c:DA_T,prev:"Un homme qui cache l'origine de son pouvoir règne par la peur, pas par la confiance."}]},
  nuitdesrois1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Sans ce rituel, la MACA sombrerait dans la violence brute. Il a transformé un enfer où l'on s'entretue en un monde où la parole, au moins, a une valeur."},{lab:"La logique",c:DA_L,prev:"Dans une jungle sans loi, seul un ordre fort empêche le chaos. Roi d'un tel lieu, qui gouvernerait par la douceur ?"},{lab:"Le doute",c:DA_T,prev:"Il n'a pas vraiment choisi ce pouvoir. Il en porte le poids, et avec lui le fragile équilibre d'un monde que personne d'autre ne tient."}],acc:[{lab:"L'attaque",c:DA_A,reco:true,prev:"Il a inventé une tradition sur mesure pour se donner un droit de vie et de mort. La coutume n'est que le masque de sa domination."},{lab:"La logique",c:DA_L,prev:"Chaque nuit, un homme doit raconter ou mourir. Voilà le prix de son trône : une vie suspendue à son bon vouloir."},{lab:"La péroraison",c:DA_T,prev:"Régner par la terreur en l'appelant tradition, cela reste régner par la terreur."}]},
  heritage1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Au cœur du deuil, quelqu'un devait protéger le patrimoine que le fils, effondré, ne pouvait gérer. Il a tenu ce rôle ingrat dont personne ne voulait."},{lab:"La logique",c:DA_L,prev:"Gérer n'est pas voler. Il a préservé l'ensemble du bien le temps que la famille se relève — rien n'a disparu."},{lab:"Le doute",c:DA_T,prev:"On l'accuse parce qu'il est resté quand tout le monde fuyait. La prudence d'un gardien ressemble parfois, de loin, à une mainmise."}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"Il a attendu que son frère soit en terre pour mettre la main sur ce qu'il n'avait jamais obtenu de son vivant."},{lab:"La logique",c:DA_T,prev:"Le deuil d'un fils n'a jamais fait de lui un incapable. Cette gestion, c'est une dépossession déguisée en prudence."},{lab:"La péroraison",c:DA_A,prev:"Profiter de la douleur d'un endeuillé pour capter son héritage, aucun lien de sang ne l'excuse."}]},
  tag1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Son talent, c'est tout ce que la rue lui a donné. C'est par le ballon qu'il existe — lui retirer son jeu, c'est lui retirer sa voix."},{lab:"La logique",c:DA_L,prev:"Ce sont ses dribbles, ses buts, qui gagnent les matchs. Sans son génie, cette équipe n'aurait jamais rien gagné du tout."},{lab:"La comparaison",c:DA_T,prev:"Tous les grands joueurs ont eu cette part d'ego. C'est le moteur qui les pousse à oser ce que personne d'autre ne tente."}],acc:[{lab:"L'attaque",c:DA_A,reco:true,prev:"Il préfère rater un dribble impossible que réussir une passe simple. Il confond son talent avec le droit d'ignorer ses coéquipiers."},{lab:"La logique",c:DA_L,prev:"Un match se gagne à onze. Le génie qui joue seul fait perdre toute l'équipe — talent ou pas."},{lab:"La péroraison",c:DA_T,prev:"Faire passer son show personnel avant les siens, ce n'est pas du talent. C'est de l'égoïsme."}]},
  dinercon1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Pignon n'a jamais voulu nuire. À chaque catastrophe, il croyait sincèrement aider. On ne condamne pas un homme pour la pureté maladroite de ses intentions."},{lab:"La logique",c:DA_L,prev:"C'est Brochant qui a monté ce dîner cruel pour se moquer de lui. Le piège s'est refermé sur son auteur — pas sur sa victime."},{lab:"Le doute",c:DA_T,prev:"Un homme de bonne foi, naïf, qu'on a invité pour rire de lui. Le vrai con de l'histoire est-il vraiment celui qu'on croit ?"}],acc:[{lab:"Les faits",c:DA_L,reco:true,prev:"En quelques heures : la femme de Brochant en fuite, le fisc alerté, une maîtresse débarquée. La bonne intention n'efface pas l'ampleur des dégâts."},{lab:"La logique",c:DA_T,prev:"À un moment, l'incompétence qui détruit tout sur son passage fait autant de mal qu'une vraie méchanceté."},{lab:"La péroraison",c:DA_A,prev:"Vouloir bien faire ne suffit pas quand on laisse un champ de ruines derrière soi."}]},
  bloom1:{def:[{lab:"L'émotion",c:DA_E,reco:true,prev:"Elle a grandi en se croyant ordinaire, puis a découvert un destin qu'elle n'avait pas demandé. Elle aurait pu fuir. Elle a choisi de se battre."},{lab:"La logique",c:DA_L,prev:"On ne choisit pas son sang. On choisit ce qu'on en fait. Bloom a assumé une responsabilité que beaucoup auraient refusée."},{lab:"Le doute",c:DA_T,prev:"Lui reprocher ses origines, est-ce juste ? Le mérite, ce n'est pas d'où l'on part, c'est ce qu'on décide d'affronter."}],acc:[{lab:"La logique",c:DA_L,reco:true,prev:"Elle débarque sans formation, sans effort, et s'impose comme la plus puissante grâce à sa seule naissance. C'est le privilège déguisé en destin."},{lab:"L'attaque",c:DA_A,prev:"Tout ce qu'elle a, elle le doit au hasard de son sang, pas à son travail. Et elle se pare pourtant d'une grandeur qu'elle n'a pas gagnée."},{lab:"La péroraison",c:DA_T,prev:"Une héroïne qui hérite de sa gloire au lieu de la conquérir incarne exactement ce que le mérite devrait combattre."}]}
};

var plSelected = [];
var PL_MAX = 5;
function colForLab(lab){
  var l = (lab || '').toLowerCase();
  if (l.indexOf('motion') > -1) return '#FF4E8A';
  if (l.indexOf('logique') > -1 || l.indexOf('fait') > -1) return '#3A7BD5';
  if (l.indexOf('attaque') > -1 || l.indexOf('frontale') > -1 || l.indexOf('roraison') > -1) return '#FF7A2E';
  if (l.indexOf('jur') > -1 || l.indexOf('doute') > -1 || l.indexOf('retournement') > -1 || l.indexOf('comparaison') > -1 || l.indexOf('aveu') > -1) return '#A24BFA';
  return '#FF7A2E';
}
function plData(){
  if (typeof DUEL_ARGS === 'undefined' || !DUEL_ARGS[curCase]) return null;
  var key = (myRole === 'accusation') ? 'acc' : 'def';
  return DUEL_ARGS[curCase][key] || null;
}
var pickedArg = -1;
function renderArgPicker(){
  pickedArg = -1;
  var data = plData();
  var pool = document.getElementById('pl-pool');
  var fb = document.getElementById('pl-fallback');
  document.getElementById('pl-title').textContent = (myRole === 'accusation') ? 'VOTRE RÉQUISITOIRE' : 'VOTRE PLAIDOIRIE';
  document.getElementById('ds-arg').value = '';
  var comp = document.getElementById('pl-compose'); if (comp) comp.style.display = 'none';
  var mt = document.getElementsByClassName('pl-meter')[0]; if (mt) mt.style.display = 'none';
  var hd = document.getElementsByClassName('pl-head')[0]; if (hd) hd.style.display = 'none';
  var lbl = document.getElementById('pl-pool-label');
  if (!data || !data.length) {
    pool.style.display = 'none';
    if (lbl) lbl.style.display = 'none';
    fb.style.display = 'block'; fb.value = '';
    return;
  }
  fb.style.display = 'none';
  if (lbl) { lbl.style.display = 'block'; lbl.textContent = (myRole === 'accusation') ? 'CHOISISSEZ VOTRE CHARGE' : 'CHOISISSEZ VOTRE PLAIDOIRIE'; }
  pool.style.display = 'flex';
  pool.className = 'pl-pool dd-cards';
  pool.innerHTML = '';
  for (var i = 0; i < data.length; i++) {
    (function(arg, idx){
      var col = arg.c || colForLab(arg.lab);
      var el = document.createElement('button');
      el.type = 'button';
      el.className = 'dd-card' + (arg.reco ? ' reco' : '');
      el.innerHTML = '<span class="dd-bar" style="background:' + col + '"></span><span class="dd-lab" style="color:' + col + '">' + arg.lab + '</span><span class="dd-prev">' + arg.prev + '</span>' + (arg.reco ? '<span class="dd-tag">Recommandé</span>' : '<span class="dd-chev">\u203A</span>');
      el.onclick = function(){ pickArg(idx, el, arg); };
      pool.appendChild(el);
    })(data[i], i);
  }
}
function pickArg(idx, el, arg){
  pickedArg = idx;
  var all = document.getElementById('pl-pool').children;
  for (var k = 0; k < all.length; k++){ all[k].className = all[k].className.replace(/ picked/g, ''); }
  if (el.className.indexOf('picked') === -1) el.className += ' picked';
  document.getElementById('ds-arg').value = arg.prev;
}
function defaultArgText(){
  var data = plData(); if (!data || !data.length) return '';
  for (var i = 0; i < data.length; i++){ if (data[i].reco) return data[i].prev; }
  return data[0].prev;
}
function plToggle(){}
function plRemove(){}
function plRenderCompose(){}

function goToSubmit() {
  clearInterval(prepI);
  var c = CASES[curCase];
  var cn = c.n.split(' vs ');
  document.getElementById('ds-arg').value = '';
  document.getElementById('ds-count').textContent = '0 caractères';
  document.getElementById('ds-role2').textContent = myRole === 'defense' ? 'DÉFENSE — Vous défendez ' + cn[0] : 'ACCUSATION — Vous accusez ' + cn[0];
  document.getElementById('ds-role2').style.color = myRole === 'defense' ? '#4ECB71' : '#FF4757';
  document.getElementById('ds-case-name').textContent = c.n;
  go('duel-submit');
  renderArgPicker();
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
  var raw = document.getElementById('ds-arg').value.trim();
  if (!raw && typeof defaultArgText === 'function') raw = defaultArgText();
  var t = cleanMsg(raw || '(vide)');
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
  listenVerdictGauge();
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
    buildSeriesGrid(); go('series-select');
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
        hi.style.cssText = 'padding:14px 16px 14px 20px;position:relative;display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:14px;margin-bottom:8px';
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
      card.style.cssText = 'padding:20px;border-bottom:1px solid rgba(255,255,255,0.06);position:relative';
      var html = '';
      if (isLive) html += '<div style="position:absolute;top:20px;right:20px;padding:4px 10px;border-radius:10px;background:rgba(255,122,46,.08);border:1px solid rgba(255,122,46,.15);font-size:10px;font-weight:700;color:#FF7A2E">EN COURS</div>';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="font-size:11px;font-weight:800;color:#FF7A2E;letter-spacing:2px">' + (v.caseType || '').toUpperCase() + '</span><span style="font-size:11px;color:rgba(255,255,255,.2)">' + timeStr + '</span></div>';
      html += '<div style="font-size:22px;font-weight:900;color:#F0F0F5;margin-bottom:14px;line-height:1.1">' + (v.caseName || '') + '</div>';
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
        if (u && u.name) {
          Object.assign(me, u);
          if (u.uid) myUid = u.uid;
          if (window.firebaseLoaded) {
            loadDuelDuJour(function() {
              buildHome(); buildProfile();
              if (urlRoom) handleUrlRoom();
              else if (!me.onboarded) { buildClientSelect(); go('client-select'); }
              else go('home');
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



// =====================================================
// DUEL EN DIRECT (tour par tour, synchronisé Firebase)
// =====================================================
var LD_ROUNDS = 3, LD_TURN = 25, LD_GRACE = 6;
var ldTimer = null, ldRoles = null, ldActed = '', ldBot = '', ldDoneShown = false;

function ldCardsFor(role){
  var d = (typeof DUEL_ARGS !== 'undefined' && DUEL_ARGS[curCase]) ? DUEL_ARGS[curCase][(role === 'accusation') ? 'acc' : 'def'] : null;
  return d || [];
}
function ldStrength(card, idx){
  if (card && typeof card.q === 'number') return card.q;
  if (card && card.reco) return 4.2;
  return idx === 1 ? 3.5 : 3.1;
}
// Dérive tout l'état du duel à partir des coups joués (identique sur les 2 clients)
function ldState(live){
  live = live || {};
  var moves = live.moves || {};
  var order = ['accusation', 'defense']; // l'accusation ouvre, la défense répond
  var g = 50, lastMove = null, lastTs = live.startedAt || 0;
  var used = { accusation: [], defense: [] };
  for (var r = 1; r <= LD_ROUNDS; r++){
    var mr = moves[r] || {};
    for (var oi = 0; oi < order.length; oi++){
      var role = order[oi];
      var mv = mr[role];
      if (mv){
        var sh = Math.round(((typeof mv.str === 'number' ? mv.str : 3) - 3) * 6);
        g += (role === 'defense') ? sh : -sh;
        if (g < 5) g = 5; if (g > 95) g = 95;
        if (typeof mv.idx === 'number') used[role].push(mv.idx);
        lastMove = { role: role, lab: mv.lab, text: mv.text, c: mv.c };
        lastTs = mv.ts || lastTs;
      } else {
        return { phase: 'play', round: r, active: role, prevTs: lastTs || (live.startedAt || Date.now()), gauge: g, used: used, lastMove: lastMove, lastTs: lastTs };
      }
    }
  }
  return { phase: 'done', round: LD_ROUNDS, active: null, prevTs: lastTs, gauge: g, used: used, lastMove: lastMove, lastTs: lastTs };
}

function startLiveDuel(){
  clearInterval(prepI);
  if (!window.db || !currentRoom || !CASES[curCase]) { go('home'); return; }
  ldDoneShown = false; ldActed = ''; ldBot = ''; window._live = null;
  var c = CASES[curCase];
  var cn = c.n.split(' vs ');
  var ce = document.getElementById('ld-client'); if (ce) ce.textContent = (c.def || cn[0] || '');
  var se = document.getElementById('ld-serie'); if (se) se.textContent = c.t || '';
  var re = document.getElementById('ld-role');
  if (re){ re.textContent = (myRole === 'defense') ? 'Vous : DÉFENSE' : "Vous : ACCUSATION"; re.style.color = (myRole === 'defense') ? '#ffb38a' : '#9aa6ff'; }
  hideLiveVerdict();
  go('live-duel');
  // on n'a plus besoin du listener d'attente : on le détache
  window.db.ref('rooms/' + currentRoom + '/roles').off('value');
  window.db.ref('rooms/' + currentRoom + '/roles').once('value', function(s){ ldRoles = s.val() || {}; });
  // démarre l'horloge commune (une seule fois)
  var liveRef = window.db.ref('rooms/' + currentRoom + '/live');
  liveRef.child('startedAt').transaction(function(cur){ return cur ? cur : Date.now(); });
  if (window._ldRef) { try { window._ldRef.off(); } catch(e){} }
  window._ldRef = liveRef;
  window._ldRef.on('value', function(s){ window._live = s.val() || {}; ldRender(); });
  clearInterval(ldTimer);
  ldTimer = setInterval(ldTick, 300);
  ldRender();
}

function ldRender(){
  var pg = document.getElementById('live-duel');
  if (!pg || !pg.classList.contains('on')) return;
  var st = ldState(window._live || {});
  var pct = Math.round(st.gauge);
  var f = document.getElementById('ld-fill'); if (f) f.style.width = pct + '%';
  var mk = document.getElementById('ld-mark'); if (mk) mk.style.left = pct + '%';
  var gd = document.getElementById('ld-gd'); if (gd) gd.textContent = pct + '%';
  var ga = document.getElementById('ld-ga'); if (ga) ga.textContent = (100 - pct) + '%';
  var mn = document.getElementById('ld-manche'); if (mn) mn.textContent = (st.phase === 'done') ? 'Verdict' : ('Manche ' + st.round + '/' + LD_ROUNDS);
  var arg = document.getElementById('ld-arg'), who = document.getElementById('ld-who'), tag = document.getElementById('ld-tag'), txt = document.getElementById('ld-txt');
  if (st.lastMove){
    arg.className = 'ld-arg ' + (st.lastMove.role === 'defense' ? 'def' : 'acc') + ' fade';
    who.textContent = (st.lastMove.role === 'defense') ? 'Défense' : 'Accusation';
    tag.textContent = st.lastMove.lab || '';
    txt.textContent = '« ' + st.lastMove.text + ' »';
  } else {
    arg.className = 'ld-arg';
    who.textContent = 'Le duel commence';
    tag.textContent = (CASES[curCase] || {}).t || '';
    txt.textContent = (CASES[curCase] || {}).q || '';
  }
  if (st.phase === 'done'){
    clearInterval(ldTimer); ldTimer = null;
    var bc = document.getElementById('ld-cards'); if (bc) bc.innerHTML = '';
    var tn0 = document.getElementById('ld-turn'); if (tn0) tn0.innerHTML = '';
    if (!ldDoneShown){ ldDoneShown = true; ldFinish(st, window._live || {}); }
    return;
  }
  var myTurn = (st.active === myRole);
  var turn = document.getElementById('ld-turn'), box = document.getElementById('ld-cards');
  if (myTurn){
    var last = (st.round === LD_ROUNDS && st.active === 'defense');
    turn.innerHTML = (last ? 'Le dernier mot ' : 'À vous de plaider ') + '<span class="ld-cd" id="ld-cd"></span>';
    var cards = ldCardsFor(myRole), usedMine = st.used[myRole] || [];
    box.innerHTML = '';
    for (var i = 0; i < cards.length; i++){
      (function(card, idx){
        var b = document.createElement('button');
        b.type = 'button';
        var isUsed = usedMine.indexOf(idx) > -1;
        b.className = 'dd-card' + (card.reco && !isUsed ? ' reco' : '') + (isUsed ? ' dim' : '');
        var col = card.c || '#ff7a2e';
        b.innerHTML = '<span class="dd-bar" style="background:' + col + '"></span><span class="dd-lab" style="color:' + col + '">' + card.lab + '</span><span class="dd-prev">' + card.prev + '</span>' + (card.reco && !isUsed ? '<span class="dd-tag">Recommandé</span>' : '<span class="dd-chev">\u203A</span>');
        if (!isUsed){ b.onclick = function(){ ldPick(idx, card); }; } else { b.style.pointerEvents = 'none'; }
        box.appendChild(b);
      })(cards[i], i);
    }
  } else {
    turn.innerHTML = 'Au tour de ' + (st.active === 'defense' ? 'la défense' : "l'accusation") + ' <span class="ld-cd" id="ld-cd"></span>';
    box.innerHTML = '<div style="text-align:center;color:#8e8e9c;font-size:13.5px;font-weight:700;padding:16px;">L\u2019adversaire plaide\u2026</div>';
  }
}

function ldTick(){
  var st = ldState(window._live || {});
  if (st.phase === 'done') { clearInterval(ldTimer); ldTimer = null; return; }
  var deadline = (st.prevTs || Date.now()) + LD_TURN * 1000;
  var remain = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  var cd = document.getElementById('ld-cd'); if (cd) cd.textContent = '· ' + remain + 's';
  var key = st.round + ':' + st.active;
  if (Date.now() > deadline){
    if (st.active === myRole){
      if (ldActed !== key){ ldActed = key; ldAutoPick(st); }
    } else if (Date.now() > deadline + LD_GRACE * 1000){
      if (ldActed !== ('F' + key)){ ldActed = 'F' + key; ldForfeit(st); }
    }
  }
  // L'adversaire est un bot : on laisse l'argument affiché ~20s avant de répondre (sinon illisible)
  if (st.active !== myRole && ldRoles && ldRoles[st.active] && ldRoles[st.active].uid === 'bot'){
    var botWait = st.lastTs ? (st.lastTs + 20000) : (st.prevTs + 2800);
    if (ldBot !== key && Date.now() > botWait){ ldBot = key; ldBotPlay(st); }
  }
}

function ldPick(idx, card){
  var st = ldState(window._live || {});
  if (st.active !== myRole || st.phase === 'done') return;
  ldActed = st.round + ':' + st.active;
  ldWriteMove(myRole, st.round, idx, card);
}
function ldAutoPick(st){
  var cards = ldCardsFor(myRole), used = st.used[myRole] || [], idx = -1, i;
  for (i = 0; i < cards.length; i++){ if (cards[i].reco && used.indexOf(i) === -1){ idx = i; break; } }
  if (idx === -1){ for (i = 0; i < cards.length; i++){ if (used.indexOf(i) === -1){ idx = i; break; } } }
  if (idx === -1) return;
  ldWriteMove(myRole, st.round, idx, cards[idx]);
}
function ldForfeit(st){
  var role = st.active, cards = ldCardsFor(role), used = st.used[role] || [], idx = -1, i;
  for (i = 0; i < cards.length; i++){ if (used.indexOf(i) === -1){ idx = i; break; } }
  if (idx === -1) return;
  window.db.ref('rooms/' + currentRoom + '/live/moves/' + st.round + '/' + role).once('value', function(s){
    if (!s.val()) ldWriteMove(role, st.round, idx, cards[idx]);
  });
}
function ldBotPlay(st){
  var role = st.active, cards = ldCardsFor(role), used = st.used[role] || [], avail = [], i;
  for (i = 0; i < cards.length; i++){ if (used.indexOf(i) === -1) avail.push(i); }
  if (!avail.length) return;
  var idx = avail[0];
  for (i = 0; i < avail.length; i++){ if (cards[avail[i]].reco){ idx = avail[i]; break; } }
  window.db.ref('rooms/' + currentRoom + '/live/moves/' + st.round + '/' + role).once('value', function(s){
    if (!s.val()) ldWriteMove(role, st.round, idx, cards[idx]);
  });
}
function ldWriteMove(role, round, idx, card){
  if (!window.db || !currentRoom || !card) return;
  window.db.ref('rooms/' + currentRoom + '/live/moves/' + round + '/' + role).set({
    idx: idx, lab: card.lab, text: card.prev, c: card.c || '#ff7a2e', str: ldStrength(card, idx), ts: Date.now()
  });
}

function ldFinish(st, live){
  clearInterval(ldTimer); ldTimer = null;
  var gauge = Math.round(st.gauge), defWon = gauge >= 50;
  var iWon = (myRole === 'defense' && defWon) || (myRole === 'accusation' && !defWon);
  me.duels = (me.duels || 0) + 1;
  if (iWon) me.wins = (me.wins || 0) + 1;
  saveSession();
  if (window.db){
    window.db.ref('users/' + myUid + '/duels').set(me.duels);
    if (iWon) window.db.ref('users/' + myUid + '/wins').set(me.wins);
    if (myRole === 'defense'){
      var moves = live.moves || {}, dTxt = '', aTxt = '';
      for (var r = LD_ROUNDS; r >= 1; r--){ if (moves[r]){ if (!dTxt && moves[r].defense) dTxt = moves[r].defense.text; if (!aTxt && moves[r].accusation) aTxt = moves[r].accusation.text; } }
      var c = CASES[curCase] || {};
      window.db.ref('public-duels/' + currentRoom).update({
        caseName: c.n || '', caseType: c.t || '', question: c.q || '',
        defense: { text: dTxt, name: (ldRoles && ldRoles.defense && ldRoles.defense.name) || 'Défense' },
        accusation: { text: aTxt, name: (ldRoles && ldRoles.accusation && ldRoles.accusation.name) || 'Accusation' },
        result: { defensePct: gauge, winner: defWon ? 'defense' : 'accusation' },
        publishedAt: Date.now()
      });
    }
  }
  showLiveVerdict(iWon, gauge);
  if (typeof showGuestBanner === 'function') showGuestBanner();
}
function showLiveVerdict(iWon, gauge){
  var ov = document.getElementById('ld-vd'); if (!ov) return;
  var b = document.getElementById('ld-vb');
  if (b){ b.textContent = iWon ? 'Vous gagnez' : 'Vous perdez'; b.className = 'vb' + (iWon ? '' : ' lose'); }
  var s = document.getElementById('ld-vs');
  if (s) s.textContent = gauge + '% pour la défense · ' + (100 - gauge) + "% pour l'accusation";
  ov.classList.add('show');
}
function hideLiveVerdict(){ var ov = document.getElementById('ld-vd'); if (ov) ov.classList.remove('show'); }
