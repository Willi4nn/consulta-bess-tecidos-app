import { ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Fabric } from '../data/fabrics';
import { SortField, useFabricTable } from '../hooks/useFabricTable';
import { formatBRL, formatDecimal } from '../utils/formatters';
import { FabricModal } from './fabric/FabricModal';
import { EmptyState } from './ui/EmptyState';
import { FilterChips } from './ui/FilterChips';
import { OriginBadge } from './ui/OriginBadge';
import { Pagination } from './ui/Pagination';
import { SearchBar } from './ui/SearchBar';
import { SortIcon } from './ui/SortIcon';
import { StatusBadge } from './ui/StatusBadge';

// ── Constants ─────────────────────────────────────────────────────────────────

interface Column {
  label: string;
  key: SortField;
}

const COLUMNS: Column[] = [
  { label: 'Código', key: 'code' },
  { label: 'Descrição', key: 'description' },
  { label: 'Preço (R$)', key: 'price' },
  { label: 'Origem', key: 'origin' },
  { label: 'Situação', key: 'status' },
  { label: 'Largura', key: 'width' },
  { label: 'Catálogo', key: 'catalog' },
];

// ── Main export ───────────────────────────────────────────────────────────────

export function FabricTable({ data }: { data: Fabric[] }) {
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const table = useFabricTable(data);

  return (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        <SearchBar value={table.searchTerm} onChange={table.handleSearch} />
        <FilterChips
          active={table.originFilter}
          counts={table.counts}
          resultCount={table.sortedData.length}
          isFiltered={table.isFiltered}
          onChange={table.handleFilter}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    onClick={() => table.handleSort(col.key)}
                    className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none group transition-colors ${
                      table.sortField === col.key
                        ? 'text-emerald-600 bg-emerald-50/60'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
                    }`}
                  >
                    <div className="flex items-center">
                      {col.label}
                      <SortIcon
                        field={col.key}
                        sortField={table.sortField}
                        sortDirection={table.sortDirection}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                table.paginatedData.map((fabric, index) => (
                  <motion.tr
                    key={fabric.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.015 }}
                    onClick={() => setSelectedFabric(fabric)}
                    className="cursor-pointer group hover:bg-emerald-50/25 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-sm font-mono font-semibold text-gray-700 bg-gray-100 group-hover:bg-white/80 px-2 py-0.5 rounded-md transition-colors">
                        {fabric.code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-gray-800">
                        {fabric.description}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-sm font-bold text-emerald-600">
                        {formatBRL(fabric.price)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <OriginBadge origin={fabric.origin} />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={fabric.status} />
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-600">
                      {fabric.width > 0
                        ? `${formatDecimal(fabric.width)} ${fabric.unit}`
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-sm text-gray-500">
                      {fabric.catalog || '—'}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="block sm:hidden divide-y divide-gray-100">
          {table.paginatedData.length === 0 ? (
            <EmptyState />
          ) : (
            table.paginatedData.map((fabric) => (
              <div
                key={fabric.id}
                onClick={() => setSelectedFabric(fabric)}
                className="p-5 active:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 leading-snug mb-2">
                      {fabric.description}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                        {fabric.code}
                      </span>
                      <OriginBadge origin={fabric.origin} />
                      {fabric.status === 'SC' && <StatusBadge status="SC" />}
                    </div>
                  </div>
                  <div className="shrink-0 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-100">
                    <span className="block text-lg font-bold text-emerald-700 tracking-tight whitespace-nowrap">
                      {formatBRL(fabric.price)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {fabric.width > 0 && (
                    <span className="text-xs bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 text-gray-500">
                      Larg: {formatDecimal(fabric.width)}m
                    </span>
                  )}
                  {fabric.catalog && (
                    <span className="text-xs bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 text-gray-500">
                      Cat: {fabric.catalog}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-end text-xs text-gray-400 font-medium">
                  Ver detalhes <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {table.totalPages > 1 && (
          <Pagination
            currentPage={table.currentPage}
            totalPages={table.totalPages}
            totalItems={table.sortedData.length}
            itemsPerPage={table.itemsPerPage}
            onPageChange={table.setCurrentPage}
          />
        )}
      </div>

      <AnimatePresence>
        {selectedFabric && (
          <FabricModal
            fabric={selectedFabric}
            onClose={() => setSelectedFabric(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
