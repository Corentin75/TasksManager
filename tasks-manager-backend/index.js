const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/maBase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur MongoDB :', err));

// Import des routes
const tasksRoutes = require('./Route/tasks');
app.use('/', tasksRoutes);

// Route test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API de gestion des tâches');
});

// Serveur
app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
