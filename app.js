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
// Liste complète des affaires (y compris les nouvelles)
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
  ebony1: K(1, 'Ebony vs Vanessa Jenkins', 'Power Book IV: Force', "Vanessa Jenkins accuse Ebony d’avoir manipulé son mari pour le faire tuer et couvrir son crime.", "Chicago. Le détective Markus Jenkins menait l’enquête sur le réseau d’Ebony LaBeija. Après sa mort dans des circonstances troubles, sa femme Vanessa, convaincue qu’Ebony a orchestré son assassinat, porte plainte. Ebony, elle, affirme que Markus était corrompu et qu’il a payé le prix de ses erreurs.", "Markus Jenkins était à deux doigts de faire tomber tout mon réseau. Il avait des preuves, des contacts, et il ne reculerait devant rien. Dans notre monde, c’est lui ou moi.", "Ebony a utilisé son argent, son influence, et ses contacts pour piéger Markus. Elle a détruit une famille entière pour protéger son business.")
};

// Initialise les affaires
for (var k in ALL_CASES) {
  CASES[k] = ALL_CASES[k];
  caseKeys.push(k);
}

// ========== FIREBASE ==========
function setUid(e) { myUid = e.replace(/[^a-z0-9]/gi, ''); }
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
  document.querySelectorAll('.P').forEach(function(e) { e.classList.remove('on'); });
  document.getElementById(p).classList.add('on');
  if (p === 'home') buildHome();
  if (p === 'verdicts') loadPublicDuels();
  if (p === 'profil') { buildProfile(); loadProfile(); }
  if (p === 'propose-character') loadProposals();
  if (p === 'admin-proposals') loadAdminProposals();
  window.scrollTo(0, 0);
}
function switchTab(p) { go(p); }

// ========== ONBOARDING ==========
function nextOnboardingStep(step) {
  for (var i = 1; i <= 4; i++) {
    document.getElementById('onboarding-step-' + i).style.display = i === step ? 'block' : 'none';
  }
}
function startFirstDuel() {
  me.onboarded = true;
  saveSession();
  var randomCaseKey = caseKeys[Math.floor(Math.random() * caseKeys.length)];
  joinDuel(randomCaseKey);
}

// ========== AUTH ==========
function hashPwd(p) { return p.split('').reduce(function(a, b) { a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff; return a; }, 0).toString(16); }
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
    go('login');
  }
}
function doLogout() {
  myUid = '';
  me = {};
  localStorage.removeItem('dbrief_uid');
  localStorage.removeItem('dbrief_me');
  go('login');
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
    // Mode hors ligne : vérifie le mot de passe localement
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
  container.innerHTML = '';

  // Ajoute le bouton "Proposer un Personnage" (déjà dans le HTML)
  // Ajoute un bouton Admin si l'utilisateur est admin
  if (isAdmin()) {
    var adminBtn = document.createElement('button');
    adminBtn.style.cssText = 'width:100%;padding:12px;border-radius:10px;background:rgba(255,122,46,0.2);border:1px solid #FF7A2E;color:#FF7A2E;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:10px;';
    adminBtn.textContent = '⚙️ Admin : Gérer les Propositions';
    adminBtn.onclick = function() { go('admin-proposals'); loadAdminProposals(); };
    container.prepend(adminBtn);
  }

  // Affiche les affaires par catégorie
  var categories = {};
  caseKeys.forEach(function(k) {
    var c = CASES[k];
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
  document.getElementById('dd-name').textContent = c.n;
  document.getElementById('dd-type').textContent = c.t;
  document.getElementById('dd-desc').textContent = c.dos;
}

function goToSubmit() {
  go('duel-submit');
  loadDuelSubmit();
}

function loadDuelSubmit() {
  var c = CASES[curCase];
  document.getElementById('ds-name').textContent = c.n;
  document.getElementById('ds-type').textContent = c.t;
  document.getElementById('ds-desc').textContent = c.q;
  document.getElementById('ds-arg').value = '';
  document.getElementById('ds-count').textContent = '0 / 300';
}

function updateCharCount() {
  var count = document.getElementById('ds-arg').value.length;
  document.getElementById('ds-count').textContent = count + ' / 300';
}

function submitArgument() {
  if (!me.onboarded) {
    me.onboarded = true;
    saveSession();
  }

  clearInterval(prepI);
  var t = document.getElementById('ds-arg').value.trim() || '(vide)';

  // Incrémente les victoires et l'XP
  me.duels = (me.duels || 0) + 1;
  me.wins = (me.wins || 0) + 1;
  me.xp = (me.xp || 0) + 50;
  updateStatus();
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

  document.getElementById('dv-name').textContent = (CASES[curCase] || {}).n || '';
  go('duel-vote');
  loadDuelVotes();
}

function loadDuelVotes() {
  var c = CASES[curCase] || {};
  document.getElementById('dv-name').textContent = c.n;
  document.getElementById('dv-type').textContent = c.t;
  document.getElementById('dv-desc').textContent = c.q;

  if (window.db) {
    window.db.ref('rooms/' + currentRoom + '/arguments').on('value', function(s) {
      var a = s.val();
      if (!a) return;

      if (a.defense) {
        document.getElementById('dv-def-arg').textContent = a.defense.text;
        document.getElementById('dv-def-name').textContent = a.defense.name || 'Anonyme';
      }
      if (a.accusation) {
        document.getElementById('dv-acc-arg').textContent = a.accusation.text;
        document.getElementById('dv-acc-name').textContent = a.accusation.name || 'Anonyme';
      }
    });
  } else {
    // Mode hors ligne : simule des arguments
    document.getElementById('dv-def-arg').textContent = c.bd || 'Argument pour la défense';
    document.getElementById('dv-acc-arg').textContent = c.ba || 'Argument pour l\'accusation';
    document.getElementById('dv-def-name').textContent = 'Joueur 1';
    document.getElementById('dv-acc-name').textContent = 'Joueur 2';
  }
}

function vote(side) {
  if (!window.db) {
    document.getElementById('dv-buttons').style.display = 'none';
    document.getElementById('dv-voted').style.display = 'block';
    return;
  }

  window.db.ref('public-duels/' + currentRoom + '/votes/' + myUid).set({ side: side, ts: Date.now() });
  document.getElementById('dv-buttons').style.display = 'none';
  document.getElementById('dv-voted').style.display = 'block';
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
    document.getElementById('vd-list').innerHTML = '<div style="text-align:center;color:var(--text2);">Hors ligne</div>';
    return;
  }

  window.db.ref('public-duels').orderByChild('publishedAt').limitToLast(20).once('value', function(s) {
    var d = s.val();
    var container = document.getElementById('vd-list');
    container.innerHTML = '';

    if (!d) {
      container.innerHTML = '<div style="text-align:center;color:var(--text2);">Aucun verdict public</div>';
      return;
    }

    Object.keys(d).reverse().forEach(function(k) {
      var duel = d[k];
      var card = document.createElement('div');
      card.style.cssText = 'padding:16px;background:rgba(255,255,255,.02);border-radius:14px;border:1px solid rgba(255,255,255,.04);cursor:pointer;';
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
    var totalVotes = defVotes + accVotes;

    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:1000;';
    modal.innerHTML =
      '<div style="background:var(--bg3);padding:20px;border-radius:16px;max-width:300px;width:90%;">' +
        '<div style="font-size:18px;font-weight:900;color:#F0F0F5;margin-bottom:10px;">' + d.caseName + '</div>' +
        '<div style="font-size:12px;color:var(--text2);margin-bottom:10px;">' + d.caseType + '</div>' +
        '<div style="font-size:14px;color:var(--text3);line-height:1.5;margin-bottom:16px;">' + d.question + '</div>' +
        '<div style="margin-bottom:16px;">' +
          '<div style="font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;">Argument de la Défense</div>' +
          '<div style="padding:10px;background:rgba(78,203,113,.1);border-radius:8px;color:var(--text3);font-size:13px;">' + (d.defense ? d.defense.text : 'Aucun argument') + '</div>' +
        '</div>' +
        '<div style="margin-bottom:16px;">' +
          '<div style="font-size:12px;font-weight:700;color:var(--text3);margin-bottom:6px;">Argument de l\'Accusation</div>' +
          '<div style="padding:10px;background:rgba(255,71,87,.1);border-radius:8px;color:var(--text3);font-size:13px;">' + (d.accusation ? d.accusation.text : 'Aucun argument') + '</div>' +
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

  document.getElementById('p-name').textContent = me.name;
  document.getElementById('p-avatar').textContent = (me.name || '?').substring(0, 2).toUpperCase();
  document.getElementById('p-cab-name').textContent = me.cabName || me.name + ' & associé';
  document.getElementById('p-cab-wins').textContent = (me.wins || 0) + ' victoires collectives';
  document.getElementById('p-cab-av').textContent = (me.name || '?').substring(0, 2).toUpperCase();
  document.getElementById('p-cab-av-name').textContent = me.name || '';
  document.getElementById('p-w').textContent = me.wins || 0;
  document.getElementById('p-d').textContent = me.duels || 0;
  document.getElementById('p-r').textContent = me.duels > 0 ? Math.round(me.wins / me.duels * 100) + '%' : '—';

  updateStatus();
  var statusBadge = document.getElementById('p-status-badge');
  var progressBar = document.getElementById('p-progress-bar');
  var currentWins = document.getElementById('p-current-wins');
  var nextStatus = document.getElementById('p-next-status');
  var statusText = document.getElementById('p-status');

  statusBadge.className = 'status-badge status-' + me.status;
  statusBadge.textContent = me.status.toUpperCase();
  statusText.textContent = me.status.charAt(0).toUpperCase() + me.status.slice(1);

  var nextThreshold = me.status === 'junior' ? 5 : me.status === 'confirmed' ? 15 : 15;
  var progress = (me.wins / nextThreshold) * 100;
  progressBar.style.width = progress + '%';

  currentWins.textContent = me.wins + '/' + nextThreshold;
  nextStatus.textContent = me.status === 'junior' ? 'CONFIRMÉ' : me.status === 'confirmed' ? 'EXPERT' : 'EXPERT';

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
      me.status = d.status || 'junior';
      me.favSeries = d.favSeries || [];
      updateStatus();
      buildProfile();
    }
  });
}

function updateStatus() {
  if (me.wins >= 15) {
    me.status = 'expert';
  } else if (me.wins >= 5) {
    me.status = 'confirmed';
  } else {
    me.status = 'junior';
  }
  saveSession();
}

// ========== PROPOSE CHARACTER ==========
function proposeCharacter() {
  var name = document.getElementById('propose-name').value.trim();
  var category = document.getElementById('propose-category').value;
  var reason = document.getElementById('propose-reason').value.trim();

  if (!name || !category || !reason) {
    showProposeMessage("Veuillez remplir tous les champs obligatoires (*).", "error");
    return;
  }

  var proposalId = 'prop_' + Date.now().toString(36) + '_' + myUid;
  var proposal = {
    id: proposalId,
    name: name,
    category: category,
    reason: reason,
    author: me.name || "Anonyme",
    authorUid: myUid,
    status: "pending",
    createdAt: Date.now()
  };

  if (window.db) {
    window.db.ref('proposals/' + proposalId).set(proposal, function(error) {
      if (error) {
        showProposeMessage("Erreur lors de la soumission. Veuillez réessayer.", "error");
      } else {
        showProposeMessage("✅ Proposition soumise avec succès ! Elle sera validée sous 24-48h.", "success");
        document.getElementById('propose-character-form').reset();
        loadProposals();
      }
    });
  } else {
    localStorage.setItem('pendingProposal', JSON.stringify(proposal));
    showProposeMessage("✅ Proposition enregistrée localement. Elle sera envoyée dès que la connexion sera rétablie.", "success");
    document.getElementById('propose-character-form').reset();
  }
}

function showProposeMessage(message, type) {
  var messageEl = document.getElementById('propose-message');
  messageEl.textContent = message;
  messageEl.style.display = 'block';
  messageEl.style.background = type === 'error' ? 'rgba(255, 71, 87, 0.1)' : 'rgba(78, 203, 113, 0.1)';
  messageEl.style.color = type === 'error' ? '#FF4757' : '#4ECB71';
  messageEl.style.border = type === 'error' ? '1px solid #FF4757' : '1px solid #4ECB71';

  setTimeout(function() {
    messageEl.style.display = 'none';
  }, 5000);
}

function loadProposals() {
  if (!window.db) {
    document.getElementById('propose-list-container').innerHTML = '<div style="text-align: center; color: rgba(255, 255, 255, 0.4);">Hors ligne</div>';
    return;
  }

  var container = document.getElementById('propose-list-container');
  container.innerHTML = '<div style="text-align: center; color: rgba(255, 255, 255, 0.4);">Chargement...</div>';

  window.db.ref('proposals').orderByChild('createdAt').limitToLast(10).once('value', function(snap) {
    container.innerHTML = '';
    var proposals = snap.val();
    if (!proposals) {
      container.innerHTML = '<div style="text-align: center; color: rgba(255, 255, 255, 0.4);">Aucune proposition récente.</div>';
      return;
    }

    Object.keys(proposals).reverse().forEach(function(key) {
      var proposal = proposals[key];
      var item = document.createElement('div');
      item.className = 'proposal-item';

      var statusClass = proposal.status === 'approved' ? 'status-approved' :
                       proposal.status === 'rejected' ? 'status-rejected' : 'status-pending';
      var statusText = proposal.status === 'approved' ? '✅ Validée' :
                      proposal.status === 'rejected' ? '❌ Rejetée' : '⏳ En attente';

      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #F0F0F5;">${proposal.name}</div>
            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">${proposal.category}</div>
          </div>
          <span class="proposal-status ${statusClass}">${statusText}</span>
        </div>
        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.4);">
          "${proposal.reason}"
        </div>
        <div style="font-size: 10px; color: rgba(255, 255, 255, 0.3); margin-top: 6px;">
          Proposé par ${proposal.author} • ${new Date(proposal.createdAt).toLocaleDateString('fr-FR')}
        </div>
      `;
      container.appendChild(item);
    });
  });
}

// ========== ADMIN PROPOSALS ==========
function isAdmin() {
  // Remplace par ton UID Firebase
  var adminUids = ['TON_UID_FIREBASE']; // Exemple: ['abc123']
  return adminUids.includes(myUid);
}

function loadAdminProposals() {
  if (!window.db || !isAdmin()) return;

  var container = document.getElementById('admin-proposals-list');
  container.innerHTML = '<div style="text-align: center; color: rgba(255, 255, 255, 0.4);">Chargement...</div>';

  window.db.ref('proposals').orderByChild('createdAt').once('value', function(snap) {
    container.innerHTML = '';
    var proposals = snap.val();
    if (!proposals) {
      container.innerHTML = '<div style="text-align: center; color: rgba(255, 255, 255, 0.4);">Aucune proposition à modérer.</div>';
      return;
    }

    Object.keys(proposals).reverse().forEach(function(key) {
      var proposal = proposals[key];
      if (proposal.status !== 'pending') return;

      var item = document.createElement('div');
      item.className = 'proposal-item';

      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div>
            <div style="font-size: 16px; font-weight: 700; color: #F0F0F5;">${proposal.name}</div>
            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">${proposal.category}</div>
          </div>
          <div style="font-size: 12px; color: #FFD23F;">⏳ En attente</div>
        </div>
        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.4); margin-bottom: 10px;">
          "${proposal.reason}"
        </div>
        <div style="font-size: 10px; color: rgba(255, 255, 255, 0.3); margin-bottom: 12px;">
          Proposé par ${proposal.author} • ${new Date(proposal.createdAt).toLocaleDateString('fr-FR')}
        </div>
        <div class="admin-actions">
          <button onclick="approveProposal('${key}')" class="admin-btn approve">✅ Valider</button>
          <button onclick="rejectProposal('${key}')" class="admin-btn reject">❌ Rejeter</button>
        </div>
      `;
      container.appendChild(item);
    });
  });
}

function approveProposal(proposalId) {
  if (!window.db || !isAdmin()) return;

  window.db.ref('proposals/' + proposalId).once('value', function(snap) {
    var proposal = snap.val();
    if (!proposal) return;

    // Crée une nouvelle affaire à partir de la proposition
    var caseId = 'user_' + Date.now().toString(36);
    var newCase = {
      n: proposal.name + ' (Proposé par ' + proposal.author + ')',
      t: proposal.category,
      q: proposal.reason,
      dos: proposal.reason,
      bd: "À vous de défendre ce personnage !",
      ba: "À vous de l'accuser !",
      vd: 10800000 // 3h par défaut
    };

    // Ajoute la nouvelle affaire à CASES et caseKeys
    CASES[caseId] = K(1, newCase.n, newCase.t, newCase.q, newCase.dos, newCase.bd, newCase.ba);
    caseKeys.push(caseId);

    // Met à jour le statut de la proposition
    window.db.ref('proposals/' + proposalId).update({
      status: 'approved',
      approvedAt: Date.now(),
      approvedBy: me.name || myUid,
      caseId: caseId // Stocke l'ID de l'affaire créée
    });

    // Recharge les listes
    loadAdminProposals();
    loadProposals();
    buildHome(); // Recharge l'accueil pour afficher la nouvelle affaire

    alert("✅ Proposition validée et ajoutée aux affaires !");
  });
}

function rejectProposal(proposalId) {
  if (!window.db || !isAdmin()) return;

  window.db.ref('proposals/' + proposalId).update({
    status: 'rejected',
    rejectedAt: Date.now(),
    rejectedBy: me.name || myUid
  });

  loadAdminProposals();
  loadProposals();
  alert("❌ Proposition rejetée.");
}

// ========== INIT ==========
function initMainApp() {
  loadSession();
  if (window.db) {
    window.db.ref('.info/connected').on('value', function(s) {
      if (s.val() === true) {
        // Synchronise les propositions locales si hors ligne précédemment
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

// Initialise l'app au chargement
window.onload = initMainApp;