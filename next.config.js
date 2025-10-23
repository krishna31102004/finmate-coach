/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [],
  },
  headers: async () => {
    return [];
  },
};

module.exports = nextConfig;
