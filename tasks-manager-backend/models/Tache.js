const mongoose = require('mongoose');

const tacheSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: {type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  echeance: Date,
  statut: String,
  priorite: String,
  auteur: {
    nom: String,
    prenom: String,
    email: String
  },
  categorie: String,
  etiquettes: [String],
  sousTaches: [
    {
      titre: String,
      statut: String,
      echeance: Date
    }
  ],
  commentaires: [
    {
      auteur: String,
      date: { type: Date, default: Date.now },      
      contenu: String
    }
  ],
  historiqueModifications: [
    {
      champModifié: String,
      ancienneValeur: String,
      nouvelleValeur: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Tache', tacheSchema);
