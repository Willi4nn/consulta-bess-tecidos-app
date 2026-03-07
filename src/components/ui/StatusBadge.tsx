export function StatusBadge({ status }: { status: string }) {
  if (!status || status === '-')
    return <span className="text-gray-300 select-none">—</span>;
  if (status === 'SC')
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
        Sob Consulta
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      {status}
    </span>
  );
}
