# 🚀 Guide d'installation - Gestionnaire de Tâches

## 📋 Prérequis

- Docker Desktop installé (et ouvert en arrière plan si vous êtes sur windows)
- Docker Compose v2+

## 🔧 Configuration initiale

### 1. Créer le dossier des secrets

```bash
mkdir secrets
```

### 2. Créer les fichiers de secrets

```bash
# Créer le fichier pour le nom d'utilisateur MongoDB
echo "admin" > secrets/mongo_root_user.txt

# Créer le fichier pour le mot de passe MongoDB (changez "votre-mot-de-passe-securise")
echo "votre-mot-de-passe-securise" > secrets/mongo_root_password.txt
```

⚠️ **Important** : Remplacez `votre-mot-de-passe-securise` par un mot de passe fort !

### 3. Créer les fichiers .env

#### Backend (.env)

```bash
cd tasks-manager-backend
cp .env.example .env
```

Contenu du fichier `tasks-manager-backend/.env.example` :
```
#.env.example (Pour Docker)
NODE_ENV=production
PORT=3001
MONGO_DB=prodBase
CORS_ORIGINS=http://localhost:8080
```
#### .env.local (Développement local, sans Docker)
```bash
cd tasks-manager-backend
cp .env.local.example .env
```

Contenu du fichier `tasks-manager-backend/.env.local.example` :
```
#.env.local.exemple (Pour dev en Local, avec npm run dev)
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
```

Contenu du fichier `tasks-manager-frontend/.env.example` :
```
#.env.example (pour Docker)
VITE_API_URL=http://backend:3000
```
#### .env.local (Développement local, sans Docker)
```bash
cd frontend
cp .env.local.example .env
```

Contenu du fichier `frontend/.env.local.example` :
```
# .env.local.example (pour dev en local)
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

**http://localhost:8080**

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
cd backend
npm install
npm install nodemon
# Modifier server.js pour utiliser MongoDB local
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Accès sur http://localhost:5173

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