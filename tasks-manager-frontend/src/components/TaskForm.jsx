import { useState } from 'react';
import './TaskForm.css';

const API_URL = import.meta.env.VITE_API_URL;

function TaskForm({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    titre: initialData?.titre || '',
    description: initialData?.description || '',
    statut: initialData?.statut || 'À faire',
    priorite: initialData?.priorite || 'Moyenne',
    categorie: initialData?.categorie || '',
    echeance: initialData?.echeance?.slice(0, 10) || '',
    etiquettes: initialData?.etiquettes?.join(', ') || '',
    auteur: {
      prenom: initialData?.auteur?.prenom || '',
      nom: initialData?.auteur?.nom || ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'prenom' || name === 'nom') {
      setFormData(prev => ({
        ...prev,
        auteur: {
          ...prev.auteur,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    const requiredFields = {
      titre: 'Le titre est requis',
      description: 'La description est requise',
      'auteur.prenom': 'Votre prénom est requis',
      'auteur.nom': 'Votre nom est requis'
    };

    for (const field in requiredFields) {
      let value;

      if (field.startsWith('auteur.')) {
        const key = field.split('.')[1];
        value = formData.auteur[key];
      } else {
        value = formData[field];
      }

      if (!value?.trim()) {
        alert(requiredFields[field]);
        return;
      }
    }

    const taskData = {
      ...formData,
      etiquettes: formData.etiquettes
        ? formData.etiquettes.split(',').map(t => t.trim()).filter(Boolean)
        : []
    };

    try {
      if (initialData?._id) {
        // edits existing task
        await fetch(`${API_URL}/taches/${initialData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
      } else {
        // creates new task
        await fetch(`${API_URL}/nouvelletache`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde :', err);
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <div className="form-header">
          <h2>{initialData?._id ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="task-form">
          <div className="form-group">
            <label>Votre prénom *</label>
            <input
              name="prenom"
              value={formData.auteur.prenom}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Votre nom *</label>
            <input
              name="nom"
              value={formData.auteur.nom}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="titre">Titre *</label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
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
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Database">Database</option>
                <option value="Documentation">Documentation</option>
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
              placeholder="Ex: api, bug, tests"
            />
            <small>Séparez les étiquettes par des virgules</small>
          </div>

          <div className="form-actions">
            <button onClick={onClose} className="btn-secondary">Annuler</button>
            <button onClick={handleSubmit} className="btn-primary">
              {initialData?._id ? 'Mettre à jour' : 'Créer la tâche'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskForm;
