import Head from 'next/head'
import Link from 'node_modules/next/link'
import ApplicationLogo from '../ApplicationLogo'
import Cookies from 'js-cookie'

const GuestLayout = ({ children }) => {
    
    const imgSrc = "https://i.imgur.com/bqRsTjB.png"
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return (
        <div>
            <Head>
                <title>Laravel</title>
            </Head>

            <div className="bg-gray-100">
                <header className="bg-blue-500 text-white sticky top-0 z-50">
                    <div className="container mx-auto p-4 flex items-center justify-between">
                        <div>
                            <Link href="/">
                                <ApplicationLogo image={imgSrc} className="block h-10 w-auto fill-current text-white" />
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 py-2">
                            <nav>
                                <a href="/" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">Home</a>
                                <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">About Us</a>
                                <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">News</a>
                                <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">Services</a>
                                <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">Doctors</a>
                                <a href="#" className="text-sm uppercase rounded-full hover:text-blue-700 hover:bg-white px-4 py-2">Contact Us</a>
                            </nav>
                            {isLoggedIn ? (
                                <Link href="/dashboard" className="text-sm uppercase bg-white text-blue-500 hover:text-blue-700 py-4 px-8 rounded-full font-medium transition duration-300">
                                    Dashboard
                                </Link>
                            ): (
                                <Link href="/login" className="text-sm uppercase bg-white text-blue-500 hover:text-blue-700 py-4 px-8 rounded-full font-medium transition duration-300">
                                    Login
                                </Link>
                            )}
                            
                        </div>
                    </div>
                </header>


                <div className="font-sans text-gray-900 antialiased">
                    {children}
                </div>

                <footer className="bg-gray-200 p-4 mt-8">
                    <div className="container mx-auto">
                        <p className="text-center text-gray-600">&copy; 2023. All rights reserved.</p>
                    </div>
                </footer>
            </div>
            
        </div>
    )
}

export default GuestLayout