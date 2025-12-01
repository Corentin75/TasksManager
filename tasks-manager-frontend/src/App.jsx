import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import './App.css';

function App() {
  const [taches, setTaches] = useState([]);
  const [filteredTaches, setFilteredTaches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    statut: '',
    priorite: '',
    categorie: '',
    search: ''
  });

  useEffect(() => {
    fetchTaches();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [taches, filters]);

  const fetchTaches = async () => {
    try {
      const response = await fetch('http://localhost:3000/taches');
      const data = await response.json();
      setTaches(data);
    } catch (err) {
      console.error('Erreur API :', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...taches];

    if (filters.statut) {
      filtered = filtered.filter(t => t.statut === filters.statut);
    }
    if (filters.priorite) {
      filtered = filtered.filter(t => t.priorite === filters.priorite);
    }
    if (filters.categorie) {
      filtered = filtered.filter(t => t.categorie === filters.categorie);
    }
    if (filters.search) {
      filtered = filtered.filter(t => 
        t.titre?.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTaches(filtered);
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`http://localhost:3000/tache/${id}/delete`, {
        method: 'POST'
      });
      fetchTaches();
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📋 Gestionnaire de Tâches</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Fermer' : '+ Nouvelle Tâche'}
        </button>
      </header>

      {showForm && (
        <TaskForm 
          onClose={() => setShowForm(false)}
          onSave={fetchTaches}
        />
      )}

      <FilterBar 
        filters={filters}
        onFilterChange={setFilters}
      />

      <TaskList 
        taches={filteredTaches}
        onDelete={handleDeleteTask}
        onEdit={(id) => console.log('Edit task:', id)}
      />
    </div>
  );
}

export default App;