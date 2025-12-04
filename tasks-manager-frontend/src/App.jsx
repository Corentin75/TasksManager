import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import './App.css';

// Configuration de l'API URL depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL;

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
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    fetchTaches();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [taches, filters]);

  const fetchTaches = async () => {
    try {
      const response = await fetch(`${API_URL}/taches`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
      const response = await fetch(`${API_URL}/tache/${id}/delete`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
          onClose={() => {
            setShowForm(false);
            setTaskToEdit(null); // reset
          }}
          onSave={fetchTaches}
          apiUrl={API_URL}
          initialData={taskToEdit}       // 🔥 important
        />
      )}


      <FilterBar 
        filters={filters}
        onFilterChange={setFilters}
      />

      <TaskList 
        taches={filteredTaches}
        onDelete={handleDeleteTask}
        onEdit={(task) => {
          setTaskToEdit(task);
          setShowForm(true);
        }}
      />

    </div>
  );
}

export default App;