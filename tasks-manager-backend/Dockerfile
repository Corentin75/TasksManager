FROM node:18-alpine

ENV NODE_ENV=production
# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copier package.json + package-lock.json et installer deps
COPY package*.json ./
RUN npm ci --only=production

# Copier le code avec les permissions correctes
COPY --chown=nodejs:nodejs . .

# Passer à l'utilisateur non-root
USER nodejs

EXPOSE 3000

# Lancer le serveur
CMD ["node", "index.js"]
