# Contrat des Routes API (US15)

## Base URL : `/api`

### Authentification

#### `POST /auth/login`
- **Description** : Authentifie un utilisateur et retourne un token JWT.
- **Entrée (Body)** : `{ "email": "string", "password": "string" }`
- **Sortie Succès (200)** : `{ "token": "string", "user": { "id", "email", "role", "isPmr" } }`
- **Sortie Erreur (401)** : `{ "error": "Identifiants invalides" }`

#### `POST /auth/register`
- **Description** : Inscrit un nouvel étudiant.
- **Entrée (Body)** : `{ "email", "name", "phone", "password", "isPmr": boolean }`
- **Sortie Succès (201)** : `{ "token": "string", "user": { ... } }`
- **Sortie Erreur (400)** : `{ "error": "Cet email est déjà utilisé" }`

### Réservations

#### `GET /reservations/me`
- **Description** : Retourne les réservations de l'utilisateur connecté.
- **Entrée (Headers)** : `Authorization: Bearer <token>`
- **Sortie Succès (200)** : `{ "reservations": [ { "id", "date", "status", "spot": { "spotNumber", "type" } } ] }`
- **Sortie Erreur (401)** : `{ "error": "Non authentifié" }`

#### `POST /reservations`
- **Description** : Tente de réserver une place pour une date donnée (applique les règles métier).
- **Entrée (Headers)** : `Authorization: Bearer <token>`
- **Entrée (Body)** : `{ "date": "YYYY-MM-DD" }`
- **Sortie Succès (201)** : `{ "success": true, "reservation": { ... } }`
- **Sortie Erreur (400/409)** : `{ "success": false, "error": "Raison (ex: rotation, max atteint)" }`

#### `DELETE /reservations/:id`
- **Description** : Annule une réservation.
- **Entrée (Headers)** : `Authorization: Bearer <token>`
- **Sortie Succès (200)** : `{ "success": true }`
- **Sortie Erreur (404)** : `{ "error": "Réservation non trouvée" }`

### Véhicules (Étudiants)

#### `GET /users/me/vehicles`
- **Description** : Récupère les véhicules de l'utilisateur.
- **Entrée (Headers)** : `Authorization: Bearer <token>`
- **Sortie Succès (200)** : `{ "vehicles": [ { "id", "licensePlate" } ] }`

#### `POST /users/me/vehicles`
- **Description** : Ajoute une plaque d'immatriculation.
- **Entrée (Body)** : `{ "licensePlate": "string" }`
- **Sortie Succès (201)** : `{ "vehicle": { ... } }`

### Administration (Role: ADMIN)

#### `GET /admin/reservations`
- **Description** : Récupère toutes les réservations avec les infos utilisateur et véhicule.
- **Entrée (Headers)** : `Authorization: Bearer <token>`
- **Sortie Succès (200)** : `{ "reservations": [ ... ] }`
- **Sortie Erreur (403)** : `{ "error": "Accès interdit" }`
