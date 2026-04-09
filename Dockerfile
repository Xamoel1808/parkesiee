FROM node:18-alpine

# Mettre en place le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer openssl indispensable pour Prisma sous Alpine
RUN apk add --no-cache openssl

# Installation des dépendances (y compris Prisma)
RUN npm install

# Copier le reste du projet
COPY . .

# Construction de l'application Next.js (production)
RUN npm run build

# Exposer le port que l'app utilise
EXPOSE 3000

# Variables d'environnement par défaut
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Commande de lancement de l'application
CMD ["npm", "start"]
