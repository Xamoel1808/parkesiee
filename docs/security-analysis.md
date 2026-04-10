# Analyse securite du code et des acces (US33)

Ce document identifie les risques principaux du MVP, les zones sensibles revues et les mesures appliquees ou justifiees.

## 1) Risques applicatifs identifies

1. Gestion des entrees utilisateurs
- risque: injection logique, donnees invalides (email, date, plaque, id)

2. Autorisations et roles
- risque: acces a des routes admin/agent par un utilisateur non autorise

3. Secrets et jetons
- risque: fuite de cle JWT ou usage d'un secret faible en environnement non controle

4. Exposition d'erreurs
- risque: divulgation d'informations techniques via messages serveur

5. Dependances tierces
- risque: vulnabilites connues sur stack JS et bibliotheques transitives

## 2) Zones sensibles revues

- `lib/auth.js`: verification token et role
- `app/api/admin/*`: controle d'acces `ADMIN` ou `AGENT`
- `app/api/reservations/*`: validation auth + regles metier
- `prisma/schema.prisma`: contraintes d'unicite (plaque, place/date)
- `audit-report.txt` et `sbom.json`: suivi des dependances

## 3) Mesures de reduction du risque appliquees

1. Controle d'acces centralise
- application de `requireAuth(request, roles)` sur les routes sensibles

2. Mots de passe haches
- stockage en hash bcrypt, pas de mot de passe en clair en base

3. Reponses d'erreur bornees
- messages API explicites mais sans stacktrace ni details internes cote client

4. Regles metier anti-abus
- blocage no-show (`penaltyUntil`), limitation reservation active, rotation

5. Verification des composants tiers
- SBOM produite et audit npm present (avec risque Next.js documente)

## 4) Limites connues (MVP)

- secret JWT de dev encore present par defaut si variable absente
- absence de rotation automatique des secrets et de mecanisme de refresh token
- pas de WAF/rate limiting dedie sur les endpoints critiques
- SonarQube depend de secrets CI et d'un serveur Sonar operationnel

## 5) Priorites post-MVP

1. imposer `JWT_SECRET` en production (fail fast)
2. ajouter rate limiting sur auth et reservation
3. ajouter tests de securite automatiques (SAST/dependency scan) en CI
