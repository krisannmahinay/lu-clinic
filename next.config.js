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
    reactStrictMode: true,
    env: {
        API_URL: 'http://localhost/api',
        NEXT_PUBLIC_PUSHER_APP_KEY: '1bfa0e4b900a03079829',
        NEXT_PUBLIC_PUSHER_APP_CLUSTER: 'ap1',
        NEXT_PUBLIC_WS_HOST: 'localhost:80',
        NEXT_PUBLIC_WS_PORT: 6001,
        NEXT_PUBLIC_WSS_PORT: 443
    },
    publicRuntimeConfig: {
        pwa: {
            manifest: "/manifest.json", 
        },
    },
}


module.exports = withPWA(nextConfig)
