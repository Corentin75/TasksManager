import { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    statut: 'À faire',
    priorite: 'Moyenne',
    categorie: '',
    echeance: '',
    etiquettes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.titre) {
      alert('Le titre est requis');
      return;
    }
    
    const taskData = {
      ...formData,
      etiquettes: formData.etiquettes 
        ? formData.etiquettes.split(',').map(t => t.trim()).filter(Boolean)
        : []
    };

    try {
      await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      onSave();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la création :', err);
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <div className="form-header">
          <h2>✨ Nouvelle Tâche</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="task-form">
          <div className="form-group">
            <label htmlFor="titre">Titre *</label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Ex: Finaliser le rapport"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Détails de la tâche..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="statut">Statut</label>
              <select
                id="statut"
                name="statut"
                value={formData.statut}
                onChange={handleChange}
              >
                <option value="À faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminée">Terminée</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priorite">Priorité</label>
              <select
                id="priorite"
                name="priorite"
                value={formData.priorite}
                onChange={handleChange}
              >
                <option value="Basse">Basse</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Haute">Haute</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categorie">Catégorie</label>
              <select
                id="categorie"
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
              >
                <option value="">Sélectionner...</option>
                <option value="Travail">Travail</option>
                <option value="Personnel">Personnel</option>
                <option value="Urgent">Urgent</option>
                <option value="Projet">Projet</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="echeance">Échéance</label>
              <input
                type="date"
                id="echeance"
                name="echeance"
                value={formData.echeance}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="etiquettes">Étiquettes</label>
            <input
              type="text"
              id="etiquettes"
              name="etiquettes"
              value={formData.etiquettes}
              onChange={handleChange}
              placeholder="Ex: frontend, urgent, important (séparées par des virgules)"
            />
            <small>Séparez les étiquettes par des virgules</small>
          </div>

          <div className="form-actions">
            <button onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button onClick={handleSubmit} className="btn-primary">
              ✓ Créer la tâche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;