const formatPrice = (price) => {
  if (price === null || isNaN(price)) return 'N/D';
  return Number(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const DetailItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="detail-item">
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
};

const FabricDetail = ({ fabric, onBack }) => {
  return (
    <div className="fabric-detail">
      <button id="backBtn" className="back-btn" onClick={onBack}>
        ⬅️ Voltar para a lista
      </button>

      <h2>{fabric.Descrição || 'N/D'}</h2>
      <p className="code">Código: {fabric.Código}</p>

      <p className="price">
        {formatPrice(fabric.Preço)}
        <span className="price-unit"> / {fabric.Unidade || 'unidade'}</span>
      </p>

      <div className="details-grid">
        <DetailItem label="Largura" value={fabric.Largura ? `${fabric.Largura} m` : null} />
        <DetailItem label="Origem" value={fabric.Origem} />
        <DetailItem label="Gramatura" value={fabric.Gramatura ? `${fabric.Gramatura} g/ml` : null} />
        <DetailItem label="Acabamento" value={fabric.Acabamento} />
        <DetailItem label="Catálogo" value={fabric.Catálogo} />
        <DetailItem label="NCM" value={fabric.NCM} />
      </div>
    </div>
  );
};

export default FabricDetail;