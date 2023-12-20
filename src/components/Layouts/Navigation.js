import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import styles from '../../../public/assets/css/notification.module.css'

import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
// import { logout, setModules } from '@/store/reducers/authSlice'
// import { userGrants } from '@/store/actions/authActions'
import { useLogoutMutation, useGetUserModulesQuery, useGetUserDetailsQuery } from '@/service/authService'
import withAuth from '@/pages/withAuth'

// components
import NavLink from '../Navlink'
import Module from '@/components/Module'
import Dropdown from '@/components/Dropdown'
import SystemError from '@/components/SystemError'
import { DropdownButton, DropdownNotification } from '@/components/DropdownLink'
import ApplicationLogo from '@/components/ApplicationLogo'
import ResponsiveNavLink, 
{ ResponsiveNavButton } from '@/components/ResponsiveNavLink'
import SkeletonSidebarScreen from '../SkeletonSidbarScreen'
import ProfilePicture from '../ProfilePicture'
import Notification from '../Notification'

const notifications = [
    {
        id: 1,
        userName: "John Doe",
        userImage: "https://i.imgur.com/r5pe7aJ.png",
        action: "commented on",
        description: "your post",
        time: Date.now() - 3600000, // 1 hour ago
        viewed: false,
    },
    {
        id: 2,
        userName: "John Cena",
        userImage: "https://i.imgur.com/r5pe7aJ.png",
        action: "requested",
        description: "your post",
        time: Date.now() - 3600000, // 1 hour ago
        viewed: false,
    },
    {
        id: 3,
        userName: "John Lenon",
        userImage: "https://i.imgur.com/r5pe7aJ.png",
        action: "requested",
        description: "your post",
        time: Date.now() - 3600000, // 1 hour ago
        viewed: false,
    },
    {
        id: 4,
        userName: "John Wick",
        userImage: "https://i.imgur.com/r5pe7aJ.png",
        action: "requested",
        description: "your post",
        time: Date.now() - 3600000, // 1 hour ago
        viewed: false,
    },
    {
        id: 5,
        userName: "John Brodey",
        userImage: "https://i.imgur.com/r5pe7aJ.png",
        action: "requested",
        description: "your post",
        time: Date.now() - 3600000, // 1 hour ago
        viewed: false,
    },
    
    // ... add more notifications as needed
];

const Navigation = ({ ...props }) => {
    // props: user, children, moduleId, menuGroup
    const router = useRouter()
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [notificationCount, setNotificationCount] = useState(7);
    const authToken = Cookies.get('token') 
    const [refetchAttempts, setRefetchAttempts] = useState(0)
    const [overflow, setOverflow] = useState('hidden')
    
    const [logout, { isLoading, isError, error, isSuccess }] = useLogoutMutation()
    const { 
        data: module, 
        isLoading: moduleIsLoading, 
        isFetching: moduleIsFetching,
        isError: moduleIsError, 
        refetch: moduleRefetch 
    } = useGetUserModulesQuery({
        moduleId: props.moduleId
    })

    useEffect(() => {
       if(moduleIsFetching) {
        moduleRefetch()
       }
    }, [])
    
    const { data: userData, isError: dataError, refetch: refetchUserDetails } = useGetUserDetailsQuery()

    const toggleSidebar = () => { 
        setSidebarOpen(!sidebarOpen) 
    }

    const userDetails = userData?.data[0] ?? []
    
    const elapsedTime = (time) => {
        const seconds = Math.floor((Date.now() - time) / 1000);
    
        if (seconds < 60) return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
    
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
        const weeks = Math.floor(days / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }
    
    const handleLogout = async () => {
        try {
            await logout()

            localStorage.removeItem('isLoggedIn')
            Cookies.remove('token')
            router.replace('/')
        } catch (err) {
            console.log(err)
        }
    }

    const handleClickedNotif = () => {
        
    }

    const imgSrc = "https://i.imgur.com/bqRsTjB.png"

    return (
        <>
            <aside className="bg-[#343a40] transition-transform ease-out duration-300 z-50">
                {!sidebarOpen && (
                    <div className="flex justify-between mx-auto px-4 sm:px-6 lg:px-5 h-16 border-b-2 border-b-gray-500">
                        <button className="text-white focus:outline-none" onClick={toggleSidebar}>
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 5h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                            </svg>
                        </button>
                    </div>
                )}
            </aside>

           

            <nav className={`fixed top-0 z-50 bg-white border-b border-gray-200 dark:bg-[#15803c] dark:border-gray-700 w-full`}>
                
            <img className="ml-7 top-5 absolute z-50" src="https://i.imgur.com/jCxmwrq.png" width={65} height={0} />
                <aside className={`transform max-w-xs ease-in-out duration-300 fixed top-0 left-0 z-40 w-64 h-screen pt-[3.5rem] transition-transform bg-white border-r border-gray-200 dark:bg-[#343a40] dark:border-gray-700 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-[#343a40]">
                        {props.isLoading ? (
                                <SkeletonSidebarScreen />
                        ) : (
                                <Module data={module} menuGroup={props.menuGroup}/>
                        )}
                    </div>
                </aside>

                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end ">
                            <div className="flex items-center w-full space-x-[17rem] pl-4">
                                <div></div>
                                <Link href="/">
                                    <ApplicationLogo image={imgSrc} className="block h-10 w-auto fill-current text-white" />
                                </Link>
                            </div>
                            {/* <h1 className={`text-white text-large font-small ${sidebarOpen ? 'block' : 'hidden'}`}>
                            </h1>
                            <button className="text-white focus:outline-none" onClick={toggleSidebar}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 5h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                                </svg>
                            </button> */}
                        </div>
                    
                        <div className="flex items-center">
                            <div className="hidden sm:flex sm:items-center sm:ml-6">
                                <Dropdown
                                    align="right"
                                    width="80"
                                    trigger={
                                        <div className="mr-5">
                                            <svg
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-7 w-7 text-white cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                                            </svg>


                                            {notificationCount > 0 && (
                                            <div className="absolute top-0 right-25 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                                {notificationCount}
                                            </div>
                                            )}
                                        </div>
                                    }>
                                        
                                    {notifications.map(notification => (
                                        <DropdownNotification key={notification.id} onClick={handleClickedNotif}>
                                            <div className="flex items-start p-2">
                                                <img
                                                    src={notification.userImage}
                                                    alt="User"
                                                    className="w-12 h-12 rounded-full mr-4 flex-shrink-0"
                                                />
                                                <div className="flex-grow">
                                                    <span className="font-medium">{notification.userName}</span> {notification.action}
                                                    <div className="text-gray-600">{notification.description}</div>
                                                    <div className="text-xs text-gray-500 w-full">
                                                        {elapsedTime(notification.time)}
                                                    </div>
                                                </div>
                                                {!notification.viewed && 
                                                    <div className="ml-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                                                }
                                            </div>
                                            
                                        </DropdownNotification>
                                    ))}
                                </Dropdown>
                                        
                                <Dropdown
                                    align="right"
                                    width="48"
                                    trigger={
                                        <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                            <div><ProfilePicture width={30} height={30} font={16} userDetails={userDetails}/></div>
                                            <div className="ml-1">
                                                <svg
                                                    className="fill-current h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </button>
                                    }>
                                    {/* Authentication */}
                                    <div className="divide-y divide-gray-100">
                                        <div className="px-4 py-3" role="none">
                                            <p className="text-sm text-gray-500" role="none">{userDetails?.identity?.first_name} {userDetails?.identity?.last_name}</p>
                                            <p className="text-sm font-medium text-gray-500 truncate" role="none">{userDetails?.email}</p>
                                        </div>
                                        <DropdownButton onClick={handleLogout}>
                                            Logout
                                        </DropdownButton>
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>


            <div className="sm:ml-64 top-0">
                <main>{props.children}</main>
            </div>
        </>
    )
}

export default withAuth(Navigation)