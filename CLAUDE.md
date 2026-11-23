# RIXE — Instructions de développement pour Claude

**Référence fonctionnelle unique :** `CAHIER_DES_CHARGES_RIXE.md`, dans sa version approuvée la plus récente.  
**Moteur :** Unreal Engine 5.8. **Projet :** principalement Blueprint.  
**Budget autorisé :** 0 €. **Branche de référence :** `main`. `main` est la branche de référence, pas une branche de travail : ne jamais y développer directement. Pour chaque tâche ou lot cohérent, créer une branche dédiée depuis le dernier `main` vérifié, y effectuer les modifications et ouvrir une pull request vers `main`. Ne jamais réutiliser une branche de tâche ancienne sans vérifier son point de départ et son contenu. `jeu-unreal` est une branche miroir strictement synchronisée avec `main` : une GitHub Action la met à jour automatiquement après chaque push/merge sur `main` et peut être lancée manuellement. Ne jamais développer directement sur `jeu-unreal`, ne jamais forcer son historique ; si elle diverge ou contient des commits propres, arrêter la synchronisation et demander un arbitrage. Après chaque fusion dans `main`, vérifier le résultat de l'action et l'égalité des SHA des deux branches. 
**Objectif :** construire un FPS multijoueur réellement jouable, stable, accessible avec des amis à distance et maintenable.

---

## 0. Procédure obligatoire de reprise après interruption

À chaque nouvelle session, notamment après plusieurs jours sans intervention, ne pas reprendre à partir du souvenir, d'un ancien résumé ou du dernier message de conversation. Reconstituer l'état du dépôt avant toute modification.

1. Lire ce fichier, puis la version courante de `CAHIER_DES_CHARGES_RIXE.md`, `SUIVI_PHASES_RIXE.md`, `UNREAL.md` et les documents explicitement référencés par la tâche.
2. Vérifier le dépôt distant : branche courante, SHA de `main`, branches de travail, état de `jeu-unreal`, dernières pull requests/commits et éventuelles actions GitHub en échec. Ne pas supposer que les références ou rapports de la session précédente sont encore à jour.
3. Vérifier l'état local avant toute opération : modifications non commitées, fichiers non suivis, sauvegardes, version d'Unreal, état de compilation et disponibilité du projet. Ne jamais écraser ni nettoyer des changements locaux non compris.
4. Comparer les changements récents du dépôt avec le cahier des charges et le suivi. Repérer les décisions nouvellement approuvées, les tâches commencées mais inachevées, les conflits documentaires et les preuves devenues obsolètes.
5. Présenter un bref état de reprise : phase active, dernier commit de code réellement testé, changements depuis cette validation, blocage principal et prochaine action vérifiable.
6. Avant toute écriture, créer une branche dédiée depuis le `main` distant à jour. Si une branche existante contient déjà le travail pertinent, l'inspecter et la réutiliser uniquement après vérification explicite de son historique et de son contenu.
7. Ne modifier ni le cahier des charges ni l'état d'avancement pour faire disparaître une incertitude. En cas de décision produit ambiguë ou de divergence non arbitrable, s'arrêter et demander confirmation.
8. À la fin, consigner les preuves et limites, ouvrir une pull request vers `main`, puis vérifier la fusion et la synchronisation de `jeu-unreal` uniquement si la pull request est effectivement fusionnée.

Aucune modification de code ou de documentation ne doit précéder ces vérifications de reprise, sauf demande explicite de l'utilisateur visant précisément une correction documentaire isolée.

## 1. Règle de cohérence documentaire

Le cahier des charges est la source de vérité pour les fonctionnalités, décisions produit et priorités. Ce fichier explique comment travailler ; il ne doit pas recopier intégralement chaque fonctionnalité du cahier des charges.

- Avant toute tâche, lire le cahier des charges et identifier les sections concernées.
- Ne créer aucun système parallèle lorsqu'une fonction existante peut être étendue.
- Si deux demandes ont le même résultat utilisateur ou la même responsabilité technique, les fusionner sous un seul système propriétaire et ajouter des références croisées.
- En cas de contradiction, relever précisément les deux formulations, appliquer la décision la plus récente explicitement approuvée et signaler tout doute au propriétaire.
- Ne jamais transformer un objectif planifié en fonctionnalité « terminée » sans preuve de code, test et build.
- Maintenir une matrice d'état : **existant vérifié / partiellement fonctionnel / planifié / bloqué / non vérifié**.
- Mettre à jour le cahier des charges uniquement pour corriger une erreur factuelle ou enregistrer une décision approuvée. Ne pas ajouter de nouvelles fonctionnalités sans autorisation.
- `CAHIER_DES_CHARGES_RIXE.md` décrit la cible approuvée ; `UNREAL.md` décrit l'état observé du prototype. Si leurs contenus diffèrent, ne pas transformer l'état actuel en exigence : créer ou mettre à jour une tâche d'écart et suivre la chronologie du cahier.
- La présence de `LICENSE` ne prouve pas que la distribution est autorisée : respecter l'audit de compatibilité Unreal/Epic de la section 25. Le développement et les tests locaux ne valent pas autorisation de publication publique.

## 2. Objectif et expérience de jeu

RIXE est un FPS d'arène gratuit, nerveux, lisible et compétitif, avec une identité propre. Le gameplay, la qualité des tirs, les déplacements, la stabilité réseau et l'équité passent avant l'accumulation de contenu.

L'expérience multijoueur officielle par défaut est un lobby public automatique inspiré de Black Ops II : les joueurs se rassemblent, le compte à rebours ou le seuil de joueurs déclenche la partie, et le groupe reste ensemble entre les manches/parties lorsque c'est possible. Les serveurs communautaires sont facultatifs et secondaires, dans une rubrique distincte.

Respecter les décisions approuvées du cahier des charges : trois cartes maximum au lancement initial ; modes standards à arsenal contrôlé ; playlists Chaos séparées avec armes explosives ; équipes rouge/bleue ; crosshair personnalisable rond/croix ; apparitions choisies automatiquement par le serveur ; camping géré d'abord par le level design ; score valorisant aussi objectifs, défense et soutien ; UI originale, claire et sobre.

## 3. Chronologie officielle, priorités et pilotage du travail

**Le cahier des charges est l'unique feuille de route fonctionnelle.** Ne crée aucune chronologie concurrente et ne réordonne pas les fonctionnalités selon tes préférences.

- **Ordre général obligatoire :** suivre la section 12 du cahier des charges et ses critères de passage.
- **Livraison rapprochée :** appliquer la section 24 pour obtenir d'abord une build Windows jouable. Les douze jours sont indicatifs ; aucune validation ne peut être sautée pour tenir le calendrier.
- **Ordre multijoueur obligatoire :** respecter également les sections 12 et 27.10. Avant EOS, stabiliser le combat, le hit registration, l'autorité réseau, les bots et **une seule carte pilote**. Les autres cartes du lancement ne bloquent ni EOS ni les premiers prototypes internes du matchmaking : elles sont finalisées et validées en phase 4, avant l'alpha publique. Après la phase 2, valider EOS et les lobbies privés ; ensuite, construire le matchmaking public, le lobby BO2 et la continuité des parties.
- **Séquence de référence :** audit/sauvegarde/licences/blocages → première build Windows jouable sur une carte pilote → combat/réseau/autorité serveur/bots et référence de performances sur cette carte → EOS et parties privées avec protections communautaires minimales → prototypes internes puis validation du matchmaking public/lobby/continuité pendant que les autres cartes et modes de lancement sont finalisés → validation de toutes les cartes/modes retenus avant l'alpha → statistiques persistantes/progression/modération avancée et fonctions dépendantes → validation qualité/performance/alpha → extensions.
- **Priorité en cas de concurrence :** protéger d'abord les données, secrets et licences ; corriger ensuite tout blocage empêchant de compiler, lancer ou jouer ; avancer sur le jalon courant et ses dépendances ; reporter les extensions indépendantes.
- **Aucune avance artificielle :** ne commence pas une étape ultérieure si un prérequis critique échoue. Les préparatifs indépendants ne sont permis que s'ils sont réversibles, à faible risque et ne détournent pas le travail prioritaire.
- **Pas de suppression silencieuse :** une fonctionnalité reportée reste planifiée dans le cahier des charges. Ne la supprime pas, ne la déclare pas abandonnée et ne la marque pas comme réalisée.
- **Pas de duplication :** étends les systèmes uniques déjà définis ; rattache chaque exigence spécialisée au système propriétaire correspondant.

### Suivi obligatoire de la chronologie

Au début de chaque session, puis après chaque jalon :

1. Lire les sections 12 et 24, la section 27.10 et les sections spécialisées directement concernées.
2. Vérifier branche, commit, changements locaux, état des Blueprints, compilation, builds et tests ; ne jamais reprendre aveuglément un ancien rapport.
3. Identifier la phase active, ses critères de passage, les prérequis validés, le blocage principal et la prochaine action vérifiable.
4. Choisir une tâche courte qui débloque le jalon actif. Ne lance pas plusieurs grands systèmes en parallèle.
5. Ne franchir un jalon qu'avec des preuves adaptées : implémentation réelle, compilation, tests fonctionnels, réseau/performance si concernés et build empaquetée lorsque requise.
6. Mettre à jour `SUIVI_PHASES_RIXE.md` avec statut, commit du code testé, build, protocole, résultats, preuves, limites, blocages et prochaine action ; référencer les sections du cahier sans recopier leur contenu. Ne jamais assimiler un commit documentaire ou un ancien titre d'étape à une validation.
7. Si le jalon est bloqué, consigner la cause et traiter le meilleur travail non bloqué de même priorité, sans sauter l'ordre de dépendance.

Rapport de session bref : **phase active / tâche réalisée / preuves et tests / blocage / prochaine action**. La section 12 reste la chronologie générale ; la section 24 reste le plan de première livraison ; `SUIVI_PHASES_RIXE.md` est le registre des statuts réellement démontrés. Au démarrage, lire ce registre et revalider ses preuves sur le commit courant avant de reprendre un statut.

### Correspondance historique — ne pas confondre les anciennes étapes avec les phases actuelles

Les commits et titres de `UNREAL.md` du 18 novembre 2026 (« Étape 1 : rendu, performances, interface » et « Étape 2 : armes, stand de tir, arsenal ») sont des lots de travail historiques. Ils ne prouvent pas la phase 1 actuelle (build Windows exécutable et partie complète) ni la phase 2 actuelle (combat, autorité réseau et tests réseau). Consulter `SUIVI_PHASES_RIXE.md` ; aucun jalon ne peut être déclaré franchi sur la seule base de ces intitulés.

## 4. Architecture multijoueur et hébergement — décision technique à respecter

### 4.1 Services en ligne et transport de jeu : responsabilités séparées

Étudier **Epic Online Services (EOS)** comme premier choix pour les services gratuits de compte/Connect, présence, amis, invitations, lobbies, sessions et P2P, sous réserve des conditions et limites actuelles d'Epic. EOS n'est pas un serveur de simulation Unreal et ne remplace pas l'autorité de jeu.

- Utiliser EOS pour découvrir les joueurs, gérer les groupes/lobbies et négocier les connexions lorsque pertinent.
- Utiliser le réseau Unreal pour la simulation du match.
- Évaluer EOS P2P/relay ou une solution compatible pour faciliter les connexions derrière NAT/pare-feu. Ne pas promettre que toutes les connexions seront possibles sur tous les réseaux.
- Conserver un chemin de connexion directe/LAN pour les tests et le dépannage.
- Ne pas intégrer Steam AppID 480, Advanced Sessions ou un plugin tiers comme dépendance de production sans validation technique, de licence et de configuration.
- Les services EOS annoncés gratuits ne rendent pas gratuits le calcul serveur, les GPU, le stockage, le trafic, la modération ni le support.

### 4.2 Modèle de parties recommandé à budget nul

**Phase initiale : parties privées et groupes d'amis hébergés par un joueur (listen server), via EOS/P2P ou relais compatible.** Cela permet de prototyper et de jouer sans payer un parc de serveurs. Fournir un bouton « Inviter / Rejoindre », un code ou une invitation, l'affichage de la région/ping estimé et un diagnostic de connexion.

Limites obligatoires à afficher et tester :
- L'hôte joue sur la machine qui fait autorité : avantage potentiel de latence et risque de triche.
- Débit montant, CPU, pare-feu, NAT strict, CGNAT, Wi-Fi et stabilité de l'hôte peuvent empêcher ou dégrader la partie.
- Un relais peut améliorer la traversée réseau mais n'est pas une garantie de coût nul ou de disponibilité universelle.
- La migration d'hôte peut être envisagée pour les salons non classés ; ne pas promettre un transfert parfait de la simulation sans prototype validé.
- Ne pas lancer de classement officiel compétitif sur un modèle d'hôte joueur tant que les risques d'intégrité ne sont pas suffisamment maîtrisés.

**Phase suivante : serveurs dédiés facultatifs**, uniquement lorsqu'un hébergement gratuit durable ou un financement approuvé existe. Étudier les serveurs communautaires autohébergés et les machines volontaires, avec règles, versions et statut clairement identifiés. Ne jamais dépendre d'une offre gratuite temporaire comme garantie de service permanent.

**Classé :** désactivé au lancement si l'autorité serveur, l'anti-triche, la stabilité et l'intégrité des résultats ne sont pas suffisamment fiables. Ne jamais présenter un listen server hébergé par un joueur comme équivalent à un serveur dédié impartial.

### 4.3 Jouer avec des amis partout

Objectif : permettre de rejoindre un ami depuis des réseaux et régions différents, sans prétendre à une disponibilité absolue. Implémenter progressivement : identité de joueur, invitation, lobby, recherche/rejoindre, transport P2P/relay, gestion NAT/pare-feu, diagnostic ping/jitter/pertes, reconnexion et messages d'erreur utiles. Tester entre réseaux différents, pas uniquement deux fenêtres PIE sur le même PC.

## 5. Systèmes fonctionnels uniques — éviter les doublons

Chaque responsabilité doit avoir un seul système de référence. Étendre ce système au lieu d'en créer un deuxième.

- **Matchmaking unique :** regroupe recherche de partie, régions, ping de groupe, préférence solo/groupes, périphériques, équilibre des deux équipes, humains/bots, backfill et remplaçants. Les règles varient selon playlist/classement, pas par systèmes indépendants.
- **Lobby/groupe unique :** amis, invitations, présence, lobby public automatique, lobby privé, continuité entre parties et préparation. Distinguer les états du groupe et ceux du match.
- **Réseau/autorité unique :** validation serveur des tirs, cadence, munitions, dégâts, déplacements, capacités, apparitions, score, objectifs, résultats et sanctions de match. Les clients prédisent/présentent mais ne décident pas des résultats.
- **Identité et progression uniques :** compte RIXE, liaison de comptes, sauvegarde synchronisée, récupération, statistiques, déblocages et cosmétiques. Séparer données locales hors ligne et données officielles validées.
- **Statistiques et intégrité uniques :** tableau de fin de partie, profil, contribution, stats par joueur/équipe, replays et réparation/annulation de résultats compromis utilisent les mêmes événements et définitions de statistiques. Une annulation nécessite des preuves/critères publiés, audit et contestation.
- **Entraînement unique :** stand de tir, laboratoire d'armes, comparaison des statistiques, entraînement pendant recherche et mode hors ligne partagent les mêmes données d'armes et règles de simulation ; séparer strictement les progrès locaux des résultats officiels.
- **Équilibrage unique :** télémétrie agrégée, laboratoire interne, tests communautaires et équilibrage pré-match utilisent une définition commune des armes, modes, cartes, niveaux et incertitudes. Aucun changement automatique en cours de partie classée.
- **Communication/modération unique :** chat texte, vocal d'équipe, vocal de proximité, roue de communication, mute, blocage, signalement et outils de modération partagent les mêmes contrôles de confidentialité et d'abus. Pas d'enregistrement vocal par défaut.
- **Contenu communautaire unique :** éditeur/validation des cartes, playlist de test, événements et historique des changements partagent versionnage, validation, modération et séparation stricte des files officielles.
- **Serveurs uniques par catégorie :** distinguer clairement matchmaking officiel, partie privée hébergée par joueur et serveur communautaire. Ne pas mélanger leurs règles, rangs ou garanties.

Pour chaque fusion, conserver les exigences détaillées dans le cahier des charges et créer des liens vers les sections concernées. Ne pas supprimer une exigence approuvée sous prétexte qu'elle ressemble à une autre : la rattacher au système commun.

## 6. Plateformes : Windows d'abord, navigateur ensuite

Windows Unreal est la plateforme de référence initiale. Stabiliser d'abord une build Windows distribuable et son protocole réseau commun.

Le navigateur reste un objectif approuvé, mais il ne doit pas bloquer le FPS Windows ni être présenté comme déjà disponible. Deux options seulement à évaluer :

1. **Pixel Streaming :** le jeu Unreal tourne sur un PC/serveur avec GPU ; le navigateur reçoit une vidéo interactive via WebRTC. C'est bien le rendu Unreal réel, mais chaque instance/joueur consomme des ressources GPU et du trafic, avec latence, signalisation et éventuel coût de TURN/relai. À tester localement/LAN puis sur Internet. Ce n'est pas une solution publique gratuite et scalable par défaut.
2. **Client web distinct WebGL/WebGPU :** rendu différent, gameplay/règles/protocole partagés avec le serveur autoritaire. C'est un véritable portage à développer, pas un export Unreal HTML5 prêt à l'emploi. Il demande une équipe/charge de travail supplémentaire et une parité de gameplay à prouver.

Ne pas maintenir les deux pistes en production simultanément. Réaliser un prototype comparatif, mesurer latence, coût, qualité, accessibilité, charge de développement et équité, puis demander une décision au propriétaire avant de choisir. Tant qu'aucune solution gratuite et viable n'est validée, le navigateur reste expérimental et la version Windows est prioritaire.

## 7. Compatibilité graphique et performances

Ne pas forcer une qualité graphique unique pour tous les PC. Le projet doit avoir des profils réellement testés et une voie de rendu de secours.

- Garder DirectX 12/SM6 comme chemin de référence pour les fonctionnalités UE5 modernes qui le nécessitent.
- Ne pas activer le ray tracing matériel par défaut ; le traiter comme option haut de gamme uniquement après mesures.
- Lumen/Nanite/VSM ne doivent pas être des prérequis absolus pour jouer. Prévoir une configuration basse avec éclairage précalculé ou solution plus légère, géométrie/LOD classiques et ombres moins coûteuses lorsque techniquement possible.
- Vérifier si le projet peut compiler et démarrer un chemin D3D11/SM5 de secours. Ne pas supposer que Nanite ou toutes les fonctionnalités Lumen y seront disponibles.
- Respecter les six préréglages du cahier des charges, section 30.1 : Ultra performance, Performance, Équilibré (défaut), Qualité élevée, Très haute qualité et Ultra. Ajouter Personnalisé séparément, sans en faire un septième préréglage. Le profil le plus performant doit conserver lisibilité, silhouettes, hitboxes et visibilité compétitive.
- Ne pas activer simultanément des paramètres RHI/Shader contradictoires ou des cibles Vulkan/Metal non testées. Ne conserver que les plateformes effectivement ciblées et compilées.
- Réglage par défaut corrigé : `Config/DefaultEngine.ini` désactive le ray tracing matériel au démarrage (`r.RayTracing=False`) afin de ne pas en faire un prérequis. Son activation reste une option haut de gamme à exposer uniquement dans un profil compatible, après validation du rendu, des shaders, du cook, du packaging et des performances.
- Le fichier actuel déclare également des cibles shader Linux/Mac en SM6 et D3D11 SM5. Vérifier que chaque plateforme/RHI est réellement ciblée, compilée et testée ; Windows reste la cible de livraison initiale. Auditer aussi les entrées de configuration répétées avant tout nettoyage.
- Éviter les effets coûteux qui nuisent à la lisibilité FPS : motion blur excessif, exposition automatique instable, fumées opaques et post-process masquant les ennemis.
- Mesurer temps GPU/CPU, mémoire, FPS et stabilité sur au moins une machine modeste et une machine de référence. Définir les spécifications minimales à partir des tests, pas d'une supposition.
- Toute modification future de `DefaultEngine.ini` doit relever les valeurs précédentes, expliquer le changement, compiler les shaders et tester les profils ; ne pas supprimer des lignes sans comprendre leur provenance.

## 8. Bots, équipes, modes et équilibre

Les bots doivent être gérés par l'autorité serveur, identifiés comme bots, avec statistiques séparées et règles propres à chaque playlist. Ils ne doivent pas disparaître automatiquement au premier joueur humain si le mode prévoit du remplissage. Les préférences humains uniquement / bots autorisés et les règles classées sont celles du cahier des charges.

L'objectif 10 contre 10 est une cible conditionnelle, pas une capacité acquise. Valider d'abord 2 joueurs, puis 10, puis jusqu'à 20 (10 contre 10), en augmentant progressivement et en mesurant CPU, bande passante, réplication, mémoire et qualité de jeu. Ne pas annoncer 20 joueurs tant que les tests réels ne le démontrent pas.

Les cartes, apparitions, anti-camping, événements tactiques, armes et capacités doivent être testés ensemble. Le serveur choisit les apparitions ; éviter spawn-kill, positions dominantes et avantages cachés.

## 9. Sécurité, confidentialité et équité

- Valider côté serveur tous les événements ayant un effet sur la partie ; limiter fréquence, portée et paramètres des RPC.
- Ne jamais faire confiance au client pour dégâts, cadence, munitions, position autorisée, score, progression ou résultats.
- Protéger secrets, jetons, clés, fichiers de compte et données privées ; utiliser variables d'environnement ou mécanismes locaux sécurisés, jamais les committer.
- Ne pas publier de logs contenant IP, identifiants ou données personnelles non nécessaires.
- Minimiser les données ; pas d'enregistrement vocal par défaut.
- Les sanctions, annulations de résultats et détections de triche doivent être explicables, proportionnées, auditées et contestables. Pas de sanction grave sur simple suspicion.
- Cross-play, input matchmaking, aim assist et périphériques doivent être testés pour l'équité.

## 10. Licence, plugins et contenus

La compatibilité GPL-3.0 / Unreal/Epic est un risque à résoudre avant toute distribution. Respecter la section 25 du cahier des charges.

- Ne jamais changer ou supprimer `LICENSE` automatiquement.
- Inventorier code, Blueprints, assets, sons, polices, modèles, plugins, bibliothèques, outils et contenu du template.
- Pour chaque élément, relever source, auteur/détenteur, version, licence, preuve d'acquisition et droits de redistribution.
- Distinguer code original RIXE, contenu Epic/Unreal, Fab/Quixel et tiers.
- Vérifier les conditions officielles et les versions précises des plugins. Ne pas ajouter de plugin payant ni de service payant.
- Ne pas annoncer « open source intégral » ou « redistribuable » tant que les droits ne sont pas vérifiés.
- Signaler les incertitudes au propriétaire ; aucune décision juridique ou relicence sans son accord explicite.

## 11. Budget et autonomie

Le budget est strictement de **0 €**. Aucun achat, abonnement, serveur cloud, GPU distant, plugin/asset payant, domaine, publicité, frais de boutique ou service payant sans accord explicite.

Claude est autorisé à utiliser de manière autonome les outils réellement disponibles : terminal, navigateur, éditeur Unreal et contrôle du PC. Cette autorisation ne justifie pas d'ignorer les limites techniques, les permissions de l'environnement ou les protections de données.

Avant toute opération risquée : sauvegarder et vérifier la restauration. Demander l'accord avant dépense, publication publique, action irréversible, changement de licence/propriété ou utilisation de moyens de paiement/identifiants.

## 12. Procédure obligatoire pour chaque tâche

1. Identifier la branche, le commit, l'état de travail et les modifications non commitées.
2. Lire les sections pertinentes du cahier des charges et les documents techniques concernés.
3. Inspecter l'implémentation réelle avant de modifier ; rechercher les systèmes existants à étendre.
4. Établir un plan court et les risques ; sauvegarder les ressources concernées.
5. Implémenter le plus petit changement cohérent.
6. Compiler les Blueprints et le projet si possible ; corriger les erreurs introduites.
7. Tester dans l'éditeur puis sur build empaquetée lorsque pertinent. Les tests PIE à deux fenêtres ne prouvent pas le fonctionnement Internet.
8. Vérifier les régressions sur les systèmes liés.
9. Mettre à jour documentation et état réel, sans déclarer les fonctions non testées comme livrées.
10. Committer sur la bonne branche ; vérifier le commit distant et les fichiers après push.

Pour les systèmes réseau, tester au minimum un hôte et plusieurs clients, puis des réseaux distincts, latence/pertes simulées, déconnexion/reconnexion et cas d'échec. Pour le rendu, tester les profils et les GPU ciblés. Pour toute fonctionnalité, conserver les résultats et limites.

## 13. Build et lien de test à chaque mise à jour

Le propriétaire souhaite un lien de test après chaque mise à jour qui modifie le jeu.

- Produire une build Windows x64 Development/Shipping quand elle peut être empaquetée correctement.
- Fournir un lien direct uniquement si l'artefact a réellement été créé et si le lien est vérifié.
- Indiquer version, branche, commit, plateforme, tests effectués, état jouable et limites.
- Si la build est impossible, dire « indisponible », expliquer le blocage et fournir le rapport de test ; ne jamais présenter les sources GitHub comme une build.
- Ne pas utiliser `prototype-web/demo.html` comme substitut au jeu Unreal.
- Ne pas publier une release publique sans contrôle des licences, secrets, contenu et accord requis.
- Si les limites d'hébergement empêchent de partager une build, expliquer les contraintes et proposer une solution gratuite réaliste, sans promettre une disponibilité permanente.

## 14. État de référence et notes historiques

Les affirmations contenues dans les anciens comptes rendus, notes de travail, chemins locaux ou feuilles de route datées ne sont pas des instructions de développement actuelles. Elles doivent être vérifiées sur la machine et dans le projet avant réutilisation.

Les chemins tels que `D:\fps 5.8\...` ou `/mnt/user-data/uploads/...`, les états « étape terminée », les listes d'armes et les descriptions de tests sont des indices historiques, pas des vérités garanties. Ne pas écraser un fichier ou importer un asset depuis un chemin qui n'existe pas et n'a pas été vérifié.

Le projet utilise des outils Unreal/MCP et des Blueprints. Avant d'appeler un outil, vérifier sa disponibilité et son schéma actuels. Ne pas supposer que des noms de fonctions, identifiants de nœuds ou comportements d'outils sont identiques entre versions. Éviter de modifier les assets pendant PIE ; compiler et sauvegarder après arrêt du jeu. Ne jamais ouvrir une deuxième instance Unreal si l'éditeur courant est déjà actif.

---

## 15. Définition de terminé

Une tâche n'est terminée que si :
- l'implémentation existe réellement ;
- les Blueprints/projet compilent sans nouvelle erreur bloquante ;
- les tests correspondant au risque sont passés ;
- les systèmes dépendants n'ont pas régressé ;
- les limites connues sont consignées ;
- le commit et la branche sont vérifiés ;
- le lien de build est fourni ou son indisponibilité est explicitement expliquée.

**Principe final :** un FPS plus petit, stable, réactif et réellement jouable vaut mieux qu'une longue liste de fonctionnalités non testées.

## Vérification des exigences approuvées les plus récentes

Cette consigne est volontairement dynamique : le numéro 71 correspond à la dernière section connue au 23 novembre 2026, mais il ne doit pas devenir une limite permanente.

- À chaque reprise, identifier le numéro et le titre de la dernière section principale numérotée de `CAHIER_DES_CHARGES_RIXE.md`. Au moment de cette mise à jour, la dernière section est **71 — « Fabrication de l'arsenal, pipeline 3D et cosmétiques de mêlée »**, approuvée le 23 novembre 2026.
- Lire les sections 42 à la dernière section principale actuelle, ainsi que toute section antérieure référencée par ces exigences. Les sections 43 à 71 sont donc à lire intégralement à la date de cette mise à jour ; si une section 72 ou ultérieure est ajoutée, elle devient automatiquement incluse.
- Respecter toutes les exigences approuvées, y compris les détails, contraintes, critères de validation, dépendances, exclusions et références croisées. Ne pas appliquer uniquement les titres ou résumés.
- La section 71 concerne notamment la fabrication des armes, le pipeline 3D, la présélection de 34 armes et les apparences cosmétiques de mêlée. Ne pas transformer ces apparences en nouvelles catégories d'armes fonctionnelles : respecter la séparation explicitement définie dans le cahier des charges.
- Ne pas considérer qu'une exigence est facultative parce qu'elle figure dans une section récente, qu'elle n'est pas encore implémentée ou qu'elle semble redondante. En cas de chevauchement, appliquer le système propriétaire et les règles anti-duplication du cahier sans supprimer une exigence approuvée.
- Avant chaque modification, citer dans le plan de travail les sections concernées et leurs dépendances. Après modification, vérifier que l'implémentation et la documentation ne contredisent aucune autre section liée.
- Le cahier des charges approuvé prévaut sur toute note historique, ancien résumé de conversation, commentaire de commit, prototype ou branche documentaire divergente. Une contradiction réelle entre exigences approuvées doit être signalée au propriétaire au lieu d'être arbitrée par supposition.

