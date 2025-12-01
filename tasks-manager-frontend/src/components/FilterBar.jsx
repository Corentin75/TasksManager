import './FilterBar.css';

function FilterBar({ filters, onFilterChange }) {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      statut: '',
      priorite: '',
      categorie: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>🔍 Rechercher</label>
        <input
          type="text"
          placeholder="Titre ou description..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>📊 Statut</label>
        <select
          value={filters.statut}
          onChange={(e) => handleChange('statut', e.target.value)}
          className="filter-select"
        >
          <option value="">Tous</option>
          <option value="À faire">À faire</option>
          <option value="En cours">En cours</option>
          <option value="Terminée">Terminée</option>
        </select>
      </div>

      <div className="filter-group">
        <label>⚡ Priorité</label>
        <select
          value={filters.priorite}
          onChange={(e) => handleChange('priorite', e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes</option>
          <option value="Haute">Haute</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Basse">Basse</option>
        </select>
      </div>

      <div className="filter-group">
        <label>📁 Catégorie</label>
        <select
          value={filters.categorie}
          onChange={(e) => handleChange('categorie', e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes</option>
          <option value="Travail">Travail</option>
          <option value="Personnel">Personnel</option>
          <option value="Urgent">Urgent</option>
          <option value="Projet">Projet</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button 
          className="btn-clear-filters"
          onClick={clearFilters}
        >
          ✕ Effacer les filtres
        </button>
      )}
    </div>
  );
}

export default FilterBar;