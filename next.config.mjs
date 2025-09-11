/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        WAHA_API_KEY: process.env.WAHA_API_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pps.whatsapp.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'media.whatsapp.net',
                port: '',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
