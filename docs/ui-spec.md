# UI Spec - Ecrans cles et regles d'interface (US09)

Ce document sert de reference de maquettes textuelles pour les ecrans structurants du parcours principal et fixe un mini guide UI coherent pour l'equipe.

## 1) Ecran landing (presentation)

### Zones
- Hero: promesse produit, cible, CTA principaux.
- Bloc parcours: etapes de reservation (vehicule -> date -> confirmation).
- Bloc demo: comptes admin/agent et acces API.
- Sections problemes, benefices, usage, acces/contact.

### Actions
- Creer un compte
- Se connecter
- Ouvrir la documentation API

### Informations attendues
- probleme du parking campus
- proposition de valeur
- cible et roles
- appels a l'action clairs

## 2) Ecran connexion / inscription

### Zones
- formulaire email + mot de passe (connexion)
- formulaire profil + plaque + mot de passe (inscription)
- zone message d'erreur/succes

### Actions
- soumettre le formulaire
- basculer connexion/inscription
- retour vers la landing

### Etats
- normal: formulaire vide
- erreur validation: message lisible sous forme d'alerte
- erreur technique: message serveur generique sans details sensibles

## 3) Dashboard etudiant (parcours principal)

### Zones
- resume compte et reservation active
- choix de date (demain, J+2 PMR)
- disponibilite standard/PMR
- bouton reserver
- historique

### Actions
- reserver une place
- annuler la reservation active
- exporter ICS

### Etats
- normal: disponibilites chargees, action possible
- vide: aucune reservation dans l'historique
- erreur: message explicite de regle metier (penalite, date invalide, parking complet)

## 4) Profil etudiant

### Zones
- infos personnelles editables
- gestion des plaques
- bloc statut PMR (valide / en attente / non demande)

### Actions
- modifier nom/telephone
- ajouter une plaque
- soumettre une demande PMR

### Etats
- normal: donnees chargees
- vide: aucun vehicule
- erreur: plaque deja existante, echec reseau

## 5) Dashboard admin

### Zones
- onglets reservations / demandes PMR
- filtre date
- tableau reservations
- liste demandes PMR avec actions approuver/rejeter

### Actions
- consulter les reservations par date
- approuver/rejeter une demande PMR

### Etats
- normal: liste chargee
- vide: aucune reservation ou aucune demande PMR
- erreur: refus d'acces ou erreur serveur

## 6) Ecran agent (lookup plaque)

### Zones
- champ plaque
- resultat proprietaire + reservation du jour
- action no-show

### Actions
- verifier une plaque
- signaler un no-show

### Etats
- normal: plaque trouvee + reservation valide
- vide: plaque inconnue
- erreur: pas de reservation du jour ou echec API

## Mini guide UI

### Composants recurrents
- `card`: conteneur principal de section
- `btn`, `btn-primary`, `btn-outline`, `btn-danger`, `btn-success`
- `alert` pour messages de succes/erreur
- `badge` pour statut (PMR, CONFIRMED, CANCELLED)
- `table` pour listes admin/historique

### Navigation
- navbar role-aware (etudiant/admin/agent)
- actions majeures en haut de page
- coherence des libelles d'un ecran a l'autre

### Formulaires
- labels explicites, placeholders d'exemple
- messages d'erreur comprehensibles
- focus visible sur les champs et actions

### Feedback utilisateur
- succes: message vert contextualise
- erreur metier: message explicite (ex: penalite, reservation deja active)
- erreur technique: formulation non technique, sans stacktrace
