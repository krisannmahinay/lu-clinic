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

    tagTypes: ['BedList', 'FloorList', 'BedTypeList', 'BedGroupList', 'HospitalChargeList', 'HospitalChargeTypeList', 'HospitalChargeCategoryList'],
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
            // keepUnusedData: true,
            // refetchOnMount: true,
            // staleTime: 60,
            // cacheTime: 300,
            // keepAllData: true
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

        getBedList: builder.query({
            query: (args) => {
                const session = Cookies.get('session')
                const { tabs, items, page } = args
                return {
                    url: '/bed-management',
                    method: 'GET',
                    params: {
                        tabs: tabs,
                        items: items,
                        page: page,
                        sort: 'created_at',
                        selectedDB: session
                    }
                }
            },
            providesTags: ['BedList']
        }),

        getBedFloorList: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-bed-floor',
                    method: 'GET',
                    params: {
                        tabs: 'floor',
                        selectedDB: session
                    }
                }
            },
            providesTags: ['FloorList']
        }),

        getBedTypeList: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-bed-type',
                    method: 'GET',
                    params: {
                        tabs: 'type',
                        selectedDB: session
                    }
                }
            },
            providesTags: ['BedTypeList']
        }),

        getBedGroupList: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-bed-group',
                    method: 'GET',
                    params: {
                        tabs: 'group',
                        selectedDB: session
                    }
                }
            },
            providesTags: ['BedGroupList']
        }),

        getHosptlCharge: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-hosptl-charge',
                    method: 'GET',
                    params: {
                        tabs: 'hosptl-charge',
                        selectedDB: session
                    }
                }
            },
            providesTags: ['HospitalChargeList']
        }),

        getHosptlChargeType: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-hosptl-charge-type',
                    method: 'GET',
                    params: {
                        tabs: 'hosptl-charge-type',
                        selectedDB: session
                    }
                }
            },
            providesTags: ['HospitalChargeTypeList']
        }),

        getHosptlChargeCategory: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-hosptl-charge-category',
                    method: 'GET',
                    params: {
                        tabs: 'hosptl-charge-category',
                        selectedDB: session
                    }
                }
            },
            providesTags: ['HospitalChargeCategoryList']
        }),

        getNotification: builder.query({
            query: () => {
                const session = Cookies.get('session')
                return {
                    url: '/get-all-notification',
                    method: 'GET',
                    params: {
                        selectedDB: session,
                        sort: 'created_at',
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
        }),

        updateBulk: builder.mutation({
            query: (args) => {
                const { actionType, data, id } = args
                const session = Cookies.get('session')
                let url, body
                switch(actionType) {
                    case 'updateMedication':
                        url = `/update-patient-medication/${id}`,
                        body = {
                            actionType: actionType,
                            data: data,
                            selectedDB: session
                        }
                        break

                    default:
                        break
                }
                return {
                    url: url,
                    method: 'PUT',
                    body: body
                }
            }
        }),

        createBulk: builder.mutation({
            query: (args) => {
                const { actionType, data, patientId, physicianId } = args
                const session = Cookies.get('session')
                let url, body
                switch(actionType) {
                    case 'createPrescription':
                        // console.log(data)
                        url = '/create-prescription',
                        body = {
                            data: data,
                            patient_id: patientId,
                            physician_id: physicianId,
                            selectedDB: session,
                            actionType: actionType,
                        }
                        break


                    case 'createDoctorRequest':
                        url = '/create-doctor-request',
                        body = {
                            actionType: actionType,
                            // labCategory: "",
                            data: data,
                            selectedDB: session
                        }
                        break

                    case 'createUser':
                        url = '/user-bulk-registration',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break
                       
                    case 'createBedFloor':
                        url = '/create-bed-floor',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break
                    case 'createBedGroup':
                        url = '/create-bed-group',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break
                    case 'createBedType':
                        url = '/create-bed-type',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break
                    case 'createBed':
                        url = '/create-bed',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break

                    case 'createBedFloor':
                        url = '/create-bed-floor',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break

                    case 'createHosptlCharge':
                        url = '/create-hosptl-charge',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break
                        
                    case 'createHosptlChargeCat':
                        url = '/create-hosptl-charge-cat',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break

                    case 'createHosptlPhyChargeOpd':
                        url = '/create-hosptl-phy-opd',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break

                    case 'createHosptlPhyChargeEr':
                        url = '/create-hosptl-phy-er',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break

                    case 'createHosptlChargeType':
                        url = '/create-hosptl-charge-type',
                        body = {
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break

                    case 'createOutPatient':
                        url = '/create-out-patient',
                        body = {
                            // notifications
                            title: 'Newly Added Patient',
                            message: 'need for consultations',
                            action: 'admitted',
                            
                            patientType: 'new_opd',
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break

                    case 'createInPatient':
                        url = '/create-in-patient',
                        body = {
                            patientType: 'new',
                            actionType: actionType,
                            data: data.map(item => item.fields),
                            selectedDB: session
                        }
                        break

                    default:
                        break
                }
                return {
                    url: url,
                    method: 'POST',
                    body: body
                }
            },
            invalidatesTags: [
                'BedList',
                'FloorList',
                'BedTypeList',
                'BedGroupList',
                'HospitalChargeList',
                'HospitalChargeTypeList',
                'HospitalChargeCategoryList',
                'ActiveBedList',
            ],
        })
    })
})


export const { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery,
    useCreateUserBatchMutation,
    useCreateBulkMutation,
    useUpdateBulkMutation,
    useGetBedListQuery,
    useGetBedFloorListQuery,
    useGetBedTypeListQuery,
    useGetBedGroupListQuery,
    useGetHosptlChargeQuery,
    useGetHosptlChargeTypeQuery,
    useGetHosptlChargeCategoryQuery,
    useGetNotificationQuery
} = settingApi