import SystemError from '@/components/SystemError'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const withAuth = (WrappedContent) => {
    return (props) => {
        const { data, loading, isLoggedIn, success } = useSelector((state) => state.auth)
        // const { loading, success, isLoggedIn } = data
        const router = useRouter()


        // console.log(data)
        // if(!isLoggedIn) {
        //     router.push('/login')

        //     if(!success) {
        //         return <SystemError />
        //     }
        // }
        
        return <WrappedContent {...props}/>
            
    }
}


export default withAuth