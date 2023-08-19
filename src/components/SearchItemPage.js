import { useState } from "react"
import { useSearchQuery } from "@/service/searchService"

const SearchItemPage = ({onChangeItemPage, onCurrentPage, onSearchResults, onSearch}) => {
    const searchModel = "users"
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("")

    // const { data: searchResults } = useSearchQuery({
    //     keywords: searchQuery, 
    //     searchModel:searchModel,
    //     items: itemsPerPage,
    //     page: currentPage
    // });
    
    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value)
        // console.log(newItemsPerPage)
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1); 
        // pass this props to the parent
        onChangeItemPage(newItemsPerPage)
        onCurrentPage(1)
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1)
        // onSearchResults(searchResults)
        onSearch(e.target.value)
    }

    // console.log(searchResults)

    return (
        <div className="flex justify-between py-4">
            <div className="flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    // onChange={e => setSearchQuery(e.target.value)}
                    onChange={handleSearch}
                    className="border border-gray-300 w-full px-3 py-2 focus:outline-none flex-grow pl-10"
                    placeholder="Search..."
                />
                <svg fill="none" stroke="currentColor" className="mx-2 h-6 w-6 text-gray-600 absolute" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>

            <div>
                <span className="mr-2 mx-5 my-2">Items per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border border-gray-300 rounded px-4 py-2 focus:outline-none"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                </select>
            </div>
        </div>
    )
}

export default SearchItemPage