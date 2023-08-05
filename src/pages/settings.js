import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useGetUserDetailsQuery } from '@/service/authService'


import AppLayout from '@/components/Layouts/AppLayout'
import Table from '@/components/Table';
import Form from '@/components/Form';
import NavTab from '@/components/NavTab';
import Card from '@/components/Card';
import SkeletonScreen from '@/components/SkeletonScreen';

const Setting = () => {
    const columnCount = 3
    const rowCount = 5
    const { data, isLoading } = useGetUserDetailsQuery()
    
    const moduleId = "settings";
    const menuGroup = "settings";

    // const arrData = Object.entries(data)
    

    const userData = [{
        name: "John Jercai Cortejo",
        email: "john@gmail.com",
        roles: "Admin",
    }]

    const userRegistration = [
        {name: 'email', type: 'email', label: 'Email', placeholder: 'Enter email'},
        {name: 'password', type: 'password', label: 'Password', placeholder: 'Enter password'},
        {
            name: 'role',
            type: 'dropdown',
            label: 'Roles',
            options: [
                {value: 'admin', label: 'Admin'},
                {value: 'user', label: 'User'}
            ]
        }
    ]

    // console.log(data)

    // Data for nav tabs
    // const settings = [
    //     {
    //         label: 'User Account', 
    //         content: <Form initialFields={userRegistration}/>, 
    //         table:true,
    //         tableTitle: "Users",
    //         tableContent: <Table data={userData}/>
    //     },
    //     {
    //         label: 'Employee', 
    //         content: "Content for Tab 2 goes here",
    //         table: false,
    //         tableTitle: "",
    //         tableContent: ""
    //     },
    //     {
    //         label: 'System', 
    //         content: "Content for Tab 3 goes here",
    //         table: false,
    //         tableTitle: "",
    //         tableContent: ""
    //     }
    // ]

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
                <Card title="User Authorization">
                    <Form initialFields={userRegistration}/>
                </Card>

                <Table data={userData}/>
            </div>

        </AppLayout>
    )
}

export default Setting