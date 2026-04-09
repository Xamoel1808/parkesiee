# Roles, Permissions & Error Management (US14)

## Roles
| Role | Description | Allowed Actions |
|------|-------------|-----------------|
| **STUDENT** | Regular student user who can reserve parking spots. | - View available spots (`GET /api/spots`)
- Reserve a spot (`POST /api/reservations`)
- Cancel own reservation (`DELETE /api/reservations/:id`)
- Manage own vehicle(s) (`POST/PUT/DELETE /api/vehicles`)
- Update own profile (`PUT /api/users/me`)
- View own reservations (`GET /api/reservations/me`)
|
| **ADMIN** | Administrative staff who oversees the parking system. | - View all reservations (`GET /api/reservations`)
- View all users and their vehicles (`GET /api/users`)
- See license plates associated with each reservation.
- Export reservation reports.
- Deactivate/reactivate parking spots.
- Manage PMR validation status for users.
|
| **AGENT** *(optional future role)* | External service or support staff. | - Limited read‑only access to reservation logs.
|

## Permissions Matrix
| Action | STUDENT | ADMIN | AGENT |
|--------|---------|-------|-------|
| View spots | ✅ | ✅ | ✅ |
| Reserve spot | ✅ | ✅ (on behalf) | ❌ |
| Cancel reservation | ✅ (own) | ✅ (any) | ❌ |
| Manage vehicles | ✅ (own) | ✅ (any) | ❌ |
| View all reservations | ❌ | ✅ | ✅ |
| Manage spots (activate/deactivate) | ❌ | ✅ | ❌ |
| Update user role / PMR status | ❌ | ✅ | ❌ |

## Error Handling Strategy (US14)
- **401 Unauthorized** – Missing or invalid JWT token.
- **403 Forbidden** – Authenticated but lacking required role/permission.
- **400 Bad Request** – Validation errors (e.g., missing required fields, invalid date format).
- **404 Not Found** – Resource does not exist (e.g., reservation ID not found).
- **409 Conflict** – Business rule violation (e.g., trying to reserve when an active reservation already exists, exceeding consecutive‑day limit).
- **500 Internal Server Error** – Unexpected server‑side failures; response should not expose stack traces.

All API responses follow a consistent JSON envelope:
```json
{ "success": true|false, "data": {...}, "error": "Message if any" }
```

Error messages are user‑friendly and localized in French where appropriate.
