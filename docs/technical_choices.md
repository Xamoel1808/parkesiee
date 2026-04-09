# Justification des choix techniques (US11)

## Critères de Sélection
1. **Rapidité de développement (Time-to-market)** : Projet étudiant avec temps limité.
2. **Maintenabilité & Lisibilité** : Besoin d'un typage fort et d'un ORM intuitif.
3. **Simplicité de déploiement** : Architecture serverless-ready privilégiée.

## Choix Retenus

### 1. Framework Fullstack : Next.js (App Router)
* **Pourquoi ?** Permet d'unifier le front-end React et les routes API backend dans un seul projet. Réduit la complexité cognitive par rapport à une architecture séparée (ex: React + Express).
* **Alternatives écartées :** 
  * *React (Vite) + Express NestJS* : Trop lourd à configurer pour le périmètre d'un MVP.
  * *Vue.js + Laravel* : Courbe d'apprentissage trop élevée pour l'équipe sur le backend PHP.

### 2. ORM & Base de données : Prisma + SQLite
* **Pourquoi ?** Prisma offre une excellente autocomplétion TypeScript et un schéma déclaratif clair. SQLite est "zéro configuration", idéal pour le développement local et le MVP sans avoir besoin de dockeriser un SGBD.
* **Alternatives écartées :**
  * *TypeORM + PostgreSQL* : Plus complexe à configurer localement, TypeORM est plus verbeux en TypeScript que Prisma.
  * *MongoDB + Mongoose* : Le domaine métier (Utilisateur -> Véhicule -> Réservation -> Place) est strictement relationnel (ACID requis pour les réservations concurrentes). Le NoSQL n'est pas adapté ici.

### 3. Authentification : JWT (JSON Web Tokens)
* **Pourquoi ?** Stateless, facile à implémenter sans dépendance lourde, très performant pour un projet de petite taille.
* **Alternatives écartées :**
  * *NextAuth.js* : Très complet mais parfois lourd à configurer pour des scénarios personnalisés (comme l'ajout du statut PMR ou de tokens pour l'API).
  * *Sessions côté serveur (Redis)* : Ajoute un point de défaillance et de complexité d'infrastructure non justifié pour le MVP.
