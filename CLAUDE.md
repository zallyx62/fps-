# RIXE — Instructions de développement pour Claude

**Référence fonctionnelle unique :** `CAHIER_DES_CHARGES_RIXE.md` (version la plus récente de la branche de travail).  
**Moteur :** Unreal Engine 5.8. **Projet :** principalement Blueprint.  
**Budget autorisé :** 0 €. **Branche de développement principale :** `jeu-unreal`.  
**Objectif :** construire un FPS multijoueur réellement jouable, stable, accessible avec des amis à distance et maintenable.

---

## 1. Règle de cohérence documentaire

Le cahier des charges est la source de vérité pour les fonctionnalités, décisions produit et priorités. Ce fichier explique comment travailler ; il ne doit pas recopier intégralement chaque fonctionnalité du cahier des charges.

- Avant toute tâche, lire le cahier des charges et identifier les sections concernées.
- Ne créer aucun système parallèle lorsqu'une fonction existante peut être étendue.
- Si deux demandes ont le même résultat utilisateur ou la même responsabilité technique, les fusionner sous un seul système propriétaire et ajouter des références croisées.
- En cas de contradiction, relever précisément les deux formulations, appliquer la décision la plus récente explicitement approuvée et signaler tout doute au propriétaire.
- Ne jamais transformer un objectif planifié en fonctionnalité « terminée » sans preuve de code, test et build.
- Maintenir une matrice d'état : **existant vérifié / partiellement fonctionnel / planifié / bloqué / non vérifié**.
- Mettre à jour le cahier des charges uniquement pour corriger une erreur factuelle ou enregistrer une décision approuvée. Ne pas ajouter de nouvelles fonctionnalités sans autorisation.

## 2. Objectif et expérience de jeu

RIXE est un FPS d'arène gratuit, nerveux, lisible et compétitif, avec une identité propre. Le gameplay, la qualité des tirs, les déplacements, la stabilité réseau et l'équité passent avant l'accumulation de contenu.

L'expérience multijoueur officielle par défaut est un lobby public automatique inspiré de Black Ops II : les joueurs se rassemblent, le compte à rebours ou le seuil de joueurs déclenche la partie, et le groupe reste ensemble entre les manches/parties lorsque c'est possible. Les serveurs communautaires sont facultatifs et secondaires, dans une rubrique distincte.

Respecter les décisions approuvées du cahier des charges : trois cartes maximum au lancement initial ; modes standards à arsenal contrôlé ; playlists Chaos séparées avec armes explosives ; équipes rouge/bleue ; crosshair personnalisable rond/croix ; apparitions choisies automatiquement par le serveur ; camping géré d'abord par le level design ; score valorisant aussi objectifs, défense et soutien ; UI originale, claire et sobre.

## 3. Chronologie officielle, priorités et pilotage du travail

**La chronologie de référence est celle du cahier des charges : ne pas créer une feuille de route concurrente dans ce fichier.**

- **Ordre général obligatoire :** suivre les étapes de la section 12 du cahier des charges, dans leur ordre et avec leurs dépendances.
- **Livraison prioritaire :** appliquer la section 24 pour obtenir une version Windows réellement jouable et testable. Son calendrier de douze jours est un objectif indicatif, jamais une garantie ni une raison de bâcler les validations.
- **Ordres spécialisés :** lorsqu'une section du cahier des charges définit son propre ordre de réalisation, ses dépendances ou ses critères d'acceptation, les respecter pour le système concerné, sans contredire les priorités générales ni retarder le socle jouable.
- **Priorité en cas de concurrence :** traiter d'abord les risques de sécurité, pertes de données, licences et blocages empêchant de jouer ; ensuite le socle FPS, le réseau et la build Windows ; puis les systèmes dépendants ; enfin les extensions et plateformes secondaires selon les sections applicables.
- **Aucune avance artificielle :** ne pas commencer une étape ultérieure si un prérequis critique de l'étape courante échoue. Les travaux préparatoires indépendants et sans risque restent possibles, mais ne doivent pas détourner les ressources du blocage prioritaire.
- **Pas de suppression silencieuse :** une fonctionnalité reportée reste une exigence planifiée du cahier des charges. La reporter ne signifie ni l'abandonner ni la déclarer réalisée.

### Suivi obligatoire de la chronologie

Au début de chaque session de travail, puis après chaque jalon important :

1. Lire les sections 12 et 24 du cahier des charges, ainsi que les sections spécialisées concernées par la tâche.
2. Vérifier l'état réel du dépôt, de la branche, du commit, des modifications locales, des builds et des tests ; ne jamais reprendre aveuglément un ancien compte rendu.
3. Identifier le jalon actuellement actif, les prérequis déjà validés, les blocages et le prochain critère d'acceptation.
4. Choisir une tâche courte qui fait avancer le jalon actif ; ne pas lancer plusieurs grands systèmes indépendants en parallèle.
5. Ne déclarer un jalon franchi qu'avec les preuves adaptées : fichiers/code ou Blueprints présents, compilation, tests fonctionnels, tests réseau/performance si concernés et build lorsque pertinente.
6. Mettre à jour le suivi de travail avec le statut réel, les preuves, les limites, les tâches restantes et le prochain jalon. Ne pas recopier le cahier des charges : référencer ses sections.
7. Si une dépendance, un problème technique ou une contrainte de budget empêche de poursuivre, documenter le blocage et ses conséquences, puis traiter le meilleur travail non bloqué qui respecte l'ordre de priorité.

Le suivi de session doit rester bref et factuel : **jalon actif / validé / bloqué / prochaine action**. La section 12 du cahier reste la feuille de route générale ; la section 24 reste le plan de livraison rapproché.

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
- Prévoir profils Bas, Moyen, Élevé, Ultra avec résolution, résolution dynamique/TSR si compatible, ombres, effets, post-process, distance d'affichage et limites FPS. Le profil Bas doit conserver lisibilité, silhouettes, hitboxes et visibilité compétitive.
- Ne pas activer simultanément des paramètres RHI/Shader contradictoires ou des cibles Vulkan/Metal non testées. Ne conserver que les plateformes effectivement ciblées et compilées.
- Éviter les effets coûteux qui nuisent à la lisibilité FPS : motion blur excessif, exposition automatique instable, fumées opaques et post-process masquant les ennemis.
- Mesurer temps GPU/CPU, mémoire, FPS et stabilité sur au moins une machine modeste et une machine de référence. Définir les spécifications minimales à partir des tests, pas d'une supposition.
- Avant de modifier `DefaultEngine.ini`, faire une copie, relever les valeurs actuelles, expliquer le changement, compiler shaders et tester les profils ; ne pas supprimer des lignes sans comprendre leur provenance.

## 8. Bots, équipes, modes et équilibre

Les bots doivent être gérés par l'autorité serveur, identifiés comme bots, avec statistiques séparées et règles propres à chaque playlist. Ils ne doivent pas disparaître automatiquement au premier joueur humain si le mode prévoit du remplissage. Les préférences humains uniquement / bots autorisés et les règles classées sont celles du cahier des charges.

L'objectif 10 contre 10 est une cible conditionnelle, pas une capacité acquise. Valider d'abord 2, 4, 8, puis augmenter progressivement en mesurant CPU, bande passante, réplication, mémoire et qualité de jeu. Ne pas annoncer 20 joueurs tant que les tests réels ne le démontrent pas.

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

## Décisions récentes à intégrer au travail
- Appliquer la section 42 du cahier des charges : progression durable sans récompenses définitivement manquées, fiche de mode obligatoire pour tous les joueurs dans tous les modes, et favoris/préférences de playlists.
- La fiche de mode doit rester courte et contextuelle : objectif, condition de victoire et règles particulières réellement actives. Elle ne doit pas ralentir l'entrée en partie ni devenir une fenêtre de confirmation.
- Ne jamais placer un joueur dans une playlist qu'il a explicitement exclue. Ne pas promettre de délai de matchmaking sans mesure réelle.
- La progression ne doit pas imposer de connexion quotidienne ni d'achat pour récupérer une récompense annoncée gratuite.
- Avant toute modification de configuration ou de code, rechercher les secrets déjà publiés. Ne jamais committer de jeton, mot de passe, clé privée ou identifiant secret. Utiliser les mécanismes locaux sécurisés et des valeurs d'exemple non fonctionnelles dans le dépôt.
- Un secret qui a déjà été publié doit être considéré compromis : le retirer du dépôt ne suffit pas ; demander sa révocation/rotation auprès du service concerné, vérifier l'historique Git et éviter de réintroduire sa valeur.
