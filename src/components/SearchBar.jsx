import { Search, XCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { memo, useRef } from 'react';
import './SearchBar.css';

function SearchBar({ query, onQueryChange }) {
  const inputRef = useRef(null);

  const focusInput = () => inputRef.current?.focus();
  const handleChange = ({ target }) => onQueryChange(target.value);
  const clearQuery = () => onQueryChange('');

  return (
    <form
      className="search-wrapper"
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="search-inner">
        <span className="search-icon" aria-hidden="true">
          <Search size={20} strokeWidth={2} />
        </span>
        <input
          ref={inputRef}
          type="text"
          id="searchInput"
          className="search-input"
          placeholder="Buscar por código ou descrição..."
          aria-label="Buscar tecidos por código ou descrição"
          value={query}
          onChange={handleChange}
          onTouchStart={focusInput}
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
        />
        {query && (
          <button
            id="clearSearchBtn"
            className="clear-search-btn"
            title="Limpar busca"
            type="button"
            onClick={clearQuery}
          >
            <XCircle size={22} strokeWidth={2} />
          </button>
        )}
      </div>
    </form>
  );
}

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
};

export default memo(SearchBar);
