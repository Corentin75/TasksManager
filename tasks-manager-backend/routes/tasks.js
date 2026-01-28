const express = require('express');
const router = express.Router();
const Tache = require('../models/Tache'); // modèle Mongoose pour les tâches


// ---------- TÂCHES ----------

// récupérer toutes les tâches avec filtres et tri
router.get('/taches', async (req, res) => {
  try {
    const { statut, priorite, categorie, etiquette, avant, apres, q, tri, ordre } = req.query;
    const filter = {};

    if (statut) filter.statut = statut;
    if (priorite) filter.priorite = priorite;
    if (categorie) filter.categorie = categorie;
    if (etiquette) filter.etiquettes = { $in: [etiquette] };

    if (avant || apres) {
      filter.echeance = {};
      if (avant) filter.echeance.$lte = new Date(avant);
      if (apres) filter.echeance.$gte = new Date(apres);
    }

    if (q) {
      filter.$or = [
        { titre: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    let sort = {};
    if (tri) sort[tri] = ordre === 'desc' ? -1 : 1;

    const taches = await Tache.find(filter).sort(sort);
    res.json(taches);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération des tâches' });
  }
});

// récupérer une tâche par son ID
router.get('/tache/:id', async(req, res)=>{
  try {
    const tache = await Tache.findById(req.params.id);
    res.json(tache);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la tâche.' });
  }
});

// supprimer une tâche par son ID
router.post('/tache/:id/delete', async (req, res) => {
  try {
    const result = await Tache.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Tâche non trouvée" });
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche.' });
  }
});

// créer une nouvelle tâche
router.post('/nouvelletache', async (req, res) => {
  try {
    const nouvelleTache = new Tache(req.body); // récupération directe des champs depuis req.body
    const tacheEnregistree = await nouvelleTache.save();
    res.status(201).json(tacheEnregistree);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création de la tâche." });
  }
});

// modifier une tâche et historiser les changements
router.put('/taches/:id', async (req, res) => {
  try {
    const ancienneTache = await Tache.findById(req.params.id);
    if (!ancienneTache) return res.status(404).json({ message: "Tâche non trouvée" });

    const historique = [];
    for (const champ in req.body) {
      if (JSON.stringify(ancienneTache[champ]) !== JSON.stringify(req.body[champ])) {
        historique.push({
          champModifié: champ,
          ancienneValeur: JSON.stringify(ancienneTache[champ]),
          nouvelleValeur: JSON.stringify(req.body[champ]),
          date: new Date()
        });
      }
    }

    Object.assign(ancienneTache, req.body);
    if (historique.length > 0) ancienneTache.historiqueModifications.unshift(...historique);

    const tacheModifiee = await ancienneTache.save();
    res.json({ message: "Tâche mise à jour avec historique", tache: tacheModifiee });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la modification de la tâche." });
  }
});

// ---------- COMMENTAIRES ----------

// ajouter un commentaire
router.post('/taches/:id/commentaires', async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id);
    if (!tache) return res.status(404).json({ error: "Tâche introuvable." });

    const commentaire = { auteur: req.body.auteur, contenu: req.body.contenu };
    tache.commentaires.push(commentaire);

    tache.historiqueModifications.unshift({
      champModifié: "commentaires",
      ancienneValeur: null,
      nouvelleValeur: JSON.stringify(commentaire),
      date: new Date()
    });

    await tache.save();
    res.status(201).json({ message: "Commentaire ajouté avec succès", commentaire: tache.commentaires.at(-1) });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire." });
  }
});

// modifier un commentaire
router.put('/taches/:tacheId/commentaires/:commentaireId', async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.tacheId);
    if (!tache) return res.status(404).json({ message: "Tâche non trouvée." });

    const commentaire = tache.commentaires.id(req.params.commentaireId);
    if (!commentaire) return res.status(404).json({ message: "Commentaire non trouvé." });

    tache.historiqueModifications.unshift({
      champModifié: "commentaire",
      ancienneValeur: commentaire.contenu,
      nouvelleValeur: req.body.contenu,
      date: new Date()
    });

    commentaire.contenu = req.body.contenu;
    await tache.save();
    res.json({ message: "Commentaire modifié avec succès", commentaire });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la modification du commentaire." });
  }
});

// supprimer un commentaire
router.delete('/taches/:tacheId/commentaires/:commentaireId', async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.tacheId);
    if (!tache) return res.status(404).json({ message: "Tâche non trouvée." });

    const commentaire = tache.commentaires.id(req.params.commentaireId);
    if (!commentaire) return res.status(404).json({ message: "Commentaire non trouvé." });

    tache.historiqueModifications.unshift({
      champModifié: "commentaire",
      ancienneValeur: commentaire.contenu,
      nouvelleValeur: "Commentaire supprimé",
      date: new Date()
    });

    commentaire.deleteOne();
    await tache.save();
    res.json({ message: "Commentaire supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression du commentaire." });
  }
});

// ---------- SOUS-TÂCHES ----------

// ajouter une sous-tâche
router.post('/taches/:id/sous-taches', async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id);
    if (!tache) return res.status(404).json({ message: "Tâche non trouvée" });

    tache.sousTaches.push(req.body);
    tache.historiqueModifications.unshift({
      champModifié: "sousTaches",
      ancienneValeur: null,
      nouvelleValeur: JSON.stringify(req.body),
      date: new Date()
    });

    await tache.save();
    res.status(201).json({ message: "Sous-tâche ajoutée avec succès", sousTache: tache.sousTaches.at(-1) });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout de la sous-tâche." });
  }
});

// modifier une sous-tâche
router.put('/taches/:id/sous-taches/:subId', async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id);
    if (!tache) return res.status(404).json({ message: "Tâche non trouvée" });

    const sousTache = tache.sousTaches.id(req.params.subId);
    if (!sousTache) return res.status(404).json({ message: "Sous-tâche non trouvée" });

    const ancienneSousTache = sousTache.toObject();
    const historique = [];
    for (const champ in req.body) {
      if (JSON.stringify(ancienneSousTache[champ]) !== JSON.stringify(req.body[champ])) {
        historique.push({
          champModifié: `sousTache.${champ}`,
          ancienneValeur: JSON.stringify(ancienneSousTache[champ]),
          nouvelleValeur: JSON.stringify(req.body[champ]),
          date: new Date()
        });
      }
    }

    Object.assign(sousTache, req.body);
    if (historique.length > 0) tache.historiqueModifications.unshift(...historique);

    await tache.save();
    res.json(tache);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la modification de la sous-tâche." });
  }
});

// supprimer une sous-tâche
router.delete('/taches/:id/sous-taches/:subId', async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id);
    if (!tache) return res.status(404).json({ message: "Tâche non trouvée" });

    const sousTache = tache.sousTaches.id(req.params.subId);
    if (!sousTache) return res.status(404).json({ message: "Sous-tâche non trouvée" });

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
