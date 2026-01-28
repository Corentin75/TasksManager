FROM node:18-alpine

ENV NODE_ENV=production
# créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# copier package.json + package-lock.json et installer deps
COPY package*.json ./
RUN npm ci --only=production

# copier le code avec les permissions correctes
COPY --chown=nodejs:nodejs . .

# passer à l'utilisateur non-root
USER nodejs

EXPOSE 3000

# on lance le serveur
CMD ["node", "index.js"]
