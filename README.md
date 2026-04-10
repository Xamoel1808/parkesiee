# ParkESIEE - Système de Gestion de Parking

ParkESIEE est une application web de gestion de réservation de places de parking pour ESIEE-IT. Elle couvre l'inscription, la connexion, la réservation de places standards et PMR, les flux agent et admin, l'export ICS et la gestion des no-show.

## Documentation
- [Cadrage produit](docs/cadrage-produit.md)
- [Demo data](docs/demo-data.md)
- [UI spec](docs/ui-spec.md)
- [Accessibility checks](docs/accessibility-checks.md)
- [Edge cases](docs/edge-cases.md)
- [CI/CD](docs/ci-cd.md)
- [Security analysis](docs/security-analysis.md)
- [Demo release plan](docs/demo-release.md)
- [Backlog arbitrages](docs/backlog-arbitrages.md)
- [Soutenance proofs](docs/soutenance-proofs.md)
- [Architecture et flux de données](docs/architecture.md)
- [Contrat d'API](docs/api_contract.md)
- [Modèle de domaine](docs/domain_model.md)
- [Rôles et permissions](docs/roles_permissions.md)
- [Diagramme de séquence](docs/sequence_diagram.md)
- [Choix techniques](docs/technical_choices.md)
- [Stratégie Git](docs/git_strategy.md)
- [Journal des décisions](docs/decisions/)
- [Règlement Intérieur (Pénalités)](docs/reglement.md)
- Swagger UI disponible sur `/api-docs`

## Stack technique
- Next.js 14 / React 18
- API Routes Next.js côté backend
- Prisma avec SQLite local
- JWT pour l'authentification
- bcryptjs pour le hachage des mots de passe
- swagger-ui-react pour la documentation API

## Fonctionnalités principales
- Inscription, connexion et profil utilisateur
- Réservation et gestion de places standards et PMR
- Consultation de la disponibilité des places
- Vérification de plaque et traitement des no-show
- Export ICS des réservations
- Vues et outils dédiés à l'administration et aux agents

## Installation locale

### Prérequis
- Node.js 20 ou plus recommandé
- npm 9 ou plus

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer l'environnement
Créer un fichier `.env` à la racine du projet avec :
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-this-dev-secret-please"
```
`npm run db:setup` efface et reconstruit ensuite les donnees locales de demonstration.
`JWT_SECRET` est obligatoire et doit contenir au moins 16 caracteres.

### 3. Initialiser la base de données
```bash
npm run db:setup
```

### 4. Lancer l'application
```bash
npm run dev
```
L'application est accessible sur `http://localhost:3000`.

## Comptes de démonstration
- Admin : `admin@esiee-it.fr` / `admin123`
- Agent : `agent@esiee-it.fr` / `agent123`
- Student demo accounts: `leo@esiee-it.fr` / `leo123`, `camille@esiee-it.fr` / `camille123`, `sarah@esiee-it.fr` / `sarah123`, `nadia@esiee-it.fr` / `nadia123`, `julien@esiee-it.fr` / `noshow123`
- Les étudiants peuvent aussi créer leur compte depuis l'interface d'inscription.

## Exploitation
- Prisma Studio : `npm run db:studio`
- Docker Compose : `docker-compose up -d --build`
- Les journaux applicatifs sont affichés dans la console du serveur

## Qualite continue
- Pipeline locale: `npm run ci`
- E2E navigateur: `npm run test:e2e` (premiere execution: `npx playwright install chromium`)
- Pipeline GitHub: `.github/workflows/ci.yml`
- SonarQube: `.github/workflows/sonar.yml` + `sonar-project.properties`

## Notes
- SQLite reste le mode local par défaut.
- L'API et l'interface Swagger sont synchronisées avec les routes applicatives.
- Les sessions sont gérées par JWT.
