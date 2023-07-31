import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserDetailsQuery } from '@/service/authService'

// components
import Navigation from '@/components/Layouts/Navigation'
import SystemError from '@/components/SystemError'
import Loading from '../Loading'



const AppLayout = ({ header, children, moduleId, menuGroup }) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [loadingTime, setLoadingTime] = useState(false)
    const [userData, setUserData] = useState(null)
    const data = useGetUserDetailsQuery()

    const { isLoggedIn, loading } = useSelector((state) => state.auth)
    
    useEffect(() => {
        if(data.isSuccess) {
            setUserData(data.data)
        }
    }, [data])
    
    console.log(loading)

    if(!isLoggedIn) {
        return <SystemError />
    }

    return <Navigation user={userData} menuGroup={menuGroup} moduleId={moduleId} children={children} />
}

export default AppLayout

