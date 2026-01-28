import TaskCard from './TaskCard';
import './TaskList.css';

function TaskList({ taches, onDelete, onEdit }) {
  if (taches.length === 0) {
    return (
      <div className="empty-state">
        <h1>{":("}</h1><br></br><br></br>
        <h3>Aucune tâche trouvée</h3>
        <p>Créez une nouvelle tâche ou ajustez vos filtres</p>
      </div>
    );
  }

  const groupedByStatus = taches.reduce((acc, tache) => {
    const status = tache.statut || 'À faire';
    if (!acc[status]) acc[status] = [];
    acc[status].push(tache);
    return acc;
  }, {});

  return (
    <div className="task-list-container">
      {Object.entries(groupedByStatus).map(([statut, tasks]) => (
        <div key={statut} className="status-column">
          <div className="status-header">
            <h2>{statut}</h2>
            <span className="task-count">{tasks.length}</span>
          </div>
          <div className="tasks-grid">
            {tasks.map(tache => (
              <TaskCard
                key={tache._id}
                tache={tache}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;