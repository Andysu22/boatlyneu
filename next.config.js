// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mwvlybenpoccthbnchns.supabase.co', // <-- deine Supabase-Storage-Domain
        pathname: '/storage/v1/object/public/**', // Pfad freigeben
      },
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig
