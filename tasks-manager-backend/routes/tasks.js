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
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches.' });
  }
});

//route pour recup 1 seul tache by is
router.get('/tache/:id', async(req, res)=>{
  try {
    const { id } = req.params;
    const tache = await Tache.findById(id)
    res.json(tache);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupérartion de la tâche.' });
  }
})

//route pour delete une tache par son id
router.post('/tache/:id/delete', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Tache.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.json({ message: "Tâche supprimée avec succès" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche.' });
  }
});

module.exports = router;
