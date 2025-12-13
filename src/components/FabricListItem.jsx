import PropTypes from 'prop-types';
import { memo } from 'react';
import { formatPrice } from '../utils/formatPrice';

const ACTIVATION_KEYS = new Set(['Enter', ' ']);

function FabricListItem({ fabric, onSelect }) {
  const { Descrição = 'N/D', Código, Preço } = fabric;
  const triggerSelect = () => onSelect(fabric);
  const handleKeyDown = (event) => {
    if (!ACTIVATION_KEYS.has(event.key)) return;
    event.preventDefault();
    triggerSelect();
  };

  return (
    <div
      className="fabric-list-item"
      onClick={triggerSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${Descrição || 'tecido'}, código ${Código}`}
    >
      <div className="fabric-desc">{Descrição}</div>
      <div className="fabric-code">{Código}</div>
      <div className="fabric-price">{formatPrice(Preço)}</div>
    </div>
  );
}

FabricListItem.propTypes = {
  fabric: PropTypes.shape({
    Código: PropTypes.string,
    Descrição: PropTypes.string,
    Preço: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default memo(FabricListItem);
