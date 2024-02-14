/** @type {import('next').NextConfig} */
// const getConfig = require('next/config')

const runtimeCaching = require('next-pwa/cache')  
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    // scope: '/',
    // sw: 'service-worker.js',
    // dynamicStartUrl: false,
})

const nextConfig = {
    reactStrictMode: false,
    env: {
        // NEXT_SOCKET_IO: 'http://127.0.0.1:6001',
        NEXT_ENV: 'development',
        API_URL: 'http://188.166.190.177/api',
        NEXT_PUBLIC_PUSHER_APP_KEY: '1bfa0e4b900a03079829',
        NEXT_PUBLIC_PUSHER_APP_CLUSTER: 'ap1',
        NEXT_PUBLIC_WS_HOST: 'ws-ap1.pusher.com',
        NEXT_PUBLIC_WS_PORT: 6001,
        NEXT_PUBLIC_WSS_PORT: 443

        // NEXT_PUBLIC_PUSHER_APP_KEY: 'ws@dmin123',
        // NEXT_PUBLIC_PUSHER_APP_CLUSTER: 'ws1',
        // NEXT_PUBLIC_WS_HOST: 'localhost:6001',
        // NEXT_PUBLIC_WS_PORT: 6001,
        // NEXT_PUBLIC_WSS_PORT: 443
    },
    publicRuntimeConfig: {
        pwa: {
            manifest: "/manifest.json"
        },
    },
}


module.exports = withPWA(nextConfig)
