import {
  ArrowLeftCircle,
  Barcode,
  BookOpen,
  Globe,
  Ruler,
  Sparkle,
  Weight,
} from 'lucide-react';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
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

  const preçoLiquido = Preço * 0.70 * 0.95;

  const [metros, setMetros] = useState(1);

  const metrosNum = parseFloat(metros) || 0;
  const totalCliente = Preço * metrosNum;
  const totalMeuCusto = preçoLiquido * metrosNum;

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

        {/* ── Hero: Preço para o Cliente ── */}
        <div className="hero-cliente">
          <span className="hero-cliente-label">Preço para o Cliente</span>
          <div className="hero-cliente-valor">
            {formatPrice(Preço)}
            <em>/ {Unidade || 'MET'}</em>
          </div>
        </div>

        {/* ── Calculadora ── */}
        <div className="calculator-section">
          <h3 className="calculator-title">
            <Ruler size={18} aria-hidden="true" />
            Quantos metros o cliente quer?
          </h3>
          <div className="calculator-input-row">
            <input
              id="metros-input"
              type="number"
              min="0.5"
              step="0.5"
              value={metros}
              onChange={(e) => setMetros(e.target.value)}
              className="calculator-input"
              aria-label="Quantidade de metros"
            />
            <span className="calculator-input-unit">metros</span>
          </div>

          {metrosNum > 0 && (
            <div className="calculator-results">
              <div className="calc-result-primary">
                <span className="calc-result-primary-label">
                  Cliente paga ({metrosNum}m)
                </span>
                <span className="calc-result-primary-value">
                  {formatPrice(totalCliente)}
                </span>
              </div>
              <div className="calc-result-secondary">
                <span>Meu custo ({metrosNum}m)</span>
                <span>{formatPrice(totalMeuCusto)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Meu Custo (secundário) ── */}
        <details className="meu-custo-details">
          <summary>Ver meu custo por metro</summary>
          <div className="meu-custo-body">
            <div className="meu-custo-row">
              <span>Preço (×0,70 ×0,95)</span>
              <span>
                {formatPrice(preçoLiquido)} / {Unidade || 'MET'}
              </span>
            </div>
          </div>
        </details>

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
