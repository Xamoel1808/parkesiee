# Arbitrages, compromis et priorites du backlog (US39)

Ce document explicite les choix de priorisation et les renoncements majeurs.

## 1) Arbitrage architecture: monolithe Next.js + Prisma/SQLite
- benefice: vitesse de livraison, un seul repo, setup simple
- cout: limites de scalabilite et de concurrence SQLite

## 2) Arbitrage identite: auth locale JWT vs SSO campus
- benefice: autonomie equipe, pas de dependance admin externe
- cout: UX moins fluide et gestion secrete a renforcer

## 3) Arbitrage PMR: validation manuelle vs OCR/documents
- benefice: respect perimetre MVP, moins de complexite RGPD
- cout: delai de traitement humain, friction utilisateur

## 4) Arbitrage qualite: tests metier d'abord, UI e2e ensuite
- benefice: coeur fonctionnel securise rapidement
- cout: couverture e2e initiale (parcours critique) encore a etendre aux parcours secondaires

## 5) Arbitrage delivery: docker compose local vs deploiement cloud public
- benefice: demo reproductible et stable sur machine jury
- cout: application non exposee publiquement en mode production

## Compromis transverses

- delai vs perimetre: reduction volontaire des features annexes
- ergonomie vs robustesse: priorite au parcours principal avant optimisation UX fine
- securite vs temps: controles de base implementes, hardening complet reporte

## Stories priorisees car liees a la valeur

- US23-US24 (parcours principal et coeur MVP)
- US14-US15 (roles/erreurs + contrat API)
- US27-US30 (donnees et tests)
- US35-US37 (execution, livraison, documentation)

## Stories repoussees ou partiellement couvertes

- file d'attente intelligente
- notifications reelles
- OCR/gestion documentaire PMR
- industrialisation securite avancee (au-dela MVP)
