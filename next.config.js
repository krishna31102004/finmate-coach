/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
  headers: async () => {
    return [];
  },
};

module.exports = nextConfig;
