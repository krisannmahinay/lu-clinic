import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'

const session = Cookies.get('session')
export const pdfApi = createApi({
    reducerPath: 'pdfApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.API_URL,
        prepareHeaders: (headers, {getState}) => {
            const token = Cookies.get('token')
            // console.log(token)
            if(token) {
                headers.set('authorization', `Bearer ${token}`)
                return headers
            }
        },
        // fetchFn: async (arg, api, extraOptions) => {
        //     const response = await fetch(arg.url, {
        //       method: arg.method || 'GET',
        //       headers: arg.headers,
        //     })
            
        //     if (response.ok) {
        //       // When expecting a binary response, convert it to a blob
        //       const data = await response.blob()
        //       return { data }
        //     } else {
        //       const error = new Error('Network response was not ok.')
        //       error.status = response.status
        //       throw error
        //     }
        // },
        responseHandler: async (response) => {
            if (response.headers.get('Content-Type') === 'application/pdf') {
                return await response.blob()
            }
            return await response.json()
        },
    }),
    endpoints: (builder) => ({
        getPrescriptionPdf: builder.query({
            query: () => {
                return {
                    url: '/generatePDF',
                    method: 'GET',
                    params: {
                        selectedDB: session 
                    }
                }
            },
            // transformResponse: async (response) => {
            //     if (response instanceof Blob) {
            //         // Handle the blob (e.g., create a URL for the PDF and display it)
            //         const pdfUrl = URL.createObjectURL(response)
            //         return { pdfUrl }
            //     }
            //     return response
            // }
        }),

        // generatePdf: builder.mutation({
        //     query: () => {
        //         return {
        //             url: '/generatePDF',
        //             method: 'GET',
        //             params: {
        //                 selectedDB: session 
        //             }
        //         }
        //     },
        //     transformResponse: async (response) => {
        //         if (response instanceof Blob) {
        //             // Handle the blob (e.g., create a URL for the PDF and display it)
        //             const pdfUrl = URL.createObjectURL(response)
        //             return { pdfUrl }
        //         }
        //         return response
        //     }
        // })
    })
})

export const { /*useGeneratePdfMutation*/ useGetPrescriptionPdfQuery } = pdfApi