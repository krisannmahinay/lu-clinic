import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserDetailsQuery } from '@/service/authService'
// import { fetchUserDetails } from '@/store/actions/authActions'
import { useLoginMutation } from '@/service/loginService'
import Cookies from 'js-cookie'

// components
import Navigation from '@/components/Layouts/Navigation'



const AppLayout = ({ header, children, moduleId, menuGroup, isLoading }) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [loadingTime, setLoadingTime] = useState(false)
    const [userData, setUserData] = useState(null)
    const [refetchAttempts, setRefetchAttempts] = useState(0)
    

    return <Navigation menuGroup={menuGroup} isLoading={isLoading} moduleId={moduleId} children={children}/>
}

export default AppLayout

