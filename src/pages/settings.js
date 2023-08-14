import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useGetUserListQuery, useGetPermissionListQuery, useGetModuleListQuery } from '@/service/settingService'


import AppLayout from '@/components/Layouts/AppLayout'
import Table from '@/components/Table'
import Form from '@/components/Form'
import Card from '@/components/Card'    
import AlertError from '@/components/AlertError'
import withAuth from './withAuth'


const Setting = () => {

    const moduleId = "settings"
    const menuGroup = "settings"
    
    const [ modalId, setModalId ] = useState("") 
    const [ tableHeader, setTableHeader ] = useState([])
    const { data: userList, isLoading: userListLoading, isError: userErr, error, isSuccess: userSuccess } = useGetUserListQuery()
    const { data: permission, isLoading: permissionListLoading, isError: permissionErr } = useGetPermissionListQuery()
    const { data: moduleList} = useGetModuleListQuery()
    

    // const isDataValid = !isError && isSuccess && data !== undefined && data !== null
    // console.log(isDataValid)

    const userData = userList?.userList ?? []
    const permissionData = permission?.permission ?? []
    const moduleData = moduleList?.moduleList ?? []

    useEffect(() => {
        if(userSuccess && Array.isArray(userData) && userData.length > 0) {
            const headers = Object.keys(userData[0])
            setTableHeader(headers)
        }
    }, [userSuccess, userData])

    const handleOpenModal = (data) => {
        setModalId(data)
    }
    


    // console.log(userData)

    const userRegistration = [
        {name: 'email', type: 'email', label: 'Email', placeholder: 'Enter email'},
        {name: 'password', type: 'password', label: 'Password', placeholder: 'Enter password'},
        // {
        //     name: 'role',
        //     type: 'dropdown',
        //     label: 'Roles',
        //     options: [
        //         {value: 'admin', label: 'Admin'},
        //         {value: 'user', label: 'User'}
        //     ]
        // }
    ]

    // console.log(moduleList)

    return (
        <AppLayout
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
                    />
                </Card>

                <Table 
                    title="User List" 
                    user={userData} 
                    permission={permissionData} 
                    module={moduleData} 
                    tableHeader={tableHeader}
                    isLoading={userListLoading}
                    onOpenModal={handleOpenModal}
                    />
            </div>

        </AppLayout>
    )
}

export default withAuth(Setting)