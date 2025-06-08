import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Pagination({
  totalPages,
  currentPage,
  handlePagination,
}) {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleClick = (value) => {
    if (page === value || value < 1 || value > totalPages) return;
    setPage(value);
    handlePagination(value);
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`w-8 h-8 sm:w-9 sm:h-9 mx-1 rounded-full flex items-center justify-center text-sm transition-all ${
            i === page
              ? "bg-[var(--color-primary)] text-white dark:bg-[var(--color-primary-dark)]"
              : "text-gray-600 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 my-6">
      <button
        onClick={() => handleClick(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 text-gray-500 hover:text-black disabled:text-gray-300"
      >
        <ChevronLeft className="hover:text-[var(--color-primary)] dark:text-gray-600 dark:hover:text-[var(--color-primary-dark)]" />
      </button>

      <div className="flex flex-wrap justify-center">{renderPages()}</div>

      <button
        onClick={() => handleClick(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 text-gray-500 hover:text-black disabled:text-gray-300"
      >
        <ChevronRight className="hover:text-[var(--color-primary)] dark:text-gray-600 dark:hover:text-[var(--color-primary-dark)]" />
      </button>
    </div>

);
}

// Example for usage
// function handlePagination(newPage) {
//   setPage(newPage);
// }

//   <Pagination
//   totalPages={5}
//   currentPage={2}
// handlePagination={handlePagination}
// />