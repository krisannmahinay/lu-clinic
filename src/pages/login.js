// import InputError from '../components/InputError'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

import GuestLayout from '@/components/Layouts/GuestLayout'
import AlertError from '@/components/AlertError'
import Card from '@/components/Card'
import Form from '@/components/Form'
import { userLogin } from '@/store/actions/authActions'
import SystemError from '@/components/SystemError'

export default function Login() {
    // const isLoggedIn = Cookies.get('isLoggedIn')
    const router = useRouter()
    const dispatch = useDispatch()
    const { loading, userInfo, error, success, isLoggedIn } = useSelector((state) => state.auth)
    // const useData = useSelector((state) => state.auth)
    // const [ loginData, setLoginData ] = useState(useData)

    // useEffect(() => {
    //     setLoginData(useData)
    // }, [useData])

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [shouldRemember, setShouldRemember] = useState(false)
    // const [errors, setErrors] = useState([])
    // const [loginErrors, setLoginErrors] = useState("")
    // const [status, setStatus] = useState(null)
    // const [alert, setAlert] = useState(false)

    // console.log(isLoggedIn)

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(userLogin({email, password}))
    }

    // if(isLoggedIn) {
    //     router.push('/dashboard')
    // } 


    return (
        <GuestLayout>
            <div className='flex items-center justify-center h-[80vh] '>
                {error && (<AlertError initState={false} message={error}/>)}
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
                                required
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
                                required
                            />
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            type="submit">
                            {/* {loading ? 'Loading' : 'Login'} */}  Login
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    )
} 