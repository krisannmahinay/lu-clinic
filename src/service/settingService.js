import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const settingApi = createApi({
    reducerPath: 'settingApi',
    baseQuery: fetchBaseQuery({
         baseUrl: process.env.API_URL,
         prepareHeaders: (headers, {getState}) => {
            const token = getState().auth.userToken
            // console.log(token)
            if(token) {
                headers.set('authorization', `Bearer ${token}`)
                return headers
            }
         }
    }),

    endpoints: (builder) => ({
        getUserList: builder.query({
            query: () => ({
                url: '/user-list',
                method: 'GET'
            }),
            provides: ['users'],
            // keep the unused data in the cache
            keepUnusedData: true,
            // refetch data when component mounts
            refetchOnMount: true,
            // render time, before trigger the refetch
            staleTime: 60,
            // data duration before it cached after the last refetch
            cacheTime: 300,
            // prevent from cache being cleared
            keepAllData: true,
            
            // selectFromResult: (result) => result.data,
            // transformResponse: (response) => {
            //     console.log(response)
                // const filteredData = response.data.filter((item) => item !== null)
                // const uniqueData = [...new Set(filteredData)]

                // return uniqueData
            // }
        }),
        getPermissionList: builder.query({
            query: () => ({
                url: '/permission',
                method: 'GET'
            }),
            // provides: ['users'],
            // keep the unused data in the cache
            keepUnusedData: true,
            // refetch data when component mounts
            refetchOnMount: true,
            // render time, before trigger the refetch
            staleTime: 60,
            // data duration before it cached after the last refetch
            cacheTime: 300,
            // prevent from cache being cleared
            keepAllData: true,
        }),

        getModuleList: builder.query({
            query: () => ({
                url: '/module',
                method: 'GET'
            }),
            // provides: ['users'],
            keepUnusedData: true,
            refetchOnMount: true,
            staleTime: 60,
            cacheTime: 300,
            keepAllData: true,
        }),

        createUserBatch: builder.mutation({
            query: dataArray => ({
                url: '/user-bulk-registration',
                method: 'POST',
                body: dataArray
            })
        })
    })
})


export const { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery,
    useCreateUserBatchMutation 
} = settingApi