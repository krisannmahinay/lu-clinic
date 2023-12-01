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

        createBulk: builder.mutation({
            query: (args) => {
                const { actionType, data } = args
                const session = Cookies.get('session')
                let url, body
                switch(actionType) {
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

                    default:
                        break
                }
                return {
                    url: url,
                    method: 'POST',
                    body: body
                }
            }
        })
    })
})


export const { 
    useGetUserListQuery, 
    useGetPermissionListQuery, 
    useGetModuleListQuery,
    useCreateUserBatchMutation,
    useCreateBulkMutation,
    useGetBedListQuery,
    useGetBedFloorListQuery,
    useGetBedTypeListQuery,
    useGetBedGroupListQuery
} = settingApi