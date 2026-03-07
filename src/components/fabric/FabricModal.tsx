import { Info, Ruler, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Fabric } from '../../data/fabrics';
import { calcFreight, formatBRL, formatDecimal } from '../../utils/formatters';

export function FabricModal({
  fabric,
  onClose,
}: {
  fabric: Fabric;
  onClose: () => void;
}) {
  const [metros, setMetros] = useState<string>('1');
  const metrosNum = parseFloat(metros) || 0;

  const freight1m = calcFreight(fabric.price);
  const priceWithFreight = fabric.price + freight1m;

  const baseTotal = fabric.price * metrosNum;
  const freight = calcFreight(baseTotal);
  const freightPerMeter = metrosNum > 0 ? freight / metrosNum : freight1m;
  const clientPricePerMeter = fabric.price + freightPerMeter;
  const totalWithFreight = baseTotal + freight;

  const details = [
    {
      label: 'Largura',
      value:
        fabric.width > 0
          ? `${formatDecimal(fabric.width)} ${fabric.unit}`
          : '—',
      mono: false,
      span: false,
    },
    {
      label: 'Gramatura',
      value: fabric.grammage > 0 ? `${fabric.grammage} g/m²` : '—',
      mono: false,
      span: false,
    },
    { label: 'NCM', value: fabric.ncm || '—', mono: true, span: false },
    {
      label: 'Catálogo',
      value: fabric.catalog || '—',
      mono: false,
      span: false,
    },
    ...(fabric.finish
      ? [{ label: 'Acabamento', value: fabric.finish, mono: false, span: true }]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]"
      >
        <div className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span className="text-xs font-mono bg-white/10 text-white/70 px-2.5 py-1 rounded-lg">
                  {fabric.code}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    fabric.origin === 'Nac.'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30'
                  }`}
                >
                  {fabric.origin === 'Nac.' ? '🇧🇷 Nacional' : '🌍 Importado'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white leading-snug">
                {fabric.description}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <div className="bg-emerald-500/15 border border-emerald-400/25 rounded-xl p-4">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Preço para o Cliente / Metro
              </p>
              <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                {formatBRL(priceWithFreight)}
              </p>
              {fabric.status === 'SC' && (
                <p className="text-amber-300/90 text-xs mt-2 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  Sob Consulta — preço sujeito a alteração
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* ── Calculadora ── */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-3 flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5" />
              Calculadora de preço
            </p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={metros}
                onChange={(e) => setMetros(e.target.value)}
                className="w-20 text-center font-bold text-lg border-2 border-gray-200 focus:border-gray-800 rounded-lg py-2 outline-none transition-colors"
                aria-label="Quantidade em metros"
              />
              <span className="text-gray-500 text-sm font-medium">metros</span>
            </div>
            {metrosNum > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                    Cobrar / Metro
                  </p>
                  <p className="text-lg font-extrabold text-emerald-700 tracking-tight">
                    {formatBRL(clientPricePerMeter)}
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                    Total do cliente
                  </p>
                  <p className="text-lg font-extrabold text-emerald-700 tracking-tight">
                    {formatBRL(totalWithFreight)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Detalhes ── */}
          <div className="grid grid-cols-2 gap-3">
            {details.map(({ label, value, mono, span }) => (
              <div
                key={label}
                className={`bg-gray-50 rounded-xl p-4 border border-gray-100 ${span ? 'col-span-2' : ''}`}
              >
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1.5">
                  {label}
                </p>
                <p
                  className={`font-semibold text-gray-800 ${mono ? 'font-mono text-sm' : ''}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 pt-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-700 transition-colors"
          >
            Fechar Detalhes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
