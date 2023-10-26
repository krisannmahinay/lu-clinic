import React, { useState, useEffect } from "react"
import SearchItemPage from "../SearchItemPage"
import Modal from "../Modal"
import Table from "../Table"

const symptomsHead = [
    {symptoms_head: "Allergy", symptoms_type: "", symptoms_description: ""}
]

const symptomsType = [
    {symptoms_head: "Allergy"}
]

const renderModalContentByTab = (tab) => {
    switch(tab) {
        case 'tab1':
            return (
                <div className="w-80">
                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Symptoms Head</label>
                        <input type="text" placeholder="Enter symptoms" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Symptoms Type</label>
                        <select
                            name=""
                            value=""
                            onChange={(e) => handleInputChange(e, rowIndex, field.name)}
                            className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
                        >
                            <option value="">Select option</option>
                            <option value="">Test</option>
                            
                        </select>
                    </div>

                    <div className="flex flex-col w-full">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Description</label>
                        <textarea type="text" placeholder="Enter description" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>
                </div>
            )

        case 'tab2':
            return (
                <div className="w-80">
                    <div className="flex flex-col w-full">
                        <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Symptoms Type</label>
                        <input type="text" placeholder="Enter charge type" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                    </div>
                </div>
            )
        
        default:
            return null
    }
}


const renderTableContentByTab = (tab) => {
    switch(tab) {
        case 'tab1':
            return (
                <Table 
                    title="User List" 
                    tableData={symptomsHead} 
                    action={false}
                    tableHeader={Object.keys(symptomsHead[0])}
                    // isLoading={userListLoading}
                />
            )

        case 'tab2':
            return (
                <Table 
                    title="User List" 
                    tableData={symptomsType} 
                    action={false}
                    tableHeader={Object.keys(symptomsType[0])}
                    // isLoading={userListLoading}
                />
            )

        default:
            return null
    }
}

const Symptoms = ({slug}) => {
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
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Symptoms Head
                            </button>

                            <button 
                                onClick={() => setActiveTab('tab2')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Symptoms Type
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

export default Symptoms