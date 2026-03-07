import { useMemo, useState } from 'react';
import { Fabric } from '../data/fabrics';

export type SortField = keyof Fabric;
export type SortDirection = 'asc' | 'desc';
export type OriginFilter = 'all' | 'Nac.' | 'Imp.';

const ITEMS_PER_PAGE = 15;

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const normalizeCode = (code: string) =>
  code.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

function buildMatcher(searchTerm: string) {
  const tokens = normalizeText(searchTerm).split(/\s+/).filter(Boolean);
  return (fabric: Fabric): boolean => {
    const normDesc = normalizeText(fabric.description);
    const normCode = normalizeCode(fabric.code);
    const normCatalog = normalizeText(fabric.catalog);
    const rawCode = fabric.code.toLowerCase();
    return tokens.every((token) => {
      if (/^\d+$/.test(token)) {
        return (
          normCode.includes(token) ||
          rawCode.includes(token) ||
          normDesc.includes(token)
        );
      }
      return (
        normDesc.includes(token) ||
        normCode.includes(token) ||
        normCatalog.includes(token) ||
        rawCode.includes(token)
      );
    });
  };
}

export function useFabricTable(data: Fabric[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [originFilter, setOriginFilter] = useState<OriginFilter>('all');
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const counts = useMemo(
    () => ({
      all: data.length,
      'Nac.': data.filter((f) => f.origin === 'Nac.').length,
      'Imp.': data.filter((f) => f.origin === 'Imp.').length,
    }),
    [data]
  );

  const handleSort = (field: SortField) => {
    setSortDirection((prev) =>
      sortField === field && prev === 'asc' ? 'desc' : 'asc'
    );
    setSortField(field);
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilter = (filter: OriginFilter) => {
    setOriginFilter(filter);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    const byOrigin =
      originFilter === 'all'
        ? data
        : data.filter((f) => f.origin === originFilter);
    return searchTerm.trim()
      ? byOrigin.filter(buildMatcher(searchTerm))
      : byOrigin;
  }, [data, searchTerm, originFilter]);

  const sortedData = useMemo(
    () =>
      [...filteredData].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
      }),
    [filteredData, sortField, sortDirection]
  );

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    searchTerm,
    originFilter,
    sortField,
    sortDirection,
    currentPage,
    counts,
    sortedData,
    paginatedData,
    totalPages,
    isFiltered: !!searchTerm || originFilter !== 'all',
    itemsPerPage: ITEMS_PER_PAGE,
    handleSort,
    handleSearch,
    handleFilter,
    setCurrentPage,
  };
}
