# Preuves de credibilite professionnalisante (US40)

Ce document mappe les preuves concretes vers les axes attendus en soutenance.

## Produit
- vision/cadrage: `docs/cadrage-produit.md`
- user journeys: `docs/user-journeys.md`
- MVP et coupe: `docs/mvp-definition.md`

## Architecture
- vue globale: `docs/architecture.md`
- sequence: `docs/sequence_diagram.md`
- domaine: `docs/domain_model.md`
- ADR: `docs/adr-journal.md`, `docs/decisions/001-initial-stack.md`

## Qualite
- regles de code: `docs/code-quality-rules.md`
- tests unitaires: `tests/reservationEngine.test.mjs`
- tests integration: `tests/reservationFlow.integration.test.mjs`
- tests e2e navigateur: `tests/e2e/mainFlow.spec.js`

## Securite
- roles/erreurs: `docs/roles-et-erreurs.md`
- analyse securite: `docs/security-analysis.md`
- audit dependances: `audit-report.txt`

## Git et gouvernance
- strategie git: `docs/git_strategy.md`
- regles IA: `.agent/rules/antigravity.md`
- workflow review IA: `.agent/workflows/code_review.md`

## CI/CD et DevOps
- pipeline CI: `.github/workflows/ci.yml`
- sonar: `.github/workflows/sonar.yml`, `sonar-project.properties`
- docker: `Dockerfile`, `docker-compose.yml`

## Limites reconnues

- architecture orientee MVP et non haute charge
- SonarQube necessite secrets + serveur configure
- couverture e2e concentree sur le parcours critique principal

Ces limites sont documentees et assumees, avec une trajectoire d'amelioration explicite.
