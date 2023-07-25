import { createSlice } from '@reduxjs/toolkit'
import { userLogin, userGrants } from '../actions/authActions'
import Cookies from 'js-cookie';
import Router from 'next/router';

// initialize userToken from cookies
const userToken = Cookies.get('token') 
    ? Cookies.get('token') 
    : null;

// console.log(userToken)

const initialState = {
    loading: false,
    userInfo: null,
    userToken,
    error: null,
    success: false,
    isLoggedIn: false,
    module: null
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            Cookies.remove('token')
            state.loading = false
            state.userInfo = null
            state.userToken = null
            state.error = null,
            state.isLoggedIn = false,
            Router.push('/')
        },
        setCredentials: (state, {payload}) => {
            state.userInfo = payload
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            // user login
            .addCase(userLogin.pending, (state) => {
                state.error = null,
                state.loading = false
                state.isLoggedIn = false
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.userInfo = action.payload
                state.userToken = action.payload.token,
                state.isLoggedIn = true
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false
                state.isLoggedIn = false
                state.error = action.payload
            })

            // catch user modules
            .addCase(userGrants.pending, (state) => {
                state.error = null,
                state.loading = false
            })
            .addCase(userGrants.fulfilled, (state, action) => {
                // console.log(action.payload)
                state.loading = false
                state.success = true
                state.module = action.payload
            })
            .addCase(userGrants.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            
    }
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer