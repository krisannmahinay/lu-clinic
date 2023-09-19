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
        API_URL: 'http://localhost/api'
    },
    publicRuntimeConfig: {
        pwa: {
            manifest: "/manifest.json", 
        },
    },
}


module.exports = withPWA(nextConfig)
