# RIXE — registre de compatibilité des licences et de distribution

**Statut : BLOQUANT POUR TOUTE DISTRIBUTION PUBLIQUE.**  
Ce registre est un outil de suivi technique ; il ne constitue pas un avis juridique ni une conclusion de compatibilité.

## État constaté

- Le dépôt contient un fichier LICENSE sous GNU GPL-3.0.
- Le projet Unreal 5.8 est issu du modèle First Person / Arena Shooter et contient des assets binaires Unreal.
- Le projet déclare des plugins Unreal et des plugins/outils MCP ; leurs versions, licences et conditions de redistribution doivent être vérifiées individuellement.
- La présence de la GPL dans le dépôt ne prouve pas que tous les assets, plugins, exemples Epic ou dépendances peuvent être redistribués sous cette licence.
- Aucun changement automatique de licence ne doit être fait avant d'avoir déterminé le périmètre et les droits applicables.

## Inventaire à compléter avant toute distribution

| Élément | État | Contrôle requis |
|---|---|---|
| Code original RIXE | À inventorier | Auteur, titulaire des droits, licence choisie et portée exacte |
| Assets du modèle Epic / Unreal | Non vérifié | Conditions Epic applicables à chaque ressource et possibilités de redistribution |
| Assets créés pour RIXE | À inventorier | Provenance, auteur, fichiers sources et licence |
| Plugins Unreal | Non vérifié | Nom/version, fournisseur, licence, dépendances, autorisation de redistribution |
| Outils MCP et plugins d'éditeur | Non vérifié | Disponibilité, licences, périmètre Editor/Runtime et inclusion éventuelle dans une build |
| Bibliothèques Python | À documenter | Versions, licences, notices et inclusion éventuelle dans les outils distribués |
| Polices, sons, textures et références externes | À inventorier | Provenance, licence, attribution et restrictions |

## Conditions de levée du blocage

1. Établir l'inventaire fichier par fichier ou par lot homogène avec une provenance vérifiable.
2. Conserver les licences et notices exigées par chaque dépendance.
3. Distinguer clairement le code original, les contenus tiers et les éléments fournis sous les conditions Unreal/Epic.
4. Faire valider la licence finale et les modalités de distribution du dépôt, des builds et des contenus par une personne compétente.
5. Mettre à jour LICENSE, les notices et la documentation uniquement après cette décision explicite.
6. Refaire le contrôle sur l'artefact exact destiné à être publié.

**Règle de sécurité :** tant que ces contrôles ne sont pas terminés, poursuivre le développement et les tests internes dans les limites des droits applicables, mais ne pas annoncer la redistribution du jeu ou de ses assets comme autorisée.
