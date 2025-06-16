// src/components/common/Pagination.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage - delta > 2) pages.push(1, '...');
    else if (totalPages > 1) pages.push(1);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (currentPage + delta < totalPages - 1) pages.push('...', totalPages);
    else if (totalPages > rangeEnd) pages.push(totalPages);

    return pages;
  };

  const PageButton = ({ page, isActive = false }: { page: number | string; isActive?: boolean }) => (
    <button
      onClick={() => typeof page === 'number' && onPageChange(page)}
      disabled={typeof page !== 'number'}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-purple-600 text-white'
          : typeof page === 'number'
          ? 'text-gray-700 hover:bg-gray-100'
          : 'text-gray-400 cursor-not-allowed'
      }`}
    >
      {page}
    </button>
  );

  return (
    <div className="bg-white px-4 py-4 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="text-sm text-gray-700">
            Affichage de {startIndex} à {endIndex} sur {totalItems} résultats
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {[10, 20, 50].map(size => (
              <option key={size} value={size}>{size} par page</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getPageNumbers().map((page, index) => (
            <PageButton
              key={index}
              page={page}
              isActive={page === currentPage}
            />
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;