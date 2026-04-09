# 🚗 Parking ESIEE-IT - Système de Gestion de Parking

Ce projet est une application web de gestion de réservation de places de parking destinée aux étudiants et à l'administration de l'ESIEE-IT. 

La documentation ci-dessous regroupe toutes les informations nécessaires à l'installation, au lancement et à la compréhension de l'architecture, afin de satisfaire aux critères de la **US37**.

---

## 🎯 Vision et Périmètre
L'objectif est de fournir une interface simple et réactive permettant aux utilisateurs de s'inscrire, de se connecter et de réserver/gérer leurs places de stationnement. Une distinction des rôles (Étudiant, Administrateur, Agent, places PMR) encadre les règles métiers du parc de stationnement.

## 🏗 Architecture & Technologies utilisées
- **Frontend / Backend** : [Next.js 14](https://nextjs.org/) (App Router & API Routes)
- **Base de données** : SQLite local (fichier `dev.db`)
- **ORM** : [Prisma](https://www.prisma.io/)
- **Authentification & Sécurité** : JSON Web Token (JWT) + Hachage bcryptjs pour les mots de passe.

---

## 🛠 Prérequis d'installation
Avant de lancer l'application, assurez-vous d'avoir installé sur votre machine :
- **Node.js** (version 18+ recommandée)
- **npm** (inclus par défaut avec Node.js)
- *(À venir : Docker Desktop pour l'exploitation en conteneur).*

---

## 🚀 Installation & Lancement en Local

### 1. Cloner et Installer les dépendances
```bash
git clone <url-du-depot>
cd parkesiee
npm install
```

### 2. Configuration des Variables d'Environnement
Créez un fichier `.env` à la racine du projet et ajoutez-y la chaîne de connexion à la base de données :
```env
DATABASE_URL="file:./dev.db"
```

### 3. Initialisation de la Base de Données
Une commande personnalisée gère le déploiement du schéma et l'intégration des données de test (seeds) :
```bash
npm run db:setup
```
*Note: Cette commande correspond à un regroupement de `npx prisma db push` et du lancement du script `seed.mjs`.*

### 4. Démarrage de l'Application (Développement)
Pour lancer le serveur de développement :
```bash
npm run dev
```
L'application sera alors accessible sur [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Exploitation et Maintenance

- **Arrêt du serveur local :** `Ctrl + C` dans le terminal.
- **Accès base de données (UI) :** Lancez la commande `npm run db:studio` pour ouvrir l'interface Prisma Studio sur `localhost:5555`.
- **Journaux & Monitoring :** Actuellement, les journaux sortent sur la sortie standard du terminal (console). 

### Limites connues
- Le projet utilisant actuellement **SQLite** en local, les accès concurrentiels massif (haute dispo) en production ne sont pas supportés de façon native. L'idéal est de migrer vers Microsoft SQL Server ou PostgreSQL selon de futurs besoins.
- Le backend stocke des sessions par JWT, nécessitant une ré-authentification au bout du délai d'expiration.

---

## 🔐 Sécurité & Tests (US33 & US34 relatives)
- **Sécurité des accès :** Protégée par hash via `bcryptjs` en base.
- **Architecture de flux :** L'authentification vérifie la présence du token JWT envoyé sur les sous-répertoires sécurisés d'API (`/api/auth/...`).
- **Dependencies (SBOM) :** Les dépendances saines peuvent être listées/analysées par des commandes d'audit `npm audit`. Les rapports SBOM sont générables par la commande standardisée de votre pipeline DevOps.

---

## 🐳 Conteneurisation (Docker - Prévu US35 & US36)
*(Cette section sera enrichie suite à la validation des tickets de conteneurisation)*
- La commande ciblée sera : `docker-compose up -d --build` afin de monter l'ensemble du stack isolément.
