## 16. Jeu multiplateforme et parité de gameplay

### Objectif du propriétaire
RIXE doit être accessible depuis un navigateur web et sous forme installable (au minimum Windows), avec possibilité d'étendre ensuite à d'autres plateformes. Tous les joueurs doivent retrouver les mêmes règles, armes, cartes, déplacements, capacités, objectifs, progression et conditions de victoire. Une différence de rendu est acceptable ; une différence de gameplay ou un avantage compétitif lié à la plateforme ne l'est pas.

### Distinguer les voies techniques
1. **Client Unreal natif** : priorité de référence pour Windows, puis étude de macOS/Linux et des plateformes mobiles/consoles selon faisabilité, matériel, exigences de publication et coûts. C'est la voie qui conserve directement le rendu Unreal local ; les niveaux de qualité peuvent varier selon le matériel.
2. **Navigateur avec Pixel Streaming** : exécuter une build Unreal sur une machine distante équipée d'un GPU, puis transmettre image et son au navigateur via WebRTC et renvoyer les commandes du joueur. Cette voie conserve réellement le rendu Unreal dans le navigateur, mais elle exige une infrastructure GPU, de la bande passante et une faible latence. Elle n'est pas considérée comme gratuite ou scalable par défaut et ne doit pas être déployée à grande échelle tant que le financement et les tests réseau ne le permettent pas.
3. **Client web natif allégé** : si le streaming Unreal est trop coûteux ou trop lent, développer un client navigateur distinct avec rendu WebGL/WebGPU et interface adaptée. Il doit utiliser les mêmes règles de jeu, données, armes, cartes fonctionnelles, timings, validations serveur et protocole réseau que les clients Unreal. Les différences visuelles doivent rester cosmétiques et ne jamais masquer des informations utiles ou modifier les hitboxes, collisions, visibilité compétitive ou sensations de contrôle.

Ne pas présenter un client WebGL/WebGPU comme un jeu rendu par Unreal Engine : ce serait un rendu distinct. Ne pas supposer qu'un export HTML5/WebAssembly Unreal est une cible officielle prête à l'emploi pour UE 5.8. Le Pixel Streaming est la piste documentée pour afficher une application Unreal dans un navigateur.

### Architecture exigée pour préserver l'équité
- Séparer autant que possible règles de gameplay et autorité serveur du rendu et de l'interface propres à chaque plateforme.
- Le serveur décide des dégâts, tirs, collisions pertinentes, déplacements autorisés, capacités, apparitions, score, événements de carte et résultats ; les clients ne font que présenter et prédire visuellement dans les limites validées.
- Définir une spécification commune et versionnée des règles, des armes, des cartes, des timings, des données de match et du protocole réseau.
- Prévoir cross-play et salons communs entre plateformes compatibles, avec contrôles de latence, input, aide à la visée et équilibre clavier/souris/manette/tactile. Ne jamais donner un avantage artificiel à une plateforme.
- Garder une base de contenu et de règles commune. Les niveaux de détail, textures, éclairage, effets, résolution et fréquence d'images peuvent être adaptés au matériel, sans modifier la simulation compétitive.
- Tester séparément latence, stabilité, fréquence d'images, précision des commandes, lisibilité, accessibilité et performances sur navigateur et clients installés.
- Le navigateur doit rester utilisable sans installation lourde ; prévoir une page d'accueil légère, contrôles compatibles et avertissements clairs si l'appareil ou la connexion ne permet pas une expérience correcte.

### Déploiement progressif et contrainte zéro euro
- Ne pas tenter de développer simultanément toutes les plateformes avant d'avoir une version Windows stable et une architecture réseau/serveur fiable.
- Étape 1 : stabiliser et empaqueter le client Unreal Windows.
- Étape 2 : valider un prototype Pixel Streaming sur réseau local ou infrastructure temporaire gratuite disponible, sans promettre une capacité publique permanente.
- Étape 3 : comparer objectivement Pixel Streaming et client web allégé sur latence, qualité, coût par joueur, compatibilité et charge de développement ; faire un prototype navigateur seulement après ce comparatif.
- Étape 4 : étendre aux autres plateformes natives selon les résultats et les moyens disponibles.
- Aucun serveur GPU, hébergement cloud, abonnement ou service payant sans accord explicite : budget actuel 0 €.

Références techniques Epic à vérifier pour la version du moteur utilisée :
- Pixel Streaming UE 5.8 : https://dev.epicgames.com/documentation/unreal-engine/overview-of-pixel-streaming-in-unreal-engine
- Infrastructure Pixel Streaming : https://dev.epicgames.com/documentation/unreal-engine/pixel-streaming-infrastructure
- Plateformes et packaging UE 5.8 : https://dev.epicgames.com/documentation/en-us/unreal-engine/packaging-your-project

