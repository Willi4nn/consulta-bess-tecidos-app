import { formatPrice } from "../utils/formatPrice";

export default function FabricListItem({ fabric, onSelect }) {
  return (
    <div
      className="fabric-list-item"
      onClick={() => onSelect(fabric)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(fabric);
        }
      }}

    >
      <div className="fabric-desc u-bold">{fabric?.Descrição || 'N/D'}</div>
      <div className="fabric-code u-bold">{fabric?.Código}</div>
      <div className="fabric-price u-bold">{formatPrice(fabric?.Preço)}</div>
    </div>
  )
} 
