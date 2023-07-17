import 'tailwindcss/tailwind.css'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { useDispatch, useSelector } from 'react-redux'
import { makeStore } from '../store/store'
import { useEffect } from 'react'

export default function App ({Component, pageProps}) {
    const { store, persistor } = makeStore()

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Component {...pageProps}/>
            </PersistGate>
        </Provider>
    )
}
 