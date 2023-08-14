/** @type {import('next').NextConfig} */
// const getConfig = require('next/config')

const runtimeCaching = require('next-pwa/cache')  
const withPWA = require('next-pwa')

module.exports = withPWA({
    pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'development',
        register: true,
        // scope: '/',
        // sw: 'service-worker.js',
        // dynamicStartUrl: false,
    },
    reactStrictMode: true,
    env: {
        API_URL: 'http://localhost/api'
    },
    publicRuntimeConfig: {
        pwa: {
            manifest: "/manifest.json", 
        },
    },
})
