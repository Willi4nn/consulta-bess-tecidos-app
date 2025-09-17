import { ArrowLeftCircle, BadgeDollarSign, Barcode, BookOpen, Globe, Ruler, Sparkle, Weight } from 'lucide-react';

const formatPrice = (price) => {
  if (price === null || isNaN(price)) return 'N/D';
  return Number(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const iconMap = {
  'Largura': <Ruler size={18} strokeWidth={2} style={{ marginRight: 6 }} />,
  'Origem': <Globe size={18} strokeWidth={2} style={{ marginRight: 6 }} />,
  'Gramatura': <Weight size={18} strokeWidth={2} style={{ marginRight: 6 }} />,
  'Acabamento': <Sparkle size={18} strokeWidth={2} style={{ marginRight: 6 }} />,
  'Catálogo': <BookOpen size={18} strokeWidth={2} style={{ marginRight: 6 }} />,
  'NCM': <Barcode size={18} strokeWidth={2} style={{ marginRight: 6 }} />,
};

const DetailItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="detail-icon">{iconMap[label]}</span>
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
};

const FabricDetail = ({ fabric, onBack }) => {
  return (
    <div className="fabric-detail">
      <div className="detail-top-bar">
        <button
          id="backBtn"
          className="back-btn"
          onClick={onBack}
          style={{
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            background: '#005774ff',
            color: '#fff'
          }}
        >
          <ArrowLeftCircle size={22} strokeWidth={2} style={{ marginRight: 4 }} />
          Voltar para a lista
        </button>
      </div>

      <div
        className="detail-content"
        style={{
          background: '#f4f4f9',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
          padding: '2rem 1rem',
          marginTop: 0
        }}
      >
        <h2 style={{ marginBottom: 8 }}>{fabric.Descrição || 'N/D'}</h2>
        <p className="code" style={{ marginBottom: 16, fontWeight: 'bold', fontSize: '1.1rem' }}>Código: {fabric.Código}</p>

        <p className="price" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <BadgeDollarSign size={28} strokeWidth={2} color="#28a745" style={{ marginRight: 4 }} />
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
    </div>
  );
};

export default FabricDetail;