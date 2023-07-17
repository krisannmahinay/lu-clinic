import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice';
import { authApi } from '../service/authService'

// const initialState = {};

// const middleWare = [thunk];

const store = configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware) 
}); 

export default store;