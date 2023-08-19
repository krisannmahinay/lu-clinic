import 'tailwindcss/tailwind.css'
import Head from 'next/head'
import getConfig from "next/config"
import { useEffect, useState } from 'react'; 
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { makeStore } from '@/store/store'
import Loading from '@/components/Loading'

const { publicRuntimeConfig } = getConfig();
const { pwa } = publicRuntimeConfig || {};

export default function App ({Component, pageProps}) {
    const { store, persistor } = makeStore()
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a 2-second loading delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Adjust the delay time as needed
      }, []);

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
                <PersistGate loading={<Loading />} persistor={persistor}>
                    {/* <Component {...pageProps}/> */}
                    {isLoading ? <Loading /> : <Component {...pageProps} />}
                </PersistGate>
            </Provider>
        </>
    )
}
 