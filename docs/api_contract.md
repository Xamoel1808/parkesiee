# Contrat des routes API (US15)

## Base URL
- `/api`

## Regles communes
- Authentification par header: `Authorization: Bearer <token>`
- Format d'erreur standard: `{ "error": "message" }`
- Les routes protegees retournent:
	- `401` si token absent/invalide
	- `403` si role insuffisant

## Authentification

### `POST /auth/register`
- Description: cree un compte etudiant et son premier vehicule
- Body requis:
	- `email`, `password`, `name`, `phone`, `licensePlate`
- Reponses:
	- `201`: `{ token, user }`
	- `400`: champs manquants
	- `409`: email ou plaque deja utilises
	- `500`: erreur serveur

### `POST /auth/login`
- Description: authentifie un utilisateur
- Body requis:
	- `email`, `password`
- Reponses:
	- `200`: `{ token, user }`
	- `400`: parametres manquants
	- `401`: identifiants invalides
	- `500`: erreur serveur

### `GET /auth/me`
- Description: retourne le profil courant (avec vehicules)
- Auth: requise
- Reponses:
	- `200`: `{ user }`
	- `401`: non authentifie
	- `404`: utilisateur introuvable

## Reservations

### `GET /reservations`
- Description: retourne les reservations de l'utilisateur courant
- Auth: requise
- Reponses:
	- `200`: `{ reservations: [...] }`
	- `401`: non authentifie

### `POST /reservations`
- Description: cree une reservation en appliquant les regles metier
- Auth: requise
- Body requis:
	- `date` au format `YYYY-MM-DD`
- Reponses:
	- `201`: `{ message, reservation }`
	- `400`: date invalide ou regle metier bloquante
	- `401`: non authentifie

### `DELETE /reservations?id=<reservationId>`
- Description: annule une reservation
- Auth: requise
- Query param requis:
	- `id`
- Reponses:
	- `200`: `{ message }`
	- `400`: parametre manquant ou annulation impossible
	- `401`: non authentifie

### `GET /reservations/ics?id=<reservationId>`
- Description: exporte la reservation en fichier ICS
- Auth: requise
- Query param requis:
	- `id`
- Reponses:
	- `200`: flux `text/calendar`
	- `400`: parametre manquant
	- `401`: non authentifie
	- `404`: reservation introuvable ou non possedee

## Disponibilite et controle

### `GET /spots/availability?date=YYYY-MM-DD`
- Description: disponibilite globale standard/PMR pour une date
- Auth: requise
- Query param requis:
	- `date` (format `YYYY-MM-DD`)
- Reponses:
	- `200`: `{ date, standard, pmr, totalAvailable, totalSpots }`
	- `400`: date invalide
	- `401`: non authentifie

### `GET /spots/check-plate?plate=AA-123-BB`
- Description: verifie publiquement si une plaque a une reservation du jour
- Auth: non requise
- Query param requis:
	- `plate`
- Reponses:
	- `200`: `{ reserved, message, spotNumber?, spotType? }`
	- `400`: parametre manquant
	- `500`: erreur serveur

## Utilisateur

### `GET /users/vehicles`
- Description: retourne les vehicules de l'utilisateur courant
- Auth: requise
- Reponses:
	- `200`: `{ vehicles: [{ id, licensePlate, createdAt }] }`
	- `401`: non authentifie

### `POST /users/vehicles`
- Description: ajoute un vehicule au compte courant
- Auth: requise
- Body requis:
	- `licensePlate`
- Reponses:
	- `201`: `{ message, vehicle }`
	- `400`: plaque manquante ou deja enregistree
	- `401`: non authentifie

### `PUT /users/profile`
- Description: met a jour le profil utilisateur
- Auth: requise
- Body accepte:
	- `name`, `phone`
- Reponses:
	- `200`: `{ user }`
	- `401`: non authentifie

### `POST /users/pmr-request`
- Description: soumet une demande PMR
- Auth: requise
- Reponses:
	- `200`: `{ message }`
	- `400`: deja PMR valide ou demande deja en cours
	- `401`: non authentifie

## Administration et agent

### `GET /admin/reservations?date=YYYY-MM-DD`
- Description: reservations confirmees d'une date (vue admin/agent)
- Auth: roles `ADMIN` ou `AGENT`
- Query param requis:
	- `date`
- Reponses:
	- `200`: `{ date, count, reservations }`
	- `400`: parametre manquant
	- `401`/`403`: acces refuse

### `GET /admin/lookup?plate=AA-123-BB`
- Description: recherche complete par plaque (owner + reservation du jour)
- Auth: roles `ADMIN` ou `AGENT`
- Query param requis:
	- `plate`
- Reponses:
	- `200`: `{ found, vehicle?, todayReservation? }`
	- `400`: parametre manquant
	- `401`/`403`: acces refuse

### `GET /admin/users?pmrPending=true|false`
- Description: liste des utilisateurs, option filtre PMR en attente
- Auth: role `ADMIN`
- Reponses:
	- `200`: `{ users }`
	- `401`/`403`: acces refuse

### `PUT /admin/users`
- Description: traite une demande PMR
- Auth: role `ADMIN`
- Body requis:
	- `userId`
	- `action` parmi `approve` ou `reject`
- Reponses:
	- `200`: `{ message }`
	- `400`: body invalide
	- `404`: utilisateur introuvable
	- `401`/`403`: acces refuse

### `POST /agent/no-show`
- Description: declare un no-show et applique une penalite de 7 jours
- Auth: roles `ADMIN` ou `AGENT`
- Body requis:
	- `reservationId`
- Reponses:
	- `200`: `{ message }`
	- `400`: body invalide
	- `404`: reservation introuvable
	- `401`/`403`: acces refuse
