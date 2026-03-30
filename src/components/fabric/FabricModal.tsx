import { Ruler, X } from 'lucide-react';
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
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative bg-[#FAFAFA] rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh] border border-zinc-200/50 ring-1 ring-black/5"
      >
        {/* Header Limpo e Contínuo */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 flex items-start justify-between gap-4 bg-white border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-md font-mono font-bold bg-zinc-100/80 text-zinc-600 px-2.5 py-1 rounded-md">
                {fabric.code}
              </span>
              <span
                className={`text-md font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${
                  fabric.origin === 'Nac.'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-indigo-50 text-indigo-600'
                }`}
              >
                {fabric.origin === 'Nac.' ? 'Nacional' : 'Importado'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-tight tracking-tight">
              {fabric.description}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-300 text-zinc-800 hover:text-zinc-950 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Preço Hero - Foco Absoluto */}
          <div className="flex flex-col items-center justify-center py-2">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Preço / Metro
            </p>
            <p className="text-5xl sm:text-6xl font-black text-emerald-600 tracking-tighter">
              {formatBRL(fabric.price)}
            </p>
          </div>

          {/* Calculadora Minimalista */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-zinc-100 ring-1 ring-zinc-900/5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500">
                <Ruler className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Calculadora
              </p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={metros}
                onChange={(e) => setMetros(e.target.value)}
                className="w-24 text-center font-black text-3xl sm:text-4xl text-zinc-900 border-b-2 border-zinc-200 focus:border-emerald-500 bg-transparent py-1 outline-none transition-colors"
                aria-label="Quantidade em metros"
              />
              <span className="text-zinc-400 font-semibold text-lg">
                metros
              </span>
            </div>

            {metrosNum > 0 && (
              <div className="bg-linear-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-4 sm:p-5 flex justify-between items-center border border-emerald-100/50">
                <div>
                  <p className="text-[10px] text-emerald-600/80 font-bold uppercase tracking-widest mb-0.5">
                    Total Cliente
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                    {formatBRL(totalWithFreight)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-emerald-600/60 font-bold uppercase tracking-widest mb-0.5">
                    Ref. / Metro
                  </p>
                  <p className="text-sm sm:text-base font-bold text-emerald-600">
                    {formatBRL(clientPricePerMeter)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Detalhes Técnicos */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {details.map(({ label, value, mono, span }) => (
              <div
                key={label}
                className={`bg-white rounded-2xl p-4 sm:p-5 border border-zinc-100 shadow-sm shadow-zinc-100/50 ${
                  span ? 'col-span-2' : ''
                }`}
              >
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1.5">
                  {label}
                </p>
                <p
                  className={`font-semibold text-zinc-800 ${
                    mono ? 'font-mono text-sm' : ''
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20 active:scale-[0.98]"
          >
            Fechar Janela
          </button>
        </div>
      </motion.div>
    </div>
  );
}
