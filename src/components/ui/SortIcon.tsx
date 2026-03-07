import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { SortDirection } from '../../hooks/useFabricTable';

export function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: string;
  sortField: string;
  sortDirection: SortDirection;
}) {
  if (field !== sortField)
    return (
      <ArrowUpDown className="h-3.5 w-3.5 ml-1.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    );
  if (sortDirection === 'asc')
    return <ArrowUp className="h-3.5 w-3.5 ml-1.5 text-emerald-500" />;
  return <ArrowDown className="h-3.5 w-3.5 ml-1.5 text-emerald-500" />;
}
