# CI/CD et verification qualite (US31, US32)

Ce document decrit les controles executes automatiquement en CI et la place de SonarQube dans la validation.

## Pipeline GitHub Actions

Workflow: `.github/workflows/ci.yml`

Declenchement:
- push sur `main`, `dev`, `feat/**`, `feature/**`, `docs/**`
- pull request

Verifications executees:
1. installation propre des dependances (`npm ci`)
2. tests automatiques (`npm run test`)
3. build de production (`npm run build`)

Workflow E2E dedie: `.github/workflows/e2e.yml`
- installe Chromium Playwright
- execute le parcours navigateur critique (`npm run test:e2e`)

En cas d'echec de tests ou de build, la pipeline echoue et la PR ne doit pas etre fusionnee.

## SonarQube

Workflow: `.github/workflows/sonar.yml`

Condition d'execution:
- le workflow tourne uniquement si `SONAR_TOKEN` et `SONAR_HOST_URL` sont definis dans les secrets du repository

Configuration projet:
- fichier `sonar-project.properties`
- sources: `app`, `components`, `lib`, `prisma`
- tests: `tests/**/*.test.mjs`

## Quality Gate minimale (US32)

Le projet cible les seuils suivants:
1. 0 issue bloquante (Blocker)
2. 0 vulnerabilite critique non justifiee
3. dette technique nouvelle code: maintenable (rating A ou B)
4. au moins 60% de couverture sur le code nouveau

Si le Quality Gate echoue, la correction ou la justification doit etre faite avant fusion.

## Commandes locales equivalentes

- `npm run ci`
- `npm test`
- `npm run build`
- `npm run test:e2e`
