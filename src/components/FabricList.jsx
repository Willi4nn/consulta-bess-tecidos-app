import { Package } from 'lucide-react';
import PropTypes from 'prop-types';
import { memo } from 'react';
import './FabricList.css';
import FabricListItem from './FabricListItem';

function FabricList({ fabrics, onSelectFabric }) {
  const total = fabrics.length;
  const resultLabel = total === 1 ? 'tecido encontrado' : 'tecidos encontrados';

  if (total === 0) {
    return (
      <div className="not-found">
        <p>Nenhum item encontrado para sua busca.</p>
      </div>
    );
  }

  return (
    <>
      <div className="results-count" role="status" aria-live="polite">
        <Package size={16} aria-hidden="true" />
        <span>
          <strong>{total}</strong> {resultLabel}
        </span>
      </div>
      <div className="fabric-list">
        {fabrics.map((fabric, index) => (
          <FabricListItem
            key={`${fabric.Código}-${index}`}
            fabric={fabric}
            onSelect={onSelectFabric}
          />
        ))}
      </div>
    </>
  );
}

FabricList.propTypes = {
  fabrics: PropTypes.arrayOf(
    PropTypes.shape({
      Código: PropTypes.string,
      Descrição: PropTypes.string,
      Preço: PropTypes.number,
    })
  ).isRequired,
  onSelectFabric: PropTypes.func.isRequired,
};

export default memo(FabricList);
