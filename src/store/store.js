import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './reducers/authSlice'
import { authApi } from '../service/authService'
import { settingApi } from '../service/settingService'
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
};

const persisAuthReducer = persistReducer(persistConfig, authReducer)

export const makeStore = () => {
  const store = configureStore({
    reducer: {
        auth: persisAuthReducer,
        [authApi.reducerPath]: authApi.reducer,
        [settingApi.reducerPath]: settingApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat(
      thunk, 
      authApi.middleware,
      settingApi.middleware
    ) 
  })
  const persistor = persistStore(store)
  
  return { store, persistor }
}
