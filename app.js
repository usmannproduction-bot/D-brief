// ========== CONFIG ==========
var config = {
  apiKey: "AIzaSyCAsL1P1YDGWfZMBzQdZdp4xd6zjgoGK9g",
  authDomain: "guette-a9b5d.firebaseapp.com",
  databaseURL: "https://guette-a9b5d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "guette-a9b5d",
  storageBucket: "guette-a9b5d.appspot.com",
  messagingSenderId: "1087638193588",
  appId: "1:1087638193588:web:5f7d3c8e8e3d3c1e4e3d3c"
};

// ========== INIT ==========
var myUid, me = {}, currentRoom, curCase, myRole, prepI, botTimer, judgeI, caseKeys = [];
var CASES = {};

function K(n, t, q, dos, bd, ba, vd) {
  return { n: n, t: t, q: q, dos: dos, bd: bd, ba: ba, vd: vd || 10800000, pt: 30, wt: 300 };
}

// ========== CASES ==========
var ALL_CASES = {
  ghost1: K(1, 'Ghost vs Tommy', 'Power', 'Tommy accuse Ghost d\'avoir trahi la rue pour enfiler un costume de politicien', 'New York, Queens. James St. Patrick, alias Ghost, a grandi dans les rues avec Tommy Egan. Ensemble ils ont bâti un empire de drogue depuis le bas. Ghost rêvait d\'autre chose. Il a ouvert un club, Truth, fréquenté les politiciens, courtisé Angela Valdes, procureure fédérale. Il voulait devenir légitime. Tommy lui reproche d\'avoir utilisé la rue comme tremplin avant de l\'abandonner dès que l\'ascenseur social a daigné s\'ouvrir.', 'Ghost n\'a pas trahi Tommy, il a évolué. Tommy confond loyauté et prison mentale. Rester dans la rue par fidélité c\'est condamner son intelligence à ne jamais servir.', 'Ghost a utilisé Tommy comme bouclier, comme exécutant, comme bouc émissaire. Chaque fois que la situation devenait dangereuse, c\'est Tommy qui prenait les risques.'),
  blood1: K(1, 'Sarah vs Kemi', 'Blood Sisters', 'Kemi accuse Sarah d\'avoir caché un meurtre et fait d\'elle une complice malgré elle', 'Lagos, Nigeria. Le soir du mariage de Kemi, Kola, son fiancé violent et possessif, est mort. Sarah a dissimulé les faits, pris des décisions à la place de Kemi, et l\'a engagée dans une spirale de mensonges et de danger mortel.', 'Kola était un homme violent qui aurait tué Kemi. Sarah a agi dans l\'urgence pour sauver sa meilleure amie.', 'Sarah a menti à Kemi pendant des semaines. Elle l\'a transformée en fugitive, en complice d\'un crime qu\'elle n\'a pas commis.'),
  tommy1: K(1, 'Tommy vs Arthur', 'Peaky Blinders', 'Arthur accuse Tommy d\'avoir sacrifié chaque membre de la famille Shelby sur l\'autel de son ambition', 'Birmingham, Small Heath, après la Première Guerre mondiale. Tommy Shelby a transformé le chaos en empire. Il a utilisé la douleur de ses frères, leur loyauté aveugle, leur incapacité à refuser une mission comme matière première de son ascension.', 'Sans Tommy, les Shelby seraient restés des petits criminels de banlieue. Tommy a donné à sa famille une puissance qu\'ils n\'auraient jamais atteinte seuls.', 'Tommy a regardé Arthur se noyer dans la violence et la drogue, et il a continué à lui donner des missions parce qu\'Arthur était utile.'),
  shanty1: K(1, 'Inem vs Scar', 'Shanty Town', 'Inem accuse Scar de traiter les femmes de Shanty Town comme du bétail humain', 'Lagos, Shanty Town. Scar règne sur l\'un des quartiers les plus pauvres de la ville. Son empire repose sur le trafic, la violence et l\'exploitation systématique des femmes du quartier.', 'Scar a apporté un ordre là où il n\'y en avait aucun. Les femmes de Shanty Town n\'avaient pas de protection avant lui.', 'Scar exploite les femmes les plus vulnérables de Shanty Town sous couverture de protection.'),
  lupin1: K(1, 'Assane vs Hubert', 'Lupin', 'Hubert accuse Assane d\'être un criminel romantique qui met en danger ceux qu\'il prétend protéger', 'Paris. Babakar Diop, père d\'Assane, a été accusé à tort du vol d\'un collier par Hubert Pellegrini. Il est mort en prison. Assane a consacré sa vie à la vengeance, mettant en danger sa femme et son fils.', 'Assane n\'avait pas accès aux voies normales de la justice. Face à une injustice systémique, seule une réponse hors système pouvait fonctionner.', 'Assane a mis sa femme en danger, séparé son fils de ses parents. La mémoire de son père est devenue un alibi pour un mode de vie criminel.'),
  valide1: K(1, 'Apash vs William', 'Validé', 'William accuse Apash d\'avoir vendu son authenticité contre des streams et trahi ceux qui l\'ont construit', 'Paris, banlieue. Apash est né dans la cité. Son rap parlait de la rue, de la galère, de ceux qui restent. William était là depuis le début.', 'Apash a réussi là où des milliers ont échoué. Évoluer n\'est pas trahir.', 'Apash a bâti sa carrière sur la promesse implicite d\'une parole vraie. Il a monétisé cette confiance puis changé de monde sans se retourner.'),
  sartre1: K(3, 'Sartre vs Ghost', 'Philosophie', 'Sartre accuse Ghost d\'être l\'incarnation parfaite de la mauvaise foi — un homme qui refuse de choisir qui il est', 'Jean-Paul Sartre a théorisé la mauvaise foi comme la tendance humaine à se fuir soi-même. Ghost vit deux vies parallèles depuis des années. Le jour, homme d\'affaires respectable. La nuit, trafiquant. Il refuse obstinément de choisir entre les deux.', 'Ghost n\'a pas le luxe de philosopher sur l\'authenticité. Il est né noir et pauvre dans un système qui ne lui laissait pas le choix de ses premières décisions.', 'Ghost change d\'identité selon l\'audience. Sartre dirait : celui qui joue autant de rôles différents ne joue aucun rôle vraiment. Il n\'existe pas.'),
  dadie1: K(3, 'Dadié vs Harvey Specter', 'Philosophie', 'Dadié accuse Harvey Specter de traiter la justice comme un jeu d\'ego plutôt qu\'un outil de vérité', 'Bernard Dadié, père de la littérature ivoirienne, a toujours défendu que la parole doit servir la vérité et la dignité humaine. Harvey Specter, lui, est le meilleur fermeur de New York — pas parce qu\'il cherche la vérité, mais parce qu\'il cherche la victoire.', 'Harvey Specter obtient des résultats que personne d\'autre ne peut obtenir. Dans un système imparfait, un avocat qui gagne protège mieux ses clients qu\'un avocat qui cherche la vérité.', 'Harvey Specter a défendu des criminels, détruit des innocents, manipulé des preuves — tout ça en se regardant dans le miroir avec satisfaction.'),
  beauvoir1: K(3, 'Beauvoir vs Princesse Sarah', 'Philosophie', 'Beauvoir accuse la série d\'avoir fabriqué pendant des décennies un modèle féminin basé sur la souffrance silencieuse et la soumission', 'Simone de Beauvoir a fondé le féminisme existentiel sur une idée centrale : on ne naît pas femme, on le devient. Princesse Sarah est une petite fille noble déchue qui endure toutes les humiliations sans jamais se révolter.', 'Sarah n\'est pas passive, elle est résiliente. Sa force est intérieure. Dans un monde qui l\'écrase, elle choisit de ne pas se laisser corrompre.', 'Princesse Sarah enseigne aux petites filles que souffrir en silence est vertueux, que la révolte est laide, que la bonté passive finit par être récompensée.'),
  walter1: K(1, 'Walter vs Jesse', 'Breaking Bad', 'Jesse accuse Walter d\'avoir empoisonné un enfant de 8 ans pour le manipuler comme un pantin', 'Albuquerque. Jesse a découvert que c\'est Walter qui avait empoisonné Brock, délibérément, pour manipuler Jesse et le retourner contre Gus. Walter avait calculé la dose pour que l\'enfant survive.', 'Walter n\'a pas voulu tuer Brock. Il a calculé une dose qui ne mettait pas sa vie en danger. L\'objectif était d\'éliminer Gus Fring qui voulait les tuer tous les deux.', 'Walter White a empoisonné un enfant de 8 ans en secret. Il a regardé Jesse s\'effondrer d\'inquiétude tout en sachant qu\'il en était responsable.'),
  maitresse1: K(1, 'Marème vs Dialika', 'Maîtresse d\'un homme marié', 'Dialika accuse Marème d\'avoir détruit son foyer en connaissance de cause et sans le moindre remords', 'Dakar. Dialika est mariée à Baye Fall depuis des années. Marème est entrée dans cette équation en sachant pertinemment qu\'il était marié.', 'Marème n\'a pas trahi Dialika. Elle ne lui a fait aucune promesse. C\'est Baye Fall qui a fait des vœux et qui les a brisés.', 'Marème savait. Elle a quand même choisi de continuer. La liberté individuelle s\'arrête là où elle détruit délibérément la vie d\'une autre personne.'),
  heritage1: K(1, 'Le Fils vs L\'Oncle', 'Héritage', 'Le fils accuse l\'oncle d\'avoir profité du deuil familial pour s\'emparer de l\'héritage', 'Côte d\'Ivoire. Le père est mort, laissant derrière lui une propriété et une famille fracturée. L\'oncle s\'est positionné comme gestionnaire naturel pendant le deuil.', 'L\'oncle a géré l\'héritage parce que le fils était incapable de le faire dans l\'immédiat du deuil.', 'L\'oncle a attendu que son frère soit dans la terre pour mettre la main sur ce qu\'il n\'avait pas réussi à obtenir de son vivant.'),
  soeurs1: K(1, 'Karen vs Terrence', '7 Sœurs', 'Karen accuse Terrence d\'avoir effacé l\'identité de six de ses filles pour en faire une seule', 'Europe dystopique. La loi de l\'enfant unique interdit à chaque famille d\'avoir plus d\'un enfant. Terrence Settman a eu des septuplées. Plutôt que de sacrifier six d\'entre elles, il les a fait vivre sous l\'identité d\'une seule femme : Karen.', 'Terrence a sauvé sept vies dans un monde qui n\'en voulait qu\'une. La contrainte de partager une identité est douloureuse, mais l\'alternative était la mort.', 'Terrence a décidé seul que six de ses filles n\'auraient pas le droit d\'exister sous leur propre nom.'),
  tag1: K(2, 'Tag vs Éric', 'Foot 2 Rue', 'Éric accuse Tag de sacrifier la victoire collective sur l\'autel de son ego et de son show', 'Paris, terrain de foot 2 rue. Tag est le joueur le plus talentueux de l\'équipe — tout le monde le sait, lui le premier. Éric lui reproche de traiter chaque match comme un show personnel.', 'Tag marque les buts qui gagnent les matchs. Sans son talent, l\'équipe n\'existerait même pas.', 'Tag préfère rater un dribble incroyable que réussir une passe simple. Il confond le talent avec le droit d\'ignorer les autres.'),
  nuitdesrois1: K(4, 'Roman vs Barbe Noire', 'La Nuit des Rois', 'Roman accuse Barbe Noire d\'avoir instauré un règne de terreur déguisé en tradition à la MACA', 'Abidjan, prison de la MACA. Barbe Noire est le chef incontesté de la prison. Son pouvoir repose sur une tradition : chaque nuit, le Roman doit raconter une histoire jusqu\'à l\'aube. S\'il s\'arrête, il meurt.', 'Barbe Noire a transformé un espace de violence brute en un espace où la parole a une valeur.', 'Barbe Noire a inventé une tradition pour justifier son pouvoir de vie et de mort.'),
  topboy1: K(1, 'Sully vs Aaron', 'Top Boy', 'Aaron accuse Sully d\'avoir tué son frère Jamie de sang-froid et détruit sa famille pour toujours', 'Summerhouse, Est de Londres. Jamie Tovell avait tout fait pour sortir ses frères Aaron et Stefan de la rue. Quand Dushane a ordonné la mort de Jamie, c\'est Sully qui a appuyé sur la gâchette.', 'Sully n\'a pas assassiné Jamie. Il a exécuté une décision qui dépassait les deux hommes.', 'Sully a regardé Jamie dans les yeux et a tiré. Par choix. Jamie essayait de s\'en sortir. Aaron n\'a plus de frère.'),
  dinercon1: K(1, 'Pignon vs Brochant', 'Le Dîner de Cons', 'Brochant accuse Pignon d\'avoir transformé une soirée en catastrophe totale et irréversible', 'Paris. Brochant a invité Pignon, comptable passionné de maquettes d\'allumettes, à son dîner. En quelques heures, Pignon a provoqué la fuite de sa femme, alerté le fisc, révélé une relation extraconjugale et déclenché une série de catastrophes en chaîne.', 'Pignon n\'a rien fait de mal intentionnellement. C\'est Brochant qui a créé ce jeu cruel et méprisable.', 'La bonne intention ne suffit pas. Pignon a détruit le mariage de Brochant, alerté le fisc, fait fuir sa maîtresse.'),
  sakho1: K(1, 'Sakho vs Mangane', 'Sakho & Mangane', 'Mangane accuse Sakho de se croire au-dessus des lois qu\'il est censé faire respecter', 'Dakar, Sénégal. Sakho a l\'habitude de contourner les règles quand il estime que le résultat est juste. Il s\'introduit illégalement, il intimide des témoins, il manipule les procédures.', 'Sakho attrape les coupables que la procédure laisserait filer. Dans un système judiciaire imparfait, un flic qui joue selon les mêmes règles que les criminels est parfois le seul qui peut gagner.', 'Si chaque flic décide seul quelles lois il respecte, le droit n\'existe plus.'),
  annalise1: K(1, 'Annalise vs Michaela', 'Murder', 'Michaela accuse Annalise d\'être une manipulatrice narcissique qui broie ses élèves pour sa propre survie', 'Philadelphie, faculté de droit. Annalise Keating a sélectionné Michaela et quatre autres étudiants pour travailler sur ses affaires réelles. Ce qu\'ils ne savaient pas : ils allaient devenir des complices.', 'Annalise a donné à ses étudiants ce qu\'aucune école de droit ne leur aurait donné : une formation dans le feu, une compréhension de la justice dans sa réalité brutale.', 'Annalise a recruté des étudiants vulnérables, elle les a rendus complices de ses propres crimes, et elle a utilisé leur loyauté comme bouclier.'),
  nietzsche1: K(3, 'Nietzsche vs Tag', 'Philosophie', 'Nietzsche accuse Tag d\'avoir le talent du surhomme mais de choisir délibérément la médiocrité du show plutôt que la grandeur du dépassement', 'Friedrich Nietzsche a théorisé le surhomme comme celui qui crée ses propres valeurs et se dépasse lui-même. Tag, joueur prodige du foot 2 rue, a un talent qui dépasse tous ses adversaires. Mais Nietzsche observe quelque chose d\'inquiétant : Tag utilise son talent non pas pour se dépasser, mais pour impressionner.', 'Tag joue comme il ressent les choses. Le football de rue c\'est de l\'art autant que du sport. Nietzsche lui-même valorisait la création et l\'instinct.', 'Nietzsche parlait de se dépasser soi-même, pas d\'épater les autres. Tag a le talent pour changer le jeu mais il choisit de briller dans sa propre lumière plutôt que d\'élever ceux qui l\'entourent.'),
  bloom1: K(1, 'Bloom vs Icy', 'Les Winx', 'Icy accuse Bloom d\'être une imposteur qui a construit sa légitimité sur une identité volée et des pouvoirs hérités qu\'elle n\'a pas mérités', 'Alfea, école des fées. Bloom a grandi en pensant être une humaine ordinaire avant de découvrir qu\'elle est la princesse de la planète Domino et porteuse du Feu du Destin. Icy lui reproche de se poser en héroïne alors que tout ce qu\'elle a, elle le doit à sa naissance et au hasard, pas à son travail ou son mérite.', 'Bloom n\'a pas choisi ses origines, mais elle a choisi d\'assumer la responsabilité qui venait avec. Elle aurait pu fuir. Elle s\'est battue.', 'Bloom arrive à Alfea sans formation, sans effort préalable, et s\'impose comme la plus puissante grâce à des pouvoirs innés. Elle représente exactement ce que le mérite devrait combattre : le privilège de naissance déguisé en destin.'),
  nemesis1: K(1, 'Ebony vs Candice', 'Nemesis', "Candice accuse Ebony d'avoir su qui était vraiment son mari et de l'avoir couvert jusqu'au bout", "Los Angeles. Isaiah Stiles traque depuis des mois une équipe de braqueurs. Sa femme Candice, elle, s'est liée d'amitié avec Ebony Wilder — sans savoir que le mari d'Ebony est précisément le criminel qu'Isaiah pourchasse. Quand la vérité éclate, la question devient : Ebony savait-elle ? Et si oui, depuis quand ?", "Ebony n'était pas complice. Elle était une femme qui protégeait sa famille dans un monde où personne ne lui laissait le choix. Candice confond loyauté conjugale et trahison délibérée.", "Ebony a regardé Candice lui parler de son mari brisé par cette enquête, et elle a souri. Elle savait. Elle a choisi de se taire. Ce silence a un nom : complicité."),
  ebony1: K(1, 'Ebony vs Vanessa Jenkins', 'Power Book IV: Force', "Vanessa Jenkins accuse Ebony d’avoir manipulé son mari pour le faire tuer et couvrir son crime.", "Chicago. Le détective Markus Jenkins menait l’enquête sur le réseau d’Ebony LaBeija. Après sa mort dans des circonstances troubles, sa femme Vanessa, convaincue qu’Ebony a orchestré son assassinat, porte plainte. Ebony, elle, affirme que Markus était corrompu et qu’il a payé le prix de ses erreurs.", "Markus Jenkins était à deux doigts de faire tomber tout mon réseau. Il avait des preuves, des contacts, et il ne reculerait devant rien. Dans notre monde, c’est lui ou moi.", "Ebony a utilisé son argent, son influence, et ses contacts pour piéger Markus. Elle a détruit une famille entière pour protéger son business."),
  // NOUVELLE AFFAIRE : Tribunal des Présidents
  tribunal1: K(
    1,
    'Le Tribunal des Présidents',
    'Actualité',
    'Faut-il instaurer un tribunal citoyen pour juger chaque président à la fin de son mandat, avec risque de peine de prison en cas de manquement avéré à ses devoirs sociaux ?',
    'Paris, 2026. À la fin de chaque mandat présidentiel, des milliers de citoyens manifestent pour exiger des comptes sur les promesses non tenues, les réformes sociales insuffisantes, et les décisions jugées néfastes pour le pays. Une proposition radicale émerge : créer un tribunal indépendant, composé de citoyens tirés au sort, pour évaluer objectivement l’action du président sortant. Ce tribunal aurait le pouvoir de condamner à des peines de prison si le bilan social est jugé insuffisant ou nuisible. Mais une telle mesure ne risquerait-elle pas de paralyser la démocratie en décourageant les futurs dirigeants ?',
    'Instaurer un tribunal pour juger les présidents après leur mandat, c’est remplacer la démocratie par une justice arbitraire. Les électeurs ont déjà le pouvoir de sanctionner un président en ne le réélisant pas. Ajouter une menace de prison reviendrait à décourager toute prise de décision forte, par peur des conséquences personnelles. Qui oserait encore gouverner dans ces conditions ? La politique exige des compromis difficiles : si chaque choix peut mener en prison, plus personne n’osera prendre de risque pour le pays. La légitimité d’un dirigeant vient des urnes, pas des tribunaux.',
    'Un président a un devoir de résultat envers son peuple. Si ses politiques ont aggravé la pauvreté, ignoré les crises sociales ou favorisé des inégalités criantes, il doit en répondre devant la justice, comme n’importe quel citoyen. Aujourd’hui, les dirigeants agissent en toute impunité, sachant qu’ils ne subiront aucune conséquence personnelle. Un tribunal citoyen serait un gardien de l’intérêt général, garantissant que chaque décision est prise dans l’intérêt du pays, et non pour des calculs électoraux ou des lobbies. Sans cette responsabilité, la démocratie n’est qu’un leurre : les puissants restent intouchables, tandis que les citoyens paient le prix de leurs erreurs.'
  )
};

// Initialise les affaires
for (var k in ALL_CASES) {
  CASES[k] = ALL_CASES[k];
  caseKeys.push(k);
}

// ========== FIREBASE ==========
function setUid(e) {
  myUid = e.replace(/[^a-z0-9]/gi, '');
}

function initFirebase() {
  if (window.firebase) return;
  firebase.initializeApp(config);
  window.db = firebase.database();
  window.firebase = firebase;
  if (myUid) {
    window.db.ref('users/' + myUid).once('value', function(s) {
      var d = s.val();
      if (d) {
        me = d;
        me.uid = myUid;
      }
    });
  }
}
initFirebase();

// ========== NAVIGATION ==========
function go(p) {
  document.querySelectorAll('.P').forEach(function(e) {
    e.classList.remove('on');
  });
  document.getElementById(p).classList.add('on');
  if (p === 'home') buildHome();
  if (p === 'verdicts') loadPublicDuels();
  if (p === 'profil') {
    buildProfile();
    loadProfile();
  }
  window.scrollTo(0, 0);
}

function switchTab(p) {
  go(p);
}

// ========== ONBOARDING ==========
function nextOnboardingStep(step) {
  for (var i = 1; i <= 4; i++) {
    var stepEl = document.getElementById('onboarding-step-' + i);
    if (stepEl) stepEl.style.display = i === step ? 'block' : 'none';
  }
}

function startFirstDuel() {
  me.onboarded = true;
  saveSession();
  var randomCaseKey = caseKeys[Math.floor(Math.random() * caseKeys.length)];
  joinDuel(randomCaseKey);
}

// ========== AUTH ==========
function hashPwd(p) {
  return p.split('').reduce(function(a, b) {
    a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
    return a;
  }, 0).toString(16);
}

function saveSession() {
  if (!myUid) return;
  localStorage.setItem('dbrief_uid', myUid);
  localStorage.setItem('dbrief_me', JSON.stringify(me));
  if (window.db) window.db.ref('users/' + myUid).set(me);
}

function loadSession() {
  var uid = localStorage.getItem('dbrief_uid');
  var meData = localStorage.getItem('dbrief_me');
  if (uid) {
    setUid(uid);
    if (meData) me = JSON.parse(meData);
    initFirebase();
    go('home');
  } else {
    go('splash');
  }
}

function doLogout() {
  myUid = '';
  me = {};
  localStorage.removeItem('dbrief_uid');
  localStorage.removeItem('dbrief_me');
  go('splash');
}

// ========== SIGNUP/LOGIN ==========
function doSignup() {
  var n = document.getElementById('su-n').value.trim();
  var e = document.getElementById('su-e').value.trim();
  var p = document.getElementById('su-p').value;
  var cab = document.getElementById('su-cab').value.trim();
  var code = document.getElementById('su-cabcode').value.trim().toUpperCase();
  var err = document.getElementById('su-err');

  if (!n || !e || p.length < 6) {
    err.style.display = 'block';
    err.textContent = 'Remplissez tout (mdp 6 car.)';
    err.style.color = '#FF4757';
    return;
  }

  setUid(e);
  me.name = n;
  me.email = e;
  me.password = hashPwd(p);
  me.wins = 0;
  me.duels = 0;
  me.xp = 0;
  me.status = 'junior';
  me.cabName = cab || n + ' & associé';
  me.cabCode = code || '';
  me.cabId = '';
  me.favSeries = [];
  me.onboarded = false;
  me.powerUps = { doubleTime: 0, burningArg: 0, shield: 0, targeting: 0, replay: 1 };
  me.streak = 0;
  me.maxStreak = 0;

  if (window.db) {
    window.db.ref('users/' + myUid).set(me, function() {
      saveSession();
      go('onboarding');
    });
  } else {
    saveSession();
    go('onboarding');
  }
}

function doLogin() {
  var e = document.getElementById('li-e').value.trim();
  var p = document.getElementById('li-p').value;
  var err = document.getElementById('li-err');

  if (!e || p.length < 6) {
    err.style.display = 'block';
    err.textContent = 'Email ou mot de passe manquant';
    err.style.color = '#FF4757';
    return;
  }

  setUid(e);
  if (window.db) {
    tryFirebaseLogin(e, p, err);
  } else {
    var storedMe = localStorage.getItem('dbrief_me');
    if (storedMe) {
      var storedData = JSON.parse(storedMe);
      if (storedData.email === e && storedData.password === hashPwd(p)) {
        me = storedData;
        me.uid = myUid;
        saveSession();
        go('home');
        return;
      }
    }
    err.style.display = 'block';
    err.textContent = 'Email ou mot de passe incorrect';
    err.style.color = '#FF4757';
  }
}

function tryFirebaseLogin(e, p, err) {
  err.style.display = 'block';
  err.textContent = 'Connexion...';
  err.style.color = '#FFD23F';

  window.db.ref('users/' + myUid).once('value', function(snap) {
    var d = snap.val();
    if (d && d.email) {
      if (d.password && d.password !== hashPwd(p)) {
        err.textContent = 'Mot de passe incorrect';
        err.style.color = '#FF4757';
        return;
      }
      me = d;
      me.uid = myUid;
      me.onboarded = me.onboarded || false;
      err.style.display = 'none';
      saveSession();
      if (me.onboarded) {
        go('home');
      } else {
        go('onboarding');
      }
    } else {
      err.textContent = 'Compte introuvable';
      err.style.color = '#FF4757';
    }
  });
}

// ========== HOME ==========
function buildHome() {
  var container = document.getElementById('cards-inner');
  if (!container) return;

  container.innerHTML = '';

  // Affiche les affaires par catégorie
  var categories = {};
  caseKeys.forEach(function(k) {
    var c = CASES[k];
    if (!c) return;
    if (!categories[c.t]) categories[c.t] = [];
    categories[c.t].push(k);
  });

  for (var cat in categories) {
    var catDiv = document.createElement('div');
    catDiv.style.marginBottom = '20px';

    var catTitle = document.createElement('div');
    catTitle.style.fontSize = '18px';
    catTitle.style.fontWeight = '900';
    catTitle.style.marginBottom = '12px';
    catTitle.style.color = '#F0F0F5';
    catTitle.textContent = cat;
    catDiv.appendChild(catTitle);

    var catContainer = document.createElement('div');
    catContainer.style.display = 'flex';
    catContainer.style.flexDirection = 'column';
    catContainer.style.gap = '10px';

    categories[cat].forEach(function(k) {
      var c = CASES[k];
      if (!c) return;
      var card = document.createElement('div');
      card.style.cssText = 'padding:16px;background:rgba(255,255,255,.02);border-radius:14px;border:1px solid rgba(255,255,255,.04);cursor:pointer;';
      card.onclick = function() { joinDuel(k); };
      card.innerHTML =
        '<div style="font-size:16px;font-weight:800;color:#F0F0F5;margin-bottom:4px;">' + c.n + '</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,.4);margin-bottom:8px;">' + c.t + '</div>' +
        '<div style="font-size:13px;color:rgba(255,255,255,.7);line-height:1.4;">' + c.q + '</div>';
      catContainer.appendChild(card);
    });

    catDiv.appendChild(catContainer);
    container.appendChild(catDiv);
  }
}

// ========== DUEL ==========
function joinDuel(id) {
  curCase = id;
  var c = CASES[id];
  if (!c) return;

  currentRoom = id + '_' + Date.now().toString(36);
  myRole = Math.random() > 0.5 ? 'defense' : 'accusation';

  if (window.db) {
    window.db.ref('rooms/' + currentRoom).set({
      case: id,
      defense: { uid: '', name: '', arg: '', ready: false },
      accusation: { uid: '', name: '', arg: '', ready: false },
      votes: { defense: 0, accusation: 0 },
      createdAt: Date.now()
    });

    window.db.ref('rooms/' + currentRoom + '/' + myRole).set({
      uid: myUid,
      name: me.name || '',
      arg: '',
      ready: false
    });

    window.db.ref('rooms/' + currentRoom).onDisconnect().update({
      ['/' + myRole]: null
    });

    window.db.ref('rooms/' + currentRoom).on('value', function(s) {
      var r = s.val();
      if (!r) return;

      if (r.defense && r.defense.uid && r.accusation && r.accusation.uid) {
        if (r.defense.ready && r.accusation.ready) {
          go('duel-vote');
          loadDuelVotes();
        } else if (r.defense.uid === myUid && !r.defense.ready) {
          go('duel-submit');
          loadDuelSubmit();
        } else if (r.accusation.uid === myUid && !r.accusation.ready) {
          go('duel-submit');
          loadDuelSubmit();
        } else {
          go('duel-dossier');
          loadDuelDossier();
        }
      } else {
        go('duel-dossier');
        loadDuelDossier();
      }
    });
  } else {
    go('duel-dossier');
    loadDuelDossier();
    setTimeout(function() {
      go('duel-submit');
      loadDuelSubmit();
    }, 2000);
  }
}

function loadDuelDossier() {
  var c = CASES[curCase];
  if (!c) return;
  var ddName = document.getElementById('dd-name');
  var ddType = document.getElementById('dd-type');
  var ddDesc = document.getElementById('dd-desc');
  if (ddName) ddName.textContent = c.n;
  if (ddType) ddType.textContent = c.t;
  if (ddDesc) ddDesc.textContent = c.dos;
}

function goToSubmit() {
  go('duel-submit');
  loadDuelSubmit();
}

function loadDuelSubmit() {
  var c = CASES[curCase];
  if (!c) return;
  var dsName = document.getElementById('ds-name');
  var dsType = document.getElementById('ds-type');
  var dsDesc = document.getElementById('ds-desc');
  var dsArg = document.getElementById('ds-arg');
  var dsCount = document.getElementById('ds-count');
  if (dsName) dsName.textContent = c.n;
  if (dsType) dsType.textContent = c.t;
  if (dsDesc) dsDesc.textContent = c.q;
  if (dsArg) dsArg.value = '';
  if (dsCount) dsCount.textContent = '0 / 300';
}

function updateCharCount() {
  var dsArg = document.getElementById('ds-arg');
  var dsCount = document.getElementById('ds-count');
  if (dsArg && dsCount) {
    dsCount.textContent = dsArg.value.length + ' / 300';
  }
}

function submitArgument() {
  if (!me.onboarded) {
    me.onboarded = true;
    saveSession();
  }

  clearInterval(prepI);
  var dsArg = document.getElementById('ds-arg');
  var t = (dsArg ? dsArg.value.trim() : '') || '(vide)';

  me.duels = (me.duels || 0) + 1;
  me.wins = (me.wins || 0) + 1;
  me.xp = (me.xp || 0) + 50;
  saveSession();

  if (window.db) {
    window.db.ref('rooms/' + currentRoom + '/arguments/' + myRole).set({ text: t, uid: myUid, name: me.name || '', ts: Date.now() });
    window.db.ref('rooms/' + currentRoom + '/' + myRole).update({ arg: t, ready: true });

    window.db.ref('rooms/' + currentRoom + '/arguments').once('value', function(s) {
      var a = s.val();
      if (a && a.defense && a.accusation) {
        var c = CASES[curCase] || {};
        window.db.ref('public-duels/' + currentRoom).set({
          caseName: c.n || '',
          caseType: c.t || '',
          question: c.q || '',
          defense: a.defense,
          accusation: a.accusation,
          publishedAt: Date.now(),
          voteEnds: Date.now() + (c.vd || 10800000)
        });
      }
    });
  }

  var dvName = document.getElementById('dv-name');
  if (dvName) dvName.textContent = (CASES[curCase] || {}).n || '';
  go('duel-vote');
  loadDuelVotes();
}

function loadDuelVotes() {
  var c = CASES[curCase] || {};
  var dvName = document.getElementById('dv-name');
  var dvType = document.getElementById('dv-type');
  var dvDesc = document.getElementById('dv-desc');
  if (dvName) dvName.textContent = c.n;
  if (dvType) dvType.textContent = c.t;
  if (dvDesc) dvDesc.textContent = c.q;

  if (window.db) {
    window.db.ref('rooms/' + currentRoom + '/arguments').on('value', function(s) {
      var a = s.val();
      if (!a) return;

      var dvDefArg = document.getElementById('dv-def-arg');
      var dvDefName = document.getElementById('dv-def-name');
      var dvAccArg = document.getElementById('dv-acc-arg');
      var dvAccName = document.getElementById('dv-acc-name');

      if (a.defense && dvDefArg && dvDefName) {
        dvDefArg.textContent = a.defense.text;
        dvDefName.textContent = a.defense.name || 'Anonyme';
      }
      if (a.accusation && dvAccArg && dvAccName) {
        dvAccArg.textContent = a.accusation.text;
        dvAccName.textContent = a.accusation.name || 'Anonyme';
      }
    });
  } else {
    var dvDefArg = document.getElementById('dv-def-arg');
    var dvAccArg = document.getElementById('dv-acc-arg');
    if (dvDefArg) dvDefArg.textContent = c.bd || 'Argument pour la défense';
    if (dvAccArg) dvAccArg.textContent = c.ba || 'Argument pour l\'accusation';
    var dvDefName = document.getElementById('dv-def-name');
    var dvAccName = document.getElementById('dv-acc-name');
    if (dvDefName) dvDefName.textContent = 'Joueur 1';
    if (dvAccName) dvAccName.textContent = 'Joueur 2';
  }
}

function vote(side) {
  if (!window.db) {
    var dvButtons = document.getElementById('dv-buttons');
    var dvVoted = document.getElementById('dv-voted');
    if (dvButtons) dvButtons.style.display = 'none';
    if (dvVoted) dvVoted.style.display = 'block';
    return;
  }

  window.db.ref('public-duels/' + currentRoom + '/votes/' + myUid).set({ side: side, ts: Date.now() });
  var dvButtons = document.getElementById('dv-buttons');
  var dvVoted = document.getElementById('dv-voted');
  if (dvButtons) dvButtons.style.display = 'none';
  if (dvVoted) dvVoted.style.display = 'block';
}

function leaveDuel() {
  clearInterval(prepI);
  clearTimeout(botTimer);
  clearInterval(judgeI);

  currentRoom = null;
  curCase = '';
  myRole = '';

  if (window.db && currentRoom) {
    window.db.ref('rooms/' + currentRoom).off();
    window.db.ref('matchmaking/' + curCase).remove();
  }

  if (!me.onboarded) {
    buildSeriesGrid();
    go('series-select');
  } else {
    go('home');
  }
}

// ========== VERDICTS ==========
function loadPublicDuels() {
  if (!window.db) {
    var vdFeed = document.getElementById('vd-feed');
    if (vdFeed) vdFeed.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;">Hors ligne</div>';
    return;
  }

  window.db.ref('public-duels').orderByChild('publishedAt').limitToLast(20).once('value', function(s) {
    var d = s.val();
    var container = document.getElementById('vd-feed');
    if (!container) return;
    container.innerHTML = '';

    if (!d) {
      container.innerHTML = '<div style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;">Aucun verdict public</div>';
      return;
    }

    Object.keys(d).reverse().forEach(function(k) {
      var duel = d[k];
      var card = document.createElement('div');
      card.style.cssText = 'padding:16px;background:rgba(255,255,255,.02);border-radius:14px;border:1px solid rgba(255,255,255,.04);cursor:pointer;margin-bottom:12px;';
      card.onclick = function() { viewVerdict(k); };

      var defVotes = duel.votes ? (duel.votes.defense || 0) : 0;
      var accVotes = duel.votes ? (duel.votes.accusation || 0) : 0;
      var totalVotes = defVotes + accVotes;
      var defPct = totalVotes > 0 ? Math.round(defVotes / totalVotes * 100) : 0;
      var accPct = 100 - defPct;

      card.innerHTML =
        '<div style="font-size:16px;font-weight:800;color:#F0F0F5;margin-bottom:4px;">' + duel.caseName + '</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,.4);margin-bottom:8px;">' + duel.caseType + '</div>' +
        '<div style="font-size:13px;color:rgba(255,255,255,.7);margin-bottom:12px;line-height:1.4;">' + duel.question + '</div>' +
        '<div style="display:flex;gap:8px;">' +
          '<div style="flex:1;background:rgba(78,203,113,.1);border-radius:8px;padding:8px;text-align:center;color:#4ECB71;font-weight:700;">' + defPct + '%</div>' +
          '<div style="flex:1;background:rgba(255,71,87,.1);border-radius:8px;padding:8px;text-align:center;color:#FF4757;font-weight:700;">' + accPct + '%</div>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(255,255,255,.3);margin-top:8px;">' + new Date(duel.publishedAt).toLocaleDateString('fr-FR') + '</div>';
      container.appendChild(card);
    });
  });
}

function viewVerdict(k) {
  if (!window.db) return;
  window.db.ref('public-duels/' + k).once('value', function(s) {
    var d = s.val();
    if (!d) return;

    var defVotes = d.votes ? (d.votes.defense || 0) : 0;
    var accVotes = d.votes ? (d.votes.accusation || 0) : 0;

    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:1000;';
    modal.innerHTML =
      '<div style="background:#1c1c2e;padding:20px;border-radius:16px;max-width:300px;width:90%;">' +
        '<div style="font-size:18px;font-weight:900;color:#F0F0F5;margin-bottom:10px;">' + d.caseName + '</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:10px;">' + d.caseType + '</div>' +
        '<div style="font-size:14px;color:rgba(255,255,255,0.7);line-height:1.5;margin-bottom:16px;">' + d.question + '</div>' +
        '<div style="margin-bottom:16px;">' +
          '<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:6px;">Argument de la Défense</div>' +
          '<div style="padding:10px;background:rgba(78,203,113,.1);border-radius:8px;color:rgba(255,255,255,0.7);font-size:13px;">' + (d.defense ? d.defense.text : 'Aucun argument') + '</div>' +
        '</div>' +
        '<div style="margin-bottom:16px;">' +
          '<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);margin-bottom:6px;">Argument de l\'Accusation</div>' +
          '<div style="padding:10px;background:rgba(255,71,87,.1);border-radius:8px;color:rgba(255,255,255,0.7);font-size:13px;">' + (d.accusation ? d.accusation.text : 'Aucun argument') + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:16px;">' +
          '<div style="flex:1;background:rgba(78,203,113,.2);border-radius:8px;padding:8px;text-align:center;color:#4ECB71;font-weight:700;">' + defVotes + ' votes</div>' +
          '<div style="flex:1;background:rgba(255,71,87,.2);border-radius:8px;padding:8px;text-align:center;color:#FF4757;font-weight:700;">' + accVotes + ' votes</div>' +
        '</div>' +
        '<button onclick="this.parentElement.parentElement.remove()" class="btn bs" style="width:100%;">Fermer</button>' +
      '</div>';
    document.body.appendChild(modal);
  });
}

// ========== PROFILE ==========
function buildProfile() {
  if (!document.getElementById('p-name')) return;

  var pName = document.getElementById('p-name');
  var pAvatar = document.getElementById('p-avatar');
  var pCabName = document.getElementById('p-cab-name');
  var pCabWins = document.getElementById('p-cab-wins');
  var pCabAv = document.getElementById('p-cab-av');
  var pCabAvName = document.getElementById('p-cab-av-name');
  var pW = document.getElementById('p-w');
  var pD = document.getElementById('p-d');
  var pR = document.getElementById('p-r');

  if (pName) pName.textContent = me.name;
  if (pAvatar) pAvatar.textContent = (me.name || '?').substring(0, 2).toUpperCase();
  if (pCabName) pCabName.textContent = me.cabName || me.name + ' & associé';
  if (pCabWins) pCabWins.textContent = (me.wins || 0) + ' victoires collectives';
  if (pCabAv) pCabAv.textContent = (me.name || '?').substring(0, 2).toUpperCase();
  if (pCabAvName) pCabAvName.textContent = me.name || '';
  if (pW) pW.textContent = me.wins || 0;
  if (pD) pD.textContent = me.duels || 0;
  if (pR) pR.textContent = me.duels > 0 ? Math.round(me.wins / me.duels * 100) + '%' : '—';

  var ph = document.getElementById('p-history');
  if (!ph) return;
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
        hi.innerHTML =
          '<div style="position:absolute;left:0;top:10px;bottom:10px;width:3.5px;border-radius:2px;background:' + (role === 'Défense' ? '#4ECB71' : '#FF4757') + '"></div>' +
          '<div><div style="font-size:15px;font-weight:800;color:#F0F0F5">' + cName + '</div><div style="font-size:11px;color:rgba(255,255,255,.25);margin-top:2px">' + role + '</div></div>' +
          '<div style="font-size:12px;font-weight:700;color:#FF7A2E">En cours…</div>';
        ph.appendChild(hi);
      });
    });
  }
}

function loadProfile() {
  if (!window.db) return;
  window.db.ref('users/' + myUid).once('value', function(s) {
    var d = s.val();
    if (d) {
      me.wins = d.wins || 0;
      me.duels = d.duels || 0;
      me.xp = d.xp || 0;
      me.cabName = d.cabName || me.cabName;
      me.cabCode = d.cabCode || me.cabCode;
      me.cabId = d.cabId || me.cabId;
      me.favSeries = d.favSeries || [];
      buildProfile();
    }
  });
}

// ========== SERIES SELECT ==========
function buildSeriesGrid() {
  var grid = document.getElementById('series-grid');
  if (!grid) return;
  grid.innerHTML = '';

  var allSeries = {};
  caseKeys.forEach(function(k) {
    var c = CASES[k];
    if (c && c.t && !allSeries[c.t]) {
      allSeries[c.t] = true;
    }
  });

  var seriesList = Object.keys(allSeries).sort();
  seriesList.forEach(function(s) {
    var chip = document.createElement('div');
    chip.className = 'series-chip';
    chip.textContent = s;
    chip.onclick = function() {
      this.classList.toggle('sel');
    };
    grid.appendChild(chip);
  });
}

function finishSeriesSelect() {
  var selected = [];
  document.querySelectorAll('.series-chip.sel').forEach(function(el) {
    selected.push(el.textContent);
  });

  if (selected.length < 3) {
    alert('Sélectionnez au moins 3 séries !');
    return;
  }

  me.favSeries = selected;
  saveSession();
  startFirstDuel();
}

// ========== INIT ==========
function initMainApp() {
  loadSession();
  if (window.db) {
    window.db.ref('.info/connected').on('value', function(s) {
      if (s.val() === true) {
        var pendingProposal = localStorage.getItem('pendingProposal');
        if (pendingProposal) {
          var proposal = JSON.parse(pendingProposal);
          window.db.ref('proposals/' + proposal.id).set(proposal, function() {
            localStorage.removeItem('pendingProposal');
          });
        }
      }
    });
  }
}

// Chargement asynchrone de Firebase
function loadFirebase() {
  return new Promise((resolve, reject) => {
    const script1 = document.createElement('script');
    script1.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js';
      script2.onload = () => {
        try {
          firebase.initializeApp(config);
          window.db = firebase.database();
          resolve();
        } catch(e) {
          reject(e);
        }
      };
      script2.onerror = reject;
      document.head.appendChild(script2);
    };
    script1.onerror = reject;
    document.head.appendChild(script1);
  });
}

// Initialisation
async function initApp() {
  try {
    await loadFirebase();
    window.firebaseLoaded = true;
  } catch(error) {
    console.error("Erreur Firebase:", error);
    window.firebaseLoaded = false;
  }
  initMainApp();
}

initApp();