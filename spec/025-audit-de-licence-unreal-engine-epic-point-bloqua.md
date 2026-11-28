## 25. Audit de licence Unreal Engine / Epic — contrôle bloquant avant distribution

### Constat actualisé au 28 novembre 2026

- Le fichier racine `LICENSE` contient désormais la **PolyForm Noncommercial License 1.0.0**, à la suite de la décision explicite du propriétaire du 28 novembre 2026. La licence ne s'applique qu'aux créations originales RIXE effectivement détenues/contrôlées par le propriétaire et listées dans `THIRD_PARTY_NOTICES.md`. Elle ne couvre pas tout le contenu du dépôt.
- La licence autorise les usages, modifications et redistributions non commerciaux de son périmètre. Elle ne donne pas aux tiers de droits commerciaux. Ce régime est source-available, pas OSI open source.
- Le projet utilise Unreal Engine 5.8 et déclare plusieurs plugins dans `fps.uproject`. Chaque plugin doit être vérifié selon son origine, sa version, sa licence et ses modules Editor/Runtime.
- L'EULA Unreal définit les « Examples » comme le code, l'art et les autres ressources fournis dans les dossiers Samples et Templates de l'installation (§1). Son §5(b) autorise la redistribution des Examples, y compris modifiés, en source ou objet à tout tiers.
- Le dépôt indique partir du modèle officiel « First Person / Arena Shooter », mais la seule mention de ce modèle ne prouve pas que chaque fichier présent, notamment les ressources sous `Content/Characters`, `Content/Weapons`, `Content/Variant_Shooter`, `Content/__ExternalActors__` et `Content/__ExternalObjects__`, provienne exactement des dossiers Samples/Templates. Il faut établir cette provenance fichier par fichier ou par lot homogène.
- L'EULA §6(c) interdit d'associer la Licensed Technology à un code ou contenu dont la licence imposerait que tout ou partie de la technologie Epic soit gouvernée par d'autres conditions. La clause cite explicitement GPL, LGPL (sauf simple liaison dynamique de bibliothèque partagée) et CC BY-SA. PolyForm Noncommercial n'est pas nommée. Cela ne constitue pas une approbation expresse d'Epic.
- L'Epic Content License Agreement s'applique aux contenus distribués via Marketplace, Learn tab, Quixel et autres canaux couverts. Il limite généralement la redistribution de Licensed Content à l'objet, intégré de manière inséparable dans un projet, et interdit la distribution source publique hors exceptions prévues.
- L'accord Marketplace d'Epic définit une « Prohibited License » qui inclut une licence exigeant que des contenus soient redistribuables sans frais/minimalement ou uniquement à des fins non commerciales. Il interdit de soumettre du contenu contenant de tels éléments ou leurs dérivés (§2(c), §11). PolyForm Noncommercial ne doit donc pas être utilisée pour une soumission Fab/Marketplace sans permission écrite ou structure différente juridiquement validée.

### Architecture de licence retenue

1. Garder PolyForm Noncommercial 1.0.0 pour les créations originales RIXE, dans le périmètre strict de `THIRD_PARTY_NOTICES.md`.
2. Garder les fichiers Epic sous les conditions Epic, sans les placer sous PolyForm ni prétendre en détenir les droits.
3. Garder les contenus tiers sous leurs licences respectives ; ne pas publier les fichiers sources bruts de contenus dont la licence l'interdit.
4. Pour une build de jeu, distribuer la technologie Epic dans les formats autorisés, notamment en code objet comme partie inséparable du jeu, avec les conditions utilisateur et crédits requis.
5. Ne pas soumettre de contenu PolyForm à Fab sans autorisation écrite d'Epic et validation juridique.
6. Pour les contributeurs, exiger un accord distinct signé avant d'inclure leur travail dans la version officielle/commerciale ; une PR ne transfère pas automatiquement les droits.

### Contrôles à terminer

- [ ] Prouver la provenance de chaque lot de fichiers du modèle First Person / Arena Shooter installé avec Unreal 5.8.
- [ ] Distinguer les « Examples » (§5(b)) du Starter Content et de toute ressource Epic/Fab issue d'autres canaux.
- [ ] Vérifier chaque actif de `Content/Rixe`, les polices, sons, textures, animations et fichiers importés.
- [ ] Auditer les cinq plugins activés dans `fps.uproject`, leur licence et leur inclusion éventuelle dans un package.
- [ ] Vérifier les dépendances Python et les licences avant leur éventuelle redistribution avec les outils.
- [ ] Faire vérifier le package final : formats d'actifs Epic, avis, crédits et EULA utilisateur final.
- [ ] Obtenir une réponse écrite d'Epic ou une revue juridique qualifiée sur la compatibilité effective de PolyForm et de l'EULA §6(c).
- [ ] Faire préparer/revoir un accord de contribution conforme au droit applicable ; auditer les contributions déjà intégrées.
- [ ] Refaire les vérifications au moment de chaque publication.

### Conclusion

La séparation entre les créations RIXE et la Licensed Technology d'Epic est une approche plausible, et l'EULA autorise explicitement la redistribution source des Examples officiels sous §5(b). Cependant, la provenance des fichiers et la compatibilité de la combinaison réelle ne sont pas entièrement démontrées ; PolyForm n'est pas nommée par Epic comme licence approuvée. Le projet ne peut donc pas être déclaré définitivement « sans risque juridique » à ce stade. Le développement peut continuer, mais ne pas annoncer une build publique ou commerciale comme validée avant la clôture des contrôles.
