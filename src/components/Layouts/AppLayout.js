import { useEffect, useState } from 'react'
import Navigation from '../../components/Layouts/Navigation'
import { useAuth, GetUsers } from '../../hooks/auth'
import { useRouter } from 'next/router'
import AuthMiddleware from '../../lib/auth'
import Cookies from 'js-cookie';
import { redirect } from 'next/dist/server/api-utils'
import SystemError from '../SystemError'

const AppLayout = ({ header, children }) => {
    const router = useRouter()
    // const { user } = useAuth({ middleware: 'auth', })
    const { user } = GetUsers({path: '/api/user'})
    const restrictedUrl = ('/dashboard')
    const loggedIn = Cookies.get('loggedIn');
    const test = AuthMiddleware(loggedIn, restrictedUrl)
    console.log(loggedIn)
    // useEffect(() => {
    //     !user && router.push('/login')
    // }, [])
    // const [navMenu, setNavMenu] = useState([])
    
    // if(user) {
    //     const menu = JSON.parse(user.menus)
    //     // console.log(menu.Appointments.show)
    //     // setNavMenu(menu)
    // }
    // let menus = Object.keys(user.menus)
    
    // if(user) {
    //     const menu = JSON.parse(user.menus)
    //     console.log(menu)
    // }

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <Navigation user={user} child={children} />
            </div>  
        </>
    )
}

export default AppLayout