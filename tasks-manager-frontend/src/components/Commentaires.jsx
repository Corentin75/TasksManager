import { useState } from 'react';
import './Commentaires.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Commentaires({ tache, setTache }) {
  const [newComment, setNewComment] = useState({ auteur: '', contenu: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const ajouterCommentaire = async () => {
    if (!newComment.auteur.trim() || !newComment.contenu.trim()) {
      alert('L\'auteur et le contenu sont requis');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/taches/${tache._id}/commentaires`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
      });

      if (!res.ok) throw new Error('Erreur lors de l\'ajout');

      const updatedRes = await fetch(`${API_URL}/tache/${tache._id}`);
      const updatedTache = await updatedRes.json();
      setTache(updatedTache);

      setNewComment({ auteur: '', contenu: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'ajout du commentaire');
    }
  };

  const modifierCommentaire = async (commentaireId) => {
    if (!editContent.trim()) {
      alert('Le contenu ne peut pas être vide');
      return;
    }

    try {
      await fetch(`${API_URL}/taches/${tache._id}/commentaires/${commentaireId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenu: editContent })
      });

      const updatedRes = await fetch(`${API_URL}/tache/${tache._id}`);
      const updatedTache = await updatedRes.json();
      setTache(updatedTache);

      setEditingId(null);
      setEditContent('');
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const supprimerCommentaire = async (commentaireId) => {
    if (!confirm('Supprimer ce commentaire ?')) return;

    try {
      await fetch(`${API_URL}/taches/${tache._id}/commentaires/${commentaireId}`, {
        method: 'DELETE'
      });

      const updatedRes = await fetch(`${API_URL}/tache/${tache._id}`);
      const updatedTache = await updatedRes.json();
      setTache(updatedTache);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="commentaires-section">
      <div className="section-header">
        <h2>💬 Commentaires</h2>
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
            placeholder="Votre nom..."
            value={newComment.auteur}
            onChange={(e) => setNewComment({ ...newComment, auteur: e.target.value })}
            className="form-input"
          />
          <textarea
            placeholder="Votre commentaire..."
            value={newComment.contenu}
            onChange={(e) => setNewComment({ ...newComment, contenu: e.target.value })}
            rows="3"
            className="form-textarea"
          />
          <div className="form-actions">
            <button onClick={ajouterCommentaire} className="btn-save">
              ✓ Publier
            </button>
            <button onClick={() => setShowForm(false)} className="btn-cancel">
              Annuler
            </button>
          </div>
        </div>
      )}

      {tache.commentaires && tache.commentaires.length > 0 ? (
        <div className="commentaires-list">
          {tache.commentaires.map(comment => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <span className="author-name">{comment.auteur}</span>
                  <span className="comment-date">{formatDate(comment.date)}</span>
                </div>
                <div className="comment-actions">
                  <button
                    onClick={() => {
                      setEditingId(comment._id);
                      setEditContent(comment.contenu);
                    }}
                    className="btn-edit"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => supprimerCommentaire(comment._id)}
                    className="btn-delete"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {editingId === comment._id ? (
                <div className="edit-form">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="3"
                    className="form-textarea"
                  />
                  <div className="form-actions">
                    <button
                      onClick={() => modifierCommentaire(comment._id)}
                      className="btn-save"
                    >
                      ✓ Sauvegarder
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      className="btn-cancel"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <p className="comment-content">{comment.contenu}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">Aucun commentaire pour le moment</p>
      )}
    </div>
  );
}