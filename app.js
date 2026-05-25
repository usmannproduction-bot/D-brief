
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

// ======================
// CASES (AFFAIRES)
// ======================
function K(x, n, t, q, dos, bd, ba, j) {
  var p = x == 2 ? [120, 240, 3600000] : x == 3 ? [300, 900, 21600000] : x == 4 ? [300, 600, 21600000] : [180, 360, 10800000];
  return {
    pt: p[0], wt: p[1], vd: p[2], n: n, t: t, q: q,
    dos: dos || q,
    bd: bd || "L'accusé a agi selon ses convictions. Chaque décision était un choix de survie, pas de trahison.",
    ba: ba || "Les faits sont accablants. Aucune excuse ne peut justifier les dommages causés aux victimes.",
    jm: j || false
  };
}

var ALL_CASES = {
  ghost1: K(1, 'Ghost vs Tommy', 'Power', "Tommy accuse Ghost d'avoir trahi la rue pour enfiler un costume de politicien", "New York, Queens. James St. Patrick, alias Ghost, a grandi dans les rues avec Tommy Egan. Ensemble ils ont bâti un empire de drogue depuis le bas. Ghost rêvait d'autre chose. Il a ouvert un club, Truth, fréquenté les politiciens, courtisé Angela Valdes, procureure fédérale. Il voulait devenir légitime. Tommy lui reproche d'avoir utilisé la rue comme tremplin avant de l'abandonner dès que l'ascenseur social a daigné s'ouvrir.", "Ghost n'a pas trahi Tommy, il a évolué. Tommy confond loyauté et prison mentale. Rester dans la rue par fidélité c'est condamner son intelligence à ne jamais servir.", "Ghost a utilisé Tommy comme bouclier, comme exécutant, comme bouc émissaire. Chaque fois que la situation devenait dangereuse, c'est Tommy qui prenait les risques."),
  blood1: K(1, 'Sarah vs Kemi', 'Blood Sisters', "Kemi accuse Sarah d'avoir caché un meurtre et fait d'elle une complice malgré elle", "Lagos, Nigeria. Le soir du mariage de Kemi, Kola, son fiancé violent et possessif, est mort. Sarah a dissimulé les faits, pris des décisions à la place de Kemi, et l'a engagée dans une spirale de mensonges et de danger mortel.", "Kola était un homme violent qui aurait tué Kemi. Sarah a agi dans l'urgence pour sauver sa meilleure amie.", "Sarah a menti à Kemi pendant des semaines. Elle l'a transformée en fugitive, en complice d'un crime qu'elle n'a pas commis."),
  tommy1: K(1, 'Tommy vs Arthur', 'Peaky Blinders', "Arthur accuse Tommy d'avoir sacrifié chaque membre de la famille Shelby sur l'autel de son ambition", "Birmingham, Small Heath, après la Première Guerre mondiale. Tommy Shelby a transformé le chaos en empire. Il a utilisé la douleur de ses frères, leur loyauté aveugle, leur incapacité à refuser une mission comme matière première de son ascension.", "Sans Tommy, les Shelby seraient restés des petits criminels de banlieue. Tommy a donné à sa famille une puissance qu'ils n'auraient jamais atteinte seuls.", "Tommy a regardé Arthur se noyer dans la violence et la drogue, et il a continué à lui donner des missions parce qu'Arthur était utile."),
  lupin1: K(1, 'Assane vs Hubert', 'Lupin', "Hubert accuse Assane d'être un criminel romantique qui met en danger ceux qu'il prétend protéger", "Paris. Babakar Diop, père d'Assane, a été accusé à tort du vol d'un collier par Hubert Pellegrini. Il est mort en prison. Assane a consacré sa vie à la vengeance, mettant en danger sa femme et son fils.", "Assane n'avait pas accès aux voies normales de la justice. Face à une injustice systémique, seule une réponse hors système pouvait fonctionner.", "Assane a mis sa femme en danger, séparé son fils de ses parents. La mémoire de son père est devenue un alibi pour un mode de vie criminel."),
  valide1: K(1, 'Apash vs William', 'Validé', "William accuse Apash d'avoir vendu son authenticité contre des streams et trahi ceux qui l'ont construit", "Paris, banlieue. Apash est né dans la cité. Son rap parlait de la rue, de la galère, de ceux qui restent. William était là depuis le début.", "Apash a réussi là où des milliers ont échoué. Évoluer n'est pas trahir.", "Apash a bâti sa carrière sur la promesse implicite d'une parole vraie. Il a monétisé cette confiance puis changé de monde sans se retourner.")
};

var caseKeys = Object.keys(ALL_CASES);
caseKeys.forEach(function(k) { CASES[k] = ALL_CASES[k]; });
var allSeries = [];
caseKeys.forEach(function(k) {
  var t = CASES[k].t;
  if (allSeries.indexOf(t) === -1) allSeries.push(t);
});

// ======================
// FONCTIONS UTILITAIRES
// ======================
function go(id) {
  document.querySelectorAll('.P').forEach(function(p) { p.classList.remove('on'); });
  document.getElementById(id).classList.add('on');
}

function switchTab(id) {
  // Réinitialise les variables si on quitte un duel
  if (currentRoom && id !== 'home' && id !== 'verdicts' && id !== 'profil') {
    leaveDuel();
  }
  go(id);
  if (id === 'profil') { buildProfile(); loadProfile(); }
  if (id === 'verdicts') loadPublicDuels();
  if (id === 'home') loadFeed();
}

function setUid(e) {
  myUid = e.replace(/[^a-zA-Z0-9]/g, '_');
}

function saveSession() {
  try { localStorage.setItem('dbrief_user', JSON.stringify(Object.assign({ uid: myUid }, me))); } catch(e) {}
}

function hashPwd(s) {
  var h = 0;
  for (var i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h = h & h;
  }
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

function genCode() {
  return 'CAB-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

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
// FONCTION POUR DÉMARRER LE PREMIER DUEL
// ======================
function startFirstDuel() {
  // 1. Sélectionne une affaire aléatoire
  var randomCaseKey = caseKeys[Math.floor(Math.random() * caseKeys.length)];
  curCase = randomCaseKey;
  var c = CASES[randomCaseKey];

  // 2. Crée une salle de duel
  currentRoom = 'onboarding_' + Date.now().toString(36);
  myRole = 'defense';

  // 3. Affiche le dossier de l'affaire
  document.getElementById('dd-name').textContent = c.n;
  document.getElementById('dd-dos').textContent = c.dos || c.q;
  document.getElementById('dd-series-tag').textContent = c.t;
  var cn = c.n.split(' vs ');
  document.getElementById('dd-role').textContent = 'DÉFENSE — Vous défendez ' + cn[1];
  document.getElementById('dd-role').style.color = '#4ECB71';
  go('duel-dossier');

  // 4. Lance le timer
  var tot = c.pt || 180, left = tot;
  clearInterval(prepI);
  uR('dd-ring', 1);
  document.getElementById('dd-timer').textContent = fT(left);
  prepI = setInterval(function() {
    left--;
    if (left <= 0) {
      clearInterval(prepI);
      goToSubmitOnboarding();
      return;
    }
    document.getElementById('dd-timer').textContent = fT(left);
    uR('dd-ring', left / tot);
  }, 1000);

  // 5. Ajoute un bot après 5 secondes
  setTimeout(function() {
    document.getElementById('dw-av-acc').textContent = 'B';
    document.getElementById('dw-av-acc').style.borderStyle = 'solid';
    document.getElementById('dw-av-acc').style.borderColor = '#FF4757';
    document.getElementById('dw-av-acc').style.color = '#FF4757';
    document.getElementById('dw-name-acc').textContent = 'Bot D\'brief';
    document.getElementById('dw-status').textContent = 'Bot rejoint !';

    setTimeout(function() {
      if (window.db) {
        window.db.ref('rooms/' + currentRoom + '/arguments/accusation').set({
          text: c.ba || "Argument par défaut de l'accusation.",
          uid: 'bot',
          name: 'Bot D\'brief',
          ts: Date.now()
        });
      }
    }, 2000);
  }, 5000);
}

// ======================
// FONCTIONS D'ONBOARDING
// ======================
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
    if (left <= 0) {
      clearInterval(prepI);
      submitOnboarding();
      return;
    }
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
  document.getElementById('dv-acc-name').textContent = 'Bot D\'brief';
  go('duel-vote');

  if (window.db) {
    window.db.ref('rooms/' + currentRoom + '/arguments/defense').set({
      text: t,
      uid: myUid,
      name: me.name || '',
      ts: Date.now()
    });
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
  me.onboarded = true;
  saveSession();
  buildHome();
  buildProfile();
  go('home');
}

// ======================
// FONCTION LEAVE DUEL (CORRIGÉE)
// ======================
function leaveDuel() {
  // 1. Arrête tous les timers
  clearInterval(prepI);
  clearTimeout(botTimer);
  clearInterval(judgeI);

  // 2. Réinitialise les variables globales
  currentRoom = null;
  curCase = '';
  myRole = '';

  // 3. Supprime les écouteurs Firebase
  if (window.db && currentRoom) {
    try {
      window.db.ref('rooms/' + currentRoom).off();
      window.db.ref('matchmaking/' + curCase).remove();
    } catch(e) {
      console.log("Erreur Firebase (non critique) :", e);
    }
  }

  // 4. Retourne à la page précédente
  if (!me.onboarded) {
    buildSeriesGrid();
    go('series-select');
  } else {
    go('home');
  }
}

// ======================
// FONCTIONS DE DUEL
// ======================
function joinDuelAs(id, role) {
  myRole = role;
  joinDuel(id);
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
      if (jLeft <= 0) {
        clearInterval(judgeI);
        if (!judgeChoice) judgeChoice = 'COUPABLE';
        judgeDecision();
        return;
      }
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
  document.getElementById('dw-status').textContent = 'Recherche d\'un adversaire…';
  document.getElementById('dw-myrole').style.display = 'none';
  go('duel-wait');

  if (!window.db) return;

  window.db.ref('matchmaking/' + id).once('value', function(snap) {
    var mk = snap.val();
    if (mk && mk.uid !== myUid && mk.status === 'waiting' && mk.role !== chosenRole) {
      currentRoom = mk.roomId;
      myRole = chosenRole;
      var oppRole = chosenRole === 'defense' ? 'accusation' : 'defense';
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
            window.db.ref('rooms/' + currentRoom + '/roles/' + oppRole2).set({
              uid: 'bot',
              name: 'Bot D\'brief'
            });
            setTimeout(function() {
              var c2 = CASES[curCase];
              var botArg = chosenRole === 'defense' ? c2.ba : c2.bd;
              window.db.ref('rooms/' + currentRoom + '/arguments/' + oppRole2).set({
                text: botArg,
                uid: 'bot',
                name: 'Bot D\'brief',
                ts: Date.now()
              });
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
  document.getElementById('dw-myrole').textContent = 'Vous êtes l\'ACCUSATION';
  document.getElementById('dw-myrole').style.display = 'block';
  document.getElementById('dw-myrole').style.color = '#FF4757';
}

function startDuel() {
  var c = CASES[curCase];
  if (!c) return;
  document.getElementById('dd-name').textContent = c.n;
  document.getElementById('dd-dos').textContent = c.dos || c.q;
  document.getElementById('dd-series-tag').textContent = c.t;
  var cn = c.n.split(' vs ');
  document.getElementById('dd-role').textContent = myRole === 'defense' ? 'DÉFENSE — Vous défendez ' + cn[0] : 'ACCUSATION — Vous accusez ' + cn[0];
  document.getElementById('dd-role').style.color = myRole === 'defense' ? '#4ECB71' : '#FF4757';
  go('duel-dossier');
  var tot = c.pt || 180, left = tot;
  clearInterval(prepI);
  uR('dd-ring', 1);
  document.getElementById('dd-timer').textContent = fT(left);
  prepI = setInterval(function() {
    left--;
    if (left <= 0) {
      clearInterval(prepI);
      goToSubmit();
      return;
    }
    document.getElementById('dd-timer').textContent = fT(left);
    uR('dd-ring', left / tot);
  }, 1000);
  document.getElementById('dd-timer').textContent = fT(left);
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
  var tot = (c || {}).wt || 360, left = tot;
  clearInterval(prepI);
  uR('ds-ring', 1);
  prepI = setInterval(function() {
    left--;
    if (left <= 0) {
      clearInterval(prepI);
      submitArgument();
    }
    document.getElementById('ds-timer').textContent = fT(left);
    uR('ds-ring', left / tot);
  }, 1000);
  document.getElementById('ds-timer').textContent = fT(left);

  if (window.db) {
    window.db.ref('rooms/' + currentRoom + '/arguments').on('value', function(s) {
      var a = s.val() || {};
      var opp = myRole === 'defense' ? 'accusation' : 'defense';
      if (a[opp]) {
        var st = document.getElementById('ds-opp-status');
        st.style.display = 'block';
        st.textContent = '● Adversaire a soumis !';
      }
      if (a.defense) {
        document.getElementById('dv-def-arg').textContent = a.defense.text;
        document.getElementById('dv-def-name').textContent = a.defense.name || 'Défense';
      }
      if (a.accusation) {
        document.getElementById('dv-acc-arg').textContent = a.accusation.text;
        document.getElementById('dv-acc-name').textContent = a.accusation.name || 'Accusation';
      }
    });
  }
}

function submitArgument() {
  if (!me.onboarded) {
    submitOnboarding();
    return;
  }
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
      caseName: c.n,
      caseType: c.t,
      question: c.q,
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

// ======================
// FONCTIONS DE CONNEXION
// ======================
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
  me.wins = 0;
  me.duels = 0;

  if (code) {
    err.style.display = 'block';
    err.textContent = 'Recherche du cabinet...';
    err.style.color = '#FFD23F';
    waitDb(function() {
      window.db.ref('cabinets').orderByChild('code').equalTo(code).once('value', function(snap) {
        var cabs = snap.val();
        if (!cabs) {
          err.textContent = 'Code introuvable';
          err.style.color = '#FF4757';
          return;
        }
        var cid = Object.keys(cabs)[0];
        var cb = cabs[cid];
        if (cb.members && Object.keys(cb.members).length >= 5) {
          err.textContent = 'Cabinet complet (max 5)';
          err.style.color = '#FF4757';
          return;
        }
        me.cabId = cid;
        me.cabName = cb.name;
        me.cabCode = cb.code;
        window.db.ref('cabinets/' + cid + '/members/' + myUid).set({ name: n, joined: Date.now() });
        window.db.ref('users/' + myUid).set({
          name: n, email: e, password: hashPwd(p),
          wins: 0, duels: 0, cabId: cid, cabName: cb.name, cabCode: cb.code, joined: Date.now()
        });
        err.style.display = 'none';
        saveSession();
        go('onboarding');
      });
    });
    return;
  }

  var cc = genCode();
  var cn = cab || n + ' & associé';
  me.cabCode = cc;
  me.cabName = cn;
  me.cabId = myUid;
  saveSession();

  waitDb(function() {
    var mbrs = {};
    mbrs[myUid] = { name: n, joined: Date.now() };
    window.db.ref('cabinets/' + myUid).set({ name: cn, code: cc, owner: myUid, members: mbrs });
    window.db.ref('users/' + myUid).set({
      name: n, email: e, password: hashPwd(p),
      wins: 0, duels: 0, cabId: myUid, cabName: cn, cabCode: cc, joined: Date.now()
    });
  });

  err.style.display = 'none';
  go('onboarding');
}

function doLogin() {
  var e = document.getElementById('li-e').value.trim();
  var p = document.getElementById('li-p').value;
  var err = document.getElementById('li-err');

  if (!e || p.length < 6) {
    err.style.display = 'block';
    err.textContent = 'Remplissez tout';
    err.style.color = '#FF4757';
    return;
  }

  setUid(e);

  var ls = localStorage.getItem('dbrief_user');
  if (ls) {
    try {
      var u = JSON.parse(ls);
      if (u.email === e) {
        Object.assign(me, u);
        if (u.uid) myUid = u.uid;
        buildHome();
        buildProfile();
        saveSession();
        if (urlRoom) handleUrlRoom();
        else go('home');
        return;
      }
    } catch(ex) {}
  }

  if (!window.db) {
    err.style.display = 'block';
    err.textContent = 'Chargement...';
    err.style.color = '#FFD23F';
    var retries = 0;
    var waitDb = setInterval(function() {
      retries++;
      if (window.db) {
        clearInterval(waitDb);
        tryFirebaseLogin(e, p, err);
      } else if (retries > 30) {
        clearInterval(waitDb);
        err.textContent = 'Réseau indisponible';
        err.style.color = '#FF4757';
      }
    }, 500);
    return;
  }

  tryFirebaseLogin(e, p, err);
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
      me.name = d.name || '';
      me.email = d.email;
      me.wins = d.wins || 0;
      me.duels = d.duels || 0;
      me.cabId = d.cabId || '';
      me.cabName = d.cabName || '';
      me.cabCode = d.cabCode || '';
      me.favSeries = d.favSeries || [];
      me.onboarded = true;
      err.style.display = 'none';
      buildHome();
      buildProfile();
      saveSession();
      if (urlRoom) handleUrlRoom();
      else go('home');
    } else {
      window.db.ref('users').orderByChild('email').equalTo(e).once('value', function(snap2) {
        var all = snap2.val();
        if (all) {
          var uid2 = Object.keys(all)[0];
          var d2 = all[uid2];
          if (d2.password && d2.password !== hashPwd(p)) {
            err.textContent = 'Mot de passe incorrect';
            err.style.color = '#FF4757';
            return;
          }
          myUid = uid2;
          me.name = d2.name || '';
          me.email = d2.email;
          me.wins = d2.wins || 0;
          me.duels = d2.duels || 0;
          me.cabId = d2.cabId || '';
          me.cabName = d2.cabName || '';
          me.cabCode = d2.cabCode || '';
          me.favSeries = d2.favSeries || [];
          me.onboarded = true;
          err.style.display = 'none';
          buildHome();
          buildProfile();
          saveSession();
          if (urlRoom) handleUrlRoom();
          else go('home');
        } else {
          err.textContent = 'Compte introuvable';
          err.style.color = '#FF4757';
        }
      });
    }
  });
}

// ======================
// FONCTIONS DE PROFIL
// ======================
function buildProfile() {
  document.getElementById('p-name').textContent = me.name;
  document.getElementById('p-avatar').textContent = (me.name || '?').substring(0, 2).toUpperCase();
  document.getElementById('p-cab-name').textContent = me.cabName || me.name + ' & associé';
  document.getElementById('p-cab-wins').textContent = (me.wins || 0) + ' victoires collectives';
  document.getElementById('p-cab-av').textContent = (me.name || '?').substring(0, 2).toUpperCase();
  document.getElementById('p-cab-av-name').textContent = me.name || '';
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
      me.cabName = d.cabName || me.cabName;
      me.cabCode = d.cabCode || me.cabCode;
      me.cabId = d.cabId || me.cabId;
      buildProfile();
    }
  });
}

function logout() {
  localStorage.removeItem('dbrief_user');
  location.reload();
}

// ======================
// FONCTIONS DE VERDICTS
// ======================
function loadPublicDuels() {
  if (!window.db) return;
  window.db.ref('public-duels').orderByChild('publishedAt').limitToLast(30).on('value', function(s) {
    var d = s.val(), feed = document.getElementById('vd-feed');
    feed.innerHTML = '';
    if (!d) {
      feed.innerHTML = '<div style="text-align:center;padding:60px 24px;color:rgba(255,255,255,.15);font-size:14px">Aucun verdict pour l\'instant.<br>Lance un duel !</div>';
      return;
    }
    Object.keys(d).reverse().forEach(function(k) {
      var v = d[k];
      var cKey = k.split('_')[0];
      var validCase = false;
      for (var ck in CASES) {
        if (v.caseName === CASES[ck].n || ck === cKey) { validCase = true; break; }
      }
      if (!validCase) return;

      var votes = v.votes ? Object.keys(v.votes).length : 0;
      var rem = v.voteEnds ? v.voteEnds - Date.now() : 0;
      var isLive = rem > 0;
      var ago = Math.floor((Date.now() - (v.publishedAt || 0)) / 60000);
      var timeStr = ago < 60 ? ago + 'min' : Math.floor(ago / 60) + 'h';
      var defVotes = 0, accVotes = 0;
      if (v.votes) {
        Object.keys(v.votes).forEach(function(uid) {
          if (v.votes[uid].side === 'defense') defVotes++;
          else accVotes++;
        });
      }
      var total = defVotes + accVotes || 1;
      var defPct = Math.round(defVotes / total * 100);
      var accPct = 100 - defPct;

      var card = document.createElement('div');
      card.style.cssText = 'padding:20px;border-bottom:1px solid rgba(255,255,255,.04);position:relative';
      var html = '';
      if (isLive) html += '<div style="position:absolute;top:20px;right:20px;padding:4px 10px;border-radius:10px;background:rgba(255,122,46,.08);border:1px solid rgba(255,122,46,.15);font-size:10px;font-weight:700;color:#FF7A2E">EN COURS</div>';
      html +=
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
          '<span style="font-size:11px;font-weight:800;color:#FF7A2E;letter-spacing:2px">' + (v.caseType || '').toUpperCase() + '</span>' +
          '<span style="font-size:11px;color:rgba(255,255,255,.2)">' + timeStr + '</span>' +
        '</div>' +
        '<div style="font-size:22px;font-weight:900;color:#fff;margin-bottom:14px;line-height:1.1">' + (v.caseName || '') + '</div>' +
        '<div style="display:flex;gap:8px;margin-bottom:12px">' +
          '<div style="flex:1;padding:12px;background:rgba(78,203,113,.04);border:1px solid rgba(78,203,113,.1);border-radius:12px">' +
            '<div style="font-size:9px;font-weight:800;color:#4ECB71;letter-spacing:2px;margin-bottom:5px">DÉFENSE · ' + (v.defense ? v.defense.name : '—') + '</div>' +
            '<div style="font-family:\'Cormorant Garamond\',serif;font-size:13px;font-style:italic;color:rgba(255,255,255,.4);line-height:1.5">' + (v.defense ? v.defense.text : '...') + '</div>' +
          '</div>' +
          '<div style="flex:1;padding:12px;background:rgba(255,71,87,.04);border:1px solid rgba(255,71,87,.1);border-radius:12px">' +
            '<div style="font-size:9px;font-weight:800;color:#FF4757;letter-spacing:2px;margin-bottom:5px">ACCUSATION · ' + (v.accusation ? v.accusation.name : '—') + '</div>' +
            '<div style="font-family:\'Cormorant Garamond\',serif;font-size:13px;font-style:italic;color:rgba(255,255,255,.4);line-height:1.5">' + (v.accusation ? v.accusation.text : '...') + '</div>' +
          '</div>' +
        '</div>';
      if (votes > 0) {
        html += '<div style="display:flex;height:4px;border-radius:2px;overflow:hidden;margin-bottom:10px">' +
          '<div style="width:' + defPct + '%;background:#4ECB71"></div>' +
          '<div style="width:' + accPct + '%;background:#FF4757"></div>' +
        '</div>';
      }
      if (v.result && v.result.decision) {
        html += '<div style="font-size:22px;font-weight:900;color:' + (v.result.decision === 'COUPABLE' ? '#FF4757' : '#4ECB71') + ';letter-spacing:2px">' + v.result.decision + '</div>';
      } else if (isLive) {
        html += '<div style="font-size:13px;color:rgba(255,255,255,.2)">' + defPct + '% Défense · ' + accPct + '% Accusation · ' + votes + ' vote' + (votes > 1 ? 's' : '') + '</div>';
      }
      card.innerHTML = html;
      feed.appendChild(card);
    });
  });
}

// ======================
// FONCTIONS HOME
// ======================
function buildHome() {
  var fav = me.favSeries || [];
  var sorted = caseKeys.slice();
  if (fav.length > 0) {
    sorted.sort(function(a, b) {
      var af = fav.indexOf(CASES[a].t) > -1 ? 0 : 1;
      var bf = fav.indexOf(CASES[b].t) > -1 ? 0 : 1;
      return af - bf;
    });
  }
  var ci = document.getElementById('cards-inner');
  if (!ci) return;
  ci.innerHTML = '';

  sorted.forEach(function(k, idx) {
    var c = CASES[k];
    var card = document.createElement('div');
    card.style.cssText = 'height: 100dvh; scroll-snap-align: start; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; padding: 0 28px 80px; background: #0a0a12;';
    var badge = c.jm ? '<span style="font-size:10px;padding:3px 10px;background:rgba(255,210,63,.1);border:1px solid rgba(255,210,63,.2);border-radius:10px;color:#FFD23F;margin-left:8px">JUGE</span>' : '';

    card.innerHTML =
      '<div style="position:absolute;top:30%;left:50%;transform:translateX(-50%);width:280px;height:280px;background:radial-gradient(circle,rgba(167,139,250,.1),transparent 70%);pointer-events:none"></div>' +
      '<div style="position:absolute;bottom:25%;right:-30px;width:180px;height:180px;background:radial-gradient(circle,rgba(255,122,46,.07),transparent 70%);pointer-events:none"></div>' +
      '<div style="position:absolute;top:0;left:0;right:0;padding:56px 24px 0;display:flex;justify-content:space-between;align-items:center">' +
        '<div style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#FF7A2E,#e8a0b0,#A78BFA);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent">D\'brief</div>' +
        '<div id="home-avatar-' + idx + '" onclick="switchTab(\'profil\')" style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#c7a0d0,#FF7A2E);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;cursor:pointer">' + (me.name || '?').substring(0, 2).toUpperCase() + '</div>' +
      '</div>' +
      '<div style="font-size:11px;font-weight:800;color:rgba(255,255,255,.2);letter-spacing:4px;margin-bottom:16px;position:relative">AFFAIRE ' + (idx + 1).toString().padStart(2, '0') + ' / ' + sorted.length + '</div>' +
      '<div style="display:inline-block;padding:5px 14px;border-radius:20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);font-size:11px;font-weight:800;color:rgba(255,255,255,.4);letter-spacing:2px;margin-bottom:14px;align-self:flex-start;position:relative">' + c.t.toUpperCase() + badge + '</div>' +
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
          '<button style="flex:1;padding:16px;border-radius:16px;border:2px solid rgba(255,71,87,.3);background:rgba(255,71,87,.06);color:#FF4757;font-size:15px;font-weight:800;cursor:pointer;font-family:\'Outfit\',sans-serif" onclick="joinDuelAs(\'' + k + '\',\'accusation\')">J\'accuse</button>'
        ) +
      '</div>';
    ci.appendChild(card);
  });

  try { document.getElementById('home-avatar').textContent = (me.name || '?').substring(0, 2).toUpperCase(); } catch(e) {}
}

function loadFeed() {
  if (!window.db) return;
  window.db.ref('public-duels').orderByChild('publishedAt').limitToLast(10).once('value', function(s) {
    var d = s.val(), fb = document.getElementById('feed-banner');
    fb.innerHTML = '';
    if (!d) return;
    Object.keys(d).reverse().forEach(function(k) {
      var v = d[k];
      if (!v.result) return;
      var cKey = k.split('_')[0];
      var validCase = false;
      for (var ck in CASES) {
        if (v.caseName === CASES[ck].n || ck === cKey) { validCase = true; break; }
      }
      if (!validCase) return;
      var fi = document.createElement('div');
      fi.className = 'feed-item';
      fi.onclick = function() { switchTab('verdicts'); };
      var ago = Math.floor((Date.now() - (v.publishedAt || 0)) / 60000);
      var timeStr = ago < 60 ? ago + 'min' : Math.floor(ago / 60) + 'h';
      fi.innerHTML =
        '<div style="font-size:12px;font-weight:800">' + (v.caseName || '') + '</div>' +
        '<div style="font-size:14px;font-weight:900;color:' + (v.result.decision === 'COUPABLE' ? '#FF4757' : '#4ECB71') + '">' + v.result.decision + '</div>' +
        '<div style="font-size:10px;color:#555">il y a ' + timeStr + '</div>';
      fb.appendChild(fi);
    });
  });
}

function handleUrlRoom() {
  var roomCaseId = urlRoom.split('_')[0];
  if (CASES[roomCaseId]) {
    curCase = roomCaseId;
    var c = CASES[roomCaseId];
    currentRoom = urlRoom;
    document.getElementById('dw-series').textContent = c.t.toUpperCase();
    document.getElementById('dw-name').textContent = c.n;
    document.getElementById('dw-q').textContent = c.q;
    go('duel-wait');
    if (window.db) {
      myRole = 'accusation';
      window.db.ref('rooms/' + currentRoom + '/roles/accusation').set({ uid: myUid, name: me.name || '' });
      updateVsAcc();
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
          document.getElementById('dw-status').textContent = 'Duel prêt!';
          setTimeout(startDuel, 2000);
        }
      });
    }
  } else {
    go('home');
  }
}

// ======================
// INITIALISATION PRINCIPALE
// ======================
function initMainApp() {
  // Charge la session si elle existe
  try {
    var s = localStorage.getItem('dbrief_user');
    if (s) {
      try {
        var u = JSON.parse(s);
        if (u && u.name && u.email) {
          Object.assign(me, u);
          if (u.uid) myUid = u.uid;
          if (window.firebaseLoaded) {
            buildHome();
            buildProfile();
            if (urlRoom) handleUrlRoom();
            else go('home');
          } else {
            go('splash');
          }
          return;
        }
      } catch(e) {
        console.log('Erreur de session :', e);
      }
    }
    go('splash');
  } catch(e) {
    console.log('Erreur init :', e);
    go('splash');
  }

  // Enregistre le Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  }
}
