# Stratégie Git et Règles d'Intégration (US17 / US18)

## 1. Stratégie de Branches
- `main` : Branche principale protégée. Contient le code de production stable. Aucun *commit* direct n'est autorisé.
- `dev` : Branche d'intégration principale pour le développement continu.
- `feature/*` : Branches pour les nouvelles fonctionnalités (ex: `feature/pmr-rules`).
- `bugfix/*` ou `hotfix/*` : Branches pour la correction de bugs.

## 2. Règles d'Intégration (Pull Requests)
- Toutes les modifications doivent passer par une Pull Request (PR) ciblant `dev` (ou `main` pour les versions).
- **GitHub Actions (CI)** : La PR ne peut être mergée que si les vérifications passent (tests unitaires, build Next.js, linting).
- **Revue de code** : Obligatoire par au moins un autre membre de l'équipe (ou validation par l'agent IA configuré via Antigravity).

## 3. Convention de Commits (Atomic Commits)
Nous utilisons les **Conventional Commits** pour garantir un historique propre et faciliter la génération de changelogs.

**Format :** `<type>(<scope>): <description courte>`

**Types autorisés :**
- `feat` : Ajout d'une nouvelle fonctionnalité métier.
- `fix` : Correction d'un bug.
- `docs` : Mise à jour de la documentation ou des ADR.
- `style` : Formatage du code (espaces, points-virgules) sans impact sur la logique.
- `refactor` : Modification du code sans ajouter de feature ni corriger de bug.
- `test` : Ajout ou modification de tests.
- `chore` : Tâches de maintenance (mise à jour des dépendances, configuration CI).

**Règle de l'atomicité :** Un commit = Une action logique. Ne pas mélanger une correction de bug et une nouvelle fonctionnalité dans le même commit.

**Exemples :**
- `feat(reservation): ajouter la limite de jours consécutifs`
- `fix(auth): empêcher la connexion avec un mot de passe vide`
- `docs(architecture): ajouter le diagramme de séquence principal`
