# Accessibility Checks (US25)

Ce document trace les verifications d'accessibilite minimales realisees sur le MVP et leurs limites.

## Verification effectuees

1. Navigation clavier
- Les boutons, liens et champs critiques du parcours (landing, login/register, dashboard, profil) sont atteignables au clavier.
- Le focus est visible sur les elements interactifs via styles dedies.

2. Libelles et comprehension
- Les formulaires utilisent des labels associes (`htmlFor`) et des placeholders d'exemple.
- Les messages d'erreur/succes sont rediges en francais clair et non technique.

3. Feedback et etats
- Les alertes de statut utilisent des motifs visuels stables (couleur + icone + texte).
- Les notifications critiques sont exposees via regions ARIA (`role=alert` / `role=status`, `aria-live`) sur les ecrans majeurs.
- Les etats vides critiques sont explicites (historique vide, aucune demande PMR, aucune reservation du jour).

4. Coherence de navigation
- Les roles (STUDENT/ADMIN/AGENT) voient des menus adaptes, limitant les actions invalides.
- Les parcours majeurs gardent des CTA consistants (reserver, annuler, valider PMR).

## Limites connues

- Pas de test lecteur d'ecran complet sur l'ensemble des pages.
- Pas de mesure automatisee de contraste (WCAG AA) sur toutes les combinaisons couleur/etat.

## Actions d'amelioration prevues

1. Ajouter une passe de tests Lighthouse/axe sur les ecrans critiques.
2. Ajouter une checklist contraste et tailles minimales avant release finale.
3. Completer avec un audit lecteur d'ecran (NVDA/VoiceOver) sur les parcours login/reservation/no-show.
