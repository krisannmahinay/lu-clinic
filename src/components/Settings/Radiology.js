import React, { useState, useEffect } from "react"
import SearchItemPage from "../SearchItemPage"
import Modal from "../Modal"
import Table from "../Table"

const radiologyCategory = [
    {name: ""}
]

const radiologyUnit = [
    {unit_name: ""}
]

const radiologyParams = [
    {unit_name: ""}
]

const renderModalContentByTab = (tab) => {

}

const renderTableContentByTab = (tab) => {
    switch(tab) {
        case 'tab1':
            return (
                <Table 
                    title="User List" 
                    tableData={radiologyCategory} 
                    action={false}
                    tableHeader={Object.keys(radiologyCategory[0])}
                    // isLoading={userListLoading}
                />
            )
        
        case 'tab2':
            return (
                <Table 
                    title="User List" 
                    tableData={radiologyUnit} 
                    action={false}
                    tableHeader={Object.keys(radiologyUnit[0])}
                    // isLoading={userListLoading}
                />
            )

        case 'tab3':
            return (
                <Table 
                    title="User List" 
                    tableData={radiologyParams} 
                    action={false}
                    tableHeader={Object.keys(radiologyParams[0])}
                    // isLoading={userListLoading}
                />
            )

        default:
            return null
    }
}

const Radiology = ({slug}) => {
    const [activeTab, setActiveTab] = useState('tab1')
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleItemsPerPageChange = (item) => {
        setItemsPerPage(item)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleSearch = (q) => {
        setSearchQuery(q)
    }

    const handleExportToPDF = () => {
        
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div>
             <Modal 
                slug={slug}
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {renderModalContentByTab(activeTab)}
            </Modal>

            <SearchItemPage
                action={true}
                onExportToPDF={handleExportToPDF}
                onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                onCurrentPage={(page) => handleCurrentPage(page)}
                // onSearchResults={(results) => handleSearchResults(results)}
                onSearch={(q) => handleSearch(q)}
                onAddClicked={() => setIsModalOpen(true)}
            />

            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mx-auto sm:w-full">
                <div className="border rounded-lg">
                    <div className="flex justify-items-center">
                        <div className="rounded-tl-lg py-3 ml-3">
                            <button 
                                onClick={() => setActiveTab('tab1')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Radiology Category
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab2')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Unit
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab3')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Radiology Parameter
                            </button>
                        </div>
                    </div>

                    <div className="tab-content px-3 max-h-[65vh] overflow-y-auto scroll-custom">
                        {renderTableContentByTab(activeTab)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Radiology