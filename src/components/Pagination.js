

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
            <nav class="block">
                <ul class="flex pl-0 rounded list-none flex-wrap shadow bg-white">
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={isFirstPage}
                            className={`${isFirstPage ? 'cursor-not-allowed' : 'cursor-pointer'} bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-l text-[#676a6e]`}
                        >
                            Prev
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index}>
                            <button
                                onClick={() => handlePageChange(index + 1)}
                                className={`${currentPage === index + 1 ? 'bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300'} px-3 py-2`}
                            >
                                {index+1}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={isLastPage}
                            className={`${isLastPage ? 'cursor-not-allowed': 'cursor-pointer'} bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r text-[#676a6e]`}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Pagination