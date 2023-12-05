
import React, { useState, useEffect } from "react"
import SearchItemPage from "../SearchItemPage"
import CustomCKEditor from "../CustomCKEditor"
import Modal from "../Modal"
import Table from "../Table"

const renderModalContentByTab = (tab) => {

}

const renderTableContentByTab = (tab) => {
    switch(tab) {
        case 'tab1':
            return (
                <div>
                    <div className="flex justify-items-start">
                        <button type="button" className="bg-green-500 hover:bg-green-600 text-white ml-2 mb-4 mr-2 px-4 py-2 focus:outline-none flex items-center space-x-2 rounded">
                            <span>SAVE</span> 
                            <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>

                        <button className="bg-sky-500 hover:bg-sky-600 text-white mb-4 mr-2 px-4 py-2 focus:outline-none flex items-center space-x-2 rounded">
                            <span>PUBLISHED</span> 
                            <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                        </button>
                    </div>
                    <CustomCKEditor /*onChange={(data) => setEditorData(data)}*//>
                </div>
            )

        default:
            return null
    }
}

const System = ({slug}) => {
    const [activeTab, setActiveTab] = useState('tab1')
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editorData, setEditorData] = useState("")
    
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
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mx-auto sm:w-full">
            <div className="border rounded-lg">
                <div className="flex justify-items-center">
                    <div className="rounded-tl-lg py-3 ml-3">
                        <button 
                            onClick={() => setActiveTab('tab1')}
                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>home
                        </button>
                        <button 
                            onClick={() => setActiveTab('tab2')}
                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>about us
                        </button>
                        <button 
                            onClick={() => setActiveTab('tab3')}
                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>services
                        </button>
                        <button 
                            onClick={() => setActiveTab('tab4')}
                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>doctors
                        </button>
                        <button 
                            onClick={() => setActiveTab('tab5')}
                            className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab5' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>contact us
                        </button>
                    </div>
                </div>

                <div className="tab-content px-3 max-h-[65vh] overflow-y-auto scroll-custom">
                    {renderTableContentByTab(activeTab)}
                </div>
            </div>
        </div>
    )
}

export default System