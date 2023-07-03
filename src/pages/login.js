'use client'

import AuthSessionStatus from '../components/AuthSessionStatus'
import InputError from '../components/InputError'
import { useEffect, useState } from 'react' 
import { useAuth } from '../hooks/auth'
import { useRouter } from 'next/router'
// import { csrf } from '../../helper/csrf';

export default function Login() {
    const router = useRouter()
    const { login } = useAuth({
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (router.query.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.query.reset))
        } else {
            setStatus(null)
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        login({
            email,
            password,
            // remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <div className='flex items-center justify-center h-screen bg-gray-100'>
            <div className="bg-white p-8 rounded shadow-md">
                <AuthSessionStatus className="mb-4" status={status} />
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input 
                            className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-slate-400" 
                            id="email" 
                            type="email" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <InputError messages={errors.email} className="mt-2" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input 
                            className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-slate-400" 
                            id="password" 
                            type="password" 
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <InputError messages={errors.password} className="mt-2" />
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
} 