import React from "react";
import { useRouter } from 'next/router'

const SystemError = ({message}) => {
    const router = useRouter()
    const handleClick = () => {
        router.back()
        // console.log(router.pathname)
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="max-w-md px-6 py-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800">401 Unauthorized</h1>
                <p className="mt-4 text-gray-600">
                Oops! You are not authorized to access this page.
                </p>
                <button onClick={handleClick} className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                    Go Back to Login
                </button>
            </div>
        </div>
    )
}


export default SystemError;