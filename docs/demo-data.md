# Demo Data (US27)

`npm run db:setup` seeds a repeatable demo dataset for the app.

## Accounts

- Admin: `admin@esiee-it.fr` / `admin123`
- Agent: `agent@esiee-it.fr` / `agent123`
- Standard student with reservation: `leo@esiee-it.fr` / `leo123`
- Standard student with empty state: `camille@esiee-it.fr` / `camille123`
- PMR student already validated: `sarah@esiee-it.fr` / `sarah123`
- PMR request pending: `nadia@esiee-it.fr` / `nadia123`
- Student under penalty: `julien@esiee-it.fr` / `noshow123`

## What the dataset shows

- nominal reservation flow with a confirmed booking for tomorrow
- empty state with a student who has no active reservation
- PMR validation flow with a validated account and PMR reservation
- pending PMR request visible in the admin dashboard
- error state where a penalized account is blocked from reserving

## Seed procedure

1. Create a `.env` file with `DATABASE_URL="file:./dev.db"`.
2. Run `npm run db:setup` to reset the local SQLite tables and rebuild the demo dataset.
3. Start the app with `npm run dev`.
