import { useEffect, useState } from 'react'
import Head from 'next/head'
import AppLayout from '@/components/Layouts/AppLayout'
import Cookies from 'js-cookie'
import { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery } 
from '@/service/settingService'
import withAuth from './withAuth'
import SearchItemPage from '@/components/SearchItemPage'
import Table from '@/components/Table'
import Pagination from '@/components/Pagination'
import Button from '@/components/Button'
import ItemPerPage from '@/components/ItemPerPage'
import SearchExport from '@/components/SearchExport'
import Dropdown from '@/components/Dropdown'
import { DropdownExport } from '@/components/DropdownLink'
import SkeletonScreen from '@/components/SkeletonScreen'
import { TableContext } from '@/utils/context'

const recentDoctorData = [
    {name: "schin kumar", department: "Allergist/Immunologist", mobile: "0982828282", status: "permanent"},
    {name: "schin kumar2", department: "Anesthologist", mobile: "0982828282", status: "on hold"}
]

const recentPatientData = [
    {name: "schin kumar", symptoms: "bleeding in nose", mobile: "0982828282", address: "manila ph", status: "permanent"},
]

const Patients = () => {
    const moduleId = "patients"
    const authToken = Cookies.get('token') 
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState("")
    const [totalPages, setTotalPages] = useState(1)
    const [tableRecords, setTableRecords] = useState("recent_doctors")
    const [activeContent, setActiveContent] = useState("yellow")
    const [contentHeight, setContentHeight] = useState(0)
    const { isLoading: moduleListLoading, refetch: refetchModules, isError } = useGetModuleListQuery({},{
        enabled: !!authToken
    })

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

    const handleRecordSelection = (e) => {
        setTableRecords(e.target.value)
    }

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSelectedRecordChange = (e) => {
        setTableRecords(e)
    }

    const renderContent = () => {

    }
    
    const renderContentBySlug = (table) => {
        switch(table) {
            case 'recent_doctors':
                return (
                    <TableContext.Provider value={{
                        tableData: recentDoctorData,
                        tableHeader: Object.keys(recentDoctorData[0])
                    }}>
                        <Table />
                    </TableContext.Provider>
                    // <Table 
                    //     slug={moduleId}
                    //     title="User List"
                    //     tableData={recentDoctorData} 
                    //     tableHeader={Object.keys(recentDoctorData[0])}
                    //     // isLoading={userListLoading}
                    // />
                )

            case 'recent_patients':
                return (
                    <TableContext.Provider value={{
                        tableData: recentPatientData,
                        tableHeader: Object.keys(recentPatientData[0])
                    }}>
                        <Table />
                    </TableContext.Provider>
                    // <Table 
                    //     slug={moduleId}
                    //     title="User List"
                    //     tableData={recentPatientData} 
                    //     tableHeader={Object.keys(recentPatientData[0])}
                    //     // isLoading={userListLoading}
                    // />
                )
            
            default:
                return null
        }
    }

    return (
        <AppLayout
            isLoading={moduleListLoading}
            moduleId={moduleId}
            menuGroup={moduleId}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Patients
                </h2>
            }>
            <Head>
                <title>Patients</title>
            </Head>

            
            <div className="container mx-auto">
                <div className="relative overflow-x-hidden" style={{ height: `${contentHeight}px` }}>
                    {moduleListLoading ? (
                        <SkeletonScreen loadingType="mainPatientModule"/>
                    ) : (
                        <>
                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} p-8 pt-[5rem] absolute inset-0`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                            <div className="flex gap-4">
                                {/* Box 1: Total doctors with approval required */}
                                <div onClick={() => setActiveContent("green")} className="border p-6 rounded shadow-md bg-red-500 text-white cursor-pointer w-full">
                                    <svg className="h-16 w-16 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path clipRule="evenodd" fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" />
                                    </svg>
                                    <h2 className="text-xl font-semibold mb-2">Total Doctors</h2>
                                    <p className='text-white'>Approval Required: 2</p>
                                </div>

                                {/* Box 2: Total patients with want to admin */}
                                <div className="border p-6 rounded shadow-md bg-yellow-500 text-white cursor-pointer w-full">
                                    <svg className="h-16 w-16 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                                    </svg>
                                    <h2 className="text-xl font-semibold mb-2">Total Patients</h2>
                                    <p>Want to Admin: [Number]</p>
                                </div>

                                {/* Box 3: Total appointments with approved appointments */}
                                <div className="border p-6 rounded shadow-md bg-blue-500 text-white cursor-pointer w-full">
                                    <svg className="h-16 w-16 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z" />
                                        <path clipRule="evenodd" fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" />
                                    </svg>
                                    <h2 className="text-xl font-semibold mb-2">Total Appointments</h2>
                                    <p>Approved Appointments: [Number]</p>
                                </div>
                            </div>

                            <div className="flex justify-between py-1">
                                <select 
                                    className="border border-gray-300 rounded px-4 py-1 mr-4 focus:outline-none text-sm"
                                    onChange={handleRecordSelection}>
                                    <option value="recent_doctors">Recent Doctors </option>
                                    <option value="recent_patients">Recent Patients</option>
                                </select>

                                <SearchExport>
                                    <div className="flex items-center">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                // onChange={e => setSearchQuery(e.target.value)}
                                                onChange={(e) => handleSearch(e)}
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
                                                <button className="border border-gray-300 bg-white rounded px-2 py-1 ml-1 focus:outline-none" aria-labelledby="Export">
                                                    <svg fill="none" stroke="currentColor" className="h-5 w-4" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

                            
                            <div className="bg-white overflow-hidden border border-gray-300 rounded">
                                {renderContentBySlug(tableRecords)}
                            </div>

                            <div className="flex flex-wrap py-2">
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
                                            onChange={(e) => handleItemsPerPageChange(e)}
                                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none">
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                        </select>
                                    </div>
                                </ItemPerPage>
                            </div>
                        </div>


                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} p-8 pt-[5rem] absolute inset-0`} style={{ height: `${contentHeight}px`, overflowY: 'auto' }}>
                            <Button
                                paddingY="2"
                                btnIcon="close"
                                onClick={() => setActiveContent("yellow")}
                            >
                                Close
                            </Button>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}

export default withAuth(Patients)