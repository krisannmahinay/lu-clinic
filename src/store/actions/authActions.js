// import axios from 'axios';
import axios from 'axios';
import Cookies from 'js-cookie';
import { createAsyncThunk } from '@reduxjs/toolkit'

export const userLogin = createAsyncThunk(
    'auth/userLogin',
    async ({...props}, {rejectWithValue}) => {
        try {
            const config = {
                headers: {'Content-Type': 'application/json'}
            }

            const { data } = await axios.post(
                `${process.env.API_URL}/login`, props, config
            ) 
            console.log(data.token)
            Cookies.set('isLoggedIn', data.loggedIn)
            Cookies.set('token', data.token)
            return data
        } catch(err) {
            if (err.response && err.response.data.message) {
                return rejectWithValue(err.response.data.message)
            } else {
                return rejectWithValue(err.message)
            }
        }
    }
)
