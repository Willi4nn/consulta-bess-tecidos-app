
const SearchBar = ({ query, onQueryChange }) => {
  return (
    <div className="search-wrapper">
      <span className="search-icon">🔎</span>
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
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchBar;