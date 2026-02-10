"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 7,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si el total es menor que el máximo
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar la primera página
      pages.push(1);

      // Calcular rango alrededor de la página actual
      const leftSiblingIndex = Math.max(currentPage - 1, 2);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftDots && shouldShowRightDots) {
        // Mostrar páginas desde el inicio
        for (let i = 2; i < Math.min(maxVisiblePages - 1, totalPages); i++) {
          pages.push(i);
        }
        pages.push("...");
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Mostrar páginas desde el final
        pages.push("...");
        for (
          let i = Math.max(totalPages - maxVisiblePages + 3, 2);
          i < totalPages;
          i++
        ) {
          pages.push(i);
        }
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        // Mostrar páginas alrededor de la actual
        pages.push("...");
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push("...");
      }

      // Siempre mostrar la última página
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-(--accent) hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
        aria-label="Página anterior"
      >
        Anterior
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                currentPage === page
                  ? "bg-(--accent) text-white shadow-lg transform scale-105"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-(--accent)"
              }`}
              aria-label={`Página ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ) : (
            <span
              key={index}
              className="px-2 py-2 text-gray-400"
              aria-hidden="true"
            >
              {page}
            </span>
          ),
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-(--accent) hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700"
        aria-label="Página siguiente"
      >
        Siguiente
      </button>
    </div>
  );
}
