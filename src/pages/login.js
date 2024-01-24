// import InputError from '../components/InputError'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'

import GuestLayout from '@/components/Layouts/GuestLayout'
import Alert from '@/components/Alert'
import Card from '@/components/Card'
import Form from '@/components/Form'
import { userLogin } from '@/store/actions/authActions'
import SystemError from '@/components/SystemError'
import { useLoginMutation } from '@/service/loginService'

import { 
    useLogoutMutation, 
    useGetUserModulesQuery, 
    useGetUserDetailsQuery 
} from '@/service/authService'
import { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery 
} from '@/service/settingService'
import Button from '@/components/Button'

const options = [
    { label: 'Lu Clinic', value: 'db_lu' },
    { label: 'Vital Clinic', value: 'db_vital' }
]

export default function Login() {
    const router = useRouter()
    const dispatch = useDispatch()
    
    const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation()

    // const { refetch: refetchModules } = useGetModuleListQuery()
    // const { refetch: refetchUserDetails } = useGetUserDetailsQuery()
    
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState([])
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [database, setDatabase] = useState(options[0])
    const [btnSpinner, setBtnSpinner] = useState(false)
    const [contentHeight, setContentHeight] = useState(0)
    const selectedDB = database.value
    
    // const [shouldRemember, setShouldRemember] = useState(false)
    // const [status, setStatus] = useState(null)
    useEffect(() => {
        if(isLoading) {
            setBtnSpinner(true)
        }

        let spinnerTimer
        if(btnSpinner) {
            spinnerTimer = setTimeout(() => {
                setBtnSpinner(false)
            }, 500)
        }

        const calculateHeight = () => {
            const windowHeight = window.innerHeight
            setContentHeight(windowHeight)
        }
        calculateHeight()

        // Recalculate height on window resize
        window.addEventListener('resize', calculateHeight)

        return () => {
            if(spinnerTimer) {
                clearTimeout(spinnerTimer)
            }
            window.removeEventListener('resize', calculateHeight)
        }
    }, [btnSpinner])

    const handleAlertClose = () => {
        setAlertMessage([])
        setAlertType("")
    }

    const handleChange = (event) => {
        const value = event.target.value;
        const selected = options.find(option => option.value === value);
        setDatabase(selected)
        // onSelectedChange(selected);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await login({email, password, selectedDB})
            // const res = await login({email, password})
            if(!res.data && !res.data.token) {
                throw new Error("Token not found in response")
            }

            
            Cookies.set('token', res.data.token)
            Cookies.set('session' ,res.data.session)
            // Cookies.set('icd_token', res.data.icd_token)
            
            localStorage.setItem('isLoggedIn', 'true')
            router.push('/dashboard')
        } catch(error) {
            console.log(error)
            setAlertType("error")
            setAlertMessage("Invalid Credentials")
        }
    }

    // console.log()

    return (
        <GuestLayout>
            {/* {alertMessage &&
                <Alert 
                    alertType={alertType}
                    isOpen={alertType !== null}
                    onClose={handleAlertClose}
                    message={alertMessage} 
                    duration={3000}
                /> 
            } */}
            <div className="flex justify-center">
                <div className="pt-20">
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xs uppercase font-medium mb-2" htmlFor="email">Email</label>
                            <input 
                                className="border border-gray-300 font-sm px-3 py-2 focus:border-gray-500 focus:outline-none w-full" 
                                id="email" 
                                type="email" 
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-xs uppercase font-medium mb-2" htmlFor="password">Password</label>
                            <input 
                                className="border border-gray-300 font-sm px-3 py-2 focus:border-gray-500 focus:outline-none w-full" 
                                id="password" 
                                type="password" 
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-xs uppercase font-medium mb-2" htmlFor="password">Database</label>
                            <select 
                                value={database.value}
                                onChange={handleChange}
                                className="border border-gray-300 font-sm px-3 py-2 focus:border-gray-500 focus:outline-none w-full"
                            >
                                {options.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5.293 9.293L10 14.586l4.707-4.293a.999.999 0 111.414 1.414l-5 5a.997.997 0 01-1.414 0l-5-5a.999.999 0 111.414-1.414z"/>
                                </svg>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                bgColor={btnSpinner ? 'disable': 'blue'}
                                btnIcon={btnSpinner ? 'disable': 'submit'}
                                btnLoading={btnSpinner}
                                onClick={(e) => handleSubmit(e)}
                            >
                                {btnSpinner ? '' : 'Login'}
                            </Button>

                            {/* <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="submit">
                                        Login
                            </button> */}
                        </div>
                    </form>
                    
                    <p className="text-center text-gray-600 text-xs py-3">&copy; 2023. All rights reserved.</p>
                </div>
            </div>
        </GuestLayout>
    )
} 