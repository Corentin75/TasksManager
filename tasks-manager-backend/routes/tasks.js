// GET /tasks : récupérer toutes les tâches. ✅
// GET /tasks/:id : récupérer une tâche par son identifiant. ✅
// POST /tasks : créer une nouvelle tâche. ✅
// PUT /tasks/:id : modifier une tâche existante. ✅
// DELETE /tasks/:id : supprimer une tâche. ✅
// Fonctionnalités complémentaires obligatoires :
// Filtrer les tâches (statut, priorité, catégorie, étiquette, échéance). à faire dans le back
// Trier les résultats (par date, priorité, etc.).

// Gérer les sous-tâches et commentaires.
//Pouvoir afficher tous les commentaires


// (Optionnel) Historiser les modifications ✅

const express = require('express');
const router = express.Router();
const Tache = require('../models/Tache');

// Route pour récupérer les tâches avec filtres
router.get('/taches', async (req, res) => {
  try {
    const {
      statut,
      priorite,
      categorie,
      etiquette,
      avant,
      apres,
      q,
      tri,
      ordre
    } = req.query;

    const filter = {};

    // Filtres simples
    if (statut) filter.statut = statut;
    if (priorite) filter.priorite = priorite;
    if (categorie) filter.categorie = categorie;

    // Étiquettes
    if (etiquette) {
      filter.etiquettes = { $in: [etiquette] };
    }

    // Dates (échéance)
    if (avant || apres) {
      filter.echeance = {};
      if (avant) filter.echeance.$lte = new Date(avant);
      if (apres) filter.echeance.$gte = new Date(apres);
    }

    // Recherche texte
    if (q) {
      filter.$or = [
        { titre: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // TRI
    let sort = {};
    if (tri) {
      sort[tri] = ordre === 'desc' ? -1 : 1;
    }

    const taches = await Tache.find(filter).sort(sort);

    res.json(taches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur récupération des tâches' });
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

// Route pour créer une nouvelle tâche
router.post('/nouvelletache', async (req, res) => {
  try {
    const {
      titre,
      description,
      echeance,
      statut,
      priorite, 
      auteur,
      categorie,
      etiquettes,
      sousTaches,
      commentaires
    } = req.body;

    const nouvelleTache = new Tache({
      titre,
      description,
      echeance,
      statut,
      priorite,
      auteur,
      categorie,
      etiquettes,
      sousTaches,
      commentaires
      // dateCreation, historiqueModifications seront créés automatiquement
    });

    const tacheEnregistree = await nouvelleTache.save();
    res.status(201).json(tacheEnregistree);

  } catch (err) {
    console.error("Erreur POST /taches :", err);
    res.status(500).json({ error: "Erreur lors de la création de la tâche." });
  }
});

// pour edit la tache
router.put('/taches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 1. On récupère la tâche avant modification
    const ancienneTache = await Tache.findById(id);

    if (!ancienneTache) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // 2. On va construire l'historique des changements
    const historique = [];

    for (const champ in updates) {
      if (JSON.stringify(ancienneTache[champ]) !== JSON.stringify(updates[champ])) {
        historique.push({
          champModifié: champ,
          ancienneValeur: JSON.stringify(ancienneTache[champ]),
          nouvelleValeur: JSON.stringify(updates[champ]),
          date: new Date()
        });
      }
    }

    // 3. On applique les updates
    Object.assign(ancienneTache, updates);

    // 4. On pousse l'historique s'il y a des modifications
    if (historique.length > 0) {
      ancienneTache.historiqueModifications.unshift(...historique);
    }

    // 5. On sauvegarde
    const tacheModifiee = await ancienneTache.save();

    res.json({
      message: "Tâche mise à jour avec historique",
      tache: tacheModifiee
    });

  } catch (err) {
    console.error("Erreur PUT /taches/:id :", err);
    res.status(500).json({ error: "Erreur lors de la modification de la tâche." });
  }
});



//-----------------------------COMMENTAIRE-----------------------------------



// Ajouter un commentaire à une tâche
router.post('/taches/:id/commentaires', async (req, res) => {
  try {
    const { id } = req.params;
    const { auteur, contenu } = req.body;

    if (!auteur || !contenu) {
      return res.status(400).json({
        error: "L'auteur et le contenu sont obligatoires."
      });
    }

    const tache = await Tache.findById(id);

    if (!tache) {
      return res.status(404).json({ error: "Tâche introuvable." });
    }

    const commentaire = {
      auteur,
      contenu
    };

    // Ajout du commentaire
    tache.commentaires.push(commentaire);

    // Historique
    tache.historiqueModifications.unshift({
      champModifié: "commentaires",
      ancienneValeur: null,
      nouvelleValeur: JSON.stringify(commentaire),
      date: new Date()
    });

    await tache.save();

    res.status(201).json({
      message: "Commentaire ajouté avec succès",
      commentaire: tache.commentaires.at(-1)
    });

  } catch (err) {
    console.error("Erreur POST commentaire :", err);
    res.status(500).json({
      error: "Erreur lors de l'ajout du commentaire."
    });
  }
});


// Modifier un commentaire
router.put('/taches/:tacheId/commentaires/:commentaireId', async (req, res) => {
  try {
    const { tacheId, commentaireId } = req.params;
    const { contenu } = req.body;

    if (!contenu) {
      return res.status(400).json({ message: "Le contenu est obligatoire." });
    }

    const tache = await Tache.findById(tacheId);

    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée." });
    }

    const commentaire = tache.commentaires.id(commentaireId);

    if (!commentaire) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    // Historique
    tache.historiqueModifications.unshift({
      champModifié: "commentaire",
      ancienneValeur: commentaire.contenu,
      nouvelleValeur: contenu,
      date: new Date()
    });

    // Update
    commentaire.contenu = contenu;

    await tache.save();

    res.json({
      message: "Commentaire modifié avec succès",
      commentaire
    });

  } catch (err) {
    console.error("Erreur PUT commentaire :", err);
    res.status(500).json({ error: "Erreur lors de la modification du commentaire." });
  }
});


// Supprimer un commentaire
router.delete('/taches/:tacheId/commentaires/:commentaireId', async (req, res) => {
  try {
    const { tacheId, commentaireId } = req.params;

    const tache = await Tache.findById(tacheId);

    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée." });
    }

    const commentaire = tache.commentaires.id(commentaireId);

    if (!commentaire) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    // Historique
    tache.historiqueModifications.unshift({
      champModifié: "commentaire",
      ancienneValeur: commentaire.contenu,
      nouvelleValeur: "Commentaire supprimé",
      date: new Date()
    });

    // Suppression
    commentaire.deleteOne();

    await tache.save();

    res.json({
      message: "Commentaire supprimé avec succès"
    });

  } catch (err) {
    console.error("Erreur DELETE commentaire :", err);
    res.status(500).json({ error: "Erreur lors de la suppression du commentaire." });
  }
});




//-----------------------------SOUS-TACHE---------------------------------- 



//route pour ajouter une sous-tache dans la tache 
router.post('/taches/:id/sous-taches', async (req, res) => {
  try {
    const { id } = req.params;
    const nouvelleSousTache = req.body;

    const tache = await Tache.findById(id);
    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    tache.sousTaches.push(nouvelleSousTache);

    // Historique
    tache.historiqueModifications.unshift({
      champModifié: "sousTaches",
      ancienneValeur: null,
      nouvelleValeur: JSON.stringify(nouvelleSousTache),
      date: new Date()
    });

    await tache.save();

    res.status(201).json({
      message: "Sous-tâche ajoutée avec succès",
      sousTache: tache.sousTaches.at(-1)
    });

  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la sous-tâche." });
  }
});


//route pour modifier une sous-tache : 
router.put('/taches/:id/sous-taches/:subId', async (req, res) => {
  try {
    const { id, subId } = req.params;
    const updates = req.body;

    const tache = await Tache.findById(id);
    if (!tache) return res.status(404).json({ message: "Tâche non trouvée" });

    const sousTache = tache.sousTaches.id(subId);
    if (!sousTache) return res.status(404).json({ message: "Sous-tâche non trouvée" });

    // Copie de l’ancienne sous-tâche (pour comparer)
    const ancienneSousTache = sousTache.toObject();

    // Construction de l’historique
    const historique = [];

    for (const champ in updates) {
      if (JSON.stringify(ancienneSousTache[champ]) !== JSON.stringify(updates[champ])) {
        historique.push({
          champModifié: `sousTache.${champ}`,
          ancienneValeur: JSON.stringify(ancienneSousTache[champ]),
          nouvelleValeur: JSON.stringify(updates[champ]),
          date: new Date()
        });
      }
    }

    // Mise à jour
    Object.assign(sousTache, updates);

    // Ajout à l’historique
    if (historique.length > 0) {
      tache.historiqueModifications.unshift(...historique);
    }

    await tache.save();

    res.json(tache);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la modification de la sous-tâche." });
  }
});

//supprimer une sous-tache :
router.delete('/taches/:id/sous-taches/:subId', async (req, res) => {
  try {
    const { id, subId } = req.params;

    const tache = await Tache.findById(id);
    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    const sousTache = tache.sousTaches.id(subId);
    if (!sousTache) {
      return res.status(404).json({ message: "Sous-tâche non trouvée" });
    }

    // Historique AVANT suppression
    tache.historiqueModifications.unshift({
      champModifié: "sousTaches",
      ancienneValeur: JSON.stringify(sousTache),
      nouvelleValeur: "Sous-tâche supprimée",
      date: new Date()
    });

    sousTache.deleteOne();

    await tache.save();

    res.json({ message: "Sous-tâche supprimée avec succès" });

  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression de la sous-tâche." });
  }
});



module.exports = router;
