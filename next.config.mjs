/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        WAHA_API_KEY: process.env.WAHA_API_KEY,
    }
};

export default nextConfig;
