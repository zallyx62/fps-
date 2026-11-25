# RIXE

FPS d'arène par équipes, en cours de construction sous **Unreal Engine 5.8** (projet Blueprint).

## État

Voir [UNREAL.md](UNREAL.md) pour le détail des modifications faites dans Unreal.

## Reprendre le projet avec Claude

À chaque nouvelle session, Claude doit commencer par lire [CLAUDE.md](CLAUDE.md), puis suivre sa procédure obligatoire de reprise. Le cahier des charges [CAHIER_DES_CHARGES_RIXE.md](CAHIER_DES_CHARGES_RIXE.md) est la référence fonctionnelle unique ; [SUIVI_PHASES_RIXE.md](SUIVI_PHASES_RIXE.md) indique uniquement les phases et preuves réellement vérifiées. Ne pas reprendre une ancienne branche documentaire ni se fier à un ancien résumé de conversation.

Le dépôt accueille le projet Unreal du jeu. Le projet part du modèle « First Person / Arena Shooter »
fourni avec le moteur, puis est adapté : arène, règles de match par équipes, bots, interface, réglages.

## Validation automatique du dépôt

Le workflow GitHub Actions vérifie la configuration JSON du projet, les références des assets de démarrage, la syntaxe Python, les métadonnées des armes et l'existence de leurs Blueprints, la désactivation du ray tracing matériel, la structure des scripts `Tools/dsl/` et la règle de visibilité des armes de la lunette, ainsi que les sorties des générateurs OBJ et PNG. La liste de référence est `Tools/validate_project.py`. **Ces contrôles statiques ne lancent pas Unreal Engine, ne compilent pas les Blueprints ou les shaders, ne testent pas le réseau et ne remplacent pas une build Windows.**

## Ouvrir le projet

1. Installer Unreal Engine 5.8 (Epic Games Launcher).
2. Cloner ce dépôt.
3. Ouvrir `fps.uproject` à la racine du dépôt. Le jeu démarre sur l'arène `Variant_Shooter/Lvl_ArenaShooter`.

## Jouer à plusieurs — prototype actuel

Le prototype documenté dans `UNREAL.md` utilise actuellement `OnlineSubsystem Null` et une connexion directe par IP (port UDP 7777) : un joueur héberge, les autres le rejoignent. Hors réseau local, cette méthode peut nécessiter une configuration du routeur ou un réseau virtuel.

**Important : ce parcours décrit l'état actuel du prototype, pas l'expérience multijoueur finale approuvée.** La cible produit prévoit un matchmaking public automatique comme parcours principal, ainsi que des groupes, invitations et salons privés via EOS. Leur réalisation et leur validation suivent les phases 3 et 4 de la section 12 du cahier des charges : EOS et les parties privées en phase 3, puis le matchmaking public et la consolidation du contenu en phase 4. Ne pas présenter EOS ou le matchmaking public comme déjà disponibles.

## Touches

| Action | Touche |
| --- | --- |
| Se déplacer | ZQSD ou WASD, ou flèches |
| Regarder / viser (zoom) | souris / maintenir clic droit |
| Sauter | Espace |
| Sprinter | maintenir Maj gauche |
| S'accroupir | C (appui) ou maintenir Ctrl gauche |
| Tirer / recharger | clic gauche / R |
| Arme principale / secondaire | 1 / 2 (touches & / é en AZERTY), molette pour alterner |
| Chat écrit | Entrée (Entrée pour envoyer, Échap pour annuler) |
| Chat vocal | maintenir V |
| Menu et réglages | M (ou Échap en jeu compilé) |

Toutes les touches se changent dans **Menu > Touches** (clic sur la case, puis appui sur la nouvelle touche) ;
elles sont enregistrées et rechargées au prochain lancement. La visée peut se faire en maintenant ou en
basculant (Menu > Commandes).

## Licence

Le dépôt contient actuellement un fichier [LICENSE](LICENSE) rédigé sous GNU GPL-3.0. **La compatibilité de cette licence avec l'intégration à Unreal Engine et aux contenus Epic n'est pas encore établie** ; elle fait l'objet de l'audit décrit à la section 25 de `CAHIER_DES_CHARGES_RIXE.md` et du registre [LICENCE_DISTRIBUTION.md](LICENCE_DISTRIBUTION.md).

Ne pas considérer la présence du fichier `LICENSE` comme une validation juridique de la redistribution du projet. Les contenus Epic, plugins et ressources tierces restent soumis à leurs propres conditions. Aucune publication ou distribution publique ne doit être faite avant la clôture de cet audit et une décision explicite du propriétaire.

## Dossier `prototype-web`

Première piste, mise de côté : un moteur 3D pour navigateur (WebGL2) et une couche réseau,
écrits avant le passage sous Unreal. Ce n'est pas un jeu jouable ; `demo.html` affiche
seulement une scène de test du moteur.
