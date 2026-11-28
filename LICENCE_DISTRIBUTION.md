# RIXE — registre de compatibilité des licences et de distribution

**Statut : BLOQUANT POUR LA DISTRIBUTION D'UNE BUILD PUBLIQUE OU COMMERCIALE.**  
Le dépôt source est actuellement public. Le présent registre ne constitue ni une validation juridique ni une autorisation d'Epic.

## Décision actuelle

- Le propriétaire a approuvé le 28 novembre 2026 la licence **PolyForm Noncommercial 1.0.0** pour les seules créations originales RIXE définies dans `THIRD_PARTY_NOTICES.md`.
- La licence est « source disponible » : consultation, modification et redistribution non commerciales sont autorisées sous ses conditions. Elle n'est pas une licence open source OSI. Les usages commerciaux nécessitent une licence commerciale distincte du titulaire des droits.
- La décision PolyForm ne couvre pas Unreal Engine, les Examples/Starter Content d'Epic, les contenus Fab/Marketplace/Learn/Quixel, les plugins tiers ni les autres ressources sous licence tierce.
- La clause Non-Compatible Licenses de l'EULA Unreal (§6(c)) ne cite pas PolyForm. Cela ne vaut pas approbation expresse. Il faut vérifier que la séparation de licences est effective dans le projet combiné et obtenir une confirmation écrite d'Epic ou une revue juridique qualifiée.
- Aucune build publique ou commerciale ne doit être annoncée comme autorisée tant que les contrôles de provenance, de packaging, de licences et de conditions utilisateur ci-dessous ne sont pas terminés.

## Découverte importante : les Examples officiels Unreal

L'EULA Unreal actuelle (consultée le 28 novembre 2026) :

- Définit les « Examples » comme le code, les illustrations et les autres contenus situés dans les dossiers Samples et Templates de l'installation (§1).
- Autorise la distribution des Examples, y compris modifiés, en code source ou objet à tout tiers (§5(b)).
- Interdit de combiner, distribuer ou utiliser la technologie sous licence avec du code/contenu sous une licence qui imposerait directement ou indirectement d'autres termes à tout ou partie de cette technologie (§6(c)).
- Pour un produit distribué incorporant la Licensed Technology, impose que celle-ci soit en code objet et fasse partie intégrante/inséparable du produit (§4). Les conditions de l'EULA imposent également certaines clauses à l'accord utilisateur final et aux crédits.

Le README indique que le projet provient du modèle « First Person / Arena Shooter ». Il faut encore prouver, pour les fichiers réellement présents, qu'ils proviennent bien de la distribution Samples/Templates d'Unreal 5.8 et sont des « Examples » au sens de l'EULA. Ne pas étendre automatiquement cette autorisation aux assets Starter Content, Fab, Learn, Quixel, plugins ou packs externes.

## Inventaire à compléter

| Élément | État observé | Contrôle obligatoire |
|---|---|---|
| Code et outils RIXE | Périmètre PolyForm défini | Confirmer l'auteur et les droits de chaque contribution |
| `Content/Rixe/**` | 86 entrées, dossiers compris ; provenance non vérifiée exhaustivement | Vérifier les sources, auteurs, licences et éventuels dérivés Epic/tiers |
| Modèle First Person / Arena Shooter | Présent dans le dépôt | Relier chaque fichier à Samples/Templates UE 5.8 et à la définition d'Example |
| `__ExternalActors__` / `__ExternalObjects__` | Fichiers présents | Relier les fichiers générés à leur carte/source et vérifier le contenu embarqué |
| Engine Code / Engine Tools | Pas d'Engine Code identifié dans l'arborescence inspectée | Ne pas ajouter ni distribuer ces éléments hors des voies permises |
| Plugins du projet | Cinq déclarés dans `fps.uproject` | Vérifier version, origine, licence, modules Editor/Runtime et inclusion dans le package |
| Fab / Learn / Quixel | Aucun actif public déclaré comme autorisé | Enregistrer chaque ressource et interdire la redistribution source sans permission |
| Dépendances Python | `numpy`, `scipy`, `Pillow` listés | Fixer les versions et vérifier les licences avant toute inclusion dans un outil distribué |
| Polices, sons, textures, animations importés | Inventaire incomplet | Source, auteur, licence, attribution et droit de redistribution pour chaque lot |

## Règles de distribution à appliquer

1. **Dépôt source :** PolyForm ne couvre que les créations RIXE originales autorisées. Les fichiers Epic restent séparés et sous les conditions Epic. Les fichiers non vérifiés sont exclus jusqu'à preuve de provenance.
2. **Examples Unreal :** leur redistribution source est possible uniquement si la source depuis Samples/Templates et leur statut d'Example sont établis pour la version utilisée (§5(b)).
3. **Starter Content et contenus provenant d'autres canaux :** appliquer leur licence propre. Ne pas assimiler ces contenus aux Examples.
4. **Build du jeu :** les éléments Epic intégrés doivent être distribués dans les formats et conditions autorisés, notamment en code objet comme partie inséparable du produit. Prévoir un EULA utilisateur final approprié et les crédits/avis requis.
5. **Fab :** ne pas soumettre le contenu RIXE sous PolyForm Noncommercial. L'accord Marketplace définit comme « Prohibited License » les licences limitant la redistribution au non-commercial ou imposant certaines obligations de redistribution et interdit les contenus qui en dépendent (§2(c), §11). Une autorisation écrite spécifique ou une restructuration juridiquement validée serait nécessaire.
6. **Contributions :** ne pas considérer l'ouverture d'une PR comme une cession de droits. Aucune contribution externe ne doit entrer dans une release commerciale sans accord écrit distinct et examiné juridiquement, définissant les droits commerciaux exclusifs nécessaires au propriétaire.
7. **Parité :** le contenu officiel et le catalogue cosmétique doivent être identiques et accessibles selon les mêmes règles à tous les joueurs ; aucune vente de skins exclusifs par des tiers ou avantage payant.
8. **Contrôle final :** refaire l'inventaire et le contrôle de licence sur l'artefact exact à publier, pas uniquement sur le dépôt de développement.

## Conclusion provisoire

La séparation PolyForm/Epic est une architecture de licence plausible, et l'EULA prévoit une autorisation de redistribution source pour les Examples officiels. Toutefois, l'EULA ne cite pas PolyForm comme licence approuvée et la provenance des fichiers du dépôt n'est pas intégralement démontrée. La compatibilité définitive ne peut donc pas être affirmée. Conserver le dépôt en développement, ne pas annoncer une build distribuable comme juridiquement validée, et demander une confirmation écrite à Epic / une revue par un professionnel du droit de la propriété intellectuelle.
