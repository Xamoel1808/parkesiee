# Guide de presentation

Ce guide donne l ordre de demo, les commandes utiles et les points a montrer pendant la soutenance ou la revue projet.

## Statut de validation

Au 10/04/2026, la base est saine :
- `npm run test` passe
- `npm run test:e2e` passe
- `npm run build` passe

## 1. Preparation avant la demo

Lancer la remise a plat des donnees et verifier que le projet demarre proprement :

```bash
npm run db:setup
npm run test
npm run test:e2e
npm run build
```

Si vous voulez une verification unique plus large :

```bash
npm run ci
```

Si vous presenterez aussi le mode conteneurise :

```bash
docker-compose up -d --build
```

Au premier passage Playwright, si le navigateur manque localement :

```bash
npx playwright install chromium
```

## 2. Demarrage de la demo

Lancer l application en local :

```bash
npm run dev
```

Puis ouvrir : `http://localhost:3000`

Points a verifier avant de commencer :
- la base a bien ete seedee
- les comptes de demo sont disponibles
- la page d accueil charge sans erreur
- `/api-docs` est accessible

## 3. Ordre de presentation conseille

### A. Accueil et proposition de valeur

A montrer :
- la landing page
- le contexte du besoin parking ESIEE-IT
- la promesse principale : reservation, roles distincts, no-show, PMR, export ICS

Message a faire passer :
- le produit couvre le parcours principal de bout en bout
- les cas metier critiques sont pris en charge sans surpromesse

### B. Documentation API

Ouvrir `/api-docs` et montrer :
- les routes d authentification
- les routes reservations
- les routes admin et agent
- les routes de disponibilite et export ICS

Message a faire passer :
- le contrat d API est explicite
- le front et le backend sont alignes sur les memes parcours

### C. Parcours etudiant avec reservation active

Compte a utiliser : `leo@esiee-it.fr` / `leo123`

A montrer :
- le tableau de bord etudiant
- la reservation existante
- le bouton d export ICS
- le flux d annulation si vous voulez montrer la gestion d etat

Message a faire passer :
- un etudiant voit son etat de reservation immediate
- l export ICS permet l integration calendrier

### D. Parcours etudiant sans reservation

Compte a utiliser : `camille@esiee-it.fr` / `camille123`

A montrer :
- l etat vide
- la consultation de disponibilite
- la creation d une reservation si la date est autorisee

Message a faire passer :
- le systeme ne reserve pas a la place de l utilisateur
- le parcours reste simple quand rien n est encore planifie

### E. Cas de blocage metier

Compte a utiliser : `julien@esiee-it.fr` / `noshow123`

A montrer :
- le message de penalite
- le refus de reservation sur utilisateur penalise
- la cohérence du message metier avec le reglement

Message a faire passer :
- les regles de non-presentation sont appliquees
- les erreurs sont lisibles et directement actionnables

### F. Flux admin PMR

Compte a utiliser : `admin@esiee-it.fr` / `admin123`

A montrer :
- la vue administrateur
- la recherche d utilisateur
- le traitement ou la verification d une demande PMR
- la consultation des reservations si besoin

Message a faire passer :
- les roles sont separes
- l admin peut arbitrer les cas sensibles sans casser le flux etudiant

### G. Flux agent no-show

Compte a utiliser : `agent@esiee-it.fr` / `agent123`

A montrer :
- la verification de plaque
- la detection de no-show
- l application de la penalite et son effet visible sur un compte etudiant

Message a faire passer :
- le controle terrain est couvert
- les consequences d exploitation sont automatisees

## 4. Donnees de demo a garder sous la main

Comptes utiles :
- Admin : `admin@esiee-it.fr` / `admin123`
- Agent : `agent@esiee-it.fr` / `agent123`
- Etudiants : `leo@esiee-it.fr`, `camille@esiee-it.fr`, `sarah@esiee-it.fr`, `nadia@esiee-it.fr`, `julien@esiee-it.fr`

Commandes de support :

```bash
npm run db:studio
npm run db:setup
npm run dev
```

## 5. Ce qu il faut montrer si le temps est court

1. La landing page.
2. Un login etudiant.
3. Une reservation active et l export ICS.
4. Une erreur metier claire sur un cas de penalite ou de disponibilite.
5. `/api-docs` pour prouver que l API est documentee.

## 6. Messages de conclusion

- Le produit couvre le parcours critique principal de bout en bout.
- Les regles de gestion parking sont explicites et tracees.
- Les controles techniques principaux passent en local avant soutenance.
- Les limites connues sont assumees et documentees dans la documentation produit.
