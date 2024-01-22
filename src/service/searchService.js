import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const searchApi = createApi({
    reducerPath: 'searchApi',
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
        search: builder.query({
            query: (args) => {
                const { keywords, searchModel, items, page } = args
                return {
                    url: `/search?q=${keywords}`,
                    method: 'GET',
                    params: {
                        type: searchModel,
                        // items: items,
                        // page: page
                    }
                }
            }
        })
    })
    
})

export const { useSearchQuery } = searchApi