## 55. Approfondissements approuvés du combat et de l'armement — 22 novembre 2026

Cette section formalise huit décisions de gameplay explicitement approuvées. Elle complète les systèmes d'armes, d'accessoires, de dégâts, de score et de rechargement déjà décrits dans les sections précédentes. Elle ne doit pas créer de systèmes parallèles.

### 55.1 Gestion avancée des accessoires
- Permettre une gestion plus complète des accessoires compatibles avec chaque arme : sélection, montage, retrait et remplacement depuis l'atelier ou l'écran de configuration.
- Définir les compatibilités par arme et par emplacement ; empêcher les combinaisons techniquement impossibles.
- Afficher clairement les effets réels de chaque accessoire sur les caractéristiques utiles (maniabilité, recul, précision, vitesse de visée, mobilité ou autres paramètres effectivement implémentés).
- Éviter les accessoires strictement obligatoires : chaque choix doit présenter des compromis compréhensibles et équilibrables.
- Réutiliser le système de personnalisation et de maîtrise des armes existant ; ne pas créer une progression d'accessoires indépendante.

### 55.2 Tirs traversants selon le calibre et les matériaux
- Permettre à certains projectiles de traverser des matériaux lorsque leur énergie et leur comportement balistique le permettent.
- Déterminer la pénétration selon le calibre, le type de munition, la vitesse ou l'énergie restante et les propriétés du matériau traversé.
- Différencier les surfaces et épaisseurs ; une même arme ne doit pas traverser tous les murs ni toutes les protections.
- Appliquer une perte d'énergie et, lorsque pertinent, une modification des dégâts et de la précision après chaque traversée.
- Valider les impacts et dégâts côté serveur ; synchroniser les résultats de manière cohérente en multijoueur.
- Prévoir des effets visuels et sonores lisibles sans révéler artificiellement la position d'un joueur qui ne devrait pas être détectée.

### 55.3 Ramassage des armes laissées par les adversaires
- Autoriser un joueur à récupérer une arme abandonnée par un adversaire lorsque les règles du mode le permettent.
- Afficher une interaction claire indiquant l'arme récupérable et les conditions de ramassage.
- Définir les limites de transport, le remplacement de l'arme actuellement portée, les munitions récupérées et la durée de disponibilité au sol.
- Éviter les duplications, les ramassages simultanés incohérents et les abus de génération de munitions ; le serveur arbitre la possession.
- Respecter les restrictions des modes à équipement verrouillé ou à progression d'armes, notamment Jeu d'armes.

### 55.4 Signalement visuel des ennemis
- Fournir un retour visuel temporaire lorsqu'un ennemi est effectivement repéré par un mécanisme autorisé du jeu.
- Définir la durée, la précision et les conditions de visibilité du signalement selon le mode et la source du repérage.
- Ne pas transformer le signalement en suivi permanent à travers les murs ; limiter les informations transmises pour préserver le contre-jeu.
- Réutiliser les marqueurs tactiques contextuels et les règles d'information déjà prévues ; éviter les marqueurs redondants ou contradictoires.
- Valider côté serveur les événements de repérage qui influencent le gameplay ou le score.

### 55.5 Reconnaissance et compensation des assistances
- Reconnaître les contributions significatives ayant facilité une élimination, même lorsque le joueur n'a pas porté le coup final.
- Répartir ou attribuer la reconnaissance selon des critères mesurables : dégâts réellement infligés, actions de soutien ou repérage utile, dans les limites déjà prévues par le score de contribution.
- Définir des fenêtres temporelles, seuils et plafonds afin d'éviter les assistances artificielles et le farming.
- Présenter distinctement éliminations, assistances et contributions de soutien dans le tableau de résultats.
- Ne pas attribuer plusieurs fois une récompense complète pour une même élimination ; conserver un barème cohérent entre les modes.

### 55.6 Rechargement tactique interruptible — critères complémentaires
- Le principe et les règles fondamentales du rechargement interruptible sont définis en section 33.4 ; cette sous-section ne crée pas un second système de rechargement.
- Compléter les tests de transition avec les cas de changement d'équipement, d'élimination et de déconnexion pendant le rechargement, en plus du tir, du sprint et du changement d'arme déjà prévus.
- Vérifier les interruptions répétées, les changements rapides d'arme, la latence et toute divergence entre l'état serveur, les munitions réellement disponibles et l'animation affichée.
- Les variantes cosmétiques d'animations prévues en section 43.4 doivent conserver les mêmes timings, fenêtres d'interruption et résultats fonctionnels pour une même arme.
- Définir un seul état de rechargement faisant autorité côté serveur ; les sections 33.4 et 55.6 doivent être implémentées et testées comme une exigence unique.

### 55.7 Sélecteur de mode de tir
- Permettre de sélectionner, pour les armes réellement compatibles, le mode de tir adapté : semi-automatique, rafale avec le nombre de coups défini par l'arme, ou automatique.
- Ne proposer que les modes plausibles pour chaque modèle d'arme ; ne pas ajouter artificiellement un mode de tir à une arme qui n'en dispose pas.
- Utiliser une commande dédiée et configurable, avec un retour HUD discret indiquant le mode actif ; éviter toute confusion avec le changement d'arme ou les commandes d'équipement.
- Chaque mode doit respecter les caractéristiques de l'arme : cadence, délai entre rafales, recul, dispersion, consommation de munitions et animation. Le sélecteur ne doit pas augmenter la cadence maximale autorisée.
- Valider le mode actif et les tirs côté serveur ; synchroniser le changement de mode et empêcher les changements impossibles, les tirs supplémentaires ou les désynchronisations en cas de latence.
- Définir le comportement à la réapparition, au ramassage d'une arme, au changement d'arme et lors d'une partie avec équipement verrouillé ; ne pas contourner les règles des modes à équipement imposé.
- Prévoir une option d'accessibilité et une indication claire pour clavier/souris et manette ; tester les erreurs de commande et les changements involontaires en combat.

### 55.8 Caisses de ravitaillement à stock limité
- Ajouter sur certaines cartes ou dans les règles de certains modes des caisses de ravitaillement permettant de récupérer une quantité limitée de munitions et, si le mode l'autorise, un équipement compatible.
- Définir un stock commun clairement borné pour chaque caisse ; chaque utilisation consomme réellement une quantité disponible et une caisse vide ne fournit rien tant qu'elle n'a pas été réapprovisionnée selon les règles prévues.
- Déterminer à l'avance si les caisses sont neutres ou réservées à une équipe ; afficher leur disponibilité et leur état de manière identique et compréhensible pour tous les joueurs concernés.
- Prévoir des quantités, délais de réapprovisionnement et conditions d'accès équilibrés ; éviter qu'une équipe contrôle indéfiniment une caisse ou qu'un joueur monopolise toutes les ressources.
- Le serveur valide les interactions, le stock, les consommations et les éventuels réapprovisionnements ; empêcher les doubles prélèvements, duplications, demandes simultanées incohérentes et abus de latence.
- Ne pas transformer les caisses en source illimitée de grenades, de capacités ou d'équipements puissants ; respecter les restrictions de chaque mode et les limites de transport du joueur.
- Leur emplacement doit être lisible et contestable, sans créer de position dominante ni rendre le ravitaillement obligatoire pour gagner ; prévoir des alternatives par l'arsenal de départ ou les ressources normales du mode.
- Commencer par un prototype avec munitions uniquement, puis n'ajouter d'autres ressources qu'après mesure de leur impact sur le rythme, l'équilibre et les performances.
- Réutiliser les systèmes d'interaction, d'inventaire, de munitions et de réplication existants ; respecter le budget de 0 € et ne pas dépendre d'un service externe payant.

### Priorités et critères communs
- Réutiliser les systèmes d'armes, d'accessoires, de dégâts, de munitions, de repérage et de score déjà prévus.
- Prototyper chaque mécanisme séparément, puis vérifier leur interaction en multijoueur avec latence et déconnexions.
- Tester les cas limites : traversée de plusieurs matériaux, armes ramassées simultanément, changement d'arme, signalement expiré, assistances multiples et résultats serveur/client divergents.
- Le rechargement tactique interruptible reste régi par les règles et animations de rechargement déjà prévues ; conserver une seule implémentation cohérente de la fenêtre d'interruption et du transfert de munitions.
- Ces ajouts restent soumis aux priorités de livraison, à la stabilité réseau et au budget de 0 €.

