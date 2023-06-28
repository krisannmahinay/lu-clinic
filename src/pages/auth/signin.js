'use client'

import { useState } from 'react' 
import axios from 'axios';
// import { csrf } from '../../helper/csrf';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Get the CSRF token from the meta tag
            // const csrfToken = await csrf();
            const response = await axios.post(`${process.env.API_URL}/login`, { email, password }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // 'X-CSRF-TOKEN': csrfToken,
                }
                // withC
            })
            console.log(response)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div className='flex items-center justify-center h-screen bg-gray-100'>
            <div className="bg-white p-8 rounded shadow-md">
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
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
} 