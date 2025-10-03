import { Search, XCircle } from 'lucide-react';
import { useRef } from 'react';

const SearchBar = ({ query, onQueryChange }) => {
  const inputRef = useRef(null);

  const handleTouchStart = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form className="search-wrapper" autoComplete="off" onSubmit={e => e.preventDefault()}>
      <div className="search-inner" style={{ position: 'relative', width: '100%' }}>
        <span className="search-icon">
          <Search size={20} strokeWidth={2} />
        </span>
        <input
          ref={inputRef}
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Buscar por código ou descrição..."
          aria-label="Buscar por código ou descrição"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          onTouchStart={handleTouchStart}
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
          >
            <XCircle size={22} strokeWidth={2} />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;