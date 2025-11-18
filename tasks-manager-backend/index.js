const express = require('express');
const mongoose = require('mongoose');
const Tache = require('models/Tache');

const app = express();
app.use(express.json());


// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/maBase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur MongoDB :', err));


// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API de gestion des tâches');
});

// Route pour récupérer toutes les tâches
// A BOUGER PLUS TARD DANS /ROUTES/
app.get('/taches', async (req, res) => {
  try {
    const taches = await Tache.find();
    res.json(taches);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lancement du serveur
app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});
