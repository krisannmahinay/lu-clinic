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

    
    const { data: userDetails, isError: dataError, refetch: refetchUserDetails } = useGetUserDetailsQuery()

    const userData = userList?.userList ?? []
    const pagination = userList?.pagination ?? []
    const permissionData = permission?.permission ?? []
    const moduleData = moduleList?.moduleList ?? []
    const user = userDetails?.data[0] ?? []

    useEffect(() => {
        if(userSuccess && Array.isArray(userData) && userData.length > 0) {
            const headers = Object.keys(userData[0])
            setTableHeader(headers)
            // setItemsPerPage(prev => prev + 1)
        }
    }, [userSuccess, userData])

    console.log(user)

    const handleSearch = (q) => {
        setSearchQuery(q)
    }

    // const handleOpenModal = (data) => {
    //     setModalId(data)
    // }

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
                {/* <Card title="Create User">
                    <Form 
                        initialFields={userRegistration}
                        addUserBtn={true}
                        onSucess={handleRefetch}
                    />
                </Card> */}
                
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
                    slug={moduleId} 
                    isOpen={isModalOpen} 
                    onClose={closeModal}
                    initialFields={userRegistration}
                    addUserBtn={true}
                    openId={modalId}
                    onSuccess={handleRefetch}
                    onSetAlertType={(data) => setAlertType(data)}
                    onSetAlertMessage={(data) => setAlertMessage(data)}
                    // permission={permission} 
                    // selectedRowId={selectedRows}
                />
                
                {(user.roles === "x" || user.roles === "admin" ||  user.roles === "superadmin") && (
                    <>
                        <SearchItemPage
                            onExportToPDF={handleExportToPDF}
                            onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                            onCurrentPage={(page) => handleCurrentPage(page)}
                            // onSearchResults={(results) => handleSearchResults(results)}
                            onSearch={(q) => handleSearch(q)}
                            onAddClicked={() => setIsModalOpen(true)}
                        />

                        <Table 
                            title="User List" 
                            user={userData} 
                            action={true}
                            permission={permissionData} 
                            module={moduleData} 
                            tableHeader={tableHeader}
                            isLoading={userListLoading}
                            onOpenModal={(id) => setModalId(id)}
                        />

                        <Pagination 
                            currentPage={pagination.currentPage} 
                            totalPages={pagination.totalPages}
                            // onPageChange={newPage => setCurrentPage(newPage)}
                            onPageChange={(newPage) => handleNewPage(newPage)}
                        />
                    </>
                )} 

                {(user.roles === "nurse" || user.roles === "doctor") && (
                    <>
                        <ProfileInformation information={user}/>
                    </>
                )} 

                
            </div>


        </AppLayout>
    )
}

export default withAuth(Setting)