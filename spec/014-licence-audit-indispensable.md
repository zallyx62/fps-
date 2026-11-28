## 14. Licence — audit indispensable

### Objectif approuvé
RIXE doit rester publiquement consultable, étudiable, modifiable et partageable pour des usages non commerciaux, sans donner aux tiers le droit de revendre le jeu ou d'en tirer un avantage commercial sans autorisation écrite du titulaire des droits. La décision du propriétaire du 28 novembre 2026 retient **PolyForm Noncommercial License 1.0.0** pour les seules créations originales RIXE dont les droits sont détenus ou contrôlés par le propriétaire.

Ce modèle est **source disponible**, et non open source au sens de l'OSI : une licence qui interdit les usages commerciaux ne respecte pas la définition OSI de l'open source. Ne pas présenter RIXE comme « open source » sans cette réserve.

### Périmètre et séparation
- Le périmètre exact est défini par `THIRD_PARTY_NOTICES.md` : contenu original `Content/Rixe/**` sous réserve de provenance, outils RIXE, prototype web, documentation racine et `spec/**`.
- Ne jamais étendre PolyForm à Unreal Engine, aux Examples/Starter Content Epic, au contenu Fab/Learn/Quixel, aux plugins ou à toute ressource tierce.
- Le fait qu'un fichier soit rangé sous `Content/Rixe` ne prouve pas à lui seul que ses droits appartiennent au propriétaire ; les ressources non vérifiées restent exclues.
- Les utilisateurs disposent de droits non commerciaux selon PolyForm. Les usages commerciaux exigent une licence écrite distincte du titulaire des droits. Le titulaire peut exploiter commercialement les seuls droits qu'il possède ou contrôle ; la licence ne lui transfère pas automatiquement les droits des contributeurs.

### Compatibilité Unreal / Epic
- L'EULA Unreal (§6(c)) interdit les licences qui imposeraient directement ou indirectement que la technologie Epic soit gouvernée par des conditions différentes. Cette clause cite GPL, LGPL (sauf liaison dynamique d'une bibliothèque partagée) et CC BY-SA comme exemples ; elle ne cite pas PolyForm Noncommercial.
- L'absence de PolyForm dans cette liste n'est **pas** une validation ou autorisation expresse d'Epic. La séparation des périmètres vise à maintenir la technologie Epic sous les conditions Epic et les créations originales RIXE sous PolyForm. La compatibilité de l'ensemble concret doit encore être confirmée par Epic par écrit ou par une revue juridique qualifiée.
- L'EULA définit les « Examples » comme les ressources des dossiers Samples et Templates de l'installation. Sa section 5(b) permet de redistribuer ces Examples, y compris modifiés, en source ou en objet à des tiers. Cette exception s'applique seulement aux fichiers dont la provenance et le statut d'Example sont vérifiés pour la version d'Unreal utilisée.
- Les contenus Fab/Marketplace/Learn/Quixel ont des régimes distincts. L'accord Marketplace d'Epic définit notamment comme « Prohibited License » une licence limitée à des usages non commerciaux et interdit les contenus soumis à cette catégorie dans les éléments présentés au Marketplace. Ne pas soumettre du contenu PolyForm à Fab sans autorisation écrite d'Epic et examen juridique.
- Pour les builds distribuées, respecter le format objet et les conditions de l'EULA/Content License Agreement, l'accord utilisateur final, les notices et les crédits applicables.

### Contrôles obligatoires avant distribution
1. Inventorier auteur, source, version, titulaire des droits et licence de chaque ressource originale, Epic, Fab, plugin, bibliothèque, police, son, texture, animation, carte et outil.
2. Prouver la provenance des fichiers du modèle First Person / Arena Shooter et des dossiers `__ExternalActors__` / `__ExternalObjects__`; vérifier qu'ils relèvent bien de la permission §5(b) des Examples.
3. Vérifier séparément les droits sur les assets originaux de `Content/Rixe` et les contributions externes.
4. Contrôler les plugins de `fps.uproject`, leurs modules Editor/Runtime et leurs conditions d'inclusion dans un package.
5. Examiner l'artefact exact de build : aucun Engine Code ou contenu Epic ne doit être redistribué en source hors permission expresse ; conserver les avis et utiliser un EULA utilisateur final conforme.
6. Obtenir une confirmation écrite d'Epic ou une revue juridique qualifiée sur la séparation des licences et l'application de §6(c).
7. Refaire le contrôle des conditions Epic au moment de toute release.

### Gouvernance des contributions
Ne pas traiter une PR comme une cession de droits. Aucune contribution externe ne doit être incluse dans une release commerciale avant la signature d'un accord séparé, examiné juridiquement, qui donne au propriétaire les droits commerciaux nécessaires et délimite précisément les droits, territoires, supports et durées concernés. Vérifier aussi les apports déjà intégrés. En France, les transmissions de droits d'auteur sont soumises à des exigences écrites et de précision (Code de la propriété intellectuelle, articles L131-2 et L131-3).

### État
L'utilisation privée et le développement peuvent se poursuivre dans les limites des licences applicables. Le dépôt source public ne constitue pas une preuve de conformité de l'ensemble des actifs ni une autorisation de distribuer une build. Ne pas annoncer une release juridiquement validée avant la clôture des contrôles ci-dessus.
