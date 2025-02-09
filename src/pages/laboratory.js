import { useState, useEffect } from 'react'
import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import withAuth from './withAuth'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import SearchItemPage from '@/components/SearchItemPage'
import { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery } 
from '@/service/settingService'
import Alert from '@/components/Alert'
import Modal from '@/components/Modal'
import SkeletonScreen from '@/components/SkeletonScreen'
import Button from '@/components/Button'
import Dropdown from '@/components/Dropdown'
import SearchExport from '@/components/SearchExport'
import { TableContext } from '@/utils/context'

// const labData = [
//     {test_name: "", short_name: "", test_type: "", category: "", sub_category: "", method: ""}
// ] 

const labData = [
    {
        time_in: "1533",
        patient_id: "PAT-230818XYA2",
        patient_type: "OPD",
        patient_name: "John Regala",
        age: 27,
        gender: "Male",
        phone: "092222222222",
        physician: "Dr Smith",
    },
    {
        time_in: "1440",
        patient_id: "PAT-230818XY2A",
        patient_type: "IPD",
        patient_name: "John Doe",
        age: 27,
        gender: "Male",
        phone: "092222222222",
        physician: "Dr Lu",
    }
]

const Laboratory = () => {
    const moduleId = "laboratory"
    const menuGroup = "dashboard"
    
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState([])
    const [pageTitle, setPageTitle] = useState("")
    const [contentHeight, setContentHeight] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeContent, setActiveContent] = useState("yellow")
    const [contentType, setContentType] = useState("")
    const [isOptionDisabled, setIsOptionDisabled] = useState(true)
    const [isOptionEditDisabled, setIsOptionEditDisabled] = useState(true)
    // const [totalPages, setTotalPages] = useState(0)

    const { isLoading: moduleListLoading } = useGetModuleListQuery()

    const formatTitlePages = (str) => {
        return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    }

    useEffect(() => {
        if(moduleId) {
            setPageTitle(formatTitlePages(moduleId))
        }

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

    const handleOnChecked = (data) => {
        setIsOptionEditDisabled(data.length > 1)
        setIsOptionDisabled(data.length === 0)
    }

    const handleOnChange = (type, e) => {
        switch(type) {
            case 'itemsPerPage':
                setItemsPerPage(e.target.value)
                break

            case 'search':
                setSearchQuery(e.target.value)
            
            default:
                break
        }
    }

    const handleOnClick = (type, data) => {
        switch(type) {
            case 'addRowBtn':
                // formRef.current.handleAddRow()
                break

            case 'addUserBtn':
                // formRef.current.handleSubmit('createUser')
                break

            case 'closeDrawer':
                setActiveContent("yellow")
                // setProfileData([])
                break

            case 'editUserBtn':
                setProfileData(data)
                setActiveContent("green")
                setContentType("editUser")
                break

            case 'clickedRows':
                setProfileData(data)
                setActiveContent("green")
                setContentType("viewUser")
                break

            default:
                break
        }
    }
    
    const handleNewPage = (newPage) => {
        setCurrentPage(newPage)
        // setRefetchData(true)
        // setItemsPerPage(prev => prev + 1)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (item) => {
        setItemsPerPage(item)
    }

    const handleExportToPDF = () => {
        
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    const handleRefetch = () => {
        setItemsPerPage(prev => prev + 1)
    }

    const handleAlertClose = () => {
        setAlertType("")
        setAlertMessage([])
    }

    const renderContent = () => {
        return moduleListLoading ? (
            <SkeletonScreen loadingType="table"/>
        ) : (
            <div>
                <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                    <div className="font-medium text-xl mb-2 text-gray-600">{pageTitle}</div>
                    <div className="flex justify-between py-1">
                        <div className="flex space-x-1">
                            <Button
                                bgColor=""
                                btnIcon="user"
                                onClick={() => {
                                    setActiveContent("green")
                                    setContentType("addPatient")
                                }}
                            >
                                New Patient
                            </Button>

                            <Dropdown
                                align="left"
                                width="48"
                                trigger={
                                    <button 
                                        onClick="" 
                                        className={`${isOptionDisabled 
                                            ? 'bg-gray-300' 
                                            : 'bg-indigo-500 hover:bg-indigo-600'
                                        } flex items-center text-white text-sm px-2 gap-2 rounded focus:outline-none`} 
                                        disabled={isOptionDisabled}>
                                        
                                        <svg dataSlot="icon" fill="none" className="h-4 w-4" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>

                                        Options
                                    </button>
                                }>
                                <button onClick={() => handleOnClick('editUserBtn')} 
                                    className={`${isOptionEditDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out`}
                                    disabled={isOptionEditDisabled}>
                                    Edit
                                </button>
                                <button className="w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                                    Delete
                                </button>
                            </Dropdown>
                        </div>

                        <SearchExport>
                            <div className="flex items-center">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        // onChange={e => setSearchQuery(e.target.value)}
                                        onChange={(e) => handleOnChange('search',e)}
                                        className="border border-gray-300 w-full px-2 py-1 rounded focus:outline-none text-sm flex-grow pl-10"
                                        placeholder="Search..."
                                    />
                                    <svg fill="none" stroke="currentColor" className="mx-2 h-4 w-4 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>

                                <Dropdown
                                    align="right"
                                    width="48"
                                    trigger={
                                        <button className="border h-8 border-gray-300 bg-white rounded px-2 py-1 ml-1 focus:outline-none" aria-labelledby="Export">
                                            <svg fill="none" stroke="currentColor" className="h-5 w-4" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                            </svg>
                                        </button>
                                    }>

                                    <button className="cursor-not-allowed w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out" disabled>
                                    Export as PDF
                                    </button>
                                    <button className="cursor-not-allowed w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out" disabled>
                                    Export as PDF
                                    </button>
                                </Dropdown>
                            </div>
                        </SearchExport>
                    </div>

                    
                    <div className="border border-gray-300 rounded">
                        <TableContext.Provider value={{
                            tableData: labData,
                            tableHeader: Object.keys(labData[0])
                        }}>
                            <Table />
                        </TableContext.Provider>
                    </div>
                </div>

                <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} absolute inset-0 p-8 pt-[5rem]`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                    {contentType === 'addPatient' && (
                        <Button
                            paddingY="1"
                            btnIcon="close"
                            // onClick={() => setActiveContent("yellow")}
                            onClick={() => handleOnClick('closeDrawer')}
                        >
                            Close
                        </Button>
                    )}
                </div>
            </div>
        )
    }


    return (
        <AppLayout
            moduleId={moduleId}
            menuGroup={menuGroup}>
            <Head>
                <title>Laboratory</title>
            </Head>

            <div className="container mx-auto">
                <div className="relative overflow-x-hidden" style={{ height: `${contentHeight}px` }}>
                    {renderContent()}
                </div>
            </div>

            {/* <div className="p-8">
                <>
                    <SearchItemPage
                        action={false}
                        onExportToPDF={handleExportToPDF}
                        onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                        onCurrentPage={(page) => handleCurrentPage(page)}
                        // onSearchResults={(results) => handleSearchResults(results)}
                        onSearch={(q) => handleSearch(q)}
                        onAddClicked={() => setIsModalOpen(true)}
                    />
                    
                    <Table 
                        title="User List" 
                        slug={moduleId}
                        tableData={labData} 
                        tableHeader={Object.keys(labData[0])}
                        // isLoading={userListLoading}
                        // onOpenModal={(id) => setModalId(id)}
                    />

                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={currentPage}
                        // onPageChange={newPage => setCurrentPage(newPage)}
                        onPageChange={(newPage) => handleNewPage(newPage)}
                    />
                </>
            </div> */}
        </AppLayout>
    )
}

export default withAuth(Laboratory)