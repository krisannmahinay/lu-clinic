import { useState, useEffect } from 'react'
import Head from 'next/head'
import { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery 
} from '@/service/settingService'

import { useSearchQuery } from "@/service/searchService"

import AppLayout from '@/components/Layouts/AppLayout'
import Table from '@/components/Table'
import Form from '@/components/Form'
import Card from '@/components/Card'    
import AlertError from '@/components/AlertError'
import withAuth from './withAuth'
import Pagination from '@/components/Pagination'
import SearchItemPage from '@/components/SearchItemPage'


const Setting = () => {

    const moduleId = "settings"
    const menuGroup = "settings"
    const [ modalId, setModalId ] = useState("") 
    const [ tableHeader, setTableHeader ] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5);
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

    const userData = userList?.userList ?? []
    const pagination = userList?.pagination ?? []
    const permissionData = permission?.permission ?? []
    const moduleData = moduleList?.moduleList ?? []

    useEffect(() => {
        if(userSuccess && Array.isArray(userData) && userData.length > 0) {
            const headers = Object.keys(userData[0])
            setTableHeader(headers)
        }
    }, [userSuccess, userData])

    // console.log(userData)

    const handleSearch = (q) => {
        setSearchQuery(q)
    }

    const handleOpenModal = (data) => {
        setModalId(data)
    }

    const handleNewPage = (newPage) => {
        setCurrentPage(newPage)
    }

    const handleCurrentPage = (page) => {
        setCurrentPage(page)
    }

    const handleItemsPerPageChange = (item) => {
        setItemsPerPage(item)
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

    // console.log(moduleList)

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
                {/* <AlertError message={error}/> */}

                <Card title="Create User">
                    <Form 
                        initialFields={userRegistration}
                        addUserBtn={true}
                        onSucess={(page) => handleNewPage(page)}
                    />
                </Card>

                <SearchItemPage
                    onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                    onCurrentPage={(page) => handleCurrentPage(page)}
                    // onSearchResults={(results) => handleSearchResults(results)}
                    onSearch={(q) => handleSearch(q)}
                />

                <Table 
                    title="User List" 
                    user={userData} 
                    permission={permissionData} 
                    module={moduleData} 
                    tableHeader={tableHeader}
                    isLoading={userListLoading}
                    onOpenModal={handleOpenModal}
                />

                <Pagination 
                    currentPage={pagination.currentPage} 
                    totalPages={pagination.totalPages}
                    // onPageChange={newPage => setCurrentPage(newPage)}
                    onPageChange={(newPage) => handleNewPage(newPage)}
                />
            </div>

        </AppLayout>
    )
}

export default withAuth(Setting)