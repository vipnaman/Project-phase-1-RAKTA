/** @type {import('next').NextConfig} */
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  output: isGitHubPagesBuild ? 'export' : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  ...(isGitHubPagesBuild
    ? {}
    : {
        async rewrites() {
          const apiTarget = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

          return [
            {
              source: '/api/:path*',
              destination: `${apiTarget}/api/:path*`,
            },
          ];
        },
      }),
};

module.exports = nextConfig;
