import SystemError from '@/components/SystemError'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useLoginMutation } from '@/service/loginService'
import { useGetUserDetailsQuery } from '@/service/authService'
import { useGetModuleListQuery } from '@/service/settingService'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'


const withAuth = (WrappedContent) => {
    return (props) => {
        const router = useRouter()
        const token = Cookies.get('token')
        const {status, isSuccess} = useGetUserDetailsQuery()
        // const router = useRouter()

        // useEffect(() => {
        //     if(!token) {
        //         router.replace('/login')
        //     }
        // }, [token, router])
        // return <SystemError />
        if(!token) {
            router.replace('/login')
            return null
        }
        
        return <WrappedContent {...props}/>
    }
}


export default withAuth