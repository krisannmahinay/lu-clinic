'use client'

// import InputError from '../components/InputError'
import GuestLayout from '../components/Layouts/GuestLayout'
// import AlertError from '../components/AlertError'
import { useEffect, useState } from 'react' 
// import { useAuth } from '../hooks/auth'
import AlertError from '../components/AlertError'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../store/actions/authActions'
import SystemError from '../components/SystemError'
import Cookies from 'js-cookie'

export default function Login() {
    // const isLoggedIn = Cookies.get('isLoggedIn')
    const router = useRouter()
    const { loading, userInfo, error, success, isLoggedIn } = useSelector((state) => state.auth)
    // const { loading, userInfo, error, success, userToken } = store.getState().auth
    const dispatch = useDispatch()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [shouldRemember, setShouldRemember] = useState(false)
    // const [errors, setErrors] = useState([])
    // const [loginErrors, setLoginErrors] = useState("")
    // const [status, setStatus] = useState(null)
    // const [alert, setAlert] = useState(false)



    // console.log(loading)
    // console.log(isLoggedIn)

    if(isLoggedIn) {
        router.push('/dashboard')
    } 
    


    

    // console.log(store.getState().auth)

    // if(success) {
    //     if(!isLoggedIn) {
    //         return <SystemError />
    //     } else {
    //         router.push('/dashboard')
    //     }
    // } 
    // console.log(isLoggedIn)
    // if(!isLoggedIn) {
    //     return <SystemError />
    // }
    
    // else {
    //     // console.log(error)
    //     return <SystemError />
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(userLogin({email, password}))
    }

    return (
        <GuestLayout>
            <div className='flex items-center justify-center h-screen bg-gray-100'>
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
                            {/* {loading ? 'Loading' : 'Login'} */} Login
                        </button>
                    </form>
                </div>
            </div>
        </GuestLayout>
    )
} 