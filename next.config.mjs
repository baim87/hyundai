// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Or whatever your existing config is
    // Add the images configuration here:
    images: {
        remotePatterns: [
            {
                protocol: 'https', // Or 'http' if applicable, but usually https
                hostname: 's7d1.scene7.com',
                port: '', // Usually empty for standard ports 80/443
                pathname: '/is/image/hyundai/**', // Be as specific as possible with the path
                // Using '/**' allows any path under /is/image/hyundai/
                // If all images are under /is/image/, you could use '/is/image/**'
                // If you use images from other paths on this host, add more patterns.
            },
            {
                protocol: 'https',
                hostname: 'hyundaimobil.co.id',
                port: '',
                pathname: '/**', // Match your image URL path
            },
        ],
    },
    // ... any other configurations you might have
};

export default nextConfig;