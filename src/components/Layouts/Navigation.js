import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styles from '../../../public/assets/css/notification.module.css'

import Cookies from 'js-cookie'
// stores
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

    
    const [logout, { isLoading, isError, error, isSuccess }] = useLogoutMutation()
    const { data: module, isLoading: moduleIsLoading, isError: moduleIsError, refetch: refetchUserModules } = useGetUserModulesQuery({
        moduleId: props.moduleId
    })
    
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
        
        <div className=" bg-gray-100">
            <div className="h-screen flex flex-row justify-start overflow-hidden">
                <div className="flex w-full">
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
                    
                    <aside 
                        className={`w-[15rem] sm:max-md:hidden phone:hidden bg-[#343a40] fixed h-full top-0 left-0 transform max-w-xs transition-transform ease-in-out duration-300 shadow-xl shadow-gray-500 z-50
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:max-lg:hidden md:max-lg:w-full`}
                    >
                            
                        <div className="flex justify-between mx-auto px-2 sm:px-6 lg:px-4 h-16 mb-2 border-b-2 border-b-gray-500">
                            <div className="w-full px-3 py-4">
                                {/* <h1 className={`text-white text-large font-small ${sidebarOpen ? 'block' : 'hidden'}`}>Qhealth</h1> */}
                                <img src="https://i.imgur.com/jCxmwrq.png" width={100} height={50} />
                            </div>

                            <button className="text-white focus:outline-none" onClick={toggleSidebar}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 5h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                                </svg>
                            </button>
                        </div>

                        {/* <!-- Sidebar content --> */}
                        {props.isLoading ? (
                            <SkeletonSidebarScreen />
                        ) : (
                            <Module data={module} menuGroup={props.menuGroup}/>
                        )}
                    </aside>

                    {/* <!-- Main content --> */}
                    {/* <div className={`flex-grow bg-gray-100 overflow-y-auto scroll-custom ${sidebarOpen ? 'ml-[15rem]' : 'w-full'}`}> */}
                    <div className={`flex-grow bg-gray-100 ${sidebarOpen ? 'ml-[15rem] sm:max-lg:ml-0 phone:ml-0' : 'w-full'}`}>
                        <nav className="bg-[#15803d] border-b border-gray-100 fixed w-full top-0 left-0 z-10">
                            <div className={`${sidebarOpen ? 'ml-[15rem]  phone:ml-0' : 'ml-20'} mx-auto px-4 sm:px-6`}>
                                <div className="flex justify-between h-16">
                                    <div className="flex">
                                        {/* Logo */}
                                        <div className="flex-shrink-0 flex items-center w-full">
                                            <Link href="/">
                                                <ApplicationLogo image={imgSrc} className="block h-10 w-auto fill-current text-white" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Settings Dropdown */}
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
                                                        className="h-8 w-8 text-white cursor-pointer">
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
                                                    <div><ProfilePicture width={35} height={35} font={16} userDetails={userDetails}/></div>
                                                    <div className='ml-2 text-white'>{userDetails?.identity?.first_name}</div>
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
                                            <DropdownButton onClick={handleLogout}>
                                                Logout
                                            </DropdownButton>
                                        </Dropdown>
                                    </div>

                                    {/* Hamburger */}
                                    <div className="-mr-2 flex items-center sm:hidden">
                                        <button
                                            onClick={() => setOpen(open => !open)}
                                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                                            <svg
                                                className="h-6 w-6"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 24 24">
                                                {open ? (
                                                    <path
                                                        className="inline-flex"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                ) : (
                                                    <path
                                                        className="inline-flex"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 6h16M4 12h16M4 18h16"
                                                    />
                                                )}
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            
                            {/* Responsive Navigation Menu */}
                            {open && (
                                <div className="block sm:hidden">
                                    <div className="pt-2 pb-3 space-y-1">
                                        <ResponsiveNavLink
                                            href="/dashboard"
                                            active={router.pathname === '/dashboard'}>
                                            Dashboard
                                        </ResponsiveNavLink>
                                    </div>

                                    {/* Responsive Settings Options */}
                                    <div className="pt-4 pb-1 border-t border-gray-200">
                                        <div className="flex items-center px-4">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-10 w-10 fill-current text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            </div>

                                            <div className="ml-3">
                                                <div className="font-medium text-base text-white">
                                                    {userDetails?.identity?.first_name}
                                                </div>
                                                <div className="font-medium text-sm text-white">
                                                    {userDetails.email}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 space-y-1">
                                            {/* Authentication */}
                                            <ResponsiveNavButton onClick={handleLogout}>
                                                Logout
                                            </ResponsiveNavButton>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </nav>
                        <main className="p-2 sm:p-4 lg:p-2 mt-[3rem]">{props.children}</main>
                    </div>
                </div>
                
            </div>
        </div>  
    )
}

export default withAuth(Navigation)