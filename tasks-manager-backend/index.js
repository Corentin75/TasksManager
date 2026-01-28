const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const dotenv = require("dotenv");

const app = express();

// charger les variables d'environnement
// si on est en dev et que .env.local existe, on le charge
if (process.env.NODE_ENV !== "production") {
  if (fs.existsSync(".env.local")) {
    dotenv.config({ path: ".env.local" });
    console.log("🔧 Fichier .env.local chargé !");
  }
} else {
  dotenv.config({ path: '.env' }); // en prod, toujours charger .env
}

// variables d'environnement
const PORT = process.env.PORT;
const MONGO_DB = process.env.MONGO_DB;

// CORS et JSON
app.use(cors({ origin: process.env.CORS_ORIGINS }));
app.use(express.json());

// détection Docker
function isRunningInDocker() {
  try {
    const cgroup = fs.readFileSync("/proc/1/cgroup", "utf8");
    return cgroup.includes("docker") || cgroup.includes("container");
  } catch {
    return false;
  }
}

// lire des secrets Docker si présents
function readSecret(name) {
  const file = `/run/secrets/${name}`;
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim() : null;
}

// construire l'URL MongoDB
let mongoUrl;
if (isRunningInDocker()) {
  const user = readSecret("mongo_root_user");
  const pass = readSecret("mongo_root_password");
  mongoUrl = `mongodb://${user}:${pass}@mongodb:27017/${MONGO_DB}?authSource=admin`;
  console.log("Backend détecté dans Docker -> Mongo = mongodb");
} else {
  mongoUrl = `mongodb://127.0.0.1:27017/${MONGO_DB}`;
  console.log("Backend détecté en local -> Mongo = localhost");
}

// connexion à MongoDB
mongoose.connect(mongoUrl)
  .then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur MongoDB :", err));

// import des routes
const tasksRoutes = require('./routes/tasks');
app.use('/', tasksRoutes);

// route test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de gestion des tâches',
    status: 'running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue' });
});

// graceful shutdown (pour fermeture propre)
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, fermeture gracieuse...');
  mongoose.connection.close(() => {
    console.log('Connexion MongoDB fermée');
    process.exit(0);
  });
});

// lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé !`);
});
