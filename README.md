# ParkESIEE - Système de Gestion de Parking (MVP)

ParkESIEE est une application de gestion des places de parking spécialement conçue pour les étudiants. Elle permet la réservation de places standards et PMR, en appliquant des règles d'équité strictes (rotation, fenêtres de réservation limitées).

## 📚 Documentation Complète
- [Architecture & Flux de Données](docs/architecture.md)
- [Diagramme de Séquence (Parcours Principal)](docs/sequence_diagram.md)
- [Modèle de Domaine (Base de Données)](docs/domain_model.md)
- [Contrat d'API (Endpoints)](docs/api_contract.md)
- [Rôles & Permissions](docs/roles_permissions.md)
- [Choix Techniques (US11)](docs/technical_choices.md)
- [Journal des Décisions (ADR)](docs/decisions/)
- [Stratégie Git & Commits](docs/git_strategy.md)

## 🛠️ Stack Technique
- **Frontend** : React 18 / Next.js 14 (App Router)
- **Backend** : Next.js API Routes (Node.js)
- **Database** : SQLite embarqué
- **ORM** : Prisma
- **Authentification** : JWT maison (Stateless)

## 🚀 Guide d'Installation et d'Exploitation (US37)

### Prérequis
- Node.js (version >= 20 recommandée)
- npm (version >= 9)

### Étape 1 : Cloner et installer
```bash
git clone <repo-url>
cd parkesiee
npm install
```

### Étape 2 : Configuration de l'environnement
Un fichier `.env` est requis à la racine du projet. Copiez le modèle et ajustez si besoin :
```bash
cp .env.example .env
```
*(Variable requise : `DATABASE_URL="file:./dev.db"`)*

### Étape 3 : Initialiser la Base de Données
Synchronisez le schéma Prisma et peuplez la base avec les données de test (Étudiants, Admin, Places de parking) :
```bash
npm run db:setup
```
*Note : Si cette commande échoue, vous pouvez faire manuellement : `npx prisma db push` suivi de `npx prisma db seed`.*

### Étape 4 : Lancer le projet en Local
```bash
npm run dev
```
L'application est accessible sur : `http://localhost:3000`

### Accès de Test (Démonstration)
- **Admin** : `admin@esiee-it.fr` / Mot de passe : `Admin123!`
- **Étudiant Classique** : `jean.dupont@edu.esiee-it.fr` / Mot de passe : `Student123!`
- **Étudiant PMR** : Dépend du script de *seed*, consultez la base via `npm run db:studio`.

### Gestion et Exploitation
- **Explorer la BD** : `npm run db:studio` pour ouvrir l'interface d'administration Prisma sur le port 5555.
- **Journaux (Logs)** : Les logs applicatifs (dont la simulation de SMS) sont affichés dans la console où s'exécute `npm run dev`.

## ⚠️ Limites Actuelles (Hors-Périmètre MVP)
- Pas de déploiement Docker (*US35 / US36 prévus ultérieurement*).
- Pas de pipeline CI valide configurée (*US31*).
- Envoi de SMS simulés par _console.log_ uniquement.
