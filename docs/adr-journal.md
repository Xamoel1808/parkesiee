# 📖 Journal des Décisions (ADR - Architecture Decision Records)

Ce document retrace l'historique des arbitrages majeurs pris sur le projet **Park ESIEE**. Il permet de justifier auprès d'un jury ou de nouveaux contributeurs pourquoi certains choix (parfois contre-intuitifs en entreprise) ont été considérés comme les plus rationnels dans le contexte de ce **projet étudiant**.

---

## 🏗️ ADR 001 - Architecture : Choix du Socle Monolithique Next.js & SQLite
**Date :** Avril 2026
**Domaine :** Architecture Technique

**Contexte :** 
Nous devions choisir une stack technique capable de délivrer rapidement une UI dynamique tout en sécurisant les accès à la base de données.

**Options envisagées :**
1. *Microservices (Front Vue/React + Back NestJS/Spring + BDD Distante)* : Plus proche des standards "Enterprise" mais lourd à scripter et à coordonner.
2. *Monolithe Next.js (App Router) avec API Routes intégrées et SQLite locale* : Structure tout-en-un.

**Choix Retenu :** 
**Option 2**. Nous avons utilisé Next.js couplé à Prisma ORM avec une base de données **SQLite locale**.

**Compromis & Conséquences :** 
- *Bénéfice :* Un seul dépôt (repo) Git, pas de gestion CORS complexe entre front et back, installation facilitée sur n'importe quel PC pour la soutenance en tapant juste `npm run dev`.
- *Compromis technique (Dette) :* SQLite verrouille rapidement la base lors de multiples écritures simultanées (pas de Haute Disponibilité réelle au-delà de quelques dizaines d'utilisateurs simultanés). C'est assumé pour un MVP étudiant.

---

## 🔒 ADR 002 - Sécurité : Authentification Native JWT vs SSO ESIEE
**Date :** Avril 2026
**Domaine :** Sécurité / Identité

**Contexte :** 
L'application s'adresse aux étudiants d'ESIEE-IT, qui ont déjà des comptes Microsoft scolaires.

**Options envisagées :**
1. *Intégration d'Azure AD (SSO Microsoft)* : Expérience parfaite ("Log in with ESIEE"), pas de gestion de mots de passe de notre côté.
2. *Authentification locale en base (Email + Mot de passe encrypté avec bcryptJS + JWT en session)* : Mécanique à construire soi-même de bout en bout.

**Choix Retenu :** 
**Option 2**. Authentification "manuelle" stockant localement le HASH des mots de passe.

**Compromis & Conséquences :** 
- *Bénéfice :* Autonomie totale de l'équipe de développement. Aucune dépendance à l'administration DSI de l'école (qui aurait pu prendre 2 semaines pour fournir des crédentiels OAuth2).
- *Compromis UX :* L'étudiant doit mémoriser un mot de passe en plus. Le cycle de vie du JWT (refresh, invalidation en cas de vol) repose sur la solidité de notre code rudimentaire.

---

## 💡 ADR 003 - Produit : Déclaratif Manuel pour le statut PMR vs Upload de Document OCR
**Date :** Avril 2026
**Domaine :** Produit / Périmètre Fonctionnel

**Contexte :** 
Les places PMR sont le cœur de cible des accès spécialisés. Il faut valider qu'un compte correspond réellement à une personne habilitée.

**Options envisagées :**
1. *Validation automatique :* L'application demande l'upload d'un scan de la carte handicap (MDPH) et tente d'utiliser une API Cloud Vision / OCR pour dire "Oui" ou "Non".
2. *Validation asynchrone manuelle :* L'étudiant clique sur "Demande d'accès", et un administrateur valide à la main l'accès via le Dashboard.

**Choix Retenu :** 
**Option 2**. C'est le système de "Drapeaux asynchrones" (`pmrRequested` => `isPmr` validé par Admin).

**Compromis & Conséquences :** 
- *Bénéfice :* Pas de facturation sur des API tierces (OCR), le développement est coupé court. Surtout, on évite le stockage de données de santé (données critiques RGPD), ce qui évite de gros soucis de conformité.
- *Compromis UX :* Ce modèle impose une rupture de flux (friction identifiée dans la US03), l'étudiant doit attendre un arbitrage humain avant de pouvoir sécuriser une réservation PMR.

---

## 🐳 ADR 004 - Déploiement : Conteneurisation isolée via Docker Compose au lieu de PaaS
**Date :** Avril 2026
**Domaine :** Déploiement / DevOps

**Contexte :** 
Le projet est prêt à être montré et la US35/36 demande la conteneurisation. Où et comment démontrer le fonctionnement "Production" ?

**Options envisagées :**
1. *Déploiement Cloud PaaS public* (ex: Vercel, Heroku, Render) + Base PostgreSQL distante.
2. *Conteneurisaton locale brute avec Docker-Compose* (contenant l'app Node + Base SQLite locale copiée au sein du volume).

**Choix Retenu :** 
**Option 2**. L'application est figée dans des images Docker `Dockerfile` et orchestrée avec `docker-compose.yml`.

**Compromis & Conséquences :** 
- *Option PaaS :* Le déploiement PaaS (Vercel) aurait pris 5 minutes pour Next, mais aurait cassé le modèle SQLite (le filesystem Vercel est éphémère / serverless, le `.db` se réinitialiserait à chaque requête sans volume persistant externe).
- *Compromis retenu :* En encapsulant le tout sous Docker avec un "Volume Mapping" classique, n'importe quel correcteur exécutant `docker-compose up -d` aura le code exact ET la base persistante. Cela rend l'environnement 100% "agnostique" et à l'épreuve des balles pour la démo, au détriment d'une vraie mise "En Ligne" publique.
