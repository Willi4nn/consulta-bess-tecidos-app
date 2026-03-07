import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ArrowUpDown, X, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Fabric } from '../data/fabrics';

interface FabricTableProps {
  data: Fabric[];
}

type SortField = keyof Fabric;
type SortDirection = 'asc' | 'desc';

export function FabricTable({ data }: FabricTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const normalizeText = (text: string) => 
      text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const normalizeCode = (code: string) => 
      code.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    const searchTokens = normalizeText(searchTerm).split(/\s+/).filter(Boolean);

    return data.filter((fabric) => {
      const normalizedDescription = normalizeText(fabric.description);
      const normalizedCode = normalizeCode(fabric.code);
      const normalizedCatalog = normalizeText(fabric.catalog);
      const rawCode = fabric.code.toLowerCase(); // Keep raw code for partial matches like "01021"

      // Check if ALL search tokens match at least one field
      return searchTokens.every((token) => {
        // Special handling for numeric tokens to match against code more flexibly
        if (/^\d+$/.test(token)) {
           return normalizedCode.includes(token) || rawCode.includes(token) || normalizedDescription.includes(token);
        }
        
        return (
          normalizedDescription.includes(token) ||
          normalizedCode.includes(token) ||
          normalizedCatalog.includes(token) ||
          rawCode.includes(token)
        );
      });
    });
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar tecido por nome ou código..."
          className="block w-full pl-12 pr-10 py-4 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 text-base shadow-sm transition-all"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: 'Código', key: 'code' },
                  { label: 'Descrição', key: 'description' },
                  { label: 'Preço (R$)', key: 'price' },
                  { label: 'Origem', key: 'origin' },
                  { label: 'Sit.', key: 'status' },
                  { label: 'Larg.', key: 'width' },
                  { label: 'Catálogo', key: 'catalog' },
                ].map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(col.key as SortField)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((fabric) => (
                <motion.tr
                  key={fabric.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  onClick={() => setSelectedFabric(fabric)}
                  className="cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                    {fabric.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {fabric.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                    R$ {fabric.price.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fabric.origin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fabric.status || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fabric.width.toFixed(2).replace('.', ',')} {fabric.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fabric.catalog}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="block sm:hidden divide-y divide-gray-100">
          {paginatedData.map((fabric) => (
            <div
              key={fabric.id}
              onClick={() => setSelectedFabric(fabric)}
              className="p-5 active:bg-gray-50 transition-colors cursor-pointer flex flex-col gap-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                    {fabric.description}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-base font-mono font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                      {fabric.code}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center px-2 py-1">
                      {fabric.origin === 'Nac.' ? '🇧🇷 Nacional' : '🌍 Importado'}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 space-x-3">
                    <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      Larg: {fabric.width.toFixed(2).replace('.', ',')}m
                    </span>
                    {fabric.catalog && (
                      <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        Cat: {fabric.catalog}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm">
                    <span className="block text-2xl font-bold text-emerald-700 tracking-tight">
                      R$ {fabric.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  {fabric.status === 'SC' && (
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full uppercase tracking-wide border border-orange-200">
                      Sob Consulta
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-end text-xs text-gray-400 font-medium uppercase tracking-wider">
                Ver detalhes <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> de <span className="font-medium">{sortedData.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {/* Simplified pagination numbers */}
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Próximo</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFabric && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFabric(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900">Detalhes do Tecido</h3>
                <button
                  onClick={() => setSelectedFabric(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="mb-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-2">
                    {selectedFabric.origin === 'Nac.' ? 'Nacional' : 'Importado'}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedFabric.description}</h2>
                  <p className="text-sm font-mono text-gray-500">{selectedFabric.code}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-sm text-emerald-600 font-medium mb-1">Preço por Metro</p>
                    <p className="text-3xl font-bold text-emerald-700">
                      R$ {selectedFabric.price.toFixed(2).replace('.', ',')}
                    </p>
                    {selectedFabric.status === 'SC' && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        Sob Consulta / Preço Especial
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Largura</p>
                    <p className="font-medium text-gray-900">
                      {selectedFabric.width.toFixed(2).replace('.', ',')} {selectedFabric.unit}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Gramatura</p>
                    <p className="font-medium text-gray-900">{selectedFabric.grammage} g/ml</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">NCM</p>
                    <p className="font-mono font-medium text-gray-900">{selectedFabric.ncm}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Catálogo</p>
                    <p className="font-medium text-gray-900">{selectedFabric.catalog}</p>
                  </div>

                  {selectedFabric.finish && (
                    <div className="col-span-2 space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Acabamento</p>
                      <p className="font-medium text-gray-900">{selectedFabric.finish}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setSelectedFabric(null)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
