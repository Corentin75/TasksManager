import { useState } from 'react';
import './TaskCard.css';

function TaskCard({ tache, onDelete, onEdit }) {
  const [showDetails, setShowDetails] = useState(false);

  const getPriorityColor = (priorite) => {
    switch (priorite?.toLowerCase()) {
      case 'haute': return '#ef4444';
      case 'moyenne': return '#f59e0b';
      case 'basse': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <div className="task-title-row">
          <h3 className="task-title">{tache.titre}</h3>
          {tache.priorite && (
            <span 
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(tache.priorite) }}
            >
              {tache.priorite}
            </span>
          )}
        </div>
        <div className="task-actions">
          <button 
            className="btn-icon"
            onClick={() => onEdit(tache)}
            title="Modifier"
          >
            ✏️
          </button>
          <button 
            className="btn-icon btn-danger"
            onClick={() => onDelete(tache._id)}
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="task-description">{tache.description}</p>

      {tache.categorie && (
        <div className="task-category">
          <span className="category-tag">📁 {tache.categorie}</span>
        </div>
      )}

      {tache.echeance && (
        <div className="task-deadline">
          <span className="deadline-text">
            📅 {formatDate(tache.echeance)}
          </span>
        </div>
      )}

      {tache.etiquettes && tache.etiquettes.length > 0 && (
        <div className="task-tags">
          {tache.etiquettes.map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {tache.sousTaches && tache.sousTaches.length > 0 && (
        <div className="subtasks-section">
          <button 
            className="subtasks-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '▼' : '▶'} Sous-tâches ({tache.sousTaches.length})
          </button>
          {showDetails && (
            <ul className="subtasks-list">
              {tache.sousTaches.map((st, idx) => (
                <li key={idx} className="subtask-item">
                  <input type="checkbox" checked={st.terminee} readOnly />
                  <span className={st.terminee ? 'completed' : ''}>
                    {st.titre}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tache.commentaires && tache.commentaires.length > 0 && (
        <div className="comments-count">
          💬 {tache.commentaires.length} commentaire{tache.commentaires.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default TaskCard;