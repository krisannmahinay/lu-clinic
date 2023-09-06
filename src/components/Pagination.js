

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPages

    const handlePageChange = (newPage) => {
        if(newPage >= 1 && newPage <= totalPages) {
            // console.log(newPage)
            onPageChange(newPage)
        }
    }

    return (
        <div class="flex items-center justify-center my-4">
            <nav>
                <ul className="flex pl-0 rounded list-none flex-wrap mt-3 gap-2">
                    <li>
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={isFirstPage}
                            className={`${isFirstPage ? 'cursor-not-allowed' : 'cursor-pointer'} shadow-md bg-white border border-gray-200 hover:bg-gray-400 p-2 hover:text-white rounded-full text-gray-500`}
                        >
                            <svg fill="none" width="24" height="24" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                    </li>

                    {/* First Page */}
                    <li>
                        <button
                            onClick={() => handlePageChange(1)}
                            className={`${currentPage === 1 ? 'bg-gray-500 text-white' : 'bg-white border border-gray-200 hover:bg-gray-300'} p-2 w-10 h-10 rounded-full`}
                        >
                            1
                        </button>
                    </li>

                    {currentPage > 3 && <li className="self-center mx-2">...</li>}

                    {[currentPage - 1, currentPage, currentPage + 1].filter(page => page > 1 && page < totalPages).map(page => (
                        <li key={page}>
                            <button
                                onClick={() => handlePageChange(page)}
                                className={`${currentPage === page ? 'bg-gray-500 text-white' : 'bg-white border border-gray-200 shadow-md hover:bg-gray-300'} p-2 w-10 h-10 rounded-full`}
                            >
                                {page}
                            </button>
                        </li>
                    ))}

                    {currentPage < totalPages - 3 && <li className="self-center mx-2">...</li>}

                    {/* Last Page */}
                    {totalPages !== 1 && (
                        <li>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                className={`${currentPage === totalPages ? 'bg-gray-500 text-white' : 'bg-white border border-gray-200 shadow-md hover:bg-gray-300'} p-2 w-10 h-10 rounded-full`}
                            >
                                {totalPages}
                            </button>
                        </li>
                    )}

                    <li>
                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={isLastPage}
                            className={`${isLastPage ? 'cursor-not-allowed' : 'cursor-pointer'} shadow-md bg-white border border-gray-200 hover:bg-gray-400 p-2 rounded-full text-[#676a6e]`}
                        >
                            <svg fill="none" width="24" height="24" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Pagination