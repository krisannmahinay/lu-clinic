import SystemError from '@/components/SystemError'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useLoginMutation } from '@/service/loginService'
import { useGetUserDetailsQuery } from '@/service/authService'
import { useGetModuleListQuery } from '@/service/settingService'

const withAuth = (WrappedContent) => {
    return (props) => {
        // const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation()
        // const { data: moduleList, isLoading: moduleListLoading} = useGetModuleListQuery()
        
        // const moduleData = moduleList?.moduleList ?? []
        const {status, isSuccess} = useGetUserDetailsQuery()
        // const router = useRouter()

        // console.log(moduleData)
        // // console.log(data)
        if(status === "fulfilled") {
            if(!isSuccess) {
                return <SystemError />
            }
        }
        
        // if(!isError) {
        // }
        
        return <WrappedContent {...props}/>
    }
}


export default withAuth