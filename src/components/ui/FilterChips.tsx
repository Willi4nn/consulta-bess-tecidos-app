import { OriginFilter } from '../../hooks/useFabricTable';

interface FilterOption {
  value: OriginFilter;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'Nac.', label: '🇧🇷 Nacional' },
  { value: 'Imp.', label: '🌍 Importado' },
];

export function FilterChips({
  active,
  counts,
  resultCount,
  isFiltered,
  onChange,
}: {
  active: OriginFilter;
  counts: Record<string, number>;
  resultCount: number;
  isFiltered: boolean;
  onChange: (v: OriginFilter) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
        Filtrar:
      </span>
      {FILTER_OPTIONS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            active === f.value
              ? 'bg-gray-900 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {f.label}
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              active === f.value
                ? 'bg-white/20 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {counts[f.value] ?? 0}
          </span>
        </button>
      ))}
      {isFiltered && (
        <span className="text-xs text-gray-400 ml-1">
          {resultCount} resultado{resultCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}
