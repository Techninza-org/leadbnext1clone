/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: "standalone"  // will be uncommented when docker is configured on server
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
            },
        ],
    },
};

export default nextConfig;
