# 🛡️ Architecture : Rôles, Permissions & Stratégie d'Erreurs (US14)

Ce document définit les habilitations des différents profils utilisateurs dans l'application **Park ESIEE**, ainsi que la politique globale de gestion et d'affichage des erreurs.

---

## 👥 1. Matrice des Rôles et Permissions

Le système s'articule autour de 3 rôles explicites inscrits en base de données, complétés par un indicateur de profil spécifique (`isPmr`).

### Rôle : `STUDENT` (Étudiant)
- **Autorisé (Actions nominales) :**
  - Créer un compte et se connecter au portail public.
  - Ajouter, modifier ou supprimer **ses propres** plaques d'immatriculation.
  - Consulter l'inventaire des places du jour ou d'une date future proche.
  - Clicquer pour réserver une place Standard.
  - Annuler **sa propre** réservation pour libérer la place en cas d'imprévu.
- **Interdit :**
  - Réserver des places d'un autre type (par exemple, type "PMR" si l'étudiant ne possède pas le flag de santé `isPmr = true`).
  - Voir la liste des autres étudiants ou modifier les réservations qui ne lui appartiennent pas.
  - Accéder aux routes API `/api/admin` ou aux vues UI d'administration.

### Rôle : `AGENT` (Gardien / Surveillant d'entrée)
- **Autorisé :**
  - Consulter la liste complète des réservations actives (et plaques) pour le jour J.
  - Scrutateur visuel : Marquer dans le système la présence ou l'absence d'un véhicule.
  - Déclencher le bouton de rapport "No-show" pour activer manuellement la pénalité à un étudiant ne s'étant pas présenté.
- **Interdit :**
  - Créer l'inventaire physique des places ("ajouter un nouveau bâtiment").
  - Modérer en profondeur les permissions `isPmr` au niveau administratif.

### Rôle : `ADMIN` (Administration / Manager de l'ESIEE)
- **Autorisé :**
  - **Hérite de toutes les permissions de l'AGENT.**
  - Gérer la géométrie du parking (Créer ou supprimer logiquement des places associées à un ID unique).
  - Statuer sur le flag `pmrRequested = true` d'un compte validé en un accès définitif `isPmr = true`.
  - Contrôler et révoquer manuellement le délai de carence d'un étudiant (`penaltyUntil`).

---

## ❌ 2. Stratégie de Gestion des Erreurs

Afin de ne pas briser l'expérience utilisateur ou menacer la sécurité du système (faille de divulgation d'architecture), les erreurs sont déclinées en trois dimensions, applicables sur l'API et relayées par le Front-end.

### Typologie Strict des Erreurs
1. **Erreurs de Validation (Format & Données)**
   - *Nature :* Donnée manquante, date invalide (réservation dans le passé), mot de passe trop court.
   - *Réponse API :* Code HTTP `400 Bad Request` contenant le tableau détaillé des champs non conformes.
   - *Interface :* Messages visuels (textes rouges ou bordures stylisées) alignés en dessous des champs d'inputs fautifs (Ex: "La plaque d'immatriculation doit faire 7 à 9 caractères").

2. **Erreurs Métier (Conflit Business & Refus Permission)**
   - *Nature :* La requête est valide format-wise, mais est illégale fonctionnellement.
   - *Réponse API :* Code HTTP `403 Forbidden` (Accès interdit) ou `409 Conflict` (Entité existante).
   - *Interface :* Utilisation de composants type "Toasts" (notifications non-obstrusives en haut de l'écran) en langage courant sans technicité IT.

3. **Erreurs Techniques (Casse Base de Données, Timeout)**
   - *Nature :* SQLite corrompue, Token JWT impossible à signer, échec de connexion réseau Prisma.
   - *Réponse API :* Code HTTP `500 Internal Server Error`.
   - *Interface :* Affichage d'une page de repli / "Error Boundary". La Stack Trace technique est gardée dans le Back-end et n'est **jamais exposée** au navigateur UI.

---

## 🔒 3. Scénarios Explicites d'Application

### 🛑 Cas Explicite 1 : Le Refus d'Accès ("Erreur Métier / 403 Forbidden")
**Scénario :** Un étudiant `STUDENT` a "séché" et oublié sa place la veille. Son compte a reçu la pénalité `penaltyUntil`. Il se connecte pour réserver la place de mardi prochain.
- *Flux API :* Le contrôleur backend identifie le token JWT et le profil, observe le flag de pénalité dans le futur. L'API jette la requête avec un `403 Forbidden` : `{"error": "action_blocked", "message": "Penalty active"}`.
- *Traitement Interface / Utilisateur :* Au clic sur le bouton de réservation, un message clair apparaît bloquant la page : *"⚠️ Réservation impossible. Votre accès est actuellement suspendu suite à une absence non signalée. Il sera restauré automatiquement le [Date de fin de pénalité]."*

### 💥 Cas Explicite 2 : L'Échec Critique ("Erreur Technique Database / 500")
**Scénario :** Un dysfonctionnement sur le disque dur local serveur rend le fichier `.db` (SQLite) corrompu de façon inattendue. Lorsqu'un administrateur charge le tableau de bord de récapitulatif.
- *Flux API :* Prisma ORM plante sèchement ("PrismaClientInitializationError"). L'erreur système interne est interceptée. Le serveur renvoie un standard `500 Internal Server Error` vide de détails vers le navigateur pour ne pas divulguer l'architecture OS.
- *Traitement Interface / Utilisateur :* Au lieu d'arborer un long texte illisible au milieu de l'écran ou de charger dans le vide infiniment, le React Error Boundary détecte la défaillance. Le tableau est remplacé par un composant d'état générique illustré disant : *"🔥 Oups, nos services rencontrent un dysfonctionnement technique majeur. Veuillez rafraîchir la page ou réessayer dans quelques minutes."* accompagné d'un bouton de retour au portail ou Refresh.
