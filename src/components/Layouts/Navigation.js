import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// stores
import { useDispatch, useSelector } from 'react-redux'
import { logout, setModules } from '@/store/reducers/authSlice'
import { userGrants } from '@/store/actions/authActions'

import withAuth from '@/pages/withAuth'

// components
import NavLink from '../Navlink'
import Module from '@/components/Module'
import Dropdown from '@/components/Dropdown'
import SystemError from '@/components/SystemError'
import { DropdownButton } from '@/components/DropdownLink'
import ApplicationLogo from '@/components/ApplicationLogo'
import ResponsiveNavLink, 
{ ResponsiveNavButton } from '@/components/ResponsiveNavLink'

const Navigation = ({ ...props }) => {
    // props: user, children, moduleId, menuGroup
    
    const router = useRouter()
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [notificationCount, setNotificationCount] = useState(7);

    // state from store
    const { module, isLoggedIn } = useSelector((state) => state.auth)

    // GET MODULES
    useEffect(() => {
        dispatch(userGrants(props.moduleId))
    }, [dispatch, props.moduleId])

    const toggleSidebar = () => { 
        setSidebarOpen(!sidebarOpen) 
    }
    
    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex h-screen">
                <nav className="bg-[#343a40]">
                    {!sidebarOpen && (
                        <div className="flex justify-between mx-auto px-4 sm:px-6 lg:px-8 h-16 border-b-2 border-b-gray-500">
                            <button className="text-white focus:outline-none" onClick={toggleSidebar}>
                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 5h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                                </svg>
                            </button>
                        </div>
                    )}
                </nav>

                <div className={`w-64 bg-[#343a40] sticky top-0 left-0 transform max-w-xs transition-transform ease-in-out duration-300 shadow-xl shadow-gray-500 ${sidebarOpen ? 'block' : '-translate-x-full hidden'}`}>
                    {/* <div className="flex items-center justify-between p-6 border-l-slate-400"> */}
                    <div className="flex justify-between mx-auto px-4 sm:px-6 lg:px-8 h-16 mb-2 border-b-2 border-b-gray-500">
                        <div className="flex items-center">
                            <h1 className={`text-white text-2xl font-bold ${sidebarOpen ? 'block' : 'hidden'}`}>Logo</h1>
                        </div>

                        <button className="text-white focus:outline-none" onClick={toggleSidebar}>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 5h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                            </svg>
                        </button>
                    </div>

                    {/* <!-- Sidebar content --> */}
                    <Module data={module} menuGroup={props.menuGroup}/>
                    
                </div>

                {/* <!-- Main content --> */}
                <div className="flex-grow bg-gray-100">
                    <nav className="bg-white border-b border-gray-100">
                        <div className="mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex">
                                    {/* Logo */}
                                    <div className="flex-shrink-0 flex items-center">
                                        <Link href="/dashboard">
                                            <ApplicationLogo className="block h-10 w-auto fill-current text-gray-600" />
                                        </Link>
                                    </div>

                                </div>

                                {/* Settings Dropdown */}

                                <div className="hidden sm:flex sm:items-center sm:ml-6">
                                    <Dropdown
                                        align="right"
                                        width="48"
                                        trigger={
                                            <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                                <div className="mr-5">
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-8 w-8 text-gray-600">
                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
                                                    </svg>


                                                    {notificationCount > 0 && (
                                                    <div className="absolute top-0 right-25 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                                        {notificationCount}
                                                    </div>
                                                    )}
                                                </div>
                                                <div>{props.user?.data.name}</div>
                                                <div className="ml-1">
                                                    <svg
                                                        className="fill-current h-4 w-4"
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
                                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
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
                                                className="h-10 w-10 fill-current text-gray-400"
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
                                            <div className="font-medium text-base text-gray-800">
                                                {props.user?.name}
                                            </div>
                                            <div className="font-medium text-sm text-gray-500">
                                                {props.user?.email}
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
                    <main>{props.children}</main>
                </div>
            </div>
        </div>  
    )
}

export default Navigation