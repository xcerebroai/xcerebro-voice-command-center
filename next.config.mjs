/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint is not configured for this scaffold; TypeScript checking still runs on build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
