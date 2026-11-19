# RIXE

FPS d'arène par équipes, en cours de construction sous **Unreal Engine 5.8** (projet Blueprint).

## État

Voir [UNREAL.md](UNREAL.md) pour le détail des modifications faites dans Unreal.

Le dépôt accueille le projet Unreal du jeu. Le projet part du modèle « First Person / Arena Shooter »
fourni avec le moteur, puis est adapté : arène, règles de match par équipes, bots, interface, réglages.

## Ouvrir le projet

1. Installer Unreal Engine 5.8 (Epic Games Launcher).
2. Cloner ce dépôt.
3. Ouvrir `fps.uproject` à la racine du dépôt. Le jeu démarre sur l'arène `Variant_Shooter/Lvl_ArenaShooter`.

## Jouer à plusieurs

1. Un joueur ouvre le menu (**M**), saisit son pseudo et clique sur « Héberger ».
2. Les autres saisissent l'adresse IP de l'hôte et cliquent sur « Rejoindre » (port UDP 7777).
   Hors réseau local : ouvrir le port 7777 chez l'hôte, ou passer par ZeroTier / Radmin VPN.

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

Le dépôt contient actuellement un fichier [LICENSE](LICENSE) rédigé sous GNU GPL-3.0. **La compatibilité de cette licence avec l'intégration à Unreal Engine et aux contenus Epic n'est pas encore établie** ; elle fait l'objet de l'audit décrit à la section 25 de `CAHIER_DES_CHARGES_RIXE.md`.

Ne pas considérer la présence du fichier `LICENSE` comme une validation juridique de la redistribution du projet. Les contenus Epic, plugins et ressources tierces restent soumis à leurs propres conditions. Aucune publication ou distribution publique ne doit être faite avant la clôture de cet audit et une décision explicite du propriétaire.

## Dossier `prototype-web`

Première piste, mise de côté : un moteur 3D pour navigateur (WebGL2) et une couche réseau,
écrits avant le passage sous Unreal. Ce n'est pas un jeu jouable ; `demo.html` affiche
seulement une scène de test du moteur.
