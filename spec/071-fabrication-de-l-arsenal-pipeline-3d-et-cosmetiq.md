## 71. Fabrication de l'arsenal, pipeline 3D et cosmétiques de mêlée — ajout approuvé le 23 novembre 2026

Cette section définit la méthode de production des modèles d'armes RIXE, leur ordre de fabrication indicatif et les règles des apparences cosmétiques de mêlée. Elle ne constitue pas une preuve que les armes ou les outils sont déjà intégrés au projet.

### 71.1 Principes de création et propriété intellectuelle
- Les armes inspirées de jeux tiers (Black Ops II, Black Ops III, XDefiant, Apex Legends ou autres) doivent être recréées de manière indépendante : ne pas extraire, convertir ou réutiliser des modèles, textures, animations, sons, fichiers ou éléments artistiques provenant des jeux.
- Ne pas reproduire à l'identique les designs distinctifs protégés d'une arme fictive sans autorisation écrite couvrant explicitement les droits nécessaires.
- Utiliser les armes des jeux sources comme références de gameplay et de documentation, et comme inspirations générales de conception uniquement dans les limites des droits applicables.
- Les statistiques d'une arme issue d'un jeu source doivent être documentées séparément du modèle visuel : jeu, version/patch, configuration de référence, cadence, dégâts, rechargement, recul, dispersion, chargeur, temps de visée, portée, perte de dégâts, vitesse de projectile et autres paramètres pertinents.
- Ne pas inventer ou modifier les statistiques de référence pour faciliter la modélisation ou l'équilibrage. Tout écart nécessaire dans RIXE doit être signalé et soumis à décision avant modification.
- Les armes originales RIXE disposent d'un design propre, conçu sans copier un modèle protégé. Les droits et licences de chaque ressource intégrée doivent être vérifiés et documentés.

### 71.2 Outils gratuits et pipeline de fabrication
- Respecter le budget de 0 € : aucun logiciel, modèle, texture, animation, son, plugin ou service payant ne doit être une dépendance obligatoire.
- Utiliser Blender pour la modélisation 3D, la séparation des pièces mobiles, les UV, le rigging et les animations.
- Utiliser Krita pour la création et la retouche des textures 2D.
- Utiliser Material Maker pour créer les matériaux et textures procédurales PBR lorsque cela est utile.
- Utiliser Unreal Engine 5 pour l'intégration, les matériaux en jeu, les animations, l'éclairage, le rendu et les tests de performance.
- Vérifier la compatibilité exacte des versions retenues avec Windows 10 et les caractéristiques de la machine avant installation ou adoption définitive. Ne pas imposer une version non vérifiée.
- Prévoir un pipeline de production : références légales et fiche de conception ; blockout/silhouette ; modélisation détaillée ; séparation des pièces mobiles ; UV ; matériaux et textures PBR ; baking/optimisation ; rigging et animations ; export ; intégration Unreal ; contrôle visuel et performance.
- Viser une qualité visuelle réaliste et détaillée comparable aux références de grands FPS, sans promettre un résultat AAA automatique : la qualité doit être évaluée sur des captures en jeu et des tests réels.
- Produire des modèles game-ready, avec géométrie adaptée, textures cohérentes, niveaux de détail si nécessaires, collisions et pièces mobiles correctement configurées.
- Réutiliser les méthodes, gabarits techniques et matériaux génériques lorsque cela est pertinent, sans rendre toutes les armes visuellement identiques.

### 71.3 Ordre indicatif de fabrication de la présélection de 34 armes
- L'ordre de fabrication est une priorité de production 3D, pas un classement de puissance, de popularité ou de valeur compétitive.
- La difficulté est estimative et doit être réévaluée après le premier prototype ; elle dépend du niveau de détail, des pièces mobiles, des animations et des ressources légales disponibles.
- Première série proposée : B23R (BO2), RK5 (BO3), D50 (XDefiant), puis AN-94 (BO2), KN-44 (BO3), ACR 6.8 (XDefiant), R-301 Carbine (Apex) et VK-47 Flatline (Apex).
- Série suivante : MSMC (BO2), VMP (BO3), MP7 (XDefiant), P90 (XDefiant), Prowler (Apex), puis LSAT (BO2), Dingo (BO3), M249 (XDefiant) et Spitfire (Apex).
- Série intermédiaire : FAL OSW (BO2), M8A1 (BO3), MK20 SSR (XDefiant), G7 Scout (Apex), puis KSG (BO2), Brecci (BO3), M870 (XDefiant) et Peacekeeper (Apex).
- Série plus exigeante : DSR 50 (BO2), Locus (BO3), TAC-50 (XDefiant) et Sentinel (Apex).
- Armes atypiques à traiter dans une série dédiée : RPG (BO2) et XM-53 (BO3). Leur présence et leurs règles doivent respecter les playlists et restrictions d'arsenal prévues.
- Les couteaux BO2 et BO3 de la présélection sont traités comme références de gameplay éventuelles ; leurs designs visuels doivent être originaux ou dûment autorisés.
- Cet ordre reste indicatif et ne transforme pas la présélection en catalogue définitivement validé. Vérifier les doublons, la disponibilité des références de statistiques, les droits et la faisabilité avant chaque production.

### 71.4 Prototype de référence et contrôle qualité
- Commencer par un seul prototype d'arme afin de définir le standard de fabrication RIXE avant de produire toute la série.
- Le prototype doit inclure le modèle détaillé, les pièces mobiles, les UV, les matériaux PBR, les textures, les animations essentielles, l'export et l'intégration dans Unreal.
- Valider le rendu en vue première personne et en inspection rapprochée : silhouette, lisibilité, matériaux, détails, éclairage, clipping, animations et performances.
- Consigner pour chaque arme sa source de référence de gameplay, sa version, ses statistiques documentées, les ressources utilisées, leurs licences, les fichiers sources Blender et les exports Unreal.
- Ne pas considérer une arme comme terminée sur la seule base d'une image de rendu ou d'une documentation : exiger une intégration testée dans une build du jeu.

### 71.5 Apparences cosmétiques de mêlée
- Proposer plusieurs apparences cosmétiques de mêlée, notamment : couteau classique, karambit, faux, masse, marteau et autres variantes visuelles originales compatibles avec l'identité de RIXE.
- Ces apparences sont des skins/variantes cosmétiques d'un même équipement de mêlée de base ; elles ne constituent pas des armes aux statistiques ou classes de gameplay différentes.
- Toutes les apparences utilisent exactement les mêmes paramètres de déplacement et de combat que l'équipement de mêlée de base : vitesse de marche, vitesse de course, accélération, mobilité, portée, dégâts, cadence d'attaque, récupération, hitbox et délais d'action identiques.
- Aucun skin ne doit procurer d'avantage ou de désavantage compétitif. Les différences de silhouette, d'animation ou de taille apparente ne doivent pas modifier la portée perçue de façon trompeuse ni la zone réelle de collision.
- Les animations et points de contact doivent rester cohérents avec l'apparence équipée, tout en conservant les mêmes fenêtres d'attaque et de récupération.
- Les skins doivent être obtenus et utilisés selon le système cosmétique/progression existant, sans créer un système parallèle. Les règles de licence et de création indépendante s'appliquent à chaque apparence.
- Prévoir une vérification visuelle et fonctionnelle de chaque skin à la première personne et à la troisième personne, notamment pour éviter les problèmes de clipping, de lisibilité et de collision.

### 71.6 Statut et contraintes
- Les éléments de cette section sont des exigences approuvées et planifiées ; ils ne sont pas réputés implémentés tant que les modèles, textures, animations et tests correspondants ne sont pas présents et vérifiés dans le dépôt et dans une build.
- Respecter le budget de 0 €, les licences des ressources, les priorités de stabilité et l'ordre général de réalisation de RIXE.

