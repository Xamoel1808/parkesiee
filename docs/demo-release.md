# Preparation version demonstrable et stable (US38)

## Version de demo

- branche de preparation: `feat/product-foundation`
- version cible de soutenance: `v1.0.0-demo` (tag recommande au moment du gel)

## Script de demonstration (ordre conseille)

1. Ouvrir la landing et presenter le probleme + proposition de valeur.
2. Connexion etudiant `leo@esiee-it.fr` pour montrer reservation active et export ICS.
3. Connexion etudiant `camille@esiee-it.fr` pour montrer etat vide.
4. Connexion etudiant `julien@esiee-it.fr` pour montrer le cas d'erreur (penalite).
5. Connexion admin pour traiter une demande PMR de `nadia@esiee-it.fr`.
6. Connexion agent pour verifier une plaque et scenario no-show.

## Comptes et donnees utiles

- seeding: `npm run db:setup`
- comptes: voir `docs/demo-data.md`

## Fonctionnalites non pretes ou limitees

- pas de notifications SMS/Email reelles (simulation console)
- pas de file d'attente automatique
- pas d'upload justificatif PMR

Ces limites sont explicites en soutenance et ne bloquent pas le parcours principal.

## Verifications minimales avant freeze

1. `npm run ci` passe en local
2. `docker-compose up -d --build` demarre l'application
3. documentation a jour (`README`, docs produit/architecture/tests/securite)
