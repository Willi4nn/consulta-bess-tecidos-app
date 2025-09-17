const formatPrice = (price) => {
  if (price === null || isNaN(price)) return 'N/D';
  return Number(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const FabricListItem = ({ fabric, onSelect }) => (
  <div className="fabric-list-item" onClick={() => onSelect(fabric)}>
    <div className="fabric-desc">{fabric?.Descrição || 'N/D'}</div>
    <div className="fabric-code">{fabric?.Código}</div>
    <div className="fabric-price">{formatPrice(fabric?.Preço)}</div>
  </div>
);

const FabricList = ({ fabrics, onSelectFabric }) => {
  if (fabrics.length === 0) {
    return (
      <div className="not-found">
        <p>Nenhum item encontrado para sua busca.</p>
      </div>
    );
  }

  return (
    <div className="fabric-list">
      <div className="fabric-list-header">
        <div>Descrição</div>
        <div>Código</div>
        <div>Preço</div>
      </div>
      {fabrics.map((fabric, index) => (
        <FabricListItem
          key={`${fabric.Código}-${index}`}
          fabric={fabric}
          onSelect={onSelectFabric}
        />
      ))}
    </div>
  );
};

export default FabricList;