import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie'


export const psgcApi = createApi({
    reducerPath: 'psgcApi',
    baseQuery: fetchBaseQuery({
         baseUrl: "https://psgc.gitlab.io/api/"
    }),
    endpoints: (builder) => ({
        getProvinceData: builder.query({
            query: () => ({
                url: '/provinces',
                method: 'GET'
            })
        }),

        getMunicipalityData: builder.query({
            query: ({provinceCode}) => ({
                url: `/provinces/${provinceCode}/municipalities`,
                method: 'GET'
            })
        }),

        getBarangayData: builder.query({
            query: ({municipalCode}) => ({
                url: `/municipalities/${municipalCode}/barangays`,
                method: 'GET'
            })
        }),
    })
})

export const { useGetProvinceDataQuery, useGetMunicipalityDataQuery, useGetBarangayDataQuery } = psgcApi