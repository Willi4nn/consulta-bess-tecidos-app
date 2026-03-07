import { ChevronLeft, ChevronRight } from 'lucide-react';

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, '…', total);
  } else if (current >= total - 3) {
    pages.push(1, '…', total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, '…', current - 1, current, current + 1, '…', total);
  }
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  const rangeStart = (currentPage - 1) * itemsPerPage + 1;
  const rangeEnd = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="border-t border-gray-100 px-5 py-4 flex items-center justify-between gap-4 bg-gray-50/50">
      <p className="text-sm text-gray-500 hidden sm:block shrink-0">
        Mostrando de{' '}
        <span className="font-semibold text-gray-700">{rangeStart}</span>
        {' até '}
        <span className="font-semibold text-gray-700">{rangeEnd}</span>
        {' de '}
        <span className="font-semibold text-gray-700">{totalItems}</span>
        {' tecidos'}
      </p>

      <div className="flex sm:hidden flex-1 justify-between">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-500 flex items-center font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all"
        >
          Próximo
        </button>
      </div>

      <nav className="hidden sm:flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPageNumbers(currentPage, totalPages).map((page, i) =>
          page === '…' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                currentPage === page
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
