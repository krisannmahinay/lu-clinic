import { useState, useEffect, } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery 
} from '@/service/settingService'

import { useGetUserDetailsQuery } from '@/service/authService'


import { useGetUserById } from "@/service/authService"

import AppLayout from '@/components/Layouts/AppLayout'
import Table from '@/components/Table'
import Form from '@/components/Form'
import Card from '@/components/Card'    
import Alert from '@/components/Alert'
import withAuth from './withAuth'
import Pagination from '@/components/Pagination'
import SearchItemPage from '@/components/SearchItemPage'
import Modal from '@/components/Modal'
import ProfileInformation from '@/components/ProfileInformation'
import Button from '@/components/Button'
import ItemPerPage from '@/components/ItemPerPage'
import Dropdown from "@/components/Dropdown"
import SearchExport from '@/components/SearchExport'
import { DropdownExport } from "@/components/DropdownLink"


const Setting = () => {

    const moduleId = "settings"
    const menuGroup = "settings"
    const [ modalId, setModalId ] = useState("") 
    const [ tableHeader, setTableHeader ] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState([])

    const [refetchData, setRefetchData] = useState(false)
    // const [totalPages, setTotalPages] = useState(0)
    // const [perPage, setPerPage] = useState(0)
    
    const { data: permission, isLoading: permissionListLoading, isError: permissionErr } = useGetPermissionListQuery()
    const { data: moduleList, isLoading: moduleListLoading} = useGetModuleListQuery()
    const { data: userList, isLoading: userListLoading, isError: userErr, error, isSuccess: userSuccess } = useGetUserListQuery({
        items: itemsPerPage,
        page: currentPage,
        keywords: searchQuery
    }, {
        enabled: !!searchQuery
    })

    
    // console.log(moduleList)
    
    const { data: userDetails, isError: dataError, refetch: refetchUserDetails } = useGetUserDetailsQuery()

    const userData = userList?.userList ?? []
    const pagination = userList?.pagination ?? []
    const permissionData = permission?.permission ?? []
    const moduleData = moduleList?.moduleList ?? []
    const userInfo = userDetails?.data[0] ?? []

    useEffect(() => {
        if(userSuccess && Array.isArray(userData) && userData.length > 0) {
            const headers = Object.keys(userData[0])
            setTableHeader(headers)
            // setItemsPerPage(prev => prev + 1)
        }
    }, [userSuccess, userData])

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleNewPage = (newPage) => {
        setCurrentPage(newPage)
        // setRefetchData(true)
        // setItemsPerPage(prev => prev + 1)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(e.target.value)
    }

    const handleExportToPDF = () => {
        
    }

    const handleAlertClose = () => {
        setAlertType("")
        setAlertMessage([])
    }

    const handleAlert = (data) => {
        // setAlertType(data)
        console.log(data)
    }

    const closeModal = () => {
        // setSelectedRows([])
        setIsModalOpen(false)
    }

    const handleRefetch = () => {
        // setRefetchData(true)
        setItemsPerPage(prev => prev + 1)
    }

    const renderConfiguration = () => {
        return (
            <>
                <div className="flex justify-between py-2">
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:outline-none px-4">
                        <svg width="20" height="20" className="mr-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Add
                    </button>

                    <SearchExport>
                        <div className="flex items-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    // onChange={e => setSearchQuery(e.target.value)}
                                    onChange={(e) => handleSearch(e)}
                                    className="border border-gray-300 w-full px-2 py-2 rounded focus:outline-none flex-grow pl-10"
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
                                    <button className="border border-gray-300 bg-white rounded px-4 py-2 ml-2 focus:outline-none" aria-labelledby="Export">
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

                <div className="border border-gray-300 rounded">
                    <Table 
                        title="User List" 
                        action={true}
                        module={moduleData} 
                        tableData={userData} 
                        tableHeader={tableHeader}
                        permission={permissionData} 
                        isLoading={userListLoading}
                        onOpenModal={(id) => setModalId(id)}
                    />
                </div>
    
                <div className="flex flex-wrap py-2">
                    <div className="flex items-center justify-center flex-grow">
                        <Pagination 
                            currentPage={pagination.currentPage} 
                            totalPages={pagination.totalPages}
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
                                className="border border-gray-300 rounded px-4 py-2 focus:outline-none">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                    </ItemPerPage>
                </div>
            </>
        )
    }

    const userRegistration = [
        {name: 'email', type: 'email', label: 'Email', placeholder: 'Enter email'},
        {name: 'password', type: 'password', label: 'Password', placeholder: 'Enter password'},
        {
            name: 'roles',
            type: 'dropdown',
            label: 'Roles',
            options: [
                {value: 'admin', label: 'Admin'},
                {value: 'nurse', label: 'Nurse'},
                {value: 'doctor', label: 'Doctor'}
            ]
        }
    ]

    // console.log(userDetails)

    return (
        <AppLayout
            isLoading={moduleListLoading}
            moduleId={moduleId}
            menuGroup={menuGroup}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Inventory
                </h2>
            }>
            <Head>
                <title>Laravel - Setting</title>
            </Head>

            <div className="p-8">
                
                {alertMessage &&
                    <Alert 
                        alertType={alertType}
                        isOpen={alertType !== ""}
                        onClose={handleAlertClose}
                        message={alertMessage} 
                    /> 
                }

                <Modal 
                    // title={title}
                    openId={modalId}
                    slug={moduleId} 
                    isOpen={isModalOpen} 
                    initialFields={userRegistration}
                    addUserBtn={true}
                    onClose={closeModal}
                    onSuccess={handleRefetch}
                    onSetAlertType={(data) => setAlertType(data)}
                    onSetAlertMessage={(data) => setAlertMessage(data)}
                    // permission={permission} 
                    // selectedRowId={selectedRows}
                />
                
                {(userInfo.roles === "x" || userInfo.roles === "admin" ||  userInfo.roles === "superadmin") && (
                    renderConfiguration()
                )} 

                {(userInfo.roles === "nurse" || userInfo.roles === "doctor") && (
                    <>
                        <ProfileInformation information={userInfo}/>
                    </>
                )} 

                
            </div>


        </AppLayout>
    )
}

export default withAuth(Setting)