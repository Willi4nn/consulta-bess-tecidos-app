import {
  ArrowLeftCircle,
  BadgeDollarSign,
  Barcode,
  BookOpen,
  Globe,
  Ruler,
  Sparkle,
  Weight,
} from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

const iconMap = {
  Largura: <Ruler size={18} strokeWidth={2} />,
  Origem: <Globe size={18} strokeWidth={2} />,
  Gramatura: <Weight size={18} strokeWidth={2} />,
  Acabamento: <Sparkle size={18} strokeWidth={2} />,
  Catálogo: <BookOpen size={18} strokeWidth={2} />,
  NCM: <Barcode size={18} strokeWidth={2} />,
};

const DetailItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="detail-item">
      <span className="detail-icon" style={{ marginRight: 6 }}>
        {iconMap[label]}
      </span>
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
};

export default function FabricDetail({ fabric, onBack }) {
  return (
    <div className="fabric-detail">
      <div className="detail-top-bar">
        <button id="backBtn" className="back-btn" onClick={onBack}>
          <ArrowLeftCircle size={22} strokeWidth={2} />
          Voltar para a lista
        </button>
      </div>

      <div className="detail-content detail-card">
        <h2 className="detail-title">{fabric.Descrição || 'N/D'}</h2>
        <p className="code u-bold">Código: {fabric.Código}</p>

        <p className="price price-row">
          <BadgeDollarSign size={35} strokeWidth={2} color="#28a745" />
          {formatPrice(fabric.Preço)}
          <span className="price-unit"> / {fabric.Unidade || 'unidade'}</span>
        </p>

        <div className="details-grid">
          <DetailItem
            label="Largura"
            value={fabric.Largura ? `${fabric.Largura} m` : null}
          />
          <DetailItem label="Origem" value={fabric.Origem} />
          <DetailItem
            label="Gramatura"
            value={fabric.Gramatura ? `${fabric.Gramatura} g/ml` : null}
          />
          <DetailItem label="Acabamento" value={fabric.Acabamento} />
          <DetailItem label="Catálogo" value={fabric.Catálogo} />
          <DetailItem label="NCM" value={fabric.NCM} />
        </div>
      </div>
    </div>
  );
}
