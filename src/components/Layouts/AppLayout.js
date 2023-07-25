import { useEffect, useState } from 'react'
import Navigation from '../../components/Layouts/Navigation'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from 'react-query';
import { setCredentials } from '../../store/reducers/authSlice'
import { useGetUserDetailsQuery } from '../../service/authService'
import store from '../../store/store'
import SystemError from '../SystemError'

const AppLayout = ({ header, children, moduleId }) => {
    const router = useRouter()
    const dispatch = useDispatch()

    const { isLoggedIn, loading } = useSelector((state) => state.auth)
    const { data } = useGetUserDetailsQuery()
    
    if(!isLoggedIn) {
        return <SystemError />
    }

    return <Navigation user={data} moduleId={moduleId} children={children} />
}

export default AppLayout

