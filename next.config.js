// next.config.js
/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';
// Get repository name for GitHub Pages, default to empty if not in GH Actions
const repoName = isProd && process.env.GITHUB_REPOSITORY
    ? process.env.GITHUB_REPOSITORY.split('/')[1]
    : '';

const basePath = repoName ? `/${repoName}` : ''; // e.g., /hyundai or empty
const assetPrefix = repoName ? `/${repoName}/` : ''; // e.g., /hyundai/ or empty (note the trailing slash)

const nextConfig = {
    output: 'export',
    basePath: basePath,
    assetPrefix: assetPrefix,
    images: {
        unoptimized: true,
    },
    // Make basePath easily accessible in client-side JS for manually prefixing paths
    env: {
        NEXT_PUBLIC_BASE_PATH: basePath,
    },
    // trailingSlash: true, // Optional, but can sometimes help with static site pathing
};

module.exports = nextConfig;