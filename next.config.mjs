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
            {
                protocol: 'http',
                hostname: '103.189.173.0',
            },
        ],
    },
};

export default nextConfig;
