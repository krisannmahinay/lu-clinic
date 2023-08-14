import SystemError from '@/components/SystemError'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

const withAuth = (WrappedContent) => {
    return (props) => {
        const data = useSelector((state) => state.auth)
        // console.log(data)
        const router = useRouter()

        if(data.loading) {
            if(!data.success) {
                router.push('/login')
            }
            // return null
            if(data.error) {
                return <SystemError />
            }
        } 

        return <WrappedContent {...props}/>
    }
}


export default withAuth