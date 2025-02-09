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
    tagTypes: ['UpdateOPDtoLatest', 'ActiveBedList'],
    endpoints: (builder) => ({
        autoSaveData: builder.mutation({
            query: (args) => {
                const session = Cookies.get('session')
                const { data, patient_id, actionType } = args
                // const data = dataArray.map(item => item.fields)
                // console.log(dataArray)
                console.log(data)
                return {
                    url: `/auto-save/${patient_id}`,
                    method: 'PUT',
                    body: {
                        data: data,
                        actionType: actionType,
                        selectedDB: session
                    }
                }
            }
        }),

        getNurseNoteList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { patient_id } = args
                return {
                    url: '/get-nurse-note',
                    method: 'GET',
                    params: {
                        slug: 'nurse-note',
                        selectedDB: session,
                        patient_id: patient_id
                    }
                }
            }
        }),

        getErPatientList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, items, page, slug } = args
                return {
                    url: '/er-list',
                    method: 'GET',
                    params: {
                        q: keywords,
                        slug: slug,
                        items: items,
                        page: page,
                        sort: 'created_at',
                        selectedDB: session
                    }
                }
            }
        }),

        getDetailById: builder.query({
            query: (args) => {
                const { user_id } = args
                const session = Cookies.get('session')
                return {
                    url: '/get-detail-by-id',
                    method: 'GET',
                    params: {
                        selectedDB: session,
                        user_id: user_id,
                        slug: 'detail-information',
                    }
                }
            },
        }),

        getPatientList: builder.query({
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
            },
            providesTags: ['UpdateOPDtoLatest']
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

        getImgResultList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, items, page, patient_id, slug } = args
                return {
                    url: '/get-imaging-result',
                    method: 'GET',
                    params: {
                        slug: slug,
                        patient_id: patient_id,
                        sort: 'created_at',
                        selectedDB: session
                    }
                }
            }
        }),

        getLabResultList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, items, page, patient_id, slug } = args
                return {
                    url: '/get-lab-result',
                    method: 'GET',
                    params: {
                        slug: slug,
                        patient_id: patient_id,
                        sort: 'created_at',
                        selectedDB: session
                    }
                }
            }
        }),

        getRadiologyList: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-radiology',
                    method: 'GET',
                    params: {
                        slug: 'radiology',
                        selectedDB: session
                    }
                }
            }
        }),

        getRadiologyCategoryList: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-radiology-category',
                    method: 'GET',
                    params: {
                        slug: 'radiology-category',
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

        getSymptomList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, items, page, tabs } = args
                return {
                    url: '/get-symptoms',
                    method: 'GET',
                    params: {
                        q: keywords,
                        items: items,
                        page: page,
                        sort: 'created_at',
                        slug: 'symptoms',
                        tabs: tabs,
                        selectedDB: session
                    }
                }
            }
        }),

        getMedicineList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, patient_id } = args
                return {
                    url: '/get-medicine',
                    method: 'GET',
                    params: {
                        q: keywords,
                        // patient_id: patient_id,
                        slug: 'medicine',
                        selectedDB: session
                    }
                }
            } 
        }),

        getFilteredMedicineList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, items, page, tabs } = args
                return {
                    url: '/get-medicine',
                    method: 'GET',
                    params: {
                        q: keywords,
                        items: items,
                        page: page,
                        sort: 'created_at',
                        slug: 'medicine-filter',
                        tabs: tabs,
                        selectedDB: session
                    }
                }
            }
        }),

        getMedicineFormList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, items, page } = args
                return {
                    url: '/get-medicine',
                    method: 'GET',
                    params: {
                        q: keywords,
                        items: items,
                        page: page,
                        sort: 'created_at',
                        slug: 'medicine-form',
                        selectedDB: session
                    }
                }
            }
        }),

        getMedicineFrequencyList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, items, page } = args
                return {
                    url: '/get-medicine',
                    method: 'GET',
                    params: {
                        q: keywords,
                        items: items,
                        page: page,
                        sort: 'created_at',
                        slug: 'medicine-frequency',
                        selectedDB: session
                    }
                }
            }
        }),

        getMedicationList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { keywords, patient_id } = args
                return {
                    url: '/get-medication',
                    method: 'GET',
                    params: {
                        patient_id: patient_id,
                        slug: 'medication',
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
    useGetSymptomListQuery,
    useGetDetailByIdQuery,
    useGetErPatientListQuery,
    useGetMedicineFormListQuery,
    useGetMedicineFrequencyListQuery,
    useGetFilteredMedicineListQuery,
    useGetNurseNoteListQuery,
    useAutoSaveDataMutation, 
    useGetPatientListQuery,
    useGetOutPatientListQuery,
    useGetPhysicianListQuery,
    useGetPhysicianChargeQuery,
    useGetRadiologyListQuery,
    useGetRadiologyCategoryListQuery,
    useGetPathologyListQuery,
    useGetPathologyCategoryListQuery,
    useGetMedicationListQuery,
    useGetIcd10ListQuery,
    useGetActiveBedListQuery,
    useGetImgResultListQuery,
    useGetLabResultListQuery,
    useGetMedicineListQuery
} = patientApi