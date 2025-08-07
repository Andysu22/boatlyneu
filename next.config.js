// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['source.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true, // Bessere Dev-Fehlererkennung
  experimental: {},
}

module.exports = nextConfig
