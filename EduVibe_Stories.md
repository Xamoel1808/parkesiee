# Product Backlog - EduVibe

## [Cadrage] US01 - Définir le problème, la cible et la proposition de valeur
**Rôle :** Product Owner

**Fonctionnalité :** Formaliser le problème éducatif traité, les utilisateurs visés et la valeur attendue

**Raison :** ancrer le projet dans un besoin crédible et éviter de construire une application gadget

**Critères d'acceptation :**
- le problème est décrit avec causes, impacts et contexte d'usage éducatif
- la cible principale et les segments utilisateurs sont explicités
- la proposition de valeur explique qui gagne quoi et par rapport à quelle situation actuelle
- le document permet à un tiers de comprendre pourquoi le projet mérite d'exister

**Points :** 13

---

## [Cadrage] US02 - Définir les personas et leurs scénarios d'usage
**Rôle :** Équipe projet

**Fonctionnalité :** Formaliser les personas prioritaires et les scénarios concrets qui justifient le produit

**Raison :** relier les futures fonctionnalités à des besoins réalistes et défendables

**Critères d'acceptation :**
- au moins 3 personas sont décrits avec objectifs, frustrations et contexte
- chaque persona est relié à au moins 1 scénario d'usage prioritaire
- les scénarios couvrent au minimum un besoin principal et un besoin secondaire crédible
- les personas retenus sont cohérents avec le domaine de l'éducation

**Points :** 13

---

## [Produit] US03 - Cartographier les user journeys prioritaires
**Rôle :** UX Designer

**Fonctionnalité :** Modéliser les parcours utilisateurs de bout en bout

**Raison :** identifier les étapes critiques, les frictions et les points de valeur avant développement

**Critères d'acceptation :**
- au moins 2 user journeys complets sont produits pour des personas prioritaires
- chaque parcours mentionne étapes, décisions, irritants et résultat attendu
- les points de friction majeurs sont reliés à des futures stories du backlog
- le parcours principal est cohérent avec le MVP annoncé

**Points :** 8

---

## [Produit] US04 - Définir le MVP, le hors périmètre et les critères de coupe
**Rôle :** Product Owner

**Fonctionnalité :** Identifier le noyau minimal livrable et ce qui sera volontairement écarté ou reporté

**Raison :** forcer la priorisation réelle dans un cadre de temps étudiant limité

**Critères d'acceptation :**
- la liste MVP contient uniquement les éléments indispensables au parcours principal
- les éléments hors périmètre sont listés avec justification
- des critères de coupe sont définis pour décider quoi retirer en cas de retard
- le MVP reste démontrable comme un produit cohérent et non comme une maquette vide

**Points :** 21

---

## [Produit] US05 - Choisir le thème précis de l'application et justifier les choix produit
**Rôle :** Équipe projet

**Fonctionnalité :** Sélectionner le thème éducatif retenu et expliquer les décisions produit majeures

**Raison :** passer d'un cadre générique à un projet concret sans perdre la logique de valeur

**Critères d'acceptation :**
- le thème choisi appartient clairement au domaine de l'éducation
- au moins 2 thèmes alternatifs écartés sont listés avec raison de rejet
- au moins 3 décisions produit majeures sont justifiées avec impact attendu
- les choix retenus sont cohérents avec le problème, les personas et le MVP

**Points :** 8

---

## [Cadrage] US06 - Formaliser l'elevator pitch du produit
**Rôle :** Équipe projet

**Fonctionnalité :** Rédiger un pitch court et compréhensible du projet

**Raison :** être capable d'expliquer rapidement la valeur du produit à un jury ou à un utilisateur

**Critères d'acceptation :**
- le pitch tient en moins de 45 secondes à l'oral
- il mentionne cible, problème, solution et bénéfice principal
- il ne dépend pas d'un jargon technique ni d'une stack particulière
- il est cohérent avec la proposition de valeur et le MVP

**Points :** 3

---

## [UX] US07 - Concevoir la landing page de présentation
**Rôle :** Étudiant utilisateur

**Fonctionnalité :** Créer une landing page qui présente clairement le produit et son intérêt

**Raison :** rendre le projet lisible dès la première visite et démontrer une logique de mise en marché

**Critères d'acceptation :**
- la page présente le problème, la cible, la proposition de valeur et un appel à l'action
- elle contient au minimum une accroche, une section bénéfices, une section usage et une section accès ou contact
- le contenu est cohérent avec le thème éducatif choisi et avec le MVP
- la page est versionnée avec un commit atomique dédié

**Points :** 8

---

## [Cadrage] US08 - Réaliser une SWOT et un benchmark minimal
**Rôle :** Product Owner

**Fonctionnalité :** Comparer le projet à l'existant et analyser ses forces, faiblesses, opportunités et menaces

**Raison :** préparer une défense crédible des choix et éviter les idées hors sol

**Critères d'acceptation :**
- une SWOT complète est produite avec au moins 2 éléments par quadrant
- au moins 3 références comparables ou approches alternatives sont étudiées
- au moins 2 décisions de backlog ou de MVP découlent de cette analyse
- l'analyse reste spécifique au projet et ne se contente pas de banalités

**Points :** 8

---

## [UX] US09 - Concevoir les écrans clés et les règles d'interface
**Rôle :** UX Designer

**Fonctionnalité :** Produire les maquettes du parcours principal et un socle de cohérence visuelle

**Raison :** réduire les ambiguïtés avant développement et éviter une interface patchwork

**Critères d'acceptation :**
- les écrans structurants du parcours principal sont représentés avec zones, actions et informations attendues
- les états normal, vide et erreur sont prévus quand ils sont pertinents
- un mini guide UI précise composants récurrents, navigation, formulaires et feedback utilisateur
- les maquettes servent de référence aux développeurs et aux agents IA

**Points :** 13

---

## [Architecture] US10 - Définir l'architecture globale et ses responsabilités
**Rôle :** Architecte logiciel

**Fonctionnalité :** Décrire les grands blocs de l'application et leurs interactions

**Raison :** éviter un assemblage opaque et préparer une réalisation maintenable

**Critères d'acceptation :**
- un schéma d'architecture globale identifie au minimum interface, logique applicative, données et services externes éventuels
- chaque bloc a une responsabilité claire et non redondante
- les flux principaux entre blocs sont explicités
- les limites de l'architecture sont cohérentes avec un projet étudiant et avec le MVP

**Points :** 13

---

## [Architecture] US11 - Justifier les choix techniques et de stack
**Rôle :** Architecte logiciel

**Fonctionnalité :** Définir des critères de sélection technique et justifier le choix retenu

**Raison :** montrer que la technique sert le besoin et non l'inverse

**Critères d'acceptation :**
- au moins 3 critères de sélection sont définis comme maintenabilité, testabilité, rapidité d'apprentissage ou déploiement
- le choix retenu est justifié face à au moins 2 alternatives crédibles
- la justification reste valable sans imposer une stack spécifique
- les impacts sur qualité, sécurité et CI/CD sont pris en compte

**Points :** 8

---

## [Architecture] US12 - Produire le diagramme de séquence du parcours principal
**Rôle :** Architecte logiciel

**Fonctionnalité :** Modéliser les échanges techniques du cas d'usage central

**Raison :** clarifier les interactions avant implémentation et limiter les erreurs de conception

**Critères d'acceptation :**
- le diagramme montre les acteurs, composants et échanges du parcours principal
- les étapes de validation, traitement, persistance et réponse sont visibles
- au moins un cas d'erreur ou de refus est représenté
- le diagramme est cohérent avec l'architecture globale et avec l'API prévue

**Points :** 8

---

## [Architecture] US13 - Produire le modèle de domaine et la modélisation des données
**Rôle :** Architecte logiciel

**Fonctionnalité :** Décrire les entités métier, leurs relations et la structure des données

**Raison :** poser un langage commun entre produit, données et développement

**Critères d'acceptation :**
- les entités principales du domaine sont nommées et décrites avec leurs relations significatives
- les données principales sont décrites avec champs, types, contraintes et validations utiles
- le modèle couvre le MVP sans surmodélisation académique
- le modèle sert de base aux routes API et aux règles métier

**Points :** 13

---

## [Architecture] US14 - Définir les rôles, permissions et la stratégie de gestion des erreurs
**Rôle :** Administrateur

**Fonctionnalité :** Spécifier les droits applicatifs et les comportements attendus en cas d'erreur

**Raison :** éviter les accès flous et les comportements incohérents dans l'application

**Critères d'acceptation :**
- les rôles utiles au produit sont listés avec leurs actions autorisées et interdites
- les erreurs métier, techniques et de validation sont distinguées
- au moins un cas de refus d'accès et un cas d'erreur critique sont explicités
- les règles prévues couvrent l'API, l'interface et les messages utilisateur

**Points :** 8

---

## [API] US15 - Documenter le contrat des routes API
**Rôle :** Développeur

**Fonctionnalité :** Définir et documenter les routes API nécessaires au MVP

**Raison :** éviter les interfaces implicites et faciliter le travail entre front, back et IA

**Critères d'acceptation :**
- chaque route documentée précise méthode, entrée, sortie, codes de réponse et cas d'erreur
- les règles de validation des paramètres et du corps de requête sont explicites
- les routes sont cohérentes avec le modèle de données et le parcours principal
- la documentation API peut être utilisée par un tiers sans lire le code

**Points :** 13

---

## [Architecture] US16 - Tenir un journal des décisions produit et techniques
**Rôle :** Product Owner

**Fonctionnalité :** Tracer les décisions structurantes et leurs justifications

**Raison :** rendre les arbitrages défendables et éviter les choix opaques pris au fil des prompts

**Critères d'acceptation :**
- chaque décision structurante comporte date, contexte, options envisagées et choix retenu
- les décisions couvrent au minimum produit, architecture, sécurité ou déploiement
- chaque décision mentionne un compromis accepté ou une conséquence
- le journal est exploitable en soutenance pour expliquer les arbitrages

**Points :** 8

---

## [Git] US17 - Définir la stratégie Git, les branches et les règles d'intégration
**Rôle :** Développeur

**Fonctionnalité :** Structurer la collaboration via des règles Git claires

**Raison :** éviter le chaos de collaboration et industrialiser le travail étudiant

**Critères d'acceptation :**
- la stratégie précise la branche de référence, les branches de travail et les règles de fusion
- les règles de revue ou d'auto-revue sont décrites avant intégration
- aucune modification directe sur la branche principale n'est autorisée sans vérification prévue
- la stratégie Git est documentée dans le projet et référencée dans Antigravity

**Points :** 8

---

## [Git] US18 - Définir la convention de commits et le découpage atomique des changements
**Rôle :** Équipe projet

**Fonctionnalité :** Standardiser les messages de commit et imposer un commit par feature ou bugfix

**Raison :** assurer une traçabilité lisible des évolutions et faciliter la revue

**Critères d'acceptation :**
- une convention de commit documentée précise format, préfixes et exemples acceptés
- chaque ajout de fonctionnalité ou correction de bug fait l'objet d'au moins un commit dédié
- un commit ne mélange pas volontairement plusieurs sujets sans lien
- les commits associés à du code incluent les tests ou la justification de leur absence

**Points :** 5

---

## [Antigravity] US19 - Configurer Antigravity pour imposer les règles projet
**Rôle :** Équipe projet

**Fonctionnalité :** Créer une configuration Antigravity spécifique encadrant les agents IA

**Raison :** éviter que l'IA produise vite et mal en contournant la discipline de projet

**Critères d'acceptation :**
- la configuration interdit les modifications hors périmètre demandé et impose une justification avant changement structurel
- elle exige des vérifications avant validation comme tests, qualité, sécurité et mise à jour de la documentation concernée
- elle rappelle les règles Git, la granularité des commits et les exigences de sécurité
- elle impose la traçabilité des décisions importantes et des validations humaines

**Points :** 21

---

## [Antigravity] US20 - Définir les règles de travail communes des agents IA
**Rôle :** Architecte logiciel

**Fonctionnalité :** Formaliser comment les agents analysent, proposent, modifient et se limitent

**Raison :** obtenir des résultats cohérents, contrôlés et compatibles avec un projet sérieux

**Critères d'acceptation :**
- les agents doivent expliciter leurs hypothèses et signaler les points incertains
- les agents doivent annoncer les fichiers potentiellement modifiés avant action
- les agents doivent refuser les ajouts non demandés qui changent le périmètre, la sécurité ou l'architecture
- les règles couvrent génération de code, documentation, refactor, tests et validation

**Points :** 8

---

## [Antigravity] US21 - Mettre en place les garde-fous qualité et sécurité des agents
**Rôle :** Architecte logiciel

**Fonctionnalité :** Définir les contrôles obligatoires avant acceptation d'une production IA

**Raison :** réduire les erreurs cachées, le code fragile et les régressions

**Critères d'acceptation :**
- tout code proposé par un agent doit être relu ou vérifié contre des critères explicites de qualité
- les agents doivent vérifier l'absence de secrets en dur, de droits excessifs et de dépendances non justifiées
- les agents doivent signaler tout manque de test, toute dette technique créée et tout risque de régression
- les garde-fous sont alignés avec SonarQube, les tests et la stratégie Git du projet

**Points :** 13

---

## [Dev] US22 - Initialiser le socle applicatif du projet
**Rôle :** Développeur

**Fonctionnalité :** Créer une base de projet exécutable, structurée et partageable

**Raison :** fournir un point de départ propre pour le développement collaboratif

**Critères d'acceptation :**
- le projet démarre localement avec une structure de dossiers cohérente et documentée
- les conventions minimales de code, de configuration et de séparation des responsabilités sont respectées
- un premier contrôle de qualité ou test simple est exécutable
- l'initialisation est livrée dans un commit atomique dédié

**Points :** 8

---

## [Dev] US23 - Implémenter le parcours utilisateur principal
**Rôle :** Étudiant utilisateur

**Fonctionnalité :** Réaliser de bout en bout le parcours qui porte la valeur principale du produit

**Raison :** livrer un produit démontrable et non une collection d'écrans sans logique

**Critères d'acceptation :**
- un utilisateur cible peut exécuter le parcours principal jusqu'au résultat attendu sans blocage majeur
- les validations, messages et transitions de ce parcours sont implémentés
- au moins un test couvre ce parcours à un niveau pertinent
- la réalisation est découpée en commits cohérents par étape fonctionnelle

**Points :** 34

---

## [Dev] US24 - Implémenter les fonctionnalités cœur du MVP
**Rôle :** Développeur

**Fonctionnalité :** Développer les fonctionnalités centrales nécessaires au service rendu

**Raison :** apporter une valeur réelle au-delà de la simple navigation

**Critères d'acceptation :**
- chaque fonctionnalité cœur est reliée à une user story ou à un scénario prioritaire
- les règles métier minimales sont appliquées côté traitement et validation
- chaque fonctionnalité possède au moins un test ou une vérification explicite
- les fonctionnalités livrées n'introduisent pas de dépendance inutile au périmètre

**Points :** 34

---

## [Dev] US25 - Réaliser une interface web cohérente et accessible
**Rôle :** Étudiant utilisateur

**Fonctionnalité :** Construire une interface alignée avec les maquettes et le socle d'accessibilité minimale

**Raison :** rendre l'application utilisable et crédible en démonstration

**Critères d'acceptation :**
- les écrans implémentés respectent les règles visuelles et de navigation définies
- les formulaires, boutons et liens sont utilisables au clavier sur les écrans clés
- les textes, libellés et messages d'erreur sont compréhensibles pour la cible visée
- les vérifications d'accessibilité réalisées sont documentées avec leurs limites

**Points :** 13

---

## [Dev] US26 - Gérer les états vides, erreurs et cas limites
**Rôle :** Développeur

**Fonctionnalité :** Prévoir les comportements de l'application hors chemin idéal

**Raison :** éviter qu'un produit apparemment fonctionnel casse dès qu'on sort du scénario parfait

**Critères d'acceptation :**
- les écrans critiques disposent d'un état vide compréhensible et exploitable
- les erreurs de validation sont distinguées des erreurs techniques et affichées clairement
- au moins 5 cas limites métier ou techniques sont identifiés et traités ou explicitement exclus du MVP
- au moins un test ou scénario vérifie ces comportements

**Points :** 13

---

## [Données] US27 - Préparer les données de démonstration et de test
**Rôle :** Équipe projet

**Fonctionnalité :** Créer un jeu de données crédible pour illustrer et vérifier le produit

**Raison :** permettre une soutenance fluide et tester des cas réalistes sans données sensibles

**Critères d'acceptation :**
- les données couvrent au moins un usage nominal, un état vide et un cas d'erreur
- elles sont cohérentes avec le domaine éducatif choisi
- la procédure de chargement ou d'initialisation est documentée
- le jeu de données peut être réutilisé dans les tests ou la démonstration

**Points :** 5

---

## [Qualité] US28 - Définir les règles de qualité de code et de commentaires utiles
**Rôle :** Développeur

**Fonctionnalité :** Établir un socle de lisibilité, de maintenabilité et de documentation pertinente du code

**Raison :** limiter la dette technique générée par le vibe coding

**Critères d'acceptation :**
- les règles portent au minimum sur lisibilité, duplication, complexité et séparation des responsabilités
- les commentaires décoratifs ou mensongers sont interdits
- les zones complexes ou non intuitives du projet sont identifiées et commentées utilement
- tout nouveau code doit respecter ces règles ou documenter une exception

**Points :** 8

---

## [Qualité] US29 - Mettre en place les tests unitaires prioritaires
**Rôle :** Développeur

**Fonctionnalité :** Tester les règles de traitement et de validation critiques

**Raison :** réduire les régressions sur le cœur fonctionnel

**Critères d'acceptation :**
- les composants ou fonctions critiques du parcours principal sont couverts
- les tests vérifient au moins des cas nominaux et des cas d'erreur
- les tests sont exécutables automatiquement dans la pipeline
- tout ajout de règle métier critique s'accompagne d'un test ou d'une justification documentée

**Points :** 13

---

## [Qualité] US30 - Mettre en place les tests d'intégration ou de parcours
**Rôle :** Développeur

**Fonctionnalité :** Vérifier les interactions entre couches, écrans et données sur les scénarios critiques

**Raison :** sécuriser le produit au-delà du test isolé

**Critères d'acceptation :**
- au moins un test couvre une interaction complète entre interface, logique et données ou leurs équivalents
- les tests vérifient les cas attendus et au moins un échec représentatif
- les scénarios choisis correspondent au parcours principal ou à un risque critique
- les résultats de ces tests sont intégrés à la CI

**Points :** 13

---

## [CI/CD] US31 - Mettre en place le pipeline CI/CD GitHub
**Rôle :** Développeur

**Fonctionnalité :** Créer une pipeline GitHub exécutée automatiquement sur le projet

**Raison :** industrialiser les vérifications et empêcher la validation d'un code cassé

**Critères d'acceptation :**
- la pipeline s'exécute automatiquement à chaque push ou pull request
- elle lance au minimum les tests, les vérifications de qualité et les contrôles définis par le projet
- un échec bloque la validation tant que le problème n'est pas corrigé
- la documentation projet explique clairement ce que vérifie la pipeline

**Points :** 21

---

## [Qualité] US32 - Intégrer SonarQube dans les vérifications du projet
**Rôle :** Développeur

**Fonctionnalité :** Mesurer la qualité statique du code avec SonarQube

**Raison :** rendre visibles les défauts de qualité et ancrer une logique standard entreprise

**Critères d'acceptation :**
- l'analyse SonarQube s'exécute sur le projet et remonte des résultats exploitables
- les alertes critiques ou bloquantes sont traitées ou justifiées
- un seuil ou une règle de qualité minimale est défini pour le projet
- les résultats SonarQube sont intégrés à la pipeline ou au processus de validation

**Points :** 13

---

## [Sécurité] US33 - Réaliser l'analyse sécurité du code et des accès
**Rôle :** Architecte logiciel

**Fonctionnalité :** Identifier les risques de sécurité liés au code, aux rôles et à la configuration

**Raison :** montrer qu'un produit même étudiant doit traiter un minimum de sécurité

**Critères d'acceptation :**
- les principaux risques applicatifs sont listés comme gestion des entrées, autorisations, secrets ou exposition d'erreurs
- les zones sensibles du code ou de la configuration sont revues
- au moins 3 mesures de réduction de risque sont appliquées ou justifiées
- l'analyse distingue clairement ce qui est traité dans le MVP et ce qui reste une limite connue

**Points :** 13

---

## [Sécurité] US34 - Contrôler les dépendances et produire une SBOM
**Rôle :** Développeur

**Fonctionnalité :** Inventorier les composants tiers, vérifier leur pertinence et générer une nomenclature logicielle

**Raison :** limiter les ajouts hasardeux et introduire une traçabilité standard entreprise

**Critères d'acceptation :**
- les dépendances réellement utilisées sont listées avec leur utilité
- les dépendances inutiles ou redondantes sont supprimées
- une SBOM est produite dans un format exploitable et sa procédure de génération est documentée
- les risques de version obsolète ou de vulnérabilité sont vérifiés par un outil ou une procédure documentée

**Points :** 13

---

## [DevOps] US35 - Conteneuriser l'application avec Docker
**Rôle :** Développeur

**Fonctionnalité :** Créer un conteneur exécutable de l'application

**Raison :** faciliter l'exécution homogène du produit et préparer la livraison

**Critères d'acceptation :**
- un fichier Docker permet de construire une image exécutable du projet
- l'image produite démarre l'application avec une configuration documentée
- les choix du conteneur évitent les éléments inutiles ou dangereux évidents
- la construction de l'image est vérifiée localement ou dans la pipeline

**Points :** 13

---

## [DevOps] US36 - Orchestrer l'environnement avec Docker Compose
**Rôle :** Développeur

**Fonctionnalité :** Décrire l'exécution locale du projet et de ses services utiles avec Docker Compose

**Raison :** simplifier l'installation et la démonstration du produit

**Critères d'acceptation :**
- un fichier Docker Compose permet de lancer l'application et les services nécessaires au MVP
- les variables de configuration attendues sont explicitées
- la commande de démarrage et la commande d'arrêt sont documentées
- le Compose reste compatible avec un usage étudiant simple et démontrable

**Points :** 8

---

## [Documentation] US37 - Rédiger la documentation d'installation, d'exploitation et du projet
**Rôle :** Équipe projet

**Fonctionnalité :** Centraliser la documentation utile pour exécuter, comprendre et maintenir le produit

**Raison :** éviter que la connaissance soit dispersée entre prompts, commits et mémoire d'équipe

**Critères d'acceptation :**
- la documentation précise prérequis, variables, commandes et étapes de lancement local ou conteneurisé
- elle décrit aussi l'exploitation minimale comme démarrage, arrêt, configuration, journaux et limites connues
- elle centralise vision, périmètre, architecture, API, tests, sécurité et livraison
- un nouveau membre ou un jury peut comprendre et lancer le projet à partir de cette documentation

**Points :** 21

---

## [Livraison] US38 - Préparer une version démontrable et stable du produit
**Rôle :** Équipe projet

**Fonctionnalité :** Constituer une version de démonstration cohérente pour jury ou encadrant

**Raison :** éviter la démo bricolée qui casse au premier clic

**Critères d'acceptation :**
- une version identifiée du projet est figée pour la démonstration
- le script de démonstration mentionne l'ordre des actions, les comptes ou données utiles et les points à montrer
- les fonctionnalités non prêtes sont masquées, neutralisées ou explicitement signalées
- la version de démo a passé les vérifications minimales prévues par le projet

**Points :** 8

---

## [Soutenance] US39 - Justifier les arbitrages, compromis et priorités du backlog
**Rôle :** Product Owner

**Fonctionnalité :** Préparer une explication structurée des choix, renoncements et ordres de priorité

**Raison :** prouver que le backlog n'est pas une liste arbitraire mais un outil de pilotage

**Critères d'acceptation :**
- au moins 5 arbitrages majeurs sont expliqués avec bénéfice attendu et coût associé
- les compromis entre délai, qualité, sécurité, périmètre et ergonomie sont explicités
- les stories prioritaires sont reliées au problème, aux personas et au MVP
- les stories repoussées ou non réalisées sont expliquées par des critères clairs comme valeur, risque ou coût

**Points :** 13

---

## [Soutenance] US40 - Préparer les preuves de crédibilité professionnalisante
**Rôle :** Jury

**Fonctionnalité :** Assembler les éléments montrant que le projet suit une démarche proche de l'entreprise

**Raison :** valoriser autant la méthode que le résultat et montrer qu'un vrai produit ne se résume pas à générer du code

**Critères d'acceptation :**
- les preuves couvrent produit, architecture, qualité, sécurité, Git, CI/CD, DevOps et gouvernance IA
- chaque preuve renvoie à un livrable réel comme diagramme, pipeline, journal de décision, tests ou documentation
- les limites du projet étudiant sont reconnues sans masquer les écarts avec un vrai produit industriel
- l'ensemble permet une soutenance crédible de niveau professionnalisant

**Points :** 13

---

