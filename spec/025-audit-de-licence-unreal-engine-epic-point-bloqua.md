## 25. Audit de licence Unreal Engine / Epic — contrôle bloquant avant distribution

### Constat actualisé au 28 novembre 2026

- Le code/source logiciel original RIXE identifié dans `THIRD_PARTY_NOTICES.md` est couvert par la **PolyForm Noncommercial License 1.0.0** (fichier `LICENSE`).
- Les créations artistiques et la documentation RIXE originales identifiées dans `THIRD_PARTY_NOTICES.md` sont couvertes par **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** (fichier `LICENSE-ARTWORK.md`).
- Les deux licences accordent des droits non commerciaux et ne confèrent pas aux utilisateurs de droits commerciaux. Ce régime est source-available, pas OSI open source. Le titulaire peut accorder une licence commerciale distincte pour les seuls droits qu'il possède ou contrôle.
- La distinction est fondée sur le fait que PolyForm se définit comme une licence pour le « software », tandis que Creative Commons recommande les licences logicielles pour le code et reconnaît l'usage de CC pour les éléments artistiques distincts (art de jeu, musique) et la documentation. Les fichiers mixtes restent exclus jusqu'à classification.
- Le projet utilise Unreal Engine 5.8 et déclare plusieurs plugins dans `fps.uproject`. Chaque plugin doit être vérifié selon son origine, sa version, sa licence et ses modules Editor/Runtime.
- L'EULA Unreal définit les « Examples » comme le code, l'art et les autres ressources fournis dans les dossiers Samples et Templates de l'installation (§1). Son §5(b) autorise la redistribution des Examples, y compris modifiés, en source ou objet à tout tiers.
- Le dépôt indique partir du modèle officiel « First Person / Arena Shooter », mais la seule mention de ce modèle ne prouve pas que chaque fichier présent, notamment les ressources sous `Content/Characters`, `Content/Weapons`, `Content/Variant_Shooter`, `Content/__ExternalActors__` et `Content/__ExternalObjects__`, provienne exactement des dossiers Samples/Templates. Il faut établir cette provenance fichier par fichier ou par lot homogène.
- L'EULA §6(c) interdit d'associer la Licensed Technology à un code ou contenu dont la licence imposerait que tout ou partie de la technologie Epic soit gouvernée par d'autres conditions. La clause cite explicitement GPL, LGPL (sauf simple liaison dynamique de bibliothèque partagée) et CC BY-SA. Ni PolyForm Noncommercial ni CC BY-NC 4.0 ne sont nommées. Cela ne constitue pas une approbation expresse d'Epic.
- L'Epic Content License Agreement s'applique aux contenus distribués via Marketplace, Learn tab, Quixel et autres canaux couverts. Il limite généralement la redistribution de Licensed Content à l'objet, intégré de manière inséparable dans un projet, et interdit la distribution source publique hors exceptions prévues.
- L'accord Marketplace d'Epic définit une « Prohibited License » qui inclut une licence exigeant que des contenus soient redistribuables sans frais/minimalement ou uniquement à des fins non commerciales. Il interdit de soumettre du contenu contenant de tels éléments ou leurs dérivés (§2(c), §11). Ne soumettre ni les éléments PolyForm ni les éléments CC BY-NC à Fab sans permission écrite ou structure différente juridiquement validée.

### Architecture de licence retenue

1. Garder PolyForm Noncommercial 1.0.0 pour le logiciel/source code RIXE original, dans le périmètre strict de `THIRD_PARTY_NOTICES.md`.
2. Garder CC BY-NC 4.0 pour les œuvres artistiques et la documentation écrite RIXE originales, dans le périmètre strict de `THIRD_PARTY_NOTICES.md`.
3. Garder les fichiers Epic sous les conditions Epic, sans les placer sous une licence RIXE ni prétendre en détenir les droits.
4. Garder les contenus tiers sous leurs licences respectives ; ne pas publier les fichiers sources bruts de contenus dont la licence l'interdit.
5. Pour une build de jeu, distribuer la technologie Epic dans les formats autorisés, avec les conditions utilisateur et crédits requis.
6. Ne pas soumettre de contenu PolyForm ou CC BY-NC à Fab sans autorisation écrite d'Epic et validation juridique.
7. Pour les contributeurs, exiger un accord distinct signé avant d'inclure leur travail dans la version officielle/commerciale ; une PR ne transfère pas automatiquement les droits.

### Contrôles à terminer

- [ ] Prouver la provenance de chaque lot de fichiers du modèle First Person / Arena Shooter installé avec Unreal 5.8.
- [ ] Distinguer les « Examples » (§5(b)) du Starter Content et de toute ressource Epic/Fab issue d'autres canaux.
- [ ] Vérifier chaque actif sous PolyForm et CC BY-NC, les polices, sons, textures, animations et fichiers importés.
- [ ] Auditer les cinq plugins activés dans `fps.uproject`, leur licence et leur inclusion éventuelle dans un package.
- [ ] Vérifier les dépendances Python et les licences avant leur éventuelle redistribution avec les outils.
- [ ] Faire vérifier le package final : formats d'actifs Epic, avis, crédits et EULA utilisateur final.
- [ ] Obtenir une réponse écrite d'Epic ou une revue juridique qualifiée sur la compatibilité effective des deux licences avec l'EULA §6(c).
- [ ] Faire préparer/revoir un accord de contribution conforme au droit applicable ; auditer les contributions déjà intégrées.
- [ ] Refaire les vérifications au moment de chaque publication.

### Conclusion

La séparation entre le logiciel RIXE (PolyForm), les œuvres artistiques/documentaires (CC BY-NC) et la technologie Epic (conditions Epic) est une architecture plus claire. Creative Commons précise que CC convient aux œuvres artistiques séparées comme les graphismes et musiques de jeux, mais déconseille son usage pour les logiciels. Toutefois, la provenance des fichiers et la compatibilité de la combinaison réelle ne sont pas entièrement démontrées ; aucune de ces licences n'est nommée par Epic comme licence approuvée. Le projet ne peut donc pas être déclaré définitivement « sans risque juridique » à ce stade. Ne pas annoncer une build publique ou commerciale comme validée avant la clôture des contrôles.
