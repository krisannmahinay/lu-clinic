import { useState } from "react"
import { useSearchQuery } from "@/service/searchService"

const SearchItemPage = ({onChangeItemPage, onCurrentPage, onSearchResults, onSearch, onExportToPDF, onAddClicked}) => {
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
                <span className="mr-2 mx-2 ">Per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="border border-gray-300 rounded px-4 py-2 mr-4 focus:outline-none">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                </select>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        // onChange={e => setSearchQuery(e.target.value)}
                        onChange={handleSearch}
                        className="border border-gray-300 w-full px-3 py-2 focus:outline-none flex-grow pl-10"
                        placeholder="Search..."
                    />
                    <svg fill="none" stroke="currentColor" className="mx-2 h-6 w-6 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
            </div>

            <div className="flex">
                <button onClick={onAddClicked} className="flex items-center ml-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:outline-none px-2">
                    <svg width="20" height="20" className="mr-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Add
                </button>

                <button onClick={onExportToPDF} className="flex items-center ml-4 bg-red-600 text-white p-2 rounded hover:bg-red-700 focus:outline-none px-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5 2C3.89543 2 3 2.89543 3 4V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V8L13 2H5ZM5 4H12V10H19V20H5V4ZM13 4V9H19L13 4Z" fill="currentColor"/>
                    </svg>
                    Export to PDF
                </button>

                
            </div>
        </div>
    )
}

export default SearchItemPage