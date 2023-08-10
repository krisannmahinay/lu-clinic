import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useGetUserListQuery, useGetPermissionListQuery, useGetModuleListQuery } from '@/service/settingService'


import AppLayout from '@/components/Layouts/AppLayout'
import Table from '@/components/Table'
import Form from '@/components/Form'
import Card from '@/components/Card'
import Error from '@/components/Error'
import SkeletonScreen from '@/components/SkeletonScreen'
import AlertError from '@/components/AlertError'

const Setting = () => {
    // const columnCount = 3
    // const rowCount = 5

    const moduleId = "settings"
    const menuGroup = "settings"

    const [tableHeader, setTableHeader] = useState([])
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

    // if(isError) {
    //     return (
    //         <Error>
    //             {error.data}
    //         </Error>
    //     )
    // }

    


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

    // console.log(moduleData)

    // Data for nav tabs
    const permissionTab = [
        {
            label: 'Dashboard', 
            content: "Content for Tab 1 goes here", 
            table:true,
            tableTitle: "Users",
            tableContent: ""
        },
        {
            label: 'Inventory', 
            content: "Content for Tab 2 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        },
        {
            label: 'Settings', 
            content: "Content for Tab 3 goes here",
            table: false,
            tableTitle: "",
            tableContent: ""
        }
    ]

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
                    <Form initialFields={userRegistration}/>
                </Card>

                <Table 
                    title="User List" 
                    user={userData} 
                    permission={permissionData} 
                    module={moduleData} 
                    tableHeader={tableHeader}
                    isLoading={userListLoading}
                    />
            </div>

        </AppLayout>
    )
}

export default Setting