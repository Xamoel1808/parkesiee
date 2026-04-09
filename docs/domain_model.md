# Domain Model

![Domain Model Diagram](/home/raiden/.gemini/antigravity/brain/3761987f-fd2e-4469-8154-6a1ecfb8fdb7/domain_model_diagram_1775741886999.png)

## Entities
- **User**: `id`, `email`, `name`, `phone`, `passwordHash`, `role` (STUDENT/ADMIN/AGENT), `isPmr`, `pmrRequested`, `pmrValidatedAt`, `createdAt`, `updatedAt`
- **Vehicle**: `id`, `licensePlate` (unique), `userId` (FK → User), `createdAt`
- **ParkingSpot**: `id`, `spotNumber` (unique), `type` (STANDARD/PMR), `isActive`
- **Reservation**: `id`, `userId` (FK → User), `spotId` (FK → ParkingSpot), `date` (YYYY‑MM‑DD), `status` (CONFIRMED/CANCELLED), `createdAt`

## Relationships
- User **1‑* Vehicle** (a user can own multiple vehicles)
- User **1‑* Reservation** (a user can have many reservations, but business rules limit active ones)
- ParkingSpot **1‑* Reservation** (each spot can be reserved many times across dates)

The Prisma schema (`prisma/schema.prisma`) mirrors this model exactly.
