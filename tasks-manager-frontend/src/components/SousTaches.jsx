import { useState } from 'react';
import './SousTaches.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function SousTaches({ tache, setTache }) {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [showForm, setShowForm] = useState(false);

  const ajouterSousTache = async () => {
    if (!newSubTaskTitle.trim()) {
      alert('Le titre est requis');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/taches/${tache._id}/sous-taches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          titre: newSubTaskTitle, 
          statut: 'À faire' 
        })
      });

      if (!res.ok) throw new Error('Erreur lors de l\'ajout');

      // Recharger la tâche complète
      const updatedRes = await fetch(`${API_URL}/tache/${tache._id}`);
      const updatedTache = await updatedRes.json();
      setTache(updatedTache);
      
      setNewSubTaskTitle('');
      setShowForm(false);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'ajout de la sous-tâche');
    }
  };

  const toggleSousTacheStatut = async (sousTacheId, currentStatut) => {
    const newStatut = currentStatut === 'Terminée' ? 'À faire' : 'Terminée';
    
    try {
      await fetch(`${API_URL}/taches/${tache._id}/sous-taches/${sousTacheId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatut })
      });

      const updatedRes = await fetch(`${API_URL}/tache/${tache._id}`);
      const updatedTache = await updatedRes.json();
      setTache(updatedTache);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const supprimerSousTache = async (sousTacheId) => {
    if (!confirm('Supprimer cette sous-tâche ?')) return;

    try {
      await fetch(`${API_URL}/taches/${tache._id}/sous-taches/${sousTacheId}`, {
        method: 'DELETE'
      });

      const updatedRes = await fetch(`${API_URL}/tache/${tache._id}`);
      const updatedTache = await updatedRes.json();
      setTache(updatedTache);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <div className="sous-taches-section">
      <div className="section-header">
        <h2>📝 Sous-tâches</h2>
        <button 
          className="btn-add"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕' : '+ Ajouter'}
        </button>
      </div>

      {showForm && (
        <div className="add-form">
          <input
            type="text"
            placeholder="Titre de la sous-tâche..."
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && ajouterSousTache()}
            className="form-input"
          />
          <div className="form-actions">
            <button onClick={ajouterSousTache} className="btn-save">
              ✓ Ajouter
            </button>
            <button onClick={() => setShowForm(false)} className="btn-cancel">
              Annuler
            </button>
          </div>
        </div>
      )}

      {tache.sousTaches && tache.sousTaches.length > 0 ? (
        <ul className="sous-taches-list">
          {tache.sousTaches.map(st => (
            <li key={st._id} className="sous-tache-item">
              <div className="sous-tache-content">
                <input
                  type="checkbox"
                  checked={st.statut === 'Terminée'}
                  onChange={() => toggleSousTacheStatut(st._id, st.statut)}
                  className="checkbox"
                />
                <span className={st.statut === 'Terminée' ? 'completed' : ''}>
                  {st.titre}
                </span>
                <span className="statut-badge">{st.statut}</span>
              </div>
              <button
                onClick={() => supprimerSousTache(st._id)}
                className="btn-delete"
                title="Supprimer"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-message">Aucune sous-tâche pour le moment</p>
      )}
    </div>
  );
}