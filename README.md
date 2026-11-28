# RIXE

FPS d'arène par équipes, en cours de construction sous **Unreal Engine 5.8** (projet Blueprint).

## État

Voir [UNREAL.md](UNREAL.md) pour le détail des modifications faites dans Unreal.

## Reprendre le projet avec Claude

À chaque nouvelle session, Claude doit commencer par lire [CLAUDE.md](CLAUDE.md), puis suivre sa procédure obligatoire de reprise. La référence fonctionnelle est découpée dans [spec/INDEX.md](spec/INDEX.md) et les fichiers de section `spec/*.md` ; [CAHIER_DES_CHARGES_RIXE.md](CAHIER_DES_CHARGES_RIXE.md) est le miroir agrégé généré. [DECISIONS_GAMEPLAY_2026-11-25.md](DECISIONS_GAMEPLAY_2026-11-25.md) consigne les règles de gameplay approuvées et leurs valeurs de réglage provisoires ; [SUIVI_PHASES_RIXE.md](SUIVI_PHASES_RIXE.md) indique uniquement les phases et preuves réellement vérifiées. Ne pas reprendre une ancienne branche documentaire ni se fier à un ancien résumé de conversation.

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

## Licence et droits commerciaux

Le contenu original de RIXE dont le propriétaire détient effectivement les droits est mis à disposition en **source disponible** sous la [PolyForm Noncommercial License 1.0.0](LICENSE), dans le périmètre décrit par [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Tout le monde peut le consulter, l'étudier, le modifier et le redistribuer pour des usages non commerciaux, sous les conditions de cette licence. **La revente et toute exploitation commerciale ne sont pas autorisées aux utilisateurs sans licence commerciale écrite distincte accordée par le titulaire des droits.** Le propriétaire peut accorder cette licence commerciale séparément pour les droits qu'il détient. Ce régime n'est pas une licence « open source » au sens de l'OSI.

La licence RIXE ne couvre jamais Unreal Engine, les éléments Epic, les plugins ou les autres contenus tiers : ceux-ci restent sous leurs licences propres. La redistribution des exemples officiels Unreal n'est permise que si leur provenance depuis les dossiers Samples/Templates de l'installation et leur statut d'« Examples » au sens de l'EULA sont confirmés. Les contenus Fab/Marketplace, Learn et Quixel nécessitent un contrôle distinct. Voir [LICENCE_DISTRIBUTION.md](LICENCE_DISTRIBUTION.md). Aucun contenu placé sous PolyForm Noncommercial ne doit être soumis à Fab sans validation écrite d'Epic.

**Parité du contenu :** le jeu officiel doit proposer à tous les joueurs le même contenu de base et le même catalogue de skins/cosmétiques, sans skin payant exclusif, avantage payant ou catalogue différent selon la plateforme ou la région. Les cosmétiques officiels suivent les mêmes règles de disponibilité et de déblocage pour tous. Les réglages graphiques locaux peuvent adapter le rendu aux performances de chaque machine ; ils ne doivent pas retirer de contenu, modifier le gameplay ou procurer un avantage compétitif. Cela ne promet pas un rendu pixel pour pixel identique sur des matériels différents.

Les contributions externes ne seront intégrées à une version officielle ou commerciale qu'après accord écrit distinct, vérifié juridiquement, donnant au propriétaire les droits commerciaux nécessaires sur la contribution. Voir [CONTRIBUTING.md](CONTRIBUTING.md). Les apports déjà présents doivent être audités individuellement.

## Dossier `prototype-web`

Première piste, mise de côté : un moteur 3D pour navigateur (WebGL2) et une couche réseau,
écrits avant le passage sous Unreal. Ce n'est pas un jeu jouable ; `demo.html` affiche
seulement une scène de test du moteur.
