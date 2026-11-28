## 7. IA et apprentissage par renforcement

### Bots adaptatifs — difficulté ajustée aux performances

- Ajouter une adaptation facultative du niveau des bots d'entraînement en fonction des performances réellement observées du joueur, afin de proposer un défi progressif sans rendre les exercices artificiellement faciles ou impossibles.
- Évaluer plusieurs indicateurs sur une période suffisante : précision, régularité des éliminations, capacité à survivre, réussite des objectifs et maîtrise des déplacements. Ne pas ajuster la difficulté sur une seule action ou une courte série de tirs.
- Faire évoluer les paramètres par petits paliers et avec une fréquence limitée ; éviter les changements brusques ou perceptibles en plein duel.
- Ajuster uniquement des paramètres de difficulté autorisés et documentés, par exemple la précision, les délais de réaction, la vitesse de décision ou la coordination tactique. Ne jamais modifier les dégâts, les règles de collision ou les résultats après coup pour fabriquer une victoire ou une défaite.
- Les bots ne doivent jamais tricher : aucune connaissance des positions cachées, aucune visée instantanée, aucune information inaccessible à un joueur humain et aucun avantage lié à la latence ou à la réplication.
- Permettre au joueur de désactiver l'adaptation et de choisir un niveau fixe. Afficher clairement lorsque l'adaptation est active et éviter de présenter un niveau adaptatif comme un classement de compétence officiel.
- Réserver cette adaptation aux entraînements et contextes explicitement prévus. En partie multijoueur publique ou compétitive, les bots doivent utiliser des profils déterministes et équitables, sans s'ajuster secrètement aux performances d'un joueur précis.
- Mesurer la stabilité du niveau, la diversité des comportements, l'équité perçue et le coût CPU ; conserver un comportement de difficulté fixe comme solution de secours.

Learning Agents / PPO / imitation learning restent expérimentaux :
- Garder une IA de base fonctionnelle si le plugin ou le modèle appris est indisponible.
- Séparer entraînement, données et exécution en jeu.
- Mesurer précision, survie, contribution aux objectifs, comportement collectif et coût CPU.
- Ne jamais bloquer une partie sur le chargement d'un modèle expérimental.
- Verrouiller et documenter les versions des plugins et dépendances Python.

