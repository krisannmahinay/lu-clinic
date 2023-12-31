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

const EmergencyRoom = () => {
    const menuGroup = "dashboard"
    const moduleId = "emergency-room"
    const authToken = Cookies.get('token')
    const [contentHeight, setContentHeight] = useState(0)
    const [pageTitle, setPageTitle] = useState("")
    const { 
        isLoading: moduleListLoading, 
        refetch: refetchModules, 
        isError, isSuccess 
    } = useGetModuleListQuery({},{
        enabled: !!authToken
    })

    const formatTitlePages = (str) => {
        return str
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ')
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


    return (
        <AppLayout
            isLoading={moduleListLoading}
            moduleId={moduleId}
            menuGroup={menuGroup}>
            <Head>
                <title>{pageTitle}</title>
            </Head>

            <div className="relative overflow-x-hidden" style={{ height: `${contentHeight}px` }}>
                <div className="p-8 pt-[5rem]">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3>Youre logged in!</h3>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default withAuth(EmergencyRoom)