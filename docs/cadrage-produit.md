# Cadrage Produit (US01, US02, US05, US06, US08)

Ce document regroupe le cadrage produit principal du projet Park ESIEE. Il fixe le probleme, la cible, les personas, le theme retenu, le pitch et un benchmark minimal.

## US01 - Probleme, cible et proposition de valeur

### Probleme a resoudre
Le probleme adresse est simple: sur le campus, la disponibilite d'une place de parking est incertaine au moment ou l'etudiant arrive. Cette incertitude produit trois effets concrets.

- perte de temps a tourner sur le parking ou autour du campus
- stress avant le debut des cours et risque de retard
- frustration pour les profils PMR quand les places adaptees sont prises ou mal gerees

### Cible principale
La cible principale est composee des etudiants motorises de l'ESIEE-IT qui ont besoin de savoir a l'avance s'ils auront une place.

### Segments secondaires
- les etudiants beneficiant d'un statut PMR ou d'un besoin de stationnement prioritaire
- les agents et administrateurs qui doivent verifier, arbitrer et tracer les usages

### Proposition de valeur
Park ESIEE permet a un etudiant de reserver une place avant son arrivee, de connaitre l'etat de disponibilite, et de garder une trace exploitable de sa reservation. L'etudiant gagne du temps et de la previsibilite, l'administration gagne de la traçabilite, et les profils PMR gagnent une priorite explicite par rapport a la situation actuelle ou la gestion est manuelle ou implicite.

## US02 - Personas et scenarios d'usage

### Persona 1 - Leo, etudiant standard
- Contexte: il vient en voiture plusieurs fois par semaine et veut eviter de chercher une place au dernier moment.
- Objectif: reserver une place standard pour le lendemain et pouvoir annuler sans friction s'il a un imprévu.
- Frustrations: parking complet, manque de visibilite, risque d'oublier d'annuler.
- Scenario prioritaire: consulter la disponibilite, reserver, puis exporter la reservation dans son agenda.

### Persona 2 - Sarah, etudiante PMR
- Contexte: elle a besoin d'une place adaptee et ne peut pas se contenter d'un stationnement generic.
- Objectif: faire valider son statut, puis reserver une place PMR en priorite.
- Frustrations: attente de validation, crainte qu'une place adaptee soit occupee inutilement.
- Scenario prioritaire: soumettre une demande PMR, obtenir validation, puis reserver une place PMR.

### Persona 3 - Marc, agent de controle
- Contexte: il verifie les acces et doit savoir rapidement si un vehicule est legitime.
- Objectif: retrouver une plaque, controler la reservation du jour et declarer un no-show si besoin.
- Frustrations: controle manuel trop lent, information eparse, absence de trace claire.
- Scenario prioritaire: rechercher une plaque, afficher la reservation du jour, puis appliquer une penalite en cas d'absence.

## US05 - Theme retenu et decisions produit majeures

### Theme retenu
Le theme retenu est une application de reservation de parking pour ESIEE-IT. Le sujet reste clairement dans le domaine de l'education car il traite un besoin de vie de campus et un usage quotidien d'etudiants.

### Themes alternatifs ecartes
- reservation de salles de travail ou de salles de cours: probleme trop different de la realite du parking, et deja trop proche de solutions universitaires classiques
- gestion de prets de materiel: utile mais moins concret pour la motivation du parking, et plus eloigne du besoin de reservation horaire

### Decisions produit majeures
- conserver une reservation simple a date unique plutot qu'un planning complexe, pour garder un MVP demonstrable
- valider le statut PMR manuellement, afin d'eviter l'upload de justificatifs et la gestion de donnees sensibles non necessaires
- ne pas introduire de file d'attente automatique, car la valeur principale est la prediction de disponibilite, pas l'optimisation fine d'occupation
- conserver une alerte no-show et un export ICS, car ce sont des mecanismes simples qui reduisent les oublis et soutiennent la demonstration

## US06 - Elevator pitch

Park ESIEE est une application de reservation de parking pour les etudiants de l'ESIEE-IT. Elle leur permet de verifier la disponibilite, de reserver une place a l'avance, de gerer leur vehicule et d'exporter la reservation dans leur agenda. Le produit reduit le stress, limite les retards et donne un cadre clair aux profils PMR comme a l'administration.

## US08 - SWOT et benchmark minimal

### SWOT
| Forces | Faiblesses |
| --- | --- |
| Le parcours principal est simple et lisible | Le MVP repose sur une gestion locale et manuelle du statut PMR |
| La reservation est traçable et liee a un vehicule | La solution n'a pas d'optimisation dynamique type file d'attente |
| Le produit adresse un besoin concret de campus | La base SQLite reste adaptee au projet et non a une charge industrielle |

| Opportunites | Menaces |
| --- | --- |
| Etendre la solution a d'autres espaces du campus | Concurrence d'une gestion manuelle par le personnel ou d'un tableur partage |
| Ajouter des rappels ou notifications plus tard | Mauvaise adoption si les etudiants ne declarent pas correctement leur vehicule |
| Valoriser un usage professionnalisant pour la soutenance | Saturation du parking en cas de forte demande ponctuelle |

### Benchmark / approches comparees
1. Gestion manuelle par tableur ou feuille papier: simple a demarrer, mais fragile, peu traçable et difficilement exploitable pour une demonstration coherente.
2. Formulaire ou tableur partage type Google Forms: meilleur que le papier, mais sans vrai controle metier ni verification fine des reservations.
3. Solution SaaS de parking generaliste: plus complete sur le papier, mais trop large, souvent trop couteuse et pas adaptee au cadrage etudiant ni aux regles PMR du projet.

### Decouvertes qui influencent le backlog
- garder le noyau fonctionnel sur la reservation, la disponibilite et le controle d'acces
- repousser la file d'attente, l'OCR et les notifications automatiques hors MVP
- privilegier les elements montrables en soutenance plutot que les integrations couteuses en temps ou en risques
