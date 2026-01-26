import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SousTaches from '../components/SousTaches';
import Commentaires from '../components/Commentaires';
import './TaskDetails.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tache, setTache] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchTache();
  }, [id]);

  const fetchTache = async () => {
    try {
      const res = await fetch(`${API_URL}/tache/${id}`);
      const data = await res.json();
      setTache(data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur:', err);
      setLoading(false);
    }
  };

  const getPriorityColor = (priorite) => {
    switch (priorite?.toLowerCase()) {
      case 'haute': return '#ef4444';
      case 'moyenne': return '#f59e0b';
      case 'basse': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!tache) {
    return (
      <div className="error-container">
        <h2>❌ Tâche introuvable</h2>
        <button onClick={() => navigate('/')} className="btn-back">
          ← Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="task-details-container">
      <button onClick={() => navigate('/')} className="btn-back">
        ← Retour à la liste
      </button>

      <div className="task-details-header">
        <div className="title-section">
          <h1>{tache.titre}</h1>
          {tache.priorite && (
            <span
              className="priority-badge-large"
              style={{ backgroundColor: getPriorityColor(tache.priorite) }}
            >
              {tache.priorite}
            </span>
          )}
        </div>

        <div className="metadata-grid">
          <div className="metadata-item">
            <span className="metadata-label">📊 Statut</span>
            <span className="metadata-value">{tache.statut}</span>
          </div>

          {tache.categorie && (
            <div className="metadata-item">
              <span className="metadata-label">📁 Catégorie</span>
              <span className="metadata-value">{tache.categorie}</span>
            </div>
          )}

          <div className="metadata-item">
            <span className="metadata-label">📅 Échéance</span>
            <span className="metadata-value">
              {tache.echeance ? formatDate(tache.echeance) : 'Non définie'}
            </span>
          </div>

          <div className="metadata-item">
            <span className="metadata-label">🕐 Créé le</span>
            <span className="metadata-value">{formatDate(tache.dateCreation)}</span>
          </div>
        </div>

        {tache.description && (
          <div className="description-section">
            <h3>📝 Description</h3>
            <p>{tache.description}</p>
          </div>
        )}

        {tache.etiquettes && tache.etiquettes.length > 0 && (
          <div className="tags-section">
            <h3>🏷️ Étiquettes</h3>
            <div className="tags-list">
              {tache.etiquettes.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {tache.auteur && (
          <div className="author-section">
            <h3>👤 Auteur</h3>
            <p>
              {tache.auteur.prenom} {tache.auteur.nom}
              {tache.auteur.email && ` (${tache.auteur.email})`}
            </p>
          </div>
        )}
      </div>

      <SousTaches tache={tache} setTache={setTache} />
      <Commentaires tache={tache} setTache={setTache} />

      {tache.historiqueModifications && tache.historiqueModifications.length > 0 && (
        <div className="history-section">
          <button 
            className="history-toggle"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '▼' : '▶'} Historique des modifications ({tache.historiqueModifications.length})
          </button>

          {showHistory && (
            <div className="history-list">
              {tache.historiqueModifications.map((hist, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-date">{formatDate(hist.date)}</div>
                  <div className="history-change">
                    <strong>{hist.champModifié}</strong>
                    <div className="history-values">
                      <span className="old-value">{hist.ancienneValeur}</span>
                      <span className="arrow">→</span>
                      <span className="new-value">{hist.nouvelleValeur}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}