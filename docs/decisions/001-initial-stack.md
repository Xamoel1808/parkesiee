# ADR-001: Choix de la Stack Technique Initiale

**Date** : 2026-04-09
**Statut** : Accepté

## Contexte
Le projet "ParkESIEE" nécessite un développement rapide (MVP) pour valider les règles métier complexes (rotation, limites PMR, fenêtres temporelles) tout en offrant une interface web moderne et réactive. L'équipe est composée d'étudiants ayant une expérience modérée en JavaScript/TypeScript.

## Options envisagées
1. Express + React (SPA) + PostgreSQL
2. Next.js (App Router) + Prisma + SQLite
3. Firebase (BaaS)

## Décision
Nous avons choisi **Next.js (App Router) + Prisma + SQLite**.

## Justification
- **Next.js** permet de centraliser le code front-end et back-end dans un seul dépôt, accélérant le développement et réduisant les frictions de configuration CORS et de déploiement.
- **Prisma** offre une excellente sécurité de typage via TypeScript, ce qui évite de nombreuses erreurs d'intégration avec la base de données.
- **SQLite** a été choisi pour le MVP afin d'éviter la complexité de gestion d'un conteneur Docker PostgreSQL en local. Il est suffisant pour le volume de données attendu lors de la démonstration.

## Conséquences / Compromis
- Il sera nécessaire de migrer vers PostgreSQL (ou équivalent) si l'application doit être déployée dans un environnement multi-instances (Serverless ou Kubernetes), en raison du verrouillage des fichiers SQLite. Cependant, Prisma facilitera considérablement cette migration (changement du `provider` et adaptation mineure du schéma).
