import { Search, XCircle } from 'lucide-react';

const SearchBar = ({ query, onQueryChange }) => {
  return (
    <div className="search-wrapper">
      <span className="search-icon">
        <Search size={20} strokeWidth={2} />
      </span>
      <input
        type="text"
        id="searchInput"
        className="search-input"
        placeholder="Buscar por código ou descrição..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      {query && (
        <button
          id="clearSearchBtn"
          className="clear-search-btn"
          title="Limpar busca"
          onClick={() => onQueryChange('')}
          style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0 }}
        >
          <XCircle size={22} strokeWidth={2} color="#888" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;