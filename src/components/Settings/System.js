
import React, { useState, useEffect } from "react"
import SearchItemPage from "../SearchItemPage"
import CustomCKEditor from "../CustomCKEditor"
import Modal from "../Modal"
import Table from "../Table"
import Tabs from "../Tabs"

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
    const [contentHeight, setContentHeight] = useState(0)
    const [activeContent, setActiveContent] = useState("yellow")

    useEffect(() => {
        const calculateHeight = () => {
            const windowHeight = window.innerHeight
            setContentHeight(windowHeight)
        }
        calculateHeight()

        // Recalculate height on window resize
        window.addEventListener('resize', calculateHeight)
        return () => {
            window.removeEventListener('resize', calculateHeight)
        }
    }, [])
    
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

    const handleActiveTab = (id) => {
        // tblRef.current.handleOnClick({type: 'clickedRow', value: userDetailById})
        setActiveTab(id)
    }

    const tabsConfig = [
        {
            id: 'tab1',
            label: 'Home',
            content: () => <></>
        }, {
            id: 'tab2',
            label: 'About Us',
            content: () => <></>
        }, {
            id: 'tab3',
            label: 'Services',
            content: () => <></>
        }, {
            id: 'tab4',
            label: 'Doctors',
            content: () => <></>
        }, {
            id: 'tab5',
            label: 'Contact Us',
            content: () => <></>
        }
    ]

    const renderContent = () => {
        return (
            <>
                <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                    <div className="font-bold text-xl mb-2 text-gray-600">System Configuration</div>
                    <div className="flex gap-2 py-1">
                        <button type="button" className="bg-green-500 hover:bg-green-600 flex items-center text-white px-2 gap-2 py-1 rounded text-sm focus:outline-none">
                            <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Save</span> 
                        </button>

                        <button className="bg-sky-500 hover:bg-sky-600 flex items-center text-white px-2 gap-2 py-1 rounded text-sm focus:outline-none">
                            <svg fill="none" stroke="currentColor" className="h-6 w-6" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                            <span>Published</span> 
                        </button>
                    </div>

                    <Tabs
                        tabsConfig={tabsConfig}
                        onActiveTab={(id) => handleActiveTab(id)}
                    />
                </div>
            </>
        )
    }

    return (
        <div>
            {renderContent()}
        </div>
    )
}

export default System