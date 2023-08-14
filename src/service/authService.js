import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
         baseUrl: process.env.API_URL,
         prepareHeaders: (headers, {getState}) => {
            const token = getState().auth.userToken
            if(token) {
                headers.set('authorization', `Bearer ${token}`)
                return headers
            }
         }
    }),
    endpoints: (builder) => ({
        getUserDetails: builder.query({
            query: () => ({
                url: '/user',
                method: 'GET'
            }),
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
            refetchOnFocus: true,
            refetchOnReconnect: true,
            // refetchIntervalInBackground: 60000,
            
        })
    })
})

export const { useGetUserDetailsQuery } = authApi
// export const { authApi }