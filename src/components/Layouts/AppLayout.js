import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserDetailsQuery } from '@/service/authService'
// import { fetchUserDetails } from '@/store/actions/authActions'

// components
import Navigation from '@/components/Layouts/Navigation'



const AppLayout = ({ header, children, moduleId, menuGroup }) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [loadingTime, setLoadingTime] = useState(false)
    const [userData, setUserData] = useState(null)
    const { data, isLoading, success } = useGetUserDetailsQuery()

    // const { data, isLoggedIn, loading, success } = useSelector((state) => state.auth)
    // const data = useSelector((state) => state.auth)
    // const data = useSelector((state) => state.auth.userDetails)

    
    // console.log(data)
    return <Navigation user={data} menuGroup={menuGroup} moduleId={moduleId} children={children}/>
}

export default AppLayout

