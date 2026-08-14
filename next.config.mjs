// Static export for GitHub Pages. The basePath matches the repo name and is
// only applied in CI so local dev still runs at http://localhost:3000/.
const isPages = process.env.GITHUB_ACTIONS === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isPages ? "/xcerebro-voice-command-center" : "",
  eslint: {
    // Lint is not configured for this scaffold; TypeScript checking still runs on build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
