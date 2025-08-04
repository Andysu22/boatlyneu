// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Erlaubte Hostnames für <Image src="…" />
    domains: ['source.unsplash.com'],
    // Alternativ oder zusätzlich über remotePatterns:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',     // alle Pfade unter source.unsplash.com
      },
    ],
  },
  // Falls du später noch weitere Settings hast, hier einfach dran hängen:
  // reactStrictMode: true,
  // experimental: { appDir: true },
};

module.exports = nextConfig;
