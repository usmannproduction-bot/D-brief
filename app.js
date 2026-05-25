
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
  // ===== NOUVELLES AFFAIRES =====
  nemesis1: K(1, 'Ebony vs Candice', 'Nemesis', "Candice accuse Ebony d'avoir su qui était vraiment son mari et de l'avoir couvert jusqu'au bout", "Los Angeles. Isaiah Stiles traque depuis des mois une équipe de braqueurs. Sa femme Candice, elle, s'est liée d'amitié avec Ebony Wilder — sans savoir que le mari d'Ebony est précisément le criminel qu'Isaiah pourchasse. Quand la vérité éclate, la question devient : Ebony savait-elle ? Et si oui, depuis quand ?", "Ebony n'était pas complice. Elle était une femme qui protégeait sa famille dans un monde où personne ne lui laissait le choix. Candice confond loyauté conjugale et trahison délibérée.", "Ebony a regardé Candice lui parler de son mari brisé par cette enquête, et elle a souri. Elle savait. Elle a choisi de se taire. Ce silence a un nom : complicité."),

  // ===== AFFAIRES EXISTANTES =====
  blood1: K(1, 'Sarah vs Kemi', 'Blood Sisters', "Kemi accuse Sarah d'avoir caché un meurtre et fait d'elle une complice malgré elle", "Lagos, Nigeria. Le soir du mariage de Kemi, Kola, son fiancé violent et possessif, est mort. Sarah a dissimulé les faits, pris des décisions à la place de Kemi, et l'a engagée dans une spirale de mensonges et de danger mortel.", "Kola était un homme violent qui aurait tué Kemi. Sarah a agi dans l'urgence pour sauver sa meilleure amie.", "Sarah a menti à Kemi pendant des semaines. Elle l'a transformée en fugitive, en complice d'un crime qu'elle n'a pas commis."),

  tommy1: K(1, 'Tommy vs Arthur', 'Peaky Blinders', "Arthur accuse Tommy d'avoir sacrifié chaque membre de la famille Shelby sur l'autel de son ambition", "Birmingham, Small Heath, après la Première Guerre mondiale. Tommy Shelby a transformé le chaos en empire. Il a utilisé la douleur de ses frères, leur loyauté aveugle, leur incapacité à refuser une mission comme matière première de son ascension.", "Sans Tommy, les Shelby seraient restés des petits criminels de banlieue. Tommy a donné à sa famille une puissance qu'ils n'auraient jamais atteinte seuls.", "Tommy a regardé Arthur se noyer dans la violence et la drogue, et il a continué à lui donner des missions parce qu'Arthur était utile."),

  shanty1: K(1, 'Inem vs Scar', 'Shanty Town', 'Inem accuse Scar de traiter les femmes de Shanty Town comme du bétail humain', 'Lagos, Shanty Town. Scar règne sur l\'un des quartiers les plus pauvres de la ville. Son empire repose sur le trafic, la violence et l\'exploitation systématique des femmes du quartier.', 'Scar a apporté un ordre là où il n\'y en avait aucun. Les femmes de Shanty Town n\'avaient pas de protection avant lui.', 'Scar exploite les femmes les plus vulnérables de Shanty Town sous couverture de protection.'),

  lupin1: K(1, 'Assane vs Hubert', 'Lupin', "Hubert accuse Assane d'être un criminel romantique qui met en danger ceux qu'il prétend protéger", "Paris. Babakar Diop, père d'Assane, a été accusé à tort du vol d'un collier par Hubert Pellegrini. Il est mort en prison. Assane a consacré sa vie à la vengeance, mettant en danger sa femme et son fils.", "Assane n'avait pas accès aux voies normales de la justice. Face à une injustice systémique, seule une réponse hors système pouvait fonctionner.", "Assane a mis sa femme en danger, séparé son fils de ses parents. La mémoire de son père est devenue un alibi pour un mode de vie criminel."),

  valide1: K(1, 'Apash vs William', 'Validé', "William accuse Apash d'avoir vendu son authenticité contre des streams et trahi ceux qui l'ont construit", "Paris, banlieue. Apash est né dans la cité. Son rap parlait de la rue, de la galère, de ceux qui restent. William était là depuis le début.", "Apash a réussi là où des milliers ont échoué. Évoluer n'est pas trahir.", "Apash a bâti sa carrière sur la promesse implicite d'une parole vraie. Il a monétisé cette confiance puis changé de monde sans se retourner."),

  sartre1: K(3, 'Sartre vs Ghost', 'Philosophie', 'Sartre accuse Ghost d\'être l\'incarnation parfaite de la mauvaise foi — un homme qui refuse de choisir qui il est', 'Jean-Paul Sartre a théorisé la mauvaise foi comme la tendance humaine à se fuir soi-même. Ghost vit deux vies parallèles depuis des années. Le jour, homme d\'affaires respectable. La nuit, trafiquant. Il refuse obstinément de choisir entre les deux.', 'Ghost n\'a pas le luxe de philosopher sur l\'authenticité. Il est né noir et pauvre dans un système qui ne lui laissait pas le choix de ses premières décisions.', 'Ghost change d\'identité selon l\'audience. Sartre dirait : celui qui joue autant de rôles différents ne joue aucun rôle vraiment. Il n\'existe pas.'),

  dadie1: K(3, 'Dadié vs Harvey Specter', 'Philosophie', 'Dadié accuse Harvey Specter de traiter la justice comme un jeu d\'ego plutôt qu\'un outil de vérité', 'Bernard Dadié, père de la littérature ivoirienne, a toujours défendu que la parole doit servir la vérité et la dignité humaine. Harvey Specter, lui, est le meilleur fermeur de New York — pas parce qu\'il cherche la vérité, mais parce qu\'il cherche la victoire.', 'Harvey Specter obtient des résultats que personne d\'autre ne peut obtenir. Dans un système imparfait, un avocat qui gagne protège mieux ses clients qu\'un avocat qui cherche la vérité.', 'Harvey Specter a défendu des criminels, détruit des innocents, manipulé des preuves — tout ça en se regardant dans le miroir avec satisfaction.'),

  beauvoir1: K(3, 'Beauvoir vs Princesse Sarah', 'Philosophie', 'Beauvoir accuse la série d\'avoir fabriqué pendant des décennies un modèle féminin basé sur la souffrance silencieuse et la soumission', 'Simone de Beauvoir a fondé le féminisme existentiel sur une idée centrale : on ne naît pas femme, on le devient. Princesse Sarah est une petite fille noble déchue qui endure toutes les humiliations sans jamais se révolter.', 'Sarah n\'est pas passive, elle est résiliente. Sa force est intérieure. Dans un monde qui l\'écrase, elle choisit de ne pas se laisser corrompre.', 'Princesse Sarah enseigne aux petites filles que souffrir en silence est vertueux, que la révolte est laide, que la bonté passive finit par être récompensée.'),

  walter1: K(1, 'Walter vs Jesse', 'Breaking Bad', 'Jesse accuse Walter d\'avoir empoisonné un enfant de 8 ans pour le manipuler comme un pantin', 'Albuquerque. Jesse a découvert que c\'est Walter qui avait empoisonné Brock, délibérément, pour manipuler Jesse et le retourner contre Gus. Walter avait calculé la dose pour que l\'enfant survive.', 'Walter n\'a pas voulu tuer Brock. Il a calculé une dose qui ne mettait pas sa vie en danger. L\'objectif était d\'éliminer Gus Fring qui voulait les tuer tous les deux.', 'Walter White a empoisonné un enfant de 8 ans en secret. Il a regardé Jesse s\'effondrer d\'inquiétude tout en sachant qu\'il en était responsable.'),

  maitresse1: K(1, 'Marème vs Dialika', 'Maîtresse d\'un homme marié', 'Dialika accuse Marème d\'avoir détruit son foyer en connaissance de cause et sans le moindre remords', 'Dakar. Dialika est mariée à Baye Fall depuis des années. Marème est entrée dans cette équation en sachant pertinemment qu\'il était marié.', 'Marème n\'a pas trahi Dialika. Elle ne lui a fait aucune promesse. C\'est Baye Fall qui a fait des vœux et qui les a brisés.', 'Marème savait. Elle a quand même choisi de continuer. La liberté individuelle s\'arrête là où elle détruit délibérément la vie d\'une autre personne.'),

  heritage1: K(1, 'Le Fils vs L\'Oncle', 'Héritage', 'Le fils accuse l\'oncle d\'avoir profité du deuil familial pour s\'emparer de l\'héritage', 'Côte d\'Ivoire. Le père est mort, laissant derrière lui une propriété et une famille fracturée. L\'oncle s\'est positionné comme gestionnaire naturel pendant le deuil.', 'L\'oncle a géré l\'héritage parce que le fils était incapable de le faire dans l\'immédiat du deuil.', 'L\'oncle a attendu que son frère soit dans la terre pour mettre la main sur ce qu\'il n\'avait pas réussi à obtenir de son vivant.'),

  soeurs1: K(1, 'Karen vs Terrence', '7 Sœurs', 'Karen accuse Terrence d\'avoir effacé l\'identité de six de ses filles pour en faire une seule',