# 🎯 Définition du Produit (MVP) et Critères de Coupe (US04)

L'objectif de ce document est de figer informatiquement et fonctionnellement le périmètre du projet "Park ESIEE" dans le cadre d'un calendrier de livraison étudiant limité. Il sépare clairement l'indispensable du superflu pour garantir la livraison d'un produit démontrable et ayant de la valeur.

---

## 🚀 1. Périmètre du MVP (Noyau Minimal Livrable)

Cette liste contient **strictement** les fonctionnalités requises pour qu'un étudiant puisse se rendre à l'école et y stationner sans dysfonctionnement majeur de gouvernance.

- **Utilisateurs & Profils**
  - Inscription et authentification locale (Email / Mot de passe).
  - Distinction en base de données de 3 rôles : `STUDENT`, `ADMIN` et la notion de `PMR` (personne à mobilité réduite).
  - Gestion des véhicules (chaque étudiant peut enregistrer une ou plusieurs plaques d'immatriculation).

- **Gestion des Places de Parking**
  - Structure statique des places (Un ensemble généré de places "Standard" et de places "PMR").
  - Capacité pour l'Admin ou l'Agent de voir et manipuler le parc total.

- **Réservations (Le cœur de valeur)**
  - Sélection d'une date (jour J ou futur proche) et réservation d'une place associée.
  - Interdiction de réserver si les places disponibles de la catégorie visée sont à 0.
  - Libération/Annulation de la réservation par l'utilisateur.

- **Protection anti-abus (Sanction & Rappel)**
  - Dispositif primitif de "No-Show" : possibilité de bloquer ou sanctionner avec un délai de carence (`penaltyUntil`) un étudiant n'étant pas venu utiliser sa réservation sans annuler.
  - Génération d'un export calendrier natif `.ICS` pour que l'étudiant ait une trace dans son agenda personnel.

*(Nota : Ce périmètre est autosuffisant pour répondre au problème "Je ne sais pas si j'aurai une place en arrivant et je risque le retard" lors d'une soutenance).*

---

## 🚫 2. Hors Périmètre (Ce qui ne sera pas livré)

Pour maintenir notre calendrier de livraison, les idées suivantes sont volontairement écartées de cette version (V1).

| Fonctionnalité Écartée | Justification au vu du temps imparti |
| --- | --- |
| **Authentification via SSO ESIEE (Microsoft Azure AD)** | L'intégration OAuth2 demande une lourdeur administrative (création d'app Azure par les DSI) trop chronophage pour ce format étudiant. |
| **Module d'upload de PDF / OCR (Justificatif PMR)** | Le stockage de fichiers distants sécurisé (RGPD santé) sort du cadre principal. Un administrateur cliquera manuellement sur un flag `isPmr` côté Dashboard pour l'instant. |
| **Notifications Actives (Email automatisé, Push, SMS)** | Nécessite des passerelles externes payantes (SendGrid, Twilio) et de la mécanique asynchrone complexe. |
| **File d'attente (Waiting List intelligente)** | La mécanique d'attribution automatique en cascade lors du désistement d'un tiers est techniquement instable si non-maîtrisée. |
| **Reconnaissance optique de plaques (LAPI via Caméra)** | Pas de matériel physique. L'aspect "passage barrière" sera uniquement simulé fonctionnellement par le système. |

---

## ✂️ 3. Critères de Coupe (En cas de retard)

Si le projet accumule du retard dans le développement de l'UI Front-end ou dans le debugging de l'API, les décisions de coupe ("Descoping") seront appliquées dans l'ordre de priorité suivant :

1. **Couper l'interface "Agent/Admin" (Front-end) :** 
   *Critère :* S'il reste - de 15% du temps total.
   *Remplaçant :* Les validations PMR ou la gestion des places en erreur seront effectuées directement via l'outil **Prisma Studio** (Interface Base de Données) en direct lors de la soutenance.
   
2. **Couper la fonction d'Export .ICS (Agenda) :** 
   *Critère :* Si les formats MIME d'export bloquent ou complexifient le déploiement.
   *Remplaçant :* L'application web affichera le ticket récapitulatif statique suffisant pour se rappeler la date.

3. **Couper l'interface de "Dashboard de Pénalité" :**
   *Critère :* Si la logique front-end des "bans" est complexe.
   *Remplaçant :* L'étudiant qui se voit infliger un "No-show" par l'admin via la BDD verra juste un message "Accès révoqué temporairement" sur la page de réservation s'il a le flag `penaltyUntil` rempli, pas besoin d'une page complète.

**Conclusion :** Même avec le maximum de coupes réalisées, l'étudiant pourra toujours réserver une place valide et empêcher la place d'être prise, préservant ainsi l'illusion parfaite (et le cycle de démonstration) du service principal.
