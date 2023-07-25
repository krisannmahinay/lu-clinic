/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     swcMinify: true,
// }

module.exports = {
    env: {
        API_URL: 'http://localhost/api',
        CSRF: 'http://localhost/sanctum/csrf-cookie'
    }
}
