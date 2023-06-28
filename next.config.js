/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     swcMinify: true,
// }

module.exports = {
    async rewrites() {
        return [
            {
                source: '/pages/api/:path*',
                destination: `http://localhost/api/:path*`
            }
        ]
    },
    env: {
        API_URL: 'http://localhost/api',
        CSRF: 'http://localhost/sanctum/csrf-cookie'
    }
}
