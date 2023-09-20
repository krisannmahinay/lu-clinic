import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'

export const patientApi = createApi({
    reducerPath: 'patientApi',
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
        autoSaveData: builder.mutation({
            query: dataArray => {
                // const data = dataArray.map(item => item.fields)
                console.log(dataArray)
                const session = Cookies.get('session')
                return {
                    url: '/auto-save',
                    method: 'POST',
                    body: {
                        // data: data,
                        selectedDB: session
                    }
                }
            }
        })
    })
})

export const { useAutoSaveDataMutation } = patientApi