# RIXE — registre de compatibilité des licences et de distribution

**Statut : BLOQUANT POUR LA DISTRIBUTION D'UNE BUILD PUBLIQUE OU COMMERCIALE.**  
Le dépôt source est actuellement public. Le présent registre ne constitue ni une validation juridique ni une autorisation d'Epic.

## Architecture de licences retenue

- **Logiciel et code source RIXE originaux : PolyForm Noncommercial 1.0.0**, dans le périmètre strict de `THIRD_PARTY_NOTICES.md` et du fichier `LICENSE`.
- **Œuvres artistiques et documentation RIXE originales : CC BY-NC 4.0**, dans le périmètre strict de `THIRD_PARTY_NOTICES.md` et du fichier `LICENSE-ARTWORK.md`.
- Les deux régimes sont « source available » / non commerciaux, pas des licences open source OSI. Ils permettent la consultation, l'étude, la modification et le partage non commercial dans leurs périmètres respectifs, mais aucun droit commercial n'est accordé aux utilisateurs.
- Le titulaire conserve la possibilité d'exploiter commercialement les seuls droits qu'il possède ou contrôle et peut accorder une autorisation commerciale distincte par écrit. Aucune licence n'attribue au titulaire les droits d'un contributeur tiers sans cession ou autorisation valable.
- Cette séparation est plus adaptée que l'usage de PolyForm seul pour tous les fichiers : le texte officiel PolyForm accorde des droits sur le « software », tandis que Creative Commons indique que ses licences conviennent aux éléments artistiques séparés d'un jeu (art et musique) et à la documentation, mais recommande des licences spécialisées pour les logiciels.
- Aucun droit d'Epic, d'un contributeur externe ou d'un tiers n'est transféré par ces décisions.

## Compatibilité Unreal / Epic

L'EULA Unreal actuelle (consultée le 28 novembre 2026) :

- Définit les « Examples » comme le code, les illustrations et les autres contenus situés dans les dossiers Samples et Templates de l'installation (§1).
- Autorise la distribution des Examples, y compris modifiés, en code source ou objet à tout tiers (§5(b)).
- Interdit de combiner, distribuer ou utiliser la technologie sous licence avec du code/contenu sous une licence qui imposerait directement ou indirectement d'autres termes à tout ou partie de cette technologie (§6(c)).
- Cite GPL, LGPL (sauf simple liaison dynamique de bibliothèque partagée) et CC BY-SA comme exemples de licences non compatibles. Elle ne nomme ni PolyForm Noncommercial ni CC BY-NC 4.0 ; cette absence n'est pas une approbation expresse.
- Pour un produit distribué incorporant la Licensed Technology, impose que celle-ci soit en code objet et fasse partie intégrante/inséparable du produit (§4). Les conditions de l'EULA imposent également certaines clauses à l'accord utilisateur final et aux crédits.

Le README indique que le projet provient du modèle « First Person / Arena Shooter ». Il faut encore prouver, pour les fichiers réellement présents, qu'ils proviennent bien de la distribution Samples/Templates d'Unreal 5.8 et sont des « Examples » au sens de l'EULA. Ne pas étendre automatiquement cette autorisation aux assets Starter Content, Fab, Learn, Quixel, plugins ou packs externes.

## Fab / Marketplace

L'accord Marketplace d'Epic définit une « Prohibited License » qui inclut des conditions limitant la redistribution au non-commercial et interdit les contenus soumis à cette catégorie dans les éléments présentés au Marketplace (§2(c), §11). PolyForm Noncommercial et CC BY-NC 4.0 sont donc à traiter comme interdites pour les soumissions Fab, sauf autorisation écrite spécifique ou restructuration juridiquement validée. Cette règle concerne les soumissions au Marketplace/Fab et ne constitue pas, à elle seule, une interdiction générale de distribuer le jeu sur d'autres plateformes.

## Périmètres des licences

| Catégorie | Licence | Périmètre provisoire | Exclusions / contrôle |
|---|---|---|---|
| Code/outils RIXE | PolyForm Noncommercial 1.0.0 | Outils Python/DSL, code web original, Blueprints de gameplay, Blueprints d'armes, mappings d'entrée, logique des widgets UI | Exclure les dépendances tierces, les fichiers de provenance incertaine et les ressources Epic |
| Art RIXE | CC BY-NC 4.0 | Modèles, meshes, textures, matériaux visuels, skins, UI textures, sons, musiques, animations, autres œuvres graphiques originales | Auteur, source, droits et attribution vérifiés asset par asset |
| Documentation RIXE | CC BY-NC 4.0 | Markdown racine, cahier des charges, sections `spec/**` | Vérifier les contributions rédactionnelles et conserver les attributions |
| Assets mixtes / non classés | Aucune licence RIXE déclarée | Maps `Content/Rixe/Maps/**`, external actors/objects, contenus mêlant Blueprints et données artistiques | Auditer les dépendances avant toute classification |
| Epic / tiers | Licence d'origine | Engine, Examples, Starter Content, Fab/Learn/Quixel, plugins, assets téléchargés | Respecter strictement les conditions propres à chaque fournisseur |

Les chemins proposés dans `THIRD_PARTY_NOTICES.md` sont des périmètres candidats, pas une preuve que chaque fichier est détenu ou librement redistribuable.

## Règles de distribution à appliquer

1. **Dépôt source :** PolyForm pour le code RIXE d'origine, CC BY-NC pour l'art et la documentation RIXE d'origine ; chaque fichier doit être classé et droits vérifiés. Les contenus Epic/tiers restent sous leurs licences propres.
2. **Examples Unreal :** leur redistribution source est possible uniquement si la source depuis Samples/Templates et leur statut d'Example sont établis pour la version utilisée (§5(b)).
3. **Starter Content et contenus provenant d'autres canaux :** appliquer leur licence propre. Ne pas assimiler ces contenus aux Examples.
4. **Build du jeu :** les éléments Epic intégrés doivent être distribués dans les formats et conditions autorisés, notamment en code objet comme partie inséparable du produit. Prévoir un EULA utilisateur final approprié et les crédits/avis requis.
5. **Fab :** ne pas soumettre le contenu RIXE sous PolyForm Noncommercial ou CC BY-NC à Fab sans permission écrite d'Epic et validation juridique.
6. **Contributions :** ne pas considérer l'ouverture d'une PR comme une cession de droits. Aucune contribution externe ne doit entrer dans une release commerciale sans accord écrit distinct et examiné juridiquement, définissant les droits commerciaux nécessaires au propriétaire.
7. **Parité :** le contenu officiel et le catalogue cosmétique doivent être identiques et accessibles selon les mêmes règles à tous les joueurs ; aucune vente de skins exclusifs par des tiers ou avantage payant.
8. **Contrôle final :** refaire l'inventaire et le contrôle de licence sur l'artefact exact à publier, pas uniquement sur le dépôt de développement.

## Conclusion provisoire

La séparation PolyForm pour le code, CC BY-NC pour les œuvres artistiques/documentaires, et conditions Epic propres aux fichiers Epic, est une architecture plus claire. Creative Commons confirme que ses licences peuvent être appliquées à des œuvres artistiques séparées comme les graphismes et musiques de jeux, contrairement au logiciel lui-même. Toutefois, la compatibilité juridique du projet combiné sous l'EULA Unreal n'est pas explicitement approuvée par Epic ; la provenance de tous les assets n'est pas encore établie. Ne pas annoncer une build distribuable comme définitivement autorisée avant confirmation écrite d'Epic ou revue juridique qualifiée et clôture de l'inventaire.
