# Main User Flow – Sequence Diagram

![Sequence Diagram](/home/raiden/.gemini/antigravity/brain/3761987f-fd2e-4469-8154-6a1ecfb8fdb7/sequence_diagram_1775741856293.png)

**Steps**
1. Student opens the UI and logs in via `/api/auth/login`.
2. UI calls `ReservationEngine.createReservation(userId, date)`.
3. Engine checks:
   - Max one active reservation.
   - Reservation window (24 h / 48 h for PMR when PMR spots full).
   - Consecutive‑day rotation limit.
   - Spot availability (PMR priority then standard).
4. Engine selects an available `ParkingSpot` and creates a `Reservation` record.
5. Engine logs a simulated SMS confirmation.
6. API returns the reservation details to the UI.
