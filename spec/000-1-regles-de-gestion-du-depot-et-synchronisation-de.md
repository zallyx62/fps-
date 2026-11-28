## Règles de gestion du dépôt et synchronisation des branches

- `main` est la branche de référence : le cahier des charges, les décisions approuvées et les changements validés y sont centralisés.
- `jeu-unreal` est une branche miroir de `main`, pas une branche de développement indépendante. Elle doit rester au même commit que `main`.
- Après chaque mise à jour de `main`, GitHub Actions synchronise automatiquement `jeu-unreal` par avance rapide. La synchronisation doit aussi pouvoir être lancée manuellement.
- La synchronisation automatique est strictement non destructive : aucun push forcé, aucune réécriture d'historique et aucun écrasement de commits propres à `jeu-unreal`.
- Si la branche miroir diverge ou contient des commits qui ne sont pas dans `main`, l'automatisation doit échouer sans modifier la branche. Il faut alors comparer les changements et résoudre explicitement la divergence avant de reprendre la synchronisation.
- Toute nouvelle tâche de développement doit partir de `main` dans une branche de travail dédiée ; ne pas développer directement sur la branche miroir.
- Après chaque synchronisation, vérifier que les deux références pointent sur le même SHA et que les validations automatiques se déclenchent. Une synchronisation réussie ne constitue pas une preuve de compilation Unreal, de test de gameplay ou de livraison.
- Mettre à jour cette règle et les instructions de développement si l'organisation des branches change. Ne jamais annoncer que les branches sont synchronisées sans avoir vérifié leurs références GitHub.

