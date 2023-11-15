import { useState } from 'react'
import Head from 'next/head'
import Link from 'node_modules/next/link'
import ApplicationLogo from '../ApplicationLogo'
import { DropdownMenu } from '@/components/DropdownLink'
import Dropdown from '../Dropdown'
import Cookies from 'js-cookie'

const GuestLayout = ({ children }) => {
    
    const [open, setOpen] = useState(false)
    const imgSrc = "https://i.imgur.com/bqRsTjB.png"
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

    const handleLogout = () => {

    }

    return (
        <div>
            <Head>
                <title>Laravel</title>
            </Head>

            <div className="bg-gray-100 h-[100vh]">
                <header className="bg-blue-500 text-white sticky top-0 z-50">
                    <div className="container mx-auto p-4 flex items-center justify-between md:max-[1024px]:justify-center">
                        <div>
                            <Link href="/">
                                <ApplicationLogo image={imgSrc} className="block h-10 w-auto fill-current text-white" />
                            </Link>
                        </div>

                        <div className="flex  space-x-4 py-2">
                            <div className="sm:hidden md:hidden xl:block phone:hidden">
                                <nav className="flex gap-2 items-center">
                                    <a href="/" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">Home</a>
                                    <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">About Us</a>
                                    <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">News</a>
                                    <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">Services</a>
                                    <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">Doctors</a>
                                    <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">Contact Us</a>
                                    {isLoggedIn ? (
                                        <Link href="/dashboard" className="text-sm uppercase bg-white text-blue-500 hover:text-blue-700 py-4 px-8 rounded-full font-medium transition duration-300">
                                            Dashboard
                                        </Link>
                                    ): (
                                        <Link href="/login" className="text-sm uppercase bg-white text-blue-500 hover:text-blue-700 py-4 px-8 rounded-full font-medium transition duration-300">
                                            Login
                                        </Link>
                                    )}
                                </nav>
                            </div>

                            <div className="sm:block md:block xl:hidden">
                                <Dropdown
                                    align="right"
                                    width="48"
                                    trigger={
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
                                    }>
                                    {/* Authentication */}
                                    <DropdownMenu onClick={handleLogout}>
                                        Logout
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                        
                    </div>
                </header>


                <div className="font-sans text-gray-900 antialiased">
                    {children}
                </div>

                {/* <footer className="bg-gray-200 p-4 mt-8">
                    <div className="container mx-auto">
                    </div>
                </footer> */}
            </div>
            
        </div>
    )
}

export default GuestLayout