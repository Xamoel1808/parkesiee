# 🛠️ Règles de Qualité de Code et Documentation (US28)

Ce document établit les standards de code et de documentation pour le projet **Park ESIEE**, afin d'éviter l'accumulation de dette technique ou l'illisibilité engendrée par un codage non structuré (le "vibe coding").

---

## 🏗️ 1. Séparation des Responsabilités (Architecture Intérieure)
- **Logique Métier isolée :** Ne **jamais** écrire de logique métier complexe (comme les calculs de jours consécutifs, fenêtres de PMR) directement dans les gestionnaires de routes (`app/api/.../route.js`).
- Toute la logique métier doit vivre dans le dossier `lib/` (ex: `lib/reservationEngine.js`).
- Les conteneurs UI (Composants React) ne font appel qu'aux API, et ne valident pas des données sensibles de sécurité eux-mêmes.

## 🧼 2. Lisibilité, Duplication & Complexité
- **Principe DRY (Don't Repeat Yourself) :** Dès qu'un bloc de code (comme la validation ou les parseurs de dates `YYYY-MM-DD`) est répété 2 fois, il doit être extrait dans une fonction utilitaire ou un middleware.
- **Retour Rapide (Early Return) :** Éviter les indentations en cascade absurdes. Tester les conditions limites en premier et stopper avec un `return` rapide (Ex: `if (!user) return { success: false };`).
- **Complexité Cyclomatique :** Une fonction ne doit pas dépasser 4 niveaux de if/for imbriqués.

## 📝 3. Stratégie de Commentaires (L'Interdiction du Décoratif)
L'intelligence Artificielle (ou le Vibe Coding) produit souvent des commentaires inutiles censés "paraître bien". Sur ce projet, **les commentaires décoratifs ou mensongers sont strictement interdits**. On ne paraphrase jamais le code.

- **INTERDIT :** `// Cette fonction vérifie la pénalité de l'utilisateur` (Inutile, le nom de la fonction le dit déjà).
- **INTERDIT :** Les blocs ASCII gigantesques ou les séparateurs multi-lignes n'apportant pas d'information.`
- **OBLIGATOIRE :** Le "POURQUOI". Les commentaires doivent expliquer **pourquoi** un algorithme non intuitif est utilisé.

*(Exemple : "On compte jusqu'à N+1 dans cette boucle car on doit inclure la veille du jour demandé pour vérifier la consécutivité", et non "Boucle for de 0 à N+1")*.

---

### ⚠️ Avertissement pour les Contributions Futures (IA ou Humaines)
**Tout nouveau code poussé sur la branche de référence devra appliquer ces règles ou documenter son exception. Aucun agent IA n'est autorisé à contourner la séparation `lib/` vs `api/`.**
