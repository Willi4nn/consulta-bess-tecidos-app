import { Search, XCircle } from 'lucide-react';

const SearchBar = ({ query, onQueryChange }) => {
  return (
    <form className="search-wrapper" role="search" autoComplete="off" onSubmit={e => e.preventDefault()}>
      <div style={{ position: 'relative', width: '100%' }}>
        <span
          className="search-icon"
          style={{
            position: 'absolute',
            left: 15,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.5
          }}
        >
          <Search size={20} strokeWidth={2} />
        </span>
        <input
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Buscar por código ou descrição..."
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          style={{ paddingLeft: 40 }}
          autoCorrect="off"
          autoCapitalize="none"
        />
        {query && (
          <button
            id="clearSearchBtn"
            className="clear-search-btn"
            title="Limpar busca"
            type="button"
            onClick={() => onQueryChange('')}
            style={{
              position: 'absolute',
              right: 15,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <XCircle size={22} strokeWidth={2} color="#888" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;