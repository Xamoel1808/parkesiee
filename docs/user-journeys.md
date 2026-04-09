# 🗺 Cartographie des User Journeys Prioritaires (US03)

Ce document décrit les parcours utilisateurs de bout en bout pour le système de gestion de parking ESIEE-IT, en se concentrant sur les personas prioritaires et en identifiant les points de friction à traiter ultérieurement.

## 👤 Persona 1 : Léo, Étudiant Standard

**Contexte** : Léo habite loin du campus et utilise sa voiture tous les jours. Il a peur de ne pas trouver de place et d'arriver en retard en cours s'il doit chercher une place dans les rues adjacentes.
**Objectif Principal** : S'assurer d'avoir une place réservée lors de sa prochaine journée de cours et être sûr d'avoir accès au parking.

### User Journey 1 : Réserver une place standard et anticiper une absence

| Étape | Actions & Décisions de l'utilisateur | Irritants & Frictions | Résultat Attendu |
| --- | --- | --- | --- |
| **1. Connexion** | Léo se connecte sur la plateforme `parkesiee` avec son email étudiant. | Mémoriser un mot de passe spécifique (Pas de SSO ESIEE). | Accès au tableau de bord. |
| **2. Enregistrement (1ère fois)** | Léo enregistre la plaque d'immatriculation de sa nouvelle voiture. | Erreur de frappe possible sur la plaque. | Véhicule enregistré dans son profil. |
| **3. Recherche** | Il sélectionne la date de demain pour voir s'il reste des places "Standard". | Parfois le parking est affiché complet à 8h du matin. | Disponibilité confirmée. |
| **4. Réservation** | Il valide la réservation et ajoute l'événement à son calendrier via l'export ICS. | L'export ICS nécessite une action manuelle. | Réservation "CONFIRMED" / Confirmée. |
| **5. Imprévu** | Léo est malade le lendemain. Il se connecte pour annuler sa place avant 8h. | **Friction Majeure** : Il risque d'oublier d'annuler et de subir une pénalité "No-Show" s'il ne vient pas. | La place est libérée pour un autre étudiant. |

**🔗 Liens vers les futures stories du backlog (hors MVP) :**
- *Friction Etape 1* ➡️ **US-BACKLOG-01** : Intégration du SSO Microsoft ESIEE pour connexion sans mot de passe.
- *Friction Etape 3* ➡️ **US-BACKLOG-02** : Système de file d'attente automatisée si le parking est plein.
- *Friction Etape 5* ➡️ **US-BACKLOG-03** : Envoi de notifications Push/SMS de rappel pour annuler la réservation afin d'éviter les pénalités `penaltyUntil`.

---

## 👤 Persona 2 : Sarah, Étudiante bénéficiant de place PMR

**Contexte** : Sarah est en situation de handicap et possède une attestation PMR. Elle a impérativement besoin d'une place adaptée à proximité de l'entrée du bâtiment. Par le passé, ses places étaient souvent occupées abusivement.
**Objectif Principal** : Faire valider son statut de façon permanente dans le système et réserver en priorité des places PMR de manière garantie.

### User Journey 2 : Validation du statut et réservation PMR garantie

| Étape | Actions & Décisions de l'utilisateur | Irritants & Frictions | Résultat Attendu |
| --- | --- | --- | --- |
| **1. Inscription** | Sarah crée son compte et coche "Demande d'accès PMR". | Doit attendre une validation humaine (Agent) sans visibilité sur le délai. | Le profil est créé avec le flag bdd `pmrRequested = true`. |
| **2. Validation** | L'Administration (ex: l'Agent) relève la demande côté base de données, vérifie le dossier de scolarité externe, et valide l'accès. | **Friction Majeure** : Rupture de flux. Sarah doit patienter potentiellement plusieurs jours avant de pouvoir réserver une place PMR. | Le profil est mis à jour : `isPmr = true`. |
| **3. Réservation** | Sarah se connecte et réserve une place spécifiquement réservée aux profils PMR en choisissant sa date. | Crainte que la place puisse être occupée sur site (stationnement sauvage non lié à l'application). | Réservation d'une place typée "PMR" confirmée. |
| **4. Entrée sur site** | Sarah arrive à la barrière, l'application aura permis au garde d'avoir une indication sur sa réservation valide. | - | Sarah se gare sur sa place PMR près de la porte. |

**🔗 Liens vers les futures stories du backlog (hors MVP) :**
- *Friction Etape 2* ➡️ **US-BACKLOG-04** : Formulaire d'upload de justificatifs (PDF/Image) directement dans le dashboard de l'app pour accélérer la revue de statut.
- *Friction Etape 3* ➡️ **US-BACKLOG-05** : Interface mobile de signalement collaboratif en temps réel si une place PMR est occupée par un non ayant-droit.

---

### Vérification de cohérence avec le MVP
Ces trajets illustrent parfaitement les limites imposées par le MVP actuel en base de données :
* Les rôles et drapeaux `STUDENT` vs PMR existent bien dans le modèle (`isPmr`, `pmrRequested`, `penaltyUntil`).
* L'export `ICS` a été priorisé pour faciliter la mémorisation et est inclus.
* Le système contraignant de libération via la pénalité (No-show et `penaltyUntil`) existe déjà, ce qui justifie les actions et impératifs de Léo dans le parcours 1.
* Les points de friction majeurs listés ci-dessus (Notifications actives, attente, gestion des fichiers) sont hors du MVP volontairement pour permettre de livrer rapidement le système cœur transactionnel et de réservation de places au format CRUD en priorité.
