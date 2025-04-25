
export const TutorListPagination = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage
}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-2">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};