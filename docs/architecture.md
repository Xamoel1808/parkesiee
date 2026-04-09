# Architecture Overview

![Architecture Diagram](/home/raiden/.gemini/antigravity/brain/3761987f-fd2e-4469-8154-6a1ecfb8fdb7/architecture_diagram_1775741833659.png)

## Layers

1. **Presentation (Next.js UI)** – React components, pages, and client‑side routing.
2. **Application** – API routes under `app/api/*`, business logic (reservation engine, auth helpers).
3. **Domain** – Prisma schema (`prisma/schema.prisma`) and the reservation engine (`lib/reservationEngine.js`).
4. **Infrastructure** – SQLite database (`prisma/dev.db`), optional Docker container for production.

### Data Flow
- UI → API (REST) → Application logic → Domain services → Prisma → SQLite.
- Responses flow back the same way.
- SMS mock is logged by the reservation engine.
