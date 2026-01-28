# build
FROM node:18-alpine AS builder

WORKDIR /app

# copier les fichiers de dépendances
COPY package*.json ./

# installer les dépendances
RUN npm ci

# copier le code source
COPY . .

# build de l'application avec les variables d'env
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# production avec Nginx
FROM nginx:alpine

# copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

# créer un script pour injecter les variables d'environnement au runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env-subst.sh && \
    echo 'echo "window.ENV = { API_URL: \"$VITE_API_URL\" };" > /usr/share/nginx/html/env-config.js' >> /docker-entrypoint.d/40-env-subst.sh && \
    chmod +x /docker-entrypoint.d/40-env-subst.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]