// ✅ GET /tasks : récupérer toutes les tâches.
// ❌ GET /tasks/:id : récupérer une tâche par son identifiant.
// ❌ POST /tasks : créer une nouvelle tâche.
// ❌ PUT /tasks/:id : modifier une tâche existante.
// ❌ DELETE /tasks/:id : supprimer une tâche.
//
// Fonctionnalités complémentaires obligatoires :
// ❌ Filtrer les tâches (statut, priorité, catégorie, étiquette, échéance).
// ❌ Trier les résultats (par date, priorité, etc.).
// ❌ Gérer les sous-tâches et commentaires.
// ❌ (Optionnel) Historiser les modifications

const express = require('express');
const router = express.Router();
const Tache = require('../models/Tache');

// Route pour récupérer toutes les tâches
router.get('/taches', async (req, res) => {
  try {
    const taches = await Tache.find();
    res.json(taches);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
