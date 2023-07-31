/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
// const runtimeCaching = require('next-pwa/cache')  
//  ({ 
//     
// })

// const nextConfig = {
// }

module.exports = withPWA({
    env: {
        API_URL: 'http://localhost/api'
    },

    pwa: {
        dest: 'public',
        register: true,
        skipWaiting: true, 
        // scope: './',
        // sw: './src/public/service-worker.js',
        // dynamicStartUrl: false,
        // runtimeCaching,
        disable: process.env.NODE_ENV === 'development',

    },
    publicRuntimeConfig: {
        pwa: {
          manifest: "/manifest.json", 
        },
    },
    reactStrictMode: true,
}) 
