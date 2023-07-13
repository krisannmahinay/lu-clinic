import useSWR, { mutate } from 'swr';
import axios from '../lib/axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


export const GetUsers = ({path} = {}) => {
    const fetcher = async (url) => {
        try {
            const res = await axios.get(url)
            return res.data
        } catch(err) {
            console.log(err)
        }
    }

    const { data: user, error, mutate } = useSWR(`${path}`, fetcher)

    const logout = async () => {
        if (!error) {
            await axios.post('/api/logout').then(() => mutate())
        }
        window.location.pathname = '/login'
    }

    return { user, logout }
}

export const useAuth = ({middleware, redirectIfAuthenticated} = {}) => {
    const router = useRouter()
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    // const Axios = axios()

    
    // console.log(path)
    // const { data: user, error, mutate } = useSWR('/api/user', () => 
    //     axios
    //         .get('/api/user')
    //         .then((res => res.data))
    //         .catch(err => {
    //             console.log(err)
    //             // if(err.response.status !== 409) throw error

    //             // router.push('/verify-email')

    //             // if (err.response.status !== 422) throw error

    //             // setErrors(err.response.data.errors)
    //         })
    // )

    // const fetcher = (url) => axios.get(url).then((res)=>res.data)
    
    
    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const login = async({ setLoginErrors, setErrors, setStatus, ...props}) => {
        await csrf()
        
        setErrors([])
        setStatus(null)
        setLoginErrors("")

        axios
            .post('/api/login', props)
            .then((res) => {
                const { token, loggedIn } = res.data
                Cookies.set('token', token)
                Cookies.set('loggedIn', loggedIn)
                window.location.pathname = '/dashboard'
            })
            .catch(err => {
                if(err.response.status === 400) {
                    setLoginErrors(err.response.data.message)
                    
                    // let errList = ``;
                    // let fields = Object.keys(err.response.data)
                    // fields.forEach((field) => {
                    //     let errorArr = err.response.data[field]
                    //     errList = errorArr
                    // })
                    // // console.log(errList)
                }  
            })
    }

    

    // useEffect(() => {
    //     if (middleware === 'guest' && redirectIfAuthenticated && user) {
    //         router.push(redirectIfAuthenticated)
    //     }
    //         // console.log(user)
    //     // if (
    //     //     window.location.pathname === '/verify-email' &&
    //     //     user?.email_verified_at
    //     // )
    //     //     router.push(redirectIfAuthenticated)
    //     if (middleware === 'auth' && error) logout()
    //     // console.log(user)
    // }, [user, error])

    return {
        // user,
        // register,
        login,
        // forgotPassword,
        // resetPassword,
        // resendEmailVerification,
        // logout
    }

    // const register = async({setErrors, ...props}) => {
    //     await csrf()

    //     setErrors([])
    //     axios
    //         .post('/register', props) 
    //         .then(() => mutate())
    //         .catch(err => {
    //             if (err.response.status !== 422) throw error

    //             setErrors(err.response.data.errors)
    //         })
    // }

    // const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    //     await csrf()

    //     setErrors([])
    //     setStatus(null)

    //     axios
    //         .post('/reset-password', { token: router.query.token, ...props })
    //         .then(response =>
    //             router.push('/login?reset=' + btoa(response.data.status)),
    //         )
    //         .catch(err => {
    //             if (err.response.status !== 422) throw error

    //             setErrors(err.response.data.errors)
    //         })
    // }

    // const forgotPassword = async ({ setErrors, setStatus, email }) => {
    //     await csrf()

    //     setErrors([])
    //     setStatus(null)

    //     axios
    //         .post('/forgot-password', { email })
    //         .then(response => setStatus(response.data.status))
    //         .catch(err => {
    //             if (err.response.status !== 422) throw error

    //             setErrors(err.response.data.errors)
    //         })
    // }

    // const resendEmailVerification = ({ setStatus }) => {
    //     axios
    //         .post('/email/verification-notification')
    //         .then(response => setStatus(response.data.status))
    // }

    
}