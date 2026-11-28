## 25. Audit de licence Unreal Engine / Epic — point bloquant à résoudre avant distribution

### Constat vérifié dans le dépôt et les conditions Epic consultées le 19 novembre 2026
- Le dépôt contient un fichier `LICENSE` intégralement rédigé sous GNU GPL version 3.
- Le `README.md` indique seulement que le dépôt contient un fichier `LICENSE` GNU GPL-3.0 et que la compatibilité avec Unreal/Epic reste à auditer ; il ne fournit pas, à lui seul, un inventaire d'attribution de licence par fichier ou dossier. Ne pas en déduire que chaque élément de `Content/Rixe` est effectivement détenu ou licencié par le propriétaire sous GPL-3.0.
- Le projet `fps.uproject` déclare Unreal Engine 5.8 et active plusieurs plugins ; chaque plugin, module, contenu et dépendance doit être inventorié avec sa version et sa licence.
- La version actuelle de l'Unreal Engine EULA publiée par Epic contient une clause « Non-Compatible Licenses » (section 6(c)) qui cite explicitement GNU GPL et LGPL (sauf simple liaison dynamique d'une bibliothèque partagée) parmi les licences incompatibles avec la Licensed Technology. L'accord limite aussi la redistribution du moteur et du contenu Epic ; les produits intégrant le moteur doivent respecter les conditions de distribution applicables.
- Ce constat crée un risque sérieux de compatibilité entre la GPL-3.0 annoncée pour le projet et l'utilisation/intégration d'Unreal Engine. Il ne permet pas, à lui seul, de conclure que chaque fichier du dépôt est soumis à la même licence ou que le propriétaire détient les droits nécessaires pour relicencier tous les éléments.

### Consignes obligatoires
- **Ne pas remplacer, supprimer ou réécrire le fichier `LICENSE` automatiquement.** Ne pas annoncer que le problème est réglé par un simple changement global vers MIT, BSD ou Apache.
- Auditer fichier par fichier et dossier par dossier : code original, Blueprints et assets originaux, modèle First Person/Arena Shooter, Starter Content, exemples Epic, contenus Fab/Quixel, plugins, bibliothèques, sons, polices, textures, animations, outils et prototype web.
- Pour chaque élément, relever auteur/source, version, propriétaire des droits, licence exacte, preuve d'acquisition, droits de modification, redistribution, usage commercial et restrictions de plateforme/source.
- Séparer clairement les éléments originaux RIXE des éléments Epic et des tiers. Ne pas appliquer une licence open source au contenu Epic ou tiers sans autorisation expresse.
- Vérifier si les fichiers originaux placés dans le même projet Unreal et distribués avec le moteur peuvent légalement rester sous GPL au regard de la clause 6(c). Examiner une architecture de licences séparées ou une licence permissive pour les seuls éléments originaux, uniquement si le propriétaire possède les droits nécessaires et après validation juridique.
- Ne pas présumer que MIT résout toutes les obligations : conserver les notices tierces, respecter les licences des plugins/assets et les règles de redistribution d'Epic.
- Produire un rapport de compatibilité, les éléments incertains, les options de remédiation et leurs conséquences sur l'ouverture du code, la distribution des sources et les builds binaires.
- Si la compatibilité ne peut pas être établie, suspendre la publication/distribution publique des éléments concernés jusqu'à décision du propriétaire après avis juridique adapté. Le travail privé de développement ne doit pas être confondu avec une autorisation de redistribuer.
- Consigner la version et la date de l'EULA examinée ; revérifier les conditions Epic au moment de toute distribution.

### Décision de licence
Aucune modification de licence n'est autorisée sans inventaire complet, preuve des droits du propriétaire sur chaque élément concerné et approbation explicite du propriétaire. Toute modification doit être ciblée, documentée et vérifiée dans toutes les branches et tous les fichiers de notices concernés.


