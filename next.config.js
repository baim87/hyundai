// next.config.js
/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'hyundai'; // Your repository name

const nextConfig = {
    output: 'export',
    // Set basePath and assetPrefix ONLY for production builds (like on GitHub Pages)
    basePath: isProd ? `/${repoName}` : '',
    assetPrefix: isProd ? `/${repoName}/` : '', // IMPORTANT: Note the trailing slash for assetPrefix!
    images: {
        unoptimized: true, // This is correct for output: 'export'
    },
    // trailingSlash: true, // Optional: some people prefer this for static sites
};

module.exports = nextConfig;