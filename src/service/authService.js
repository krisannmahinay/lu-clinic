import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
         baseUrl: process.env.API_URL,
         prepareHeaders: (headers, {getState}) => {
            // const token = getState().auth.userToken
            const token = Cookies.get('token')
            if(token) {
                headers.set('authorization', `Bearer ${token}`)
                return headers
            }
         }
    }),
    endpoints: (builder) => ({
        getUserDetails: builder.query({
            query: () => {
                const session = Cookies.get('session');
                return {
                    url: '/user',
                    method: 'GET',
                    params: {
                        selectedDB: session 
                    }
                }
            }
        }),

        getUserModules: builder.query({
            query: (args) => {
                const session = Cookies.get('session');
                const { moduleId } = args
                return {
                    url: '/grants',
                    method: 'GET',
                    params: {
                        moduleId: moduleId,
                        selectedDB: session 
                    }
                }
            }
        }),

        getUserById: builder.query({
            query: (args) => {
                const { id } = args
                return {
                    url: '/user-by-id',
                    method: 'GET',
                    params: {
                        id: id 
                    }
                }
            }
        }),

        grantUserModule: builder.mutation({
            query: dataArray => {
                console.log(dataArray)
                const session = Cookies.get('session')
                return {
                    url: '/grant-user-modules',
                    method: 'POST',
                    body: {
                        data: dataArray,
                        selectedDB: session
                    }
                }
            }
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            })
        })
    })
})

export const { 
    useGetUserDetailsQuery, 
    useGetUserByIdQuery, 
    useLogoutMutation, 
    useGetUserModulesQuery ,
    useGrantUserModuleMutation
} = authApi
// export const { authApi }