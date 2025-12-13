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
import PropTypes from 'prop-types';
import { memo } from 'react';
import { formatPrice } from '../utils/formatPrice';
import './FabricDetail.css';

const iconMap = {
  Largura: <Ruler size={18} strokeWidth={2} />,
  Origem: <Globe size={18} strokeWidth={2} />,
  Gramatura: <Weight size={18} strokeWidth={2} />,
  Acabamento: <Sparkle size={18} strokeWidth={2} />,
  Catálogo: <BookOpen size={18} strokeWidth={2} />,
  NCM: <Barcode size={18} strokeWidth={2} />,
};

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-icon" aria-hidden="true">
      {iconMap[label]}
    </span>
    <strong>{label}:</strong>
    <span>{value}</span>
  </div>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function FabricDetail({ fabric, onBack }) {
  const {
    Descrição = 'N/D',
    Código,
    Preço,
    Unidade,
    Largura,
    Origem,
    Gramatura,
    Acabamento,
    Catálogo,
    NCM,
  } = fabric;
  const detailFields = [
    { label: 'Largura', value: Largura && `${Largura} m` },
    { label: 'Origem', value: Origem },
    { label: 'Gramatura', value: Gramatura && `${Gramatura} g/ml` },
    { label: 'Acabamento', value: Acabamento },
    { label: 'Catálogo', value: Catálogo },
    { label: 'NCM', value: NCM },
  ].filter(({ value }) => Boolean(value));

  return (
    <div className="fabric-detail">
      <div className="detail-top-bar">
        <button
          className="btn btn-primary back-btn"
          onClick={onBack}
          aria-label="Voltar para lista de tecidos"
        >
          <ArrowLeftCircle size={20} aria-hidden="true" />
          Voltar
        </button>
      </div>

      <div className="detail-card">
        <h2 className="detail-title">{Descrição}</h2>
        <p className="code">Código: {Código}</p>

        <div
          className="price"
          aria-label={`Preço: ${formatPrice(Preço)} por ${
            Unidade || 'unidade'
          }`}
        >
          <BadgeDollarSign size={32} aria-hidden="true" />
          {formatPrice(Preço)}
          <span className="price-unit">/ {Unidade || 'un'}</span>
        </div>

        <div className="details-grid">
          {detailFields.map(({ label, value }) => (
            <DetailItem key={label} label={label} value={value} />
          ))}
        </div>
      </div>
    </div>
  );
}

FabricDetail.propTypes = {
  fabric: PropTypes.shape({
    Código: PropTypes.string,
    Descrição: PropTypes.string,
    Preço: PropTypes.number,
    Unidade: PropTypes.string,
    Largura: PropTypes.string,
    Origem: PropTypes.string,
    Gramatura: PropTypes.number,
    Acabamento: PropTypes.string,
    Catálogo: PropTypes.string,
    NCM: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

export default memo(FabricDetail);
