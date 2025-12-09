import FabricListItem from './FabricListItem';

export default function FabricList({ fabrics, onSelectFabric }) {
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
}
