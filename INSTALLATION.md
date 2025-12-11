# 🚀 Guide d'installation - Gestionnaire de Tâches

## 📋 Prérequis

- Docker Desktop installé (et ouvert en arrière plan si vous êtes sur windows)
- Docker Compose v2+

## 🔧 Configuration initiale

Le backend s'exécute dans un container Docker sur le port 3000 à l'intérieur du container.
Pour éviter les conflits avec votre serveur de développement local (port 3000), le port 3000 du container est mappé sur le port 3001 de votre machine locale.

Pour évtier toutes confusions, une bases de données MongoDB est dédié à la "production" sous Docker, et une autre est dédié au développement en local.

Pour cloner le dépot :
```bash
git clone https://github.com/Corentin75/TasksManager
```

### 1. Créer le dossier des secrets

```bash
cd TasksManager
mkdir secrets
```

### 2. Créer les fichiers de secrets

```bash
# Créer le fichier pour le nom d'utilisateur MongoDB
printf "admin" > secrets/mongo_root_user.txt

# Créer le fichier pour le mot de passe MongoDB (changez "votre-mot-de-passe-securise")
printf "votre-mot-de-passe-securise" > secrets/mongo_root_password.txt
```

⚠️ **Important** : Remplacez `votre-mot-de-passe-securise` par un mot de passe fort ! Deplus veuillez ne jamais le changer une fois l'application lancer une fois, cela risque de donner une erreur d'acces à la base de données.

### 3. Créer les fichiers .env

#### Backend (.env)

```bash
cd tasks-manager-backend
cp .env.example .env
cp .env.local.example .env.local
```

Contenu du fichier `tasks-manager-backend/.env` :
```
# Exemple d'un fichier .env fonctionnel pour exécution en Docker
NODE_ENV=production
PORT=3001
MONGO_DB=prodBase
CORS_ORIGINS=http://localhost:8080
```
#### .env.local (Développement local, sans Docker)

Contenu du fichier `tasks-manager-backend/.env.local` :
```
# Exemple d'un fichier .env.local fonctionnel pour développement local (npm run dev)
NODE_ENV=development
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DB=devBase
PORT=3000
CORS_ORIGINS=http://localhost:5173
```

#### Frontend (.env)

```bash
cd tasks-manager-frontend
cp .env.example .env
cp .env.local.example .env.local
```

Contenu du fichier `tasks-manager-frontend/.env` :
```
# Exemple d'un fichier .env fonctionnel pour exécution en Docker
VITE_API_URL=http://backend:3000
```
#### .env.local (Développement local, sans Docker)

Contenu du fichier `tasks-manager-frontend/.env.local` :
```
# Exemple d'un fichier .env.local fonctionnel pour développement local (npm run dev)
VITE_API_URL=http://localhost:3000
```

### 4. Vérifier le .gitignore

Assurez-vous que ces lignes sont dans votre `.gitignore` à la racine :
```
secrets/
**/.env
**/.env.local
```

## 🐳 Lancement de l'application (sous Docker)

### Construire et démarrer tous les services

```bash
docker-compose up --build
```

### Démarrer en arrière-plan

```bash
docker-compose up -d
```

### Voir les logs

```bash
docker-compose logs -f
```

### Arrêter l'application

```bash
docker-compose down
```

OU

Ctrl+C dans le terminal ou est lancé le container.

### Tout supprimer (y compris les volumes)

```bash
docker-compose down -v
```

## 🌐 Accès à l'application

Une fois démarré, l'application est accessible sur :

Pour au frontend local :  **http://localhost:8080**
Accès au backend local : **http://localhost:3001**

## 🔍 Vérification du fonctionnement

### Vérifier l'état des services

```bash
docker-compose ps
```

Tous les services doivent avoir le statut "healthy" ou "running".

### Tester l'API backend

```bash
curl http://localhost:3001/
```

Devrait retourner :
```json
{
  "message": "API de gestion des tâches",
  "status": "running",
  "environment": "production"
}
```

## 🔐 Gestion des secrets - Explications

### Secrets Docker

Les secrets sont gérés via Docker Secrets (mode Swarm lite) :
- Fichiers stockés dans `./secrets/`
- Montés en lecture seule dans `/run/secrets/` dans les conteneurs
- Jamais commités dans Git (via `.gitignore`)

### Variables d'environnement

Les fichiers `.env` contiennent les configurations non-sensibles :
- URLs
- Ports
- Noms de base de données
- Options de configuration

### Hiérarchie de sécurité

1. **Secrets** (données sensibles) : mots de passe, clés API, tokens
2. **Variables .env** (configuration) : URLs, ports, options
3. **Code** (logique) : aucune donnée sensible

## 🛠️ Développement local (Sans Docker)

Pour le développement local (sans Docker) :

### Backend

```bash
cd tasks-manager-backend
npm install
npm install nodemon
npm run dev
```

### Frontend

```bash
cd tasks-manager-frontend
npm install
npm run dev
```

**⚠️ Attention** l'accès à l'application n'est pas le même qu'en production :
Le frontend est dispo sur **http://localhost:5173**
Le backend se trouve sur **http://localhost:3000**

## 📦 Structure du projet

```
.
├── backend/
│   ├── Dockerfile
│   ├── .env
|   ├── .env.local
│   ├── index.js
│   ├── routes/
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env
|   ├── .env.local
│   ├── src/
│   └── package.json
├── secrets/
│   ├── mongo_root_user.txt
│   └── mongo_root_password.txt
├── docker-compose.yml
├── .gitignore
└── INSTALLATION.md
```

## 🐛 Dépannage

### Les conteneurs ne démarrent pas

```bash
docker-compose logs
```

### Réinitialiser complètement

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Problème de connexion MongoDB

Vérifiez que les secrets sont bien créés :
```bash
ls -la secrets/
```

### Le frontend ne se connecte pas au backend

Vérifiez la configuration nginx et les variables d'environnement du frontend.

## 🎓 Points clés pour l'exercice

✅ **Images Docker** : Dockerfiles optimisés multi-stage pour le frontend

✅ **Multi-services** : 3 services (MongoDB, Backend, Frontend) orchestrés

✅ **Gestion des secrets** : Docker Secrets + fichiers .env séparés

✅ **Sécurité** : Pas de secrets dans le code, utilisateur non-root

✅ **Production-ready** : Nginx, gestion d'erreurs, graceful shutdown
