/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
    serverActions: true,
  },
};

module.exports = nextConfig;
