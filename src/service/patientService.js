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
                // console.log(dataArray)
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
        }),
        getOutPatientList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, items, page, slug, patientType } = args
                return {
                    url: '/opd-list',
                    method: 'GET',
                    params: {
                        q: keywords,
                        slug: slug,
                        items: items,
                        page: page,
                        sort: 'created_at',
                        patientType: patientType,
                        selectedDB: session
                    }
                }
            }
        }),

        getPhysicianList: builder.query({
            query: () => {
                const session = Cookies.get('session')
                // const { items, page, patientType } = args
                return {
                    url: '/physician-list',
                    method: 'GET',
                    params: {
                        roles: 'doctor',
                        slug: 'physician',
                        sort: 'created_at',
                        selectedDB: session
                    }
                }
            }
        }),

        getPhysicianCharge: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/physician-charge',
                    method: 'GET',
                    params: {
                        slug: 'physician-charge',
                        selectedDB: session
                    }
                }
            }
        }),

        getPathologyList: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-pathology',
                    method: 'GET',
                    params: {
                        slug: 'pathology',
                        selectedDB: session
                    }
                }
            }
        }),

        getPathologyCategoryList: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-pathology-category',
                    method: 'GET',
                    params: {
                        slug: 'pathology-category',
                        selectedDB: session
                    }
                }
            }
        }),

        getMedicineList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords } = args
                return {
                    url: '/get-medication',
                    method: 'GET',
                    params: {
                        slug: 'medicine',
                        q: keywords,
                        selectedDB: session
                    }
                }
            }
        }),

        getActiveBedList: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-bed-list',
                    method: 'GET',
                    params: {
                        tabs: 'bed-list',
                        selectedDB: session
                    }
                }
            },
            providesTags: ['ActiveBedList']
        }),

        getIcd10List: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                return {
                    url: '/get-icd10',
                    method: 'GET',
                    params: {
                        slug: 'icd10',
                        selectedDB: session
                    }
                }
            }
        })
    })
})

export const { 
    useAutoSaveDataMutation, 
    useGetOutPatientListQuery,
    useGetPhysicianListQuery,
    useGetPhysicianChargeQuery,
    useGetPathologyListQuery,
    useGetPathologyCategoryListQuery,
    useGetMedicineListQuery,
    useGetIcd10ListQuery,
    useGetActiveBedListQuery
} = patientApi