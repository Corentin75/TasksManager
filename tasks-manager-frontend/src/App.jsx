import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskDetails from './components/TaskDetails';
import './App.css';

// configuration de l'API URL depuis les variables d'env
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [taches, setTaches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    statut: '',
    priorite: '',
    categorie: '',
    etiquette: '',
    avant: '',
    apres: '',
    search: '',
    tri: '',
    ordre: 'asc'
  });
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    fetchTaches();
  }, []);

  useEffect(() => {
    fetchTaches();
  }, [filters]);

  const fetchTaches = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.statut) params.append('statut', filters.statut);
      if (filters.priorite) params.append('priorite', filters.priorite);
      if (filters.categorie) params.append('categorie', filters.categorie);
      if (filters.etiquette) params.append('etiquette', filters.etiquette);
      if (filters.avant) params.append('avant', filters.avant);
      if (filters.apres) params.append('apres', filters.apres);
      if (filters.search) params.append('q', filters.search);
      if (filters.tri) params.append('tri', filters.tri);
      if (filters.ordre) params.append('ordre', filters.ordre);

      const response = await fetch(`${API_URL}/taches?${params.toString()}`);
      const data = await response.json();
      setTaches(data);
    } catch (err) {
      console.error('Erreur API :', err);
    }
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
        <h1>Gestionnaire de tâches</h1>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {'+ Nouvelle tâche'}
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
          initialData={taskToEdit}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <FilterBar filters={filters} onFilterChange={setFilters} />
              <TaskList
                taches={taches}
                onDelete={handleDeleteTask}
                onEdit={(task) => {
                  setTaskToEdit(task);
                  setShowForm(true);
                }}
              />
            </>
          }
        />
        <Route path="/taches/:id" element={<TaskDetails />} />
      </Routes>
    </div>
  );
}

export default App;