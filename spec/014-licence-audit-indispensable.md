## 14. Licence — audit indispensable

### Objectif approuvé
RIXE doit rester publiquement consultable, étudiable, modifiable et partageable pour des usages non commerciaux, sans donner aux tiers le droit de revendre le jeu ou d'en tirer un avantage commercial sans autorisation écrite du titulaire des droits. La décision du propriétaire retient deux licences selon la nature de l'œuvre : **PolyForm Noncommercial 1.0.0 pour le logiciel/code source**, et **CC BY-NC 4.0 pour les créations artistiques et la documentation originales**, dans les périmètres définis par `THIRD_PARTY_NOTICES.md`.

Ce modèle est **source disponible**, et non open source au sens de l'OSI : ces licences limitent les usages commerciaux. La définition OSI interdit les restrictions de domaine d'activité, y compris commerciales. Ne pas présenter RIXE comme « open source » sans cette réserve.

### Périmètres et séparation
- PolyForm s'applique uniquement au code, outils, Blueprints et autres fichiers logiciels originaux identifiés dans `THIRD_PARTY_NOTICES.md`.
- CC BY-NC 4.0 s'applique uniquement aux œuvres artistiques et écrites originales clairement identifiées : modèles, meshes, textures, matériaux visuels, skins, sons, musiques, animations, illustrations, UI textures et documentation.
- Le texte officiel PolyForm parle du « software ». Creative Commons recommande des licences logicielles pour le code, mais indique que CC peut être utilisé pour les œuvres artistiques séparées comme les graphismes et musiques de jeux et pour la documentation. Cette séparation évite de traiter automatiquement un modèle 3D ou une texture comme du code.
- Un chemin de dossier n'est pas une preuve de propriété ou d'origine. Les fichiers de carte, données mixtes, assets externes, contributions non vérifiées et tout fichier non classé restent exclus des licences RIXE jusqu'à examen.
- Les deux licences permettent la redistribution et les adaptations non commerciales dans leurs périmètres ; elles n'accordent aucun droit commercial aux utilisateurs. Le titulaire peut accorder séparément une licence commerciale écrite sur les droits qu'il possède ou contrôle.

### Compatibilité Unreal / Epic
- L'EULA Unreal (§6(c)) interdit les licences qui imposeraient directement ou indirectement que la technologie Epic soit gouvernée par des conditions différentes. Cette clause cite GPL, LGPL (sauf liaison dynamique d'une bibliothèque partagée) et CC BY-SA comme exemples ; elle ne cite ni PolyForm Noncommercial ni CC BY-NC 4.0.
- L'absence de ces deux licences dans la liste n'est **pas** une validation ou autorisation expresse d'Epic. La séparation des périmètres vise à maintenir la technologie Epic sous les conditions Epic, le code RIXE sous PolyForm et les œuvres artistiques/documentaires RIXE sous CC BY-NC. La compatibilité de l'ensemble concret doit encore être confirmée par Epic par écrit ou par une revue juridique qualifiée.
- L'EULA définit les « Examples » comme les ressources des dossiers Samples et Templates de l'installation. Sa section 5(b) permet de redistribuer ces Examples, y compris modifiés, en source ou en objet à des tiers. Cette exception s'applique seulement aux fichiers dont la provenance et le statut d'Example sont vérifiés pour la version d'Unreal utilisée.
- Les contenus Fab/Marketplace/Learn/Quixel ont des régimes distincts. L'accord Marketplace d'Epic définit notamment comme « Prohibited License » une licence limitée à des usages non commerciaux et interdit les contenus soumis à cette catégorie dans les éléments présentés au Marketplace. Ne pas soumettre de contenu PolyForm ou CC BY-NC à Fab sans autorisation écrite d'Epic et examen juridique.
- Pour les builds distribuées, respecter le format objet et les conditions de l'EULA/Content License Agreement, l'accord utilisateur final, les notices et les crédits applicables.

### Contrôles obligatoires avant distribution
1. Inventorier auteur, source, version, titulaire des droits et licence de chaque ressource logicielle, artistique, Epic, Fab, plugin, bibliothèque, police, son, texture, animation, carte et outil.
2. Prouver la provenance des fichiers du modèle First Person / Arena Shooter et des dossiers `__ExternalActors__` / `__ExternalObjects__`; vérifier qu'ils relèvent bien de la permission §5(b) des Examples.
3. Vérifier séparément les droits sur les fichiers logiciels sous PolyForm et les œuvres artistiques/documentaires sous CC BY-NC, avec les attributions requises.
4. Contrôler les plugins de `fps.uproject`, leurs modules Editor/Runtime et leurs conditions d'inclusion dans un package.
5. Examiner l'artefact exact de build : aucun Engine Code ou contenu Epic ne doit être redistribué en source hors permission expresse ; conserver les avis et utiliser un EULA utilisateur final conforme.
6. Obtenir une confirmation écrite d'Epic ou une revue juridique qualifiée sur la séparation des licences et l'application de §6(c).
7. Faire préparer/revoir un accord de contribution conforme au droit applicable ; auditer les contributions déjà intégrées.
8. Refaire le contrôle des conditions Epic au moment de toute release.

### Gouvernance des contributions
Ne pas traiter une PR comme une cession de droits. Aucune contribution externe ne doit être incluse dans une release commerciale avant la signature d'un accord séparé, examiné juridiquement, qui donne au propriétaire les droits commerciaux nécessaires et délimite précisément les droits, territoires, supports et durées concernés. Vérifier aussi les apports déjà intégrés. En France, les transmissions de droits d'auteur sont soumises à des exigences écrites et de précision (Code de la propriété intellectuelle, articles L131-2 et L131-3).

### État
L'utilisation privée et le développement peuvent se poursuivre dans les limites des licences applicables. Le dépôt source public ne constitue pas une preuve de conformité de l'ensemble des actifs ni une autorisation de distribuer une build. Ne pas annoncer une release juridiquement validée avant la clôture des contrôles ci-dessus.
