import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery
} from '@/service/settingService'

import loadinSpinner from '../../public/assets/svg/image2vector.svg'

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
import SkeletonScreen from '@/components/SkeletonScreen'
import { DropdownExport } from "@/components/DropdownLink"

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

const Setting = () => {

    const moduleId = "settings"
    const menuGroup = "settings"
    const formRef = useRef(null)
    const [modalId, setModalId] = useState("") 
    const [tableHeader, setTableHeader] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState("")
    const [activeContent, setActiveContent] = useState("yellow")
    const [refetchData, setRefetchData] = useState(false)
    const [reInitFields, setReIinitFields] = useState(true)
    const [btnSpinner, setBtnSpinner] = useState(true)
    const [highlightedRows, setHighlightedRows] = useState(new Set())
    // const [totalPages, setTotalPages] = useState(0)
    // const [perPage, setPerPage] = useState(0)
    
    const { data: permission, isLoading: permissionListLoading, isError: permissionErr } = useGetPermissionListQuery()
    const { data: moduleList, isLoading: moduleListLoading} = useGetModuleListQuery()
    const { 
        data: userList, 
        isLoading: userListLoading, 
        isError: userErr, 
        error, 
        isSuccess: userSuccess 
    } = useGetUserListQuery({
        items: itemsPerPage,
        page: currentPage,
        keywords: searchQuery
    }, {
        enabled: !!searchQuery
    })

    // console.log(moduleList)
    
    const { data: userDetails, isError: dataError, refetch: refetchUserDetails } = useGetUserDetailsQuery()

    const userData = userList?.data ?? []
    const pagination = userList?.pagination ?? []
    const permissionData = permission?.permission ?? []
    const moduleData = moduleList?.moduleList ?? []
    const userInfo = userDetails?.data[0] ?? []
    
    console.log(userList)

    const isRowNew = (createdAt) => {
        const rowDate = new Date(createdAt)
        const now = new Date()
        return (now - rowDate) / 1000 <= 5
    }

    useEffect(() => {
        // const newRows = new Set()

        // userData.forEach((row, index) => {
        //     if(isRowNew(row.created_at)) {
        //         newRows.add(index)
        //     }
        // })

        // setHighlightedRows(newRows)
        
        // console.log(highlightedRows)

        // const highlightTimeout = setTimeout(() => {
        //     setHighlightedRows(new Set())
        // }, 2000) //clear the highlights after .5milliseconds

        if(userSuccess && Array.isArray(userData) && userData.length > 0) {
            const headers = Object.keys(userData[0])
            setTableHeader(headers)
        }

        let spinnerTimer
        if(btnSpinner) {
            spinnerTimer = setTimeout(() => {
                setBtnSpinner(false)
            }, 1000)
        }

        return () => {
            if(spinnerTimer) {
                clearTimeout(spinnerTimer)
            }
            // clearTimeout(highlightTimeout)
        }

    }, [userSuccess, btnSpinner])


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
        setAlertType(data)
    }

    const handleAlerMessage = (data) => {
        // setAlertMessage(data)
        console.log(data)
    }

    const handleAlertType = (data) => {
        setAlertType(data)
    }

    const closeModal = () => {
        // setSelectedRows([])
        setIsModalOpen(false)
    }

    const handleRefetch = () => {
        setItemsPerPage(prev => prev + 1)
    }

    const handleLoadingSpinner = (data) => {
        setBtnSpinner(data)
    }

    const handleCloseSlider = () => {
        setActiveContent("yellow")
    }

    const renderTableContent = () => {
        return (
            <>
            {userListLoading ? (
                <SkeletonScreen rowCount={userData?.length} columnCount={tableHeader?.length}/> 
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {tableHeader.map((tblHeader, tblHeaderIndex) => (
                                <th key={tblHeaderIndex} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {tblHeader}
                                </th>

                            ))}

                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    
                    <tbody className="bg-white divide-y divide-gray-200">
                        {userData.length === 0 ? (
                            <tr>
                                <td colSpan={tableHeader.length + 1} className="px-6 py-2 text-center">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            userData.map((tblBody, tblBodyIndex) => (
                                <tr key={tblBodyIndex} className={`${highlightedRows.has(tblBodyIndex)} ? 'bg-green-200' : ''`}>
                                    {tableHeader.map((tblHeader) => (
                                        <td key={tblHeader} className="px-6 py-2 whitespace-nowrap text-sm">
                                            {tblBody[tblHeader]}
                                        </td>
                                    ))}

                                    <td className="px-6 py-2 whitespace-nowrap">    
                                        <button title="Add Modules" type="button" onClick={() => openModal(tblBody.user_id)}>
                                            {/* <span>ADD</span> */}
                                            <svg fill="none" stroke="currentColor" className="h-4 w-4" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                )}
            </>
        )
    }

    const renderContent = () => {
        return (
            <>
                <div className="flex relative overflow-hidden h-screen">
                    <div className="absolute inset-0 w-full">
                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0`}>
                            <div className="flex justify-between py-1">
                                <Button
                                    bgColor=""
                                    btnIcon="user"
                                    onClick={() => setActiveContent("green")}
                                >
                                    New User
                                </Button>

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

                            <div className="border border-gray-300 rounded">
                                <Table 
                                    title="User List" 
                                    disableTable={true}
                                    onOpenModal={(id) => setModalId(id)}
                                >
                                    {renderTableContent()}
                                </Table>
                            </div>
                
                            <div className="flex flex-wrap py-1">
                                <div className="flex items-center justify-center flex-grow">
                                    <Pagination 
                                        currentPage={pagination.current_page} 
                                        totalPages={pagination.total_pages}
                                        // onPageChange={newPage => setCurrentPage(newPage)}
                                        onPageChange={(newPage) => handleNewPage(newPage)}
                                    />
                                </div>
                
                                <ItemPerPage className="flex flex-grow">
                                    <div className="flex items-center justify-end">
                                        <span className="mr-2 mx-2 text-gray-700 text-sm">Per Page:</span>
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
                        
                        <div className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} absolute inset-0`}>
                            <div className="flex justify-between py-2">
                                <Button
                                    paddingY="1"
                                    btnIcon="close"
                                    // onClick={() => setActiveContent("yellow")}
                                    onClick={handleCloseSlider}
                                >
                                    Close
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        bgColor="indigo"
                                        btnIcon="add"
                                        onClick={() => formRef.current.handleAddRow()}
                                    >
                                        Add Row
                                    </Button>

                                    <Button
                                        bgColor={btnSpinner ? 'disable': 'emerald'}
                                        btnIcon={btnSpinner ? 'disable': 'submit'}
                                        btnLoading={btnSpinner}
                                        onClick={() => formRef.current.handleSubmit()}
                                    >
                                        {btnSpinner ? '' : 'Submit'}
                                    </Button>
                                </div>
                            </div>

                            <Form 
                                ref={formRef} 
                                initialFields={userRegistration}
                                onSuccess={handleRefetch}
                                onCloseSlider={() => setActiveContent("yellow")}
                                onLoading={(data) => setBtnSpinner(data)}
                                onSetAlertType={(data) => setAlertType(data)}
                                onSetAlertMessage={(data) => setAlertMessage(data)}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    }

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
                    renderContent()
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