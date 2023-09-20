import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'


export const settingApi = createApi({
    reducerPath: 'settingApi',
    baseQuery: fetchBaseQuery({
         baseUrl: process.env.API_URL,
         prepareHeaders: (headers, {getState}) => {
            // const token = getState().auth.userToken
            const token = Cookies.get('token')
            // console.log(token)
            if(token) {
                headers.set('authorization', `Bearer ${token}`)
                return headers
            }
         }
    }),

    endpoints: (builder) => ({
        getUserList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, items, page } = args
                return {
                    url: '/user-list',
                    method: 'GET',
                    params: {
                        q: keywords,
                        items: items,
                        page: page,
                        sort: 'created_at',
                        selectedDB: session
                    }
                }
            },
            keepUnusedData: true,
            refetchOnMount: true,
            staleTime: 60,
            cacheTime: 300,
            keepAllData: true
        }),
        getPermissionList: builder.query({
            query: () => {
                const session = Cookies.get('session');
                return {
                    url: '/permission',
                    method: 'GET',
                    params: {
                        selectedDB: session 
                    }
                }
            }
        }),

        getModuleList: builder.query({
            query: () => {
                const session = Cookies.get('session');
                return {
                    url: '/module',
                    method: 'GET',
                    params: {
                        selectedDB: session 
                    }
                }
            }
        }),

        createUserBatch: builder.mutation({
            query: dataArray => {
                const data = dataArray.map(item => item.fields)
                const session = Cookies.get('session')
                return {
                    url: '/user-bulk-registration',
                    method: 'POST',
                    body: {
                        data: data,
                        selectedDB: session
                    }
                }
            }
        })
    })
})


export const { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery,
    useCreateUserBatchMutation
} = settingApi