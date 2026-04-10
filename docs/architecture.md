# Architecture Overview

```mermaid
flowchart LR
	subgraph UI[Presentation Layer]
		A[Next.js App Router]
		B[React Components]
	end

	subgraph APP[Application Layer]
		C[API Routes app/api/*]
		D[Auth Helpers lib/auth.js]
		E[Reservation Engine lib/reservationEngine.js]
	end

	subgraph DOMAIN[Domain Layer]
		F[Business Rules]
		G[Domain Entities User/Vehicle/Reservation/ParkingSpot]
	end

	subgraph INFRA[Infrastructure Layer]
		H[Prisma Client]
		I[(SQLite)]
		J[Docker / Compose]
	end

	A --> C
	B --> C
	C --> D
	C --> E
	E --> F
	F --> G
	C --> H
	E --> H
	H --> I
	J --> I
```

## Layers

1. Presentation (Next.js UI): pages, components React, navigation et etats utilisateur.
2. Application: routes API, orchestration des requetes, controle d'acces, formatage des reponses.
3. Domain: regles metier de reservation (fenetre, no-show, PMR, anti-monopole).
4. Infrastructure: acces donnees via Prisma, persistance SQLite, execution conteneurisee.

## Data flow principal

1. Le client appelle une route API.
2. La route valide auth + entrees.
3. La logique metier calcule l'action autorisee.
4. Prisma lit/ecrit en base SQLite.
5. La reponse JSON (ou ICS) revient au client.
