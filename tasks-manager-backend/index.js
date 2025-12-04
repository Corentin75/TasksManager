const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');


const app = express();

const dotenv = require("dotenv");



// Optionnel : charger .env.local en dev seulement
if (process.env.NODE_ENV !== "production") {
  if (fs.existsSync(".env.local")) {
    dotenv.config({ path: ".env.local" });
    console.log("🔧 Fichier .env.local chargé !");
  }
}
else {
  // Toujours charger .env
  dotenv.config({ path: '.env' });
}

// ---- ENV ----
const PORT = process.env.PORT;
const MONGO_DB = process.env.MONGO_DB;

// ---- CORS ----

app.use(cors({ origin: process.env.CORS_ORIGINS }));
app.use(express.json());

// ---- Detect Docker ----
function isRunningInDocker() {
  try {
    const cgroup = fs.readFileSync("/proc/1/cgroup", "utf8");
    return cgroup.includes("docker") || cgroup.includes("container");
  } catch {
    return false;
  }
}

// ---- Detect credentials inside Docker ----
function readSecret(name) {
  const file = `/run/secrets/${name}`;
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim() : null;
}

let mongoUrl;

// ---- CASE 1 : Backend tourne DANS Docker ----
if (isRunningInDocker()) {
  const user = readSecret("mongo_root_user");
  const pass = readSecret("mongo_root_password");

  mongoUrl = `mongodb://${user}:${pass}@mongodb:27017/${MONGO_DB}?authSource=admin`;

  console.log("🐳 Backend détecté DANS Docker → Mongo = mongodb");

// ---- CASE 2 : Backend tourne en LOCAL ----
} else {
  mongoUrl = `mongodb://127.0.0.1:27017/${MONGO_DB}`;
  console.log("💻 Backend détecté EN LOCAL → Mongo = localhost");
}

console.log("🔧 URL Mongo utilisée :", mongoUrl);

// ---- Connexion ----
mongoose.connect(mongoUrl)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// Import des routes
const tasksRoutes = require('./routes/tasks');
app.use('/', tasksRoutes);

// Route test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de gestion des tâches',
    status: 'running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Une erreur est survenue' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, fermeture gracieuse...');
  mongoose.connection.close(() => {
    console.log('Connexion MongoDB fermée');
    process.exit(0);
  });
});

// Serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port : ${PORT}`);
});