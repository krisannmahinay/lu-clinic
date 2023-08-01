import { configureStore } from '@reduxjs/toolkit'
<<<<<<< HEAD
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './reducers/authSlice'
import { authApi } from '../service/authService'
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    storage,
};

const persisAuthReducer = persistReducer(persistConfig, authReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: {
        auth: persisAuthReducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(thunk, authApi.middleware) 
  })
  const persistor = persistStore(store)

  return { store, persistor }
}
=======
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
>>>>>>> 8ca482b (implement reduxjs toolkit)
