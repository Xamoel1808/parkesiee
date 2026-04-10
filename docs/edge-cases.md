# Gestion des etats vides, erreurs et cas limites (US26)

Ce document recense les cas limites identifies sur le MVP, leur traitement et les limites assumees.

## Cas limites traites

1. Utilisateur sans vehicule
- Risque: reservation impossible sans plaque liee.
- Traitement: blocage metier dans le moteur de reservation avec message explicite.

2. Utilisateur penalise apres no-show
- Risque: contournement de sanction.
- Traitement: verification `penaltyUntil` avant creation de reservation.

3. Reservation deja active
- Risque: monopolisation du parking.
- Traitement: une seule reservation active autorisee par utilisateur.

4. Date invalide ou hors fenetre
- Risque: creation de reservations incoherentes.
- Traitement: validation format date + fenetre de reservation (24h standard, 48h PMR selon regle).

5. Parking complet sur une date
- Risque: conflit de capacite.
- Traitement: message explicite "parking complet" et bouton de reservation desactive.

6. Requete PMR deja en cours
- Risque: duplication de demandes et confusion admin.
- Traitement: rejet de nouvelle demande PMR si `pmrRequested = true`.

7. Plaque inconnue cote agent
- Risque: verification terrain inexploitables.
- Traitement: ecran lookup retourne un etat "vehicule non reconnu".

## Cas limites explicitement hors MVP

- gestion automatique de file d'attente lors d'annulation
- notifications push/SMS reelles de rappel
- OCR/document upload pour preuves PMR

## Verification associee

- tests automatises sur regles critiques dans `tests/reservationEngine.test.mjs`
- scenarios de demonstration en base via `docs/demo-data.md`
