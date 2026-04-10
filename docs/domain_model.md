# Domain Model

```mermaid
classDiagram
	class User {
		+id: String
		+email: String
		+name: String
		+phone: String
		+passwordHash: String
		+role: STUDENT|ADMIN|AGENT
		+isPmr: Boolean
		+pmrRequested: Boolean
		+pmrValidatedAt: DateTime?
		+penaltyUntil: DateTime?
		+createdAt: DateTime
		+updatedAt: DateTime
	}

	class Vehicle {
		+id: String
		+licensePlate: String
		+userId: String
		+createdAt: DateTime
	}

	class ParkingSpot {
		+id: String
		+spotNumber: Int
		+type: STANDARD|PMR
		+isActive: Boolean
	}

	class Reservation {
		+id: String
		+userId: String
		+spotId: String
		+date: String
		+status: CONFIRMED|CANCELLED|NO_SHOW
		+createdAt: DateTime
	}

	User "1" --> "*" Vehicle : owns
	User "1" --> "*" Reservation : books
	ParkingSpot "1" --> "*" Reservation : assigned to
```

## Contraintes importantes

- `User.email` unique
- `Vehicle.licensePlate` unique
- `ParkingSpot.spotNumber` unique
- Regles metier appliquees par le moteur:
	- une reservation active max par etudiant
	- fenetre de reservation 24h/48h selon contexte PMR
	- blocage no-show via `penaltyUntil`

Le schema Prisma dans `prisma/schema.prisma` est la source de verite du modele.
