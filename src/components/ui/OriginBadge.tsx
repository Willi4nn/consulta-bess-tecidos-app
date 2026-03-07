export function OriginBadge({ origin }: { origin: string }) {
  if (origin === 'Nac.')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
        🇧🇷 Nacional
      </span>
    );
  if (origin === 'Imp.')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
        🌍 Importado
      </span>
    );
  return <span className="text-gray-300 text-sm">—</span>;
}
