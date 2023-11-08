import React, { useState, useEffect, useRef } from "react"
import Table from "../Table"
import Modal from "../Modal"
import SearchItemPage from "../SearchItemPage"
import Button from "../Button"
import SearchExport from "../SearchExport"
import ItemPerPage from "../ItemPerPage"
import Pagination from "../Pagination"
import Dropdown from "../Dropdown"
import { DropdownExport } from "../DropdownLink"


const bedStatus = [
    {id:1, name: "Bed 1", bed_type: "Normal", bed_group: "General Ward - 1st Floor", floor: "1st Floor", status: "allotted"},
]

const bedList = [
    {id:1, name: "Bed 1", bed_type: "Normal", bed_group: "General Ward - 1st Floor"},
]

const bedType = [
    {id:1, name: "Normal"},
]

const bedGroup = [
    {id:1, name: "General Ward", floor: "1st Floor", description: ""},
]

const bedFloor = [
    {id:1, name: "1st Floor", description: ""},
]

const bedFloorFields = {
    name: '',
    description: ''
}

const Bed = ({slug}) => {
    const fieldRef = useRef(null)
    const [activeTab, setActiveTab] = useState('tab1')
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [totalPages, setTotalPages] = useState(1)

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

    const handleNewPage = (newPage) => {
        setCurrentPage(newPage)
        // setRefetchData(true)
        // setItemsPerPage(prev => prev + 1)
    }

    const addRow = () => {
        fieldRef.current.handleAddRow()
    }

    const renderTableContentByTab = (tab) => {
        switch(tab) {
            case 'tab1':
                return (
                    <Table 
                        slug={slug}
                        action={false}
                        ref={fieldRef} 
                        title="User List" 
                        dynamicTable={true}
                        tableData={bedStatus} 
                        tableHeader={Object.keys(bedStatus[0])}
                        // isLoading={userListLoading}
                    />
                )
    
            case 'tab2':
                return (
                    <Table 
                        slug={slug}
                        action={false}
                        ref={fieldRef} 
                        title="User List" 
                        dynamicTable={true}
                        tableData={bedList} 
                        tableHeader={Object.keys(bedList[0])}
                        // isLoading={userListLoading}
                    />
                )
    
            case 'tab3':
                return (
                    <Table 
                        slug={slug}
                        action={false}
                        ref={fieldRef} 
                        title="User List" 
                        dynamicTable={true}
                        tableData={bedType} 
                        tableHeader={Object.keys(bedType[0])}
                        // isLoading={userListLoading}
                    />
                    
                )
    
            case 'tab4':
                return (
                    <Table 
                        slug={slug}
                        action={false}
                        ref={fieldRef} 
                        title="User List" 
                        dynamicTable={true}
                        tableData={bedGroup} 
                        tableHeader={Object.keys(bedGroup[0])}
                        // isLoading={userListLoading}
                    />
                )
    
            case 'tab5':
                return (
                    <Table 
                        slug={slug}
                        action={false}
                        ref={fieldRef} 
                        title="User List" 
                        dynamicTable={true}
                        tableData={bedFloor} 
                        tableHeader={Object.keys(bedFloor[0])}
                        // isLoading={userListLoading}
                    />
                )
            
            default:
                return null
        }
    }

    const renderModalContentByTab = (tab) => {
        switch(tab) {
            case 'tab2':
                return (
                    <div className="w-80">
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                            <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                        </div>
    
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Bed Type</label>
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
    
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Bed Group</label>
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
                    </div>
                )
    
            case 'tab3':
                return (
                    <div className="w-80">
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                            <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                        </div>
                    </div>
                )
    
            case 'tab4':
                return (
                    <div className="w-80">
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                            <input type="text" placeholder="Enter name" className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none" />
                        </div>
    
                        <div className="flex flex-col w-full mb-4">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Floor</label>
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
    
            case 'tab5':
                return (
                    <div className="w-80">
                        <div className="flex flex-col w-full">
                            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">Name</label>
                            <input 
                                type="text" 
                                placeholder="Enter charge type"
                                className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
                            />
                        </div>
                    </div>
                )
            
            default:
                return null
        }
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

            <div className="flex justify-between py-4">
                <Button>
                    {activeTab !== 'tab1' && (
                        <button onClick={addRow} className="flex items-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:outline-none px-4">
                            <svg width="20" height="20" className="mr-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Add
                        </button>
                    )}
                </Button>

                <SearchExport>
                    <div className="flex items-center">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                // onChange={e => setSearchQuery(e.target.value)}
                                onChange={handleSearch}
                                className="border border-gray-300 w-full px-2 py-2 focus:outline-none flex-grow pl-10"
                                placeholder="Search..."
                            />
                            <svg fill="none" stroke="currentColor" className="mx-2 h-6 w-6 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>

                        <Dropdown
                            align="right"
                            width="48"
                            trigger={
                                <button className="border border-gray-300 bg-white rounded px-4 py-2 ml-4 focus:outline-none" aria-labelledby="Export">
                                    <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                    </svg>
                                </button>
                            }>
                            <DropdownExport>
                                Export as PDF
                            </DropdownExport>
                            <DropdownExport>
                                Export as JSON
                            </DropdownExport>
                        </Dropdown>
                    </div>
                </SearchExport>
            </div>

            {/* <SearchItemPage
                action={true}
                onExportToPDF={handleExportToPDF}
                onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                onCurrentPage={(page) => handleCurrentPage(page)}
                onSearch={(q) => handleSearch(q)}
                onAddClicked={() => setIsModalOpen(true)}
            /> */}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="border rounded-lg">
                    <div className="flex justify-items-center">
                        <div className="rounded-tl-lg py-3 ml-3">
                            <button 
                                onClick={() => setActiveTab('tab1')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Bed Status
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab2')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Bed List
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab3')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Bed Type
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab4')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Bed Group
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab5')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab5' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Floor
                            </button>
                        </div>
                    </div>

                    
                    <div className="tab-content">
                        {renderTableContentByTab(activeTab)}
                    </div>
                </div>
            </div>

            
            <div className="flex flex-wrap py-4">
                <div className="flex items-center justify-center flex-grow">
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages}
                        // onPageChange={newPage => setCurrentPage(newPage)}
                        onPageChange={(newPage) => handleNewPage(newPage)}
                    />
                </div>

                <ItemPerPage className="flex flex-grow">
                    <div className="flex items-center justify-end">
                        <span className="mr-2 mx-2 text-gray-700">Per Page:</span>
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="border border-gray-300 rounded px-4 py-2 focus:outline-none">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </ItemPerPage>
            </div>
        </div>
    )
}

export default Bed