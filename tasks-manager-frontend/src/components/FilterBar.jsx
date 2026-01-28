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
        <label>Rechercher...</label>
        <input
          type="text"
          placeholder="Titre ou description..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Statut</label>
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
        <label>Priorité</label>
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
        <label>Catégorie</label>
        <select
          value={filters.categorie}
          onChange={(e) => handleChange('categorie', e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes</option>
          <option value="Backend">Backend</option>
          <option value="Frontend">Frontend</option>
          <option value="Database">Database</option>
          <option value="Documentation">Documentation</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Étiquette</label>
        <input
          type="text"
          value={filters.etiquette}
          onChange={(e) => handleChange('etiquette', e.target.value)}
          className="filter-input"
          placeholder="urgent"
        />
      </div>

      <div className="filter-group">
        <label>Avant...</label>
        <input
          type="date"
          value={filters.avant}
          onChange={(e) => handleChange('avant', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Après...</label>
        <input
          type="date"
          value={filters.apres}
          onChange={(e) => handleChange('apres', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Trier par...</label>
        <select
          value={filters.tri}
          onChange={(e) => handleChange('tri', e.target.value)}
          className="filter-select"
        >
          <option value="">Aucun</option>
          <option value="echeance">Échéance</option>
          <option value="priorite">Priorité</option>
          <option value="dateCreation">Date de création</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Ordre</label>
        <select
          value={filters.ordre}
          onChange={(e) => handleChange('ordre', e.target.value)}
          className="filter-select"
        >
          <option value="asc">Ascendant</option>
          <option value="desc">Descendant</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button
          className="btn-clear-filters"
          onClick={clearFilters}
        >
          ✕ &nbsp; Effacer les filtres
        </button>
      )}
    </div>
  );
}

export default FilterBar;