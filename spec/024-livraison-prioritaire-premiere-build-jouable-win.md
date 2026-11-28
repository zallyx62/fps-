## 24. Livraison prioritaire — première build jouable Windows

### 24.1 Objectif et relation avec la chronologie générale

L'objectif de cette livraison rapprochée est de fournir une **première build Windows réellement jouable et testable**, et non de terminer toutes les fonctionnalités de RIXE. Elle correspond principalement aux phases 0 et 1 de la section 12, avec les contrôles indispensables de sécurité, de licence et de qualité.

La section 12 reste la chronologie générale du projet. La présente section est un objectif de livraison court terme : elle ne crée pas une deuxième feuille de route et ne permet pas de sauter les prérequis de la section 12. Les étapes suivantes du produit restent planifiées après cette première livraison.

La cible initiale était d'environ douze jours à compter du 19 novembre 2026. Cette durée est indicative et doit être réévaluée selon l'état réel du dépôt, les blocages techniques et les résultats des tests. **La qualité et les preuves priment sur la date.**

### 24.2 Périmètre minimum de la première build

- Build Unreal empaquetée et exécutable sur Windows x64, si l'environnement et les outils disponibles le permettent.
- Démarrage fiable, accès à une partie et boucle complète : déplacement, visée, tir, rechargement, dégâts, élimination, réapparition, score et fin de partie.
- Au moins une carte fonctionnelle et un mode jouable.
- Bots autorisés pour valider la boucle si le multijoueur en ligne n'est pas encore fiable ; leur présence ne doit pas être présentée comme une validation réseau.
- Test multijoueur réel si disponible, en indiquant précisément le nombre de machines, joueurs, réseaux et scénarios testés.
- Aucun crash ou blocage critique connu dans le parcours testé ; les défauts non bloquants doivent être consignés.
- Un lien direct de téléchargement uniquement si la build existe réellement et si le lien a été vérifié. Sinon, expliquer clairement le blocage.
- Rapport indiquant version, branche, commit, plateforme, procédure de lancement, tests exécutés, résultats, limites et fonctionnalités non incluses.

Cette première build n'exige pas que toutes les cartes, playlists, EOS, le matchmaking public, les statistiques avancées, les fonctions communautaires, le classé ou le cross-play soient terminés. Ces éléments ne sont pas supprimés : ils restent soumis à la chronologie générale et à leurs dépendances.

### 24.3 Séquence indicative de livraison

1. **Préparation :** sauvegarde, vérification branche/commit, audit des secrets et licences, reproduction du blocage.
2. **Déblocage :** correction du problème empêchant le lancement, la compilation ou l'accès au jeu ; build de référence.
3. **Boucle jouable :** une carte, un mode, contrôles, armes, dégâts, élimination, réapparition, score et fin de partie.
4. **Stabilisation :** tests fonctionnels, bots si nécessaires, corrections critiques, sauvegarde des réglages et contrôle des régressions.
5. **Empaquetage :** build Windows, lancement depuis un environnement propre, vérification des fichiers et procédure de démarrage.
6. **Livraison :** lien vérifié si disponible, rapport factuel et liste des limites et travaux suivants.

Les jalons calendaires initiaux (jours 1–2, 3–5, 6–8, 9–10 et 11–12) peuvent servir d'estimation, mais ne constituent ni des dates garanties ni des critères de validation.

### 24.4 Gel de périmètre et arbitrage jusqu'à la livraison

- Priorité 1 : sauvegarde, intégrité du dépôt, secrets, licences et risques juridiques bloquants pour la distribution.
- Priorité 2 : blocage empêchant de compiler, lancer ou jouer.
- Priorité 3 : boucle FPS complète sur une carte et un mode.
- Priorité 4 : stabilité, tests fonctionnels et sauvegarde des réglages.
- Priorité 5 : build Windows reproductible, test propre et livraison vérifiable.
- Priorité 6 : uniquement ensuite, travaux secondaires qui ne compromettent pas la livraison.

Ne pas entreprendre avant cette livraison un grand système secondaire (replays, éditeur communautaire, saisons, fonctions sociales avancées, cross-play, navigateur, Learning Agents ou optimisation graphique avancée) sauf s'il corrige directement un blocage, une faille, une incompatibilité ou un risque indispensable à la build.

Ne pas sacrifier l'autorité serveur, la sécurité, les licences, la sauvegarde ou les tests pour respecter une échéance. Si une exigence de sécurité ou de licence bloque la distribution publique, fournir si possible une build de test interne non distribuée et expliquer ce qui interdit sa publication.

### 24.5 Conditions de validation et rapport de livraison

La livraison n'est validée que si :
- la build et le commit correspondent exactement au rapport ;
- le lancement et la boucle de jeu ont été testés réellement ;
- les résultats distinguent tests locaux, tests en réseau et tests sur plusieurs machines ;
- les erreurs, limites et fonctions absentes sont déclarées ;
- les licences et contenus distribués ont été contrôlés ;
- le lien fourni ouvre bien l'artefact attendu, ou son indisponibilité est explicitement indiquée.

Ne jamais qualifier cette étape de jeu complet ou de produit final. Employer le statut exact démontré : prototype jouable, build de test ou alpha.


