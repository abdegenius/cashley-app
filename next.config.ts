/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'sandbox.vtpass.com',
      'vtpass.com' // If you might use production URLs later
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sandbox.vtpass.com',
        pathname: '/resources/products/**',
      },
    ],
  },
}

module.exports = nextConfig