import 'tailwindcss/tailwind.css'
import { useEffect } from 'react'; 
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStore } from '@/store/store'
import Head from 'next/head'
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig();
const { pwa } = publicRuntimeConfig || {};




export default function App ({Component, pageProps}) {
    const { store, persistor } = makeStore()

    return (
        <>
            <Head>
                <meta
                    name='viewport'
                    content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
                />
                {pwa && pwa.manifest && (
                    <link rel="manifest" href={pwa.manifest} />
                )}
            </Head>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Component {...pageProps}/>
                </PersistGate>
            </Provider>
        </>
    )
}
 